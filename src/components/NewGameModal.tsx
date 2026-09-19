import React, { useEffect } from 'react';
import { Calendar, Grid3X3, Grid2X2, ShieldAlert, X, ChevronRight, Flame } from 'lucide-react';
import { Difficulty, GameMode, SudokuSize } from '../types';
import { ThemeConfig } from '../utils/theme';

interface NewGameModalProps {
  isOpen: boolean;
  onClose: () => void;
  onStartGame: (mode: GameMode, size: SudokuSize, difficulty: Difficulty) => void;
  currentSize: SudokuSize;
  currentDifficulty: Difficulty;
  currentMode: GameMode;
  darkMode: boolean;
  themeConfig: ThemeConfig;
  streak: number;
}

export const NewGameModal: React.FC<NewGameModalProps> = ({
  isOpen,
  onClose,
  onStartGame,
  darkMode,
  themeConfig,
  streak,
}) => {
  // Close on Escape key
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

  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div
      id="new-game-modal-backdrop"
      onClick={handleBackdropClick}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 animate-in fade-in duration-150"
    >
      <div
        id="new-game-modal-card"
        className={`w-full max-w-md rounded-3xl p-6 shadow-xl border transition-all duration-150 max-h-[90vh] overflow-y-auto ${
          activeStyle.surfaceCard
        } ${activeStyle.onSurface}`}
      >
        {/* Header */}
        <div className={`flex items-center justify-between pb-4 border-b ${activeStyle.outline}`}>
          <div>
            <h2 className="text-xl font-bold tracking-tight">Select Puzzle</h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Choose difficulty level or daily challenge
            </p>
          </div>
          <button
            id="close-new-game-modal-btn"
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

        {/* Daily Puzzle Card (Clean Material 3 Tonal Card, no gradients) */}
        <div className="mt-4">
          <button
            id="start-daily-puzzle-btn"
            type="button"
            onClick={() => {
              onStartGame('daily', 9, 'medium');
              onClose();
            }}
            className={`w-full text-left p-4 rounded-2xl border transition active:scale-[0.99] group ${activeStyle.primaryContainer} ${activeStyle.outline}`}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-white/80 dark:bg-black/20 text-[#1A73E8] dark:text-[#8AB4F8] shrink-0">
                  <Calendar className="w-5 h-5" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-sm font-bold">Daily Puzzle</h3>
                    {streak > 0 && (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-semibold bg-white/60 dark:bg-black/30">
                        <Flame className="w-3 h-3 text-[#D9531E]" />
                        Streak: {streak}d
                      </span>
                    )}
                  </div>
                  <p className="text-xs opacity-80 mt-0.5">
                    Seeded puzzle for today. Keeps your daily record active.
                  </p>
                </div>
              </div>
              <ChevronRight className="w-5 h-5 opacity-60 group-hover:opacity-100 transition" />
            </div>
          </button>
        </div>

        {/* 6x6 Sudoku for Younger Players & Beginners */}
        <div className="mt-6">
          <div className="flex items-center gap-2 mb-2 px-1">
            <Grid2X2 className="w-4 h-4 text-slate-500 dark:text-slate-400" />
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              6x6 Sudoku (Younger Players & Beginners)
            </h3>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mb-3 px-1">
            2x3 blocks using numbers 1 to 6. Shorter and simpler to solve.
          </p>

          <div className="grid grid-cols-2 gap-2.5">
            <button
              id="start-6x6-easy-btn"
              type="button"
              onClick={() => {
                onStartGame('practice', 6, 'easy');
                onClose();
              }}
              className={`p-3.5 rounded-2xl border text-left transition active:scale-95 ${activeStyle.surfaceVariant} ${activeStyle.outline}`}
            >
              <span className="block text-xs font-bold">6x6 Easy</span>
              <span className="text-[11px] opacity-75 mt-0.5 block">
                Abundant starter clues
              </span>
            </button>

            <button
              id="start-6x6-medium-btn"
              type="button"
              onClick={() => {
                onStartGame('practice', 6, 'medium');
                onClose();
              }}
              className={`p-3.5 rounded-2xl border text-left transition active:scale-95 ${activeStyle.surfaceVariant} ${activeStyle.outline}`}
            >
              <span className="block text-xs font-bold">6x6 Medium</span>
              <span className="text-[11px] opacity-75 mt-0.5 block">
                Moderate deductions
              </span>
            </button>
          </div>
        </div>

        {/* 9x9 Classic Sudoku */}
        <div className="mt-6">
          <div className="flex items-center gap-2 mb-2 px-1">
            <Grid3X3 className="w-4 h-4 text-slate-500 dark:text-slate-400" />
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              9x9 Classic Sudoku
            </h3>
          </div>

          <div className="grid grid-cols-2 gap-2.5">
            <button
              id="start-9x9-easy-btn"
              type="button"
              onClick={() => {
                onStartGame('practice', 9, 'easy');
                onClose();
              }}
              className={`p-3.5 rounded-2xl border text-left transition active:scale-95 ${activeStyle.surfaceVariant} ${activeStyle.outline}`}
            >
              <span className="block text-xs font-bold">Easy</span>
              <span className="text-[11px] opacity-75 mt-0.5 block">
                Standard beginner
              </span>
            </button>

            <button
              id="start-9x9-medium-btn"
              type="button"
              onClick={() => {
                onStartGame('practice', 9, 'medium');
                onClose();
              }}
              className={`p-3.5 rounded-2xl border text-left transition active:scale-95 ${activeStyle.surfaceVariant} ${activeStyle.outline}`}
            >
              <span className="block text-xs font-bold">Medium</span>
              <span className="text-[11px] opacity-75 mt-0.5 block">
                Balanced puzzle
              </span>
            </button>

            <button
              id="start-9x9-hard-btn"
              type="button"
              onClick={() => {
                onStartGame('practice', 9, 'hard');
                onClose();
              }}
              className={`p-3.5 rounded-2xl border text-left transition active:scale-95 ${activeStyle.surfaceVariant} ${activeStyle.outline}`}
            >
              <span className="block text-xs font-bold">Hard</span>
              <span className="text-[11px] opacity-75 mt-0.5 block">
                Advanced logic
              </span>
            </button>

            <button
              id="start-9x9-expert-btn"
              type="button"
              onClick={() => {
                onStartGame('practice', 9, 'expert');
                onClose();
              }}
              className={`p-3.5 rounded-2xl border text-left transition active:scale-95 ${activeStyle.surfaceVariant} ${activeStyle.outline}`}
            >
              <span className="block text-xs font-bold flex items-center gap-1">
                <ShieldAlert className="w-3.5 h-3.5 text-rose-500" />
                Expert
              </span>
              <span className="text-[11px] opacity-75 mt-0.5 block">
                Minimal clues
              </span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
