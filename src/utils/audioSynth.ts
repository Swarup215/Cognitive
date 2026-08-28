// Web Audio API gentle synthesizer for calming elderly-friendly sound effects

let audioCtx: AudioContext | null = null;

function getAudioContext(): AudioContext | null {
  if (typeof window === 'undefined') return null;
  if (!audioCtx) {
    const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
    if (AudioContextClass) {
      audioCtx = new AudioContextClass();
    }
  }
  if (audioCtx && audioCtx.state === 'suspended') {
    audioCtx.resume().catch(() => {});
  }
  return audioCtx;
}

export function playGentleTone(freq: number = 440, type: OscillatorType = 'sine', duration: number = 0.25, gainLevel: number = 0.15) {
  try {
    const ctx = getAudioContext();
    if (!ctx) return;

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = type;
    osc.frequency.setValueAtTime(freq, ctx.currentTime);

    gain.gain.setValueAtTime(gainLevel, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + duration);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start();
    osc.stop(ctx.currentTime + duration);
  } catch (err) {
    console.debug('Audio not allowed yet:', err);
  }
}

// Gentle chime for card flips
export function playCardFlipSound() {
  playGentleTone(523.25, 'sine', 0.12, 0.08); // C5
}

// Joyful double chime for match
export function playMatchSuccessSound() {
  setTimeout(() => playGentleTone(587.33, 'sine', 0.15, 0.12), 0);   // D5
  setTimeout(() => playGentleTone(880.00, 'sine', 0.25, 0.14), 100); // A5
}

// Gentle tap for candy swap
export function playSwapSound() {
  playGentleTone(392.00, 'triangle', 0.1, 0.09); // G4
}

// Multi combo celebration
export function playComboSound(multiplier: number = 1) {
  const baseFreq = 440 + Math.min(multiplier * 60, 400);
  playGentleTone(baseFreq, 'sine', 0.2, 0.12);
}

// Completion celebratory arpeggio
export function playCelebrationFanfare() {
  const notes = [523.25, 659.25, 783.99, 1046.50]; // C5, E5, G5, C6
  notes.forEach((freq, idx) => {
    setTimeout(() => {
      playGentleTone(freq, 'sine', 0.35, 0.15);
    }, idx * 120);
  });
}

// Gentle reminder done chime
export function playReminderDoneSound() {
  playGentleTone(440, 'sine', 0.15, 0.1);
  setTimeout(() => playGentleTone(659.25, 'sine', 0.25, 0.12), 110);
}

// Speech synthesis wrapper for Sathi voice assistant
export function speakGentleText(text: string, lang: string = 'en-IN', rate: number = 0.9) {
  if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;
  try {
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = rate;
    utterance.pitch = 1.0;
    
    // Pick suitable voice
    const voices = window.speechSynthesis.getVoices();
    const preferredVoice = voices.find(v => v.lang.includes('IN') || v.lang.includes(lang));
    if (preferredVoice) {
      utterance.voice = preferredVoice;
    }
    
    window.speechSynthesis.speak(utterance);
  } catch (e) {
    console.debug('Speech synth error:', e);
  }
}
