export type TextSize = 'small' | 'medium' | 'large';

export type SupportedLanguage = 
  | 'en' // English (India)
  | 'hi' // Hindi
  | 'as' // Assamese
  | 'bn' // Bengali
  | 'mni' // Manipuri (Meitei)
  | 'lus' // Mizo
  | 'kha' // Khasi
  | 'grt' // Garo
  | 'trp' // Kokborok (Tripuri)
  | 'nag'; // Nagamese

export type CulturalTheme = 'ner-default' | 'assam-tea' | 'meghalaya-mist' | 'manipur-loktak' | 'nagaland-hills' | 'mizoram-bamboo';

export type ReminderType = 'medicine' | 'hydration' | 'call' | 'appointment' | 'routine' | 'custom';

export interface Reminder {
  id: string;
  type: ReminderType;
  title: string;
  time: string; // e.g. "20:00"
  date: string; // e.g. "Today", "Tomorrow", "2026-08-28"
  repeat: 'Every day' | 'Weekdays' | 'Once' | 'Weekly';
  description: string;
  completed: boolean;
  voiceReminder: boolean;
  synced: boolean;
  completedAt?: string;
}

export type GameType = 'candy-match' | 'memory-match' | 'object-recall' | 'pattern-garden' | 'daily-recall';

export interface GameSession {
  id: string;
  game: GameType;
  score: number;
  accuracy: number; // 0-100%
  duration: number; // in seconds
  difficulty: 'Easy' | 'Moderate' | 'Challenging';
  completedAt: string;
  synced: boolean;
  moves?: number;
  level?: number;
  details?: Record<string, any>;
}

export interface PatientProfile {
  id: string;
  name: string;
  gender: string;
  age: number;
  region: string;
  city: string;
  preferredLanguage: SupportedLanguage;
  textSize: TextSize;
  culturalPreference: CulturalTheme;
  voiceEnabled: boolean;
  voiceSpeed: number;
  offlineEnabled: boolean;
  highContrast: boolean;
  reducedMotion: boolean;
  emergencyContact: string;
  avatar: string;
}

export interface CaregiverContact {
  id: string;
  name: string;
  relationship: string;
  phone: string;
  avatar: string;
  connected: boolean;
  lastInteraction: string;
  role: 'Primary Caregiver' | 'Family Member' | 'Attending Nurse';
}

export interface CareAlert {
  id: string;
  type: 'warning' | 'info' | 'success';
  title: string;
  description: string;
  time: string;
  severity: 'gentle' | 'moderate';
  resolved: boolean;
  relatedCategory: 'medicine' | 'hydration' | 'appointment' | 'activity';
}

export type NetworkStatus = 'online' | 'offline' | 'syncing';

export interface CognitiveMetrics {
  weeklyActivityScore: number; // e.g. 82%
  accuracyGrowth: number; // e.g. +8%
  gamesCompletedThisWeek: number; // e.g. 18
  avgSessionDurationMin: number; // e.g. 12
  memoryScore: number; // e.g. 86%
  attentionScore: number; // e.g. 79%
  recallScore: number; // e.g. 81%
  patternScore: number; // e.g. 84%
  dailyActivityMinutes: { day: string; minutes: number; completed: boolean }[];
  adaptiveRecommendation: string;
}

export type AppView = 
  | 'home'
  | 'games'
  | 'candy-match'
  | 'memory-match'
  | 'object-recall'
  | 'pattern-garden'
  | 'daily-recall'
  | 'reminders'
  | 'add-reminder'
  | 'caregiver'
  | 'cognitive-report'
  | 'care-alerts'
  | 'family'
  | 'voice'
  | 'settings'
  | 'privacy'
  | 'language-culture';
