import React, { useEffect } from 'react';
import { Flame, Trophy, Calendar, CheckCircle2, X } from 'lucide-react';
import { GameStats } from '../types';
import { ThemeConfig } from '../utils/theme';

interface StreakDetailsModalProps {
  isOpen: boolean;
  stats: GameStats;
  onClose: () => void;
  onPlayDaily: () => void;
  darkMode: boolean;
  themeConfig: ThemeConfig;
}

export const StreakDetailsModal: React.FC<StreakDetailsModalProps> = ({
  isOpen,
  stats,
  onClose,
  onPlayDaily,
  darkMode,
  themeConfig,
}) => {
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const activeStyle = darkMode ? themeConfig.dark : themeConfig.light;
  const todayStr = new Date().toISOString().split('T')[0];
  const isDailyCompletedToday = stats.lastDailyCompletedDate === todayStr;

  // Generate last 7 days status
  const last7Days = Array.from({ length: 7 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (6 - i));
    const dStr = d.toISOString().split('T')[0];
    const dayLabel = d.toLocaleDateString('en-US', { weekday: 'narrow' });
    const isToday = dStr === todayStr;
    const isDone = stats.lastDailyCompletedDate === dStr;
    return { dateStr: dStr, dayLabel, isToday, isDone };
  });

  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div
      id="streak-details-backdrop"
      onClick={handleBackdropClick}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 animate-in fade-in duration-150"
    >
      <div
        id="streak-details-card"
        className={`w-full max-w-sm rounded-3xl p-6 shadow-xl border transition-all duration-150 ${activeStyle.surfaceCard} ${activeStyle.onSurface}`}
      >
        <div className={`flex items-center justify-between pb-3 border-b ${activeStyle.outline}`}>
          <div className="flex items-center gap-2.5">
            <div className={`w-10 h-10 rounded-2xl flex items-center justify-center ${activeStyle.primaryContainer}`}>
              <Flame className="w-5 h-5 text-[#D9531E]" />
            </div>
            <div>
              <h2 className="text-lg font-bold leading-tight">Daily Streak</h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Solve a puzzle daily to build momentum
              </p>
            </div>
          </div>
          <button
            id="close-streak-modal-btn"
            type="button"
            aria-label="Close dialog"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              onClose();
            }}
            onTouchEnd={(e) => {
              e.preventDefault();
              e.stopPropagation();
              onClose();
            }}
            className="w-11 h-11 flex items-center justify-center rounded-full hover:bg-black/5 dark:hover:bg-white/10 active:scale-95 transition text-slate-500 dark:text-slate-300"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Big Streak Hero (Solid Material 3 container) */}
        <div className={`mt-5 text-center p-4 rounded-2xl border ${activeStyle.surfaceVariant} ${activeStyle.outline}`}>
          <div className="inline-flex items-center gap-2">
            <span className="text-4xl font-black tracking-tight text-[#D9531E]">
              {stats.streak}
            </span>
            <span className="text-xs font-bold uppercase tracking-wider opacity-75">
              {stats.streak === 1 ? 'Day' : 'Days'}
            </span>
          </div>
          <p className="mt-1 text-xs opacity-80 font-medium">
            {stats.streak > 0
              ? 'Great consistency. Keep solving daily to extend your streak.'
              : 'Complete today’s daily puzzle to start your streak.'}
          </p>
        </div>

        {/* 7-Day Visual Strip */}
        <div className="mt-4">
          <p className="text-xs font-semibold opacity-70 mb-2">
            Recent Days
          </p>
          <div className="grid grid-cols-7 gap-1.5">
            {last7Days.map((day) => (
              <div
                key={day.dateStr}
                className={`flex flex-col items-center py-2 rounded-xl border text-center ${
                  day.isToday
                    ? isDailyCompletedToday
                      ? 'bg-emerald-100 dark:bg-emerald-950/60 border-emerald-400 text-emerald-900 dark:text-emerald-200'
                      : activeStyle.primaryContainer
                    : activeStyle.surfaceVariant
                } ${activeStyle.outline}`}
              >
                <span className="text-[10px] font-bold uppercase">{day.dayLabel}</span>
                <div className="mt-1">
                  {day.isToday && isDailyCompletedToday ? (
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                  ) : (
                    <div
                      className={`w-2 h-2 rounded-full ${
                        day.isToday ? 'bg-[#1A73E8] dark:bg-[#8AB4F8]' : 'bg-slate-300 dark:bg-slate-600'
                      }`}
                    />
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Best Streak & Stats Snapshot */}
        <div className="mt-4 grid grid-cols-2 gap-2 text-center">
          <div className={`p-3 rounded-2xl border ${activeStyle.surfaceVariant} ${activeStyle.outline}`}>
            <div className="flex items-center justify-center gap-1 opacity-70 text-xs font-medium">
              <Trophy className="w-3.5 h-3.5 text-amber-500" />
              <span>Best Streak</span>
            </div>
            <p className="mt-0.5 text-lg font-bold">
              {stats.bestStreak} Days
            </p>
          </div>

          <div className={`p-3 rounded-2xl border ${activeStyle.surfaceVariant} ${activeStyle.outline}`}>
            <div className="flex items-center justify-center gap-1 opacity-70 text-xs font-medium">
              <Calendar className="w-3.5 h-3.5" />
              <span>Puzzles Won</span>
            </div>
            <p className="mt-0.5 text-lg font-bold">
              {stats.totalGamesWon}
            </p>
          </div>
        </div>

        {/* Action Button */}
        <div className="mt-5">
          {!isDailyCompletedToday ? (
            <button
              id="streak-play-daily-btn"
              type="button"
              onClick={() => {
                onPlayDaily();
                onClose();
              }}
              className={`w-full py-3 rounded-2xl font-bold text-sm shadow-xs transition flex items-center justify-center gap-2 ${activeStyle.primary}`}
            >
              <Calendar className="w-4 h-4" />
              Play Today’s Daily
            </button>
          ) : (
            <div className="p-3 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-300 text-center text-xs font-semibold flex items-center justify-center gap-1.5 border border-emerald-200 dark:border-emerald-800">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
              Today’s Daily is complete.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
