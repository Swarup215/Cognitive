import React from 'react';
import { useApp } from '../../context/AppContext';
import { ArrowLeft, Bell, AlertTriangle, CheckCircle2, Clock, ShieldCheck, Heart } from 'lucide-react';

export const CareAlertsScreen: React.FC = () => {
  const { careAlerts, resolveAlert, navigate } = useApp();

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-6 pb-24 space-y-6" id="care-alerts-screen">
      
      {/* Top Header */}
      <div className="flex items-center justify-between gap-4">
        <button
          onClick={() => navigate('caregiver')}
          className="inline-flex items-center gap-2 text-emerald-800 hover:text-emerald-950 font-bold text-sm bg-emerald-50 hover:bg-emerald-100 px-4 py-2 rounded-xl transition-all"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Dashboard</span>
        </button>
      </div>

      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-emerald-100 shadow-xs space-y-2">
        <div className="inline-flex items-center gap-1.5 text-xs font-bold text-amber-800 uppercase tracking-wider bg-amber-50 px-3 py-1 rounded-full">
          <Bell className="w-3.5 h-3.5" />
          <span>Care Monitoring & Notifications</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-emerald-950">
          Caregiver Alerts & Checkpoints
        </h1>
        <p className="text-xs sm:text-sm text-emerald-700 font-medium leading-relaxed">
          Gentle notifications for hydration, routine schedule checks, and family connectivity. No stressful clinical sirens.
        </p>
      </div>

      <div className="space-y-4">
        {careAlerts.map(alert => (
          <div
            key={alert.id}
            className={`p-5 rounded-3xl border-2 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${
              alert.resolved
                ? 'bg-emerald-50/40 border-emerald-200 opacity-75'
                : alert.type === 'warning'
                ? 'bg-amber-50/70 border-amber-300 shadow-xs'
                : 'bg-white border-emerald-200'
            }`}
          >
            <div className="flex items-start gap-3.5">
              <div className={`w-11 h-11 rounded-2xl flex items-center justify-center shrink-0 mt-0.5 ${
                alert.resolved 
                  ? 'bg-emerald-100 text-emerald-800' 
                  : alert.type === 'warning' 
                  ? 'bg-amber-200 text-amber-900' 
                  : 'bg-teal-100 text-teal-800'
              }`}>
                {alert.resolved ? (
                  <CheckCircle2 className="w-5 h-5" />
                ) : alert.type === 'warning' ? (
                  <AlertTriangle className="w-5 h-5" />
                ) : (
                  <Bell className="w-5 h-5" />
                )}
              </div>

              <div>
                <div className="flex items-center gap-2 mb-0.5">
                  <span className="text-xs font-bold text-emerald-800 flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {alert.time}
                  </span>
                  <span className="text-[10px] font-bold uppercase tracking-wider bg-white px-2 py-0.5 rounded-full border border-emerald-200">
                    {alert.relatedCategory}
                  </span>
                </div>
                <h3 className="text-base font-bold text-emerald-950">
                  {alert.title}
                </h3>
                <p className="text-xs sm:text-sm text-emerald-700 font-medium mt-0.5 leading-relaxed">
                  {alert.description}
                </p>
              </div>
            </div>

            {!alert.resolved ? (
              <button
                onClick={() => resolveAlert(alert.id)}
                className="px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl text-xs font-bold shadow-xs transition-all self-start sm:self-center shrink-0 cursor-pointer"
              >
                Acknowledge Alert
              </button>
            ) : (
              <span className="text-xs font-bold text-emerald-800 bg-emerald-100 px-3 py-1 rounded-full self-start sm:self-center shrink-0">
                ✓ Resolved
              </span>
            )}
          </div>
        ))}
      </div>

    </div>
  );
};
