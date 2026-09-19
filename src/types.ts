export type SudokuSize = 6 | 9;

export type Difficulty = 'easy' | 'medium' | 'hard' | 'expert';

export interface Cell {
  row: number;
  col: number;
  value: number; // 0 represents empty
  solution: number;
  initial: boolean;
  notes: number[];
  error?: boolean;
}

export type BoardState = Cell[][];

export type GameMode = 'daily' | 'practice';

export interface HintInfo {
  row: number;
  col: number;
  value: number;
  title: string;
  explanation: string;
  type: 'naked_single' | 'hidden_single' | 'smart_reveal';
}

export interface GameStats {
  streak: number;
  bestStreak: number;
  lastDailyCompletedDate: string | null;
  totalGamesPlayed: number;
  totalGamesWon: number;
  hintsUsedTotal: number;
  bestTimes: {
    '6-easy'?: number;
    '6-medium'?: number;
    '9-easy'?: number;
    '9-medium'?: number;
    '9-hard'?: number;
    '9-expert'?: number;
    'daily'?: number;
  };
}

export type MaterialTheme = 'blue' | 'teal' | 'sage' | 'terracotta' | 'slate';

export interface ThemeColors {
  name: string;
  primary: string;
  primaryContainer: string;
  onPrimaryContainer: string;
  secondary: string;
  accent: string;
  highlightCell: string;
  selectedCell: string;
  sameNumberCell: string;
}
