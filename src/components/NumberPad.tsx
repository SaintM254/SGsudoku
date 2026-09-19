import React from 'react';
import { Check } from 'lucide-react';
import { BoardState, SudokuSize } from '../types';
import { ThemeConfig } from '../utils/theme';

interface NumberPadProps {
  size: SudokuSize;
  board: BoardState;
  onSelectNumber: (num: number) => void;
  darkMode: boolean;
  themeConfig: ThemeConfig;
}

export const NumberPad: React.FC<NumberPadProps> = ({
  size,
  board,
  onSelectNumber,
  darkMode,
  themeConfig,
}) => {
  const activeStyle = darkMode ? themeConfig.dark : themeConfig.light;

  // Calculate placement counts
  const counts: Record<number, number> = {};
  for (let i = 1; i <= size; i++) {
    counts[i] = 0;
  }

  for (const row of board) {
    for (const cell of row) {
      if (cell.value > 0) {
        counts[cell.value] = (counts[cell.value] || 0) + 1;
      }
    }
  }

  const numbers = Array.from({ length: size }, (_, i) => i + 1);

  return (
    <div className="w-full max-w-md mx-auto px-2 py-1.5 select-none">
      <div
        className="grid gap-1.5 sm:gap-2"
        style={{
          gridTemplateColumns: `repeat(${size}, minmax(0, 1fr))`,
        }}
      >
        {numbers.map((num) => {
          const placed = counts[num] || 0;
          const isFinished = placed >= size;

          return (
            <button
              key={num}
              id={`num-key-${num}`}
              type="button"
              onClick={() => onSelectNumber(num)}
              disabled={isFinished}
              className={`relative flex flex-col items-center justify-center py-2 sm:py-2.5 rounded-2xl transition active:scale-95 border ${
                isFinished
                  ? 'opacity-30 cursor-not-allowed border-transparent text-slate-400'
                  : `${activeStyle.surfaceCard} ${activeStyle.outline} hover:opacity-90`
              }`}
            >
              <span
                className={`font-bold leading-none ${
                  size === 6 ? 'text-2xl sm:text-3xl' : 'text-xl sm:text-2xl'
                }`}
              >
                {num}
              </span>
              <span className="mt-1 text-[10px] font-medium leading-none opacity-60">
                {isFinished ? (
                  <Check className="w-2.5 h-2.5 text-emerald-500 inline" />
                ) : (
                  `${size - placed}`
                )}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
};
