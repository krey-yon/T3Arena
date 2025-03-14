import React from "react";

interface TicTacToeBoardProps {
  board: (null | "X" | "O")[];
  currentPlayer: "X" | "O";
  playerSymbol: "X" | "O";
  onMove: (position: number) => void;
}

export function TicTacToeBoard({
  board,
  currentPlayer,
  playerSymbol,
  onMove,
}: TicTacToeBoardProps) {
  return (
    <div className="grid grid-cols-3 gap-2 w-64 h-64">
      {board.map((cell, index) => (
        <button
          key={index}
          className={`
            w-20 h-20 flex items-center justify-center text-4xl font-bold 
            ${cell === null && currentPlayer === playerSymbol 
              ? "bg-gray-700 hover:bg-gray-600" 
              : "bg-gray-800"
            }
            ${currentPlayer === playerSymbol && cell === null ? "cursor-pointer" : "cursor-not-allowed"}
            border-2 border-gray-600 rounded
          `}
          onClick={() => onMove(index)}
          disabled={cell !== null || currentPlayer !== playerSymbol}
        >
          {cell === "X" && <span className="text-red-500">X</span>}
          {cell === "O" && <span className="text-blue-500">O</span>}
        </button>
      ))}
    </div>
  );
}