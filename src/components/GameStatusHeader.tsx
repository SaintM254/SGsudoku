import React from 'react';
import { Clock, AlertTriangle } from 'lucide-react';
import { Difficulty, GameMode, SudokuSize } from '../types';
import { ThemeConfig } from '../utils/theme';

interface GameStatusHeaderProps {
  timeSeconds: number;
  mistakes: number;
  size: SudokuSize;
  difficulty: Difficulty;
  gameMode: GameMode;
  dateStr?: string;
  darkMode: boolean;
  themeConfig: ThemeConfig;
}

function formatTime(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m}:${s < 10 ? '0' : ''}${s}`;
}

export const GameStatusHeader: React.FC<GameStatusHeaderProps> = ({
  timeSeconds,
  mistakes,
  size,
  difficulty,
  gameMode,
  dateStr,
  darkMode,
  themeConfig,
}) => {
  const activeStyle = darkMode ? themeConfig.dark : themeConfig.light;

  return (
    <div className="w-full max-w-md mx-auto px-3 py-1 flex items-center justify-between text-xs select-none">
      {/* Mode / Difficulty Badge */}
      <div className="flex items-center gap-2">
        <span
          className={`px-2.5 py-1 rounded-xl font-bold uppercase tracking-wider text-[10px] border ${activeStyle.surfaceVariant} ${activeStyle.outline}`}
        >
          {gameMode === 'daily' ? 'Daily Challenge' : `${size}x${size} • ${difficulty}`}
        </span>

        {gameMode === 'daily' && dateStr && (
          <span className="text-[11px] opacity-70">
            {dateStr}
          </span>
        )}
      </div>

      {/* Timer & Mistakes */}
      <div className="flex items-center gap-3">
        {/* Mistakes Counter */}
        <div
          className={`flex items-center gap-1 font-semibold ${
            mistakes > 0 ? 'text-[#D9531E]' : 'opacity-70'
          }`}
          title="Mistakes made"
        >
          <AlertTriangle className="w-3.5 h-3.5" />
          <span>Mistakes: {mistakes}</span>
        </div>

        {/* Timer */}
        <div className="flex items-center gap-1 font-mono font-bold">
          <Clock className="w-3.5 h-3.5 opacity-60" />
          <span>{formatTime(timeSeconds)}</span>
        </div>
      </div>
    </div>
  );
};
