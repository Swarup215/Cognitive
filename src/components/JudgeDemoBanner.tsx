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
  const { judgeDemoActive, judgeDemoStep, nextJudgeDemoStep, closeJudgeDemo } = useApp();

  if (!judgeDemoActive) return null;

  const currentStepInfo = DEMO_STEPS.find(s => s.step === judgeDemoStep) || DEMO_STEPS[0];

  return (
    <div 
      className="bg-gradient-to-r from-amber-500 via-amber-600 to-emerald-700 text-white px-4 py-2.5 shadow-md sticky top-[69px] z-30 transition-all border-b border-amber-400/50"
      id="judge-demo-banner"
    >
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-2.5">
        
        {/* Step Indicator & Description */}
        <div className="flex items-center gap-3 w-full md:w-auto">
          <div className="w-8 h-8 rounded-full bg-white text-amber-900 font-bold flex items-center justify-center text-xs shrink-0 shadow-xs">
            {judgeDemoStep}/12
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-sm sm:text-base tracking-wide flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-amber-200" />
                {currentStepInfo.title}
              </span>
              <span className="text-[10px] bg-white/20 px-2 py-0.5 rounded-full font-semibold">
                SIH Eval Flow
              </span>
            </div>
            <p className="text-xs text-amber-100 line-clamp-1">
              {currentStepInfo.desc}
            </p>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2 w-full md:w-auto justify-end">
          <button
            onClick={nextJudgeDemoStep}
            className="bg-white text-emerald-950 hover:bg-amber-100 px-4 py-1.5 rounded-xl text-xs font-bold shadow-xs flex items-center gap-1.5 transition-all cursor-pointer"
            id="demo-next-step-btn"
          >
            <span>{judgeDemoStep === 12 ? 'Finish Tour' : 'Next Step'}</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
          
          <button
            onClick={closeJudgeDemo}
            className="p-1.5 rounded-xl hover:bg-white/20 text-white/90 hover:text-white transition-all cursor-pointer"
            id="demo-close-btn"
            title="Exit demo tour"
            aria-label="Close demo tour"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

      </div>
    </div>
  );
};
