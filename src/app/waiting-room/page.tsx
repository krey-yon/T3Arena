"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { X, Circle, Users, Loader2 } from "lucide-react"

export default function WaitingRoom() {
  const [status, setStatus] = useState("Connecting...");
  const [gameId, setGameId] = useState<string | null>(null);
  const [symbol, setSymbol] = useState<string | null>(null);
  const [socket, setSocket] = useState<WebSocket | null>(null);

useEffect(() => {
  console.log(socket)
    const ws = new WebSocket("ws://localhost:3001"); // Connect to WebSocket server
    ws.onopen = () => {
      console.log("Connected to WebSocket server");
      setStatus("Waiting for an opponent...");
      ws.send(JSON.stringify({ type: "joinWaitingRoom" }));
    };

    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);

      if (data.type === "waiting") {
        setStatus(data.message); // Show waiting status
      } else if (data.type === "matchFound") {
        setGameId(data.gameId);
        setSymbol(data.symbol);
        setStatus("Match found! Redirecting...");
        setTimeout(() => {
          window.location.href = `/game?gameId=${data.gameId}&symbol=${data.symbol}`;
        }, 2000);
      }
    };

    ws.onclose = () => {
      console.log("Disconnected from WebSocket server");
      setStatus("Disconnected. Refresh to try again.");
    };

    setSocket(ws);

    return () => {
      ws.close(); // Cleanup WebSocket connection on unmount
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="container mx-auto px-4 py-8 min-h-screen w-full bg-gray-600 flex items-center justify-center">
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        <div className="p-8 bg-gray-700 border border-gray-600 rounded-lg shadow-xl">
          <motion.div
            initial={{ scale: 0.9 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.5 }}
            className="flex justify-center mb-8"
          >
            <GameSymbols />
          </motion.div>

          <motion.h1
            className="text-3xl font-bold mb-6 text-center text-white"
            initial={{ y: -20 }}
            animate={{ y: 0 }}
            transition={{ delay: 0.2 }}
          >
            Tic Tac Toe Matchmaking
          </motion.h1>

          <StatusIndicator status={status} />

          {gameId ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="mt-6 p-4 bg-gray-800 rounded-lg border border-gray-600"
            >
              <div className="flex justify-between items-center">
                <span className="text-gray-300 text-sm">Game ID:</span>
                {/* <button onClick={copyGameId} className="h-8 text-gray-300 hover:text-white bg-transparent border-none">
                  {copied ? <span className="text-white">Copied!</span> : <Copy size={16} />}
                </button> */}
              </div>
              <p className="font-mono text-lg text-white mt-1 break-all">{gameId}</p>
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="mt-6 h-24 flex items-center justify-center"
            >
              <CreatingGameSkeleton />
            </motion.div>
          )}

          {symbol && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="mt-6 flex items-center justify-center gap-3"
            >
              <span className="text-gray-300">Your symbol:</span>
              <span className="flex items-center justify-center w-10 h-10 bg-gray-800 rounded-full">
                {symbol === "X" ? <X className="text-white w-6 h-6" /> : <Circle className="text-white w-6 h-6" />}
              </span>
            </motion.div>
          )}

          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.8 }} className="mt-8">
            <button className="w-full bg-white text-gray-800 hover:bg-gray-200 py-2 px-4 rounded-lg font-medium">
              {gameId ? "Ready to Play" : "Creating Game..."}
            </button>
          </motion.div>
        </div>
      </motion.div>
    </AnimatePresence>
  </div>
);
}

function StatusIndicator({ status } : { status: string }) {
return (
  <motion.div
    className="flex items-center justify-center gap-3 py-3 px-4 bg-gray-800 rounded-lg"
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    transition={{ delay: 0.3 }}
  >
    {status.includes("Waiting") && (
      <motion.div animate={{ scale: [1, 1.1, 1] }} transition={{ repeat: Number.POSITIVE_INFINITY, duration: 1.5 }}>
        <Users className="text-white" />
      </motion.div>
    )}
    {status.includes("connecting") && <Loader2 className="animate-spin text-white" />}
    <p className="text-lg text-gray-200">{status}</p>
  </motion.div>
);
}

function CreatingGameSkeleton() {
return (
  <div className="space-y-2 w-full">
    <div className="h-4 bg-gray-600 rounded animate-pulse"></div>
    <div className="h-4 bg-gray-600 rounded animate-pulse w-3/4"></div>
  </div>
);
}

function GameSymbols() {
return (
  <div className="relative w-24 h-24">
    <motion.div
      className="absolute inset-0 flex items-center justify-center"
      animate={{
        rotate: [0, 10, -10, 0],
        scale: [1, 1.1, 1],
      }}
      transition={{
        repeat: Number.POSITIVE_INFINITY,
        duration: 5,
        repeatType: "reverse",
      }}
    >
      <X className="w-16 h-16 text-white drop-shadow-lg" strokeWidth={2.5} />
    </motion.div>
    <motion.div
      className="absolute inset-0 flex items-center justify-center"
      animate={{
        rotate: [0, -10, 10, 0],
        scale: [1, 0.9, 1],
      }}
      transition={{
        repeat: Number.POSITIVE_INFINITY,
        duration: 5,
        repeatType: "reverse",
        delay: 0.5,
      }}
    >
      <Circle className="w-16 h-16 text-white drop-shadow-lg" strokeWidth={2.5} />
    </motion.div>
  </div>
  )
}

