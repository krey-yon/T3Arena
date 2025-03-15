"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useSearchParams } from "next/navigation";
import { TicTacToeBoard } from "@/components/tic-tac-toe-board";
import { useRouter } from "next/navigation";

// Create a client component for game content
export default function GameContent() {
  const searchParams = useSearchParams();
  const gameId = searchParams.get("gameId");
  const playerSymbol = searchParams.get("symbol") as "X" | "O";
  const router = useRouter();

  const [socket, setSocket] = useState<WebSocket | null>(null);
  const [board, setBoard] = useState<(null | "X" | "O")[]>(Array(9).fill(null));
  const [currentPlayer, setCurrentPlayer] = useState<"X" | "O">("X");
  const [status, setStatus] = useState("Connecting...");
  const [winner, setWinner] = useState<null | "X" | "O">(null);
  const [isDraw, setIsDraw] = useState(false);
  const [opponentDisconnected, setOpponentDisconnected] = useState(false);

  // All the existing useEffect and handler code goes here
  useEffect(() => {
    if (!gameId || !playerSymbol) {
      setStatus("Invalid game parameters");
      return;
    }

    const ws = new WebSocket("ws://localhost:3001");

    ws.onopen = () => {
      console.log("WebSocket connection established");
      setStatus(`Connected to game. You are ${playerSymbol}`);

      // Join the game immediately after connection
      const joinMessage = JSON.stringify({
        type: "joinGame",
        gameId,
        symbol: playerSymbol,
      });

      console.log("Sending join message:", joinMessage);
      ws.send(joinMessage);
    };

    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      console.log("Received message:", data);

      if (data.type === "error") {
        setStatus(`Error: ${data.message}`);
      } else if (data.type === "gameUpdate") {
        // Update the board and current player
        setBoard([...data.board]);
        setCurrentPlayer(data.currentTurn);

        // Check for game end conditions
        if (data.winner) {
          setWinner(data.winner);
          setStatus(data.winner === playerSymbol ? "You win!" : "You lose!");
        } else if (data.isDraw) {
          setIsDraw(true);
          setStatus("Game over! It's a draw!");
        } else {
          const isYourTurn = data.currentTurn === playerSymbol;
          setStatus(
            isYourTurn
              ? "Your turn"
              : `Waiting for opponent (${data.currentTurn})`
          );
        }
      } else if (data.type === "opponentDisconnected") {
        setOpponentDisconnected(true);
        setStatus("Your opponent disconnected");
      }
    };

    ws.onclose = () => {
      console.log("WebSocket connection closed");
      setStatus("Disconnected from game server");
    };

    ws.onerror = (error) => {
      console.error("WebSocket error:", error);
      setStatus("Error connecting to game server");
    };

    setSocket(ws);

    return () => {
      console.log("Cleaning up WebSocket connection");
      ws.close();
    };
  }, [gameId, playerSymbol]);

  const handleMove = (position: number) => {
    // Your existing handler code...
    // Don't allow moves if the game is over
    if (winner || isDraw || opponentDisconnected) {
      return;
    }

    // Don't allow moves if it's not your turn or the position is already taken
    if (!socket || board[position] !== null || currentPlayer !== playerSymbol) {
      return;
    }

    const moveMessage = JSON.stringify({
      type: "makeMove",
      gameId,
      position,
      symbol: playerSymbol,
    });

    console.log("Sending move:", moveMessage);
    socket.send(moveMessage);
  };

  // Return the UI for the game
  return (
    <div className="container mx-auto px-4 py-8 w-full relative overflow-hidden">
      <motion.div
        className="absolute inset-0 bg-gradient-to-br from-purple-500/10 to-blue-500/10"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 2 }}
      />

      <motion.div
        className="flex flex-col items-center justify-center min-h-screen text-white"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <motion.h1
          className="text-4xl font-bold mb-4 text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-600"
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{
            type: "spring",
            stiffness: 200,
            damping: 10,
            delay: 0.1,
          }}
        >
          Tic Tac Toe
        </motion.h1>

        <motion.div
          className="flex flex-col items-center space-y-2 mb-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.5 }}
        >
          <motion.p
            className="text-lg text-black font-semibold px-4 py-2 rounded-full bg-gray-800/30 backdrop-blur-sm"
            whileHover={{ scale: 1.05 }}
            transition={{ type: "spring", stiffness: 400, damping: 10 }}
          >
            Game ID:{" "}
            <span className="font-mono bg-gray-800/50 px-2 py-1 rounded-full">
              {gameId}
            </span>
          </motion.p>

          <motion.p
            className="text-lg text-black font-semibold px-4 py-2 backdrop-blur-sm"
            whileHover={{ scale: 1.05 }}
            transition={{ type: "spring", stiffness: 400, damping: 10 }}
          >
            You are playing as:
            <motion.span
              className={`ml-2 font-bold ${
                playerSymbol === "X" ? "text-blue-400" : "text-purple-400"
              }`}
              animate={{
                scale: [1, 1.2, 1],
                rotate: [0, 5, -5, 0],
              }}
              transition={{
                duration: 0.5,
                repeat: 1,
                repeatDelay: 5,
              }}
            >
              {playerSymbol}
            </motion.span>
          </motion.p>

          <motion.p
            className="text-xl font-semibold px-4 py-2 rounded-full bg-gray-800/30 backdrop-blur-sm"
            key={status} // This forces re-animation when status changes
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ type: "spring", stiffness: 200 }}
          >
            {status}
          </motion.p>
        </motion.div>

        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{
            type: "spring",
            stiffness: 200,
            damping: 15,
            delay: 0.5,
          }}
          className="relative"
        >
          <motion.div
            className="absolute -inset-4 bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl opacity-50 blur-xl"
            animate={{
              rotate: [0, 360],
            }}
            transition={{
              duration: 20,
              repeat: Number.POSITIVE_INFINITY,
              repeatType: "loop",
              ease: "linear",
            }}
          />

          <motion.div className="relative bg-gray-900/80 backdrop-blur-sm p-4 rounded-xl">
            <TicTacToeBoard
              board={board}
              currentPlayer={currentPlayer}
              playerSymbol={playerSymbol}
              onMove={handleMove}
            />
          </motion.div>
        </motion.div>

        <AnimatePresence>
          {(winner || isDraw || opponentDisconnected) && (
            <motion.button
              className="mt-8 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-bold py-3 px-6 rounded-full shadow-lg"
              onClick={() => router.push("/waiting-room")}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              transition={{ type: "spring", stiffness: 400, damping: 10 }}
            >
              Play Again
            </motion.button>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}
