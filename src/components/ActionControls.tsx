import React from 'react';
import { Undo2, Eraser, Edit3, Lightbulb, CheckCircle2 } from 'lucide-react';
import { ThemeConfig } from '../utils/theme';

interface ActionControlsProps {
  onUndo: () => void;
  canUndo: boolean;
  onErase: () => void;
  notesMode: boolean;
  onToggleNotesMode: () => void;
  onGetHint: () => void;
  onValidateBoard: () => void;
  hintsRemaining: number;
  darkMode: boolean;
  themeConfig: ThemeConfig;
}

export const ActionControls: React.FC<ActionControlsProps> = ({
  onUndo,
  canUndo,
  onErase,
  notesMode,
  onToggleNotesMode,
  onGetHint,
  onValidateBoard,
  hintsRemaining,
  darkMode,
  themeConfig,
}) => {
  const activeStyle = darkMode ? themeConfig.dark : themeConfig.light;

  return (
    <div className="w-full max-w-md mx-auto grid grid-cols-5 gap-1.5 px-2 py-1 select-none">
      {/* Undo Button */}
      <button
        id="action-undo-btn"
        type="button"
        onClick={onUndo}
        disabled={!canUndo}
        className={`flex flex-col items-center justify-center py-2.5 px-1 rounded-2xl transition active:scale-95 border ${
          canUndo
            ? `${activeStyle.surfaceCard} ${activeStyle.outline} hover:opacity-90`
            : 'opacity-40 cursor-not-allowed border-transparent text-slate-400'
        }`}
        title="Undo last action"
      >
        <Undo2 className="w-5 h-5 mb-0.5" />
        <span className="text-[11px] font-medium tracking-tight">Undo</span>
      </button>

      {/* Erase Button */}
      <button
        id="action-erase-btn"
        type="button"
        onClick={onErase}
        className={`flex flex-col items-center justify-center py-2.5 px-1 rounded-2xl transition active:scale-95 border ${activeStyle.surfaceCard} ${activeStyle.outline} hover:opacity-90`}
        title="Erase cell value"
      >
        <Eraser className="w-5 h-5 mb-0.5" />
        <span className="text-[11px] font-medium tracking-tight">Erase</span>
      </button>

      {/* Notes / Pencil Mode Toggle */}
      <button
        id="action-notes-btn"
        type="button"
        onClick={onToggleNotesMode}
        className={`relative flex flex-col items-center justify-center py-2.5 px-1 rounded-2xl transition active:scale-95 border ${
          notesMode
            ? activeStyle.primary
            : `${activeStyle.surfaceCard} ${activeStyle.outline} hover:opacity-90`
        }`}
        title="Toggle Pencil Notes"
      >
        <Edit3 className="w-5 h-5 mb-0.5" />
        <div className="flex items-center gap-1">
          <span className="text-[11px] font-medium tracking-tight">Notes</span>
          <span
            className={`w-1.5 h-1.5 rounded-full ${
              notesMode ? 'bg-white' : 'bg-slate-400'
            }`}
          />
        </div>
      </button>

      {/* Smart Hint Button */}
      <button
        id="action-hint-btn"
        type="button"
        onClick={onGetHint}
        className={`relative flex flex-col items-center justify-center py-2.5 px-1 rounded-2xl transition active:scale-95 border ${activeStyle.surfaceCard} ${activeStyle.outline} hover:opacity-90`}
        title="Get intelligent hint with explanation"
      >
        <div className="relative">
          <Lightbulb className="w-5 h-5 mb-0.5 text-amber-500" />
          <span className="absolute -top-1 -right-2 px-1 rounded-full text-[9px] font-bold bg-[#D9531E] text-white">
            {hintsRemaining}
          </span>
        </div>
        <span className="text-[11px] font-medium tracking-tight">Hint</span>
      </button>

      {/* Check / Validate Board */}
      <button
        id="action-check-btn"
        type="button"
        onClick={onValidateBoard}
        className={`flex flex-col items-center justify-center py-2.5 px-1 rounded-2xl transition active:scale-95 border ${activeStyle.surfaceCard} ${activeStyle.outline} hover:opacity-90`}
        title="Check for mistakes"
      >
        <CheckCircle2 className="w-5 h-5 mb-0.5 text-emerald-600 dark:text-emerald-400" />
        <span className="text-[11px] font-medium tracking-tight">Check</span>
      </button>
    </div>
  );
};
