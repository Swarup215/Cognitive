import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  Bell, 
  Plus, 
  CheckCircle2, 
  Clock, 
  Volume2, 
  Pill, 
  Droplets, 
  PhoneCall, 
  Calendar, 
  Trash2, 
  Sparkles,
  RotateCcw
} from 'lucide-react';
import { ReminderType } from '../../types';

export const RemindersScreen: React.FC = () => {
  const { reminders, toggleReminder, deleteReminder, navigate, t, speak } = useApp();
  const [filter, setFilter] = useState<'all' | ReminderType>('all');

  const filtered = filter === 'all' 
    ? reminders 
    : reminders.filter(r => r.type === filter);

  const getReminderIcon = (type: ReminderType) => {
    switch (type) {
      case 'medicine': return <Pill className="w-5 h-5 text-rose-600" />;
      case 'hydration': return <Droplets className="w-5 h-5 text-blue-600" />;
      case 'call': return <PhoneCall className="w-5 h-5 text-amber-600" />;
      case 'appointment': return <Calendar className="w-5 h-5 text-teal-600" />;
      default: return <Bell className="w-5 h-5 text-emerald-600" />;
    }
  };

  const handleReadReminderAloud = (title: string, time: string, desc: string) => {
    speak(`Reminder for ${title} at ${time}. ${desc}`);
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-6 pb-24 space-y-6" id="reminders-screen">
      
      {/* Screen Title & Add Reminder Action */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-emerald-100 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-700 uppercase tracking-wider bg-emerald-50 px-3 py-1 rounded-full mb-1">
            <Sparkles className="w-3.5 h-3.5" />
            <span>DAILY SUPPORT</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-emerald-950">
            {t.myRemindersTitle}
          </h1>
          <p className="text-sm sm:text-base text-emerald-700 font-medium mt-1">
            Stay on track with gentle, on-time schedules for medicine, hydration, and family calls.
          </p>
        </div>

        <button
          onClick={() => navigate('add-reminder')}
          className="px-6 py-3.5 rounded-2xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-sm sm:text-base shadow-sm transition-all flex items-center gap-2 cursor-pointer w-fit shrink-0"
          id="add-reminder-btn"
        >
          <Plus className="w-5 h-5" />
          <span>+ Add reminder</span>
        </button>
      </div>

      {/* Filter Tabs */}
      <div className="flex flex-wrap gap-2" id="reminder-filter-tabs">
        {[
          { id: 'all', label: 'All Reminders' },
          { id: 'medicine', label: '💊 Medicine' },
          { id: 'hydration', label: '💧 Hydration' },
          { id: 'call', label: '☎ Family Call' },
          { id: 'appointment', label: '📅 Appointments' },
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setFilter(tab.id as any)}
            className={`px-4 py-2 rounded-2xl text-xs sm:text-sm font-bold transition-all ${
              filter === tab.id
                ? 'bg-emerald-700 text-white shadow-xs'
                : 'bg-white text-emerald-800 border border-emerald-200 hover:bg-emerald-50'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Reminders List */}
      <div className="space-y-3" id="reminders-list-container">
        {filtered.length === 0 ? (
          <div className="bg-white rounded-3xl p-8 text-center border border-emerald-100 text-emerald-700">
            <p className="text-base font-semibold">No reminders found in this category.</p>
            <button
              onClick={() => navigate('add-reminder')}
              className="mt-3 text-xs font-bold text-emerald-800 underline"
            >
              Add a new reminder
            </button>
          </div>
        ) : (
          filtered.map(reminder => (
            <div
              key={reminder.id}
              className={`p-5 rounded-3xl border-2 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${
                reminder.completed
                  ? 'bg-emerald-50/40 border-emerald-200 opacity-80'
                  : 'bg-white border-emerald-100 hover:border-emerald-300 shadow-xs'
              }`}
              id={`reminder-card-${reminder.id}`}
            >
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-2xl bg-emerald-50 border border-emerald-200/80 flex items-center justify-center shrink-0 mt-0.5">
                  {getReminderIcon(reminder.type)}
                </div>
                
                <div className="space-y-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-sm font-black text-emerald-950 flex items-center gap-1.5">
                      <Clock className="w-4 h-4 text-emerald-700" />
                      {reminder.time}
                    </span>
                    <span className="text-xs font-semibold text-emerald-800 bg-emerald-100/70 px-2.5 py-0.5 rounded-full">
                      {reminder.date}
                    </span>
                    <span className="text-[11px] font-semibold text-emerald-600 bg-white px-2 py-0.5 rounded-full border border-emerald-200">
                      {reminder.repeat}
                    </span>
                    {reminder.completed && reminder.completedAt && (
                      <span className="text-[11px] font-bold text-emerald-800 bg-emerald-200/80 px-2 py-0.5 rounded-full">
                        ✓ Done at {reminder.completedAt}
                      </span>
                    )}
                  </div>

                  <h3 className={`text-base sm:text-lg font-bold text-emerald-950 ${reminder.completed ? 'line-through text-emerald-700' : ''}`}>
                    {reminder.title}
                  </h3>
                  
                  {reminder.description && (
                    <p className="text-xs sm:text-sm text-emerald-700 font-medium leading-relaxed max-w-xl">
                      {reminder.description}
                    </p>
                  )}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-2 sm:self-center shrink-0 justify-end pt-2 sm:pt-0 border-t sm:border-t-0 border-emerald-100">
                {/* Read aloud button */}
                <button
                  onClick={() => handleReadReminderAloud(reminder.title, reminder.time, reminder.description)}
                  className="p-2.5 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-800 transition-colors"
                  title="Read reminder aloud"
                  aria-label="Read reminder aloud"
                >
                  <Volume2 className="w-4 h-4" />
                </button>

                {/* Complete Toggle Button */}
                <button
                  onClick={() => toggleReminder(reminder.id)}
                  className={`px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                    reminder.completed
                      ? 'bg-emerald-700 text-white shadow-xs'
                      : 'bg-emerald-100 text-emerald-950 hover:bg-emerald-200'
                  }`}
                  id={`reminder-done-btn-${reminder.id}`}
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>{reminder.completed ? '✓ Completed' : 'Mark Done'}</span>
                </button>

                {/* Delete button */}
                <button
                  onClick={() => deleteReminder(reminder.id)}
                  className="p-2 rounded-xl text-rose-600 hover:bg-rose-50 transition-colors"
                  title="Delete reminder"
                  aria-label="Delete reminder"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>

            </div>
          ))
        )}
      </div>

    </div>
  );
};
