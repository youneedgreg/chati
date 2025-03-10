"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ArrowLeft, RefreshCw, Pause, Play } from "lucide-react"
import { Slider } from "@/components/ui/slider"

export default function GamesPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-green-50">
      <div className="container mx-auto px-4 py-6 max-w-4xl">
        <div className="mb-4">
          <Link href="/">
            <Button variant="ghost" className="flex items-center gap-2">
              <ArrowLeft className="h-4 w-4" />
              Back to Home
            </Button>
          </Link>
        </div>

        <h1 className="text-3xl font-bold text-primary mb-6">Games Corner</h1>

        <Tabs defaultValue="breathing">
          <TabsList className="mb-6">
            <TabsTrigger value="breathing">Breathing Exercise</TabsTrigger>
            <TabsTrigger value="coloring">Coloring</TabsTrigger>
            <TabsTrigger value="memory">Memory Game</TabsTrigger>
          </TabsList>

          <TabsContent value="breathing">
            <BreathingExercise />
          </TabsContent>

          <TabsContent value="coloring">
            <ColoringGame />
          </TabsContent>

          <TabsContent value="memory">
            <MemoryGame />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}

function BreathingExercise() {
  const [isActive, setIsActive] = useState(false)
  const [breathingRate, setBreathingRate] = useState(4) // in seconds

  return (
    <Card>
      <CardHeader>
        <CardTitle>Breathing Exercise</CardTitle>
        <CardDescription>A simple breathing exercise to help you relax and reduce anxiety</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col items-center">
        <div className="mb-8 relative">
          <div
            className={`h-64 w-64 rounded-full bg-primary/20 flex items-center justify-center transition-all duration-1000 ease-in-out ${isActive ? "scale-110" : "scale-100"}`}
            style={{
              animation: isActive ? `breathe ${breathingRate * 2}s infinite alternate ease-in-out` : "none",
            }}
          >
            <div className="text-center">
              <p className="text-lg font-medium text-primary">
                {isActive ? (breathingRate % 2 === 0 ? "Breathe in..." : "Breathe out...") : "Ready?"}
              </p>
            </div>
          </div>
        </div>

        <div className="w-full max-w-md space-y-6">
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-sm">Breathing Rate</span>
              <span className="text-sm">{breathingRate} seconds</span>
            </div>
            <Slider
              value={[breathingRate]}
              min={2}
              max={8}
              step={1}
              onValueChange={(value) => setBreathingRate(value[0])}
              disabled={isActive}
            />
          </div>

          <Button onClick={() => setIsActive(!isActive)} className="w-full" variant={isActive ? "outline" : "default"}>
            {isActive ? (
              <>
                <Pause className="mr-2 h-4 w-4" /> Pause
              </>
            ) : (
              <>
                <Play className="mr-2 h-4 w-4" /> Start
              </>
            )}
          </Button>
        </div>
      </CardContent>
      <CardFooter className="flex-col text-sm text-muted-foreground">
        <p>Breathing exercises can help activate your parasympathetic nervous system, which controls relaxation.</p>
      </CardFooter>

      <style jsx global>{`
        @keyframes breathe {
          0% {
            transform: scale(1);
            background-color: rgba(var(--primary), 0.2);
          }
          50% {
            transform: scale(1.3);
            background-color: rgba(var(--primary), 0.3);
          }
          100% {
            transform: scale(1);
            background-color: rgba(var(--primary), 0.2);
          }
        }
      `}</style>
    </Card>
  )
}

function ColoringGame() {
  const [selectedColor, setSelectedColor] = useState("#4f46e5")
  const [pixels, setPixels] = useState(Array(400).fill("#ffffff"))

  const colors = [
    "#ef4444", // red
    "#f97316", // orange
    "#eab308", // yellow
    "#22c55e", // green
    "#06b6d4", // cyan
    "#3b82f6", // blue
    "#8b5cf6", // purple
    "#ec4899", // pink
    "#000000", // black
    "#ffffff", // white
  ]

  const handlePixelClick = (index: number) => {
    const newPixels = [...pixels]
    newPixels[index] = selectedColor
    setPixels(newPixels)
  }

  const resetCanvas = () => {
    setPixels(Array(400).fill("#ffffff"))
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Coloring Game</CardTitle>
        <CardDescription>Express yourself through colors and create pixel art</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col items-center space-y-6">
          <div className="flex flex-wrap gap-2 mb-4">
            {colors.map((color) => (
              <button
                key={color}
                className={`h-8 w-8 rounded-full border-2 ${selectedColor === color ? "border-gray-900" : "border-gray-200"}`}
                style={{ backgroundColor: color }}
                onClick={() => setSelectedColor(color)}
                aria-label={`Select ${color} color`}
              />
            ))}
          </div>

          <div className="border border-gray-200 rounded-md overflow-hidden">
            <div className="grid grid-cols-20 gap-0" style={{ gridTemplateColumns: "repeat(20, 1fr)" }}>
              {pixels.map((color, index) => (
                <div
                  key={index}
                  className="aspect-square cursor-pointer hover:opacity-80 transition-opacity"
                  style={{ backgroundColor: color }}
                  onClick={() => handlePixelClick(index)}
                />
              ))}
            </div>
          </div>

          <Button variant="outline" onClick={resetCanvas} className="flex items-center gap-2">
            <RefreshCw className="h-4 w-4" />
            Reset Canvas
          </Button>
        </div>
      </CardContent>
      <CardFooter className="flex-col text-sm text-muted-foreground">
        <p>Coloring can be a meditative activity that helps reduce stress and anxiety.</p>
      </CardFooter>
    </Card>
  )
}

function MemoryGame() {
  const [cards, setCards] = useState(() => {
    const emojis = ["🌟", "🌈", "🌺", "🌻", "🦋", "🐢", "🐬", "🦜"]
    const allEmojis = [...emojis, ...emojis]
    return allEmojis.sort(() => Math.random() - 0.5).map((emoji) => ({ emoji, isFlipped: false, isMatched: false }))
  })

  const [flippedIndices, setFlippedIndices] = useState<number[]>([])
  const [moves, setMoves] = useState(0)
  const [isChecking, setIsChecking] = useState(false)

  const handleCardClick = (index: number) => {
    // Prevent clicking if already checking a pair or clicking a matched/flipped card
    if (isChecking || cards[index].isMatched || cards[index].isFlipped || flippedIndices.length === 2) {
      return
    }

    // Flip the card
    const newCards = [...cards]
    newCards[index].isFlipped = true
    setCards(newCards)

    // Add to flipped indices
    const newFlippedIndices = [...flippedIndices, index]
    setFlippedIndices(newFlippedIndices)

    // If we have 2 flipped cards, check for a match
    if (newFlippedIndices.length === 2) {
      setMoves(moves + 1)
      setIsChecking(true)

      setTimeout(() => {
        const [firstIndex, secondIndex] = newFlippedIndices
        const updatedCards = [...newCards]

        if (updatedCards[firstIndex].emoji === updatedCards[secondIndex].emoji) {
          // Match found
          updatedCards[firstIndex].isMatched = true
          updatedCards[secondIndex].isMatched = true
        } else {
          // No match
          updatedCards[firstIndex].isFlipped = false
          updatedCards[secondIndex].isFlipped = false
        }

        setCards(updatedCards)
        setFlippedIndices([])
        setIsChecking(false)
      }, 1000)
    }
  }

  const resetGame = () => {
    const emojis = ["🌟", "🌈", "🌺", "🌻", "🦋", "🐢", "🐬", "🦜"]
    const allEmojis = [...emojis, ...emojis]
    setCards(allEmojis.sort(() => Math.random() - 0.5).map((emoji) => ({ emoji, isFlipped: false, isMatched: false })))
    setFlippedIndices([])
    setMoves(0)
    setIsChecking(false)
  }

  const allMatched = cards.every((card) => card.isMatched)

  return (
    <Card>
      <CardHeader>
        <CardTitle>Memory Game</CardTitle>
        <CardDescription>Find matching pairs to improve focus and memory</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col items-center space-y-6">
          <div className="flex justify-between w-full max-w-md">
            <div className="text-sm">
              Moves: <span className="font-bold">{moves}</span>
            </div>
            <Button variant="outline" size="sm" onClick={resetGame} className="flex items-center gap-1">
              <RefreshCw className="h-3 w-3" />
              Reset
            </Button>
          </div>

          <div className="grid grid-cols-4 gap-2">
            {cards.map((card, index) => (
              <div
                key={index}
                className={`h-16 w-16 flex items-center justify-center rounded-md cursor-pointer transition-all duration-300 ${
                  card.isFlipped || card.isMatched ? "bg-primary text-primary-foreground rotate-y-180" : "bg-muted"
                }`}
                onClick={() => handleCardClick(index)}
              >
                <span className="text-2xl">{card.isFlipped || card.isMatched ? card.emoji : ""}</span>
              </div>
            ))}
          </div>

          {allMatched && (
            <div className="bg-green-100 text-green-800 p-3 rounded-md text-center">
              <p className="font-bold">Congratulations! 🎉</p>
              <p className="text-sm">You completed the game in {moves} moves.</p>
            </div>
          )}
        </div>
      </CardContent>
      <CardFooter className="flex-col text-sm text-muted-foreground">
        <p>Memory games can help improve concentration and provide a healthy distraction from stress.</p>
      </CardFooter>

      <style jsx global>{`
        .rotate-y-180 {
          transform: rotateY(180deg);
        }
      `}</style>
    </Card>
  )
}

