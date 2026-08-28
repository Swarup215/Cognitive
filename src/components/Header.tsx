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
          aria-label="MindMate NER Home"
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
              <span className="text-[11px] font-semibold uppercase tracking-wider bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full border border-emerald-200">
                SIH • MDoNER
              </span>
            </div>
            <p className="text-xs sm:text-sm font-medium text-emerald-700/90">
              {t.tagline}
            </p>
          </div>
        </div>

        {/* Right Side: Mode Switcher, Offline Indicator, Settings, Judge Demo */}
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

          {/* Network State Simulator / Indicator */}
          <div className="flex items-center gap-1 bg-white border border-emerald-200 rounded-xl px-2.5 py-1 shadow-2xs text-xs font-medium text-emerald-900" id="offline-status-pill">
            {networkStatus === 'online' && (
              <button 
                onClick={() => setNetworkStatus('offline')}
                className="flex items-center gap-1.5 text-emerald-700 hover:text-emerald-900"
                title="Click to simulate low/no connectivity in remote NER"
              >
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
                <span className="hidden sm:inline font-semibold">🟢 {t.offlineReady}</span>
                <span className="sm:hidden font-semibold">🟢 Online</span>
              </button>
            )}

            {networkStatus === 'offline' && (
              <button 
                onClick={() => setNetworkStatus('online')}
                className="flex items-center gap-1.5 text-amber-800 hover:text-amber-950 font-semibold"
                title="Click to simulate reconnection and sync"
              >
                <WifiOff className="w-3.5 h-3.5 text-amber-600" />
                <span>🔴 Offline ({pendingSyncCount} pending)</span>
              </button>
            )}

            {networkStatus === 'syncing' && (
              <div className="flex items-center gap-1.5 text-teal-700 font-semibold">
                <RefreshCw className="w-3.5 h-3.5 text-teal-600 animate-spin" />
                <span>🔄 Syncing…</span>
              </div>
            )}
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
