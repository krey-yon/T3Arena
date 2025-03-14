export const checkWin = (board: (string | null)[]): string | null => {
    const winningCombinations = [
      [0, 1, 2],
      [3, 4, 5],
      [6, 7, 8],
      [0, 3, 6],
      [1, 4, 7],
      [2, 5, 8],
      [0, 4, 8],
      [2, 4, 6],
    ];
  
    for (const combination of winningCombinations) {
      const [a, b, c] = combination;
      if (board[a] && board[a] === board[b] && board[a] === board[c]) {
        return board[a]; // Return the winner ('X' or 'O')
      }
    }
    return null; // No winner yet
  };
  
  export const isDraw = (board: (string | null)[]): boolean => {
    return board.every(cell => cell !== null);
  };
  
  export const getComputerMove = (board: (string | null)[]): number => {
    const availableMoves = board.map((cell, index) => (cell === null ? index : null)).filter(index => index !== null) as number[];
  
    // Simple AI: Randomly select an available move
    const randomIndex = Math.floor(Math.random() * availableMoves.length);
    return availableMoves[randomIndex];
  };
  
  export const resetGame = (): (string | null)[] => {
    return Array(9).fill(null); // Reset the board to empty
  };