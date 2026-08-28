import { Reminder, CaregiverContact, CareAlert, PatientProfile, CognitiveMetrics } from '../types';

export interface RegionalCulturalItem {
  id: string;
  name: string;
  regionalName: string;
  region: string;
  category: 'nature' | 'heritage' | 'music' | 'craft' | 'wildlife';
  iconEmoji: string;
  description: string;
  color: string;
}

export const NER_CULTURAL_ITEMS: RegionalCulturalItem[] = [
  {
    id: 'kaziranga_rhino',
    name: 'One-Horned Rhino',
    regionalName: 'গঁড় (Gor)',
    region: 'Kaziranga, Assam',
    category: 'wildlife',
    iconEmoji: '🦏',
    description: 'Pride of Assam grasslands',
    color: '#0d5c3a',
  },
  {
    id: 'hornbill_bird',
    name: 'Great Hornbill',
    regionalName: 'Hornbill (U-rok)',
    region: 'Nagaland & Arunachal',
    category: 'wildlife',
    iconEmoji: '🦜',
    description: 'Revered symbol of courage and festivity',
    color: '#d97706',
  },
  {
    id: 'assam_tea_leaf',
    name: 'Golden Tea Leaf',
    regionalName: 'চাহ পাত (Chah Paat)',
    region: 'Upper Assam Valleys',
    category: 'nature',
    iconEmoji: '🍃',
    description: 'Fragrant green tea garden shoots',
    color: '#15803d',
  },
  {
    id: 'dzukou_lily',
    name: 'Dzukou Valley Lily',
    regionalName: 'Dzukou Lily',
    region: 'Nagaland-Manipur Border',
    category: 'nature',
    iconEmoji: '🌸',
    description: 'Endemic rare blossom of high ridges',
    color: '#db2777',
  },
  {
    id: 'root_bridge',
    name: 'Living Root Bridge',
    regionalName: 'Jingkieng Jri',
    region: 'Cherrapunji, Meghalaya',
    category: 'heritage',
    iconEmoji: '🌿',
    description: 'Ancient bio-engineering by Khasi elders',
    color: '#047857',
  },
  {
    id: 'majuli_mask',
    name: 'Majuli Wooden Mask',
    regionalName: 'মাজুলীৰ মুখা (Mukha)',
    region: 'Majuli Island, Assam',
    category: 'craft',
    iconEmoji: '🎭',
    description: 'Traditional Bhaona theatrical art',
    color: '#b45309',
  },
  {
    id: 'bihu_dhol',
    name: 'Bihu Dhol Drum',
    regionalName: 'ঢোল (Dhol)',
    region: 'Assam',
    category: 'music',
    iconEmoji: '🥁',
    description: 'Rhythmic drum of spring harvest',
    color: '#ea580c',
  },
  {
    id: 'loktak_phumdi',
    name: 'Loktak Floating Phumdi',
    regionalName: 'ফুমদী (Phumdi)',
    region: 'Loktak Lake, Manipur',
    category: 'nature',
    iconEmoji: '🏞️',
    description: 'Unique floating circular islands of Sangai deer',
    color: '#0284c7',
  },
  {
    id: 'mizo_bamboo_craft',
    name: 'Mizo Bamboo Basket',
    regionalName: 'Thlangra / Bamboo',
    region: 'Aizawl, Mizoram',
    category: 'craft',
    iconEmoji: '🎍',
    description: 'Intricate woven evergreen bamboo',
    color: '#65a30d',
  },
  {
    id: 'muga_silk_spool',
    name: 'Golden Muga Silk',
    regionalName: 'মুগা ৰেচম (Muga)',
    region: 'Assam & Meghalaya',
    category: 'craft',
    iconEmoji: '🧵',
    description: 'Naturally shimmering golden royal weave',
    color: '#ca8a04',
  },
];

export const INITIAL_DEMO_PATIENT: PatientProfile = {
  id: 'patient_asha_01',
  name: 'Asha',
  gender: 'Female',
  age: 72,
  region: 'North Eastern India',
  city: 'Guwahati, Assam',
  preferredLanguage: 'en',
  textSize: 'medium',
  culturalPreference: 'ner-default',
  voiceEnabled: true,
  voiceSpeed: 0.9,
  offlineEnabled: true,
  highContrast: false,
  reducedMotion: false,
  emergencyContact: '+91 98640 12345 (Pooja - Daughter)',
  avatar: '👵',
};

export const INITIAL_DEMO_REMINDERS: Reminder[] = [
  {
    id: 'rem_1',
    type: 'medicine',
    title: 'Blood pressure medicine',
    time: '20:00',
    date: 'Today',
    repeat: 'Every day',
    description: 'Take 1 tablet of Amlodipine 5mg after dinner with lukewarm water.',
    completed: false,
    voiceReminder: true,
    synced: true,
  },
  {
    id: 'rem_2',
    type: 'hydration',
    title: 'Drink a glass of water',
    time: '20:30',
    date: 'Today',
    repeat: 'Every day',
    description: 'Hydration helps clear thinking and maintains gentle blood circulation.',
    completed: false,
    voiceReminder: true,
    synced: true,
  },
  {
    id: 'rem_3',
    type: 'call',
    title: 'Talk with family',
    time: '19:00',
    date: 'Today',
    repeat: 'Every day',
    description: 'Evening catchup with daughter Pooja and little grandson Kabir.',
    completed: true,
    completedAt: '19:08',
    voiceReminder: true,
    synced: true,
  },
  {
    id: 'rem_4',
    type: 'appointment',
    title: 'Medical appointment',
    time: '10:00',
    date: 'Tomorrow',
    repeat: 'Once',
    description: 'Dr. Barua Neurological Follow-up at Regional Wellness Clinic.',
    completed: false,
    voiceReminder: true,
    synced: true,
  },
];

export const INITIAL_CAREGIVER_CONTACTS: CaregiverContact[] = [
  {
    id: 'cg_1',
    name: 'Pooja Barman',
    relationship: 'Daughter',
    phone: '+91 98640 12345',
    avatar: '👩',
    connected: true,
    lastInteraction: '10 mins ago',
    role: 'Primary Caregiver',
  },
  {
    id: 'cg_2',
    name: 'Rohan Sharma',
    relationship: 'Son',
    phone: '+91 98640 54321',
    avatar: '👨',
    connected: true,
    lastInteraction: '2 hours ago',
    role: 'Family Member',
  },
  {
    id: 'cg_3',
    name: 'Sister Mary Lalthangpuii',
    relationship: 'Community Health Worker',
    phone: '+91 94350 99887',
    avatar: '👩‍⚕️',
    connected: true,
    lastInteraction: 'Yesterday',
    role: 'Attending Nurse',
  },
];

export const INITIAL_CARE_ALERTS: CareAlert[] = [
  {
    id: 'alert_1',
    type: 'warning',
    title: 'Hydration reminder missed',
    description: 'The 20:30 water hydration check has not been acknowledged yet.',
    time: '20:30',
    severity: 'gentle',
    resolved: false,
    relatedCategory: 'hydration',
  },
  {
    id: 'alert_2',
    type: 'info',
    title: 'Dr. Barua Appointment Scheduled',
    description: 'Tomorrow morning at 10:00 AM at Regional Health Sub-center.',
    time: 'Tomorrow',
    severity: 'gentle',
    resolved: false,
    relatedCategory: 'appointment',
  },
  {
    id: 'alert_3',
    type: 'success',
    title: 'Evening Family Call Completed',
    description: 'Asha spent 14 minutes in a cheerful call with daughter Pooja.',
    time: '19:15',
    severity: 'gentle',
    resolved: true,
    relatedCategory: 'activity',
  },
];

export const INITIAL_COGNITIVE_METRICS: CognitiveMetrics = {
  weeklyActivityScore: 0,
  accuracyGrowth: 0,
  gamesCompletedThisWeek: 0,
  avgSessionDurationMin: 0,
  memoryScore: 0,
  attentionScore: 0,
  recallScore: 0,
  patternScore: 0,
  dailyActivityMinutes: [
    { day: 'Mon', minutes: 0, completed: false },
    { day: 'Tue', minutes: 0, completed: false },
    { day: 'Wed', minutes: 0, completed: false },
    { day: 'Thu', minutes: 0, completed: false },
    { day: 'Fri', minutes: 0, completed: false },
    { day: 'Sat', minutes: 0, completed: false },
    { day: 'Sun', minutes: 0, completed: false },
  ],
  adaptiveRecommendation: 'No activity recorded yet. Encourage Asha to try a game to begin tracking cognitive engagement.',
};

// No pre-seeded sessions — analytics start at zero and grow as the user plays
export const RECENT_GAME_SESSIONS: {
  id: string;
  game: 'memory-match' | 'candy-match' | 'pattern-garden' | 'object-recall' | 'daily-recall';
  score: number;
  accuracy: number;
  duration: number;
  difficulty: 'Easy' | 'Moderate' | 'Hard';
  completedAt: string;
  synced: boolean;
}[] = [];
