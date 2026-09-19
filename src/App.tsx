import React, { useState, useEffect, useCallback, useRef } from 'react';
import {
  BoardState,
  Difficulty,
  GameMode,
  GameStats,
  HintInfo,
  MaterialTheme,
  SudokuSize,
} from './types';
import { MATERIAL_THEMES, ThemeConfig } from './utils/theme';
import {
  generateSudoku,
  getDailyPuzzle,
  isBoardCompleteAndCorrect,
  findSmartHint,
} from './utils/sudokuGenerator';
import { TopAppBar } from './components/TopAppBar';
import { SudokuGrid } from './components/SudokuGrid';
import { ActionControls } from './components/ActionControls';
import { NumberPad } from './components/NumberPad';
import { GameStatusHeader } from './components/GameStatusHeader';
import { HintDialog } from './components/HintDialog';
import { NewGameModal } from './components/NewGameModal';
import { StatsModal } from './components/StatsModal';
import { StreakDetailsModal } from './components/StreakDetailsModal';
import { VictoryModal } from './components/VictoryModal';

const STATS_KEY = 'sudoku_material_stats_v1';
const THEME_KEY = 'sudoku_material_theme_v1';
const DARK_KEY = 'sudoku_material_dark_v1';

const defaultStats: GameStats = {
  streak: 0,
  bestStreak: 0,
  lastDailyCompletedDate: null,
  totalGamesPlayed: 0,
  totalGamesWon: 0,
  hintsUsedTotal: 0,
  bestTimes: {},
};

export default function App() {
  // Appearance - Light theme default as requested, with swatch toggle for dark mode
  const [darkMode, setDarkMode] = useState<boolean>(() => {
    const saved = localStorage.getItem(DARK_KEY);
    if (saved !== null) return saved === 'true';
    return false; // Default to Light theme
  });

  const [currentTheme, setCurrentTheme] = useState<MaterialTheme>(() => {
    const saved = localStorage.getItem(THEME_KEY) as MaterialTheme;
    return saved && MATERIAL_THEMES[saved] ? saved : 'blue';
  });

  // Game Settings
  const [size, setSize] = useState<SudokuSize>(9);
  const [difficulty, setDifficulty] = useState<Difficulty>('easy');
  const [gameMode, setGameMode] = useState<GameMode>('daily');
  const [currentDateStr] = useState<string>(() => new Date().toISOString().split('T')[0]);

  // Board & Gameplay State
  const [board, setBoard] = useState<BoardState>([]);
  const [history, setHistory] = useState<BoardState[]>([]);
  const [selectedRow, setSelectedRow] = useState<number | null>(null);
  const [selectedCol, setSelectedCol] = useState<number | null>(null);
  const [notesMode, setNotesMode] = useState<boolean>(false);
  const [hintsRemaining, setHintsRemaining] = useState<number>(3);
  const [hintsUsedInGame, setHintsUsedInGame] = useState<number>(0);
  const [activeHint, setActiveHint] = useState<HintInfo | null>(null);
  const [highlightedHintCell, setHighlightedHintCell] = useState<{ row: number; col: number } | null>(null);
  const [mistakes, setMistakes] = useState<number>(0);
  const [timeSeconds, setTimeSeconds] = useState<number>(0);
  const [isCompleted, setIsCompleted] = useState<boolean>(false);
  const [isNewStreakAchieved, setIsNewStreakAchieved] = useState<boolean>(false);

  // Statistics
  const [stats, setStats] = useState<GameStats>(() => {
    try {
      const saved = localStorage.getItem(STATS_KEY);
      return saved ? { ...defaultStats, ...JSON.parse(saved) } : defaultStats;
    } catch {
      return defaultStats;
    }
  });

  // Modals
  const [isNewGameModalOpen, setIsNewGameModalOpen] = useState<boolean>(false);
  const [isStatsModalOpen, setIsStatsModalOpen] = useState<boolean>(false);
  const [isStreakModalOpen, setIsStreakModalOpen] = useState<boolean>(false);
  const [isVictoryModalOpen, setIsVictoryModalOpen] = useState<boolean>(false);

  // Theme Config
  const themeConfig: ThemeConfig = MATERIAL_THEMES[currentTheme];

  // Save Settings
  useEffect(() => {
    localStorage.setItem(DARK_KEY, String(darkMode));
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  useEffect(() => {
    localStorage.setItem(THEME_KEY, currentTheme);
  }, [currentTheme]);

  useEffect(() => {
    try {
      localStorage.setItem(STATS_KEY, JSON.stringify(stats));
    } catch {
      // ignore
    }
  }, [stats]);

  // Start / Init Game
  const startNewGame = useCallback(
    (mode: GameMode, newSize: SudokuSize, newDiff: Difficulty) => {
      setGameMode(mode);
      setSize(newSize);
      setDifficulty(newDiff);
      setSelectedRow(null);
      setSelectedCol(null);
      setNotesMode(false);
      setHintsRemaining(3);
      setHintsUsedInGame(0);
      setActiveHint(null);
      setHighlightedHintCell(null);
      setMistakes(0);
      setTimeSeconds(0);
      setIsCompleted(false);
      setIsNewStreakAchieved(false);
      setHistory([]);

      let result;
      if (mode === 'daily') {
        result = getDailyPuzzle(currentDateStr, 9, 'medium');
      } else {
        result = generateSudoku(newSize, newDiff);
      }

      setBoard(result.initialBoard);

      // Track game started
      setStats((prev) => ({
        ...prev,
        totalGamesPlayed: prev.totalGamesPlayed + 1,
      }));
    },
    [currentDateStr]
  );

  // Initial load
  const hasInitialized = useRef(false);
  useEffect(() => {
    if (!hasInitialized.current) {
      hasInitialized.current = true;
      startNewGame('daily', 9, 'medium');
    }
  }, [startNewGame]);

  // Timer loop
  useEffect(() => {
    if (isCompleted || board.length === 0) return;
    const timer = setInterval(() => {
      setTimeSeconds((prev) => prev + 1);
    }, 1000);
    return () => clearInterval(timer);
  }, [isCompleted, board.length]);

  // Haptic feedback helper
  const triggerHaptic = (duration: number | number[] = 15) => {
    if (typeof navigator !== 'undefined' && navigator.vibrate) {
      navigator.vibrate(duration);
    }
  };

  // Cell Selection
  const handleSelectCell = (r: number, c: number) => {
    triggerHaptic(10);
    setSelectedRow(r);
    setSelectedCol(c);
    setHighlightedHintCell(null);
  };

  // Check victory condition
  const verifyCompletion = useCallback(
    (currentBoard: BoardState) => {
      if (isBoardCompleteAndCorrect(currentBoard)) {
        setIsCompleted(true);
        triggerHaptic(50);

        // Update statistics and streaks
        setStats((prev) => {
          let newStreak = prev.streak;
          let newBestStreak = prev.bestStreak;
          let isNewStreak = false;

          if (gameMode === 'daily') {
            const today = currentDateStr;
            if (prev.lastDailyCompletedDate !== today) {
              // Check if streak continues (last completed was yesterday)
              const yesterday = new Date();
              yesterday.setDate(yesterday.getDate() - 1);
              const yesterdayStr = yesterday.toISOString().split('T')[0];

              if (prev.lastDailyCompletedDate === yesterdayStr) {
                newStreak += 1;
              } else {
                newStreak = 1;
              }

              if (newStreak > newBestStreak) {
                newBestStreak = newStreak;
              }
              isNewStreak = true;
            }
          }

          const key = (
            gameMode === 'daily' ? 'daily' : `${size}-${difficulty}`
          ) as keyof GameStats['bestTimes'];
          const existingBest = prev.bestTimes[key];
          const newBestTimes = { ...prev.bestTimes };
          if (!existingBest || timeSeconds < existingBest) {
            newBestTimes[key] = timeSeconds;
          }

          setIsNewStreakAchieved(isNewStreak);

          return {
            ...prev,
            streak: newStreak,
            bestStreak: newBestStreak,
            lastDailyCompletedDate: gameMode === 'daily' ? currentDateStr : prev.lastDailyCompletedDate,
            totalGamesWon: prev.totalGamesWon + 1,
            hintsUsedTotal: prev.hintsUsedTotal + hintsUsedInGame,
            bestTimes: newBestTimes,
          };
        });

        setIsVictoryModalOpen(true);
      }
    },
    [currentDateStr, difficulty, gameMode, hintsUsedInGame, size, timeSeconds]
  );

  // Input a number into current cell
  const handleInputNumber = useCallback(
    (num: number) => {
      if (selectedRow === null || selectedCol === null || isCompleted) return;
      const targetCell = board[selectedRow][selectedCol];
      if (targetCell.initial) return; // Cannot edit initial clues

      triggerHaptic(15);

      // Deep copy board for immutability & undo
      const newBoard: BoardState = board.map((row) =>
        row.map((cell) => ({
          ...cell,
          notes: [...cell.notes],
        }))
      );

      setHistory((prev) => [...prev, board]);

      if (notesMode) {
        // Toggle note
        const currentNotes = targetCell.notes;
        if (currentNotes.includes(num)) {
          newBoard[selectedRow][selectedCol].notes = currentNotes.filter((n) => n !== num);
        } else {
          newBoard[selectedRow][selectedCol].notes = [...currentNotes, num].sort((a, b) => a - b);
        }
      } else {
        // Input digit
        const isError = num !== targetCell.solution;
        if (isError) {
          setMistakes((prev) => prev + 1);
          triggerHaptic([30, 50, 30]);
        }

        newBoard[selectedRow][selectedCol].value = num;
        newBoard[selectedRow][selectedCol].error = isError;
        newBoard[selectedRow][selectedCol].notes = [];

        // Auto-clean notes for other cells in same row, column, and block
        const blockRows = size === 6 ? 2 : 3;
        const blockCols = 3;
        const startR = Math.floor(selectedRow / blockRows) * blockRows;
        const startC = Math.floor(selectedCol / blockCols) * blockCols;

        for (let r = 0; r < size; r++) {
          for (let c = 0; c < size; c++) {
            if (
              (r === selectedRow ||
                c === selectedCol ||
                (r >= startR && r < startR + blockRows && c >= startC && c < startC + blockCols)) &&
              (r !== selectedRow || c !== selectedCol)
            ) {
              newBoard[r][c].notes = newBoard[r][c].notes.filter((n) => n !== num);
            }
          }
        }
      }

      setBoard(newBoard);
      verifyCompletion(newBoard);
    },
    [board, isCompleted, notesMode, selectedCol, selectedRow, size, verifyCompletion]
  );

  // Erase cell content
  const handleErase = useCallback(() => {
    if (selectedRow === null || selectedCol === null || isCompleted) return;
    const targetCell = board[selectedRow][selectedCol];
    if (targetCell.initial) return;

    triggerHaptic(10);
    setHistory((prev) => [...prev, board]);

    const newBoard: BoardState = board.map((row) =>
      row.map((cell) => ({
        ...cell,
        notes: [...cell.notes],
      }))
    );

    newBoard[selectedRow][selectedCol].value = 0;
    newBoard[selectedRow][selectedCol].error = false;
    newBoard[selectedRow][selectedCol].notes = [];

    setBoard(newBoard);
  }, [board, isCompleted, selectedCol, selectedRow]);

  // Undo last action
  const handleUndo = useCallback(() => {
    if (history.length === 0 || isCompleted) return;
    triggerHaptic(10);
    const previous = history[history.length - 1];
    setBoard(previous);
    setHistory((prev) => prev.slice(0, -1));
  }, [history, isCompleted]);

  // Validate current board / check mistakes
  const handleValidateBoard = () => {
    triggerHaptic(20);
    let foundErrors = 0;
    const newBoard = board.map((row) =>
      row.map((cell) => {
        if (cell.value > 0 && cell.value !== cell.solution) {
          foundErrors++;
          return { ...cell, error: true };
        }
        return { ...cell, error: false };
      })
    );
    setBoard(newBoard);
    if (foundErrors > 0) {
      setMistakes((prev) => prev + foundErrors);
    }
  };

  // Smart Hint
  const handleGetHint = () => {
    if (isCompleted) return;
    triggerHaptic(20);

    const hint = findSmartHint(
      board,
      size,
      selectedRow !== null ? selectedRow : undefined,
      selectedCol !== null ? selectedCol : undefined
    );

    if (hint) {
      setActiveHint(hint);
      setHighlightedHintCell({ row: hint.row, col: hint.col });
      setSelectedRow(hint.row);
      setSelectedCol(hint.col);
    }
  };

  // Apply Hint
  const handleApplyHint = () => {
    if (!activeHint) return;
    triggerHaptic(20);

    setHistory((prev) => [...prev, board]);

    const newBoard: BoardState = board.map((row) =>
      row.map((cell) => ({
        ...cell,
        notes: [...cell.notes],
      }))
    );

    newBoard[activeHint.row][activeHint.col].value = activeHint.value;
    newBoard[activeHint.row][activeHint.col].error = false;
    newBoard[activeHint.row][activeHint.col].notes = [];

    setBoard(newBoard);
    setHintsRemaining((prev) => Math.max(0, prev - 1));
    setHintsUsedInGame((prev) => prev + 1);
    setActiveHint(null);
    setHighlightedHintCell(null);

    verifyCompletion(newBoard);
  };

  // Keyboard Navigation & Shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (isCompleted) return;

      // Numbers 1 to 9
      const num = parseInt(e.key, 10);
      if (!isNaN(num) && num >= 1 && num <= size) {
        e.preventDefault();
        handleInputNumber(num);
        return;
      }

      // Erase
      if (e.key === 'Backspace' || e.key === 'Delete') {
        e.preventDefault();
        handleErase();
        return;
      }

      // Notes Mode Toggle
      if (e.key === 'n' || e.key === 'N') {
        e.preventDefault();
        setNotesMode((prev) => !prev);
        return;
      }

      // Hint
      if (e.key === 'h' || e.key === 'H') {
        e.preventDefault();
        handleGetHint();
        return;
      }

      // Undo: Ctrl+Z or U
      if ((e.ctrlKey || e.metaKey) && (e.key === 'z' || e.key === 'Z')) {
        e.preventDefault();
        handleUndo();
        return;
      }

      // Navigation: Arrows
      if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(e.key)) {
        e.preventDefault();
        setSelectedRow((prevR) => {
          setSelectedCol((prevC) => {
            const curR = prevR ?? 0;
            const curC = prevC ?? 0;
            if (e.key === 'ArrowUp') return curC;
            if (e.key === 'ArrowDown') return curC;
            if (e.key === 'ArrowLeft') return Math.max(0, curC - 1);
            if (e.key === 'ArrowRight') return Math.min(size - 1, curC + 1);
            return curC;
          });
          const curR = prevR ?? 0;
          if (e.key === 'ArrowUp') return Math.max(0, curR - 1);
          if (e.key === 'ArrowDown') return Math.min(size - 1, curR + 1);
          return curR;
        });
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleErase, handleInputNumber, handleUndo, isCompleted, size]);

  // Restart current puzzle
  const handleRestartCurrent = () => {
    if (board.length === 0) return;
    const resetBoard: BoardState = board.map((row) =>
      row.map((cell) => ({
        ...cell,
        value: cell.initial ? cell.value : 0,
        error: false,
        notes: [],
      }))
    );
    setBoard(resetBoard);
    setHistory([]);
    setMistakes(0);
    setTimeSeconds(0);
    setIsCompleted(false);
  };

  return (
    <div
      className={`min-h-screen flex flex-col font-sans transition-colors duration-150 ${
        darkMode ? 'bg-[#121316] text-[#E8EAED]' : 'bg-[#F8F9FA] text-[#202124]'
      }`}
    >
      {/* Top App Bar with Android M3 styling */}
      <TopAppBar
        darkMode={darkMode}
        onToggleDarkMode={() => setDarkMode((prev) => !prev)}
        currentTheme={currentTheme}
        onSelectTheme={setCurrentTheme}
        themeConfig={themeConfig}
        streak={stats.streak}
        gameMode={gameMode}
        size={size}
        difficulty={difficulty}
        onOpenNewGame={() => setIsNewGameModalOpen(true)}
        onOpenStats={() => setIsStatsModalOpen(true)}
        onOpenStreakDetails={() => setIsStreakModalOpen(true)}
        onRestartCurrent={handleRestartCurrent}
      />

      {/* Main Game Screen */}
      <main className="flex-1 flex flex-col justify-between max-w-lg w-full mx-auto px-2 pb-3">
        {/* Game Status Header: Timer, Mistakes, Mode */}
        <GameStatusHeader
          timeSeconds={timeSeconds}
          mistakes={mistakes}
          size={size}
          difficulty={difficulty}
          gameMode={gameMode}
          dateStr={gameMode === 'daily' ? currentDateStr : undefined}
          darkMode={darkMode}
          themeConfig={themeConfig}
        />

        {/* Sudoku Board */}
        <SudokuGrid
          board={board}
          size={size}
          selectedRow={selectedRow}
          selectedCol={selectedCol}
          onSelectCell={handleSelectCell}
          darkMode={darkMode}
          themeConfig={themeConfig}
          highlightedHintCell={highlightedHintCell}
        />

        {/* Action Controls: Undo, Erase, Notes, Hint, Check */}
        <div className="mt-1">
          <ActionControls
            onUndo={handleUndo}
            canUndo={history.length > 0}
            onErase={handleErase}
            notesMode={notesMode}
            onToggleNotesMode={() => setNotesMode((prev) => !prev)}
            onGetHint={handleGetHint}
            onValidateBoard={handleValidateBoard}
            hintsRemaining={hintsRemaining}
            darkMode={darkMode}
            themeConfig={themeConfig}
          />
        </div>

        {/* Number Pad (1-6 or 1-9) */}
        <div className="mt-1">
          <NumberPad
            size={size}
            board={board}
            onSelectNumber={handleInputNumber}
            darkMode={darkMode}
            themeConfig={themeConfig}
          />
        </div>
      </main>

      {/* Modals & Dialogs */}
      <HintDialog
        hint={activeHint}
        onApply={handleApplyHint}
        onClose={() => {
          setActiveHint(null);
          setHighlightedHintCell(null);
        }}
        darkMode={darkMode}
        themeConfig={themeConfig}
      />

      <NewGameModal
        isOpen={isNewGameModalOpen}
        onClose={() => setIsNewGameModalOpen(false)}
        onStartGame={startNewGame}
        currentSize={size}
        currentDifficulty={difficulty}
        currentMode={gameMode}
        darkMode={darkMode}
        themeConfig={themeConfig}
        streak={stats.streak}
      />

      <StatsModal
        isOpen={isStatsModalOpen}
        onClose={() => setIsStatsModalOpen(false)}
        stats={stats}
        darkMode={darkMode}
        themeConfig={themeConfig}
      />

      <StreakDetailsModal
        isOpen={isStreakModalOpen}
        stats={stats}
        onClose={() => setIsStreakModalOpen(false)}
        onPlayDaily={() => startNewGame('daily', 9, 'medium')}
        darkMode={darkMode}
        themeConfig={themeConfig}
      />

      <VictoryModal
        isOpen={isVictoryModalOpen}
        onPlayAgain={() => {
          setIsVictoryModalOpen(false);
          setIsNewGameModalOpen(true);
        }}
        timeSeconds={timeSeconds}
        hintsUsed={hintsUsedInGame}
        size={size}
        difficulty={difficulty}
        gameMode={gameMode}
        streak={stats.streak}
        isNewStreak={isNewStreakAchieved}
        darkMode={darkMode}
        themeConfig={themeConfig}
      />
    </div>
  );
}
