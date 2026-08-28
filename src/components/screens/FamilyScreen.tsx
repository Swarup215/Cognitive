import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { ArrowLeft, Users, Phone, MessageSquare, Heart, Sparkles, Image, CheckCircle2, PhoneCall } from 'lucide-react';

export const FamilyScreen: React.FC = () => {
  const { navigate, caregivers, patient, speak } = useApp();
  const [activeCallContact, setActiveCallContact] = useState<string | null>(null);
  const [messageSentTo, setMessageSentTo] = useState<string | null>(null);

  const photoMemories = [
    {
      id: 1,
      title: 'Kabir playing in tea garden',
      date: 'Last Sunday • Guwahati',
      emoji: '🏞️',
      desc: 'Grandson Kabir laughing during your afternoon stroll in the tea estate.',
    },
    {
      id: 2,
      title: 'Bihu Festival Celebration',
      date: 'Spring 2026',
      emoji: '🥁',
      desc: 'Family gathering with traditional Pitha sweets and Bihu dhol music.',
    },
    {
      id: 3,
      title: 'Daughter Pooja visit',
      date: '2 weeks ago',
      emoji: '🌸',
      desc: 'Enjoying fresh morning Assam ginger tea on the veranda together.',
    },
  ];

  const handleSimulateCall = (name: string, phone: string) => {
    setActiveCallContact(name);
    speak(`Connecting call to ${name}...`);
    setTimeout(() => {
      // In 4 seconds close call simulation
    }, 4000);
  };

  const handleSendMessage = (name: string) => {
    setMessageSentTo(name);
    speak(`Sent love and warm regards to ${name}.`);
    setTimeout(() => setMessageSentTo(null), 3000);
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-6 pb-24 space-y-8" id="family-screen">
      
      {/* Top Header */}
      <div className="flex items-center justify-between gap-4">
        <button
          onClick={() => navigate('home')}
          className="inline-flex items-center gap-2 text-emerald-800 hover:text-emerald-950 font-bold text-sm bg-emerald-50 hover:bg-emerald-100 px-4 py-2 rounded-xl transition-all"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Home</span>
        </button>
      </div>

      {/* Main Title Card */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-emerald-100 shadow-xs space-y-2">
        <div className="inline-flex items-center gap-1.5 text-xs font-bold text-teal-800 uppercase tracking-wider bg-teal-50 px-3 py-1 rounded-full">
          <Heart className="w-3.5 h-3.5 text-rose-500" />
          <span>Family & Social Connection</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-emerald-950">
          Circle of Care & Loved Ones
        </h1>
        <p className="text-xs sm:text-sm text-emerald-700 font-medium leading-relaxed max-w-2xl">
          Staying socially connected with family and local community health workers maintains emotional wellbeing and cognitive vitality.
        </p>
      </div>

      {/* Active Call Simulation Overlay */}
      {activeCallContact && (
        <div className="fixed inset-0 bg-emerald-950/80 backdrop-blur-md flex items-center justify-center p-4 z-50 animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl p-8 max-w-sm w-full text-center shadow-2xl border border-emerald-200 space-y-4">
            <div className="w-20 h-20 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center mx-auto ring-4 ring-emerald-300 animate-pulse">
              <PhoneCall className="w-10 h-10 text-emerald-700" />
            </div>
            <h3 className="text-2xl font-bold text-emerald-950">Calling {activeCallContact}…</h3>
            <p className="text-xs text-emerald-700 font-semibold">
              Audio channel active • Speaker connected
            </p>
            <div className="pt-4">
              <button
                onClick={() => setActiveCallContact(null)}
                className="w-full py-3 bg-rose-600 hover:bg-rose-700 text-white font-bold rounded-2xl shadow-sm transition-all cursor-pointer"
              >
                End Call
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Family Contacts List */}
      <div className="space-y-4">
        <h2 className="text-lg font-bold text-emerald-950">Connected Family & Support</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {caregivers.map(person => (
            <div
              key={person.id}
              className="bg-white rounded-3xl p-6 border border-emerald-100 shadow-xs flex flex-col justify-between space-y-4"
            >
              <div className="flex items-center gap-3">
                <span className="text-4xl">{person.avatar}</span>
                <div>
                  <h3 className="text-base font-bold text-emerald-950">{person.name}</h3>
                  <span className="text-xs font-semibold text-emerald-700">{person.relationship}</span>
                  <span className="text-[11px] text-emerald-600 block mt-0.5">Role: {person.role}</span>
                </div>
              </div>

              <div className="bg-emerald-50 rounded-2xl p-2.5 text-xs text-emerald-800 font-medium">
                Last checked in: <strong>{person.lastInteraction}</strong>
              </div>

              <div className="flex flex-col gap-2 pt-2 border-t border-emerald-100">
                <button
                  onClick={() => handleSimulateCall(person.name, person.phone)}
                  className="w-full py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white font-bold rounded-xl text-xs flex items-center justify-center gap-1.5 transition-all shadow-xs cursor-pointer"
                >
                  <Phone className="w-4 h-4" />
                  <span>Call {person.name.split(' ')[0]}</span>
                </button>

                <button
                  onClick={() => handleSendMessage(person.name)}
                  className="w-full py-2 bg-emerald-50 hover:bg-emerald-100 text-emerald-900 font-bold rounded-xl text-xs border border-emerald-200 flex items-center justify-center gap-1.5 transition-all cursor-pointer"
                >
                  <MessageSquare className="w-3.5 h-3.5 text-emerald-700" />
                  <span>Send "Thinking of You"</span>
                </button>

                {messageSentTo === person.name && (
                  <span className="text-[11px] font-bold text-emerald-800 text-center animate-bounce">
                    ✓ Warm message sent to {person.name}!
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Gentle Memory Photo Album to spark pleasant reminiscence */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-emerald-100 shadow-xs space-y-4">
        <div className="flex items-center gap-2 text-emerald-950 font-bold text-lg">
          <Image className="w-5 h-5 text-emerald-700" />
          <h3>Family Memories & Reminiscence</h3>
        </div>
        <p className="text-xs sm:text-sm text-emerald-700 font-medium">
          Photographic prompts shared by family members to stimulate positive recall.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
          {photoMemories.map(photo => (
            <div key={photo.id} className="p-4 rounded-2xl bg-emerald-50/50 border border-emerald-200/80 space-y-2">
              <div className="w-full h-28 bg-emerald-100/60 rounded-xl flex items-center justify-center text-4xl shadow-inner">
                {photo.emoji}
              </div>
              <h4 className="text-sm font-bold text-emerald-950">{photo.title}</h4>
              <span className="text-[11px] font-semibold text-emerald-700 block">{photo.date}</span>
              <p className="text-xs text-emerald-800 leading-relaxed font-normal">{photo.desc}</p>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};
