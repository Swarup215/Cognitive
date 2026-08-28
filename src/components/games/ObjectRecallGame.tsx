import React, { useState, useEffect, useRef } from 'react';
import { useApp } from '../../context/AppContext';
import { ArrowLeft, Sparkles, Eye, CheckCircle2, RotateCcw, Trophy, Clock } from 'lucide-react';
import confetti from 'canvas-confetti';
import { NER_CULTURAL_ITEMS, RegionalCulturalItem } from '../../data/regionalData';
import { playCardFlipSound, playMatchSuccessSound, playCelebrationFanfare } from '../../utils/audioSynth';

type Phase = 'memorize' | 'recall' | 'result';

export const ObjectRecallGame: React.FC = () => {
  const { navigate, recordGameSession, t, speak } = useApp();

  const [objectCount, setObjectCount] = useState<number>(4);
  const [phase, setPhase] = useState<Phase>('memorize');
  const [targetItems, setTargetItems] = useState<RegionalCulturalItem[]>([]);
  const [candidateItems, setCandidateItems] = useState<RegionalCulturalItem[]>([]);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [countdown, setCountdown] = useState<number>(8);
  const [score, setScore] = useState<number>(0);
  const [correctCount, setCorrectCount] = useState<number>(0);

  const timerRef = useRef<any>(null);
  const startTimeRef = useRef<number>(Date.now());

  const startRound = (count = objectCount) => {
    // Pick target objects
    const shuffledPool = [...NER_CULTURAL_ITEMS].sort(() => Math.random() - 0.5);
    const chosenTargets = shuffledPool.slice(0, count);
    const distractors = shuffledPool.slice(count, count + 4);

    // Combine targets + distractors for recall candidate pool
    const poolForRecall = [...chosenTargets, ...distractors].sort(() => Math.random() - 0.5);

    setTargetItems(chosenTargets);
    setCandidateItems(poolForRecall);
    setSelectedIds([]);
    setPhase('memorize');
    setCountdown(8);
    startTimeRef.current = Date.now();

    // Voice announcement
    speak(`Look carefully at these ${count} objects. Remember them when they disappear.`);

    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = setInterval(() => {
      setCountdown(c => {
        if (c <= 1) {
          clearInterval(timerRef.current);
          proceedToRecall(chosenTargets, poolForRecall);
          return 0;
        }
        return c - 1;
      });
    }, 1000);
  };

  const proceedToRecall = (targets = targetItems, candidates = candidateItems) => {
    if (timerRef.current) clearInterval(timerRef.current);
    setPhase('recall');
    playCardFlipSound();
    speak("Which objects did you see? Tap them to choose.");
  };

  useEffect(() => {
    startRound(objectCount);
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [objectCount]);

  const toggleCandidate = (id: string) => {
    playCardFlipSound();
    setSelectedIds(prev =>
      prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
    );
  };

  const submitRecall = () => {
    const targetIdSet = new Set(targetItems.map(i => i.id));
    const correct = selectedIds.filter(id => targetIdSet.has(id)).length;
    const totalTargets = targetItems.length;

    setCorrectCount(correct);
    const accuracy = Math.round((correct / totalTargets) * 100);
    const calculatedScore = correct * 250;
    setScore(calculatedScore);
    setPhase('result');

    if (accuracy >= 75) {
      playCelebrationFanfare();
      confetti({ particleCount: 70, spread: 60, origin: { y: 0.6 } });
    } else {
      playMatchSuccessSound();
    }

    const durationSec = Math.round((Date.now() - startTimeRef.current) / 1000);

    recordGameSession({
      game: 'object-recall',
      score: calculatedScore,
      accuracy,
      duration: durationSec,
      difficulty: objectCount === 4 ? 'Easy' : objectCount === 5 ? 'Moderate' : 'Challenging',
    });
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-6" id="object-recall-screen">
      
      {/* Top Header Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <button
          onClick={() => navigate('games')}
          className="inline-flex items-center gap-2 text-emerald-800 hover:text-emerald-950 font-bold text-sm bg-emerald-50 hover:bg-emerald-100 px-4 py-2 rounded-xl transition-all w-fit"
          id="recall-back-btn"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Cognitive Centre</span>
        </button>

        {/* Difficulty Controls */}
        <div className="flex items-center gap-1 bg-white p-1 rounded-2xl border border-emerald-200">
          {[4, 5, 6].map(num => (
            <button
              key={num}
              onClick={() => {
                setObjectCount(num);
                startRound(num);
              }}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                objectCount === num
                  ? 'bg-emerald-700 text-white shadow-xs'
                  : 'text-emerald-800 hover:bg-emerald-50'
              }`}
            >
              {num} Objects
            </button>
          ))}
          <button
            onClick={() => startRound(objectCount)}
            className="p-1.5 text-emerald-700 hover:text-emerald-950 hover:bg-emerald-50 rounded-xl transition-colors ml-1"
            title="Restart round"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Main Container */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-emerald-100 shadow-xs mb-6">
        
        {/* Title */}
        <div className="text-center max-w-lg mx-auto mb-6">
          <div className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-700 uppercase tracking-wider bg-emerald-50 px-3 py-1 rounded-full mb-2">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Short-term Visual Memory</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-emerald-950">
            Object Recall
          </h1>
          <p className="text-sm sm:text-base text-emerald-700 font-medium mt-1">
            {phase === 'memorize' && `Take a good look at these ${objectCount} familiar objects. Remember their shapes and names.`}
            {phase === 'recall' && `Which objects did you just see? Tap on the ones you remember.`}
            {phase === 'result' && `Review your recall session below. Excellent practice!`}
          </p>
        </div>

        {/* PHASE 1: Memorization */}
        {phase === 'memorize' && (
          <div className="flex flex-col items-center">
            {/* Timer countdown badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-2xl bg-amber-50 border border-amber-200 text-amber-900 font-bold text-sm mb-6">
              <Clock className="w-4 h-4 text-amber-600 animate-spin" />
              <span>Memorize time: {countdown} seconds</span>
            </div>

            {/* Objects Cards to Memorize */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 w-full max-w-2xl mb-8">
              {targetItems.map(item => (
                <div
                  key={item.id}
                  className="bg-emerald-50/90 border-2 border-emerald-300 rounded-2xl p-4 flex flex-col items-center text-center shadow-xs animate-in zoom-in-95 duration-200"
                >
                  <span className="text-4xl sm:text-5xl mb-2 filter drop-shadow-xs">{item.iconEmoji}</span>
                  <span className="text-sm font-bold text-emerald-950">{item.name}</span>
                  <span className="text-xs font-semibold text-emerald-700">{item.region}</span>
                </div>
              ))}
            </div>

            {/* Ready Button */}
            <button
              onClick={() => proceedToRecall()}
              className="px-6 py-3 bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-sm sm:text-base rounded-2xl shadow-sm transition-all flex items-center gap-2 cursor-pointer"
              id="recall-ready-btn"
            >
              <Eye className="w-5 h-5" />
              <span>I'm Ready! Hide Objects</span>
            </button>
          </div>
        )}

        {/* PHASE 2: Recall Selection */}
        {phase === 'recall' && (
          <div className="flex flex-col items-center">
            <div className="mb-4 text-xs font-bold text-emerald-800 uppercase tracking-wider">
              Selected: {selectedIds.length} of {objectCount}
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 w-full max-w-2xl mb-8">
              {candidateItems.map(item => {
                const isSelected = selectedIds.includes(item.id);
                return (
                  <button
                    key={item.id}
                    onClick={() => toggleCandidate(item.id)}
                    className={`rounded-2xl p-4 flex flex-col items-center text-center transition-all cursor-pointer border-2 ${
                      isSelected
                        ? 'bg-emerald-100 border-emerald-600 shadow-md ring-2 ring-emerald-300 scale-103'
                        : 'bg-white border-emerald-200 hover:bg-emerald-50/80 shadow-2xs'
                    }`}
                    id={`recall-candidate-${item.id}`}
                  >
                    <span className="text-4xl sm:text-5xl mb-2">{item.iconEmoji}</span>
                    <span className="text-sm font-bold text-emerald-950">{item.name}</span>
                    <span className="text-xs text-emerald-700 font-medium">{item.region.split(',')[0]}</span>
                    {isSelected && (
                      <div className="text-[11px] font-bold text-emerald-800 mt-2 bg-white px-2 py-0.5 rounded-full border border-emerald-300">
                        ✓ Selected
                      </div>
                    )}
                  </button>
                );
              })}
            </div>

            <button
              onClick={submitRecall}
              disabled={selectedIds.length === 0}
              className={`px-8 py-3.5 font-bold text-sm sm:text-base rounded-2xl shadow-sm transition-all flex items-center gap-2 cursor-pointer ${
                selectedIds.length > 0
                  ? 'bg-emerald-700 hover:bg-emerald-800 text-white'
                  : 'bg-emerald-200 text-emerald-500 cursor-not-allowed'
              }`}
              id="recall-submit-btn"
            >
              <CheckCircle2 className="w-5 h-5" />
              <span>Check My Recall ({selectedIds.length})</span>
            </button>
          </div>
        )}

        {/* PHASE 3: Result Breakdown */}
        {phase === 'result' && (
          <div className="flex flex-col items-center max-w-lg mx-auto text-center">
            <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center mb-3">
              <Trophy className="w-8 h-8 text-amber-500" />
            </div>

            <h3 className="text-2xl font-bold text-emerald-950">
              {correctCount === objectCount ? 'Perfect Recall!' : 'Great Effort!'}
            </h3>
            <p className="text-sm sm:text-base text-emerald-700 font-medium mt-1">
              You correctly recalled {correctCount} out of {objectCount} objects.
            </p>

            <div className="w-full bg-emerald-50 rounded-2xl p-4 my-6 border border-emerald-200 text-left">
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-700 block mb-2">
                Original Objects were:
              </span>
              <div className="flex flex-wrap gap-2">
                {targetItems.map(item => {
                  const wasFound = selectedIds.includes(item.id);
                  return (
                    <span
                      key={item.id}
                      className={`inline-flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-bold border ${
                        wasFound
                          ? 'bg-emerald-100 text-emerald-900 border-emerald-300'
                          : 'bg-amber-50 text-amber-900 border-amber-200'
                      }`}
                    >
                      <span>{item.iconEmoji}</span>
                      <span>{item.name}</span>
                      <span>{wasFound ? '✓' : '•'}</span>
                    </span>
                  );
                })}
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 w-full">
              <button
                onClick={() => startRound(objectCount)}
                className="flex-1 py-3 bg-emerald-700 hover:bg-emerald-800 text-white font-bold rounded-2xl shadow-sm transition-all flex items-center justify-center gap-2 cursor-pointer"
                id="recall-try-again-btn"
              >
                <RotateCcw className="w-4 h-4" />
                <span>Try Another Set</span>
              </button>
              <button
                onClick={() => navigate('caregiver')}
                className="flex-1 py-3 bg-emerald-50 hover:bg-emerald-100 text-emerald-900 font-bold rounded-2xl border border-emerald-200 transition-all text-xs sm:text-sm"
              >
                View Caregiver Report
              </button>
            </div>
          </div>
        )}

      </div>

    </div>
  );
};
