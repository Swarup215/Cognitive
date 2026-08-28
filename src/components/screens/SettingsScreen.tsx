import React from 'react';
import { useApp } from '../../context/AppContext';
import { 
  User, 
  Globe, 
  Type, 
  Volume2, 
  Bell, 
  Users, 
  Wifi, 
  ShieldCheck, 
  Info, 
  ChevronRight, 
  Sparkles,
  RotateCcw,
  Activity
} from 'lucide-react';
import { AppView } from '../../types';

export const SettingsScreen: React.FC = () => {
  const { navigate, patient, networkStatus, setNetworkStatus, resetAllData, t } = useApp();

  const settingsRows = [
    {
      id: 'row-profile',
      title: 'Patient Profile',
      subtitle: `${patient.name} (${patient.age} yrs) • ${patient.city}`,
      icon: User,
      view: 'home' as AppView,
      badge: 'Active',
    },
    {
      id: 'row-lang',
      title: 'Language & Culture',
      subtitle: '10 Regional NER languages & cultural aesthetics',
      icon: Globe,
      view: 'language-culture' as AppView,
      badge: patient.preferredLanguage.toUpperCase(),
    },
    {
      id: 'row-text',
      title: 'Text Size & Readability',
      subtitle: `Current: ${patient.textSize.toUpperCase()} (High Contrast Active)`,
      icon: Type,
      view: 'language-culture' as AppView,
      badge: patient.textSize,
    },
    {
      id: 'row-voice',
      title: 'Voice Assistant (Sathi)',
      subtitle: 'Speech recognition, audio narration & chime settings',
      icon: Volume2,
      view: 'voice' as AppView,
      badge: patient.voiceEnabled ? 'Enabled' : 'Muted',
    },
    {
      id: 'row-reminders',
      title: 'Reminders & Schedules',
      subtitle: 'Medicine, hydration, daily routines & appointments',
      icon: Bell,
      view: 'reminders' as AppView,
    },
    {
      id: 'row-caregiver',
      title: 'Caregiver & Family Access',
      subtitle: '3 Connected family members and community nurse',
      icon: Users,
      view: 'caregiver' as AppView,
      badge: 'Connected',
    },
    {
      id: 'row-privacy',
      title: 'Privacy & Security',
      subtitle: 'Local-first encrypted storage, data permissions & disclaimers',
      icon: ShieldCheck,
      view: 'privacy' as AppView,
    },
  ];

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-6 pb-24 space-y-8" id="settings-screen">
      
      {/* Title Card */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-emerald-100 shadow-xs space-y-2">
        <div className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-800 uppercase tracking-wider bg-emerald-50 px-3 py-1 rounded-full">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Application Settings</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-emerald-950">
          Preferences & Controls
        </h1>
        <p className="text-xs sm:text-sm text-emerald-700 font-medium leading-relaxed">
          Manage personalized display settings, regional language preferences, offline mode, and caregiver permissions.
        </p>
      </div>

      {/* Settings Rows Menu */}
      <div className="bg-white rounded-3xl p-3 sm:p-4 border border-emerald-100 shadow-xs divide-y divide-emerald-50" id="settings-menu-list">
        {settingsRows.map(row => {
          const Icon = row.icon;
          return (
            <button
              key={row.id}
              onClick={() => navigate(row.view)}
              className="w-full p-4 hover:bg-emerald-50/80 rounded-2xl flex items-center justify-between gap-4 transition-all text-left group cursor-pointer"
              id={row.id}
            >
              <div className="flex items-center gap-3.5">
                <div className="w-11 h-11 rounded-2xl bg-emerald-50 border border-emerald-200/80 flex items-center justify-center text-emerald-800 group-hover:scale-105 transition-transform shrink-0">
                  <Icon className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm sm:text-base font-bold text-emerald-950 group-hover:text-emerald-800 transition-colors">
                    {row.title}
                  </h3>
                  <p className="text-xs text-emerald-700 font-medium">
                    {row.subtitle}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                {row.badge && (
                  <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-200">
                    {row.badge}
                  </span>
                )}
                <ChevronRight className="w-4 h-4 text-emerald-400 group-hover:text-emerald-800 group-hover:translate-x-0.5 transition-all" />
              </div>
            </button>
          );
        })}
      </div>

      {/* Offline Mode & Network Controls Box */}
      <div className="bg-white rounded-3xl p-6 border border-emerald-100 shadow-xs space-y-4">
        <div className="flex items-center gap-2">
          <Wifi className="w-5 h-5 text-emerald-700" />
          <h2 className="text-base sm:text-lg font-bold text-emerald-950">Offline Demonstration Mode</h2>
        </div>
        <p className="text-xs sm:text-sm text-emerald-700 font-medium">
          Toggle connectivity states to test offline cognitive games, local reminder completions, and cloud synchronization.
        </p>

        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setNetworkStatus('online')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              networkStatus === 'online'
                ? 'bg-emerald-700 text-white shadow-xs'
                : 'bg-emerald-50 text-emerald-800 hover:bg-emerald-100'
            }`}
          >
            🟢 Online (Normal)
          </button>
          <button
            onClick={() => setNetworkStatus('offline')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              networkStatus === 'offline'
                ? 'bg-amber-600 text-white shadow-xs'
                : 'bg-amber-50 text-amber-900 hover:bg-amber-100'
            }`}
          >
            🔴 Simulate Offline (Remote NER)
          </button>
        </div>
      </div>

      {/* SIH / MDoNER Project Information */}
      <div className="bg-emerald-50/80 rounded-3xl p-6 border border-emerald-200 text-xs sm:text-sm text-emerald-900 space-y-2">
        <div className="flex items-center gap-2 font-bold text-emerald-950">
          <Info className="w-4 h-4 text-emerald-700" />
          <span>About MindMate NER Prototype</span>
        </div>
        <div className="space-y-1 text-emerald-800 leading-relaxed font-normal">
          <p><strong>Problem Statement ID:</strong> 26003</p>
          <p><strong>Title:</strong> AI-Based Cognitive Gaming and Memory Assistance Platform for Elderly Dementia Patients in North Eastern Region (NER)</p>
          <p><strong>Organization:</strong> Ministry of Development of North Eastern Region (MDoNER)</p>
          <p><strong>Theme:</strong> MedTech / HealthTech • Smart India Hackathon Prototype</p>
        </div>

        <div className="pt-3 border-t border-emerald-200/80 flex items-center justify-between">
          <button
            onClick={resetAllData}
            className="text-xs text-rose-700 hover:text-rose-900 font-bold underline flex items-center gap-1 cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset Demo Data to Initial State</span>
          </button>
          <span className="text-[11px] text-emerald-700 font-semibold">v1.0.0 • Offline Ready</span>
        </div>
      </div>

    </div>
  );
};
