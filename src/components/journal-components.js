"use client";

import { useState, useEffect, useRef, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  BookOpen, 
  Clock,
  Save,
  Plus,
  Calendar,
  Edit,
  Trash2,
  Search,
  Star,
  Sparkles,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
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
} from "@/components/ui/alert-dialog";

export function JournalComponent() {
  const [entries, setEntries] = useState([]);
  const [open, setOpen] = useState(false);
  const [selectedPrompt, setSelectedPrompt] = useState("");
  const [currentEntry, setCurrentEntry] = useState({
    id: "",
    date: new Date().toISOString().split("T")[0],
    title: "",
    content: "",
  });
  const [editMode, setEditMode] = useState(false);
  const [selectedEntry, setSelectedEntry] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("all");
  const [randomPrompt, setRandomPrompt] = useState("");
  const contentRef = useRef(null);

  const JOURNAL_PROMPTS = useMemo(() => [
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
  ], []);

  useEffect(() => {
    const savedEntries = localStorage.getItem("journalEntries");
    if (savedEntries) {
      setEntries(JSON.parse(savedEntries));
    }
    
    // Set random prompt
    const randomIndex = Math.floor(Math.random() * JOURNAL_PROMPTS.length);
    setRandomPrompt(JOURNAL_PROMPTS[randomIndex]);
  }, [JOURNAL_PROMPTS]);
  
  useEffect(() => {
    // Scroll to top of content when selecting a new entry
    if (selectedEntry && contentRef.current) {
      contentRef.current.scrollTop = 0;
    }
  }, [selectedEntry]);
  
  const getFilteredEntries = () => {
    let filteredEntries = [...entries];
    
    // Filter by search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filteredEntries = filteredEntries.filter(
        entry => 
          entry.title.toLowerCase().includes(query) || 
          entry.content.toLowerCase().includes(query)
      );
    }
    
    // Filter by tab
    if (activeTab === "favorites") {
      filteredEntries = filteredEntries.filter(entry => entry.favorite);
    } else if (activeTab === "recent") {
      // Get entries from the last 7 days
      const lastWeek = new Date();
      lastWeek.setDate(lastWeek.getDate() - 7);
      filteredEntries = filteredEntries.filter(
        entry => new Date(entry.date) >= lastWeek
      );
    }
    
    // Sort by date (newest first)
    return filteredEntries.sort((a, b) => 
      new Date(b.date).getTime() - new Date(a.date).getTime()
    );
  };

  const saveEntry = () => {
    let updatedEntries;

    if (editMode) {
      updatedEntries = entries.map((entry) => (entry.id === currentEntry.id ? currentEntry : entry));
    } else {
      updatedEntries = [
        ...entries,
        {
          ...currentEntry,
          id: Date.now().toString(),
          prompt: selectedPrompt || undefined,
        },
      ];
    }

    setEntries(updatedEntries);
    localStorage.setItem("journalEntries", JSON.stringify(updatedEntries));
    resetForm();
    
    // Select the newly created entry if not in edit mode
    if (!editMode) {
      const newEntry = updatedEntries[updatedEntries.length - 1];
      setSelectedEntry(newEntry);
    }
  };

  const deleteEntry = (id) => {
    const updatedEntries = entries.filter((entry) => entry.id !== id);
    setEntries(updatedEntries);
    localStorage.setItem("journalEntries", JSON.stringify(updatedEntries));
    setSelectedEntry(null);
  };

  const toggleFavorite = (id) => {
    const updatedEntries = entries.map(entry => 
      entry.id === id 
        ? { ...entry, favorite: !entry.favorite }
        : entry
    );
    setEntries(updatedEntries);
    localStorage.setItem("journalEntries", JSON.stringify(updatedEntries));
    
    // Update selected entry if it's the one being favorited
    if (selectedEntry && selectedEntry.id === id) {
      setSelectedEntry({
        ...selectedEntry,
        favorite: !selectedEntry.favorite
      });
    }
  };

  const resetForm = () => {
    setCurrentEntry({
      id: "",
      date: new Date().toISOString().split("T")[0],
      title: "",
      content: "",
    });
    setSelectedPrompt("");
    setEditMode(false);
    setOpen(false);
  };

  const handleEdit = (entry) => {
    setCurrentEntry(entry);
    setSelectedPrompt(entry.prompt || "");
    setEditMode(true);
    setOpen(true);
  };

  const handlePromptSelect = (value) => {
    setSelectedPrompt(value);
    if (value && value !== "none") {
      setCurrentEntry((prev) => ({
        ...prev,
        content: prev.content ? prev.content : value,
      }));
    }
  };

  const getDateDisplay = (dateString) => {
    const entryDate = new Date(dateString);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    
    if (entryDate.toDateString() === today.toDateString()) {
      return "Today";
    } else if (entryDate.toDateString() === yesterday.toDateString()) {
      return "Yesterday";
    } else {
      return entryDate.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: entryDate.getFullYear() !== today.getFullYear() ? "numeric" : undefined
      });
    }
  };

  const getWordCount = (text) => {
    return text.trim().split(/\s+/).filter(Boolean).length;
  };

  const filteredEntries = getFilteredEntries();

  return (
    <div className="h-full flex flex-col overflow-hidden">
      <div className="flex justify-between items-center p-4 pb-2">
        <h1 className="text-xl font-bold text-primary">Journal</h1>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button className="flex items-center gap-2 rounded-full shadow-md">
              <Plus className="h-4 w-4" />
              New Entry
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl p-0 overflow-hidden rounded-xl">
            <DialogHeader className="p-6 pb-2 bg-gradient-to-r from-blue-50 to-green-50 border-b">
              <DialogTitle className="text-xl">{editMode ? "Edit Journal Entry" : "Create New Journal Entry"}</DialogTitle>
              <DialogDescription>
                Express your thoughts and feelings in a safe space.
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
                  value={currentEntry.date}
                  onChange={(e) => setCurrentEntry({ ...currentEntry, date: e.target.value })}
                  className="w-full p-3 rounded-lg border border-gray-200 focus:border-primary/30 focus:ring-2 focus:ring-primary/20"
                />
              </div>

              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <BookOpen className="h-4 w-4 text-muted-foreground" />
                  <Label htmlFor="title" className="font-medium">Title</Label>
                </div>
                <Input
                  id="title"
                  placeholder="Give your entry a title"
                  value={currentEntry.title}
                  onChange={(e) => setCurrentEntry({ ...currentEntry, title: e.target.value })}
                  className="border-gray-200 focus:border-primary/30 focus:ring-2 focus:ring-primary/20"
                />
              </div>

              {!editMode && (
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Sparkles className="h-4 w-4 text-muted-foreground" />
                    <Label htmlFor="prompt" className="font-medium">Writing Prompt (Optional)</Label>
                  </div>
                  <Select value={selectedPrompt} onValueChange={handlePromptSelect}>
                    <SelectTrigger className="border-gray-200 focus:border-primary/30 focus:ring-2 focus:ring-primary/20">
                      <SelectValue placeholder="Select a prompt or write freely" />
                    </SelectTrigger>
                    <SelectContent className={"bg-white"}>
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
                <Label htmlFor="content" className="font-medium flex items-center gap-2">
                  <Edit className="h-4 w-4 text-muted-foreground" />
                  Journal Entry
                </Label>
                <Textarea
                  id="content"
                  placeholder="Write your thoughts here..."
                  value={currentEntry.content}
                  onChange={(e) => setCurrentEntry({ ...currentEntry, content: e.target.value })}
                  className="min-h-[250px] border-gray-200 focus:border-primary/30 focus:ring-2 focus:ring-primary/20 text-base"
                />
              </div>
            </div>

            <DialogFooter className="p-4 bg-gray-50 border-t">
              <div className="text-xs text-muted-foreground mr-auto">
                {getWordCount(currentEntry.content)} words
              </div>
              <Button variant="outline" onClick={resetForm} className="rounded-full">
                Cancel
              </Button>
              <Button
                onClick={saveEntry}
                disabled={!currentEntry.title || !currentEntry.content}
                className="flex items-center gap-2 rounded-full"
              >
                <Save className="h-4 w-4" />
                Save Entry
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <div className="flex-1 overflow-auto p-4 pt-2">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 h-full">
          <div className="md:col-span-1 space-y-5">
            <Card className="h-full border-transparent shadow-md">
              <CardHeader className="pb-3 border-b bg-gradient-to-r from-blue-50 to-green-50">
                <div className="flex justify-between items-center">
                  <CardTitle>Your Journal</CardTitle>
                  <Badge variant="outline" className="font-normal">
                    {entries.length} {entries.length === 1 ? "entry" : "entries"}
                  </Badge>
                </div>
                <CardDescription>Reflect on your journey</CardDescription>
              </CardHeader>
              <CardContent className="p-4">
                <div className="mb-4">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Search entries..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-9 bg-gray-50 border-gray-200"
                    />
                  </div>
                </div>
                
                <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-4">
                  <TabsList className="w-full bg-gray-100">
                    <TabsTrigger value="all" className="flex-1 data-[state=active]:bg-white data-[state=active]:shadow-sm">
                      All
                    </TabsTrigger>
                    <TabsTrigger value="favorites" className="flex-1 data-[state=active]:bg-white data-[state=active]:shadow-sm">
                      <Star className="h-3.5 w-3.5 mr-1" />
                      Favorites
                    </TabsTrigger>
                    <TabsTrigger value="recent" className="flex-1 data-[state=active]:bg-white data-[state=active]:shadow-sm">
                      <Clock className="h-3.5 w-3.5 mr-1" />
                      Recent
                    </TabsTrigger>
                  </TabsList>
                </Tabs>
                
                {filteredEntries.length > 0 ? (
                  <div className="space-y-2 max-h-[500px] overflow-y-auto pr-2 scrollbar-thin">
                    {filteredEntries.map((entry) => (
                      <div
                        key={entry.id}
                        className={`p-3 border rounded-lg cursor-pointer hover:bg-gray-50 transition-colors ${
                          selectedEntry?.id === entry.id ? "bg-blue-50 border-primary shadow-sm" : ""
                        }`}
                        onClick={() => setSelectedEntry(entry)}
                      >
                        <div className="flex justify-between items-center mb-1">
                          <h3 className="font-medium text-sm truncate flex-1">{entry.title}</h3>
                          {entry.favorite && (
                            <Star className="h-3.5 w-3.5 fill-yellow-400 text-yellow-400 flex-shrink-0 ml-1" />
                          )}
                        </div>
                        <div className="flex justify-between items-center text-xs text-muted-foreground">
                          <span className="flex items-center gap-1">
                            <Calendar className="h-3 w-3" />
                            {getDateDisplay(entry.date)}
                          </span>
                          <span>{getWordCount(entry.content)} words</span>
                        </div>
                        <p className="text-xs text-muted-foreground truncate mt-1.5">
                          {entry.content.substring(0, 75)}...
                        </p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 text-muted-foreground">
                    {searchQuery ? (
                      <>
                        <p>No entries found matching &quot;{searchQuery}&quot;</p>
                        <Button 
                          variant="link" 
                          className="mt-1 text-sm h-auto p-0" 
                          onClick={() => setSearchQuery("")}
                        >
                          Clear search
                        </Button>
                      </>
                    ) : activeTab !== "all" ? (
                      <>
                        <p>No {activeTab} entries found.</p>
                        <Button 
                          variant="link" 
                          className="mt-1 text-sm h-auto p-0" 
                          onClick={() => setActiveTab("all")}
                        >
                          View all entries
                        </Button>
                      </>
                    ) : (
                      <>
                        <p>No journal entries yet.</p>
                        <p className="text-sm mt-1">Start writing to see your entries here.</p>
                      </>
                    )}
                  </div>
                )}
              </CardContent>
              {entries.length > 0 && (
                <CardFooter className="bg-gray-50 border-t px-4 py-3 text-center">
                  <Button 
                    onClick={() => setOpen(true)} 
                    variant="outline" 
                    size="sm" 
                    className="w-full text-xs rounded-full"
                  >
                    <Plus className="h-3.5 w-3.5 mr-1" />
                    Write New Entry
                  </Button>
                </CardFooter>
              )}
            </Card>
            
            {entries.length === 0 && (
              <Card className="border-transparent shadow-md bg-gradient-to-r from-blue-50 to-green-100 overflow-hidden">
                <CardContent className="p-5">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="bg-white p-2 rounded-full shadow-sm">
                      <Sparkles className="h-5 w-5 text-blue-500" />
                    </div>
                    <h3 className="font-medium">Today&apos;s Writing Prompt</h3>
                  </div>
                  <p className="italic text-gray-700 mb-4">&quot;{randomPrompt}&quot;</p>
                  <Button
                    onClick={() => {
                      setSelectedPrompt(randomPrompt);
                      setCurrentEntry(prev => ({
                        ...prev,
                        content: randomPrompt
                      }));
                      setOpen(true);
                    }}
                    className="w-full rounded-full text-sm"
                  >
                    Write with this prompt
                  </Button>
                </CardContent>
              </Card>
            )}
          </div>

          <div className="md:col-span-2 h-full">
            {selectedEntry ? (
              <Card className="border-transparent shadow-md h-full flex flex-col">
                <CardHeader className="flex flex-row items-start justify-between space-y-0 bg-gradient-to-r from-blue-50 to-green-50 border-b pb-3">
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      {selectedEntry.title}
                      {selectedEntry.favorite && (
                        <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                      )}
                    </CardTitle>
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
                    <Button 
                      variant="outline" 
                      size="icon" 
                      className={selectedEntry.favorite ? "text-yellow-500 border-yellow-200 hover:bg-yellow-50" : ""}
                      onClick={() => toggleFavorite(selectedEntry.id)}
                    >
                      <Star className={`h-4 w-4 ${selectedEntry.favorite ? "fill-yellow-400" : ""}`} />
                    </Button>
                    <Button variant="outline" size="icon" onClick={() => handleEdit(selectedEntry)}>
                      <Edit className="h-4 w-4" />
                    </Button>
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button variant="outline" size="icon">
                          <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent className="rounded-lg bg-white">
                        <AlertDialogHeader>
                          <AlertDialogTitle>Delete Journal Entry</AlertDialogTitle>
                          <AlertDialogDescription>
                            Are you sure you want to delete &quot;{selectedEntry.title}&quot;? This action cannot be undone.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel className="rounded-full">Cancel</AlertDialogCancel>
                          <AlertDialogAction
                            onClick={() => deleteEntry(selectedEntry.id)}
                            className="bg-destructive text-destructive-foreground hover:bg-destructive/90 rounded-full"
                          >
                            Delete
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                </CardHeader>
                <CardContent className="p-6 flex-1 overflow-auto" ref={contentRef}>
                  {selectedEntry.prompt && (
                    <div className="bg-blue-50 p-4 rounded-lg mb-5 text-sm border border-blue-100">
                      <div className="flex items-center gap-2 mb-1">
                        <Sparkles className="h-4 w-4 text-blue-500" />
                        <span className="font-medium text-blue-700">Prompt</span>
                      </div>
                      <p className="text-blue-700 italic">{selectedEntry.prompt}</p>
                    </div>
                  )}
                  <div className="whitespace-pre-line text-gray-800 leading-relaxed">
                    {selectedEntry.content.split('\n').map((paragraph, i) => (
                      <p key={i} className="mb-4">{paragraph}</p>
                    ))}
                  </div>
                </CardContent>
                <CardFooter className="px-6 py-3 bg-gray-50 border-t flex justify-between text-xs text-muted-foreground">
                  <div>
                    {getWordCount(selectedEntry.content)} words
                  </div>
                  <div>
                    Last edited: {new Date(parseInt(selectedEntry.id)).toLocaleDateString()} 
                  </div>
                </CardFooter>
              </Card>
            ) : (
              <Card className="h-full flex flex-col justify-center items-center p-10 text-center text-muted-foreground border-transparent shadow-md">
                <div className="max-w-md">
                  <div className="bg-gray-100 p-5 rounded-full inline-block mb-4">
                    <BookOpen className="h-10 w-10 text-gray-400" />
                  </div>
                  <h3 className="text-xl font-medium mb-3 text-gray-700">Your Journal Awaits</h3>
                  <p className="mb-6">
                    Select an entry from the sidebar or create a new one to start documenting your thoughts, experiences, and reflections.
                  </p>
                  <Button
                    onClick={() => setOpen(true)}
                    className="rounded-full"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Create Your First Entry
                  </Button>
                </div>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}