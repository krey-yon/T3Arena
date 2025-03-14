import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

interface PlayerInfoProps {
  name: string
  symbol: "X" | "O"
  isCurrentTurn: boolean
  isOpponent?: boolean
}

export function PlayerInfo({ name, symbol, isCurrentTurn, isOpponent = false }: PlayerInfoProps) {
  return (
    <Card className={`${isCurrentTurn ? "border-primary" : ""}`}>
      <CardHeader className="pb-2">
        <CardTitle className="text-center">{name}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col items-center space-y-2">
          <Avatar className="h-16 w-16">
            <AvatarImage src={isOpponent ? "    /image/robot-avatar-circle-icon.jpg" : undefined} />
            <AvatarFallback className="text-xl">{name.substring(0, 2).toUpperCase()}</AvatarFallback>
          </Avatar>

          <div className="flex items-center space-x-2">
            <div className={`text-2xl font-bold ${isCurrentTurn ? "text-primary" : ""}`}>{symbol}</div>
            {isCurrentTurn && <div className="text-sm text-primary font-medium">Current Turn</div>}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

