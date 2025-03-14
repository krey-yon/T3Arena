"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, RotateCcw } from "lucide-react"
import { PlayerInfo } from "@/components/player-info"
import Board from "@/components/board"

type GameStatus = "waiting" | "playing" | "won" | "lost" | "draw"

export default function PracticePage() {
  const [gameStatus, setGameStatus] = useState<GameStatus>("playing")
  const [currentTurn, setCurrentTurn] = useState<"X" | "O">("X")
  const [playerSymbol] = useState<"X" | "O">("X")

  const handlePlayAgain = () => {
    // Reset the game
    setGameStatus("waiting")
    setCurrentTurn("X")

    // Start a new game
    setTimeout(() => {
      setGameStatus("playing")
    }, 500)
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col items-center space-y-6 max-w-3xl mx-auto">
        <div className="flex items-center justify-between w-full">
          <Link href="/">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Dashboard
            </Button>
          </Link>

          <Badge
            variant={
              gameStatus === "waiting"
                ? "outline"
                : gameStatus === "playing"
                  ? "secondary"
                  : gameStatus === "won"
                    ? "default"
                    : gameStatus === "lost"
                      ? "destructive"
                      : "outline"
            }
          >
            {gameStatus === "waiting"
              ? "Starting Game..."
              : gameStatus === "playing"
                ? "Game in Progress"
                : gameStatus === "won"
                  ? "You Won!"
                  : gameStatus === "lost"
                    ? "You Lost"
                    : "Draw"}
          </Badge>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full">
          <PlayerInfo
            name="You"
            symbol={playerSymbol}
            isCurrentTurn={gameStatus === "playing" && currentTurn === playerSymbol}
          />

          <Card className="md:col-span-1">
            <CardHeader className="text-center">
              <CardTitle>Practice Mode</CardTitle>
              <CardDescription>
                {gameStatus === "waiting"
                  ? "Starting new game..."
                  : gameStatus === "playing"
                    ? `${currentTurn === playerSymbol ? "Your" : "Computer's"} turn`
                    : gameStatus === "won"
                      ? "You won the game!"
                      : gameStatus === "lost"
                        ? "Computer won the game"
                        : "The game ended in a draw"}
              </CardDescription>
            </CardHeader>
            <CardContent className="flex justify-center">
              {gameStatus !== "waiting" && (
                <div className="text-center">
                  <div className="text-2xl font-bold mb-2">{currentTurn}&apos;s Turn</div>
                  {gameStatus !== "playing" && (
                    <Button onClick={handlePlayAgain} className="mt-4">
                      <RotateCcw className="mr-2 h-4 w-4" />
                      Play Again
                    </Button>
                  )}
                </div>
              )}
            </CardContent>
          </Card>

          <PlayerInfo
            name="Computer"
            symbol={playerSymbol === "X" ? "O" : "X"}
            isCurrentTurn={gameStatus === "playing" && currentTurn !== playerSymbol}
            isOpponent
          />
        </div>

        <Card className="w-full max-w-xs mx-auto">
          <CardContent className="p-4 flex justify-center">
            <div>
              <Board />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

