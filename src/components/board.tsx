import React, { useState, useEffect } from 'react';
import Cell from './cell';
import { checkWin, isDraw, resetGame, getComputerMove } from './game-logic';

const Board = () => {
  const [board, setBoard] = useState(Array(9).fill(null));
  const [isXNext, setIsXNext] = useState(true);
  const [gameStatus, setGameStatus] = useState('ongoing');

  useEffect(() => {
    const winner = checkWin(board);
    if (winner) {
      setGameStatus(winner === 'X' ? 'won' : 'lost');
    } else if (isDraw(board)) {
      setGameStatus('draw');
    } else if (!isXNext) {
      const computerMove = getComputerMove(board);
      if (computerMove !== null) {
        makeMove(computerMove);
      }
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [board, isXNext]);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const makeMove = (index : any) => {
    if (board[index] || gameStatus !== 'ongoing') return;

    const newBoard = board.slice();
    newBoard[index] = isXNext ? 'X' : 'O';
    setBoard(newBoard);
    setIsXNext(!isXNext);
  };

  const handleReset = () => {
    console.log(resetGame)
    setBoard(Array(9).fill(null));
    setIsXNext(true);
    setGameStatus('ongoing');
  };

  return (
    <div className="text-center">
      <div className="grid grid-cols-3 gap-1">
        {board.map((cell, index) => (
          <Cell key={index} value={cell} onClick={() => makeMove(index)} />
        ))}
      </div>
      <div className="mt-4">
        {gameStatus === 'won' && <div className="text-green-500">You Won!</div>}
        {gameStatus === 'lost' && <div className="text-red-500">You Lost!</div>}
        {gameStatus === 'draw' && <div className="text-yellow-500"> It&apos;s a Draw!</div>}
        <button onClick={handleReset} className="mt-4 p-2 bg-blue-500 text-white rounded">
          Reset Game
        </button>
      </div>
    </div>
  );
};

export default Board;