"use client"

import { useState, useEffect, useRef } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ArrowLeft, Save, Plus, Calendar, BarChart2, History, Sparkles } from "lucide-react"
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
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"

type MoodEntry = {
  id: string
  date: string
  mood: number
  note: string
}

const MOODS = [
  { value: 1, label: "Very Low", color: "bg-red-500", emoji: "😔" },
  { value: 2, label: "Low", color: "bg-orange-500", emoji: "😕" },
  { value: 3, label: "Neutral", color: "bg-yellow-500", emoji: "😐" },
  { value: 4, label: "Good", color: "bg-green-400", emoji: "🙂" },
  { value: 5, label: "Excellent", color: "bg-green-600", emoji: "😁" },
]

const SUGGESTIONS = [
  "I went for a walk in nature today",
  "I practiced meditation for 10 minutes",
  "I connected with a friend",
  "I got enough sleep last night",
  "I exercised today",
  "I ate healthy meals today"
]

export default function MoodTrackerPage() {
  const [entries, setEntries] = useState<MoodEntry[]>([])
  const [open, setOpen] = useState(false)
  const [newEntry, setNewEntry] = useState<Omit<MoodEntry, "id">>({
    date: new Date().toISOString().split("T")[0],
    mood: 3,
    note: "",
  })
  const [activeTab, setActiveTab] = useState("overview")
  const [moodTip, setMoodTip] = useState("")
  const latestEntriesRef = useRef<HTMLDivElement>(null)

  const moodTips = [
    "Try some deep breathing exercises if you're feeling stressed.",
    "Remember that it's okay to ask for help when you need it.",
    "Consider taking a short walk to boost your mood.",
    "Talking to someone you trust can often help improve your mood.",
    "Small acts of self-care can make a big difference in how you feel.",
    "Remember that moods are temporary and will change with time."
  ]

  useEffect(() => {
    // Random mood tip
    const randomIndex = Math.floor(Math.random() * moodTips.length)
    setMoodTip(moodTips[randomIndex])

    // Load saved entries
    const savedEntries = localStorage.getItem("moodEntries")
    if (savedEntries) {
      setEntries(JSON.parse(savedEntries))
    }
  }, [])

  useEffect(() => {
    if (activeTab === "history" && entries.length > 0) {
      latestEntriesRef.current?.scrollIntoView({ behavior: "smooth" })
    }
  }, [activeTab, entries.length])

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

  const addSuggestionToNote = (suggestion: string) => {
    setNewEntry({
      ...newEntry,
      note: newEntry.note ? `${newEntry.note}\n• ${suggestion}` : `• ${suggestion}`
    })
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

  const getMoodTrend = () => {
    if (entries.length < 2) return "neutral"
    
    const sortedEntries = [...entries].sort((a, b) => 
      new Date(a.date).getTime() - new Date(b.date).getTime()
    )
    
    const recentEntries = sortedEntries.slice(Math.max(sortedEntries.length - 5, 0))
    const firstMood = recentEntries[0].mood
    const lastMood = recentEntries[recentEntries.length - 1].mood
    
    if (lastMood > firstMood) return "improving"
    if (lastMood < firstMood) return "declining"
    return "stable"
  }

  const lastWeekEntries = getLastWeekEntries()
  const averageMood = getAverageMood(lastWeekEntries)
  const moodTrend = getMoodTrend()

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
              <Button className="flex items-center gap-2 rounded-full px-4 py-2 shadow-md">
                <Plus className="h-4 w-4" />
                Record Mood
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px] p-0 overflow-hidden rounded-2xl">
              <DialogHeader className="p-6 pb-2 bg-gradient-to-r from-blue-50 to-green-50">
                <DialogTitle className="text-xl">How are you feeling today?</DialogTitle>
                <DialogDescription>
                  Track your mood to gain insights and spot patterns over time.
                </DialogDescription>
              </DialogHeader>

              <div className="px-6 space-y-6 py-4 bg-gradient-to-r from-blue-50 to-green-50 rounded-lg shadow">

                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <Label htmlFor="date" className="font-medium">Date</Label>
                  </div>
                  <input
                    type="date"
                    id="date"
                    value={newEntry.date}
                    onChange={(e) => setNewEntry({ ...newEntry, date: e.target.value })}
                    className="w-full p-3 rounded-lg border border-gray-200 focus:border-primary/30 focus:ring-2 focus:ring-primary/20"
                  />
                </div>

                <div className="space-y-3">
                  <Label className="font-medium flex items-center gap-2">
                    <Sparkles className="h-4 w-4 text-muted-foreground" />
                    Mood Level
                  </Label>
                  <RadioGroup
                    value={newEntry.mood.toString()}
                    onValueChange={(value) => setNewEntry({ ...newEntry, mood: Number.parseInt(value) })}
                    className="flex justify-between"
                  >
                    {MOODS.map((mood) => (
                      <div key={mood.value} className="flex flex-col items-center gap-2">
                        <RadioGroupItem
                          value={mood.value.toString()}
                          id={`mood-${mood.value}`}
                          className={`h-12 w-12 ${mood.color} border-0 transition-all hover:scale-110 data-[state=checked]:ring-4 data-[state=checked]:ring-primary/30`}
                        />
                        <div className="flex flex-col items-center">
                          <span className="text-xl">{mood.emoji}</span>
                          <Label htmlFor={`mood-${mood.value}`} className="text-xs font-medium">
                            {mood.label}
                          </Label>
                        </div>
                      </div>
                    ))}
                  </RadioGroup>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="note" className="font-medium flex items-center gap-2">
                    <BarChart2 className="h-4 w-4 text-muted-foreground" />
                    What&apos;s affecting your mood? (optional)
                  </Label>
                  <Textarea
                    id="note"
                    placeholder="Add notes about factors influencing your mood today..."
                    value={newEntry.note}
                    onChange={(e) => setNewEntry({ ...newEntry, note: e.target.value })}
                    className="min-h-[100px] rounded-lg border-gray-200 focus:border-primary/30 focus:ring-2 focus:ring-primary/20"
                  />
                </div>

                <div className="space-y-2">
                  <Label className="text-sm font-medium text-muted-foreground">Quick Add</Label>
                  <div className="flex flex-wrap gap-2">
                    {SUGGESTIONS.map((suggestion, index) => (
                      <Badge 
                        key={index} 
                        variant="outline" 
                        className="cursor-pointer hover:bg-primary/10 transition-colors py-2"
                        onClick={() => addSuggestionToNote(suggestion)}
                      >
                        {suggestion}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>

              <DialogFooter className="p-4 bg-gray-50 border-t">
                <Button variant="outline" onClick={() => setOpen(false)} className="rounded-full">
                  Cancel
                </Button>
                <Button onClick={saveEntry} className="flex items-center gap-2 rounded-full">
                  <Save className="h-4 w-4" />
                  Save Entry
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>

        {lastWeekEntries.length === 0 && (
          <Card className="mb-6 border border-blue-100 bg-blue-50/50">
            <CardContent className="p-4 flex gap-4 items-center">
              <div className="bg-blue-100 rounded-full p-3">
                <Sparkles className="h-5 w-5 text-blue-500" />
              </div>
              <div>
                <h3 className="font-medium text-blue-700">Tip of the day</h3>
                <p className="text-blue-600 text-sm">{moodTip}</p>
              </div>
            </CardContent>
          </Card>
        )}

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="mb-6 p-1 bg-white/80 backdrop-blur-sm sticky top-4 z-10 shadow-sm">
            <TabsTrigger value="overview" className="flex items-center gap-2 px-4 py-2 data-[state=active]:shadow-md">
              <BarChart2 className="h-4 w-4" />
              Overview
            </TabsTrigger>
            <TabsTrigger value="history" className="flex items-center gap-2 px-4 py-2 data-[state=active]:shadow-md">
              <History className="h-4 w-4" />
              History
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card className="shadow-md hover:shadow-lg transition-shadow border-transparent">
                <CardHeader className="bg-gradient-to-r from-blue-50 to-green-50 border-b pb-3">
                  <CardTitle>Weekly Mood Chart</CardTitle>
                  <CardDescription>Your mood over the past 7 days</CardDescription>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="h-48 flex items-end justify-between gap-2">
                    {lastWeekEntries.length > 0 ? (
                      lastWeekEntries.map((entry) => {
                        const mood = MOODS.find((m) => m.value === entry.mood);
                        return (
                          <div key={entry.id} className="flex flex-col items-center gap-1 flex-1">
                            <div
                              className={`w-full ${mood?.color} rounded-t-md shadow-md transition-all hover:shadow-lg relative group`}
                              style={{ height: `${entry.mood * 20}%` }}
                            >
                              <div className="absolute top-0 left-0 right-0 opacity-0 group-hover:opacity-100 transition-opacity -translate-y-full bg-white p-2 rounded shadow-md text-xs pointer-events-none">
                                {entry.note ? entry.note.substring(0, 40) + (entry.note.length > 40 ? '...' : '') : 'No notes'}
                              </div>
                            </div>
                            <div className="flex flex-col items-center">
                              <span className="text-lg">{mood?.emoji}</span>
                              <span className="text-xs font-medium">
                                {new Date(entry.date).toLocaleDateString("en-US", { weekday: "short" })}
                              </span>
                            </div>
                          </div>
                        );
                      })
                    ) : (
                      <div className="w-full h-full flex flex-col items-center justify-center text-muted-foreground gap-2">
                        <div className="bg-gray-100 rounded-full p-4">
                          <Calendar className="h-8 w-8 text-gray-400" />
                        </div>
                        <p>No mood data for the past week</p>
                        <Button 
                          variant="outline" 
                          className="mt-2" 
                          onClick={() => setOpen(true)}
                        >
                          Record your first mood
                        </Button>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>

              <Card className="shadow-md hover:shadow-lg transition-shadow border-transparent">
                <CardHeader className="bg-gradient-to-r from-blue-50 to-green-50 border-b pb-3">
                  <CardTitle>Mood Insights</CardTitle>
                  <CardDescription>Understanding your emotional patterns</CardDescription>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-sm font-medium mb-2">Average Mood (Last 7 Days)</h3>
                      <div className="flex items-center gap-4">
                        <div className="h-20 w-20 rounded-full bg-primary flex items-center justify-center text-primary-foreground text-2xl font-bold shadow-md">
                          {averageMood ? averageMood : "-"}
                        </div>
                        <div>
                          {averageMood ? (
                            <div className="space-y-1">
                              <p className="text-sm font-medium">
                                {averageMood >= 4 
                                  ? "You've been feeling quite positive!" 
                                  : averageMood >= 3 
                                    ? "You've been feeling balanced overall." 
                                    : "You've been experiencing some challenges."}
                              </p>
                              <p className="text-xs text-muted-foreground">
                                Your mood has been {moodTrend === "improving" 
                                  ? "improving recently" 
                                  : moodTrend === "declining" 
                                    ? "declining recently" 
                                    : "relatively stable"}
                              </p>
                            </div>
                          ) : (
                            <p className="text-sm text-muted-foreground">Add mood entries to see insights</p>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="border-t pt-4">
                      <h3 className="text-sm font-medium mb-3">Mood Statistics</h3>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="bg-gray-50 p-4 rounded-lg">
                          <div className="text-muted-foreground text-xs mb-1">Total Entries</div>
                          <p className="text-2xl font-bold">{entries.length}</p>
                        </div>
                        <div className="bg-gray-50 p-4 rounded-lg">
                          <div className="text-muted-foreground text-xs mb-1">Tracking Since</div>
                          <p className="text-sm font-medium">
                            {entries.length > 0 
                              ? new Date(
                                  Math.min(...entries.map(e => new Date(e.date).getTime()))
                                ).toLocaleDateString("en-US", { month: "short", day: "numeric" })
                              : "Not started"}
                          </p>
                        </div>
                      </div>
                    </div>

                    {entries.length > 0 && (
                      <div className="border-t pt-4">
                        <h3 className="text-sm font-medium mb-2">Latest Mood</h3>
                        <div className="bg-gray-50 p-4 rounded-lg">
                          <div className="flex justify-between items-center mb-2">
                            <div className="font-medium text-sm">
                              {new Date(entries[entries.length - 1].date).toLocaleDateString("en-US", {
                                month: "short",
                                day: "numeric", 
                                year: "numeric"
                              })}
                            </div>
                            <Badge
                              className={`${MOODS.find(m => m.value === entries[entries.length - 1].mood)?.color} text-white`}
                            >
                              {MOODS.find(m => m.value === entries[entries.length - 1].mood)?.label}
                            </Badge>
                          </div>
                          {entries[entries.length - 1].note && (
                            <p className="text-muted-foreground text-xs mt-2 italic">
                              &quot;{entries[entries.length - 1].note.substring(0, 120)}
                              {entries[entries.length - 1].note.length > 120 ? '...' : ''}&quot;
                            </p>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="history">
            <Card className="shadow-md border-transparent">
              <CardHeader className="bg-gradient-to-r from-blue-50 to-green-50 border-b pb-3">
                <div className="flex justify-between items-center">
                  <div>
                    <CardTitle>Your Mood Journal</CardTitle>
                    <CardDescription>All your recorded moods and notes</CardDescription>
                  </div>
                  {entries.length > 0 && (
                    <Badge variant="outline" className="ml-2">
                      {entries.length} {entries.length === 1 ? 'entry' : 'entries'}
                    </Badge>
                  )}
                </div>
              </CardHeader>
              <CardContent className="p-0">
                <div ref={latestEntriesRef} className="sr-only">Latest entries marker</div>
                {entries.length > 0 ? (
                  <div className="divide-y">
                    {[...entries].reverse().map((entry) => {
                      const mood = MOODS.find((m) => m.value === entry.mood);
                      return (
                        <div key={entry.id} className="p-5 hover:bg-gray-50 transition-colors">
                          <div className="flex items-start gap-4">
                            <Avatar className={`${mood?.color} h-12 w-12 rounded-full border-4 border-white shadow-md flex-shrink-0`}>
                              <AvatarFallback className="text-xl text-white">{mood?.emoji}</AvatarFallback>
                            </Avatar>
                            
                            <div className="flex-1 space-y-2">
                              <div className="flex justify-between items-center">
                                <div className="font-semibold">
                                  {new Date(entry.date).toLocaleDateString("en-US", {
                                    weekday: "long",
                                    year: "numeric",
                                    month: "long",
                                    day: "numeric",
                                  })}
                                </div>
                                <Badge
                                  className={`${mood?.color} text-white shadow-sm`}
                                >
                                  {mood?.label}
                                </Badge>
                              </div>
                              
                              {entry.note ? (
                                <div className="text-gray-600 text-sm bg-gray-50 p-3 rounded-lg border border-gray-100">
                                  {entry.note.split('\n').map((line, i) => (
                                    <p key={i} className="mb-1 last:mb-0">{line}</p>
                                  ))}
                                </div>
                              ) : (
                                <p className="text-xs text-muted-foreground italic">No notes for this entry</p>
                              )}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center py-16 px-4">
                    <div className="bg-gray-100 rounded-full p-5 mb-4">
                      <Calendar className="h-10 w-10 text-gray-400" />
                    </div>
                    <h3 className="text-lg font-medium mb-2">No mood entries yet</h3>
                    <p className="text-muted-foreground text-center mb-6 max-w-md">
                      Start tracking your mood to build a journal of your emotional journey and gain valuable insights.
                    </p>
                    <Button
                      onClick={() => setOpen(true)}
                      className="flex items-center gap-2 rounded-full"
                    >
                      <Plus className="h-4 w-4" />
                      Record Your First Mood
                    </Button>
                  </div>
                )}
              </CardContent>
              {entries.length > 5 && (
                <CardFooter className="p-4 bg-gray-50 border-t flex justify-center">
                  <Button variant="outline" size="sm" className="text-xs" onClick={() => latestEntriesRef.current?.scrollIntoView({ behavior: "smooth" })}>
                    Scroll to Latest Entries
                  </Button>
                </CardFooter>
              )}
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}