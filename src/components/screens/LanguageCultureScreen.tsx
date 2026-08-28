import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  ArrowLeft, 
  Globe, 
  Type, 
  Leaf, 
  Volume2, 
  Wifi, 
  Save, 
  Sparkles, 
  CheckCircle2 
} from 'lucide-react';
import { TextSize, SupportedLanguage, CulturalTheme } from '../../types';

export const LanguageCultureScreen: React.FC = () => {
  const { patient, updatePatient, navigate, t, speak } = useApp();

  const [textSize, setTextSize] = useState<TextSize>(patient.textSize);
  const [lang, setLang] = useState<SupportedLanguage>(patient.preferredLanguage);
  const [culture, setCulture] = useState<CulturalTheme>(patient.culturalPreference);
  const [voiceEnabled, setVoiceEnabled] = useState<boolean>(patient.voiceEnabled);
  const [offlineEnabled, setOfflineEnabled] = useState<boolean>(patient.offlineEnabled);
  const [savedFeedback, setSavedFeedback] = useState<boolean>(false);

  const languagesList: { id: SupportedLanguage; label: string; regional: string }[] = [
    { id: 'en', label: 'English (India)', regional: 'Default' },
    { id: 'hi', label: 'Hindi', regional: 'हिन्दी' },
    { id: 'as', label: 'Assamese', regional: 'অসমীয়া' },
    { id: 'bn', label: 'Bengali', regional: 'বাংলা' },
    { id: 'mni', label: 'Manipuri', regional: 'মৈতৈলোন্' },
    { id: 'lus', label: 'Mizo', regional: 'Mizo ṭawng' },
    { id: 'kha', label: 'Khasi', regional: 'Ka Ktien Khasi' },
    { id: 'grt', label: 'Garo', regional: 'A·chik' },
    { id: 'trp', label: 'Kokborok', regional: 'ককবরক (Tripura)' },
    { id: 'nag', label: 'Nagamese', regional: 'Nagamese Creole' },
  ];

  const culturalThemes: { id: CulturalTheme; title: string; subtitle: string; icon: string }[] = [
    { id: 'ner-default', title: 'North Eastern India (Pan-Regional)', subtitle: 'Rhino, Hornbill, Tea, Living Root Bridges & Bamboo', icon: '🌿' },
    { id: 'assam-tea', title: 'Assam Green Valleys', subtitle: 'Kaziranga wildlife, Muga silk and fragrant tea gardens', icon: '🍃' },
    { id: 'meghalaya-mist', title: 'Meghalaya Cloud & Pines', subtitle: 'Living root bridges, crystal streams and pine ridges', icon: '🏞️' },
    { id: 'manipur-loktak', title: 'Manipur Loktak Sanctuary', subtitle: 'Floating phumdis, Sangai deer and lotus blossoms', icon: '🌸' },
    { id: 'nagaland-hills', title: 'Nagaland Hornbill Trails', subtitle: 'Dzukou lilies, vibrant beadwork and warrior heritage', icon: '🦜' },
    { id: 'mizoram-bamboo', title: 'Mizoram Bamboo Highlands', subtitle: 'Evergreen bamboo weaves and rolling hill breezes', icon: '🎍' },
  ];

  const handleSave = () => {
    updatePatient({
      textSize,
      preferredLanguage: lang,
      culturalPreference: culture,
      voiceEnabled,
      offlineEnabled,
    });
    setSavedFeedback(true);
    speak("Your personalization preferences have been saved locally.");
    setTimeout(() => {
      setSavedFeedback(false);
      navigate('home');
    }, 1500);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-6 pb-24 space-y-8" id="language-culture-screen">
      
      {/* Header */}
      <div className="flex items-center justify-between gap-4">
        <button
          onClick={() => navigate('settings')}
          className="inline-flex items-center gap-2 text-emerald-800 hover:text-emerald-950 font-bold text-sm bg-emerald-50 hover:bg-emerald-100 px-4 py-2 rounded-xl transition-all"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Settings</span>
        </button>
      </div>

      {/* Main Title Box */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-emerald-100 shadow-xs space-y-2">
        <div className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-800 uppercase tracking-wider bg-emerald-50 px-3 py-1 rounded-full">
          <Sparkles className="w-3.5 h-3.5" />
          <span>{t.personalizationTitle}</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-emerald-950">
          {t.languageCulture}
        </h1>
        <p className="text-xs sm:text-sm text-emerald-700 font-medium leading-relaxed">
          Make MindMate truly yours. Customize reading text sizes, regional North Eastern languages, and cultural aesthetics.
        </p>
      </div>

      {/* 1. Text Size Selector */}
      <div className="bg-white rounded-3xl p-6 sm:p-7 border border-emerald-100 shadow-xs space-y-4">
        <div className="flex items-center gap-2">
          <Type className="w-5 h-5 text-emerald-700" />
          <h2 className="text-lg font-bold text-emerald-950">1. {t.textSize}</h2>
        </div>
        <p className="text-xs sm:text-sm text-emerald-700 font-medium">
          Choose a comfortable reading size for effortless vision without eye strain.
        </p>

        <div className="grid grid-cols-3 gap-3">
          {[
            { id: 'small', label: t.small, visual: 'A', desc: 'Default (16px)' },
            { id: 'medium', label: t.medium, visual: 'A', desc: 'Comfortable (18px)' },
            { id: 'large', label: t.large, visual: 'A', desc: 'Extra Large (20px)' },
          ].map(opt => (
            <button
              key={opt.id}
              type="button"
              onClick={() => setTextSize(opt.id as any)}
              className={`p-4 rounded-2xl border-2 flex flex-col items-center justify-center gap-1.5 transition-all cursor-pointer ${
                textSize === opt.id
                  ? 'bg-emerald-100 border-emerald-600 text-emerald-950 shadow-xs ring-2 ring-emerald-300'
                  : 'bg-emerald-50/40 border-emerald-200 text-emerald-800 hover:bg-emerald-100/60'
              }`}
            >
              <span className={`font-black ${opt.id === 'small' ? 'text-lg' : opt.id === 'medium' ? 'text-2xl' : 'text-3xl'}`}>
                {opt.visual}
              </span>
              <span className="text-xs font-bold">{opt.label}</span>
              <span className="text-[10px] text-emerald-700">{opt.desc}</span>
            </button>
          ))}
        </div>
      </div>

      {/* 2. Regional Languages */}
      <div className="bg-white rounded-3xl p-6 sm:p-7 border border-emerald-100 shadow-xs space-y-4">
        <div className="flex items-center gap-2">
          <Globe className="w-5 h-5 text-emerald-700" />
          <h2 className="text-lg font-bold text-emerald-950">2. {t.language}</h2>
        </div>
        <p className="text-xs sm:text-sm text-emerald-700 font-medium">
          Select from 10 supported North Eastern regional and national languages.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {languagesList.map(item => (
            <button
              key={item.id}
              type="button"
              onClick={() => setLang(item.id)}
              className={`p-3.5 rounded-2xl border-2 flex items-center justify-between text-left transition-all cursor-pointer ${
                lang === item.id
                  ? 'bg-emerald-100 border-emerald-600 text-emerald-950 shadow-xs ring-2 ring-emerald-300 font-bold'
                  : 'bg-emerald-50/40 border-emerald-200 text-emerald-800 hover:bg-emerald-100/60 font-medium'
              }`}
            >
              <div>
                <span className="text-sm block">{item.label}</span>
                <span className="text-xs text-emerald-700 block">{item.regional}</span>
              </div>
              {lang === item.id && (
                <CheckCircle2 className="w-4 h-4 text-emerald-700 shrink-0" />
              )}
            </button>
          ))}
        </div>
      </div>

      {/* 3. Cultural Experience Theme */}
      <div className="bg-white rounded-3xl p-6 sm:p-7 border border-emerald-100 shadow-xs space-y-4">
        <div className="flex items-center gap-2">
          <Leaf className="w-5 h-5 text-emerald-700" />
          <h2 className="text-lg font-bold text-emerald-950">3. {t.culturalExp}</h2>
        </div>
        <p className="text-xs sm:text-sm text-emerald-700 font-medium">
          Select regional visual motifs and cultural landmarks for memory cards and games.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {culturalThemes.map(ct => (
            <button
              key={ct.id}
              type="button"
              onClick={() => setCulture(ct.id)}
              className={`p-4 rounded-2xl border-2 text-left flex items-start gap-3 transition-all cursor-pointer ${
                culture === ct.id
                  ? 'bg-emerald-100 border-emerald-600 text-emerald-950 shadow-xs ring-2 ring-emerald-300'
                  : 'bg-emerald-50/40 border-emerald-200 text-emerald-800 hover:bg-emerald-100/60'
              }`}
            >
              <span className="text-2xl mt-0.5">{ct.icon}</span>
              <div>
                <h3 className="text-sm font-bold text-emerald-950">{ct.title}</h3>
                <p className="text-xs text-emerald-700 mt-0.5 leading-relaxed">{ct.subtitle}</p>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* 4. Voice & Sound Guidance Toggle */}
      <div className="bg-white rounded-3xl p-6 border border-emerald-100 shadow-xs flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-50 flex items-center justify-center text-emerald-800">
            <Volume2 className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-emerald-950">{t.soundVoice}</h3>
            <p className="text-xs text-emerald-700">Audio narration, spoken reminders, and chime feedback.</p>
          </div>
        </div>
        <button
          type="button"
          onClick={() => setVoiceEnabled(!voiceEnabled)}
          className={`w-14 h-8 rounded-full transition-colors relative cursor-pointer ${
            voiceEnabled ? 'bg-emerald-700' : 'bg-gray-300'
          }`}
          aria-label="Toggle voice guidance"
        >
          <div className={`w-6 h-6 rounded-full bg-white shadow-xs absolute top-1 transition-transform ${
            voiceEnabled ? 'right-1' : 'left-1'
          }`}></div>
        </button>
      </div>

      {/* 5. Offline Availability Info Card */}
      <div className="p-5 rounded-3xl bg-emerald-50 border border-emerald-200 text-emerald-900 flex items-start gap-3">
        <Wifi className="w-5 h-5 text-emerald-700 shrink-0 mt-0.5" />
        <div className="text-xs sm:text-sm">
          <p className="font-bold text-emerald-950 mb-0.5">{t.savedLocally}</p>
          <p className="text-emerald-800 font-medium">
            All your selected languages, sound profiles, and cultural settings are securely cached in local storage.
          </p>
        </div>
      </div>

      {/* Save Button */}
      <div className="pt-2">
        <button
          onClick={handleSave}
          className="w-full py-4 bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-base rounded-2xl shadow-sm transition-all flex items-center justify-center gap-2 cursor-pointer"
          id="save-preferences-btn"
        >
          <Save className="w-5 h-5" />
          <span>{t.save}</span>
        </button>
      </div>

    </div>
  );
};
