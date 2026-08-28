/**
 * Edge-TTS Backend Server
 * Streams Microsoft Edge neural TTS audio to the Vite frontend via /api/tts
 */
const express = require('express');
const { MsEdgeTTS, OUTPUT_FORMAT } = require('msedge-tts');

const app = express();
const PORT = 3001;

// Voice mapping per language code
const VOICE_MAP = {
  'en':    'en-IN-NeerjaNeural',      // Indian English (female, warm)
  'en-IN': 'en-IN-NeerjaNeural',
  'en-US': 'en-US-AriaNeural',
  'hi':    'hi-IN-SwaraNeural',       // Hindi (female)
  'hi-IN': 'hi-IN-SwaraNeural',
  'as':    'as-IN-YashicaNeural',     // Assamese (female)
  'as-IN': 'as-IN-YashicaNeural',
  'bn':    'bn-IN-TanishaaNeural',    // Bengali (female)
  'bn-IN': 'bn-IN-TanishaaNeural',
};

const DEFAULT_VOICE = 'en-IN-NeerjaNeural';

app.get('/api/tts', async (req, res) => {
  const text = req.query.text;
  const lang = req.query.lang || 'en';
  const rate = parseFloat(req.query.rate) || 0.9;

  if (!text || typeof text !== 'string' || text.trim().length === 0) {
    return res.status(400).json({ error: 'text query param is required' });
  }

  const voice = VOICE_MAP[lang] || VOICE_MAP[lang.split('-')[0]] || DEFAULT_VOICE;

  // Map numeric rate (0.5–2.0) to Edge TTS prosody rate string (+X% or -X%)
  // Default 1.0 = +0%, 0.9 → -10%, 1.2 → +20%
  const ratePercent = Math.round((rate - 1.0) * 100);
  const rateStr = ratePercent >= 0 ? `+${ratePercent}%` : `${ratePercent}%`;

  try {
    const tts = new MsEdgeTTS();
    await tts.setMetadata(voice, OUTPUT_FORMAT.AUDIO_24KHZ_48KBITRATE_MONO_MP3);

    res.setHeader('Content-Type', 'audio/mpeg');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Access-Control-Allow-Origin', '*');

    const readable = tts.toStream(text, { rate: rateStr });
    readable.audioStream.pipe(res);

    readable.audioStream.on('error', (err) => {
      console.error('[edge-tts] Stream error:', err.message);
      if (!res.headersSent) {
        res.status(500).json({ error: 'TTS stream error' });
      }
    });

  } catch (err) {
    console.error('[edge-tts] Error:', err.message);
    if (!res.headersSent) {
      res.status(500).json({ error: err.message });
    }
  }
});

// Health check
app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', service: 'edge-tts' });
});

app.listen(PORT, () => {
  console.log(`\n🎙️  Edge-TTS server running at http://localhost:${PORT}`);
  console.log(`   Endpoint: GET /api/tts?text=Hello&lang=en&rate=0.9\n`);
});
