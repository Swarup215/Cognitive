import React from 'react';
import { useApp } from '../../context/AppContext';
import { 
  Users, 
  TrendingUp, 
  AlertTriangle, 
  CheckCircle2, 
  Clock, 
  ArrowRight, 
  Phone, 
  MessageSquare, 
  ShieldCheck, 
  Sparkles, 
  Activity,
  FileText,
  Bell,
  Heart
} from 'lucide-react';

export const CaregiverDashboardScreen: React.FC = () => {
  const { 
    navigate, 
    patient, 
    cognitiveMetrics, 
    caregivers, 
    careAlerts, 
    reminders, 
    t, 
    speak 
  } = useApp();

  const unresolvedAlerts = careAlerts.filter(a => !a.resolved);
  const pendingReminders = reminders.filter(r => !r.completed);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 pb-24 space-y-8" id="caregiver-dashboard-screen">
      
      {/* Top Header */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-emerald-100 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 text-xs font-bold text-teal-800 uppercase tracking-wider bg-teal-50 px-3 py-1 rounded-full mb-1">
            <Activity className="w-3.5 h-3.5 text-teal-600" />
            <span>{t.caregiverDashboardTitle}</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-emerald-950 flex items-center gap-2">
            <span>{t.ashasProgress}</span>
            <span className="text-sm font-semibold text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
              Age {patient.age} • {patient.city}
            </span>
          </h1>
          <p className="text-sm sm:text-base text-emerald-700 font-medium mt-1 max-w-2xl leading-relaxed">
            Continuous remote monitoring, medication adherence tracking, and cognitive engagement insights for families and community health nurses.
          </p>
        </div>

        <button
          onClick={() => navigate('cognitive-report')}
          className="inline-flex items-center gap-2 px-5 py-3 rounded-2xl bg-teal-700 hover:bg-teal-800 text-white font-bold text-sm shadow-xs transition-all w-fit cursor-pointer shrink-0"
          id="view-summary-report-btn"
        >
          <FileText className="w-4 h-4" />
          <span>{t.summary} Report</span>
        </button>
      </div>

      {/* Two Major Dashboard Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6" id="caregiver-major-cards">
        
        {/* LEFT CARD: Cognitive Activity Overview (7 cols) */}
        <div className="lg:col-span-7 bg-white rounded-3xl p-6 sm:p-7 border border-emerald-100 shadow-xs flex flex-col justify-between space-y-6">
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-emerald-950 flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-emerald-600" />
                <span>{t.cognitiveActivity}</span>
              </h2>
              <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
                Last 7 Days
              </span>
            </div>

            {/* Score & Growth Indicators */}
            <div className="grid grid-cols-2 gap-4 bg-emerald-50/70 p-4 rounded-2xl border border-emerald-200/80 mb-6">
              <div>
                <span className="text-3xl sm:text-4xl font-extrabold text-emerald-950 block">
                  {cognitiveMetrics.weeklyActivityScore}%
                </span>
                <span className="text-xs sm:text-sm font-semibold text-emerald-800">
                  {t.weeklyScore}
                </span>
              </div>
              <div className="border-l border-emerald-200 pl-4">
                <span className="text-3xl sm:text-4xl font-extrabold text-teal-800 block flex items-center gap-1">
                  +{cognitiveMetrics.accuracyGrowth}%
                  <TrendingUp className="w-5 h-5 text-teal-600" />
                </span>
                <span className="text-xs sm:text-sm font-semibold text-teal-800">
                  {t.accuracyThisWeek}
                </span>
              </div>
            </div>

            {/* Progress Bars for Games */}
            <div className="space-y-4">
              
              {/* Memory Match Progress */}
              <div>
                <div className="flex justify-between text-xs sm:text-sm font-bold text-emerald-950 mb-1">
                  <span className="flex items-center gap-1.5">
                    <span>🦏</span>
                    <span>Memory Match</span>
                  </span>
                  <span className="text-emerald-800">{cognitiveMetrics.memoryScore}%</span>
                </div>
                <div className="w-full h-3 bg-emerald-100 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-emerald-600 rounded-full transition-all duration-500" 
                    style={{ width: `${cognitiveMetrics.memoryScore}%` }}
                  ></div>
                </div>
              </div>

              {/* Candy Match & Attention */}
              <div>
                <div className="flex justify-between text-xs sm:text-sm font-bold text-emerald-950 mb-1">
                  <span className="flex items-center gap-1.5">
                    <span>🍓</span>
                    <span>Candy Match (Attention)</span>
                  </span>
                  <span className="text-teal-800">{cognitiveMetrics.attentionScore}%</span>
                </div>
                <div className="w-full h-3 bg-emerald-100 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-teal-600 rounded-full transition-all duration-500" 
                    style={{ width: `${cognitiveMetrics.attentionScore}%` }}
                  ></div>
                </div>
              </div>

              {/* Pattern Garden */}
              <div>
                <div className="flex justify-between text-xs sm:text-sm font-bold text-emerald-950 mb-1">
                  <span className="flex items-center gap-1.5">
                    <span>🌿</span>
                    <span>Pattern Garden</span>
                  </span>
                  <span className="text-lime-800">{cognitiveMetrics.patternScore}%</span>
                </div>
                <div className="w-full h-3 bg-emerald-100 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-lime-600 rounded-full transition-all duration-500" 
                    style={{ width: `${cognitiveMetrics.patternScore}%` }}
                  ></div>
                </div>
              </div>

              {/* Daily Routine Recall */}
              <div>
                <div className="flex justify-between text-xs sm:text-sm font-bold text-emerald-950 mb-1">
                  <span className="flex items-center gap-1.5">
                    <span>📅</span>
                    <span>Daily Recall</span>
                  </span>
                  <span className="text-amber-800">{cognitiveMetrics.recallScore}%</span>
                </div>
                <div className="w-full h-3 bg-emerald-100 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-amber-600 rounded-full transition-all duration-500" 
                    style={{ width: `${cognitiveMetrics.recallScore}%` }}
                  ></div>
                </div>
              </div>

            </div>
          </div>

          <button
            onClick={() => navigate('cognitive-report')}
            className="w-full py-3.5 rounded-2xl bg-emerald-50 hover:bg-emerald-100 text-emerald-950 font-bold text-sm border border-emerald-200 transition-all flex items-center justify-center gap-2 cursor-pointer"
            id="view-full-report-btn"
          >
            <span>{t.viewFullReport}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        {/* RIGHT CARD: Care Alerts & Real-time Reminders (5 cols) */}
        <div className="lg:col-span-5 bg-white rounded-3xl p-6 sm:p-7 border border-emerald-100 shadow-xs flex flex-col justify-between space-y-6">
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-emerald-950 flex items-center gap-2">
                <Bell className="w-5 h-5 text-amber-600" />
                <span>{t.careAlerts}</span>
              </h2>
              <button
                onClick={() => navigate('care-alerts')}
                className="text-xs font-bold text-emerald-800 hover:text-emerald-950 underline"
              >
                Manage
              </button>
            </div>

            {/* Care status badges */}
            <div className="space-y-3">
              
              {/* Medicine status */}
              <div className="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200/80 flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <span className="text-xl">💊</span>
                  <div>
                    <span className="text-xs font-bold text-emerald-950 block">Medicine</span>
                    <span className="text-[11px] text-emerald-700">BP Tablet (Amlodipine 5mg)</span>
                  </div>
                </div>
                <span className="text-xs font-bold bg-emerald-200 text-emerald-900 px-2.5 py-1 rounded-full">
                  Completed
                </span>
              </div>

              {/* Hydration status */}
              <div className="p-3.5 rounded-2xl bg-amber-50 border border-amber-200/80 flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <span className="text-xl">💧</span>
                  <div>
                    <span className="text-xs font-bold text-amber-950 block">Hydration</span>
                    <span className="text-[11px] text-amber-800">20:30 Evening Glass</span>
                  </div>
                </div>
                <span className="text-xs font-bold bg-amber-200 text-amber-950 px-2.5 py-1 rounded-full animate-pulse">
                  Pending
                </span>
              </div>

              {/* Appointment status */}
              <div className="p-3.5 rounded-2xl bg-teal-50 border border-teal-200/80 flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <span className="text-xl">📅</span>
                  <div>
                    <span className="text-xs font-bold text-teal-950 block">Appointment</span>
                    <span className="text-[11px] text-teal-800">Dr. Barua Neurological Check</span>
                  </div>
                </div>
                <span className="text-xs font-bold bg-teal-200 text-teal-950 px-2.5 py-1 rounded-full">
                  Tomorrow
                </span>
              </div>

              {/* Last activity timestamp */}
              <div className="p-3.5 rounded-2xl bg-gray-50 border border-gray-200 flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <span className="text-xl">🎮</span>
                  <div>
                    <span className="text-xs font-bold text-gray-900 block">Last Active</span>
                    <span className="text-[11px] text-gray-600">Candy Match Level 1</span>
                  </div>
                </div>
                <span className="text-xs font-bold text-gray-700">
                  18 min ago
                </span>
              </div>

            </div>
          </div>

          <button
            onClick={() => navigate('reminders')}
            className="w-full py-3.5 rounded-2xl bg-emerald-50 hover:bg-emerald-100 text-emerald-950 font-bold text-sm border border-emerald-200 transition-all flex items-center justify-center gap-2 cursor-pointer"
            id="view-all-rem-btn"
          >
            <Bell className="w-4 h-4 text-emerald-700" />
            <span>{t.viewAllReminders}</span>
          </button>
        </div>

      </div>

      {/* Connected Family Members & Support Network */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-emerald-100 shadow-xs space-y-4" id="family-support-section">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-xl font-bold text-emerald-950 flex items-center gap-2">
              <Users className="w-5 h-5 text-emerald-700" />
              <span>Family Members & Caregivers</span>
            </h3>
            <p className="text-xs sm:text-sm text-emerald-700 font-medium">
              Connected circles of care to reduce social isolation in remote North Eastern communities.
            </p>
          </div>
          <button
            onClick={() => navigate('family')}
            className="text-xs sm:text-sm font-bold text-emerald-800 hover:text-emerald-950 underline cursor-pointer"
          >
            View all ({caregivers.length})
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {caregivers.map(person => (
            <div
              key={person.id}
              className="p-4 rounded-2xl bg-emerald-50/50 border border-emerald-200/80 flex flex-col justify-between gap-3"
            >
              <div className="flex items-center gap-3">
                <span className="text-3xl">{person.avatar}</span>
                <div>
                  <h4 className="text-sm font-bold text-emerald-950">{person.name}</h4>
                  <span className="text-xs font-semibold text-emerald-700">{person.relationship}</span>
                  <span className="text-[10px] text-emerald-600 block mt-0.5">● Connected</span>
                </div>
              </div>

              <div className="flex items-center gap-2 pt-2 border-t border-emerald-200/60">
                <button
                  onClick={() => {
                    speak(`Calling ${person.name}...`);
                    navigate('family');
                  }}
                  className="flex-1 py-1.5 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-1 transition-all cursor-pointer"
                >
                  <Phone className="w-3.5 h-3.5" />
                  <span>Call</span>
                </button>
                <button
                  onClick={() => navigate('family')}
                  className="p-1.5 bg-white hover:bg-emerald-100 text-emerald-900 border border-emerald-200 rounded-xl text-xs font-bold transition-all"
                  title="Send message"
                >
                  <MessageSquare className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};
