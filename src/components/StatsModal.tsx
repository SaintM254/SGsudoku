import React, { useEffect } from 'react';
import { Trophy, Flame, Award, X } from 'lucide-react';
import { GameStats } from '../types';
import { ThemeConfig } from '../utils/theme';

interface StatsModalProps {
  isOpen: boolean;
  onClose: () => void;
  stats: GameStats;
  darkMode: boolean;
  themeConfig: ThemeConfig;
}

function formatTime(seconds?: number): string {
  if (!seconds || seconds <= 0) return '--:--';
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m}:${s < 10 ? '0' : ''}${s}`;
}

export const StatsModal: React.FC<StatsModalProps> = ({
  isOpen,
  onClose,
  stats,
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

  const winRate =
    stats.totalGamesPlayed > 0
      ? Math.round((stats.totalGamesWon / stats.totalGamesPlayed) * 100)
      : 0;

  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div
      id="stats-modal-backdrop"
      onClick={handleBackdropClick}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 animate-in fade-in duration-150"
    >
      <div
        id="stats-modal-card"
        className={`w-full max-w-sm rounded-3xl p-6 shadow-xl border transition-all duration-150 ${activeStyle.surfaceCard} ${activeStyle.onSurface}`}
      >
        <div className={`flex items-center justify-between pb-3 border-b ${activeStyle.outline}`}>
          <div className="flex items-center gap-2.5">
            <div className={`w-10 h-10 rounded-2xl flex items-center justify-center ${activeStyle.primaryContainer}`}>
              <Trophy className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold">Statistics</h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">Your Sudoku journey</p>
            </div>
          </div>
          <button
            id="close-stats-modal-btn"
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

        {/* 4 Stats Grid */}
        <div className="mt-4 grid grid-cols-2 gap-2 text-center">
          <div className={`p-3 rounded-2xl border ${activeStyle.surfaceVariant} ${activeStyle.outline}`}>
            <span className="text-2xl font-bold">
              {stats.totalGamesPlayed}
            </span>
            <span className="block text-[11px] font-medium opacity-70 mt-0.5">
              Played
            </span>
          </div>

          <div className={`p-3 rounded-2xl border ${activeStyle.surfaceVariant} ${activeStyle.outline}`}>
            <span className="text-2xl font-bold">
              {winRate}%
            </span>
            <span className="block text-[11px] font-medium opacity-70 mt-0.5">
              Win Rate
            </span>
          </div>

          <div className={`p-3 rounded-2xl border ${activeStyle.surfaceVariant} ${activeStyle.outline}`}>
            <div className="flex items-center justify-center gap-1">
              <Flame className="w-4 h-4 text-[#D9531E]" />
              <span className="text-2xl font-bold">
                {stats.streak}
              </span>
            </div>
            <span className="block text-[11px] font-medium opacity-70 mt-0.5">
              Current Streak
            </span>
          </div>

          <div className={`p-3 rounded-2xl border ${activeStyle.surfaceVariant} ${activeStyle.outline}`}>
            <div className="flex items-center justify-center gap-1">
              <Award className="w-4 h-4 text-amber-500" />
              <span className="text-2xl font-bold">
                {stats.bestStreak}
              </span>
            </div>
            <span className="block text-[11px] font-medium opacity-70 mt-0.5">
              Best Streak
            </span>
          </div>
        </div>

        {/* Best Times Record */}
        <div className="mt-5">
          <h3 className="text-xs font-bold uppercase tracking-wider opacity-70 mb-2">
            Best Times
          </h3>
          <div className="space-y-1.5 text-xs">
            <div className={`flex justify-between py-2 px-3 rounded-xl ${activeStyle.surfaceVariant}`}>
              <span className="font-medium">6x6 Easy</span>
              <span className="font-mono font-bold">
                {formatTime(stats.bestTimes['6-easy'])}
              </span>
            </div>
            <div className={`flex justify-between py-2 px-3 rounded-xl ${activeStyle.surfaceVariant}`}>
              <span className="font-medium">6x6 Medium</span>
              <span className="font-mono font-bold">
                {formatTime(stats.bestTimes['6-medium'])}
              </span>
            </div>
            <div className={`flex justify-between py-2 px-3 rounded-xl ${activeStyle.surfaceVariant}`}>
              <span className="font-medium">9x9 Easy</span>
              <span className="font-mono font-bold">
                {formatTime(stats.bestTimes['9-easy'])}
              </span>
            </div>
            <div className={`flex justify-between py-2 px-3 rounded-xl ${activeStyle.surfaceVariant}`}>
              <span className="font-medium">9x9 Medium</span>
              <span className="font-mono font-bold">
                {formatTime(stats.bestTimes['9-medium'])}
              </span>
            </div>
            <div className={`flex justify-between py-2 px-3 rounded-xl ${activeStyle.surfaceVariant}`}>
              <span className="font-medium">9x9 Hard</span>
              <span className="font-mono font-bold">
                {formatTime(stats.bestTimes['9-hard'])}
              </span>
            </div>
          </div>
        </div>

        <button
          id="stats-close-bottom-btn"
          type="button"
          onClick={onClose}
          className={`mt-5 w-full py-2.5 rounded-2xl font-semibold text-xs transition border ${activeStyle.surfaceVariant} ${activeStyle.outline} hover:opacity-90`}
        >
          Close
        </button>
      </div>
    </div>
  );
};
