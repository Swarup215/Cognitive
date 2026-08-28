import React, { useState, useEffect, useRef } from 'react';
import { useApp } from '../../context/AppContext';
import { ArrowLeft, Sparkles, CheckCircle2, RotateCcw, Trophy, ArrowRight } from 'lucide-react';
import confetti from 'canvas-confetti';
import { playMatchSuccessSound, playCelebrationFanfare, playCardFlipSound } from '../../utils/audioSynth';

interface PatternQuestion {
  id: number;
  title: string;
  sequence: { emoji: string; name: string }[];
  options: { emoji: string; name: string; isCorrect: boolean }[];
  explanation: string;
}

const PATTERN_ROUNDS: PatternQuestion[] = [
  {
    id: 1,
    title: 'Tea Garden & Flower Pattern',
    sequence: [
      { emoji: '🌿', name: 'Tea Leaf' },
      { emoji: '🌼', name: 'Yellow Blossom' },
      { emoji: '🌿', name: 'Tea Leaf' },
      { emoji: '🌼', name: 'Yellow Blossom' },
      { emoji: '🌿', name: 'Tea Leaf' },
    ],
    options: [
      { emoji: '🌼', name: 'Yellow Blossom', isCorrect: true },
      { emoji: '🍎', name: 'Apple', isCorrect: false },
      { emoji: '🦏', name: 'Rhino', isCorrect: false },
      { emoji: '🔵', name: 'Blue Bead', isCorrect: false },
    ],
    explanation: 'The pattern alternates between Tea Leaf and Yellow Blossom.',
  },
  {
    id: 2,
    title: 'Wildlife of North East',
    sequence: [
      { emoji: '🦏', name: 'One-Horned Rhino' },
      { emoji: '🦜', name: 'Hornbill' },
      { emoji: '🦜', name: 'Hornbill' },
      { emoji: '🦏', name: 'One-Horned Rhino' },
      { emoji: '🦜', name: 'Hornbill' },
    ],
    options: [
      { emoji: '🦜', name: 'Hornbill', isCorrect: true },
      { emoji: '🦏', name: 'Rhino', isCorrect: false },
      { emoji: '🌸', name: 'Lily', isCorrect: false },
      { emoji: '🎋', name: 'Bamboo', isCorrect: false },
    ],
    explanation: 'The pattern repeats: 1 Rhino, 2 Hornbills, 1 Rhino, 2 Hornbills.',
  },
  {
    id: 3,
    title: 'Colors of Loktak Lake',
    sequence: [
      { emoji: '🏞️', name: 'Lake Phumdi' },
      { emoji: '🌸', name: 'Pink Lotus' },
      { emoji: '🌿', name: 'Green Reed' },
      { emoji: '🏞️', name: 'Lake Phumdi' },
      { emoji: '🌸', name: 'Pink Lotus' },
    ],
    options: [
      { emoji: '🌿', name: 'Green Reed', isCorrect: true },
      { emoji: '🏞️', name: 'Lake Phumdi', isCorrect: false },
      { emoji: '🌼', name: 'Yellow Flower', isCorrect: false },
      { emoji: '🥁', name: 'Drum', isCorrect: false },
    ],
    explanation: 'The three elements follow a 3-step cycle: Lake, Lotus, Reed.',
  },
  {
    id: 4,
    title: 'Traditional Craft Weave',
    sequence: [
      { emoji: '🎋', name: 'Bamboo' },
      { emoji: '🧵', name: 'Golden Silk' },
      { emoji: '🎋', name: 'Bamboo' },
      { emoji: '🧵', name: 'Golden Silk' },
      { emoji: '🎋', name: 'Bamboo' },
    ],
    options: [
      { emoji: '🧵', name: 'Golden Silk', isCorrect: true },
      { emoji: '🌿', name: 'Leaf', isCorrect: false },
      { emoji: '🎭', name: 'Mask', isCorrect: false },
      { emoji: '🍎', name: 'Fruit', isCorrect: false },
    ],
    explanation: 'Bamboo and Golden Silk weave seamlessly back and forth.',
  },
];

export const PatternGardenGame: React.FC = () => {
  const { navigate, recordGameSession, t, speak } = useApp();

  const [currentRoundIdx, setCurrentRoundIdx] = useState<number>(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [feedback, setFeedback] = useState<{ isCorrect: boolean; text: string } | null>(null);
  const [correctAnswersCount, setCorrectAnswersCount] = useState<number>(0);
  const [gameCompleted, setGameCompleted] = useState<boolean>(false);

  const startTimeRef = useRef<number>(Date.now());

  const currentQuestion = PATTERN_ROUNDS[currentRoundIdx];

  const handleSelectOption = (index: number) => {
    if (feedback !== null) return;
    playCardFlipSound();
    setSelectedOption(index);

    const chosen = currentQuestion.options[index];
    if (chosen.isCorrect) {
      playMatchSuccessSound();
      setCorrectAnswersCount(c => c + 1);
      setFeedback({
        isCorrect: true,
        text: 'Great work! That completes the pattern nicely.',
      });
      speak('Wonderful! You found the right pattern match.');
    } else {
      setFeedback({
        isCorrect: false,
        text: "That's okay! Look closely at the sequence before the question mark.",
      });
      speak("That's okay. Let's look at the sequence together.");
    }
  };

  const nextRound = () => {
    setSelectedOption(null);
    setFeedback(null);

    if (currentRoundIdx + 1 < PATTERN_ROUNDS.length) {
      setCurrentRoundIdx(prev => prev + 1);
    } else {
      finishGame();
    }
  };

  const finishGame = () => {
    setGameCompleted(true);
    playCelebrationFanfare();
    confetti({ particleCount: 80, spread: 70, origin: { y: 0.6 } });

    const total = PATTERN_ROUNDS.length;
    const accuracy = Math.round((correctAnswersCount / total) * 100);
    const score = correctAnswersCount * 300;
    const duration = Math.round((Date.now() - startTimeRef.current) / 1000);

    recordGameSession({
      game: 'pattern-garden',
      score,
      accuracy: Math.max(70, accuracy),
      duration,
      difficulty: 'Easy',
    });
  };

  const restartAll = () => {
    setCurrentRoundIdx(0);
    setSelectedOption(null);
    setFeedback(null);
    setCorrectAnswersCount(0);
    setGameCompleted(false);
    startTimeRef.current = Date.now();
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-6" id="pattern-garden-screen">
      
      {/* Top Navigation */}
      <div className="flex items-center justify-between gap-4 mb-6">
        <button
          onClick={() => navigate('games')}
          className="inline-flex items-center gap-2 text-emerald-800 hover:text-emerald-950 font-bold text-sm bg-emerald-50 hover:bg-emerald-100 px-4 py-2 rounded-xl transition-all"
          id="pattern-back-btn"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Cognitive Centre</span>
        </button>

        <div className="text-xs font-bold text-emerald-800 bg-white px-3 py-1.5 rounded-xl border border-emerald-200">
          Round {currentRoundIdx + 1} of {PATTERN_ROUNDS.length}
        </div>
      </div>

      {/* Main Game Container */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-emerald-100 shadow-xs mb-6">
        
        {/* Title */}
        <div className="text-center max-w-lg mx-auto mb-6">
          <div className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-700 uppercase tracking-wider bg-emerald-50 px-3 py-1 rounded-full mb-2">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Visual Sequence & Attention</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-emerald-950">
            Pattern Garden
          </h1>
          <p className="text-sm sm:text-base text-emerald-700 font-medium mt-1">
            Look at the symbols in order. Which one comes next?
          </p>
        </div>

        {!gameCompleted ? (
          <div className="flex flex-col items-center">
            
            {/* The Sequence Display */}
            <div className="bg-emerald-50/90 border-2 border-emerald-200/80 rounded-3xl p-4 sm:p-6 w-full max-w-2xl mb-8 flex flex-wrap items-center justify-center gap-2 sm:gap-4 shadow-inner">
              {currentQuestion.sequence.map((item, idx) => (
                <React.Fragment key={idx}>
                  <div className="bg-white rounded-2xl p-3 sm:p-4 border border-emerald-200 shadow-xs flex flex-col items-center justify-center min-w-[64px] sm:min-w-[76px] aspect-square">
                    <span className="text-3xl sm:text-4xl">{item.emoji}</span>
                    <span className="text-[10px] sm:text-xs font-bold text-emerald-900 mt-1">{item.name.split(' ')[0]}</span>
                  </div>
                  <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 text-emerald-400 shrink-0" />
                </React.Fragment>
              ))}

              {/* The Missing Question Mark Slot */}
              <div className="bg-amber-100/90 border-2 border-dashed border-amber-400 rounded-2xl p-3 sm:p-4 shadow-xs flex flex-col items-center justify-center min-w-[64px] sm:min-w-[76px] aspect-square animate-pulse">
                <span className="text-2xl sm:text-3xl font-black text-amber-800">❓</span>
                <span className="text-[10px] font-bold text-amber-900 mt-1">Next?</span>
              </div>
            </div>

            {/* Multiple Choice Options */}
            <div className="w-full max-w-xl mb-6">
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-800 block text-center mb-3">
                Tap the symbol that comes next:
              </span>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {currentQuestion.options.map((opt, index) => {
                  const isSelected = selectedOption === index;
                  let btnColor = 'bg-white border-emerald-200 hover:bg-emerald-50';

                  if (isSelected && feedback) {
                    btnColor = feedback.isCorrect
                      ? 'bg-emerald-100 border-emerald-600 ring-2 ring-emerald-400'
                      : 'bg-amber-100 border-amber-500 ring-2 ring-amber-400';
                  }

                  return (
                    <button
                      key={index}
                      onClick={() => handleSelectOption(index)}
                      className={`p-4 rounded-2xl border-2 flex flex-col items-center text-center transition-all cursor-pointer shadow-xs ${btnColor}`}
                      id={`pattern-option-${index}`}
                    >
                      <span className="text-4xl mb-1">{opt.emoji}</span>
                      <span className="text-xs font-bold text-emerald-950">{opt.name}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Feedback and Next Button */}
            {feedback && (
              <div className="w-full max-w-lg bg-emerald-50 border border-emerald-200 rounded-2xl p-4 text-center animate-in fade-in duration-200">
                <p className="text-sm sm:text-base font-bold text-emerald-950 mb-1">
                  {feedback.text}
                </p>
                <p className="text-xs text-emerald-700 font-medium mb-3">
                  {currentQuestion.explanation}
                </p>
                <button
                  onClick={nextRound}
                  className="px-6 py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white font-bold rounded-xl text-sm transition-all shadow-xs cursor-pointer inline-flex items-center gap-2"
                  id="pattern-next-btn"
                >
                  <span>Continue</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            )}

          </div>
        ) : (
          /* Completion Screen */
          <div className="flex flex-col items-center text-center max-w-md mx-auto">
            <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center mb-3">
              <Trophy className="w-8 h-8 text-amber-500" />
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-emerald-950">
              Garden Blossom Complete!
            </h2>
            <p className="text-sm text-emerald-700 mt-1 font-medium">
              You completed all {PATTERN_ROUNDS.length} pattern rounds with calm attention.
            </p>

            <div className="bg-emerald-50 rounded-2xl p-4 my-5 border border-emerald-200 w-full text-left">
              <div className="flex justify-between text-xs text-emerald-900 font-semibold mb-1">
                <span>Rounds Solved:</span>
                <span className="font-bold text-emerald-950">{correctAnswersCount} / {PATTERN_ROUNDS.length}</span>
              </div>
              <div className="flex justify-between text-xs text-emerald-900 font-semibold">
                <span>Visual Recognition:</span>
                <span className="font-bold text-teal-800">
                  {Math.round((correctAnswersCount / PATTERN_ROUNDS.length) * 100)}%
                </span>
              </div>
            </div>

            <div className="flex flex-col gap-2.5 w-full">
              <button
                onClick={restartAll}
                className="w-full py-3 bg-emerald-700 hover:bg-emerald-800 text-white font-bold rounded-2xl shadow-sm transition-all flex items-center justify-center gap-2 cursor-pointer"
                id="pattern-play-again-btn"
              >
                <RotateCcw className="w-4 h-4" />
                <span>Play Patterns Again</span>
              </button>
              <button
                onClick={() => navigate('caregiver')}
                className="w-full py-2 text-xs font-bold text-emerald-800 hover:text-emerald-950"
              >
                Check Cognitive Analytics
              </button>
            </div>
          </div>
        )}

      </div>

    </div>
  );
};
