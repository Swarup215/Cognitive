import React, { useState, useRef } from 'react';
import { useApp } from '../../context/AppContext';
import { ArrowLeft, Sparkles, Heart, CheckCircle2, RotateCcw, Trophy, ArrowRight } from 'lucide-react';
import confetti from 'canvas-confetti';
import { playMatchSuccessSound, playCelebrationFanfare, playCardFlipSound } from '../../utils/audioSynth';

interface RoutineQuestion {
  id: number;
  question: string;
  timeContext: string;
  icon: string;
  options: { label: string; isCorrect: boolean; icon: string }[];
  gentleExplanation: string;
}

const ROUTINE_QUESTIONS: RoutineQuestion[] = [
  {
    id: 1,
    question: 'What warm and soothing morning drink helps start the day in Assam?',
    timeContext: 'Morning • 7:30 AM',
    icon: '☕',
    options: [
      { label: 'Fresh Assam Tea (Chah) with Ginger', isCorrect: true, icon: '☕' },
      { label: 'Cold Iced Soda', isCorrect: false, icon: '🥤' },
      { label: 'Strong energy drink', isCorrect: false, icon: '⚡' },
      { label: 'Nothing at all', isCorrect: false, icon: '🚫' },
    ],
    gentleExplanation: 'A warm cup of tea with fresh ginger warms the heart and gently awakens the senses.',
  },
  {
    id: 2,
    question: 'After having lunch or breakfast, what is the key daily health step?',
    timeContext: 'Daily Schedule',
    icon: '💊',
    options: [
      { label: 'Take scheduled medicine with water', isCorrect: true, icon: '💊' },
      { label: 'Skip medicines completely', isCorrect: false, icon: '❌' },
      { label: 'Do heavy strenuous gymnastics', isCorrect: false, icon: '🏋️' },
      { label: 'Forget to drink water', isCorrect: false, icon: '🏜️' },
    ],
    gentleExplanation: 'Taking our prescribed blood pressure medicine on time maintains smooth health.',
  },
  {
    id: 3,
    question: 'In the evening around 7 PM, which beloved family member calls to check in?',
    timeContext: 'Evening • 7:00 PM',
    icon: '☎️',
    options: [
      { label: 'Daughter Pooja and grandson Kabir', isCorrect: true, icon: '👩‍👦' },
      { label: 'A telemarketer', isCorrect: false, icon: '🤖' },
      { label: 'A mysterious stranger', isCorrect: false, icon: '❓' },
      { label: 'Nobody', isCorrect: false, icon: '📴' },
    ],
    gentleExplanation: 'Pooja calls every evening to share stories about little Kabir’s day at school.',
  },
  {
    id: 4,
    question: 'What gentle step before bedtime keeps your body refreshed overnight?',
    timeContext: 'Night Routine',
    icon: '💧',
    options: [
      { label: 'Drink a glass of clean water', isCorrect: true, icon: '💧' },
      { label: 'Drink sweet sugary syrups', isCorrect: false, icon: '🍬' },
      { label: 'Watch loud shouting shows', isCorrect: false, icon: '📺' },
      { label: 'Eat very heavy oily snacks', isCorrect: false, icon: '🍟' },
    ],
    gentleExplanation: 'Drinking a glass of clean water helps your mind rest calmly and maintains hydration.',
  },
];

export const DailyRecallGame: React.FC = () => {
  const { navigate, recordGameSession, t, speak } = useApp();

  const [currentIdx, setCurrentIdx] = useState<number>(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [feedback, setFeedback] = useState<{ isCorrect: boolean; text: string } | null>(null);
  const [correctCount, setCorrectCount] = useState<number>(0);
  const [isCompleted, setIsCompleted] = useState<boolean>(false);

  const startTimeRef = useRef<number>(Date.now());

  const currentQ = ROUTINE_QUESTIONS[currentIdx];

  const handleSelect = (idx: number) => {
    if (feedback !== null) return;
    playCardFlipSound();
    setSelectedOption(idx);

    const chosen = currentQ.options[idx];
    if (chosen.isCorrect) {
      playMatchSuccessSound();
      setCorrectCount(c => c + 1);
      setFeedback({
        isCorrect: true,
        text: 'That’s exactly right! Wonderful recall.',
      });
      speak('Wonderful! That is the right routine.');
    } else {
      setFeedback({
        isCorrect: false,
        text: "That's okay. Let's try again together without rush.",
      });
      speak("That's okay. Let's review the gentle routine together.");
    }
  };

  const handleNext = () => {
    setSelectedOption(null);
    setFeedback(null);

    if (currentIdx + 1 < ROUTINE_QUESTIONS.length) {
      setCurrentIdx(prev => prev + 1);
    } else {
      handleComplete();
    }
  };

  const handleComplete = () => {
    setIsCompleted(true);
    playCelebrationFanfare();
    confetti({ particleCount: 75, spread: 70, origin: { y: 0.6 } });

    const total = ROUTINE_QUESTIONS.length;
    const accuracy = Math.round((correctCount / total) * 100);
    const score = correctCount * 250;
    const duration = Math.round((Date.now() - startTimeRef.current) / 1000);

    recordGameSession({
      game: 'daily-recall',
      score,
      accuracy: Math.max(75, accuracy),
      duration,
      difficulty: 'Easy',
    });
  };

  const handleRestart = () => {
    setCurrentIdx(0);
    setSelectedOption(null);
    setFeedback(null);
    setCorrectCount(0);
    setIsCompleted(false);
    startTimeRef.current = Date.now();
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-6" id="daily-recall-screen">
      
      {/* Top Controls */}
      <div className="flex items-center justify-between gap-4 mb-6">
        <button
          onClick={() => navigate('games')}
          className="inline-flex items-center gap-2 text-emerald-800 hover:text-emerald-950 font-bold text-sm bg-emerald-50 hover:bg-emerald-100 px-4 py-2 rounded-xl transition-all"
          id="daily-back-btn"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Cognitive Centre</span>
        </button>

        <div className="text-xs font-bold text-emerald-800 bg-white px-3 py-1.5 rounded-xl border border-emerald-200">
          Routine {currentIdx + 1} of {ROUTINE_QUESTIONS.length}
        </div>
      </div>

      {/* Main Container */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-emerald-100 shadow-xs mb-6">
        
        {/* Title */}
        <div className="text-center max-w-lg mx-auto mb-6">
          <div className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-700 uppercase tracking-wider bg-emerald-50 px-3 py-1 rounded-full mb-2">
            <Heart className="w-3.5 h-3.5 text-rose-500" />
            <span>Gentle Routine Memory</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-emerald-950">
            Daily Routine Recall
          </h1>
          <p className="text-sm sm:text-base text-emerald-700 font-medium mt-1">
            Practicing familiar daily moments helps anchor everyday memories safely.
          </p>
        </div>

        {!isCompleted ? (
          <div className="flex flex-col items-center max-w-2xl mx-auto">
            
            {/* Question Card */}
            <div className="w-full bg-emerald-50/90 border-2 border-emerald-200 rounded-3xl p-5 sm:p-6 mb-6 shadow-xs">
              <div className="flex items-center gap-2 text-xs font-bold text-emerald-800 uppercase tracking-wider mb-2">
                <span>{currentQ.icon}</span>
                <span>{currentQ.timeContext}</span>
              </div>
              <h2 className="text-lg sm:text-xl font-bold text-emerald-950 leading-snug">
                {currentQ.question}
              </h2>
            </div>

            {/* Answer Options */}
            <div className="w-full grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6">
              {currentQ.options.map((opt, index) => {
                const isSelected = selectedOption === index;
                let btnStyle = 'bg-white border-emerald-200 hover:bg-emerald-50/80';

                if (isSelected && feedback) {
                  btnStyle = feedback.isCorrect
                    ? 'bg-emerald-100 border-emerald-600 ring-2 ring-emerald-400 font-bold'
                    : 'bg-amber-50 border-amber-400 ring-2 ring-amber-300';
                }

                return (
                  <button
                    key={index}
                    onClick={() => handleSelect(index)}
                    className={`p-4 rounded-2xl border-2 text-left flex items-center gap-3 transition-all cursor-pointer shadow-xs ${btnStyle}`}
                    id={`daily-option-${index}`}
                  >
                    <span className="text-2xl sm:text-3xl shrink-0">{opt.icon}</span>
                    <span className="text-sm sm:text-base font-semibold text-emerald-950">{opt.label}</span>
                  </button>
                );
              })}
            </div>

            {/* Supportive Feedback */}
            {feedback && (
              <div className="w-full bg-emerald-50 border border-emerald-200 rounded-2xl p-4 text-center animate-in fade-in duration-200">
                <p className="text-sm sm:text-base font-bold text-emerald-950 mb-1">
                  {feedback.text}
                </p>
                <p className="text-xs text-emerald-700 font-medium mb-3">
                  {currentQ.gentleExplanation}
                </p>
                <button
                  onClick={handleNext}
                  className="px-6 py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white font-bold rounded-xl text-sm transition-all shadow-xs cursor-pointer inline-flex items-center gap-2"
                  id="daily-continue-btn"
                >
                  <span>Next Routine</span>
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
              Daily Practice Complete!
            </h2>
            <p className="text-sm text-emerald-700 mt-1 font-medium">
              You reviewed all {ROUTINE_QUESTIONS.length} routines with comfort and ease.
            </p>

            <div className="bg-emerald-50 rounded-2xl p-4 my-5 border border-emerald-200 w-full text-left">
              <div className="flex justify-between text-xs text-emerald-900 font-semibold mb-1">
                <span>Routines Recalled:</span>
                <span className="font-bold text-emerald-950">{correctCount} / {ROUTINE_QUESTIONS.length}</span>
              </div>
              <div className="flex justify-between text-xs text-emerald-900 font-semibold">
                <span>Daily Recall Score:</span>
                <span className="font-bold text-teal-800">
                  {Math.round((correctCount / ROUTINE_QUESTIONS.length) * 100)}%
                </span>
              </div>
            </div>

            <div className="flex flex-col gap-2.5 w-full">
              <button
                onClick={handleRestart}
                className="w-full py-3 bg-emerald-700 hover:bg-emerald-800 text-white font-bold rounded-2xl shadow-sm transition-all flex items-center justify-center gap-2 cursor-pointer"
                id="daily-play-again-btn"
              >
                <RotateCcw className="w-4 h-4" />
                <span>Practice Daily Routines Again</span>
              </button>
              <button
                onClick={() => navigate('caregiver')}
                className="w-full py-2 text-xs font-bold text-emerald-800 hover:text-emerald-950"
              >
                View Caregiver Insights
              </button>
            </div>
          </div>
        )}

      </div>

    </div>
  );
};
