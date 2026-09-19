import React from 'react';
import {
  Flame,
  Moon,
  Sun,
  BarChart2,
  RotateCcw,
  Calendar,
  Grid,
} from 'lucide-react';
import { Difficulty, GameMode, MaterialTheme, SudokuSize } from '../types';
import { MATERIAL_THEMES, ThemeConfig } from '../utils/theme';
import { PWAInstallButton } from './PWAInstallButton';

interface TopAppBarProps {
  darkMode: boolean;
  onToggleDarkMode: () => void;
  currentTheme: MaterialTheme;
  onSelectTheme: (theme: MaterialTheme) => void;
  themeConfig: ThemeConfig;
  streak: number;
  gameMode: GameMode;
  size: SudokuSize;
  difficulty: Difficulty;
  onOpenNewGame: () => void;
  onOpenStats: () => void;
  onOpenStreakDetails: () => void;
  onRestartCurrent: () => void;
}

export const TopAppBar: React.FC<TopAppBarProps> = ({
  darkMode,
  onToggleDarkMode,
  currentTheme,
  onSelectTheme,
  themeConfig,
  streak,
  gameMode,
  size,
  difficulty,
  onOpenNewGame,
  onOpenStats,
  onOpenStreakDetails,
  onRestartCurrent,
}) => {
  const activeStyle = darkMode ? themeConfig.dark : themeConfig.light;
  const themeKeys: MaterialTheme[] = ['blue', 'teal', 'sage', 'terracotta', 'slate'];

  return (
    <header className="w-full relative z-20 border-b border-black/5 dark:border-white/5">
      <div className="flex flex-col max-w-lg mx-auto px-3 py-2 gap-2">
        {/* Row 1: App Title, Mode Pill, Streak, Actions */}
        <div className="flex items-center justify-between">
          {/* Mode Selector Pill */}
          <div className="flex items-center gap-2">
            <button
              id="new-game-appbar-btn"
              type="button"
              onClick={onOpenNewGame}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-2xl font-bold text-xs tracking-tight transition active:scale-95 border ${activeStyle.surfaceVariant} ${activeStyle.outline}`}
              title="Choose Sudoku Mode or Difficulty"
            >
              {gameMode === 'daily' ? (
                <>
                  <Calendar className="w-4 h-4 text-[#1A73E8] dark:text-[#8AB4F8] shrink-0" />
                  <span>Daily Puzzle</span>
                </>
              ) : (
                <>
                  <Grid className="w-4 h-4 shrink-0" />
                  <span>
                    {size}x{size} • {difficulty.charAt(0).toUpperCase() + difficulty.slice(1)}
                  </span>
                </>
              )}
            </button>
          </div>

          {/* Right Action Icons */}
          <div className="flex items-center gap-1.5">
            {/* Streak Counter Pill */}
            <button
              id="streak-appbar-btn"
              type="button"
              onClick={onOpenStreakDetails}
              className={`flex items-center gap-1 px-2.5 py-1.5 rounded-2xl text-xs font-bold transition active:scale-95 border ${
                streak > 0
                  ? 'bg-[#FBE9E2] text-[#8C2C07] border-[#E0D5CE] dark:bg-[#302722] dark:text-[#FFCCBC] dark:border-[#4A3C35]'
                  : `${activeStyle.surfaceVariant} ${activeStyle.outline} opacity-70`
              }`}
              title="View Daily Streak Details"
            >
              <Flame className="w-3.5 h-3.5 text-[#D9531E]" />
              <span>{streak}d</span>
            </button>

            {/* PWA / APK Install */}
            <PWAInstallButton />

            {/* Stats */}
            <button
              id="stats-appbar-btn"
              type="button"
              onClick={onOpenStats}
              className={`w-9 h-9 flex items-center justify-center rounded-2xl border transition active:scale-95 ${activeStyle.surfaceVariant} ${activeStyle.outline}`}
              title="Statistics"
            >
              <BarChart2 className="w-4 h-4" />
            </button>

            {/* Reset */}
            <button
              id="restart-board-btn"
              type="button"
              onClick={onRestartCurrent}
              className={`w-9 h-9 flex items-center justify-center rounded-2xl border transition active:scale-95 ${activeStyle.surfaceVariant} ${activeStyle.outline}`}
              title="Restart Puzzle"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Row 2: Material You Color Swatches & Dark Theme Swatch */}
        <div className="flex items-center justify-between pt-1 pb-0.5">
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-semibold uppercase tracking-wider opacity-60">
              Palette
            </span>
            <div className="flex items-center gap-1.5">
              {themeKeys.map((thm) => {
                const cfg = MATERIAL_THEMES[thm];
                const isSelected = currentTheme === thm;
                return (
                  <button
                    key={thm}
                    id={`swatch-color-${thm}`}
                    type="button"
                    onClick={() => onSelectTheme(thm)}
                    title={cfg.name}
                    aria-label={`Select ${cfg.name} theme`}
                    className={`w-6 h-6 rounded-full transition-transform active:scale-90 flex items-center justify-center ${
                      isSelected
                        ? 'ring-2 ring-offset-2 ring-black/40 dark:ring-white/60 scale-110'
                        : 'opacity-80 hover:opacity-100 hover:scale-105'
                    }`}
                    style={{ backgroundColor: cfg.colorSwatch }}
                  />
                );
              })}
            </div>
          </div>

          {/* Dedicated Dark Mode Swatch Button */}
          <button
            id="dark-theme-swatch-btn"
            type="button"
            onClick={onToggleDarkMode}
            title={darkMode ? 'Switch to Light Theme' : 'Enable Dark Theme'}
            aria-label={darkMode ? 'Switch to Light Theme' : 'Enable Dark Theme'}
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border transition active:scale-95 ${
              darkMode
                ? 'bg-[#1E2024] text-slate-100 border-[#30333A]'
                : 'bg-white text-slate-800 border-[#DADCE0] shadow-xs'
            }`}
          >
            <span
              className={`w-3.5 h-3.5 rounded-full flex items-center justify-center ${
                darkMode ? 'bg-[#8AB4F8] text-[#121316]' : 'bg-[#202124] text-white'
              }`}
            >
              {darkMode ? <Sun className="w-2.5 h-2.5 text-black" /> : <Moon className="w-2.5 h-2.5 text-white" />}
            </span>
            <span className="text-[11px]">{darkMode ? 'Dark' : 'Light'}</span>
          </button>
        </div>
      </div>
    </header>
  );
};
