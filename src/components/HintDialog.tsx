import React, { useEffect } from 'react';
import { Lightbulb, Check, X, HelpCircle } from 'lucide-react';
import { HintInfo } from '../types';
import { ThemeConfig } from '../utils/theme';

interface HintDialogProps {
  hint: HintInfo | null;
  onApply: () => void;
  onClose: () => void;
  darkMode: boolean;
  themeConfig: ThemeConfig;
}

export const HintDialog: React.FC<HintDialogProps> = ({
  hint,
  onApply,
  onClose,
  darkMode,
  themeConfig,
}) => {
  useEffect(() => {
    if (!hint) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [hint, onClose]);

  if (!hint) return null;
  const activeStyle = darkMode ? themeConfig.dark : themeConfig.light;

  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div
      id="hint-dialog-backdrop"
      onClick={handleBackdropClick}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 animate-in fade-in duration-150"
    >
      <div
        id="hint-dialog-card"
        className={`w-full max-w-sm rounded-3xl p-6 shadow-xl border transition-all duration-150 ${activeStyle.surfaceCard} ${activeStyle.onSurface}`}
      >
        <div className={`flex items-center justify-between pb-3 border-b ${activeStyle.outline}`}>
          <div className="flex items-center gap-2.5">
            <div className={`w-10 h-10 rounded-2xl flex items-center justify-center ${activeStyle.primaryContainer}`}>
              <Lightbulb className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold leading-tight">{hint.title}</h3>
              <p className="text-xs opacity-75">
                Row {hint.row + 1}, Column {hint.col + 1}
              </p>
            </div>
          </div>
          <button
            id="close-hint-modal-btn"
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

        {/* Explanation body */}
        <div className="mt-4 space-y-3">
          <div
            className={`p-3.5 rounded-2xl text-xs sm:text-sm leading-relaxed border ${activeStyle.surfaceVariant} ${activeStyle.outline}`}
          >
            {hint.explanation}
          </div>

          <div className={`flex items-center justify-between px-3.5 py-2.5 rounded-2xl border ${activeStyle.primaryContainer} ${activeStyle.outline}`}>
            <div className="flex items-center gap-2">
              <HelpCircle className="w-4 h-4 opacity-80" />
              <span className="text-xs font-semibold">
                Suggested Value:
              </span>
            </div>
            <span className="text-base font-mono font-black px-3 py-0.5 rounded-xl border border-black/10 dark:border-white/20 bg-white dark:bg-black/40">
              {hint.value}
            </span>
          </div>
        </div>

        {/* Actions */}
        <div className="mt-5 flex items-center gap-2">
          <button
            id="hint-cancel-btn"
            type="button"
            onClick={onClose}
            className={`flex-1 py-2.5 rounded-2xl border font-semibold text-xs transition ${activeStyle.surfaceVariant} ${activeStyle.outline}`}
          >
            Dismiss
          </button>
          <button
            id="hint-apply-btn"
            type="button"
            onClick={onApply}
            className={`flex-1 py-2.5 rounded-2xl font-bold text-xs transition flex items-center justify-center gap-1.5 shadow-xs ${activeStyle.primary}`}
          >
            <Check className="w-4 h-4" />
            Apply Hint
          </button>
        </div>
      </div>
    </div>
  );
};
