"use client"

import { useState, useEffect } from "react"

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
  }, []);

  return (
    <div className="container mx-auto px-4 py-8">
            <div className="flex flex-col items-center justify-center h-screen bg-gray-600 text-white">
      <h1 className="text-3xl font-bold mb-4">Tic Tac Toe Matchmaking</h1>
      <p className="text-lg">{status}</p>
      {gameId && (
        <p className="mt-4">Game ID: <strong>{gameId}</strong></p>
      )}
      {symbol && (
        <p>Your symbol: <strong>{symbol}</strong></p>
      )}
    </div>
    </div>
  )
}

