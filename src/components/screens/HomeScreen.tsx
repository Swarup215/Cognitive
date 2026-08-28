import React from 'react';
import { useApp } from '../../context/AppContext';
import { 
  Play, 
  Mic, 
  Gamepad2, 
  Users, 
  Bell, 
  Sparkles, 
  ArrowRight, 
  CheckCircle2, 
  Clock, 
  Volume2, 
  ShieldCheck, 
  Heart,
  Droplets,
  Pill,
  PhoneCall,
  Calendar
} from 'lucide-react';
import { playReminderDoneSound } from '../../utils/audioSynth';

export const HomeScreen: React.FC = () => {
  const { 
    navigate, 
    patient, 
    reminders, 
    toggleReminder, 
    setVoiceModalOpen, 
    t, 
    speak 
  } = useApp();

  const activeReminders = reminders.slice(0, 3);

  const getReminderIcon = (type: string) => {
    switch (type) {
      case 'medicine': return <Pill className="w-5 h-5 text-rose-600" />;
      case 'hydration': return <Droplets className="w-5 h-5 text-blue-600" />;
      case 'call': return <PhoneCall className="w-5 h-5 text-amber-600" />;
      case 'appointment': return <Calendar className="w-5 h-5 text-teal-600" />;
      default: return <Bell className="w-5 h-5 text-emerald-600" />;
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 pb-24 space-y-8" id="home-screen-root">
      
      {/* Top Welcome Hero Section */}
      <section 
        className="bg-gradient-to-br from-emerald-800 via-teal-900 to-emerald-950 rounded-3xl p-6 sm:p-8 text-white shadow-xl relative overflow-hidden border border-emerald-700/50"
        id="welcome-hero-banner"
      >
        {/* Subtle Decorative Background Elements */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute bottom-0 left-1/3 w-64 h-64 bg-teal-400/10 rounded-full blur-2xl pointer-events-none"></div>

        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          
          {/* Left Column: Greeting & Action Buttons */}
          <div className="lg:col-span-7 space-y-4 text-left">
            
            <div className="inline-flex items-center gap-2 bg-white/15 backdrop-blur-md px-3.5 py-1.5 rounded-full text-xs font-bold tracking-wider uppercase text-emerald-100 border border-white/20">
              <span className="w-2 h-2 rounded-full bg-lime-400 animate-ping"></span>
              <span>{t.welcomeBack}</span>
            </div>

            <div className="space-y-1">
              <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white flex items-center gap-2">
                <span>{t.greetingPrefix}, {patient.name}</span>
                <span className="text-2xl sm:text-3xl">👋</span>
              </h2>
              <p className="text-sm sm:text-base text-emerald-100/90 font-normal max-w-xl leading-relaxed">
                {t.homeHeroMessage}
              </p>
            </div>

            {/* Main Action Buttons */}
            <div className="flex flex-wrap gap-3 pt-2">
              <button
                onClick={() => navigate('games')}
                className="px-6 py-3.5 rounded-2xl bg-white text-emerald-950 hover:bg-emerald-50 font-bold text-sm sm:text-base shadow-md hover:shadow-lg transition-all transform hover:-translate-y-0.5 flex items-center gap-2.5 cursor-pointer"
                id="hero-start-activity-btn"
              >
                <div className="w-7 h-7 rounded-xl bg-emerald-800 text-white flex items-center justify-center">
                  <Play className="w-4 h-4 fill-white ml-0.5" />
                </div>
                <span>{t.startTodayActivity}</span>
              </button>

              <button
                onClick={() => setVoiceModalOpen(true)}
                className="px-5 py-3.5 rounded-2xl bg-emerald-700/80 hover:bg-emerald-600/90 text-white font-bold text-sm sm:text-base border border-emerald-400/40 shadow-sm transition-all flex items-center gap-2.5 cursor-pointer backdrop-blur-sm"
                id="hero-voice-assistant-btn"
              >
                <Mic className="w-5 h-5 text-emerald-200" />
                <span>{t.talkToMindMate}</span>
              </button>
            </div>

          </div>

          {/* Right Column: Calm North Eastern India Landscape Visual Card */}
          <div className="lg:col-span-5">
            <div 
              className="bg-white/10 backdrop-blur-md rounded-3xl p-5 border border-white/20 shadow-inner relative overflow-hidden"
              id="ner-landscape-card"
            >
              <div className="flex items-center justify-between mb-3 text-xs font-bold text-emerald-100">
                <span className="uppercase tracking-wider flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-lime-300" />
                  {t.todaysFocus}
                </span>
                <span className="bg-white/20 px-2.5 py-0.5 rounded-full text-[11px] font-semibold text-emerald-50">
                  {t.focusSub}
                </span>
              </div>

              {/* Serene North East Vector Artwork: Tea hills, Brahmaputra river, misty peaks */}
              <div className="rounded-2xl overflow-hidden bg-gradient-to-b from-sky-400 via-teal-700 to-emerald-950 h-44 relative flex items-end justify-center shadow-md">
                
                {/* Sun & Sky */}
                <div className="absolute top-4 right-8 w-10 h-10 rounded-full bg-amber-200/90 shadow-lg shadow-amber-300/40"></div>
                <div className="absolute top-7 left-6 w-16 h-3 bg-white/40 rounded-full blur-[1px]"></div>
                <div className="absolute top-11 right-20 w-12 h-2.5 bg-white/30 rounded-full blur-[1px]"></div>

                {/* Distant Hills (Himalayan / Patkai foothills) */}
                <svg className="w-full h-32 absolute bottom-0 left-0" viewBox="0 0 400 120" preserveAspectRatio="none">
                  {/* Layer 1: High Mist Mountains */}
                  <path d="M0,120 L0,55 Q60,20 120,45 T240,30 T360,50 L400,60 L400,120 Z" fill="#065f46" opacity="0.6" />
                  {/* Layer 2: Rolling Tea Valleys */}
                  <path d="M0,120 L0,70 Q80,45 160,65 T320,55 L400,75 L400,120 Z" fill="#047857" opacity="0.85" />
                  {/* Layer 3: Foreground River & Green Slope */}
                  <path d="M0,120 L0,90 Q90,75 190,88 T400,85 L400,120 Z" fill="#064e3b" />
                  <path d="M0,120 Q120,105 240,115 T400,110 L400,120 Z" fill="#0284c7" opacity="0.5" />
                </svg>

                {/* Gentle Elder Character & Plant Silhouette */}
                <div className="relative z-10 pb-3 flex items-center gap-2 bg-emerald-950/60 backdrop-blur-xs px-3.5 py-1 rounded-full text-xs font-semibold text-emerald-100 border border-emerald-400/30">
                  <span>🍃 Peaceful Valleys of North East India</span>
                </div>
              </div>

              <div className="mt-3 flex items-center justify-between text-xs text-emerald-200">
                <span>Active Daily Streak: <strong>7 Days</strong></span>
                <span className="text-lime-300 font-semibold">Weekly Score: 82%</span>
              </div>

            </div>
          </div>

        </div>
      </section>

      {/* Four Feature Cards */}
      <section className="space-y-3" id="four-features-section">
        <h3 className="text-lg font-bold text-emerald-950 px-1">
          Explore Activities & Support
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
          
          {/* Card 1: Cognitive Games */}
          <div
            onClick={() => navigate('games')}
            className="bg-white rounded-3xl p-5 border border-emerald-100 hover:border-emerald-300 shadow-xs hover:shadow-md transition-all duration-200 cursor-pointer group flex flex-col justify-between"
            id="card-cognitive-games"
          >
            <div>
              <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-800 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <Gamepad2 className="w-6 h-6" />
              </div>
              <h4 className="text-lg font-bold text-emerald-950 group-hover:text-emerald-800 transition-colors">
                {t.cognitiveGamesTitle}
              </h4>
              <p className="text-xs sm:text-sm text-emerald-700 font-normal mt-1 leading-relaxed">
                {t.cognitiveGamesDesc}
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-emerald-50 flex items-center justify-between text-xs font-bold text-emerald-800 group-hover:text-emerald-950">
              <span>5 Activities Available</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>

          {/* Card 2: Family & Caregiver */}
          <div
            onClick={() => navigate('caregiver')}
            className="bg-white rounded-3xl p-5 border border-emerald-100 hover:border-emerald-300 shadow-xs hover:shadow-md transition-all duration-200 cursor-pointer group flex flex-col justify-between"
            id="card-family-caregiver"
          >
            <div>
              <div className="w-12 h-12 rounded-2xl bg-teal-100 text-teal-800 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <Users className="w-6 h-6" />
              </div>
              <h4 className="text-lg font-bold text-emerald-950 group-hover:text-teal-800 transition-colors">
                {t.familyCaregiverTitle}
              </h4>
              <p className="text-xs sm:text-sm text-emerald-700 font-normal mt-1 leading-relaxed">
                {t.familyCaregiverDesc}
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-emerald-50 flex items-center justify-between text-xs font-bold text-teal-800 group-hover:text-teal-950">
              <span>3 Contacts Connected</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>

          {/* Card 3: Voice Assistant */}
          <div
            onClick={() => setVoiceModalOpen(true)}
            className="bg-white rounded-3xl p-5 border border-emerald-100 hover:border-emerald-300 shadow-xs hover:shadow-md transition-all duration-200 cursor-pointer group flex flex-col justify-between"
            id="card-voice-assistant"
          >
            <div>
              <div className="w-12 h-12 rounded-2xl bg-amber-100 text-amber-800 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <Mic className="w-6 h-6" />
              </div>
              <h4 className="text-lg font-bold text-emerald-950 group-hover:text-amber-800 transition-colors">
                {t.voiceAssistantTitle}
              </h4>
              <p className="text-xs sm:text-sm text-emerald-700 font-normal mt-1 leading-relaxed">
                {t.voiceAssistantDesc}
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-emerald-50 flex items-center justify-between text-xs font-bold text-amber-800 group-hover:text-amber-950">
              <span>Multilingual Sathi</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>

          {/* Card 4: My Reminders */}
          <div
            onClick={() => navigate('reminders')}
            className="bg-white rounded-3xl p-5 border border-emerald-100 hover:border-emerald-300 shadow-xs hover:shadow-md transition-all duration-200 cursor-pointer group flex flex-col justify-between"
            id="card-my-reminders"
          >
            <div>
              <div className="w-12 h-12 rounded-2xl bg-rose-100 text-rose-800 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <Bell className="w-6 h-6" />
              </div>
              <h4 className="text-lg font-bold text-emerald-950 group-hover:text-rose-800 transition-colors">
                {t.myRemindersTitle}
              </h4>
              <p className="text-xs sm:text-sm text-emerald-700 font-normal mt-1 leading-relaxed">
                {t.myRemindersDesc}
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-emerald-50 flex items-center justify-between text-xs font-bold text-rose-800 group-hover:text-rose-950">
              <span>{reminders.filter(r => !r.completed).length} Pending Today</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>

        </div>
      </section>

      {/* Today's Reminders Preview List */}
      <section className="bg-white rounded-3xl p-6 border border-emerald-100 shadow-xs space-y-4" id="todays-reminders-preview">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Bell className="w-5 h-5 text-emerald-800" />
            <h3 className="text-lg font-bold text-emerald-950">
              {t.todaysReminders}
            </h3>
          </div>

          <button
            onClick={() => navigate('reminders')}
            className="text-xs sm:text-sm font-bold text-emerald-800 hover:text-emerald-950 hover:underline flex items-center gap-1 cursor-pointer"
            id="view-all-reminders-btn"
          >
            <span>{t.viewAll}</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {activeReminders.map(reminder => (
            <div
              key={reminder.id}
              className={`p-4 rounded-2xl border transition-all flex items-center justify-between gap-3 ${
                reminder.completed
                  ? 'bg-emerald-50/50 border-emerald-200 opacity-75'
                  : 'bg-white border-emerald-100 hover:border-emerald-300 shadow-2xs'
              }`}
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-50 border border-emerald-200/80 flex items-center justify-center shrink-0">
                  {getReminderIcon(reminder.type)}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-emerald-800 flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {reminder.time}
                    </span>
                    <span className="text-[11px] font-semibold text-emerald-600/80 bg-emerald-50 px-2 py-0.2 rounded-full">
                      {reminder.date}
                    </span>
                  </div>
                  <h5 className={`text-sm font-bold text-emerald-950 ${reminder.completed ? 'line-through text-emerald-700' : ''}`}>
                    {reminder.title}
                  </h5>
                </div>
              </div>

              {/* Complete Action Button */}
              <button
                onClick={() => toggleReminder(reminder.id)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer shrink-0 ${
                  reminder.completed
                    ? 'bg-emerald-700 text-white'
                    : 'bg-emerald-100 text-emerald-900 hover:bg-emerald-200'
                }`}
                id={`rem-toggle-${reminder.id}`}
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>{reminder.completed ? t.done : t.done}</span>
              </button>
            </div>
          ))}
        </div>
      </section>

      {/* Safety Notice Banner */}
      <footer className="bg-emerald-50/70 border border-emerald-200/70 rounded-2xl p-4 text-center text-xs text-emerald-800/90 font-medium">
        <p>
          🌿 {t.safetyDisclaimer}
        </p>
      </footer>

    </div>
  );
};
