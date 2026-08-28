import React, { useState, useEffect, useRef } from 'react';
import { useApp } from '../context/AppContext';
import { Mic, MicOff, Volume2, X, Sparkles, Phone, Bell, Gamepad2, Globe, Heart, ArrowRight } from 'lucide-react';
import { playGentleTone } from '../utils/audioSynth';

export const VoiceAssistantModal: React.FC = () => {
  const { voiceModalOpen, setVoiceModalOpen, patient, reminders, navigate, updatePatient, t, speak } = useApp();
  const [isListening, setIsListening] = useState<boolean>(false);
  const [transcript, setTranscript] = useState<string>('');
  const [assistantReply, setAssistantReply] = useState<string>('Hello Asha! I am Sathi, your gentle companion. How can I help you today?');
  const [recognitionActive, setRecognitionActive] = useState<boolean>(false);

  const recognitionRef = useRef<any>(null);

  useEffect(() => {
    if (voiceModalOpen) {
      playGentleTone(523.25, 'sine', 0.2, 0.1);
      speak(assistantReply);
    } else {
      stopListening();
    }
  }, [voiceModalOpen]);

  // Setup Web Speech Recognition if supported
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      if (SpeechRecognition) {
        const recognizer = new SpeechRecognition();
        recognizer.continuous = false;
        recognizer.interimResults = true;
        recognizer.lang = patient.preferredLanguage === 'hi' ? 'hi-IN' : 'en-IN';

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
  }, [patient.preferredLanguage]);

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

    let reply = '';

    if (lower.includes('game') || lower.includes('play') || lower.includes('activity')) {
      reply = "Opening your cognitive activities now. Let's play Candy Match or Memory Match together!";
      setAssistantReply(reply);
      speak(reply);
      setTimeout(() => {
        setVoiceModalOpen(false);
        navigate('games');
      }, 1800);
    } else if (lower.includes('medicine') || lower.includes('pill') || lower.includes('dawai') || lower.includes('blood pressure')) {
      const medReminder = reminders.find(r => r.type === 'medicine');
      if (medReminder) {
        reply = `Sure Asha. Your medicine reminder is at ${medReminder.time}. It is for: ${medReminder.title}. Remember to take it with water.`;
      } else {
        reply = "You have all your scheduled medicines up to date. I'm right here if you need anything.";
      }
      setAssistantReply(reply);
      speak(reply);
    } else if (lower.includes('appointment') || lower.includes('doctor') || lower.includes('clinic')) {
      const appt = reminders.find(r => r.type === 'appointment');
      if (appt) {
        reply = `Your next appointment is at ${appt.time} (${appt.date}) with Dr. Barua at the Regional Wellness Clinic.`;
      } else {
        reply = "You have no pending doctor appointments for today. Everything is calm and clear.";
      }
      setAssistantReply(reply);
      speak(reply);
    } else if (lower.includes('reminder') || lower.includes('read') || lower.includes('schedule')) {
      const activeList = reminders.filter(r => !r.completed);
      reply = `You have ${activeList.length} reminders for today: ${activeList.map(r => `${r.title} at ${r.time}`).join(', ')}.`;
      setAssistantReply(reply);
      speak(reply);
    } else if (lower.includes('daughter') || lower.includes('pooja') || lower.includes('call') || lower.includes('family')) {
      reply = "Connecting you with your daughter Pooja Barman right now. Calling +91 98640 12345…";
      setAssistantReply(reply);
      speak(reply);
      setTimeout(() => {
        setVoiceModalOpen(false);
        navigate('family');
      }, 2000);
    } else if (lower.includes('language') || lower.includes('bhasha') || lower.includes('hindi') || lower.includes('assamese')) {
      reply = "Opening your Language and Culture personalization page so you can choose your preferred North Eastern language.";
      setAssistantReply(reply);
      speak(reply);
      setTimeout(() => {
        setVoiceModalOpen(false);
        navigate('language-culture');
      }, 2000);
    } else {
      reply = `I heard: "${cmd}". Let's explore your daily activities, reminders, or family connect together.`;
      setAssistantReply(reply);
      speak(reply);
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
            Talk to MindMate
          </h2>
          <p className="text-sm text-emerald-700 mt-1 font-medium">
            Speak naturally in English, Hindi, Assamese or your regional language
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
                  <span className="text-[11px] font-bold mt-1 uppercase tracking-wider">Listening…</span>
                </>
              ) : (
                <>
                  <Mic className="w-9 h-9 text-emerald-800" />
                  <span className="text-xs font-bold mt-1 text-emerald-800">Tap to Talk</span>
                </>
              )}
            </button>
          </div>

          <p className="text-xs text-emerald-600/90 font-medium mt-3">
            {isListening ? 'Sathi is listening to your voice…' : 'Tap the microphone or choose a question below'}
          </p>
        </div>

        {/* Live Transcript and Sathi Response Box */}
        <div className="bg-emerald-50/70 border border-emerald-200/80 rounded-2xl p-4 sm:p-5 mb-6 text-left" id="voice-transcript-box">
          {transcript && (
            <div className="mb-3 pb-3 border-b border-emerald-200/60">
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-700 block mb-1">
                You said:
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
                onClick={() => speak(assistantReply)}
                className="text-xs text-emerald-700 hover:text-emerald-900 font-semibold underline"
                title="Replay spoken response"
              >
                Replay audio
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
            Try saying or tap to ask:
          </span>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2" id="voice-sample-commands">
            <button
              onClick={() => executeSampleCommand('Remind me to take my medicine')}
              className="text-left px-3.5 py-2.5 rounded-xl bg-white hover:bg-emerald-50 border border-emerald-200 text-xs sm:text-sm font-medium text-emerald-900 flex items-center justify-between gap-2 transition-all hover:border-emerald-400"
            >
              <span className="flex items-center gap-2">
                <Bell className="w-4 h-4 text-emerald-700 shrink-0" />
                <span>"When is my medicine?"</span>
              </span>
              <ArrowRight className="w-3.5 h-3.5 text-emerald-400" />
            </button>

            <button
              onClick={() => executeSampleCommand('Start my game')}
              className="text-left px-3.5 py-2.5 rounded-xl bg-white hover:bg-emerald-50 border border-emerald-200 text-xs sm:text-sm font-medium text-emerald-900 flex items-center justify-between gap-2 transition-all hover:border-emerald-400"
            >
              <span className="flex items-center gap-2">
                <Gamepad2 className="w-4 h-4 text-teal-700 shrink-0" />
                <span>"Start my game"</span>
              </span>
              <ArrowRight className="w-3.5 h-3.5 text-teal-400" />
            </button>

            <button
              onClick={() => executeSampleCommand('What is my appointment tomorrow?')}
              className="text-left px-3.5 py-2.5 rounded-xl bg-white hover:bg-emerald-50 border border-emerald-200 text-xs sm:text-sm font-medium text-emerald-900 flex items-center justify-between gap-2 transition-all hover:border-emerald-400"
            >
              <span className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-amber-600 shrink-0" />
                <span>"What is my appointment?"</span>
              </span>
              <ArrowRight className="w-3.5 h-3.5 text-amber-400" />
            </button>

            <button
              onClick={() => executeSampleCommand('Call my daughter')}
              className="text-left px-3.5 py-2.5 rounded-xl bg-white hover:bg-emerald-50 border border-emerald-200 text-xs sm:text-sm font-medium text-emerald-900 flex items-center justify-between gap-2 transition-all hover:border-emerald-400"
            >
              <span className="flex items-center gap-2">
                <Heart className="w-4 h-4 text-rose-600 shrink-0" />
                <span>"Call my daughter"</span>
              </span>
              <ArrowRight className="w-3.5 h-3.5 text-rose-400" />
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
