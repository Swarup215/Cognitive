import React from 'react';
import { useApp } from '../context/AppContext';
import { Leaf, Brain, Wifi, WifiOff, RefreshCw, Settings, ShieldCheck, Sparkles, User, Users, Volume2 } from 'lucide-react';

export const Header: React.FC = () => {
  const { 
    currentView, 
    navigate, 
    userMode, 
    setUserMode, 
    networkStatus, 
    setNetworkStatus, 
    pendingSyncCount, 
    triggerManualSync, 
    t,
    startJudgeDemo,
    judgeDemoActive,
    speak
  } = useApp();

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-emerald-100 shadow-xs px-4 sm:px-6 py-3 transition-all" id="app-header">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-3">
        
        {/* Left Side: Brand Logo & Title */}
        <div 
          onClick={() => navigate('home')} 
          className="flex items-center gap-3 cursor-pointer group"
          id="brand-logo-btn"
          role="button"
          aria-label="MindMate Home"
        >
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-emerald-700 via-teal-700 to-emerald-900 flex items-center justify-center text-white shadow-sm border border-emerald-600/30 group-hover:scale-105 transition-transform">
            <div className="relative flex items-center justify-center">
              <Brain className="w-6 h-6 text-emerald-100" />
              <Leaf className="w-4 h-4 text-lime-300 absolute -bottom-1 -right-1" />
            </div>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-emerald-950 flex items-center gap-1.5">
                {t.appName}
              </h1>
            </div>
            <p className="text-xs sm:text-sm font-medium text-emerald-700/90">
              {t.tagline}
            </p>
          </div>
        </div>

        {/* Right Side: Mode Switcher, Settings, Judge Demo */}
        <div className="flex flex-wrap items-center gap-2 sm:gap-3" id="header-actions">
          
          {/* Sathi (Elderly) vs Command (Caregiver) Mode Pill */}
          <div className="bg-emerald-50/90 p-1 rounded-xl border border-emerald-200/80 flex items-center gap-1 text-xs font-semibold" id="mode-switcher">
            <button
              onClick={() => {
                setUserMode('sathi');
                if (currentView === 'caregiver' || currentView === 'cognitive-report' || currentView === 'care-alerts') {
                  navigate('home');
                }
              }}
              className={`px-3 py-1.5 rounded-lg transition-all flex items-center gap-1.5 ${
                userMode === 'sathi'
                  ? 'bg-emerald-700 text-white shadow-xs'
                  : 'text-emerald-800 hover:bg-emerald-100/60'
              }`}
              id="mode-sathi-btn"
              title="Elderly-friendly calm interaction mode"
            >
              <User className="w-3.5 h-3.5" />
              <span>Sathi</span>
            </button>
            <button
              onClick={() => {
                setUserMode('command');
                navigate('caregiver');
              }}
              className={`px-3 py-1.5 rounded-lg transition-all flex items-center gap-1.5 ${
                userMode === 'command'
                  ? 'bg-teal-800 text-white shadow-xs'
                  : 'text-emerald-800 hover:bg-emerald-100/60'
              }`}
              id="mode-command-btn"
              title="Caregiver analytics and monitoring dashboard"
            >
              <Users className="w-3.5 h-3.5" />
              <span>Command</span>
            </button>
          </div>

          {/* Judge SIH Tour Trigger */}
          <button
            onClick={startJudgeDemo}
            className={`px-3 py-1.5 rounded-xl border text-xs font-bold transition-all flex items-center gap-1.5 ${
              judgeDemoActive 
                ? 'bg-amber-400 text-amber-950 border-amber-500 shadow-xs animate-bounce'
                : 'bg-gradient-to-r from-amber-100 to-amber-50 text-amber-900 border-amber-300 hover:bg-amber-200'
            }`}
            id="sih-judge-tour-btn"
            title="Start SIH Guided Demo Walkthrough"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-700" />
            <span>Judge Demo</span>
          </button>

          {/* Settings Button */}
          <button
            onClick={() => navigate('settings')}
            className={`p-2 rounded-xl border transition-all text-emerald-900 ${
              currentView === 'settings' || currentView === 'language-culture' || currentView === 'privacy'
                ? 'bg-emerald-100 border-emerald-400'
                : 'bg-emerald-50/80 border-emerald-200 hover:bg-emerald-100'
            }`}
            id="header-settings-btn"
            aria-label="Settings"
            title="Personalization & Settings"
          >
            <Settings className="w-4 h-4" />
          </button>

        </div>
      </div>
    </header>
  );
};
