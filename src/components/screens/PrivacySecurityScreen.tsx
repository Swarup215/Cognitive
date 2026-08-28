import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { ArrowLeft, ShieldCheck, Lock, Database, Trash2, ShieldAlert, CheckCircle2, Download } from 'lucide-react';

export const PrivacySecurityScreen: React.FC = () => {
  const { navigate, resetAllData } = useApp();
  const [cleared, setCleared] = useState<boolean>(false);

  const handleClear = () => {
    resetAllData();
    setCleared(true);
    setTimeout(() => setCleared(false), 3000);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-6 pb-24 space-y-8" id="privacy-security-screen">
      
      {/* Top Header */}
      <div className="flex items-center justify-between gap-4">
        <button
          onClick={() => navigate('settings')}
          className="inline-flex items-center gap-2 text-emerald-800 hover:text-emerald-950 font-bold text-sm bg-emerald-50 hover:bg-emerald-100 px-4 py-2 rounded-xl transition-all"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Settings</span>
        </button>
      </div>

      {/* Main Card */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-emerald-100 shadow-xs space-y-2">
        <div className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-800 uppercase tracking-wider bg-emerald-50 px-3 py-1 rounded-full">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
          <span>Privacy & Data Sovereignty</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-emerald-950">
          Privacy, Security & Data Safety
        </h1>
        <p className="text-xs sm:text-sm text-emerald-700 font-medium leading-relaxed">
          MindMate is engineered with a strict local-first privacy architecture designed to protect vulnerable elderly patients and their families.
        </p>
      </div>

      {/* 3 Core Privacy Pillars */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white rounded-3xl p-6 border border-emerald-100 shadow-xs space-y-2">
          <div className="w-10 h-10 rounded-2xl bg-emerald-50 text-emerald-800 flex items-center justify-center font-bold mb-3">
            <Database className="w-5 h-5" />
          </div>
          <h3 className="text-base font-bold text-emerald-950">Local-First Storage</h3>
          <p className="text-xs text-emerald-700 leading-relaxed font-normal">
            All game scores, personal daily routines, and reminder confirmations are stored on device memory first, avoiding unnecessary third-party data tracking.
          </p>
        </div>

        <div className="bg-white rounded-3xl p-6 border border-emerald-100 shadow-xs space-y-2">
          <div className="w-10 h-10 rounded-2xl bg-teal-50 text-teal-800 flex items-center justify-center font-bold mb-3">
            <Lock className="w-5 h-5" />
          </div>
          <h3 className="text-base font-bold text-emerald-950">Role-Based Circles</h3>
          <p className="text-xs text-emerald-700 leading-relaxed font-normal">
            Only verified family members and certified community nurses linked to the patient profile can view cognitive trends and care alerts.
          </p>
        </div>

        <div className="bg-white rounded-3xl p-6 border border-emerald-100 shadow-xs space-y-2">
          <div className="w-10 h-10 rounded-2xl bg-amber-50 text-amber-800 flex items-center justify-center font-bold mb-3">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <h3 className="text-base font-bold text-emerald-950">Zero Invasive Ads</h3>
          <p className="text-xs text-emerald-700 leading-relaxed font-normal">
            MindMate is completely ad-free and contains no distracting popups, trackers, or commercial telemetry to maintain peace of mind.
          </p>
        </div>
      </div>

      {/* Data Management & Reset Controls */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-emerald-100 shadow-xs space-y-4">
        <h3 className="text-lg font-bold text-emerald-950">Manage Local Patient Data</h3>
        <p className="text-xs sm:text-sm text-emerald-700 font-medium">
          You can reset or clear all locally cached activity logs, custom reminders, and game high scores at any time.
        </p>

        <div className="pt-2 flex flex-wrap items-center gap-3">
          <button
            onClick={handleClear}
            className="px-5 py-3 rounded-2xl bg-rose-50 hover:bg-rose-100 text-rose-800 border border-rose-200 font-bold text-xs sm:text-sm flex items-center gap-2 transition-all cursor-pointer"
          >
            <Trash2 className="w-4 h-4 text-rose-600" />
            <span>Clear Local Cached Sessions & Reset</span>
          </button>

          {cleared && (
            <span className="text-xs font-bold text-emerald-800 flex items-center gap-1">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>Reset complete! All default data restored.</span>
            </span>
          )}
        </div>
      </div>

      {/* Mandatory Medical & Ethical Disclaimer */}
      <div className="bg-amber-50/80 border border-amber-200 rounded-3xl p-6 text-xs text-amber-950 space-y-2">
        <div className="flex items-center gap-2 font-bold text-amber-900 text-sm">
          <ShieldAlert className="w-4 h-4 text-amber-700" />
          <span>Regulatory & Medical Disclaimer</span>
        </div>
        <p className="leading-relaxed font-normal">
          MindMate NER is designed as a supportive cognitive stimulation, memory assistance, and caregiver communication companion. It is not an FDA / CDSCO certified medical device and is not intended to diagnose, cure, treat, or prevent Alzheimer's disease, dementia, or other neurological disorders. Consult a qualified medical neurologist or psychiatrist for clinical evaluation.
        </p>
      </div>

    </div>
  );
};
