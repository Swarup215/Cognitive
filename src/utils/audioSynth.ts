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

// Speech synthesis wrapper — uses Microsoft Edge TTS neural voices via backend proxy

let currentAudio: HTMLAudioElement | null = null;

export function stopSpeech(): void {
  if (currentAudio) {
    try {
      currentAudio.pause();
      currentAudio.currentTime = 0;
      currentAudio.src = '';
    } catch {}
    currentAudio = null;
  }
  if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
    try {
      window.speechSynthesis.cancel();
    } catch {}
  }
}

export async function speakGentleText(
  text: string,
  lang: string = 'en-IN',
  rate: number = 0.9
): Promise<void> {
  if (typeof window === 'undefined' || !text?.trim()) return;

  // Stop any currently playing audio immediately
  stopSpeech();

  // Map lang code for edge-tts (e.g. 'en-IN' → 'en', 'hi-IN' → 'hi')
  const langCode = lang.split('-')[0] || 'en';

  try {
    const params = new URLSearchParams({ text, lang: langCode, rate: String(rate) });
    const response = await fetch(`/api/tts?${params.toString()}`);

    if (!response.ok) throw new Error(`TTS backend error: ${response.status}`);

    const blob = await response.blob();
    const url = URL.createObjectURL(blob);

    const audio = new Audio(url);
    currentAudio = audio;

    audio.onended = () => {
      URL.revokeObjectURL(url);
      currentAudio = null;
    };
    audio.onerror = () => {
      URL.revokeObjectURL(url);
      currentAudio = null;
    };

    await audio.play();
  } catch (e) {
    console.debug('[edge-tts] Audio playback error:', e);
  }
}


