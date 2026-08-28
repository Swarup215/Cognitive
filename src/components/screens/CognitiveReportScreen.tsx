import React from 'react';
import { useApp } from '../../context/AppContext';
import { 
  ArrowLeft, 
  Sparkles, 
  TrendingUp, 
  Award, 
  Clock, 
  CheckCircle2, 
  ShieldAlert, 
  Brain, 
  Download,
  Share2
} from 'lucide-react';

export const CognitiveReportScreen: React.FC = () => {
  const { navigate, cognitiveMetrics, gameSessions, patient, t } = useApp();

  const metricsBreakdown = [
    { label: 'Memory', score: cognitiveMetrics.memoryScore, icon: '🦏', color: 'bg-emerald-600' },
    { label: 'Attention', score: cognitiveMetrics.attentionScore, icon: '🍓', color: 'bg-teal-600' },
    { label: 'Recall', score: cognitiveMetrics.recallScore, icon: '📅', color: 'bg-amber-600' },
    { label: 'Pattern Recognition', score: cognitiveMetrics.patternScore, icon: '🌿', color: 'bg-lime-600' },
  ];

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-6 pb-24 space-y-8" id="cognitive-report-screen">
      
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <button
          onClick={() => navigate('caregiver')}
          className="inline-flex items-center gap-2 text-emerald-800 hover:text-emerald-950 font-bold text-sm bg-emerald-50 hover:bg-emerald-100 px-4 py-2 rounded-xl transition-all w-fit"
          id="report-back-btn"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Caregiver Dashboard</span>
        </button>

        <div className="flex items-center gap-2">
          <button
            onClick={() => window.print()}
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-white border border-emerald-200 text-xs font-bold text-emerald-900 hover:bg-emerald-50 transition-all shadow-2xs cursor-pointer"
            id="print-report-btn"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Print Report</span>
          </button>
        </div>
      </div>

      {/* Main Title Box */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-emerald-100 shadow-xs space-y-3">
        <div className="flex items-center gap-2 text-xs font-bold text-teal-800 uppercase tracking-wider bg-teal-50 px-3 py-1 rounded-full w-fit">
          <Brain className="w-3.5 h-3.5 text-teal-600" />
          <span>Caregiver & Clinical Engagement Report</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-emerald-950">
          Cognitive Activity Analytics for {patient.name}
        </h1>
        <p className="text-xs sm:text-sm text-emerald-700 font-medium max-w-3xl leading-relaxed">
          Aggregated weekly engagement metrics based on adaptive match-3 attention puzzles, North Eastern cultural memory matching, visual sequences, and daily routine recall sessions.
        </p>
      </div>

      {/* Key 4 Summary Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4" id="report-stat-cards">
        
        <div className="bg-white rounded-3xl p-5 border border-emerald-100 shadow-xs">
          <span className="text-xs font-bold text-emerald-700 uppercase tracking-wider block mb-1">
            Weekly Activity Score
          </span>
          <span className="text-3xl sm:text-4xl font-black text-emerald-950 block">
            {cognitiveMetrics.weeklyActivityScore}%
          </span>
          <span className="text-xs font-semibold text-emerald-600 mt-1 block">
            Consistent Engagement
          </span>
        </div>

        <div className="bg-white rounded-3xl p-5 border border-emerald-100 shadow-xs">
          <span className="text-xs font-bold text-teal-700 uppercase tracking-wider block mb-1">
            Average Accuracy
          </span>
          <span className="text-3xl sm:text-4xl font-black text-teal-900 block">
            84%
          </span>
          <span className="text-xs font-semibold text-teal-700 mt-1 block">
            +{cognitiveMetrics.accuracyGrowth}% this week
          </span>
        </div>

        <div className="bg-white rounded-3xl p-5 border border-emerald-100 shadow-xs">
          <span className="text-xs font-bold text-amber-700 uppercase tracking-wider block mb-1">
            Games Completed
          </span>
          <span className="text-3xl sm:text-4xl font-black text-amber-950 block">
            {cognitiveMetrics.gamesCompletedThisWeek}
          </span>
          <span className="text-xs font-semibold text-amber-700 mt-1 block">
            Across 5 activities
          </span>
        </div>

        <div className="bg-white rounded-3xl p-5 border border-emerald-100 shadow-xs">
          <span className="text-xs font-bold text-lime-700 uppercase tracking-wider block mb-1">
            Avg Session Time
          </span>
          <span className="text-3xl sm:text-4xl font-black text-lime-950 block">
            {cognitiveMetrics.avgSessionDurationMin} min
          </span>
          <span className="text-xs font-semibold text-lime-700 mt-1 block">
            Gentle & stress-free
          </span>
        </div>

      </div>

      {/* Visual Progress Indicators & Domain Breakdown */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-emerald-100 shadow-xs space-y-6">
        <h3 className="text-lg sm:text-xl font-bold text-emerald-950">
          Cognitive Domain Performance
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {metricsBreakdown.map(item => (
            <div key={item.label} className="p-4 rounded-2xl bg-emerald-50/50 border border-emerald-100">
              <div className="flex items-center justify-between text-sm font-bold text-emerald-950 mb-2">
                <span className="flex items-center gap-2">
                  <span className="text-xl">{item.icon}</span>
                  <span>{item.label}</span>
                </span>
                <span className="text-base font-black text-emerald-900">{item.score}%</span>
              </div>
              <div className="w-full h-3.5 bg-emerald-200/60 rounded-full overflow-hidden">
                <div 
                  className={`h-full ${item.color} rounded-full transition-all duration-500`}
                  style={{ width: `${item.score}%` }}
                ></div>
              </div>
            </div>
          ))}
        </div>

        {/* Adaptive AI Recommendation Box */}
        <div className="bg-teal-50 border border-teal-200 rounded-2xl p-4 sm:p-5 flex items-start gap-3">
          <Sparkles className="w-5 h-5 text-teal-700 shrink-0 mt-0.5" />
          <div>
            <h4 className="text-sm font-bold text-teal-950">Adaptive System Observation</h4>
            <p className="text-xs sm:text-sm text-teal-800 font-medium mt-0.5 leading-relaxed">
              {cognitiveMetrics.adaptiveRecommendation}
            </p>
          </div>
        </div>
      </div>

      {/* Weekly Activity Heatmap / Daily Engagement Bar Chart */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-emerald-100 shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg sm:text-xl font-bold text-emerald-950">
            Weekly Activity Distribution
          </h3>
          <span className="text-xs font-semibold text-emerald-700">
            Daily Minutes Logged
          </span>
        </div>

        {/* Day-of-week custom bar visualization */}
        <div className="grid grid-cols-7 gap-2 sm:gap-4 pt-4">
          {cognitiveMetrics.dailyActivityMinutes.map(dayItem => (
            <div key={dayItem.day} className="flex flex-col items-center gap-2">
              <span className="text-xs font-bold text-emerald-800">{dayItem.minutes}m</span>
              
              <div className="w-full bg-emerald-50 rounded-2xl h-32 p-1.5 flex flex-col justify-end border border-emerald-100">
                <div 
                  className="w-full bg-gradient-to-t from-emerald-700 to-teal-500 rounded-xl transition-all duration-500"
                  style={{ height: `${Math.min(100, (dayItem.minutes / 25) * 100)}%` }}
                ></div>
              </div>

              <span className="text-xs font-bold text-emerald-950">{dayItem.day}</span>
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
            </div>
          ))}
        </div>
      </div>

      {/* Recent Activity Log Table */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-emerald-100 shadow-xs space-y-4">
        <h3 className="text-lg sm:text-xl font-bold text-emerald-950">
          Recent Activity Logs
        </h3>

        <div className="divide-y divide-emerald-100 overflow-x-auto">
          {gameSessions.slice(0, 6).map(sess => (
            <div key={sess.id} className="py-3 flex items-center justify-between gap-4 text-xs sm:text-sm">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-xl bg-emerald-50 flex items-center justify-center font-bold text-emerald-900 border border-emerald-200">
                  {sess.game === 'memory-match' && '🦏'}
                  {sess.game === 'candy-match' && '🍓'}
                  {sess.game === 'pattern-garden' && '🌿'}
                  {sess.game === 'object-recall' && '🔍'}
                  {sess.game === 'daily-recall' && '📅'}
                </div>
                <div>
                  <span className="font-bold text-emerald-950 block capitalize">
                    {sess.game.replace('-', ' ')}
                  </span>
                  <span className="text-[11px] text-emerald-700">{sess.completedAt}</span>
                </div>
              </div>

              <div className="flex items-center gap-6">
                <div className="text-right">
                  <span className="font-bold text-emerald-950 block">{sess.accuracy}%</span>
                  <span className="text-[10px] text-emerald-600 uppercase">Accuracy</span>
                </div>
                <div className="text-right">
                  <span className="font-bold text-teal-800 block">{sess.score}</span>
                  <span className="text-[10px] text-teal-600 uppercase">Points</span>
                </div>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                  {sess.difficulty}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Healthcare Safety Disclaimer */}
      <div className="bg-amber-50/80 border border-amber-200 rounded-3xl p-5 text-center text-xs text-amber-950 font-medium space-y-1">
        <p className="font-bold text-amber-900 flex items-center justify-center gap-1.5">
          <ShieldAlert className="w-4 h-4 text-amber-700" />
          <span>MDoNER & Healthcare Safety Notice</span>
        </p>
        <p className="max-w-2xl mx-auto leading-relaxed">
          MindMate provides cognitive engagement and activity tracking. It does not diagnose dementia, Alzheimer's disease, or replace neurological evaluations by certified medical practitioners.
        </p>
      </div>

    </div>
  );
};
