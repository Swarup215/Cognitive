import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  AppView, 
  PatientProfile, 
  Reminder, 
  GameSession, 
  CaregiverContact, 
  CareAlert, 
  CognitiveMetrics, 
  NetworkStatus,
  TextSize,
  SupportedLanguage,
  CulturalTheme
} from '../types';
import { translations, TranslationStrings } from '../data/translations';
import { 
  INITIAL_DEMO_PATIENT, 
  INITIAL_DEMO_REMINDERS, 
  INITIAL_CAREGIVER_CONTACTS, 
  INITIAL_CARE_ALERTS, 
  INITIAL_COGNITIVE_METRICS,
  RECENT_GAME_SESSIONS 
} from '../data/regionalData';
import { playReminderDoneSound, speakGentleText, stopSpeech } from '../utils/audioSynth';

interface AppContextType {
  currentView: AppView;
  navigate: (view: AppView) => void;
  userMode: 'sathi' | 'command';
  setUserMode: (mode: 'sathi' | 'command') => void;
  patient: PatientProfile;
  updatePatient: (updates: Partial<PatientProfile>) => void;
  reminders: Reminder[];
  toggleReminder: (id: string) => void;
  addReminder: (reminder: Omit<Reminder, 'id' | 'synced'>) => void;
  deleteReminder: (id: string) => void;
  gameSessions: GameSession[];
  recordGameSession: (session: Omit<GameSession, 'id' | 'completedAt' | 'synced'>) => void;
  caregivers: CaregiverContact[];
  careAlerts: CareAlert[];
  resolveAlert: (id: string) => void;
  cognitiveMetrics: CognitiveMetrics;
  networkStatus: NetworkStatus;
  setNetworkStatus: (status: NetworkStatus) => void;
  pendingSyncCount: number;
  triggerManualSync: () => void;
  lastSyncedTime: string;
  t: TranslationStrings;
  voiceModalOpen: boolean;
  setVoiceModalOpen: (open: boolean) => void;
  judgeDemoActive: boolean;
  judgeDemoStep: number;
  startJudgeDemo: () => void;
  nextJudgeDemoStep: () => void;
  prevJudgeDemoStep: () => void;
  closeJudgeDemo: () => void;
  speak: (text: string) => void;
  stopSpeech: () => void;
  resetAllData: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const STORAGE_KEYS = {
  PATIENT: 'mindmate_patient_v2',
  REMINDERS: 'mindmate_reminders_v2',
  SESSIONS: 'mindmate_sessions_v2',
  ALERTS: 'mindmate_alerts_v2',
  CAREGIVERS: 'mindmate_caregivers_v2',
};

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentView, setCurrentView] = useState<AppView>('home');
  const [userMode, setUserMode] = useState<'sathi' | 'command'>('sathi');

  // Load from local storage or fall back to initial NER data
  const [patient, setPatient] = useState<PatientProfile>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.PATIENT);
      return saved ? JSON.parse(saved) : INITIAL_DEMO_PATIENT;
    } catch {
      return INITIAL_DEMO_PATIENT;
    }
  });

  const [reminders, setReminders] = useState<Reminder[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.REMINDERS);
      return saved ? JSON.parse(saved) : INITIAL_DEMO_REMINDERS;
    } catch {
      return INITIAL_DEMO_REMINDERS;
    }
  });

  const [gameSessions, setGameSessions] = useState<GameSession[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.SESSIONS);
      return saved ? JSON.parse(saved) : RECENT_GAME_SESSIONS;
    } catch {
      return RECENT_GAME_SESSIONS;
    }
  });

  const [careAlerts, setCareAlerts] = useState<CareAlert[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.ALERTS);
      return saved ? JSON.parse(saved) : INITIAL_CARE_ALERTS;
    } catch {
      return INITIAL_CARE_ALERTS;
    }
  });

  const [caregivers] = useState<CaregiverContact[]>(INITIAL_CAREGIVER_CONTACTS);

  // Network offline/online simulation state
  const [networkStatus, setNetworkStatusState] = useState<NetworkStatus>('online');
  const [pendingSyncCount, setPendingSyncCount] = useState<number>(0);
  const [lastSyncedTime, setLastSyncedTime] = useState<string>('Just now');
  const [voiceModalOpen, setVoiceModalOpen] = useState<boolean>(false);

  // Judge Demo Tour state
  const [judgeDemoActive, setJudgeDemoActive] = useState<boolean>(false);
  const [judgeDemoStep, setJudgeDemoStep] = useState<number>(0);

  // Persistence effects
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.PATIENT, JSON.stringify(patient));
    } catch (e) {
      console.warn('Storage failed:', e);
    }
  }, [patient]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.REMINDERS, JSON.stringify(reminders));
    } catch (e) {
      console.warn('Storage failed:', e);
    }
  }, [reminders]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.SESSIONS, JSON.stringify(gameSessions));
    } catch (e) {
      console.warn('Storage failed:', e);
    }
  }, [gameSessions]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.ALERTS, JSON.stringify(careAlerts));
    } catch (e) {
      console.warn('Storage failed:', e);
    }
  }, [careAlerts]);

  // Dynamic Cognitive Metrics calculation derived from game sessions
  const cognitiveMetrics: CognitiveMetrics = React.useMemo(() => {
    if (gameSessions.length === 0) return INITIAL_COGNITIVE_METRICS;

    const memSessions = gameSessions.filter(s => s.game === 'memory-match');
    const patternSessions = gameSessions.filter(s => s.game === 'pattern-garden' || s.game === 'candy-match');
    const recallSessions = gameSessions.filter(s => s.game === 'object-recall' || s.game === 'daily-recall');

    const avgAccuracy = (list: GameSession[]) => {
      if (list.length === 0) return 0;
      const sum = list.reduce((acc, curr) => acc + curr.accuracy, 0);
      return Math.round(sum / list.length);
    };

    const memScore = avgAccuracy(memSessions);
    const patScore = avgAccuracy(patternSessions);
    const recScore = avgAccuracy(recallSessions);
    // Attention is derived from memory + pattern (only when at least one has data)
    const attScore = (memScore === 0 && patScore === 0)
      ? 0
      : Math.round((memScore * 0.4) + (patScore * 0.6));
    const activeScores = [memScore, patScore, recScore, attScore].filter(s => s > 0);
    const overallWeekly = activeScores.length > 0
      ? Math.round(activeScores.reduce((a, b) => a + b, 0) / activeScores.length)
      : 0;

    const avgDuration = gameSessions.length > 0
      ? Math.round(gameSessions.reduce((acc, s) => acc + (s.duration || 0), 0) / gameSessions.length / 60)
      : 0;

    let rec = 'Keep going! Each activity helps build cognitive engagement.';
    if (overallWeekly > 85) {
      rec = 'Excellent visual recognition and recall! Adapting with slightly richer patterns while keeping experience stress-free.';
    } else if (overallWeekly > 0 && overallWeekly < 60) {
      rec = 'Providing extra visual cues and generous time allowances to keep activities relaxing.';
    } else if (overallWeekly === 0) {
      rec = 'No activity recorded yet. Encourage Asha to try a game to begin tracking cognitive engagement.';
    }

    // Build daily activity minutes from sessions — update today's day column
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const todayIdx = new Date().getDay();
    const todayMinutes = Math.round(
      gameSessions
        .filter(s => s.completedAt === 'Just now' || s.completedAt?.startsWith('Today'))
        .reduce((acc, s) => acc + (s.duration || 0), 0) / 60
    );
    const dailyActivityMinutes = INITIAL_COGNITIVE_METRICS.dailyActivityMinutes.map((d, i) => {
      if (days[todayIdx] === d.day) {
        return { ...d, minutes: todayMinutes, completed: todayMinutes > 0 };
      }
      return d;
    });

    return {
      weeklyActivityScore: overallWeekly,
      accuracyGrowth: 0,
      gamesCompletedThisWeek: gameSessions.length,
      avgSessionDurationMin: avgDuration,
      memoryScore: memScore,
      attentionScore: attScore,
      recallScore: recScore,
      patternScore: patScore,
      dailyActivityMinutes,
      adaptiveRecommendation: rec,
    };
  }, [gameSessions]);

  const t: TranslationStrings = translations[patient.preferredLanguage] || translations.en;

  const navigate = (view: AppView) => {
    stopSpeech();
    setCurrentView(view);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const updatePatient = (updates: Partial<PatientProfile>) => {
    setPatient(prev => ({ ...prev, ...updates }));
  };

  const toggleReminder = (id: string) => {
    playReminderDoneSound();
    setReminders(prev =>
      prev.map(rem => {
        if (rem.id === id) {
          const nextState = !rem.completed;
          const isOffline = networkStatus === 'offline';
          if (isOffline) {
            setPendingSyncCount(c => c + 1);
          }
          return {
            ...rem,
            completed: nextState,
            completedAt: nextState ? new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : undefined,
            synced: !isOffline,
          };
        }
        return rem;
      })
    );
  };

  const addReminder = (newRem: Omit<Reminder, 'id' | 'synced'>) => {
    const isOffline = networkStatus === 'offline';
    const created: Reminder = {
      ...newRem,
      id: 'rem_' + Date.now(),
      synced: !isOffline,
    };
    if (isOffline) {
      setPendingSyncCount(c => c + 1);
    }
    setReminders(prev => [created, ...prev]);
    navigate('reminders');
  };

  const deleteReminder = (id: string) => {
    setReminders(prev => prev.filter(r => r.id !== id));
  };

  const recordGameSession = (sessionData: Omit<GameSession, 'id' | 'completedAt' | 'synced'>) => {
    const isOffline = networkStatus === 'offline';
    const newSession: GameSession = {
      ...sessionData,
      id: 'sess_' + Date.now(),
      completedAt: 'Just now',
      synced: !isOffline,
    };
    if (isOffline) {
      setPendingSyncCount(c => c + 1);
    }
    setGameSessions(prev => [newSession, ...prev]);
  };

  const resolveAlert = (id: string) => {
    setCareAlerts(prev =>
      prev.map(a => (a.id === id ? { ...a, resolved: true } : a))
    );
  };

  const setNetworkStatus = (status: NetworkStatus) => {
    setNetworkStatusState(status);
    if (status === 'online' && pendingSyncCount > 0) {
      triggerManualSync();
    }
  };

  const triggerManualSync = () => {
    setNetworkStatusState('syncing');
    setTimeout(() => {
      setReminders(prev => prev.map(r => ({ ...r, synced: true })));
      setGameSessions(prev => prev.map(s => ({ ...s, synced: true })));
      setPendingSyncCount(0);
      setNetworkStatusState('online');
      setLastSyncedTime(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
    }, 1200);
  };

  const speak = (text: string) => {
    if (patient.voiceEnabled) {
      speakGentleText(text, patient.voiceLanguage || patient.preferredLanguage, patient.voiceSpeed);
    }
  };

  const resetAllData = () => {
    localStorage.clear();
    setPatient(INITIAL_DEMO_PATIENT);
    setReminders(INITIAL_DEMO_REMINDERS);
    setGameSessions(RECENT_GAME_SESSIONS);
    setCareAlerts(INITIAL_CARE_ALERTS);
    setPendingSyncCount(0);
    setNetworkStatusState('online');
    navigate('home');
  };

  // Demo Tour management
  const startJudgeDemo = () => {
    setJudgeDemoActive(true);
    setJudgeDemoStep(1);
    navigate('home');
  };

  const nextJudgeDemoStep = () => {
    const next = judgeDemoStep + 1;
    if (next > 12) {
      setJudgeDemoActive(false);
      setJudgeDemoStep(0);
      navigate('home');
      return;
    }
    setJudgeDemoStep(next);
    switch (next) {
      case 1: navigate('home'); break;
      case 2: navigate('games'); break;
      case 3: navigate('candy-match'); break;
      case 4: navigate('memory-match'); break;
      case 5: navigate('pattern-garden'); break;
      case 6: navigate('daily-recall'); break;
      case 7: navigate('reminders'); break;
      case 8: navigate('caregiver'); break;
      case 9: navigate('cognitive-report'); break;
      case 10: navigate('language-culture'); break;
      case 11: 
        setNetworkStatusState('offline');
        navigate('home'); 
        break;
      case 12: 
        triggerManualSync();
        navigate('caregiver'); 
        break;
      default: navigate('home'); break;
    }
  };

  const prevJudgeDemoStep = () => {
    const prev = judgeDemoStep - 1;
    if (prev < 1) return;
    setJudgeDemoStep(prev);
    switch (prev) {
      case 1: navigate('home'); break;
      case 2: navigate('games'); break;
      case 3: navigate('candy-match'); break;
      case 4: navigate('memory-match'); break;
      case 5: navigate('pattern-garden'); break;
      case 6: navigate('daily-recall'); break;
      case 7: navigate('reminders'); break;
      case 8: navigate('caregiver'); break;
      case 9: navigate('cognitive-report'); break;
      case 10: navigate('language-culture'); break;
      case 11: 
        setNetworkStatusState('offline');
        navigate('home'); 
        break;
      case 12: 
        triggerManualSync();
        navigate('caregiver'); 
        break;
      default: navigate('home'); break;
    }
  };

  const closeJudgeDemo = () => {
    setJudgeDemoActive(false);
    setJudgeDemoStep(0);
  };

  return (
    <AppContext.Provider
      value={{
        currentView,
        navigate,
        userMode,
        setUserMode,
        patient,
        updatePatient,
        reminders,
        toggleReminder,
        addReminder,
        deleteReminder,
        gameSessions,
        recordGameSession,
        caregivers,
        careAlerts,
        resolveAlert,
        cognitiveMetrics,
        networkStatus,
        setNetworkStatus,
        pendingSyncCount,
        triggerManualSync,
        lastSyncedTime,
        t,
        voiceModalOpen,
        setVoiceModalOpen,
        judgeDemoActive,
        judgeDemoStep,
        startJudgeDemo,
        nextJudgeDemoStep,
        prevJudgeDemoStep,
        closeJudgeDemo,
        speak,
        stopSpeech,
        resetAllData,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used within AppProvider');
  return ctx;
};
