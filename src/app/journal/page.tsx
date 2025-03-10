"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowLeft, Save, Plus, Calendar, Edit, Trash2 } from "lucide-react"
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
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"

type JournalEntry = {
  id: string
  date: string
  title: string
  content: string
  prompt?: string
}

const JOURNAL_PROMPTS = [
  "What are three things you're grateful for today?",
  "What's something that challenged you today, and how did you handle it?",
  "What's one small win you had today?",
  "What's something you're looking forward to?",
  "What's one thing you could have done better today?",
  "What made you smile today?",
  "What's something you learned recently?",
  "What's a goal you're working towards right now?",
  "What's something that's been on your mind lately?",
  "What's a self-care activity you could do today?",
]

export default function JournalPage() {
  const [entries, setEntries] = useState<JournalEntry[]>([])
  const [open, setOpen] = useState(false)
  const [selectedPrompt, setSelectedPrompt] = useState("")
  const [currentEntry, setCurrentEntry] = useState<JournalEntry>({
    id: "",
    date: new Date().toISOString().split("T")[0],
    title: "",
    content: "",
  })
  const [editMode, setEditMode] = useState(false)
  const [selectedEntry, setSelectedEntry] = useState<JournalEntry | null>(null)

  useEffect(() => {
    const savedEntries = localStorage.getItem("journalEntries")
    if (savedEntries) {
      setEntries(JSON.parse(savedEntries))
    }
  }, [])

  const saveEntry = () => {
    let updatedEntries

    if (editMode) {
      updatedEntries = entries.map((entry) => (entry.id === currentEntry.id ? currentEntry : entry))
    } else {
      updatedEntries = [
        ...entries,
        {
          ...currentEntry,
          id: Date.now().toString(),
          prompt: selectedPrompt || undefined,
        },
      ]
    }

    setEntries(updatedEntries)
    localStorage.setItem("journalEntries", JSON.stringify(updatedEntries))
    resetForm()
  }

  const deleteEntry = (id: string) => {
    const updatedEntries = entries.filter((entry) => entry.id !== id)
    setEntries(updatedEntries)
    localStorage.setItem("journalEntries", JSON.stringify(updatedEntries))
    setSelectedEntry(null)
  }

  const resetForm = () => {
    setCurrentEntry({
      id: "",
      date: new Date().toISOString().split("T")[0],
      title: "",
      content: "",
    })
    setSelectedPrompt("")
    setEditMode(false)
    setOpen(false)
  }

  const handleEdit = (entry: JournalEntry) => {
    setCurrentEntry(entry)
    setSelectedPrompt(entry.prompt || "")
    setEditMode(true)
    setOpen(true)
  }

  const handlePromptSelect = (value: string) => {
    setSelectedPrompt(value)
    if (value) {
      setCurrentEntry((prev) => ({
        ...prev,
        content: prev.content ? prev.content : value,
      }))
    }
  }

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
          <h1 className="text-3xl font-bold text-primary">Journal</h1>
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button className="flex items-center gap-2">
                <Plus className="h-4 w-4" />
                New Entry
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>{editMode ? "Edit Journal Entry" : "Create New Journal Entry"}</DialogTitle>
                <DialogDescription>Express your thoughts and feelings in a safe space.</DialogDescription>
              </DialogHeader>

              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="date">Date</Label>
                  <input
                    type="date"
                    id="date"
                    value={currentEntry.date}
                    onChange={(e) => setCurrentEntry({ ...currentEntry, date: e.target.value })}
                    className="w-full p-2 rounded-md border"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="title">Title</Label>
                  <Input
                    id="title"
                    placeholder="Give your entry a title"
                    value={currentEntry.title}
                    onChange={(e) => setCurrentEntry({ ...currentEntry, title: e.target.value })}
                  />
                </div>

                {!editMode && (
                  <div className="space-y-2">
                    <Label htmlFor="prompt">Writing Prompt (Optional)</Label>
                    <Select value={selectedPrompt} onValueChange={handlePromptSelect}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a prompt or write freely" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="none">Write freely</SelectItem>
                        {JOURNAL_PROMPTS.map((prompt, index) => (
                          <SelectItem key={index} value={prompt}>
                            {prompt}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                )}

                <div className="space-y-2">
                  <Label htmlFor="content">Journal Entry</Label>
                  <Textarea
                    id="content"
                    placeholder="Write your thoughts here..."
                    value={currentEntry.content}
                    onChange={(e) => setCurrentEntry({ ...currentEntry, content: e.target.value })}
                    className="min-h-[200px]"
                  />
                </div>
              </div>

              <DialogFooter>
                <Button variant="outline" onClick={resetForm}>
                  Cancel
                </Button>
                <Button
                  onClick={saveEntry}
                  disabled={!currentEntry.title || !currentEntry.content}
                  className="flex items-center gap-2"
                >
                  <Save className="h-4 w-4" />
                  Save Entry
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle>Journal Entries</CardTitle>
                <CardDescription>
                  {entries.length} {entries.length === 1 ? "entry" : "entries"} total
                </CardDescription>
              </CardHeader>
              <CardContent>
                {entries.length > 0 ? (
                  <div className="space-y-2 max-h-[500px] overflow-y-auto pr-2">
                    {[...entries].reverse().map((entry) => (
                      <div
                        key={entry.id}
                        className={`p-3 border rounded-lg cursor-pointer hover:bg-muted transition-colors ${selectedEntry?.id === entry.id ? "bg-muted border-primary" : ""}`}
                        onClick={() => setSelectedEntry(entry)}
                      >
                        <div className="flex justify-between items-center">
                          <h3 className="font-medium truncate">{entry.title}</h3>
                          <span className="text-xs text-muted-foreground flex items-center gap-1">
                            <Calendar className="h-3 w-3" />
                            {new Date(entry.date).toLocaleDateString()}
                          </span>
                        </div>
                        <p className="text-xs text-muted-foreground truncate mt-1">
                          {entry.content.substring(0, 60)}...
                        </p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 text-muted-foreground">
                    <p>No journal entries yet.</p>
                    <p className="text-sm mt-1">Start writing to see your entries here.</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          <div className="md:col-span-2">
            {selectedEntry ? (
              <Card>
                <CardHeader className="flex flex-row items-start justify-between space-y-0">
                  <div>
                    <CardTitle>{selectedEntry.title}</CardTitle>
                    <CardDescription className="mt-1 flex items-center gap-1">
                      <Calendar className="h-3 w-3" />
                      {new Date(selectedEntry.date).toLocaleDateString("en-US", {
                        weekday: "long",
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                    </CardDescription>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="icon" onClick={() => handleEdit(selectedEntry)}>
                      <Edit className="h-4 w-4" />
                    </Button>
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button variant="outline" size="icon">
                          <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Delete Journal Entry</AlertDialogTitle>
                          <AlertDialogDescription>
                            Are you sure you want to delete this journal entry? This action cannot be undone.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction
                            onClick={() => deleteEntry(selectedEntry.id)}
                            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                          >
                            Delete
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                </CardHeader>
                <CardContent>
                  {selectedEntry.prompt && (
                    <div className="bg-muted p-3 rounded-md mb-4 text-sm italic">
                      <span className="font-medium">Prompt:</span> {selectedEntry.prompt}
                    </div>
                  )}
                  <div className="whitespace-pre-line">{selectedEntry.content}</div>
                </CardContent>
              </Card>
            ) : (
              <Card className="h-full flex flex-col justify-center items-center p-8 text-center text-muted-foreground">
                <div className="max-w-md">
                  <h3 className="text-lg font-medium mb-2">Select an entry or create a new one</h3>
                  <p>Your journal is a safe space to express your thoughts and feelings.</p>
                </div>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

