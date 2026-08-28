import React from 'react';
import { useApp } from '../context/AppContext';
import { Home, Gamepad2, Bell, Users, Settings } from 'lucide-react';
import { AppView } from '../types';

export const BottomNavigation: React.FC = () => {
  const { currentView, navigate, reminders } = useApp();

  const activeRemindersCount = reminders.filter(r => !r.completed).length;

  const isTabActive = (tab: string) => {
    if (tab === 'home' && currentView === 'home') return true;
    if (tab === 'games' && ['games', 'candy-match', 'memory-match', 'object-recall', 'pattern-garden', 'daily-recall'].includes(currentView)) return true;
    if (tab === 'reminders' && ['reminders', 'add-reminder'].includes(currentView)) return true;
    if (tab === 'caregiver' && ['caregiver', 'cognitive-report', 'care-alerts', 'family'].includes(currentView)) return true;
    if (tab === 'settings' && ['settings', 'language-culture', 'privacy'].includes(currentView)) return true;
    return false;
  };

  const navItems = [
    {
      id: 'nav-home',
      view: 'home' as AppView,
      tabKey: 'home',
      label: 'Home',
      icon: Home,
    },
    {
      id: 'nav-games',
      view: 'games' as AppView,
      tabKey: 'games',
      label: 'Games',
      icon: Gamepad2,
    },
    {
      id: 'nav-reminders',
      view: 'reminders' as AppView,
      tabKey: 'reminders',
      label: 'Reminders',
      icon: Bell,
      badge: activeRemindersCount > 0 ? activeRemindersCount : undefined,
    },
    {
      id: 'nav-caregiver',
      view: 'caregiver' as AppView,
      tabKey: 'caregiver',
      label: 'Caregiver',
      icon: Users,
    },
    {
      id: 'nav-settings',
      view: 'settings' as AppView,
      tabKey: 'settings',
      label: 'Settings',
      icon: Settings,
    },
  ];

  return (
    <nav 
      className="fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-emerald-100 px-3 py-2 sm:py-3 shadow-lg"
      id="global-bottom-nav"
      aria-label="Main Navigation"
    >
      <div className="max-w-4xl mx-auto flex items-center justify-around gap-1 sm:gap-2">
        {navItems.map(item => {
          const active = isTabActive(item.tabKey);
          const Icon = item.icon;
          return (
            <button
              key={item.id}
              id={item.id}
              onClick={() => navigate(item.view)}
              className={`flex-1 min-h-[56px] py-1.5 px-2 rounded-2xl flex flex-col items-center justify-center transition-all duration-200 relative ${
                active
                  ? 'bg-emerald-100/90 text-emerald-950 font-bold scale-102 shadow-xs'
                  : 'text-emerald-800/80 hover:bg-emerald-50/80 hover:text-emerald-950 font-medium'
              }`}
              aria-current={active ? 'page' : undefined}
            >
              <div className="relative">
                <Icon className={`w-6 h-6 transition-transform ${active ? 'stroke-[2.5px] scale-110 text-emerald-800' : 'stroke-[1.75px]'}`} />
                {item.badge !== undefined && (
                  <span className="absolute -top-1 -right-2.5 bg-amber-500 text-white text-[10px] font-bold px-1.5 py-0.2 rounded-full ring-2 ring-white">
                    {item.badge}
                  </span>
                )}
              </div>
              <span className={`text-xs mt-1 transition-all ${active ? 'font-bold text-emerald-950' : 'text-emerald-700'}`}>
                {item.label}
              </span>
              {active && (
                <div className="w-1.5 h-1.5 rounded-full bg-emerald-700 mt-0.5"></div>
              )}
            </button>
          );
        })}
      </div>
    </nav>
  );
};
