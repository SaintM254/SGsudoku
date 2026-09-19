import React, { useEffect } from 'react';
import confetti from 'canvas-confetti';
import { Trophy, Flame, Clock, Lightbulb, Share2, Play, Check } from 'lucide-react';
import { Difficulty, GameMode, SudokuSize } from '../types';
import { ThemeConfig } from '../utils/theme';

interface VictoryModalProps {
  isOpen: boolean;
  onPlayAgain: () => void;
  timeSeconds: number;
  hintsUsed: number;
  size: SudokuSize;
  difficulty: Difficulty;
  gameMode: GameMode;
  streak: number;
  isNewStreak: boolean;
  darkMode: boolean;
  themeConfig: ThemeConfig;
}

function formatTime(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m}:${s < 10 ? '0' : ''}${s}`;
}

export const VictoryModal: React.FC<VictoryModalProps> = ({
  isOpen,
  onPlayAgain,
  timeSeconds,
  hintsUsed,
  size,
  difficulty,
  gameMode,
  streak,
  isNewStreak,
  darkMode,
  themeConfig,
}) => {
  const [copied, setCopied] = React.useState(false);

  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        onPlayAgain();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onPlayAgain]);

  useEffect(() => {
    if (isOpen) {
      if (typeof navigator !== 'undefined' && navigator.vibrate) {
        navigator.vibrate([40, 60, 40]);
      }

      confetti({
        particleCount: 50,
        spread: 55,
        origin: { y: 0.65 },
        colors: [themeConfig.colorSwatch, '#2E7D32', '#F57C00'],
      });
    }
  }, [isOpen, themeConfig.colorSwatch]);

  if (!isOpen) return null;
  const activeStyle = darkMode ? themeConfig.dark : themeConfig.light;

  const handleShare = () => {
    const text = `Solved ${
      gameMode === 'daily'
        ? `Daily Sudoku`
        : `${size}x${size} Sudoku (${difficulty})`
    } in ${formatTime(timeSeconds)}. ${streak > 0 ? `Streak: ${streak} days.` : ''}`;

    if (navigator.clipboard) {
      navigator.clipboard.writeText(text).then(() => {
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      });
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 animate-in fade-in duration-150">
      <div
        id="victory-modal-card"
        className={`w-full max-w-sm rounded-3xl p-6 shadow-xl border text-center transition-all duration-150 ${activeStyle.surfaceCard} ${activeStyle.onSurface}`}
      >
        <div className={`mx-auto w-12 h-12 rounded-2xl flex items-center justify-center ${activeStyle.primaryContainer}`}>
          <Trophy className="w-6 h-6 text-amber-500" />
        </div>

        <h2 className="mt-3 text-xl font-bold tracking-tight">Puzzle Solved</h2>
        <p className="text-xs opacity-75 mt-0.5">
          {gameMode === 'daily' ? 'Daily Challenge Complete' : `${size}x${size} Sudoku • ${difficulty}`}
        </p>

        {/* Streak Notice */}
        {gameMode === 'daily' && (
          <div className={`mt-4 p-3 rounded-2xl border flex items-center justify-center gap-2 ${activeStyle.surfaceVariant} ${activeStyle.outline}`}>
            <Flame className="w-4 h-4 text-[#D9531E]" />
            <span className="text-xs font-bold">
              {isNewStreak ? `Streak increased to ${streak} days` : `Daily Streak: ${streak} days`}
            </span>
          </div>
        )}

        {/* Game Stats */}
        <div className="mt-4 grid grid-cols-2 gap-2">
          <div className={`p-3 rounded-2xl border ${activeStyle.surfaceVariant} ${activeStyle.outline}`}>
            <div className="flex items-center justify-center gap-1 opacity-70 text-xs">
              <Clock className="w-3.5 h-3.5" />
              <span>Time</span>
            </div>
            <p className="mt-0.5 text-base font-mono font-bold">
              {formatTime(timeSeconds)}
            </p>
          </div>

          <div className={`p-3 rounded-2xl border ${activeStyle.surfaceVariant} ${activeStyle.outline}`}>
            <div className="flex items-center justify-center gap-1 opacity-70 text-xs">
              <Lightbulb className="w-3.5 h-3.5" />
              <span>Hints</span>
            </div>
            <p className="mt-0.5 text-base font-bold">
              {hintsUsed}
            </p>
          </div>
        </div>

        {/* Buttons */}
        <div className="mt-6 flex flex-col gap-2">
          <button
            id="victory-play-again-btn"
            type="button"
            onClick={onPlayAgain}
            className={`w-full py-3 rounded-2xl font-bold text-xs shadow-xs transition flex items-center justify-center gap-2 ${activeStyle.primary}`}
          >
            <Play className="w-4 h-4" />
            Play Another Puzzle
          </button>

          <button
            id="victory-share-btn"
            type="button"
            onClick={handleShare}
            className={`w-full py-2.5 rounded-2xl border font-semibold text-xs transition flex items-center justify-center gap-2 ${activeStyle.surfaceVariant} ${activeStyle.outline}`}
          >
            {copied ? (
              <>
                <Check className="w-4 h-4 text-emerald-500" />
                <span>Copied to Clipboard</span>
              </>
            ) : (
              <>
                <Share2 className="w-4 h-4" />
                <span>Share Results</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
