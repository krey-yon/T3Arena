import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"

export default function Dashboard() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col items-center justify-center space-y-8">
        <h1 className="text-4xl font-bold text-center">Tic Tac Toe</h1>
        <p className="text-muted-foreground text-center max-w-md">
          Challenge your friends to a game of Tic Tac Toe. Connect with other players and show off your strategic
          skills!
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-4xl">
          <Card>
            <CardHeader>
              <CardTitle>Play Online</CardTitle>
              <CardDescription>Find opponents and play in real-time</CardDescription>
            </CardHeader>
            <CardContent className="flex items-center justify-center py-6">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/image/icons8-online-game-100.png" alt="Online play" className="h-24 w-24" />
            </CardContent>
            <CardFooter>
              <Link href="/waiting-room" className="w-full">
                <Button className="w-full">Enter Waiting Room</Button>
              </Link>
            </CardFooter>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Practice Mode</CardTitle>
              <CardDescription>Play against the computer to improve your skills</CardDescription>
            </CardHeader>
            <CardContent className="flex items-center justify-center py-6">
               {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/image/icons8-game-controller-100.png" alt="Practice mode" className="h-24 w-24" />
            </CardContent>
            <CardFooter>
              <Link href="/practice" className="w-full">
                <Button variant="outline" className="w-full">
                  Practice Now
                </Button>
              </Link>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  )
}