import React from 'react';
import { useApp } from '../../context/AppContext';
import { 
  Puzzle, 
  Search, 
  Grid, 
  Calendar, 
  Sparkles, 
  Play, 
  Volume2, 
  Award, 
  CheckCircle2, 
  ArrowRight,
  TrendingUp
} from 'lucide-react';
import { AppView } from '../../types';

export const GamesHubScreen: React.FC = () => {
  const { navigate, cognitiveMetrics, t, speak } = useApp();

  const games = [
    {
      id: 'candy-match' as AppView,
      title: 'Candy Match',
      category: 'Attention & Decision Making',
      icon: '🍓',
      desc: 'Swap, match 3 identical fruits in a row, and trigger cascading combos. 8x8 adaptive board.',
      metric: `${cognitiveMetrics.attentionScore}% Attention Score`,
      primaryBtn: 'Play now',
      tag: 'Match-3 Cognitive',
      color: 'border-rose-200 bg-rose-50/30 hover:border-rose-300',
    },
    {
      id: 'memory-match' as AppView,
      title: 'Memory Match',
      category: 'Visual & Associative Memory',
      icon: '🦏',
      desc: 'Find matching pairs of authentic North Eastern cultural symbols: Rhino, Hornbill, Living Root Bridge, and Muga Silk.',
      metric: `${cognitiveMetrics.memoryScore}% Memory Score`,
      primaryBtn: 'Play now',
      tag: 'NER Cultural Deck',
      color: 'border-emerald-200 bg-emerald-50/30 hover:border-emerald-300',
    },
    {
      id: 'object-recall' as AppView,
      title: 'Object Recall',
      category: 'Short-term Recall',
      icon: '🔍',
      desc: 'View familiar objects briefly, let them vanish, then gently recall what you saw from multi-choice visuals.',
      metric: `${cognitiveMetrics.recallScore}% Recall Score`,
      primaryBtn: 'Try demo',
      tag: 'Observation Training',
      color: 'border-teal-200 bg-teal-50/30 hover:border-teal-300',
    },
    {
      id: 'pattern-garden' as AppView,
      title: 'Pattern Garden',
      category: 'Pattern Recognition',
      icon: '🌿',
      desc: 'Complete gentle visual sequences featuring tea leaves, blossoms, bamboo crafts, and local flora.',
      metric: `${cognitiveMetrics.patternScore}% Pattern Score`,
      primaryBtn: 'Try demo',
      tag: 'Logical Sequence',
      color: 'border-lime-200 bg-lime-50/30 hover:border-lime-300',
    },
    {
      id: 'daily-recall' as AppView,
      title: 'Daily Routine Recall',
      category: 'Episodic Routine Memory',
      icon: '📅',
      desc: 'Practice recalling daily routines—morning tea, medicine schedule, family phone calls—with zero failure anxiety.',
      metric: 'Anchored Daily Habits',
      primaryBtn: 'Try demo',
      tag: 'Caregiver Guided',
      color: 'border-amber-200 bg-amber-50/30 hover:border-amber-300',
    },
  ];

  const handleReadOptions = () => {
    const text = `We have five gentle activities for you today. Candy Match for attention, Memory Match with North Eastern symbols, Object Recall, Pattern Garden, and Daily Routine Recall. Choose whichever makes you happiest!`;
    speak(text);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 pb-24 space-y-8" id="games-hub-screen">
      
      {/* Header & Read Options Aloud */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-emerald-100 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-700 uppercase tracking-wider bg-emerald-50 px-3 py-1 rounded-full mb-1">
            <Sparkles className="w-3.5 h-3.5" />
            <span>{t.cognitiveCentreTitle}</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-emerald-950">
            {t.chooseActivity}
          </h1>
          <p className="text-sm sm:text-base text-emerald-700 font-medium mt-1 max-w-2xl leading-relaxed">
            {t.cognitiveCentreDesc}
          </p>
        </div>

        <button
          onClick={handleReadOptions}
          className="inline-flex items-center gap-2 px-5 py-3 rounded-2xl bg-emerald-50 hover:bg-emerald-100 text-emerald-900 border border-emerald-200 font-bold text-sm shadow-2xs transition-all w-fit cursor-pointer shrink-0"
          id="read-options-aloud-btn"
          title="Read game choices aloud using audio voice"
        >
          <Volume2 className="w-5 h-5 text-emerald-700" />
          <span>{t.readOptions}</span>
        </button>
      </div>

      {/* Adaptive Intelligence Notice */}
      <div className="bg-emerald-50/80 border border-emerald-200 rounded-2xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs sm:text-sm text-emerald-900 font-medium">
        <div className="flex items-center gap-2.5">
          <TrendingUp className="w-5 h-5 text-emerald-700 shrink-0" />
          <span>
            <strong>Adaptive Intelligence Active:</strong> Game pace and visual cues automatically adjust to keep activities calm, enjoyable, and rewarding.
          </span>
        </div>
        <span className="bg-emerald-100 text-emerald-800 font-bold px-3 py-1 rounded-full text-xs shrink-0 self-start sm:self-auto">
          Weekly Progress: 82%
        </span>
      </div>

      {/* Games Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" id="games-list-grid">
        {games.map(game => (
          <div
            key={game.id}
            className={`rounded-3xl p-6 border-2 transition-all duration-200 flex flex-col justify-between shadow-xs hover:shadow-md ${game.color}`}
            id={`game-card-${game.id}`}
          >
            <div>
              <div className="flex items-center justify-between mb-4">
                <span className="text-4xl filter drop-shadow-xs">{game.icon}</span>
                <span className="text-[11px] font-bold uppercase tracking-wider bg-white/90 text-emerald-900 px-3 py-1 rounded-full border border-emerald-200">
                  {game.tag}
                </span>
              </div>

              <h3 className="text-xl font-bold text-emerald-950 mb-1">
                {game.title}
              </h3>
              <span className="text-xs font-bold text-emerald-700 block mb-2">
                {game.category}
              </span>
              <p className="text-xs sm:text-sm text-emerald-800/90 font-medium leading-relaxed mb-4">
                {game.desc}
              </p>
            </div>

            <div className="pt-4 border-t border-emerald-100/80 flex items-center justify-between gap-3">
              <span className="text-xs font-semibold text-emerald-700">
                {game.metric}
              </span>
              <button
                onClick={() => navigate(game.id)}
                className="px-5 py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs sm:text-sm rounded-xl shadow-xs transition-all flex items-center gap-1.5 cursor-pointer"
                id={`play-btn-${game.id}`}
              >
                <Play className="w-3.5 h-3.5 fill-white" />
                <span>{game.primaryBtn}</span>
              </button>
            </div>
          </div>
        ))}
      </div>

    </div>
  );
};
