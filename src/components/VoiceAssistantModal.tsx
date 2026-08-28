import React, { useState, useEffect, useRef } from 'react';
import { useApp } from '../context/AppContext';
import { Mic, Volume2, X, Sparkles, Bell, Gamepad2, Heart, ArrowRight, Loader2 } from 'lucide-react';
import { playGentleTone, speakGentleText, stopSpeech } from '../utils/audioSynth';

const ASSISTANT_TRANSLATIONS: Record<string, any> = {
  en: {
    greeting: 'Hello! I am Sathi, your gentle companion. How can I help you today?',
    listening: 'Sathi is listening to your voice…',
    tapToTalk: 'Tap to Talk',
    tapToTalkSub: 'Tap the microphone or choose a question below',
    listeningLabel: 'Listening…',
    thinkingLabel: 'Thinking…',
    youSaid: 'You said:',
    replayAudio: 'Replay audio',
    trySaying: 'Try saying or tap to ask:',
    callDaughterLabel: '"Call my daughter"',
    appointmentLabel: '"What is my appointment?"',
    startGameLabel: '"Start my game"',
    medicineLabel: '"When is my medicine?"',
  },
  hi: {
    greeting: 'नमस्ते! मैं आपकी सहायक साथी हूँ। आज मैं आपकी क्या मदद कर सकती हूँ?',
    listening: 'साथी आपकी आवाज़ सुन रही है…',
    tapToTalk: 'बोलने के लिए टैप करें',
    tapToTalkSub: 'माइक पर टैप करें या नीचे से कोई प्रश्न चुनें',
    listeningLabel: 'सुन रही हूँ…',
    thinkingLabel: 'सोच रही हूँ…',
    youSaid: 'आपने कहा:',
    replayAudio: 'आवाज़ दोबारा सुनें',
    trySaying: 'यह बोलें या टैप करें:',
    callDaughterLabel: '"बेटी को कॉल करें"',
    appointmentLabel: '"अपॉइंटमेंट क्या है?"',
    startGameLabel: '"खेल शुरू करें"',
    medicineLabel: '"दवा का समय कब है?"',
  },
  as: {
    greeting: "নমস্কাৰ! মই আপোনাৰ সাৰথী। আজি মই আপোনাক কেনেকৈ সহায় কৰিব পাৰোঁ?",
    listening: "সাৰথীয়ে আপোনাৰ মাত শুনি আছে…",
    tapToTalk: "ক\u2019বলৈ টিপক",
    tapToTalkSub: "মাইক\u2019ৰফোনটো টিপক বা তলৰ পৰা এটা প্ৰশ্ন বাছি লওক",
    listeningLabel: "শুনি আছোঁ…",
    thinkingLabel: "ভাবি আছোঁ…",
    youSaid: "আপুনি ক\u2019লে:",
    replayAudio: "পুনৰ শুনক",
    trySaying: "কৈ চাওক বা টিপক:",
    callDaughterLabel: '"জীয়ৰীক ফোন কৰা"',
    appointmentLabel: '"মোৰ এপইণ্টমেণ্ট কেতিয়া?"',
    startGameLabel: '"খেল আৰম্ভ কৰা"',
    medicineLabel: '"মোৰ ঔষধ কেতিয়া?"',
  },
  bn: {
    greeting: 'নমস্কার! আমি আপনার সহচরী সাথী। আজ আপনাকে কীভাবে সাহায্য করতে পারি?',
    listening: 'সাথী আপনার কথা শুনছে…',
    tapToTalk: 'বলার জন্য চাপুন',
    tapToTalkSub: 'মাইক্রোফোনটি চাপুন বা নিচের একটি প্রশ্ন বেছে নিন',
    listeningLabel: 'শুনছি…',
    thinkingLabel: 'ভাবছি…',
    youSaid: 'আপনি বললেন:',
    replayAudio: 'পুনরায় শুনুন',
    trySaying: 'বলার চেষ্টা করুন বা চাপুন:',
    callDaughterLabel: '"মেয়েকে কল করুন"',
    appointmentLabel: '"আমার অ্যাপয়েন্টমেন্ট কখন?"',
    startGameLabel: '"খেলা শুরু করুন"',
    medicineLabel: '"আমার ওষুধ কখন?"',
  },
};

// Quick-tap preset keywords for instant navigation actions
const QUICK_COMMANDS: Record<string, string[]> = {
  game:        ['game', 'play', 'activity', 'खेल', 'খেল', 'খেলা'],
  daughter:    ['daughter', 'pooja', 'call', 'family', 'बेटी', 'पूजा', 'জীয়ৰী', 'মেয়ে', 'फोन'],
  language:    ['language', 'bhasha', 'hindi', 'assamese', 'भाषा', 'ভাষা'],
};

function detectQuickCommand(lower: string): string | null {
  for (const [cmd, keywords] of Object.entries(QUICK_COMMANDS)) {
    if (keywords.some(k => lower.includes(k))) return cmd;
  }
  return null;
}

export const VoiceAssistantModal: React.FC = () => {
  const {
    voiceModalOpen,
    setVoiceModalOpen,
    patient,
    reminders,
    navigate,
    currentView,
    userMode,
    cognitiveMetrics,
    careAlerts,
    caregivers,
    networkStatus,
    t
  } = useApp();

  const displayLang = patient.preferredLanguage;
  const voiceLang = patient.voiceLanguage || patient.preferredLanguage;

  const displayStrings = ASSISTANT_TRANSLATIONS[displayLang] || ASSISTANT_TRANSLATIONS.en;

  const [isListening, setIsListening]       = useState<boolean>(false);
  const [isThinking, setIsThinking]         = useState<boolean>(false);
  const [transcript, setTranscript]         = useState<string>('');
  const [assistantReply, setAssistantReply] = useState<string>(displayStrings.greeting);
  const [lastVoiceReply, setLastVoiceReply] = useState<string>(displayStrings.greeting);

  const recognitionRef = useRef<any>(null);
  const isNavigatingRef = useRef<boolean>(false);

  // Sync greeting when languages change
  useEffect(() => {
    const g = (ASSISTANT_TRANSLATIONS[displayLang] || ASSISTANT_TRANSLATIONS.en).greeting;
    setAssistantReply(g);
    setLastVoiceReply(g);
  }, [displayLang, voiceLang]);

  useEffect(() => {
    if (voiceModalOpen) {
      isNavigatingRef.current = false;
      const g = (ASSISTANT_TRANSLATIONS[displayLang] || ASSISTANT_TRANSLATIONS.en).greeting;
      setAssistantReply(g);
      setLastVoiceReply(g);
      playGentleTone(523.25, 'sine', 0.2, 0.1);
      speakGentleText(g, voiceLang);
    } else {
      stopListening();
      if (!isNavigatingRef.current) {
        stopSpeech();
      }
    }
    return () => {
      stopListening();
      if (!isNavigatingRef.current) {
        stopSpeech();
      }
    };
  }, [voiceModalOpen, displayLang, voiceLang]);

  // Setup Web Speech Recognition
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) return;

    const recognizer = new SpeechRecognition();
    recognizer.continuous = false;
    recognizer.interimResults = true;

    const recognitionLocales: Record<string, string> = {
      en: 'en-IN', hi: 'hi-IN', as: 'as-IN', bn: 'bn-IN',
      mni: 'en-IN', lus: 'en-IN', kha: 'en-IN', grt: 'en-IN', trp: 'en-IN', nag: 'en-IN',
    };
    recognizer.lang = recognitionLocales[voiceLang] || 'en-IN';

    recognizer.onstart  = () => setIsListening(true);
    recognizer.onend    = () => setIsListening(false);
    recognizer.onerror  = (e: any) => { console.debug('STT error:', e); setIsListening(false); };

    recognizer.onresult = (event: any) => {
      const current = event.resultIndex;
      const text    = event.results[current][0].transcript;
      setTranscript(text);
      if (event.results[current].isFinal) {
        handleVoiceCommand(text);
      }
    };

    recognitionRef.current = recognizer;
  }, [voiceLang]);

  const startListening = () => {
    setTranscript('');
    if (recognitionRef.current) {
      try { recognitionRef.current.start(); } catch { setIsListening(true); }
    } else {
      setIsListening(true);
    }
  };

  const stopListening = () => {
    try { recognitionRef.current?.stop(); } catch {}
    setIsListening(false);
  };

  // ── Main handler: quick commands stay local; everything else → Groq LLM ──
  const handleVoiceCommand = async (cmd: string) => {
    const lower = cmd.toLowerCase();
    stopListening();

    const quick = detectQuickCommand(lower);

    if (quick === 'game') {
      isNavigatingRef.current = true;
      const reply = displayLang === 'hi'
        ? 'आपकी मस्तिष्क गतिविधियां शुरू कर रही हूँ!'
        : displayLang === 'as'
        ? 'আপোনাৰ খেলসমূহ এতিয়াই খুলি দিছোঁ!'
        : displayLang === 'bn'
        ? 'আপনার মস্তিষ্কের খেলাগুলি এখন খুলছি!'
        : "Opening your cognitive activities now. Let's play!";
      setAssistantReply(reply);
      setLastVoiceReply(reply);
      // Wait for complete voice playback before switching screen
      await speakGentleText(reply, voiceLang);
      setVoiceModalOpen(false);
      navigate('games');
      isNavigatingRef.current = false;
      return;
    }

    if (quick === 'daughter') {
      isNavigatingRef.current = true;
      const reply = displayLang === 'hi'
        ? 'आपकी बेटी पूजा से संपर्क करा रही हूँ!'
        : displayLang === 'as'
        ? 'আপোনাৰ জীয়ৰী পূজাৰ সৈতে সংযোগ কৰি আছোঁ!'
        : displayLang === 'bn'
        ? 'আপনার মেয়ে পূজা বর্মনের সাথে যোগাযোগ করিয়ে দিচ্ছি!'
        : 'Connecting you with your daughter Pooja right now!';
      setAssistantReply(reply);
      setLastVoiceReply(reply);
      await speakGentleText(reply, voiceLang);
      setVoiceModalOpen(false);
      navigate('family');
      isNavigatingRef.current = false;
      return;
    }

    if (quick === 'language') {
      isNavigatingRef.current = true;
      const reply = displayLang === 'hi'
        ? 'भाषा और संस्कृति सेटिंग खोल रही हूँ!'
        : displayLang === 'as'
        ? 'ভাষা আৰু সংস্কৃতিৰ পৃষ্ঠা খুলি দিছোঁ!'
        : displayLang === 'bn'
        ? 'ভাষা ও সংস্কৃতির পেজটি খুলছি!'
        : 'Opening Language & Culture settings!';
      setAssistantReply(reply);
      setLastVoiceReply(reply);
      await speakGentleText(reply, voiceLang);
      setVoiceModalOpen(false);
      navigate('language-culture');
      isNavigatingRef.current = false;
      return;
    }

    // Everything else → Groq LLM with full website dynamic context & guardrails
    setIsThinking(true);
    setAssistantReply(displayStrings.thinkingLabel);

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: cmd,
          lang: voiceLang,
          patient,
          currentView,
          userMode,
          reminders,
          cognitiveMetrics,
          careAlerts,
          caregivers,
          networkStatus,
        }),
      });

      const data = await res.json();
      const reply = data.reply || "I am right here for you on MindMate! How can I help you today?";

      setAssistantReply(reply);
      setLastVoiceReply(reply);
      await speakGentleText(reply, voiceLang);
    } catch (err) {
      console.error('[chat] Error:', err);
      const fallback = displayLang === 'hi'
        ? 'माफ करें, कुछ समस्या हुई। कृपया फिर से प्रयास करें।'
        : "I'm sorry, I'm having a little trouble right now. Please try again.";
      setAssistantReply(fallback);
      setLastVoiceReply(fallback);
      speakGentleText(fallback, voiceLang);
    } finally {
      setIsThinking(false);
    }
  };

  const executeSampleCommand = (commandText: string) => {
    setTranscript(commandText);
    handleVoiceCommand(commandText);
  };

  const handleClose = () => {
    stopListening();
    stopSpeech();
    setVoiceModalOpen(false);
  };

  if (!voiceModalOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 bg-emerald-950/60 backdrop-blur-md flex items-center justify-center p-4 transition-all"
      id="voice-assistant-modal"
      role="dialog"
      aria-modal="true"
      aria-labelledby="voice-modal-title"
      onClick={handleClose}
    >
      <div
        className="bg-white rounded-3xl max-w-xl w-full p-6 sm:p-8 shadow-2xl border border-emerald-100 relative overflow-hidden animate-in fade-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={handleClose}
          className="absolute top-5 right-5 p-2.5 rounded-full bg-emerald-50 text-emerald-800 hover:bg-emerald-100 hover:text-emerald-950 transition-colors"
          id="close-voice-modal-btn"
          aria-label="Close Voice Assistant"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="text-center mb-6">
          <div className="inline-flex items-center gap-2 bg-emerald-100 text-emerald-800 px-3.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider mb-2">
            <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
            <span>AI Voice Companion • Sathi</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold text-emerald-950" id="voice-modal-title">
            {displayLang === 'hi' ? 'माइंडमेट से बात करें' :
             displayLang === 'as' ? 'মাইণ্ডমেটৰ সৈতে কথা পাতক' :
             displayLang === 'bn' ? 'মাইন্ডমেটের সাথে কথা বলুন' : 'Talk to MindMate'}
          </h2>
          <p className="text-sm text-emerald-700 mt-1 font-medium">
            {displayLang === 'hi' ? 'हिंदी, अंग्रेजी, असमिया या बंगाली में स्वाभाविक रूप से बोलें' :
             displayLang === 'as' ? 'স্বাভাৱিকভাৱে যিকোনো ভাষাত কথা কওক' :
             displayLang === 'bn' ? 'স্বাভাবিকভাবে যেকোনো ভাষায় কথা বলুন' :
             'Speak naturally in any language — powered by AI'}
          </p>
        </div>

        {/* Central Animated Microphone Orb */}
        <div className="flex flex-col items-center justify-center my-6">
          <div className="relative">
            {(isListening || isThinking) && (
              <>
                <div className={`absolute -inset-4 rounded-full animate-ping ${isThinking ? 'bg-amber-400/30' : 'bg-emerald-400/30'}`}></div>
                <div className={`absolute -inset-8 rounded-full animate-pulse ${isThinking ? 'bg-amber-300/20' : 'bg-emerald-300/20'}`}></div>
              </>
            )}

            <button
              onClick={isListening ? stopListening : startListening}
              disabled={isThinking}
              className={`w-28 h-28 rounded-full flex flex-col items-center justify-center shadow-lg transition-all duration-300 relative z-10 cursor-pointer ${
                isThinking
                  ? 'bg-gradient-to-tr from-amber-500 to-orange-400 text-white scale-105 ring-4 ring-amber-300 cursor-wait'
                  : isListening
                  ? 'bg-gradient-to-tr from-emerald-600 to-teal-500 text-white scale-105 ring-4 ring-emerald-300'
                  : 'bg-emerald-50 hover:bg-emerald-100 text-emerald-900 border-2 border-emerald-300'
              }`}
              id="voice-mic-trigger-btn"
              aria-label={isListening ? 'Stop listening' : 'Start listening'}
            >
              {isThinking ? (
                <>
                  <Loader2 className="w-9 h-9 animate-spin" />
                  <span className="text-[10px] font-bold mt-1 uppercase tracking-wider">{displayStrings.thinkingLabel}</span>
                </>
              ) : isListening ? (
                <>
                  <Mic className="w-10 h-10 animate-bounce" />
                  <span className="text-[11px] font-bold mt-1 uppercase tracking-wider">{displayStrings.listeningLabel}</span>
                </>
              ) : (
                <>
                  <Mic className="w-9 h-9 text-emerald-800" />
                  <span className="text-xs font-bold mt-1 text-emerald-800">{displayStrings.tapToTalk}</span>
                </>
              )}
            </button>
          </div>

          <p className="text-xs text-emerald-600/90 font-medium mt-3">
            {isThinking ? displayStrings.thinkingLabel :
             isListening ? displayStrings.listening :
             displayStrings.tapToTalkSub}
          </p>
        </div>

        {/* Live Transcript and Sathi Response Box */}
        <div className="bg-emerald-50/70 border border-emerald-200/80 rounded-2xl p-4 sm:p-5 mb-6 text-left" id="voice-transcript-box">
          {transcript && (
            <div className="mb-3 pb-3 border-b border-emerald-200/60">
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-700 block mb-1">
                {displayStrings.youSaid}
              </span>
              <p className="text-base sm:text-lg font-medium text-emerald-950 italic">
                "{transcript}"
              </p>
            </div>
          )}

          <div>
            <div className="flex items-center justify-between gap-2 mb-1">
              <span className="text-xs font-bold uppercase tracking-wider text-teal-800 flex items-center gap-1.5">
                <Volume2 className="w-3.5 h-3.5" />
                Sathi:
              </span>
              <button
                onClick={() => speakGentleText(lastVoiceReply, voiceLang)}
                className="text-xs text-emerald-700 hover:text-emerald-900 font-semibold underline"
                title="Replay spoken response"
              >
                {displayStrings.replayAudio}
              </button>
            </div>
            <p className="text-base sm:text-lg font-semibold text-emerald-950 leading-relaxed">
              {assistantReply}
            </p>
          </div>
        </div>

        {/* Quick Voice Command Chips for Elderly Accessibility */}
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-emerald-800 block mb-2">
            {displayStrings.trySaying}
          </span>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2" id="voice-sample-commands">
            <button
              onClick={() => executeSampleCommand('When is my medicine?')}
              className="text-left px-3.5 py-2.5 rounded-xl bg-white hover:bg-emerald-50 border border-emerald-200 text-xs sm:text-sm font-medium text-emerald-900 flex items-center justify-between gap-2 transition-all hover:border-emerald-400"
            >
              <span className="flex items-center gap-2">
                <Bell className="w-4 h-4 text-emerald-700 shrink-0" />
                <span>{displayStrings.medicineLabel}</span>
              </span>
              <ArrowRight className="w-3.5 h-3.5 text-emerald-400" />
            </button>

            <button
              onClick={() => executeSampleCommand('Start my game')}
              className="text-left px-3.5 py-2.5 rounded-xl bg-white hover:bg-emerald-50 border border-emerald-200 text-xs sm:text-sm font-medium text-emerald-900 flex items-center justify-between gap-2 transition-all hover:border-emerald-400"
            >
              <span className="flex items-center gap-2">
                <Gamepad2 className="w-4 h-4 text-teal-700 shrink-0" />
                <span>{displayStrings.startGameLabel}</span>
              </span>
              <ArrowRight className="w-3.5 h-3.5 text-teal-400" />
            </button>

            <button
              onClick={() => executeSampleCommand('What is my appointment?')}
              className="text-left px-3.5 py-2.5 rounded-xl bg-white hover:bg-emerald-50 border border-emerald-200 text-xs sm:text-sm font-medium text-emerald-900 flex items-center justify-between gap-2 transition-all hover:border-emerald-400"
            >
              <span className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-amber-600 shrink-0" />
                <span>{displayStrings.appointmentLabel}</span>
              </span>
              <ArrowRight className="w-3.5 h-3.5 text-amber-400" />
            </button>

            <button
              onClick={() => executeSampleCommand('Call my daughter')}
              className="text-left px-3.5 py-2.5 rounded-xl bg-white hover:bg-emerald-50 border border-emerald-200 text-xs sm:text-sm font-medium text-emerald-900 flex items-center justify-between gap-2 transition-all hover:border-emerald-400"
            >
              <span className="flex items-center gap-2">
                <Heart className="w-4 h-4 text-rose-600 shrink-0" />
                <span>{displayStrings.callDaughterLabel}</span>
              </span>
              <ArrowRight className="w-3.5 h-3.5 text-rose-400" />
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
