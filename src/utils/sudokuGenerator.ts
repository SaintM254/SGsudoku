import { BoardState, Cell, Difficulty, HintInfo, SudokuSize } from '../types';

// Seeded PRNG (Mulberry32)
function createRNG(seed: number) {
  return function () {
    let t = (seed += 0x6d2b79f5);
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export function hashString(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = (hash << 5) - hash + str.charCodeAt(i);
    hash |= 0;
  }
  return Math.abs(hash);
}

// Get block dimensions for size:
// 6x6: blockRows = 2, blockCols = 3
// 9x9: blockRows = 3, blockCols = 3
export function getBlockDimensions(size: SudokuSize): { blockRows: number; blockCols: number } {
  if (size === 6) {
    return { blockRows: 2, blockCols: 3 };
  }
  return { blockRows: 3, blockCols: 3 };
}

// Check if placing value at grid[row][col] is valid
export function isValidPlacement(
  grid: number[][],
  size: SudokuSize,
  row: number,
  col: number,
  value: number
): boolean {
  // Check row
  for (let c = 0; c < size; c++) {
    if (c !== col && grid[row][c] === value) return false;
  }

  // Check column
  for (let r = 0; r < size; r++) {
    if (r !== row && grid[r][col] === value) return false;
  }

  // Check block
  const { blockRows, blockCols } = getBlockDimensions(size);
  const startRow = Math.floor(row / blockRows) * blockRows;
  const startCol = Math.floor(col / blockCols) * blockCols;

  for (let r = startRow; r < startRow + blockRows; r++) {
    for (let c = startCol; c < startCol + blockCols; c++) {
      if ((r !== row || c !== col) && grid[r][c] === value) return false;
    }
  }

  return true;
}

// Helper to shuffle an array using RNG
function shuffle<T>(array: T[], rng: () => number = Math.random): T[] {
  const result = [...array];
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}

// Solve a board or generate a complete valid solution
export function solveSudoku(
  grid: number[][],
  size: SudokuSize,
  rng: () => number = Math.random
): boolean {
  for (let r = 0; r < size; r++) {
    for (let c = 0; c < size; c++) {
      if (grid[r][c] === 0) {
        const numbers = shuffle(
          Array.from({ length: size }, (_, i) => i + 1),
          rng
        );

        for (const num of numbers) {
          if (isValidPlacement(grid, size, r, c, num)) {
            grid[r][c] = num;
            if (solveSudoku(grid, size, rng)) {
              return true;
            }
            grid[r][c] = 0;
          }
        }
        return false;
      }
    }
  }
  return true;
}

// Get all possible valid numbers for an empty cell
export function getCandidates(grid: number[][], size: SudokuSize, row: number, col: number): number[] {
  if (grid[row][col] !== 0) return [];
  const candidates: number[] = [];
  for (let val = 1; val <= size; val++) {
    if (isValidPlacement(grid, size, row, col, val)) {
      candidates.push(val);
    }
  }
  return candidates;
}

// Count solutions (up to limit) to check uniqueness
function countSolutions(grid: number[][], size: SudokuSize, count = { value: 0 }, limit = 2): number {
  for (let r = 0; r < size; r++) {
    for (let c = 0; c < size; c++) {
      if (grid[r][c] === 0) {
        for (let num = 1; num <= size; num++) {
          if (isValidPlacement(grid, size, r, c, num)) {
            grid[r][c] = num;
            countSolutions(grid, size, count, limit);
            grid[r][c] = 0;
            if (count.value >= limit) return count.value;
          }
        }
        return count.value;
      }
    }
  }
  count.value++;
  return count.value;
}

export function generateSudoku(
  size: SudokuSize,
  difficulty: Difficulty,
  seedString?: string
): { initialBoard: BoardState; solution: number[][] } {
  const rng = seedString ? createRNG(hashString(seedString)) : Math.random;

  // 1. Create empty board and fill it completely
  const solution: number[][] = Array.from({ length: size }, () => Array(size).fill(0));
  solveSudoku(solution, size, rng);

  // 2. Clone solution to create puzzle
  const puzzle: number[][] = solution.map((row) => [...row]);

  // Determine how many clues to remove based on size and difficulty
  let cluesToRemove = 0;
  if (size === 6) {
    // 6x6 has 36 cells total
    cluesToRemove = difficulty === 'easy' ? 15 : 20; // 21 clues left for easy, 16 for medium
  } else {
    // 9x9 has 81 cells total
    switch (difficulty) {
      case 'easy':
        cluesToRemove = 34; // 47 clues left
        break;
      case 'medium':
        cluesToRemove = 45; // 36 clues left
        break;
      case 'hard':
        cluesToRemove = 51; // 30 clues left
        break;
      case 'expert':
        cluesToRemove = 55; // 26 clues left
        break;
    }
  }

  // Create list of all cell coordinates
  const cells: [number, number][] = [];
  for (let r = 0; r < size; r++) {
    for (let c = 0; c < size; c++) {
      cells.push([r, c]);
    }
  }
  const shuffledCells = shuffle(cells, rng);

  let removed = 0;
  for (const [r, c] of shuffledCells) {
    if (removed >= cluesToRemove) break;

    const backup = puzzle[r][c];
    puzzle[r][c] = 0;

    // Check if puzzle still has a unique solution
    const copy = puzzle.map((row) => [...row]);
    const solutions = countSolutions(copy, size, { value: 0 }, 2);

    if (solutions === 1) {
      removed++;
    } else {
      puzzle[r][c] = backup;
    }
  }

  // Build the rich BoardState
  const initialBoard: BoardState = [];
  for (let r = 0; r < size; r++) {
    const rowCells: Cell[] = [];
    for (let c = 0; c < size; c++) {
      const val = puzzle[r][c];
      rowCells.push({
        row: r,
        col: c,
        value: val,
        solution: solution[r][c],
        initial: val !== 0,
        notes: [],
        error: false,
      });
    }
    initialBoard.push(rowCells);
  }

  return { initialBoard, solution };
}

// Generate today's daily puzzle
export function getDailyPuzzle(dateStr: string, size: SudokuSize = 9, difficulty: Difficulty = 'medium') {
  const seed = `daily-sudoku-${dateStr}-${size}-${difficulty}`;
  return generateSudoku(size, difficulty, seed);
}

// Check if entire board is solved correctly
export function isBoardCompleteAndCorrect(board: BoardState): boolean {
  for (const row of board) {
    for (const cell of row) {
      if (cell.value === 0 || cell.value !== cell.solution) {
        return false;
      }
    }
  }
  return true;
}

// Find smart hint
export function findSmartHint(
  board: BoardState,
  size: SudokuSize,
  selectedRow?: number,
  selectedCol?: number
): HintInfo | null {
  const currentGrid = board.map((row) => row.map((cell) => cell.value));
  const { blockRows, blockCols } = getBlockDimensions(size);

  // 1. If a cell is currently selected and is empty, let's analyze it first!
  if (
    selectedRow !== undefined &&
    selectedCol !== undefined &&
    board[selectedRow][selectedCol].value === 0
  ) {
    const cand = getCandidates(currentGrid, size, selectedRow, selectedCol);
    const correctVal = board[selectedRow][selectedCol].solution;

    if (cand.length === 1 && cand[0] === correctVal) {
      return {
        row: selectedRow,
        col: selectedCol,
        value: correctVal,
        title: 'Naked Single Found',
        explanation: `Cell (${selectedRow + 1}, ${selectedCol + 1}) has only one possible number (${correctVal}) that fits without conflicting with its row, column, or block!`,
        type: 'naked_single',
      };
    }
  }

  // 2. Search for any Naked Single across the entire board
  for (let r = 0; r < size; r++) {
    for (let c = 0; c < size; c++) {
      if (board[r][c].value === 0) {
        const cand = getCandidates(currentGrid, size, r, c);
        const correctVal = board[r][c].solution;
        if (cand.length === 1 && cand[0] === correctVal) {
          return {
            row: r,
            col: c,
            value: correctVal,
            title: 'Naked Single Opportunity',
            explanation: `Look at row ${r + 1}, column ${c + 1}. All other numbers from 1 to ${size} are blocked in its row, column, or block, leaving only ${correctVal}!`,
            type: 'naked_single',
          };
        }
      }
    }
  }

  // 3. Search for a Hidden Single (a number that can only go in one place in a block or row)
  for (let blockIdx = 0; blockIdx < size; blockIdx++) {
    const startRow = Math.floor(blockIdx / (size / blockRows)) * blockRows;
    const startCol = (blockIdx % (size / blockRows)) * blockCols;

    for (let num = 1; num <= size; num++) {
      const possibleCells: [number, number][] = [];
      let alreadyPlaced = false;

      for (let r = startRow; r < startRow + blockRows; r++) {
        for (let c = startCol; c < startCol + blockCols; c++) {
          if (board[r][c].value === num) {
            alreadyPlaced = true;
            break;
          }
          if (board[r][c].value === 0 && isValidPlacement(currentGrid, size, r, c, num)) {
            possibleCells.push([r, c]);
          }
        }
        if (alreadyPlaced) break;
      }

      if (!alreadyPlaced && possibleCells.length === 1) {
        const [r, c] = possibleCells[0];
        return {
          row: r,
          col: c,
          value: num,
          title: 'Hidden Single in Block',
          explanation: `In this ${blockRows}x${blockCols} block, ${num} can only be placed at row ${r + 1}, column ${c + 1}. All other cells in the block cannot accept ${num}!`,
          type: 'hidden_single',
        };
      }
    }
  }

  // 4. Fallback Direct Hint (fill currently selected cell or any empty cell)
  if (selectedRow !== undefined && selectedCol !== undefined && board[selectedRow][selectedCol].value === 0) {
    const val = board[selectedRow][selectedCol].solution;
    return {
      row: selectedRow,
      col: selectedCol,
      value: val,
      title: 'Smart Reveal',
      explanation: `Revealing the correct number ${val} for the selected cell at row ${selectedRow + 1}, col ${selectedCol + 1}.`,
      type: 'smart_reveal',
    };
  }

  // Any remaining empty cell
  for (let r = 0; r < size; r++) {
    for (let c = 0; c < size; c++) {
      if (board[r][c].value === 0) {
        const val = board[r][c].solution;
        return {
          row: r,
          col: c,
          value: val,
          title: 'Smart Hint',
          explanation: `Placing ${val} at row ${r + 1}, column ${c + 1} to help you continue.`,
          type: 'smart_reveal',
        };
      }
    }
  }

  return null;
}
