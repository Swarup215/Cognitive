import React from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Header } from './components/Header';
import { BottomNavigation } from './components/BottomNavigation';
import { JudgeDemoBanner } from './components/JudgeDemoBanner';
import { VoiceAssistantModal } from './components/VoiceAssistantModal';

// Screens
import { HomeScreen } from './components/screens/HomeScreen';
import { GamesHubScreen } from './components/screens/GamesHubScreen';
import { RemindersScreen } from './components/screens/RemindersScreen';
import { AddReminderScreen } from './components/screens/AddReminderScreen';
import { CaregiverDashboardScreen } from './components/screens/CaregiverDashboardScreen';
import { CognitiveReportScreen } from './components/screens/CognitiveReportScreen';
import { CareAlertsScreen } from './components/screens/CareAlertsScreen';
import { FamilyScreen } from './components/screens/FamilyScreen';
import { LanguageCultureScreen } from './components/screens/LanguageCultureScreen';
import { SettingsScreen } from './components/screens/SettingsScreen';
import { PrivacySecurityScreen } from './components/screens/PrivacySecurityScreen';

// Games
import { CandyMatchGame } from './components/games/CandyMatchGame';
import { MemoryMatchGame } from './components/games/MemoryMatchGame';
import { ObjectRecallGame } from './components/games/ObjectRecallGame';
import { PatternGardenGame } from './components/games/PatternGardenGame';
import { DailyRecallGame } from './components/games/DailyRecallGame';

const AppContent: React.FC = () => {
  const { currentView, patient } = useApp();

  // Dynamic text size class
  const textSizeClass = 
    patient.textSize === 'large' 
      ? 'text-lg' 
      : patient.textSize === 'small' 
      ? 'text-sm' 
      : 'text-base';

  const renderCurrentView = () => {
    switch (currentView) {
      case 'home':
        return <HomeScreen />;
      case 'games':
        return <GamesHubScreen />;
      case 'candy-match':
        return <CandyMatchGame />;
      case 'memory-match':
        return <MemoryMatchGame />;
      case 'object-recall':
        return <ObjectRecallGame />;
      case 'pattern-garden':
        return <PatternGardenGame />;
      case 'daily-recall':
        return <DailyRecallGame />;
      case 'reminders':
        return <RemindersScreen />;
      case 'add-reminder':
        return <AddReminderScreen />;
      case 'caregiver':
        return <CaregiverDashboardScreen />;
      case 'cognitive-report':
        return <CognitiveReportScreen />;
      case 'care-alerts':
        return <CareAlertsScreen />;
      case 'family':
        return <FamilyScreen />;
      case 'language-culture':
        return <LanguageCultureScreen />;
      case 'settings':
        return <SettingsScreen />;
      case 'privacy':
        return <PrivacySecurityScreen />;
      case 'voice':
        return <HomeScreen />;
      default:
        return <HomeScreen />;
    }
  };

  return (
    <div className={`min-h-screen bg-emerald-50/40 text-emerald-950 flex flex-col font-sans selection:bg-emerald-200 selection:text-emerald-950 ${textSizeClass}`}>
      {/* SIH Judge / Evaluation Tour Interactive Banner */}
      <JudgeDemoBanner />

      {/* Main Accessible Header */}
      <Header />

      {/* Main Dynamic View Content */}
      <main className="flex-1 w-full animate-in fade-in duration-150">
        {renderCurrentView()}
      </main>

      {/* Accessible Fixed Bottom Navigation */}
      <BottomNavigation />

      {/* Multilingual Voice Assistant Modal */}
      <VoiceAssistantModal />
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}
