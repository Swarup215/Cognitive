import React from 'react';
import { useApp } from '../context/AppContext';
import { Sparkles, ArrowRight, CheckCircle2, X, Play, RefreshCw, WifiOff, Globe } from 'lucide-react';

const DEMO_STEPS = [
  { step: 1, title: '1. Home Dashboard', desc: 'Personalized greeting for Asha, NE landscape, quick action cards & today focus' },
  { step: 2, title: '2. Cognitive Centre', desc: 'Overview of 5 adaptive activities designed for elderly cognitive care' },
  { step: 3, title: '3. Candy Match-3', desc: '8x8 working Match-3 game with swaps, cascading gravity, combos & moves' },
  { step: 4, title: '4. Memory Match', desc: 'NER cultural cards (Rhino, Hornbill, Root Bridge, Muga Silk) with adaptive scoring' },
  { step: 5, title: '5. Pattern Garden', desc: 'Visual pattern recognition with North Eastern flora and sequencing' },
  { step: 6, title: '6. Daily Routine Recall', desc: 'Gentle, supportive daily recall questions with zero failure anxiety' },
  { step: 7, title: '7. Reminders & Voice', desc: 'Medicine, hydration, family calls with one-tap completion & audio alerts' },
  { step: 8, title: '8. Caregiver Dashboard', desc: 'Cognitive activity scores, weekly trend, care alerts & family connect' },
  { step: 9, title: '9. Detailed Cognitive Report', desc: 'Memory, attention, recall & pattern recognition performance breakdown' },
  { step: 10, title: '10. Language & Text Size', desc: '10 regional NER languages & dynamic typography scaling' },
  { step: 11, title: '11. Offline-First Test', desc: 'Simulate remote NER low/no connectivity — all games & reminders work locally' },
  { step: 12, title: '12. Cloud Synchronization', desc: 'Simulate connection restoration and sync pending records back to server' },
];

export const JudgeDemoBanner: React.FC = () => {
  const { judgeDemoActive, judgeDemoStep, nextJudgeDemoStep, prevJudgeDemoStep, closeJudgeDemo } = useApp();

  if (!judgeDemoActive) return null;

  const currentStepInfo = DEMO_STEPS.find(s => s.step === judgeDemoStep) || DEMO_STEPS[0];

  return (
    <div 
      className="fixed bottom-[72px] left-3 right-3 sm:left-6 sm:right-6 max-w-4xl mx-auto z-50 bg-gradient-to-r from-amber-600 via-amber-700 to-emerald-800 text-white px-4 py-3 shadow-2xl rounded-2xl border border-amber-300/60 backdrop-blur-md transition-all animate-in slide-in-from-bottom duration-300"
      id="judge-demo-banner"
    >
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
        
        {/* Step Indicator & Description */}
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <div className="w-9 h-9 rounded-xl bg-white text-amber-950 font-black flex items-center justify-center text-xs shrink-0 shadow-md">
            {judgeDemoStep}/12
          </div>
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2">
              <span className="font-bold text-sm sm:text-base tracking-wide flex items-center gap-1.5 truncate">
                <Sparkles className="w-4 h-4 text-amber-200 shrink-0" />
                {currentStepInfo.title}
              </span>
              <span className="text-[10px] bg-white/20 px-2 py-0.5 rounded-full font-semibold shrink-0">
                Judge Demo Flow
              </span>
            </div>
            <p className="text-xs text-amber-100/90 truncate">
              {currentStepInfo.desc}
            </p>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2 shrink-0 w-full sm:w-auto justify-end">
          {judgeDemoStep > 1 && (
            <button
              onClick={prevJudgeDemoStep}
              className="bg-white/15 hover:bg-white/25 text-white px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1 transition-all cursor-pointer border border-white/20"
              id="demo-prev-step-btn"
              title="Previous Step"
            >
              <span>Prev</span>
            </button>
          )}

          <button
            onClick={nextJudgeDemoStep}
            className="bg-amber-100 hover:bg-white text-amber-950 px-4 py-1.5 rounded-xl text-xs font-extrabold shadow-md flex items-center gap-1.5 transition-all cursor-pointer hover:scale-105 active:scale-95"
            id="demo-next-step-btn"
          >
            <span>{judgeDemoStep === 12 ? 'Finish Tour' : 'Next Step'}</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
          
          <button
            onClick={closeJudgeDemo}
            className="p-1.5 rounded-xl hover:bg-white/20 text-white/80 hover:text-white transition-all cursor-pointer ml-1"
            id="demo-close-btn"
            title="Exit demo tour"
            aria-label="Close demo tour"
          >
            <X className="w-4.5 h-4.5" />
          </button>
        </div>

      </div>
    </div>
  );
};
