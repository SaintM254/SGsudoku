import React from 'react';
import { BoardState, SudokuSize } from '../types';
import { ThemeConfig } from '../utils/theme';
import { getBlockDimensions } from '../utils/sudokuGenerator';

interface SudokuGridProps {
  board: BoardState;
  size: SudokuSize;
  selectedRow: number | null;
  selectedCol: number | null;
  onSelectCell: (row: number, col: number) => void;
  darkMode: boolean;
  themeConfig: ThemeConfig;
  highlightedHintCell?: { row: number; col: number } | null;
}

export const SudokuGrid: React.FC<SudokuGridProps> = ({
  board,
  size,
  selectedRow,
  selectedCol,
  onSelectCell,
  darkMode,
  themeConfig,
  highlightedHintCell,
}) => {
  const activeStyle = darkMode ? themeConfig.dark : themeConfig.light;
  const { blockRows, blockCols } = getBlockDimensions(size);

  const selectedValue =
    selectedRow !== null && selectedCol !== null ? board[selectedRow][selectedCol].value : 0;

  return (
    <div className="w-full flex justify-center items-center select-none py-1">
      <div
        id="sudoku-board-card"
        className={`w-full max-w-md aspect-square p-2 sm:p-2.5 rounded-3xl transition-colors duration-150 border shadow-sm ${activeStyle.surfaceCard}`}
      >
        <div
          className="w-full h-full grid gap-1 sm:gap-1.5"
          style={{
            gridTemplateColumns: `repeat(${size}, minmax(0, 1fr))`,
            gridTemplateRows: `repeat(${size}, minmax(0, 1fr))`,
          }}
        >
          {board.map((rowCells, r) =>
            rowCells.map((cell, c) => {
              const isSelected = selectedRow === r && selectedCol === c;
              const isSameRow = selectedRow === r;
              const isSameCol = selectedCol === c;
              const isSameBlock =
                selectedRow !== null &&
                selectedCol !== null &&
                Math.floor(r / blockRows) === Math.floor(selectedRow / blockRows) &&
                Math.floor(c / blockCols) === Math.floor(selectedCol / blockCols);

              const isRelated = (isSameRow || isSameCol || isSameBlock) && !isSelected;
              const isSameNumber =
                selectedValue > 0 && cell.value === selectedValue && !isSelected;
              const isHinted =
                highlightedHintCell &&
                highlightedHintCell.row === r &&
                highlightedHintCell.col === c;

              // Border accents between 2x3 or 3x3 subgrids
              const isBlockBorderRight = (c + 1) % blockCols === 0 && c < size - 1;
              const isBlockBorderBottom = (r + 1) % blockRows === 0 && r < size - 1;

              // Cell dynamic styling
              let cellClass = activeStyle.cellBase;

              if (cell.error) {
                cellClass = activeStyle.cellError;
              } else if (isSelected) {
                cellClass = activeStyle.cellSelected;
              } else if (isHinted) {
                cellClass = 'bg-amber-300 dark:bg-amber-400 text-stone-950 font-bold ring-2 ring-amber-500';
              } else if (isSameNumber) {
                cellClass = activeStyle.cellSameNumber;
              } else if (isRelated) {
                cellClass = activeStyle.cellRelated;
              }

              return (
                <button
                  key={`${r}-${c}`}
                  id={`cell-${r}-${c}`}
                  onClick={() => onSelectCell(r, c)}
                  type="button"
                  aria-label={`Cell row ${r + 1}, column ${c + 1}, value ${cell.value || 'empty'}`}
                  className={`relative flex items-center justify-center rounded-xl transition-all duration-100 cursor-pointer ${cellClass} ${
                    isBlockBorderRight ? 'mr-0.5 sm:mr-1' : ''
                  } ${isBlockBorderBottom ? 'mb-0.5 sm:mb-1' : ''}`}
                >
                  {cell.value > 0 ? (
                    <span
                      className={`leading-none ${
                        size === 6
                          ? 'text-2xl sm:text-3xl font-extrabold'
                          : 'text-xl sm:text-2xl font-bold'
                      } ${
                        !isSelected && !cell.error
                          ? cell.initial
                            ? activeStyle.cellInitialText
                            : activeStyle.cellUserText
                          : ''
                      }`}
                    >
                      {cell.value}
                    </span>
                  ) : cell.notes && cell.notes.length > 0 ? (
                    /* Pencil notes grid */
                    <div
                      className="w-full h-full p-0.5 grid gap-px pointer-events-none"
                      style={{
                        gridTemplateColumns: `repeat(${size === 6 ? 3 : 3}, minmax(0, 1fr))`,
                        gridTemplateRows: `repeat(${size === 6 ? 2 : 3}, minmax(0, 1fr))`,
                      }}
                    >
                      {Array.from({ length: size }, (_, i) => i + 1).map((num) => (
                        <div
                          key={num}
                          className="flex items-center justify-center text-[9px] sm:text-[11px] font-medium leading-none opacity-60"
                        >
                          {cell.notes.includes(num) ? num : ''}
                        </div>
                      ))}
                    </div>
                  ) : null}
                </button>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};
