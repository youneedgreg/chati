"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ArrowLeft, Save, Plus } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"

type MoodEntry = {
  id: string
  date: string
  mood: number
  note: string
}

const MOODS = [
  { value: 1, label: "Very Low", color: "bg-red-500" },
  { value: 2, label: "Low", color: "bg-orange-500" },
  { value: 3, label: "Neutral", color: "bg-yellow-500" },
  { value: 4, label: "Good", color: "bg-green-400" },
  { value: 5, label: "Excellent", color: "bg-green-600" },
]

export default function MoodTrackerPage() {
  const [entries, setEntries] = useState<MoodEntry[]>([])
  const [open, setOpen] = useState(false)
  const [newEntry, setNewEntry] = useState<Omit<MoodEntry, "id">>({
    date: new Date().toISOString().split("T")[0],
    mood: 3,
    note: "",
  })

  useEffect(() => {
    const savedEntries = localStorage.getItem("moodEntries")
    if (savedEntries) {
      setEntries(JSON.parse(savedEntries))
    }
  }, [])

  const saveEntry = () => {
    const updatedEntries = [
      ...entries,
      {
        ...newEntry,
        id: Date.now().toString(),
      },
    ]
    setEntries(updatedEntries)
    localStorage.setItem("moodEntries", JSON.stringify(updatedEntries))
    setNewEntry({
      date: new Date().toISOString().split("T")[0],
      mood: 3,
      note: "",
    })
    setOpen(false)
  }

  const getLastWeekEntries = () => {
    const today = new Date()
    const lastWeek = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000)
    return entries.filter((entry) => new Date(entry.date) >= lastWeek)
  }

  const getAverageMood = (entries: MoodEntry[]) => {
    if (entries.length === 0) return 0
    const sum = entries.reduce((acc, entry) => acc + entry.mood, 0)
    return Math.round((sum / entries.length) * 10) / 10
  }

  const lastWeekEntries = getLastWeekEntries()
  const averageMood = getAverageMood(lastWeekEntries)

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

        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-primary">Mood Tracker</h1>
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button className="flex items-center gap-2">
                <Plus className="h-4 w-4" />
                Add Mood
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Record Your Mood</DialogTitle>
                <DialogDescription>
                  How are you feeling today? Track your mood to gain insights over time.
                </DialogDescription>
              </DialogHeader>

              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="date">Date</Label>
                  <input
                    type="date"
                    id="date"
                    value={newEntry.date}
                    onChange={(e) => setNewEntry({ ...newEntry, date: e.target.value })}
                    className="w-full p-2 rounded-md border"
                  />
                </div>

                <div className="space-y-2">
                  <Label>How are you feeling?</Label>
                  <RadioGroup
                    value={newEntry.mood.toString()}
                    onValueChange={(value) => setNewEntry({ ...newEntry, mood: Number.parseInt(value) })}
                    className="flex justify-between"
                  >
                    {MOODS.map((mood) => (
                      <div key={mood.value} className="flex flex-col items-center gap-1">
                        <RadioGroupItem
                          value={mood.value.toString()}
                          id={`mood-${mood.value}`}
                          className={`h-8 w-8 ${mood.color} border-0`}
                        />
                        <Label htmlFor={`mood-${mood.value}`} className="text-xs">
                          {mood.label}
                        </Label>
                      </div>
                    ))}
                  </RadioGroup>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="note">Notes (optional)</Label>
                  <Textarea
                    id="note"
                    placeholder="What's contributing to your mood today?"
                    value={newEntry.note}
                    onChange={(e) => setNewEntry({ ...newEntry, note: e.target.value })}
                  />
                </div>
              </div>

              <DialogFooter>
                <Button onClick={saveEntry} className="flex items-center gap-2">
                  <Save className="h-4 w-4" />
                  Save Entry
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>

        <Tabs defaultValue="overview">
          <TabsList className="mb-6">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="history">History</TabsTrigger>
          </TabsList>

          <TabsContent value="overview">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Weekly Summary</CardTitle>
                  <CardDescription>Your mood over the past 7 days</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-48 flex items-end justify-between gap-2">
                    {lastWeekEntries.length > 0 ? (
                      lastWeekEntries.map((entry) => (
                        <div key={entry.id} className="flex flex-col items-center gap-1 flex-1">
                          <div
                            className={`w-full ${MOODS.find((m) => m.value === entry.mood)?.color} rounded-t-md`}
                            style={{ height: `${entry.mood * 20}%` }}
                          ></div>
                          <span className="text-xs">
                            {new Date(entry.date).toLocaleDateString("en-US", { weekday: "short" })}
                          </span>
                        </div>
                      ))
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                        No mood data for the past week
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Mood Insights</CardTitle>
                  <CardDescription>Understanding your emotional patterns</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-sm font-medium mb-2">Average Mood (Last 7 Days)</h3>
                      <div className="flex items-center gap-4">
                        <div className="h-16 w-16 rounded-full bg-primary flex items-center justify-center text-primary-foreground text-xl font-bold">
                          {averageMood || "-"}
                        </div>
                        <div>
                          {averageMood ? (
                            <p className="text-sm text-muted-foreground">
                              {averageMood >= 4
                                ? "You've been feeling quite positive lately!"
                                : averageMood >= 3
                                  ? "You've been feeling balanced overall."
                                  : "You've been experiencing some challenges lately."}
                            </p>
                          ) : (
                            <p className="text-sm text-muted-foreground">Add mood entries to see insights</p>
                          )}
                        </div>
                      </div>
                    </div>

                    <div>
                      <h3 className="text-sm font-medium mb-2">Total Entries</h3>
                      <p className="text-3xl font-bold">{entries.length}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="history">
            <Card>
              <CardHeader>
                <CardTitle>Mood History</CardTitle>
                <CardDescription>All your recorded moods</CardDescription>
              </CardHeader>
              <CardContent>
                {entries.length > 0 ? (
                  <div className="space-y-4">
                    {[...entries].reverse().map((entry) => (
                      <div key={entry.id} className="border rounded-lg p-4">
                        <div className="flex justify-between items-center mb-2">
                          <div className="font-medium">
                            {new Date(entry.date).toLocaleDateString("en-US", {
                              weekday: "long",
                              year: "numeric",
                              month: "long",
                              day: "numeric",
                            })}
                          </div>
                          <div
                            className={`px-3 py-1 rounded-full text-white text-sm ${MOODS.find((m) => m.value === entry.mood)?.color}`}
                          >
                            {MOODS.find((m) => m.value === entry.mood)?.label}
                          </div>
                        </div>
                        {entry.note && <p className="text-muted-foreground text-sm">{entry.note}</p>}
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12 text-muted-foreground">
                    <p>No mood entries yet. Start tracking your mood to see your history.</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}

