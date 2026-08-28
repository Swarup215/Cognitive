import React, { useState, useEffect, useRef } from 'react';
import { useApp } from '../../context/AppContext';
import { ArrowLeft, RotateCcw, Trophy, Sparkles, Clock, CheckCircle2, Volume2 } from 'lucide-react';
import confetti from 'canvas-confetti';
import { NER_CULTURAL_ITEMS, RegionalCulturalItem } from '../../data/regionalData';
import { playCardFlipSound, playMatchSuccessSound, playCelebrationFanfare } from '../../utils/audioSynth';

interface CardState {
  instanceId: string;
  item: RegionalCulturalItem;
  isFlipped: boolean;
  isMatched: boolean;
}

export const MemoryMatchGame: React.FC = () => {
  const { navigate, recordGameSession, t, speak } = useApp();

  const [difficulty, setDifficulty] = useState<'Easy' | 'Moderate' | 'Challenging'>('Moderate');
  const [cards, setCards] = useState<CardState[]>([]);
  const [selectedCards, setSelectedCards] = useState<CardState[]>([]);
  const [attempts, setAttempts] = useState<number>(0);
  const [matches, setMatches] = useState<number>(0);
  const [timerSeconds, setTimerSeconds] = useState<number>(0);
  const [isCompleted, setIsCompleted] = useState<boolean>(false);
  const [isLocked, setIsLocked] = useState<boolean>(false);

  const timerRef = useRef<any>(null);
  const startTimeRef = useRef<number>(Date.now());

  const getPairCount = (diff: 'Easy' | 'Moderate' | 'Challenging') => {
    switch (diff) {
      case 'Easy': return 4; // 8 cards (2x4)
      case 'Moderate': return 6; // 12 cards (3x4)
      case 'Challenging': return 8; // 16 cards (4x4)
    }
  };

  const setupGame = (diff = difficulty) => {
    const pairCount = getPairCount(diff);
    const chosenItems = NER_CULTURAL_ITEMS.slice(0, pairCount);
    
    // Duplicate for pairs
    const deck: CardState[] = [];
    chosenItems.forEach(item => {
      deck.push({
        instanceId: `${item.id}_a`,
        item,
        isFlipped: false,
        isMatched: false,
      });
      deck.push({
        instanceId: `${item.id}_b`,
        item,
        isFlipped: false,
        isMatched: false,
      });
    });

    // Shuffle deck
    const shuffled = deck.sort(() => Math.random() - 0.5);
    setCards(shuffled);
    setSelectedCards([]);
    setAttempts(0);
    setMatches(0);
    setTimerSeconds(0);
    setIsCompleted(false);
    setIsLocked(false);
    startTimeRef.current = Date.now();

    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = setInterval(() => {
      setTimerSeconds(s => s + 1);
    }, 1000);
  };

  useEffect(() => {
    setupGame(difficulty);
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [difficulty]);

  const handleCardClick = (card: CardState) => {
    if (isLocked || card.isFlipped || card.isMatched || selectedCards.length >= 2) return;

    playCardFlipSound();

    // Flip clicked card
    const updatedCards = cards.map(c => 
      c.instanceId === card.instanceId ? { ...c, isFlipped: true } : c
    );
    setCards(updatedCards);

    const newSelected = [...selectedCards, card];
    setSelectedCards(newSelected);

    if (newSelected.length === 2) {
      setIsLocked(true);
      setAttempts(a => a + 1);

      const [first, second] = newSelected;
      if (first.item.id === second.item.id) {
        // Matched!
        setTimeout(() => {
          playMatchSuccessSound();
          const targetPairCount = getPairCount(difficulty);
          const nextMatches = matches + 1;
          setMatches(nextMatches);

          setCards(prev =>
            prev.map(c =>
              c.item.id === first.item.id ? { ...c, isMatched: true, isFlipped: true } : c
            )
          );
          setSelectedCards([]);
          setIsLocked(false);

          if (nextMatches >= targetPairCount) {
            handleVictory(nextMatches);
          }
        }, 350);
      } else {
        // Not matched - flip back gently
        setTimeout(() => {
          setCards(prev =>
            prev.map(c =>
              c.instanceId === first.instanceId || c.instanceId === second.instanceId
                ? { ...c, isFlipped: false }
                : c
            )
          );
          setSelectedCards([]);
          setIsLocked(false);
        }, 1100);
      }
    }
  };

  const handleVictory = (finalMatches: number) => {
    if (timerRef.current) clearInterval(timerRef.current);
    setIsCompleted(true);
    playCelebrationFanfare();
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#0d5c3a', '#10b981', '#f59e0b', '#db2777'],
    });

    const totalPairs = getPairCount(difficulty);
    const accuracy = Math.min(100, Math.round((totalPairs / Math.max(totalPairs, attempts + 1)) * 100));
    const score = Math.max(100, Math.round((accuracy * 10) - timerSeconds));

    recordGameSession({
      game: 'memory-match',
      score,
      accuracy: Math.max(70, accuracy),
      duration: timerSeconds,
      difficulty,
    });
  };

  const formatTime = (secs: number) => {
    const mins = Math.floor(secs / 60);
    const rem = secs % 60;
    return `${mins}:${rem < 10 ? '0' : ''}${rem}`;
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-6" id="memory-match-screen">
      
      {/* Top Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <button
          onClick={() => navigate('games')}
          className="inline-flex items-center gap-2 text-emerald-800 hover:text-emerald-950 font-bold text-sm bg-emerald-50 hover:bg-emerald-100 px-4 py-2 rounded-xl transition-all w-fit"
          id="memory-back-btn"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Cognitive Centre</span>
        </button>

        {/* Difficulty Tabs */}
        <div className="flex items-center gap-1.5 bg-white p-1 rounded-2xl border border-emerald-200">
          {(['Easy', 'Moderate', 'Challenging'] as const).map(diff => (
            <button
              key={diff}
              onClick={() => setDifficulty(diff)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                difficulty === diff
                  ? 'bg-emerald-700 text-white shadow-xs'
                  : 'text-emerald-800 hover:bg-emerald-50'
              }`}
            >
              {diff} ({getPairCount(diff) * 2})
            </button>
          ))}
          <button
            onClick={() => setupGame(difficulty)}
            className="p-1.5 text-emerald-700 hover:text-emerald-950 hover:bg-emerald-50 rounded-xl transition-colors ml-1"
            title="Restart game"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Game Header Box */}
      <div className="bg-white rounded-3xl p-5 sm:p-6 border border-emerald-100 shadow-xs mb-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-700 uppercase tracking-wider bg-emerald-50 px-3 py-1 rounded-full mb-1">
              <Sparkles className="w-3.5 h-3.5" />
              <span>North Eastern Heritage Pairs</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold text-emerald-950">
              Memory Match
            </h1>
            <p className="text-sm sm:text-base text-emerald-700 font-medium mt-0.5">
              Flip and pair familiar symbols of North East India. Take all the time you need.
            </p>
          </div>

          {/* Stats Badges */}
          <div className="flex items-center gap-3 bg-emerald-50/80 p-3 rounded-2xl border border-emerald-200 shrink-0">
            <div className="text-center px-2">
              <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-700 block">Matches</span>
              <span className="text-lg sm:text-xl font-bold text-emerald-950">
                {matches} / {getPairCount(difficulty)}
              </span>
            </div>
            <div className="text-center px-2 border-l border-emerald-200">
              <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-700 block">Attempts</span>
              <span className="text-lg sm:text-xl font-bold text-teal-800">{attempts}</span>
            </div>
            <div className="text-center px-2 border-l border-emerald-200">
              <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-700 block flex items-center justify-center gap-1">
                <Clock className="w-3 h-3 text-emerald-600" />
                Time
              </span>
              <span className="text-lg sm:text-xl font-bold text-emerald-900">{formatTime(timerSeconds)}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Memory Grid */}
      <div 
        className={`grid gap-3 sm:gap-4 max-w-2xl mx-auto ${
          difficulty === 'Easy' 
            ? 'grid-cols-2 sm:grid-cols-4' 
            : difficulty === 'Moderate'
            ? 'grid-cols-3 sm:grid-cols-4'
            : 'grid-cols-4'
        }`}
        id="memory-cards-grid"
      >
        {cards.map(card => {
          const showFace = card.isFlipped || card.isMatched;
          return (
            <button
              key={card.instanceId}
              onClick={() => handleCardClick(card)}
              disabled={card.isMatched || isLocked}
              className={`aspect-[4/5] rounded-2xl p-2 sm:p-3 flex flex-col items-center justify-center text-center transition-all duration-300 transform cursor-pointer ${
                showFace
                  ? 'bg-white border-2 border-emerald-400 shadow-md scale-102 ring-2 ring-emerald-100'
                  : 'bg-gradient-to-br from-emerald-800 via-teal-800 to-emerald-900 border-2 border-emerald-700 text-white shadow-sm hover:scale-103'
              } ${card.isMatched ? 'opacity-85 border-emerald-500 bg-emerald-50/50' : ''}`}
              id={`memory-card-${card.instanceId}`}
              aria-label={showFace ? `${card.item.name}, ${card.item.region}` : 'Hidden card, tap to reveal'}
            >
              {showFace ? (
                <div className="flex flex-col items-center justify-between h-full py-1">
                  <span className="text-3xl sm:text-4xl transform scale-110 filter drop-shadow-xs">
                    {card.item.iconEmoji}
                  </span>
                  <div className="mt-1">
                    <span className="text-xs sm:text-sm font-bold text-emerald-950 block leading-tight line-clamp-1">
                      {card.item.name}
                    </span>
                    <span className="text-[10px] sm:text-[11px] font-semibold text-emerald-700 block">
                      {card.item.region.split(',')[0]}
                    </span>
                  </div>
                  {card.isMatched && (
                    <div className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded-full mt-0.5">
                      ✓ Matched
                    </div>
                  )}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center gap-1 text-emerald-200">
                  <div className="w-8 h-8 rounded-full border border-emerald-400/40 flex items-center justify-center">
                    <span className="text-lg">🌿</span>
                  </div>
                  <span className="text-[11px] font-medium tracking-wider text-emerald-200/90 uppercase">
                    MindMate
                  </span>
                </div>
              )}
            </button>
          );
        })}
      </div>

      {/* Completion Dialog */}
      {isCompleted && (
        <div className="fixed inset-0 bg-emerald-950/70 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-md w-full text-center shadow-2xl border border-emerald-100">
            <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center mx-auto mb-3">
              <Trophy className="w-8 h-8 text-amber-500" />
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-emerald-950">
              Wonderful Work!
            </h2>
            <p className="text-sm sm:text-base text-emerald-700 mt-1 font-medium">
              You matched all {getPairCount(difficulty)} North Eastern pairs in {formatTime(timerSeconds)}.
            </p>

            <div className="grid grid-cols-2 gap-3 bg-emerald-50 rounded-2xl p-4 my-5 border border-emerald-200 text-left">
              <div>
                <span className="text-xs font-bold text-emerald-700 uppercase tracking-wider block">Attempts</span>
                <span className="text-lg font-bold text-emerald-950">{attempts}</span>
              </div>
              <div>
                <span className="text-xs font-bold text-emerald-700 uppercase tracking-wider block">Estimated Recall</span>
                <span className="text-lg font-bold text-teal-800">
                  {Math.min(100, Math.round((getPairCount(difficulty) / Math.max(getPairCount(difficulty), attempts)) * 100))}%
                </span>
              </div>
            </div>

            <div className="flex flex-col gap-2.5">
              <button
                onClick={() => setupGame(difficulty)}
                className="w-full py-3.5 bg-emerald-700 hover:bg-emerald-800 text-white font-bold rounded-2xl shadow-sm transition-all flex items-center justify-center gap-2 cursor-pointer"
                id="memory-play-again-btn"
              >
                <RotateCcw className="w-4 h-4" />
                <span>Play Again</span>
              </button>
              <button
                onClick={() => navigate('caregiver')}
                className="w-full py-2.5 text-xs font-bold text-emerald-800 hover:text-emerald-950"
              >
                View Updated Caregiver Dashboard →
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
