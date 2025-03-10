import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowRight, MessageCircle, BarChart2, BookOpen, Gamepad2 } from "lucide-react"
import Image from "next/image"

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-green-50">
      <div className="container mx-auto px-4 py-12">
        <header className="text-center mb-12">
          <h1 className="text-4xl font-bold text-primary mb-3">CHATI</h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            A compassionate AI-powered companion to support your mental wellbeing journey
          </p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          <Card className="shadow-md hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MessageCircle className="h-5 w-5 text-primary" />
                <span>Talk to CHATI</span>
              </CardTitle>
              <CardDescription>
                Have empathetic conversations with an AI companion that listens and understands
              </CardDescription>
            </CardHeader>
            <CardContent>
            <Image
            src="/chatichat.png"
            alt="Chat Interface"
            width={400}
            height={200}
            className="rounded-md w-full h-48 object-cover mb-4"
            />
              <p className="text-muted-foreground">
                Express your thoughts and feelings in a safe, judgment-free space. Our AI is designed to provide
                compassionate support.
              </p>
            </CardContent>
            <CardFooter>
              <Link href="/chat" className="w-full">
                <Button className="w-full">
                  Start Chatting <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </CardFooter>
          </Card>

          <Card className="shadow-md hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart2 className="h-5 w-5 text-primary" />
                <span>Mood Tracking</span>
              </CardTitle>
              <CardDescription>
                Track your emotional patterns and gain insights into your mental wellbeing
              </CardDescription>
            </CardHeader>
            <CardContent>
              <img
                src="/placeholder.svg?height=200&width=400"
                alt="Illustration of mood tracking charts"
                className="rounded-md w-full h-48 object-cover mb-4"
              />
              <p className="text-muted-foreground">
                Record your daily moods and visualize patterns over time to better understand your emotional health.
              </p>
            </CardContent>
            <CardFooter>
              <Link href="/mood-tracker" className="w-full">
                <Button className="w-full">
                  Track Mood <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </CardFooter>
          </Card>

          <Card className="shadow-md hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BookOpen className="h-5 w-5 text-primary" />
                <span>Journal</span>
              </CardTitle>
              <CardDescription>Express yourself through guided journaling prompts</CardDescription>
            </CardHeader>
            <CardContent>
              <img
                src="/placeholder.svg?height=200&width=400"
                alt="Illustration of a journal"
                className="rounded-md w-full h-48 object-cover mb-4"
              />
              <p className="text-muted-foreground">
                Write about your experiences, thoughts, and feelings with helpful prompts to guide your reflection.
              </p>
            </CardContent>
            <CardFooter>
              <Link href="/journal" className="w-full">
                <Button className="w-full">
                  Open Journal <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </CardFooter>
          </Card>

          <Card className="shadow-md hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Gamepad2 className="h-5 w-5 text-primary" />
                <span>Games Corner</span>
              </CardTitle>
              <CardDescription>
                Engage with interactive activities designed to help during moments of distress
              </CardDescription>
            </CardHeader>
            <CardContent>
              <img
                src="/placeholder.svg?height=200&width=400"
                alt="Illustration of games and activities"
                className="rounded-md w-full h-48 object-cover mb-4"
              />
              <p className="text-muted-foreground">
                Play simple games and activities that can help redirect your focus and provide comfort during difficult
                moments.
              </p>
            </CardContent>
            <CardFooter>
              <Link href="/games" className="w-full">
                <Button className="w-full">
                  Play Games <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  )
}

