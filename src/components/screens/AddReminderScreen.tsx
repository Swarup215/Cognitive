import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { ArrowLeft, Save, Sparkles, Bell, Clock, Calendar, Volume2, Pill, Droplets, PhoneCall } from 'lucide-react';
import { ReminderType } from '../../types';

export const AddReminderScreen: React.FC = () => {
  const { addReminder, navigate, t, speak } = useApp();

  const [type, setType] = useState<ReminderType>('medicine');
  const [title, setTitle] = useState<string>('');
  const [time, setTime] = useState<string>('20:00');
  const [date, setDate] = useState<string>('Today');
  const [repeat, setRepeat] = useState<'Every day' | 'Weekdays' | 'Once' | 'Weekly'>('Every day');
  const [description, setDescription] = useState<string>('');
  const [voiceReminder, setVoiceReminder] = useState<boolean>(true);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    addReminder({
      type,
      title: title.trim(),
      time,
      date,
      repeat,
      description: description.trim(),
      voiceReminder,
      completed: false,
    });

    speak(`New reminder saved for ${title} at ${time}.`);
  };

  const sampleTypes: { id: ReminderType; label: string; icon: string }[] = [
    { id: 'medicine', label: 'Medicine', icon: '💊' },
    { id: 'hydration', label: 'Hydration', icon: '💧' },
    { id: 'call', label: 'Family Call', icon: '☎' },
    { id: 'appointment', label: 'Doctor Visit', icon: '📅' },
    { id: 'routine', label: 'Daily Routine', icon: '☕' },
    { id: 'custom', label: 'Custom', icon: '🔔' },
  ];

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-6 pb-24 space-y-6" id="add-reminder-screen">
      
      {/* Top Header */}
      <div className="flex items-center gap-3">
        <button
          onClick={() => navigate('reminders')}
          className="p-2.5 rounded-2xl bg-white border border-emerald-200 text-emerald-900 hover:bg-emerald-50 transition-all"
          id="add-rem-back-btn"
          aria-label="Back to reminders"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-emerald-950">
            Add New Reminder
          </h1>
          <p className="text-xs sm:text-sm text-emerald-700 font-medium">
            Create an easy, large-text reminder with voice announcements.
          </p>
        </div>
      </div>

      {/* Main Form Box */}
      <form onSubmit={handleSubmit} className="bg-white rounded-3xl p-6 sm:p-8 border border-emerald-100 shadow-xs space-y-6">
        
        {/* 1. Reminder Type Selector */}
        <div>
          <label className="text-xs font-bold uppercase tracking-wider text-emerald-800 block mb-2">
            Reminder Type
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 sm:gap-3">
            {sampleTypes.map(st => (
              <button
                type="button"
                key={st.id}
                onClick={() => setType(st.id)}
                className={`p-3 rounded-2xl border-2 flex items-center gap-2.5 transition-all text-xs sm:text-sm font-bold cursor-pointer ${
                  type === st.id
                    ? 'bg-emerald-100 border-emerald-600 text-emerald-950 shadow-xs ring-2 ring-emerald-300'
                    : 'bg-emerald-50/40 border-emerald-200 text-emerald-800 hover:bg-emerald-100/60'
                }`}
              >
                <span className="text-xl">{st.icon}</span>
                <span>{st.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* 2. Reminder Title */}
        <div>
          <label htmlFor="rem-title" className="text-xs font-bold uppercase tracking-wider text-emerald-800 block mb-1">
            Reminder Title *
          </label>
          <input
            id="rem-title"
            type="text"
            required
            value={title}
            onChange={e => setTitle(e.target.value)}
            placeholder="e.g. Evening Blood Pressure Tablet, Drink Warm Water"
            className="w-full px-4 py-3.5 rounded-2xl border-2 border-emerald-200 focus:border-emerald-600 focus:ring-2 focus:ring-emerald-300 outline-none text-emerald-950 font-semibold text-base transition-all bg-emerald-50/20"
          />
        </div>

        {/* 3. Time & Date Row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label htmlFor="rem-time" className="text-xs font-bold uppercase tracking-wider text-emerald-800 block mb-1">
              Time (24h)
            </label>
            <input
              id="rem-time"
              type="time"
              required
              value={time}
              onChange={e => setTime(e.target.value)}
              className="w-full px-4 py-3.5 rounded-2xl border-2 border-emerald-200 focus:border-emerald-600 outline-none text-emerald-950 font-bold text-base bg-emerald-50/20"
            />
          </div>

          <div>
            <label htmlFor="rem-date" className="text-xs font-bold uppercase tracking-wider text-emerald-800 block mb-1">
              Date
            </label>
            <select
              id="rem-date"
              value={date}
              onChange={e => setDate(e.target.value)}
              className="w-full px-4 py-3.5 rounded-2xl border-2 border-emerald-200 focus:border-emerald-600 outline-none text-emerald-950 font-bold text-base bg-white cursor-pointer"
            >
              <option value="Today">Today</option>
              <option value="Tomorrow">Tomorrow</option>
              <option value="Every day">Every day</option>
              <option value="This Weekend">This Weekend</option>
            </select>
          </div>
        </div>

        {/* 4. Repeat Frequency */}
        <div>
          <label htmlFor="rem-repeat" className="text-xs font-bold uppercase tracking-wider text-emerald-800 block mb-1">
            Repeat Frequency
          </label>
          <select
            id="rem-repeat"
            value={repeat}
            onChange={e => setRepeat(e.target.value as any)}
            className="w-full px-4 py-3.5 rounded-2xl border-2 border-emerald-200 focus:border-emerald-600 outline-none text-emerald-950 font-bold text-base bg-white cursor-pointer"
          >
            <option value="Every day">Every day</option>
            <option value="Weekdays">Weekdays (Mon-Fri)</option>
            <option value="Weekly">Weekly once</option>
            <option value="Once">Once only</option>
          </select>
        </div>

        {/* 5. Helpful Notes / Description */}
        <div>
          <label htmlFor="rem-desc" className="text-xs font-bold uppercase tracking-wider text-emerald-800 block mb-1">
            Instructions / Notes for Asha
          </label>
          <textarea
            id="rem-desc"
            rows={3}
            value={description}
            onChange={e => setDescription(e.target.value)}
            placeholder="e.g. Take 1 tablet after food with a full glass of lukewarm water."
            className="w-full px-4 py-3 rounded-2xl border-2 border-emerald-200 focus:border-emerald-600 focus:ring-2 focus:ring-emerald-300 outline-none text-emerald-950 text-sm font-medium bg-emerald-50/20"
          ></textarea>
        </div>

        {/* 6. Voice Announcement Toggle */}
        <div className="flex items-center justify-between p-4 rounded-2xl bg-emerald-50/80 border border-emerald-200">
          <div className="flex items-center gap-3">
            <Volume2 className="w-5 h-5 text-emerald-700" />
            <div>
              <span className="text-sm font-bold text-emerald-950 block">Voice Reminder</span>
              <span className="text-xs text-emerald-700">Sathi will speak this reminder aloud gently at scheduled time.</span>
            </div>
          </div>
          <button
            type="button"
            onClick={() => setVoiceReminder(!voiceReminder)}
            className={`w-14 h-8 rounded-full transition-colors relative cursor-pointer ${
              voiceReminder ? 'bg-emerald-700' : 'bg-gray-300'
            }`}
            id="voice-reminder-toggle-btn"
            aria-label="Toggle voice reminder"
          >
            <div className={`w-6 h-6 rounded-full bg-white shadow-xs absolute top-1 transition-transform ${
              voiceReminder ? 'right-1' : 'left-1'
            }`}></div>
          </button>
        </div>

        {/* Form Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t border-emerald-100">
          <button
            type="submit"
            className="flex-1 py-4 bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-base rounded-2xl shadow-sm transition-all flex items-center justify-center gap-2 cursor-pointer"
            id="save-reminder-submit-btn"
          >
            <Save className="w-5 h-5" />
            <span>Save Reminder</span>
          </button>

          <button
            type="button"
            onClick={() => navigate('reminders')}
            className="px-6 py-4 bg-emerald-50 hover:bg-emerald-100 text-emerald-900 font-bold text-base rounded-2xl border border-emerald-200 transition-all cursor-pointer"
            id="cancel-add-reminder-btn"
          >
            Cancel
          </button>
        </div>

      </form>

    </div>
  );
};
