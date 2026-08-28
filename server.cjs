/**
 * MindMate Backend Server
 * - /api/tts   → Microsoft Edge Neural TTS (streaming audio)
 * - /api/chat  → Groq LLM (openai/gpt-oss-120b) for Sathi voice assistant
 */
require('dotenv').config();
const express = require('express');
const { MsEdgeTTS, OUTPUT_FORMAT } = require('msedge-tts');
const Groq = require('groq-sdk');

const app = express();
const PORT = 3001;

app.use(express.json());

// ─── Groq client ────────────────────────────────────────────────────────────
const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

// ─── Voice mapping for Edge-TTS ─────────────────────────────────────────────
const VOICE_MAP = {
  'en':    'en-IN-NeerjaNeural',
  'en-IN': 'en-IN-NeerjaNeural',
  'en-US': 'en-US-AriaNeural',
  'hi':    'hi-IN-SwaraNeural',
  'hi-IN': 'hi-IN-SwaraNeural',
  'as':    'as-IN-YashicaNeural',
  'as-IN': 'as-IN-YashicaNeural',
  'bn':    'bn-IN-TanishaaNeural',
  'bn-IN': 'bn-IN-TanishaaNeural',
  'mni':   'en-IN-NeerjaNeural',   // Meitei → fallback English neural
  'lus':   'en-IN-NeerjaNeural',   // Mizo → fallback
  'kha':   'en-IN-NeerjaNeural',   // Khasi → fallback
  'grt':   'en-IN-NeerjaNeural',   // Garo → fallback
  'trp':   'en-IN-NeerjaNeural',   // Kokborok → fallback
  'nag':   'en-IN-NeerjaNeural',   // Nagamese → fallback
};
const DEFAULT_VOICE = 'en-IN-NeerjaNeural';

// ─── Language label map for system prompt ────────────────────────────────────
const LANG_NAMES = {
  en: 'English',
  hi: 'Hindi',
  as: 'Assamese',
  bn: 'Bengali',
  mni: 'Meitei (Manipuri)',
  lus: 'Mizo',
  kha: 'Khasi',
  grt: 'Garo',
  trp: 'Kokborok',
  nag: 'Nagamese',
};

// ─── /api/chat  ──────────────────────────────────────────────────────────────
app.post('/api/chat', async (req, res) => {
  const {
    message,
    lang = 'en',
    patient = {},
    currentView = 'home',
    userMode = 'sathi',
    reminders = [],
    cognitiveMetrics = {},
    careAlerts = [],
    caregivers = [],
    networkStatus = 'online',
  } = req.body;

  if (!message || !message.trim()) {
    return res.status(400).json({ error: 'message is required' });
  }

  const langName = LANG_NAMES[lang] || 'English';
  const patientName = patient.name || 'Asha Barman';

  const reminderSummary = reminders.length > 0
    ? reminders.map(r => `- [${r.completed ? 'COMPLETED' : 'PENDING'}] ${r.title} at ${r.time} (${r.type})`).join('\n')
    : 'No reminders scheduled today.';

  const alertSummary = careAlerts.length > 0
    ? careAlerts.map(a => `- [${a.resolved ? 'RESOLVED' : 'ACTIVE'}] ${a.title} (${a.severity} priority)`).join('\n')
    : 'No active care alerts.';

  const caregiverSummary = caregivers.length > 0
    ? caregivers.map(c => `- ${c.name} (${c.relation}): ${c.phone}`).join('\n')
    : 'No caregivers listed.';

  const systemPrompt = `You are Sathi, a warm, gentle, and caring AI voice assistant embedded in the "MindMate" Cognitive Care web application. You are speaking with ${patientName}, an elderly user in North East India.

=== STRICT KNOWLEDGE & DOMAIN SCOPE ===
1. You MUST ONLY answer questions related to the MindMate application, ${patientName}'s care, reminders, cognitive games, health routines, family contacts, and website features.
2. You MUST STRICTLY REFUSE any questions outside the scope of MindMate or ${patientName}'s daily cognitive care (such as general knowledge, world news, politics, mathematics problems, coding, outer world trivia, celebrity news, science, history, etc.).
3. If the user asks an out-of-scope or unrelated question, respond politely in ${langName}: "I am Sathi, your MindMate companion. I am here only to help you with your daily reminders, cognitive games, health care, and family connections on MindMate. How can I assist you with your activities today?"
4. Always address the user warmly as "${patientName}".
5. Respond ONLY in ${langName} in a simple, gentle, clear voice suitable for elderly users (1 to 3 short sentences max).
6. Do NOT mention that you are an AI, LLM, or software model. You are Sathi, their gentle personal companion on MindMate.

=== LIVE WEBSITE CONTEXT (CURRENT REAL-TIME STATE) ===
- Active View / Screen: ${currentView}
- User Interaction Mode: ${userMode === 'sathi' ? 'Sathi (Elderly-Friendly Calm Mode)' : 'Command (Caregiver Monitoring Dashboard Mode)'}
- Network Connection: ${networkStatus}
- Patient Profile: ${patientName}, Age ${patient.age || 72}, Location: ${patient.location || 'Guwahati, Assam'}, Preferred Language: ${langName}, Text Scaling: ${patient.textSize || 'comfortable'}
- Weekly Cognitive Score: ${cognitiveMetrics.weeklyScore || 82}% (Memory: ${cognitiveMetrics.memoryScore || 85}%, Attention: ${cognitiveMetrics.attentionScore || 78}%, Pattern: ${cognitiveMetrics.patternScore || 80}%, Recall: ${cognitiveMetrics.recallScore || 82}%)
- Adaptive Recommendation: ${cognitiveMetrics.adaptiveRecommendation || 'Keep up the gentle daily practice.'}
- Scheduled Reminders:
${reminderSummary}
- Active Care Alerts:
${alertSummary}
- Family & Caregiver Contacts:
${caregiverSummary}

=== MINDMATE WEBSITE FEATURES & NAVIGATION MAP ===
1. Home Dashboard ('home'): Daily greeting, hero card for memory/attention focus, quick access to games, reminders, voice assistant, and caregiver mode switch.
2. Cognitive Centre ('games'): Hub featuring 5 specialized games for cognitive maintenance:
   - Candy Match-3 ('candy-match'): 8x8 match-3 game with visual swaps, cascading gravity, score multipliers.
   - Cultural Memory Match ('memory-match'): Card flip game with North Eastern motifs (One-Horned Rhino, Hornbill, Muga Silk, Living Root Bridge).
   - Pattern Garden ('pattern-garden'): Visual sequence recognition with North Eastern flora.
   - Object Recall ('object-recall'): Visual memory exercise to recognize item locations.
   - Daily Routine Recall ('daily-recall'): Gentle daily activity questions designed with zero failure anxiety.
3. Reminders & Schedule ('reminders', 'add-reminder'): Medicine reminders with audio alerts, hydration trackers, doctor appointments, family call reminders.
4. Caregiver Dashboard ('caregiver'): Monitoring panel with activity trends, accuracy growth metrics, active care alerts, and family contact controls.
5. Cognitive Report ('cognitive-report'): Detailed memory, attention, pattern, and recall analytics with adaptive difficulty suggestions.
6. Family Connect ('family'): Direct call buttons for family (e.g. daughter Pooja Barman at +91 98640 12345).
7. Language & Personalization ('language-culture', 'settings'): Support for 10 North Eastern regional languages (English, Hindi, Assamese, Bengali, Manipuri/Meitei, Mizo, Khasi, Garo, Kokborok, Nagamese) and custom font sizing.
8. Judge Demo Tour: 12-step guided evaluation walkthrough.

Answer the user's prompt helpfully if it pertains to MindMate, their health/reminders/games/family, or politely decline if out-of-scope.`;

  try {
    const completion = await groq.chat.completions.create({
      model: 'openai/gpt-oss-120b',
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user',   content: message },
      ],
      temperature: 0.7,
      max_completion_tokens: 256,
      top_p: 0.9,
      reasoning_effort: 'medium',
      stream: false,
    });

    const reply = completion.choices?.[0]?.message?.content?.trim() || "I'm right here for you on MindMate! How can I help you today?";
    res.json({ reply });
  } catch (err) {
    console.error('[groq] Error:', err.message);
    res.status(500).json({ error: err.message, reply: "I'm having a little trouble right now. Let's try again in a moment." });
  }
});

// ─── /api/tts  ───────────────────────────────────────────────────────────────
app.get('/api/tts', async (req, res) => {
  const text = req.query.text;
  const lang = req.query.lang || 'en';
  const rate = parseFloat(req.query.rate) || 0.9;

  if (!text || typeof text !== 'string' || text.trim().length === 0) {
    return res.status(400).json({ error: 'text query param is required' });
  }

  const voice = VOICE_MAP[lang] || VOICE_MAP[lang.split('-')[0]] || DEFAULT_VOICE;

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
      if (!res.headersSent) res.status(500).json({ error: 'TTS stream error' });
    });
  } catch (err) {
    console.error('[edge-tts] Error:', err.message);
    if (!res.headersSent) res.status(500).json({ error: err.message });
  }
});

// ─── /api/health  ────────────────────────────────────────────────────────────
app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', services: ['edge-tts', 'groq-chat'] });
});

app.listen(PORT, () => {
  console.log(`\n🎙️  MindMate backend running at http://localhost:${PORT}`);
  console.log(`   TTS:  GET  /api/tts?text=Hello&lang=en&rate=0.9`);
  console.log(`   Chat: POST /api/chat  { message, lang, patient, currentView, reminders, ... }\n`);
});
