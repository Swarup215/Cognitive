import React, { useState, useEffect, useRef } from 'react';
import { useApp } from '../context/AppContext';
import { Mic, MicOff, Volume2, X, Sparkles, Phone, Bell, Gamepad2, Globe, Heart, ArrowRight } from 'lucide-react';
import { playGentleTone } from '../utils/audioSynth';

const ASSISTANT_TRANSLATIONS: Record<string, any> = {
  en: {
    greeting: 'Hello Asha! I am Sathi, your gentle companion. How can I help you today?',
    listening: 'Sathi is listening to your voice…',
    tapToTalk: 'Tap to Talk',
    tapToTalkSub: 'Tap the microphone or choose a question below',
    listeningLabel: 'Listening…',
    youSaid: 'You said:',
    replayAudio: 'Replay audio',
    trySaying: 'Try saying or tap to ask:',
    callDaughterLabel: '"Call my daughter"',
    appointmentLabel: '"What is my appointment?"',
    startGameLabel: '"Start my game"',
    medicineLabel: '"When is my medicine?"',
    gamesReply: "Opening your cognitive activities now. Let's play Candy Match or Memory Match together!",
    medReminderFound: (time: string, title: string) => `Sure Asha. Your medicine reminder is at ${time}. It is for: ${title}. Remember to take it with water.`,
    medReminderNone: "You have all your scheduled medicines up to date. I'm right here if you need anything.",
    apptFound: (time: string, date: string) => `Your next appointment is at ${time} (${date}) with Dr. Barua at the Regional Wellness Clinic.`,
    apptNone: "You have no pending doctor appointments for today. Everything is calm and clear.",
    allReminders: (count: number, details: string) => `You have ${count} reminders for today: ${details}.`,
    callDaughterReply: "Connecting you with your daughter Pooja Barman right now. Calling +91 98640 12345…",
    langPageReply: "Opening your Language and Culture personalization page so you can choose your preferred North Eastern language.",
    fallbackReply: (cmd: string) => `I heard: "${cmd}". Let's explore your daily activities, reminders, or family connect together.`,
  },
  hi: {
    greeting: 'नमस्ते आशा! मैं आपकी सहायक साथी हूँ। आज मैं आपकी क्या मदद कर सकती हूँ?',
    listening: 'साथी आपकी आवाज़ सुन रही है…',
    tapToTalk: 'बोलने के लिए टैप करें',
    tapToTalkSub: 'माइक पर टैप करें या नीचे से कोई प्रश्न चुनें',
    listeningLabel: 'सुन रही हूँ…',
    youSaid: 'आपने कहा:',
    replayAudio: 'आवाज़ दोबारा सुनें',
    trySaying: 'यह बोलें या टैप करें:',
    callDaughterLabel: '"बेटी को कॉल करें"',
    appointmentLabel: '"अपॉइंटमेंट क्या है?"',
    startGameLabel: '"खेल शुरू करें"',
    medicineLabel: '"दवा का समय कब है?"',
    gamesReply: "आपकी मस्तिष्क गतिविधियां शुरू कर रही हूँ। आइए साथ में कैंडी मैच या मेमोरी मैच खेलें!",
    medReminderFound: (time: string, title: string) => `बिल्कुल आशा। आपका दवा का रिमाइंडर ${time} पर है: ${title}। इसे पानी के साथ लेना याद रखें।`,
    medReminderNone: "आपकी सभी दवाइयां समय पर ली जा चुकी हैं। मैं सहायता के लिए यहीं हूँ।",
    apptFound: (time: string, date: string) => `आपकी अगली अपॉइंटमेंट ${time} (${date}) पर डॉ. बरुआ के साथ रीजनल वेलनेस क्लिनिक में है।`,
    apptNone: "आज आपका डॉक्टर से मिलने का कोई अपॉइंटमेंट नहीं है। सब कुछ ठीक है।",
    allReminders: (count: number, details: string) => `आज आपके पास ${count} रिमाइंडर हैं: ${details}।`,
    callDaughterReply: "आपकी बेटी पूजा बर्मन से अभी संपर्क करा रही हूँ। +91 98640 12345 पर कॉल किया जा रहा है…",
    langPageReply: "भाषा और संस्कृति सेटिंग खोल रही हूँ ताकि आप अपनी पसंदीदा भाषा चुन सकें।",
    fallbackReply: (cmd: string) => `मैंने सुना: "${cmd}"। आइए मिलकर आपकी दैनिक गतिविधियों, रिमाइंडर या परिवार से जुड़ने के विकल्प देखें।`,
  },
  as: {
    greeting: 'নমস্কাৰ আশা! মই আপোনাৰ সাৰথী। আজি মই আপোনাক কেনেকৈ সহায় কৰিব পাৰোঁ?',
    listening: 'সাৰথীয়ে আপোনাৰ মাত শুনি আছে…',
    tapToTalk: 'ক’বলৈ টিপক',
    tapToTalkSub: 'মাইক্ৰ’ফোনটো টিপক বা তলৰ পৰা এটা প্ৰশ্ন বাছি লওক',
    listeningLabel: 'শুনি আছোঁ…',
    youSaid: 'আপুনি ক’লে:',
    replayAudio: 'পুনৰ শুনক',
    trySaying: 'কৈ চাওক বা টিপক:',
    callDaughterLabel: '"জীয়ৰীক ফোন কৰা"',
    appointmentLabel: '"মোৰ এপইণ্টমেণ্ট কেতিয়া?"',
    startGameLabel: '"খেল আৰম্ভ কৰা"',
    medicineLabel: '"মোৰ ঔষধ কেতিয়া?"',
    gamesReply: "আপোনাৰ খেলসমূহ এতিয়াই খুলি দিছোঁ। আহক একেলগে কেণ্ডী মেচ বা মেমৰি মেচ খেলো!",
    medReminderFound: (time: string, title: string) => `নিশ্চয় আশা। আপোনাৰ ঔষধৰ ৰিমাইণ্ডাৰ ${time} বজাত আছে: ${title}। পানীৰ সৈতে ল’বলৈ মনত ৰাখিব।`,
    medReminderNone: "আপোনাৰ সকলো নিৰ্ধাৰিত ঔষধ সঠিক সময়ত লোৱা হৈছে। মই ইয়াতেই আছোঁ।",
    apptFound: (time: string, date: string) => `আপোনাৰ পৰৱৰ্তী এপইণ্টমেণ্ট ${time} বজাত (${date}) ড০ বৰুৱাৰ সৈতে ৰিজিয়নেল ৱেলনেচ ক্লিনিকত আছে।`,
    apptNone: "আজি আপোনাৰ কোনো ডাক্তৰৰ এপইণ্টমেণ্ট নাই। সকলো ঠিকেই আছে।",
    allReminders: (count: number, details: string) => `আজি আপোনাৰ ${count} টা ৰিমাইণ্ডাৰ আছে: ${details}।`,
    callDaughterReply: "আপোনাৰ জীয়ৰী পূজা বৰ্মনৰ সৈতে সংযোগ কৰি আছোঁ। +91 98640 12345 লৈ ফোন কৰা হৈছে…",
    langPageReply: "ভাষা আৰু সংস্কৃতিৰ পৃষ্ঠা খুলি দিছোঁ যাতে আপুনি নিজৰ পচন্দৰ ভাষা বাছি ল’ব পাৰে।",
    fallbackReply: (cmd: string) => `মই শুনিলোঁ: "${cmd}"। আহক একেলগে আপোনাৰ দৈনিক কাম, ৰিমাইণ্ডাৰ বা পৰিয়ালৰ সংযোগসমূহ চাওঁ।`,
  },
  bn: {
    greeting: 'নমস্কার আশা! আমি আপনার সহচরী সাথী। আজ আপনাকে কীভাবে সাহায্য করতে পারি?',
    listening: 'সাথী আপনার কথা শুনছে…',
    tapToTalk: 'বলার জন্য চাপুন',
    tapToTalkSub: 'মাইক্রোফোনটি চাপুন বা নিচের একটি প্রশ্ন বেছে নিন',
    listeningLabel: 'শুনছি…',
    youSaid: 'আপনি বললেন:',
    replayAudio: 'পুনরায় শুনুন',
    trySaying: 'বলার চেষ্টা করুন বা চাপুন:',
    callDaughterLabel: '"মেয়েকে কল করুন"',
    appointmentLabel: '"আমার অ্যাপয়েন্টমেন্ট কখন?"',
    startGameLabel: '"খেলা শুরু করুন"',
    medicineLabel: '"আমার ওষুধ কখন?"',
    gamesReply: "আপনার মস্তিষ্কের খেলাগুলি এখন খুলছি। চলুন একসাথে ক্যান্ডি ম্যাচ বা মেমরি ম্যাচ খেলি!",
    medReminderFound: (time: string, title: string) => `নিশ্চয় আশা। আপনার ওষুধের রিমাইন্ডার ${time} টায় আছে: ${title}। জলের সাথে ওষুধটি নিতে ভুলবেন না।`,
    medReminderNone: "আপনার সব নির্ধারিত ওষুধ সময়মতো নেওয়া হয়েছে। আপনার কোনো প্রয়োজন হলে আমি এখানেই আছি।",
    apptFound: (time: string, date: string) => `আপনার পরের অ্যাপয়েন্টমেন্ট ${time} টায় (${date}) ডঃ বরুয়ার সাথে রিজিওনাল ওয়েলনেস ক্লিনিকে আছে।`,
    apptNone: "আজ আপনার কোনো ডাক্তারের অ্যাপয়েন্টমেন্ট নেই। সব কিছু ঠিক আছে।",
    allReminders: (count: number, details: string) => `আজ আপনার ${count} টি রিমাইন্ডার আছে: ${details}।`,
    callDaughterReply: "আপনার মেয়ে পূজা বর্মনের সাথে যোগাযোগ করিয়ে দিচ্ছি। +91 98640 12345 নম্বরে কল করা হচ্ছে…",
    langPageReply: "ভাষা ও সংস্কৃতির পেজটি খুলছি যাতে আপনি নিজের পছন্দের ভাষা বেছে নিতে পারেন।",
    fallbackReply: (cmd: string) => `আমি শুনলাম: "${cmd}"। চলুন একসাথে আপনার দৈনন্দিন কাজ, রিমাইন্ডার বা পরিবারের সংযোগগুলি দেখি।`,
  }
};

export const VoiceAssistantModal: React.FC = () => {
  const { voiceModalOpen, setVoiceModalOpen, patient, reminders, navigate, updatePatient, t, speak } = useApp();
  
  const displayLang = patient.preferredLanguage;
  const voiceLang = patient.voiceLanguage || patient.preferredLanguage;

  const displayStrings = ASSISTANT_TRANSLATIONS[displayLang] || ASSISTANT_TRANSLATIONS.en;
  const voiceStrings = ASSISTANT_TRANSLATIONS[voiceLang] || ASSISTANT_TRANSLATIONS.en;

  const [isListening, setIsListening] = useState<boolean>(false);
  const [transcript, setTranscript] = useState<string>('');
  const [assistantReply, setAssistantReply] = useState<{ display: string; voice: string }>({
    display: displayStrings.greeting,
    voice: voiceStrings.greeting,
  });
  const [recognitionActive, setRecognitionActive] = useState<boolean>(false);

  const recognitionRef = useRef<any>(null);

  // Sync greeting when languages change
  useEffect(() => {
    setAssistantReply({
      display: displayStrings.greeting,
      voice: voiceStrings.greeting,
    });
  }, [displayLang, voiceLang]);

  useEffect(() => {
    if (voiceModalOpen) {
      const currentDisplayGreeting = ASSISTANT_TRANSLATIONS[displayLang]?.greeting || ASSISTANT_TRANSLATIONS.en.greeting;
      const currentVoiceGreeting = ASSISTANT_TRANSLATIONS[voiceLang]?.greeting || ASSISTANT_TRANSLATIONS.en.greeting;
      setAssistantReply({ display: currentDisplayGreeting, voice: currentVoiceGreeting });
      playGentleTone(523.25, 'sine', 0.2, 0.1);
      speak(currentVoiceGreeting);
    } else {
      stopListening();
    }
  }, [voiceModalOpen, displayLang, voiceLang]);

  // Setup Web Speech Recognition if supported
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      if (SpeechRecognition) {
        const recognizer = new SpeechRecognition();
        recognizer.continuous = false;
        recognizer.interimResults = true;
        
        // Map voice language to speech recognition locale
        const recognitionLocales: Record<string, string> = {
          'en': 'en-IN',
          'hi': 'hi-IN',
          'as': 'as-IN',
          'bn': 'bn-IN',
        };
        recognizer.lang = recognitionLocales[voiceLang] || 'en-IN';

        recognizer.onstart = () => {
          setIsListening(true);
          setRecognitionActive(true);
        };

        recognizer.onresult = (event: any) => {
          const current = event.resultIndex;
          const text = event.results[current][0].transcript;
          setTranscript(text);
          if (event.results[current].isFinal) {
            handleVoiceCommand(text);
          }
        };

        recognizer.onerror = (e: any) => {
          console.debug('Speech recognition issue:', e);
          setIsListening(false);
          setRecognitionActive(false);
        };

        recognizer.onend = () => {
          setIsListening(false);
          setRecognitionActive(false);
        };

        recognitionRef.current = recognizer;
      }
    }
  }, [voiceLang]);

  const startListening = () => {
    setTranscript('');
    if (recognitionRef.current) {
      try {
        recognitionRef.current.start();
        setIsListening(true);
      } catch (err) {
        // Already active or error, simulate gentle listening
        setIsListening(true);
      }
    } else {
      setIsListening(true);
    }
  };

  const stopListening = () => {
    if (recognitionRef.current) {
      try {
        recognitionRef.current.stop();
      } catch {}
    }
    setIsListening(false);
  };

  const handleVoiceCommand = (cmd: string) => {
    const lower = cmd.toLowerCase();
    stopListening();

    let displayReply = '';
    let voiceReply = '';

    // Check keywords in all 4 supported languages
    const isGame = lower.includes('game') || lower.includes('play') || lower.includes('activity') || lower.includes('खेल') || lower.includes('খেল') || lower.includes('খেলা');
    const isMed = lower.includes('medicine') || lower.includes('pill') || lower.includes('dawai') || lower.includes('दवा') || lower.includes('औষধ') || lower.includes('ঔষধ');
    const isAppt = lower.includes('appointment') || lower.includes('doctor') || lower.includes('clinic') || lower.includes('डॉक्टर') || lower.includes('ডাক্তার') || lower.includes('এপইণ্টমেণ্ট') || lower.includes('অ্যাপয়েন্টমেন্ট');
    const isRem = lower.includes('reminder') || lower.includes('read') || lower.includes('schedule') || lower.includes('रिमाइंडर') || lower.includes('ৰিমাইণ্ডাৰ') || lower.includes('রিমাইন্ডার');
    const isDaughter = lower.includes('daughter') || lower.includes('pooja') || lower.includes('call') || lower.includes('family') || lower.includes('बेटी') || lower.includes('पूजा') || lower.includes('জীয়ৰী') || lower.includes('মেয়ে') || lower.includes('ফোন');
    const isLang = lower.includes('language') || lower.includes('bhasha') || lower.includes('hindi') || lower.includes('assamese') || lower.includes('भाषा') || lower.includes('ভাষা');

    if (isGame) {
      displayReply = displayStrings.gamesReply;
      voiceReply = voiceStrings.gamesReply;
      setAssistantReply({ display: displayReply, voice: voiceReply });
      speak(voiceReply);
      setTimeout(() => {
        setVoiceModalOpen(false);
        navigate('games');
      }, 1800);
    } else if (isMed) {
      const medReminder = reminders.find(r => r.type === 'medicine');
      if (medReminder) {
        displayReply = displayStrings.medReminderFound(medReminder.time, medReminder.title);
        voiceReply = voiceStrings.medReminderFound(medReminder.time, medReminder.title);
      } else {
        displayReply = displayStrings.medReminderNone;
        voiceReply = voiceStrings.medReminderNone;
      }
      setAssistantReply({ display: displayReply, voice: voiceReply });
      speak(voiceReply);
    } else if (isAppt) {
      const appt = reminders.find(r => r.type === 'appointment');
      if (appt) {
        displayReply = displayStrings.apptFound(appt.time, appt.date);
        voiceReply = voiceStrings.apptFound(appt.time, appt.date);
      } else {
        displayReply = displayStrings.apptNone;
        voiceReply = voiceStrings.apptNone;
      }
      setAssistantReply({ display: displayReply, voice: voiceReply });
      speak(voiceReply);
    } else if (isRem) {
      const activeList = reminders.filter(r => !r.completed);
      const details = activeList.map(r => `${r.title} at ${r.time}`).join(', ');
      
      displayReply = displayStrings.allReminders(activeList.length, details);
      voiceReply = voiceStrings.allReminders(activeList.length, details);
      setAssistantReply({ display: displayReply, voice: voiceReply });
      speak(voiceReply);
    } else if (isDaughter) {
      displayReply = displayStrings.callDaughterReply;
      voiceReply = voiceStrings.callDaughterReply;
      setAssistantReply({ display: displayReply, voice: voiceReply });
      speak(voiceReply);
      setTimeout(() => {
        setVoiceModalOpen(false);
        navigate('family');
      }, 2000);
    } else if (isLang) {
      displayReply = displayStrings.langPageReply;
      voiceReply = voiceStrings.langPageReply;
      setAssistantReply({ display: displayReply, voice: voiceReply });
      speak(voiceReply);
      setTimeout(() => {
        setVoiceModalOpen(false);
        navigate('language-culture');
      }, 2000);
    } else {
      displayReply = displayStrings.fallbackReply(cmd);
      voiceReply = voiceStrings.fallbackReply(cmd);
      setAssistantReply({ display: displayReply, voice: voiceReply });
      speak(voiceReply);
    }
  };

  const executeSampleCommand = (commandText: string) => {
    setTranscript(commandText);
    handleVoiceCommand(commandText);
  };

  if (!voiceModalOpen) return null;

  return (
    <div 
      className="fixed inset-0 z-50 bg-emerald-950/60 backdrop-blur-md flex items-center justify-center p-4 transition-all"
      id="voice-assistant-modal"
      role="dialog"
      aria-modal="true"
      aria-labelledby="voice-modal-title"
    >
      <div className="bg-white rounded-3xl max-w-xl w-full p-6 sm:p-8 shadow-2xl border border-emerald-100 relative overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        
        {/* Close Button */}
        <button
          onClick={() => setVoiceModalOpen(false)}
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
             displayLang === 'as' ? 'স্বাভাৱিকভাৱে অসমীয়া, ইংৰাজী, হিন্দী বা বঙালী ভাষাত কথা কওক' : 
             displayLang === 'bn' ? 'স্বাভাবিকভাবে বাংলা, ইংরেজি, হিন্দি বা অসমীয়া ভাষায় কথা বলুন' : 
             'Speak naturally in English, Hindi, Assamese or Bengali'}
          </p>
        </div>

        {/* Central Animated Microphone Orb */}
        <div className="flex flex-col items-center justify-center my-6">
          <div className="relative">
            {isListening && (
              <>
                <div className="absolute -inset-4 rounded-full bg-emerald-400/30 animate-ping"></div>
                <div className="absolute -inset-8 rounded-full bg-emerald-300/20 animate-pulse"></div>
              </>
            )}
            
            <button
              onClick={isListening ? stopListening : startListening}
              className={`w-28 h-28 rounded-full flex flex-col items-center justify-center shadow-lg transition-all duration-300 relative z-10 cursor-pointer ${
                isListening
                  ? 'bg-gradient-to-tr from-emerald-600 to-teal-500 text-white scale-105 ring-4 ring-emerald-300'
                  : 'bg-emerald-50 hover:bg-emerald-100 text-emerald-900 border-2 border-emerald-300'
              }`}
              id="voice-mic-trigger-btn"
              aria-label={isListening ? 'Stop listening' : 'Start listening'}
            >
              {isListening ? (
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
            {isListening ? displayStrings.listening : displayStrings.tapToTalkSub}
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
                onClick={() => speak(assistantReply.voice)}
                className="text-xs text-emerald-700 hover:text-emerald-900 font-semibold underline"
                title="Replay spoken response"
              >
                {displayStrings.replayAudio}
              </button>
            </div>
            <p className="text-base sm:text-lg font-semibold text-emerald-950 leading-relaxed">
              {assistantReply.display}
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
              onClick={() => executeSampleCommand('medicine')}
              className="text-left px-3.5 py-2.5 rounded-xl bg-white hover:bg-emerald-50 border border-emerald-200 text-xs sm:text-sm font-medium text-emerald-900 flex items-center justify-between gap-2 transition-all hover:border-emerald-400"
            >
              <span className="flex items-center gap-2">
                <Bell className="w-4 h-4 text-emerald-700 shrink-0" />
                <span>{displayStrings.medicineLabel}</span>
              </span>
              <ArrowRight className="w-3.5 h-3.5 text-emerald-400" />
            </button>

            <button
              onClick={() => executeSampleCommand('game')}
              className="text-left px-3.5 py-2.5 rounded-xl bg-white hover:bg-emerald-50 border border-emerald-200 text-xs sm:text-sm font-medium text-emerald-900 flex items-center justify-between gap-2 transition-all hover:border-emerald-400"
            >
              <span className="flex items-center gap-2">
                <Gamepad2 className="w-4 h-4 text-teal-700 shrink-0" />
                <span>{displayStrings.startGameLabel}</span>
              </span>
              <ArrowRight className="w-3.5 h-3.5 text-teal-400" />
            </button>

            <button
              onClick={() => executeSampleCommand('appointment')}
              className="text-left px-3.5 py-2.5 rounded-xl bg-white hover:bg-emerald-50 border border-emerald-200 text-xs sm:text-sm font-medium text-emerald-900 flex items-center justify-between gap-2 transition-all hover:border-emerald-400"
            >
              <span className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-amber-600 shrink-0" />
                <span>{displayStrings.appointmentLabel}</span>
              </span>
              <ArrowRight className="w-3.5 h-3.5 text-amber-400" />
            </button>

            <button
              onClick={() => executeSampleCommand('daughter')}
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
