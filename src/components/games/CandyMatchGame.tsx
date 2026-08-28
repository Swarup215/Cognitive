import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useApp } from '../../context/AppContext';
import { Sparkles, ArrowLeft, RefreshCw, Lightbulb, Trophy, Play, CheckCircle2, RotateCcw } from 'lucide-react';
import confetti from 'canvas-confetti';
import { playSwapSound, playMatchSuccessSound, playComboSound, playCelebrationFanfare } from '../../utils/audioSynth';

// 8x8 Grid Configuration
const GRID_SIZE = 8;

interface CandyType {
  id: number;
  name: string;
  emoji: string;
  color: string;
  bgGradient: string;
}

const CANDY_TYPES: CandyType[] = [
  { id: 0, name: 'Red Berry', emoji: '🍓', color: '#ef4444', bgGradient: 'from-rose-500 to-red-600' },
  { id: 1, name: 'Golden Mango', emoji: '🥭', color: '#f59e0b', bgGradient: 'from-amber-400 to-yellow-500' },
  { id: 2, name: 'Green Kiwi', emoji: '🥝', color: '#10b981', bgGradient: 'from-emerald-400 to-green-600' },
  { id: 3, name: 'Blueberry', emoji: '🫐', color: '#3b82f6', bgGradient: 'from-blue-500 to-indigo-600' },
  { id: 4, name: 'Purple Grape', emoji: '🍇', color: '#8b5cf6', bgGradient: 'from-purple-500 to-violet-600' },
  { id: 5, name: 'Pink Guava', emoji: '🌸', color: '#ec4899', bgGradient: 'from-pink-400 to-rose-500' },
];

export const CandyMatchGame: React.FC = () => {
  const { navigate, recordGameSession, t, speak } = useApp();

  const [grid, setGrid] = useState<number[][]>([]);
  const [selectedCell, setSelectedCell] = useState<{ r: number; c: number } | null>(null);
  const [score, setScore] = useState<number>(0);
  const [moves, setMoves] = useState<number>(25);
  const [level, setLevel] = useState<number>(1);
  const [targetScore, setTargetScore] = useState<number>(1000);
  const [comboMessage, setComboMessage] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [levelCompleted, setLevelCompleted] = useState<boolean>(false);
  const [gameOver, setGameOver] = useState<boolean>(false);
  const [highlightedHint, setHighlightedHint] = useState<{ r1: number; c1: number; r2: number; c2: number } | null>(null);

  const startTimeRef = useRef<number>(Date.now());
  const matchesMadeRef = useRef<number>(0);
  const totalSwapsRef = useRef<number>(0);

  // Helper to generate a fresh 8x8 grid without initial 3-matches
  const createFreshGrid = useCallback(() => {
    let newGrid: number[][] = [];
    for (let r = 0; r < GRID_SIZE; r++) {
      newGrid[r] = [];
      for (let c = 0; c < GRID_SIZE; c++) {
        let possibleCandies = [0, 1, 2, 3, 4, 5];
        // Avoid initial horizontal 3-matches
        if (c >= 2 && newGrid[r][c - 1] === newGrid[r][c - 2]) {
          possibleCandies = possibleCandies.filter(id => id !== newGrid[r][c - 1]);
        }
        // Avoid initial vertical 3-matches
        if (r >= 2 && newGrid[r - 1][c] === newGrid[r - 2][c]) {
          possibleCandies = possibleCandies.filter(id => id !== newGrid[r - 1][c]);
        }
        const chosen = possibleCandies[Math.floor(Math.random() * possibleCandies.length)];
        newGrid[r][c] = chosen;
      }
    }
    return newGrid;
  }, []);

  // Initialize board on mount
  useEffect(() => {
    setGrid(createFreshGrid());
    startTimeRef.current = Date.now();
  }, [createFreshGrid]);

  // Find all horizontal and vertical matches
  const checkMatches = (currentGrid: number[][]) => {
    const matches: { r: number; c: number }[] = [];
    const matchedSet = new Set<string>();

    // Check rows
    for (let r = 0; r < GRID_SIZE; r++) {
      for (let c = 0; c < GRID_SIZE - 2; c++) {
        const candy = currentGrid[r][c];
        if (candy !== -1 && candy === currentGrid[r][c + 1] && candy === currentGrid[r][c + 2]) {
          let matchLength = 3;
          while (c + matchLength < GRID_SIZE && currentGrid[r][c + matchLength] === candy) {
            matchLength++;
          }
          for (let i = 0; i < matchLength; i++) {
            const key = `${r},${c + i}`;
            if (!matchedSet.has(key)) {
              matchedSet.add(key);
              matches.push({ r, c: c + i });
            }
          }
        }
      }
    }

    // Check columns
    for (let c = 0; c < GRID_SIZE; c++) {
      for (let r = 0; r < GRID_SIZE - 2; r++) {
        const candy = currentGrid[r][c];
        if (candy !== -1 && candy === currentGrid[r + 1][c] && candy === currentGrid[r + 2][c]) {
          let matchLength = 3;
          while (r + matchLength < GRID_SIZE && currentGrid[r + matchLength][c] === candy) {
            matchLength++;
          }
          for (let i = 0; i < matchLength; i++) {
            const key = `${r + i},${c}`;
            if (!matchedSet.has(key)) {
              matchedSet.add(key);
              matches.push({ r: r + i, c });
            }
          }
        }
      }
    }

    return matches;
  };

  // Process cascades and falling candies recursively
  const processBoardMatches = useCallback(async (initialGrid: number[][], comboCount = 1): Promise<number[][]> => {
    const matches = checkMatches(initialGrid);

    if (matches.length === 0) {
      setIsProcessing(false);
      return initialGrid;
    }

    // Calculate score
    const points = matches.length * 20 * comboCount;
    setScore(prev => {
      const newScore = prev + points;
      if (newScore >= targetScore && !levelCompleted) {
        handleLevelVictory(newScore);
      }
      return newScore;
    });

    matchesMadeRef.current += 1;

    // Trigger combo sound & visual message
    if (comboCount > 1) {
      playComboSound(comboCount);
      setComboMessage(`Combo x${comboCount}! +${points}`);
    } else {
      playMatchSuccessSound();
      setComboMessage(`Match! +${points}`);
    }

    setTimeout(() => setComboMessage(null), 1200);

    // Mark matched candies as -1 (empty)
    const afterMatchGrid = initialGrid.map(row => [...row]);
    matches.forEach(({ r, c }) => {
      afterMatchGrid[r][c] = -1;
    });
    setGrid(afterMatchGrid);

    // Wait a brief tick for visual feedback
    await new Promise(res => setTimeout(res, 220));

    // Drop candies down (gravity)
    const fallenGrid = afterMatchGrid.map(row => [...row]);
    for (let c = 0; c < GRID_SIZE; c++) {
      let emptyRow = GRID_SIZE - 1;
      for (let r = GRID_SIZE - 1; r >= 0; r--) {
        if (fallenGrid[r][c] !== -1) {
          if (emptyRow !== r) {
            fallenGrid[emptyRow][c] = fallenGrid[r][c];
            fallenGrid[r][c] = -1;
          }
          emptyRow--;
        }
      }
      // Fill remaining empty spots at top with new random candies
      for (let r = emptyRow; r >= 0; r--) {
        fallenGrid[r][c] = Math.floor(Math.random() * CANDY_TYPES.length);
      }
    }

    setGrid(fallenGrid);
    await new Promise(res => setTimeout(res, 200));

    // Recursively check for cascading matches
    return processBoardMatches(fallenGrid, comboCount + 1);
  }, [targetScore, levelCompleted]);

  const handleLevelVictory = (finalScore: number) => {
    setLevelCompleted(true);
    playCelebrationFanfare();
    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#10b981', '#f59e0b', '#3b82f6', '#ec4899'],
    });

    const durationSec = Math.round((Date.now() - startTimeRef.current) / 1000);
    const accuracy = Math.min(100, Math.round((matchesMadeRef.current / Math.max(1, totalSwapsRef.current)) * 100));

    recordGameSession({
      game: 'candy-match',
      score: finalScore,
      accuracy: Math.max(75, accuracy),
      duration: durationSec,
      difficulty: level === 1 ? 'Easy' : 'Moderate',
      level,
    });
  };

  const handleCellClick = async (r: number, c: number) => {
    if (isProcessing || levelCompleted || gameOver) return;
    setHighlightedHint(null);

    // If no cell selected, select current
    if (!selectedCell) {
      playSwapSound();
      setSelectedCell({ r, c });
      return;
    }

    // Check if clicked cell is adjacent
    const isAdjacent =
      (Math.abs(selectedCell.r - r) === 1 && selectedCell.c === c) ||
      (Math.abs(selectedCell.c - c) === 1 && selectedCell.r === r);

    if (!isAdjacent) {
      // Select new cell instead
      playSwapSound();
      setSelectedCell({ r, c });
      return;
    }

    // Attempt swap
    setIsProcessing(true);
    totalSwapsRef.current += 1;
    setMoves(prev => {
      const remaining = prev - 1;
      if (remaining <= 0 && score < targetScore) {
        setTimeout(() => setGameOver(true), 600);
      }
      return remaining;
    });

    const swappedGrid = grid.map(row => [...row]);
    const temp = swappedGrid[selectedCell.r][selectedCell.c];
    swappedGrid[selectedCell.r][selectedCell.c] = swappedGrid[r][c];
    swappedGrid[r][c] = temp;

    setGrid(swappedGrid);
    setSelectedCell(null);

    // Check if swap produces a match
    const matches = checkMatches(swappedGrid);
    if (matches.length > 0) {
      await processBoardMatches(swappedGrid, 1);
    } else {
      // Revert swap if no match created
      await new Promise(res => setTimeout(res, 280));
      const revertedGrid = swappedGrid.map(row => [...row]);
      revertedGrid[r][c] = swappedGrid[selectedCell.r][selectedCell.c];
      revertedGrid[selectedCell.r][selectedCell.c] = swappedGrid[r][c];
      setGrid(revertedGrid);
      setIsProcessing(false);
    }
  };

  // Find a valid move for Hint button
  const findHint = () => {
    if (isProcessing) return;
    for (let r = 0; r < GRID_SIZE; r++) {
      for (let c = 0; c < GRID_SIZE; c++) {
        // Try swap right
        if (c + 1 < GRID_SIZE) {
          const testGrid = grid.map(row => [...row]);
          const temp = testGrid[r][c];
          testGrid[r][c] = testGrid[r][c + 1];
          testGrid[r][c + 1] = temp;
          if (checkMatches(testGrid).length > 0) {
            setHighlightedHint({ r1: r, c1: c, r2: r, c2: c + 1 });
            playSwapSound();
            return;
          }
        }
        // Try swap down
        if (r + 1 < GRID_SIZE) {
          const testGrid = grid.map(row => [...row]);
          const temp = testGrid[r][c];
          testGrid[r][c] = testGrid[r + 1][c];
          testGrid[r + 1][c] = temp;
          if (checkMatches(testGrid).length > 0) {
            setHighlightedHint({ r1: r, c1: c, r2: r + 1, c2: c });
            playSwapSound();
            return;
          }
        }
      }
    }
    // If no match found, shuffle
    shuffleBoard();
  };

  const shuffleBoard = () => {
    playSwapSound();
    setGrid(createFreshGrid());
    setHighlightedHint(null);
  };

  const advanceNextLevel = () => {
    setLevel(prev => prev + 1);
    setTargetScore(prev => prev + 1200);
    setMoves(25);
    setLevelCompleted(false);
    setGameOver(false);
    setGrid(createFreshGrid());
    startTimeRef.current = Date.now();
  };

  const restartRound = () => {
    setScore(0);
    setMoves(25);
    setLevel(1);
    setTargetScore(1000);
    setLevelCompleted(false);
    setGameOver(false);
    setGrid(createFreshGrid());
    startTimeRef.current = Date.now();
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-6" id="candy-match-screen">
      
      {/* Header & Back Action */}
      <div className="flex items-center justify-between gap-4 mb-6">
        <button
          onClick={() => navigate('games')}
          className="inline-flex items-center gap-2 text-emerald-800 hover:text-emerald-950 font-bold text-sm bg-emerald-50 hover:bg-emerald-100 px-4 py-2 rounded-xl transition-all"
          id="candy-back-to-games-btn"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Cognitive Centre</span>
        </button>

        <div className="flex items-center gap-2">
          <button
            onClick={findHint}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-200 text-xs font-bold transition-all shadow-2xs"
            id="candy-hint-btn"
            title="Show a gentle hint"
          >
            <Lightbulb className="w-4 h-4 text-amber-600" />
            <span>Hint</span>
          </button>
          
          <button
            onClick={shuffleBoard}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-900 border border-emerald-200 text-xs font-bold transition-all shadow-2xs"
            id="candy-shuffle-btn"
            title="Shuffle candies"
          >
            <RefreshCw className="w-4 h-4 text-emerald-700" />
            <span>Shuffle</span>
          </button>
        </div>
      </div>

      {/* Game Title & Supportive Description */}
      <div className="bg-white rounded-3xl p-5 sm:p-6 border border-emerald-100 shadow-xs mb-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <div className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-700 uppercase tracking-wider bg-emerald-50 px-3 py-1 rounded-full mb-1">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Cognitive Match-3 Activity</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold text-emerald-950">
              Candy Match
            </h1>
            <p className="text-sm sm:text-base text-emerald-700 font-medium mt-0.5">
              Swap, match 3 in a line, and train your gentle attention & visual recognition.
            </p>
          </div>

          {/* Quick HUD Metrics */}
          <div className="grid grid-cols-4 gap-2 text-center bg-emerald-50/80 p-3 rounded-2xl border border-emerald-200/70 shrink-0">
            <div className="px-2">
              <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-700 block">Score</span>
              <span className="text-lg sm:text-xl font-extrabold text-emerald-950">{score}</span>
            </div>
            <div className="px-2 border-l border-emerald-200">
              <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-700 block">Target</span>
              <span className="text-lg sm:text-xl font-bold text-teal-800">{targetScore}</span>
            </div>
            <div className="px-2 border-l border-emerald-200">
              <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-700 block">Moves</span>
              <span className={`text-lg sm:text-xl font-extrabold ${moves <= 5 ? 'text-rose-600 animate-pulse' : 'text-emerald-900'}`}>{moves}</span>
            </div>
            <div className="px-2 border-l border-emerald-200">
              <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-700 block">Level</span>
              <span className="text-lg sm:text-xl font-bold text-emerald-800">{level}</span>
            </div>
          </div>
        </div>

        {/* Progress Bar towards Target Score */}
        <div className="mt-4 pt-3 border-t border-emerald-100">
          <div className="flex justify-between text-xs font-semibold text-emerald-800 mb-1">
            <span>Level {level} Progress</span>
            <span>{Math.min(100, Math.round((score / targetScore) * 100))}%</span>
          </div>
          <div className="w-full h-3 bg-emerald-100 rounded-full overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-emerald-500 to-teal-600 rounded-full transition-all duration-300"
              style={{ width: `${Math.min(100, (score / targetScore) * 100)}%` }}
            ></div>
          </div>
        </div>
      </div>

      {/* Main Game Board Area */}
      <div className="relative flex flex-col items-center justify-center">
        
        {/* Floating Combo Toast */}
        {comboMessage && (
          <div className="absolute top-2 z-20 bg-amber-400 text-amber-950 font-black px-4 py-2 rounded-2xl shadow-lg border-2 border-white animate-bounce text-sm sm:text-base">
            {comboMessage}
          </div>
        )}

        {/* 8x8 Grid Container */}
        <div 
          className="bg-emerald-900/90 p-3 sm:p-4 rounded-3xl shadow-xl border-4 border-emerald-800 max-w-[480px] w-full aspect-square grid grid-cols-8 gap-1 sm:gap-1.5 select-none"
          id="candy-grid-board"
        >
          {grid.map((row, r) =>
            row.map((candyId, c) => {
              const isSelected = selectedCell?.r === r && selectedCell?.c === c;
              const isHinted =
                highlightedHint &&
                ((highlightedHint.r1 === r && highlightedHint.c1 === c) ||
                  (highlightedHint.r2 === r && highlightedHint.c2 === c));

              const candy = candyId !== -1 ? CANDY_TYPES[candyId] : null;

              return (
                <button
                  key={`${r}-${c}`}
                  onClick={() => handleCellClick(r, c)}
                  disabled={isProcessing}
                  className={`relative rounded-xl sm:rounded-2xl flex items-center justify-center text-xl sm:text-2xl transition-all duration-150 cursor-pointer ${
                    candy
                      ? 'bg-emerald-800/80 hover:bg-emerald-700 shadow-xs'
                      : 'bg-emerald-950/40 opacity-0'
                  } ${
                    isSelected
                      ? 'ring-4 ring-amber-300 scale-108 z-10 bg-amber-500/30'
                      : ''
                  } ${
                    isHinted
                      ? 'ring-4 ring-lime-400 animate-pulse scale-105'
                      : ''
                  }`}
                  id={`candy-cell-${r}-${c}`}
                  aria-label={candy ? `${candy.name} at row ${r + 1}, column ${c + 1}` : 'Empty'}
                >
                  {candy && (
                    <span className="transform active:scale-90 transition-transform filter drop-shadow-sm">
                      {candy.emoji}
                    </span>
                  )}
                </button>
              );
            })
          )}
        </div>

        {/* Level Complete Modal Overlay */}
        {levelCompleted && (
          <div className="absolute inset-0 bg-emerald-950/70 backdrop-blur-xs rounded-3xl flex items-center justify-center p-6 z-30">
            <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-sm w-full text-center shadow-2xl border border-emerald-100 animate-in zoom-in-95 duration-200">
              <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto mb-3 shadow-inner">
                <Trophy className="w-8 h-8 text-amber-500" />
              </div>
              <h3 className="text-2xl font-bold text-emerald-950">Level {level} Complete!</h3>
              <p className="text-sm text-emerald-700 mt-1 font-medium">
                Wonderful focus! You reached the target with {moves} moves to spare.
              </p>

              <div className="bg-emerald-50 rounded-2xl p-3 my-4 border border-emerald-200 text-left">
                <div className="flex justify-between text-xs text-emerald-900 font-semibold mb-1">
                  <span>Score Achieved:</span>
                  <span className="font-bold text-emerald-950">{score}</span>
                </div>
                <div className="flex justify-between text-xs text-emerald-900 font-semibold">
                  <span>Next Target:</span>
                  <span className="font-bold text-teal-800">{targetScore + 1200}</span>
                </div>
              </div>

              <div className="flex flex-col gap-2">
                <button
                  onClick={advanceNextLevel}
                  className="w-full py-3 bg-emerald-700 hover:bg-emerald-800 text-white font-bold rounded-2xl shadow-sm transition-all flex items-center justify-center gap-2 cursor-pointer"
                  id="candy-next-level-btn"
                >
                  <Play className="w-4 h-4 fill-white" />
                  <span>Start Level {level + 1}</span>
                </button>
                <button
                  onClick={() => navigate('caregiver')}
                  className="w-full py-2.5 text-xs font-bold text-emerald-800 hover:text-emerald-950"
                >
                  View Caregiver Progress
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Game Over / Try Again Modal Overlay */}
        {gameOver && !levelCompleted && (
          <div className="absolute inset-0 bg-emerald-950/70 backdrop-blur-xs rounded-3xl flex items-center justify-center p-6 z-30">
            <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-sm w-full text-center shadow-2xl border border-emerald-100">
              <div className="w-16 h-16 rounded-full bg-amber-100 text-amber-700 flex items-center justify-center mx-auto mb-3">
                <RotateCcw className="w-8 h-8 text-amber-600" />
              </div>
              <h3 className="text-2xl font-bold text-emerald-950">Round Finished</h3>
              <p className="text-sm text-emerald-700 mt-1 font-medium">
                That's okay! We take our time and practice together without pressure.
              </p>
              <div className="my-4 p-3 bg-emerald-50 rounded-2xl border border-emerald-200">
                <span className="text-xs text-emerald-800 font-semibold">Score: </span>
                <span className="text-base font-bold text-emerald-950">{score}</span>
              </div>
              <button
                onClick={restartRound}
                className="w-full py-3 bg-emerald-700 hover:bg-emerald-800 text-white font-bold rounded-2xl shadow-sm transition-all flex items-center justify-center gap-2 cursor-pointer"
                id="candy-try-again-btn"
              >
                <RotateCcw className="w-4 h-4" />
                <span>Play Again Together</span>
              </button>
            </div>
          </div>
        )}

      </div>

      {/* Gentle Instructions Footer */}
      <div className="mt-6 p-4 rounded-2xl bg-emerald-50/70 border border-emerald-200/80 flex items-center gap-3 text-xs sm:text-sm text-emerald-800 font-medium">
        <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
        <span>
          <strong>How to play:</strong> Tap any candy, then tap an adjacent candy to swap. Match 3 or more in a row or column to clear them!
        </span>
      </div>

    </div>
  );
};
