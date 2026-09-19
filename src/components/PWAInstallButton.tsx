import React, { useState, useEffect } from 'react';
import { Download, Smartphone, X } from 'lucide-react';
import { usePWAInstall } from '../hooks/usePWAInstall';

export const PWAInstallButton: React.FC = () => {
  const { isInstallable, isInstalled, isIOS, install } = usePWAInstall();
  const [showIOSGuide, setShowIOSGuide] = useState(false);

  useEffect(() => {
    if (!showIOSGuide) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setShowIOSGuide(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [showIOSGuide]);

  if (isInstalled) {
    return null;
  }

  // Android / Chromium / Desktop flow
  if (isInstallable) {
    return (
      <button
        id="pwa-install-btn"
        type="button"
        onClick={install}
        className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-2xl bg-[#1A73E8] text-white hover:bg-[#1557B0] active:scale-95 transition"
        title="Install Android App / APK"
      >
        <Smartphone className="w-3.5 h-3.5" />
        <span>Install APK</span>
      </button>
    );
  }

  // iOS Safari flow
  if (isIOS) {
    return (
      <>
        <button
          id="pwa-ios-install-btn"
          type="button"
          onClick={() => setShowIOSGuide(true)}
          className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-2xl border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
        >
          <Download className="w-3.5 h-3.5" />
          <span>Install App</span>
        </button>

        {showIOSGuide && (
          <div
            id="ios-guide-backdrop"
            onClick={(e) => {
              if (e.target === e.currentTarget) setShowIOSGuide(false);
            }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
          >
            <div className="w-full max-w-sm rounded-3xl bg-white dark:bg-[#1E2024] p-6 shadow-xl border border-slate-200 dark:border-[#30333A] text-slate-900 dark:text-slate-100">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
                <h3 className="text-base font-bold flex items-center gap-2">
                  <Smartphone className="w-5 h-5 text-[#1A73E8]" />
                  Install Sudoku
                </h3>
                <button
                  id="close-ios-guide-btn"
                  type="button"
                  aria-label="Close dialog"
                  onClick={() => setShowIOSGuide(false)}
                  className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-black/5 dark:hover:bg-white/10 text-slate-500"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              <div className="mt-4 space-y-3 text-xs sm:text-sm opacity-85">
                <div className="flex items-start gap-3">
                  <span className="w-6 h-6 flex items-center justify-center rounded-full bg-[#E8F0FE] text-[#174EA6] text-xs font-bold shrink-0">
                    1
                  </span>
                  <p>Tap the <strong>Share</strong> icon at the bottom of Safari.</p>
                </div>
                <div className="flex items-start gap-3">
                  <span className="w-6 h-6 flex items-center justify-center rounded-full bg-[#E8F0FE] text-[#174EA6] text-xs font-bold shrink-0">
                    2
                  </span>
                  <p>Scroll down and select <strong>Add to Home Screen</strong>.</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowIOSGuide(false)}
                className="mt-6 w-full py-2.5 rounded-2xl bg-[#1A73E8] text-white font-medium text-xs hover:bg-[#1557B0] transition"
              >
                Close
              </button>
            </div>
          </div>
        )}
      </>
    );
  }

  return null;
};
