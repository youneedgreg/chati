"use client";

import { useState, useEffect, useRef } from "react";
import { useChat } from "ai/react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Send, 
  BookOpen, 
  BarChart2,
  RefreshCw, 
  Pause, 
  Play, 
  Wind, 
  Palette, 
  Brain,
  Clock,
  Award,
  Info,
  X,
  Save,
  Plus,
  Calendar,
  Edit,
  Trash2,
  Search,
  Star,
  Sparkles,
  History
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
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
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Progress } from "@/components/ui/progress";

// ChatComponent
export function ChatComponent() {
  const { messages, input, handleInputChange, handleSubmit, isLoading } = useChat({
    initialMessages: [
      {
        id: "welcome-message",
        role: "assistant",
        content: "Hi there! I'm here to listen and support you. How are you feeling today?",
      },
    ],
  });

  const messagesEndRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <div className="flex-1 flex flex-col overflow-hidden">
      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
        {messages.map((message) => (
          <div key={message.id} className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}>
            <div className="flex items-start gap-3 max-w-[80%]">
              {message.role === "assistant" && (
                <Avatar className="mt-1">
                  <AvatarFallback className="bg-primary text-primary-foreground">AI</AvatarFallback>
                </Avatar>
              )}

              <div
                className={`p-3 rounded-xl shadow-md ${
                  message.role === "user"
                    ? "bg-blue-500 text-white rounded-br-none"
                    : "bg-gray-200 text-gray-900 rounded-bl-none"
                }`}
              >
                {message.content}
              </div>

              {message.role === "user" && (
                <Avatar className="mt-1">
                  <AvatarFallback className="bg-gray-400 text-white">You</AvatarFallback>
                </Avatar>
              )}
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      <CardFooter className="border-t bg-white p-4 sticky bottom-0">
        <form onSubmit={handleSubmit} className="flex w-full gap-2">
          <Input
            value={input}
            onChange={handleInputChange}
            placeholder="Type your message here..."
            className="flex-1 border border-gray-300 shadow-sm rounded-full px-4 py-2"
            disabled={isLoading}
          />
          <Button
            type="submit"
            className="bg-blue-500 hover:bg-blue-600 transition-all duration-200 text-white px-4 py-2 rounded-full shadow-md"
            disabled={isLoading || !input.trim()}
          >
            <Send className="h-5 w-5" />
          </Button>
        </form>
      </CardFooter>
    </div>
  );
}

// GamesComponent
export function GamesComponent() {
  const [activeTab, setActiveTab] = useState("breathing");
  const [stats, setStats] = useState({
    breathingTime: 0,
    coloringPixels: 0,
    memoryBestScore: null,
    memoryGamesPlayed: 0,
    lastPlayed: null
  });
  const [showTip, setShowTip] = useState(true);

 // GamesComponent fix - Add updateLastPlayed to dependency array
useEffect(() => {
  // Load stats from localStorage
  const savedStats = localStorage.getItem("gameStats");
  if (savedStats) {
    setStats(JSON.parse(savedStats));
  }
  
  // Set last played to today
  updateLastPlayed();
}, [updateLastPlayed]); // Add updateLastPlayed to dependency array
  
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const updateLastPlayed = useCallback(() => {
    const updatedStats = {
      ...stats,
      lastPlayed: new Date().toISOString()
    };
    setStats(updatedStats);
    localStorage.setItem("gameStats", JSON.stringify(updatedStats));
  });
  
  const updateBreathingTime = (seconds) => {
    const updatedStats = {
      ...stats,
      breathingTime: stats.breathingTime + seconds
    };
    setStats(updatedStats);
    localStorage.setItem("gameStats", JSON.stringify(updatedStats));
  };
  
  const updateColoringPixels = (pixels) => {
    const updatedStats = {
      ...stats,
      coloringPixels: stats.coloringPixels + pixels
    };
    setStats(updatedStats);
    localStorage.setItem("gameStats", JSON.stringify(updatedStats));
  };
  
  const updateMemoryStats = (moves) => {
    const updatedStats = {
      ...stats,
      memoryGamesPlayed: stats.memoryGamesPlayed + 1,
      memoryBestScore: stats.memoryBestScore === null || moves < stats.memoryBestScore 
        ? moves 
        : stats.memoryBestScore
    };
    setStats(updatedStats);
    localStorage.setItem("gameStats", JSON.stringify(updatedStats));
  };

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}m ${remainingSeconds}s`;
  };

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-xl font-bold text-primary">Games Corner</h1>
        
        <Dialog>
          <DialogTrigger asChild>
            <Button variant="outline" size="sm" className="flex items-center gap-2 rounded-full">
              <Award className="h-4 w-4" />
              Your Stats
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md rounded-xl bg-white">
            <DialogHeader>
              <DialogTitle>Your Wellness Game Stats</DialogTitle>
              <DialogDescription>
                Track your mindfulness and relaxation activities
              </DialogDescription>
            </DialogHeader>
            
            <div className="space-y-4 py-2">
              <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <Wind className="h-4 w-4 text-blue-500" />
                    <h3 className="font-medium">Breathing</h3>
                  </div>
                  <Badge variant="outline" className="bg-blue-100 text-blue-700">
                    {formatTime(stats.breathingTime)}
                  </Badge>
                </div>
                <p className="text-sm text-blue-700">
                  Total time spent on breathing exercises
                </p>
              </div>
              
              <div className="bg-green-50 p-4 rounded-lg border border-green-100">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <Palette className="h-4 w-4 text-green-500" />
                    <h3 className="font-medium">Coloring</h3>
                  </div>
                  <Badge variant="outline" className="bg-green-100 text-green-700">
                    {stats.coloringPixels} pixels
                  </Badge>
                </div>
                <p className="text-sm text-green-700">
                  Total pixels colored in the art canvas
                </p>
              </div>
              
              <div className="bg-purple-50 p-4 rounded-lg border border-purple-100">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <Brain className="h-4 w-4 text-purple-500" />
                    <h3 className="font-medium">Memory Game</h3>
                  </div>
                  <Badge variant="outline" className="bg-purple-100 text-purple-700">
                    {stats.memoryGamesPlayed} games
                  </Badge>
                </div>
                <div className="flex items-center justify-between">
                  <p className="text-sm text-purple-700">
                    Best score: {stats.memoryBestScore ? `${stats.memoryBestScore} moves` : "Not played yet"}
                  </p>
                </div>
              </div>
              
              {stats.lastPlayed && (
                <div className="text-xs text-center text-muted-foreground mt-4">
                  Last played: {new Date(stats.lastPlayed).toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                    year: "numeric"
                  })}
                </div>
              )}
            </div>
            
            <DialogFooter>
              <Button onClick={() => {
                setStats({
                  breathingTime: 0,
                  coloringPixels: 0,
                  memoryBestScore: null,
                  memoryGamesPlayed: 0,
                  lastPlayed: new Date().toISOString()
                });
                localStorage.setItem("gameStats", JSON.stringify({
                  breathingTime: 0,
                  coloringPixels: 0,
                  memoryBestScore: null,
                  memoryGamesPlayed: 0,
                  lastPlayed: new Date().toISOString()
                }));
              }} variant="outline" className="rounded-full">
                Reset Stats
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
      
      {showTip && (
        <Card className="mb-6 border border-blue-100 bg-blue-50/50 relative">
          <Button 
            variant="ghost" 
            size="icon" 
            className="absolute top-2 right-2 h-6 w-6 text-blue-400 hover:text-blue-600 hover:bg-blue-100"
            onClick={() => setShowTip(false)}
          >
            <X className="h-4 w-4" />
          </Button>
          <CardContent className="p-4 flex gap-4 items-center">
            <div className="bg-blue-100 rounded-full p-3">
              <Info className="h-5 w-5 text-blue-500" />
            </div>
            <div>
              <h3 className="font-medium text-blue-700">Wellness Tip</h3>
              <p className="text-blue-600 text-sm">These mindfulness games are designed to reduce stress and improve focus. Try spending at least 5 minutes with each activity for the best results.</p>
            </div>
          </CardContent>
        </Card>
      )}

      <Tabs value={activeTab} onValueChange={(value) => {
        setActiveTab(value);
        updateLastPlayed();
      }}>
        <TabsList className="mb-6 p-1 bg-white/80 backdrop-blur-sm sticky top-4 z-10 shadow-sm">
          <TabsTrigger value="breathing" className="flex items-center gap-2 px-4 py-2 data-[state=active]:shadow-md">
            <Wind className="h-4 w-4" />
            Breathing
          </TabsTrigger>
          <TabsTrigger value="coloring" className="flex items-center gap-2 px-4 py-2 data-[state=active]:shadow-md">
            <Palette className="h-4 w-4" />
            Coloring
          </TabsTrigger>
          <TabsTrigger value="memory" className="flex items-center gap-2 px-4 py-2 data-[state=active]:shadow-md">
            <Brain className="h-4 w-4" />
            Memory
          </TabsTrigger>
        </TabsList>

        <TabsContent value="breathing">
          <BreathingExercise onSessionComplete={updateBreathingTime} />
        </TabsContent>

        <TabsContent value="coloring">
          <ColoringGame onPixelsColored={updateColoringPixels} />
        </TabsContent>

        <TabsContent value="memory">
          <MemoryGame onGameComplete={updateMemoryStats} />
        </TabsContent>
      </Tabs>
    </div>
  );
}

// Helper Components for Games
function BreathingExercise({ onSessionComplete }) {
  const [isActive, setIsActive] = useState(false);
  const [breathingRate, setBreathingRate] = useState(4); // in seconds
  const [currentPhase, setCurrentPhase] = useState("in");
  const [sessionTime, setSessionTime] = useState(0);
  const [animationProgress, setAnimationProgress] = useState(0);
  
  // Phase durations in seconds
  const phaseDurations = useMemo(() => ({
    in: breathingRate,
    hold: Math.max(1, Math.floor(breathingRate / 2)),
    out: breathingRate,
    rest: Math.max(1, Math.floor(breathingRate / 2))
  }), [breathingRate]);
  
  const phaseMessages = {
    in: "Breathe in...",
    hold: "Hold...",
    out: "Breathe out...",
    rest: "Rest..."
  };
  
  const phaseColors = {
    in: "from-blue-200 to-blue-300",
    hold: "from-green-200 to-green-300",
    out: "from-purple-200 to-purple-300",
    rest: "from-amber-200 to-amber-300"
  };

  useEffect(() => {
    let interval = null;
    let progressInterval = null;
    
    if (isActive) {
      let phaseTime = 0;
      let currentPhase = "in";
      setCurrentPhase(currentPhase);
      
      interval = setInterval(() => {
        setSessionTime(prev => prev + 1);
        
        phaseTime += 1;
        
        // Check if we need to change phase
        if (currentPhase === "in" && phaseTime >= phaseDurations.in) {
          currentPhase = "hold";
          phaseTime = 0;
          setCurrentPhase(currentPhase);
        } else if (currentPhase === "hold" && phaseTime >= phaseDurations.hold) {
          currentPhase = "out";
          phaseTime = 0;
          setCurrentPhase(currentPhase);
        } else if (currentPhase === "out" && phaseTime >= phaseDurations.out) {
          currentPhase = "rest";
          phaseTime = 0;
          setCurrentPhase(currentPhase);
        } else if (currentPhase === "rest" && phaseTime >= phaseDurations.rest) {
          currentPhase = "in";
          phaseTime = 0;
          setCurrentPhase(currentPhase);
        }
        
      }, 1000);
      
      progressInterval = setInterval(() => {
        setAnimationProgress(prev => {
          // Calculate what percentage through the current phase we are
          const phaseDuration = phaseDurations[currentPhase] * 1000; // convert to ms
          const progressIncrement = 100 / (phaseDuration / 50); // 50ms updates
          return (prev + progressIncrement) % 100;
        });
      }, 50);
    }
    
    return () => {
      if (interval) clearInterval(interval);
      if (progressInterval) clearInterval(progressInterval);
    };
  }, [isActive, breathingRate, phaseDurations]);
  
  const toggleActive = () => {
    if (isActive) {
      // Stopping the session
      onSessionComplete(sessionTime);
      setSessionTime(0);
    }
    setIsActive(!isActive);
  };

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds < 10 ? '0' : ''}${remainingSeconds}`;
  };

  return (
    <Card className="shadow-md border-transparent">
      <CardHeader className="bg-gradient-to-r from-blue-50 to-green-50 border-b pb-3">
        <div className="flex justify-between items-start">
          <div>
            <CardTitle>Breathing Exercise</CardTitle>
            <CardDescription>A guided breathing exercise to help you relax and reduce anxiety</CardDescription>
          </div>
          {isActive && (
            <Badge variant="outline" className="bg-primary/10 font-mono">
              <Clock className="h-3 w-3 mr-1" />
              {formatTime(sessionTime)}
            </Badge>
          )}
        </div>
      </CardHeader>
      <CardContent className="flex flex-col items-center p-6">
        <div className="mb-8 relative">
          <div className={`h-72 w-72 rounded-full bg-gradient-to-br ${phaseColors[currentPhase]} flex items-center justify-center relative overflow-hidden shadow-md border-4 border-white`}>
            <div 
              className="absolute inset-0 bg-white opacity-50"
              style={{
                transform: `scale(${currentPhase === "in" ? 1 - animationProgress/100 : 
                               currentPhase === "out" ? animationProgress/100 : 
                               currentPhase === "hold" ? 0 : 1})`,
                transition: "transform 0.2s ease-in-out"
              }}
            />
            <div className="text-center z-10 bg-white/80 p-6 rounded-full shadow-inner">
              <p className="text-2xl font-medium text-primary mb-2">
                {isActive ? phaseMessages[currentPhase] : "Ready?"}
              </p>
              {isActive && currentPhase !== "rest" && (
                <Progress value={animationProgress} className="w-24 h-1.5 mx-auto" />
              )}
            </div>
          </div>
        </div>

        <div className="w-full max-w-md space-y-6">
          <div className="p-4 bg-gray-50 rounded-lg border border-gray-100 space-y-4">
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-sm font-medium">Breathing Rate</span>
                <span className="text-sm">{breathingRate} seconds</span>
              </div>
              <Slider
  value={[breathingRate]}
  min={2}
  max={8}
  step={1}
  onValueChange={(value) => setBreathingRate(value[0])}
  disabled={isActive}
  className="py-1 [&>span]:bg-black [&>span>span]:bg-black [&>span>span>span]:bg-black"
/>
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>Shorter</span>
                <span>Longer</span>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="bg-white p-2 rounded border">
                <div className="font-medium mb-1 text-blue-600">Inhale</div>
                <div>{phaseDurations.in} seconds</div>
              </div>
              <div className="bg-white p-2 rounded border">
                <div className="font-medium mb-1 text-green-600">Hold</div>
                <div>{phaseDurations.hold} seconds</div>
              </div>
              <div className="bg-white p-2 rounded border">
                <div className="font-medium mb-1 text-purple-600">Exhale</div>
                <div>{phaseDurations.out} seconds</div>
              </div>
              <div className="bg-white p-2 rounded border">
                <div className="font-medium mb-1 text-amber-600">Rest</div>
                <div>{phaseDurations.rest} seconds</div>
              </div>
            </div>
          </div>

          <Button 
            onClick={toggleActive} 
            className={`w-full rounded-full shadow-sm ${
              isActive ? "bg-red-500 hover:bg-red-600" : "bg-blue-500 hover:bg-blue-600"
            }`}
          >
            {isActive ? (
              <>
                <Pause className="mr-2 h-4 w-4" /> End Session
              </>
            ) : (
              <>
                <Play className="mr-2 h-4 w-4" /> Start Breathing
              </>
            )}
          </Button>
        </div>
      </CardContent>
      <CardFooter className="flex-col text-sm text-muted-foreground bg-gray-50 border-t p-4">
        <p>Breathing exercises can help activate your parasympathetic nervous system, which controls relaxation and can reduce anxiety.</p>
      </CardFooter>
    </Card>
  );
}

function ColoringGame({ onPixelsColored }) {
  const [selectedColor, setSelectedColor] = useState("#4f46e5");
  const [pixels, setPixels] = useState(Array(400).fill("#ffffff"));
  const [coloredPixels, setColoredPixels] = useState(0);
  const [selectedTool, setSelectedTool] = useState("brush");

  const colors = [
    "#ef4444", "#f97316", "#eab308", "#22c55e", "#06b6d4", 
    "#3b82f6", "#8b5cf6", "#ec4899", "#6b7280", "#000000", "#ffffff"
  ];
  
  const palettes = {
    nature: ["#2F4F4F", "#228B22", "#8FBC8F", "#00FFFF", "#4682B4", "#F5DEB3", "#DEB887", "#8B4513"],
    sunset: ["#FF7F50", "#FF6347", "#FF4500", "#FFD700", "#FF8C00", "#9370DB", "#8A2BE2", "#4B0082"],
    pastel: ["#FFB6C1", "#FFE4E1", "#E6E6FA", "#B0E0E6", "#98FB98", "#FAFAD2", "#D8BFD8", "#F0FFF0"]
  };
  
  const [activePalette, setActivePalette] = useState("default");
  const displayColors = activePalette === "default" ? colors : palettes[activePalette];

  const handlePixelClick = (index) => {
    if (pixels[index] !== selectedColor) {
      const newPixels = [...pixels];
      newPixels[index] = selectedColor;
      setPixels(newPixels);
      
      // Only increment if we're coloring a white pixel
      if (pixels[index] === "#ffffff") {
        setColoredPixels(prev => prev + 1);
      }
    }
  };
  
  const floodFill = (index, targetColor, replacementColor) => {
    if (targetColor === replacementColor) return;

    const newPixels = [...pixels];
    const queue = [index];
    
    const getAdjacentIndices = (idx) => {
      const row = Math.floor(idx / 20);
      const col = idx % 20;
      const adjacent = [];
      
      if (row > 0) adjacent.push(idx - 20); // up
      if (row < 19) adjacent.push(idx + 20); // down
      if (col > 0) adjacent.push(idx - 1); // left
      if (col < 19) adjacent.push(idx + 1); // right
      
      return adjacent;
    };
    
    let newColoredCount = 0;
    
    while (queue.length > 0) {
      const current = queue.shift();
      
      if (newPixels[current] === targetColor) {
        newPixels[current] = replacementColor;
        
        // Only increment if we're coloring a white pixel
        if (targetColor === "#ffffff") {
          newColoredCount++;
        }
        
        const adjacent = getAdjacentIndices(current);
        for (const adj of adjacent) {
          if (newPixels[adj] === targetColor) {
            queue.push(adj);
          }
        }
      }
    }
    
    setPixels(newPixels);
    setColoredPixels(prev => prev + newColoredCount);
  };

  const resetCanvas = () => {
    onPixelsColored(coloredPixels);
    setPixels(Array(400).fill("#ffffff"));
    setColoredPixels(0);
  };
  
  const saveArt = () => {
    alert("Art saved! (This would save the pixel art in a real app)");
    onPixelsColored(coloredPixels);
  };

  return (
    <Card className="shadow-md border-transparent">
      <CardHeader className="bg-gradient-to-r from-blue-50 to-green-50 border-b pb-3">
        <div className="flex justify-between items-start">
          <div>
            <CardTitle>Pixel Art Studio</CardTitle>
            <CardDescription>Express yourself through colors and create pixel art</CardDescription>
          </div>
          <Badge variant="outline" className="font-mono">
            {coloredPixels}/400 pixels
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="p-6">
        <div className="flex flex-col items-center space-y-6">
          <div className="flex flex-wrap justify-center gap-2 p-2 bg-gray-50 rounded-lg border border-gray-100 w-full max-w-md">
            <div className="flex justify-between items-center w-full px-2 mb-1">
              <div className="text-xs font-medium text-gray-500">Color Palette:</div>
              <div className="flex gap-1">
                <Button 
                  size="sm" 
                  variant={activePalette === "default" ? "default" : "outline"} 
                  className="h-7 text-xs rounded-full"
                  onClick={() => setActivePalette("default")}
                >
                  Basic
                </Button>
                <Button 
                  size="sm" 
                  variant={activePalette === "nature" ? "default" : "outline"} 
                  className="h-7 text-xs rounded-full"
                  onClick={() => setActivePalette("nature")}
                >
                  Nature
                </Button>
                <Button 
                  size="sm" 
                  variant={activePalette === "sunset" ? "default" : "outline"} 
                  className="h-7 text-xs rounded-full"
                  onClick={() => setActivePalette("sunset")}
                >
                  Sunset
                </Button>
                <Button 
                  size="sm" 
                  variant={activePalette === "pastel" ? "default" : "outline"} 
                  className="h-7 text-xs rounded-full"
                  onClick={() => setActivePalette("pastel")}
                >
                  Pastel
                </Button>
              </div>
            </div>
            
            <div className="flex flex-wrap justify-center gap-2 w-full mt-1">
              {displayColors.map((color) => (
                <TooltipProvider key={color}>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <button
                        className={`h-8 w-8 rounded-full border-2 transition-transform ${selectedColor === color ? "border-gray-900 scale-110 shadow" : "border-gray-200"}`}
                        style={{ backgroundColor: color }}
                        onClick={() => setSelectedColor(color)}
                        aria-label={`Select ${color} color`}
                      />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>{color}</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              ))}
            </div>
            
            <div className="flex justify-between w-full mt-2 px-2">
              <div className="flex gap-2">
                <Button 
                  size="sm" 
                  variant={selectedTool === "brush" ? "default" : "outline"}
                  className="h-8 text-xs"
                  onClick={() => setSelectedTool("brush")}
                >
                  🖌️ Brush
                </Button>
                <Button 
                  size="sm" 
                  variant={selectedTool === "fill" ? "default" : "outline"}
                  className="h-8 text-xs"
                  onClick={() => setSelectedTool("fill")}
                >
                  🪣 Fill
                </Button>
              </div>
              
              <div className="flex gap-2">
                <Button variant="outline" size="sm" onClick={resetCanvas} className="h-8 text-xs">
                  <RefreshCw className="h-3 w-3 mr-1" />
                  Reset
                </Button>
                <Button variant="outline" size="sm" onClick={saveArt} className="h-8 text-xs">
                  Save
                </Button>
              </div>
            </div>
          </div>

          <div className="border-4 border-gray-200 rounded-md overflow-hidden shadow-md bg-white">
            <div className="grid grid-cols-20 gap-0" style={{ gridTemplateColumns: "repeat(20, 1fr)" }}>
              {pixels.map((color, index) => (
                <div
                  key={index}
                  className="aspect-square cursor-pointer hover:opacity-80 transition-opacity"
                  style={{ backgroundColor: color }}
                  onClick={() => {
                    if (selectedTool === "brush") {
                      handlePixelClick(index);
                    } else {
                      floodFill(index, pixels[index], selectedColor);
                    }
                  }}
                />
              ))}
            </div>
          </div>
          
          <div className="text-center text-sm text-muted-foreground px-4">
            <p className="mb-1">
              <strong>Current Tool:</strong> {selectedTool === "brush" ? "Brush (color one pixel at a time)" : "Fill (color connected areas of the same color)"}
            </p>
            <p>Click on the canvas to start creating your masterpiece!</p>
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex-col text-sm text-muted-foreground bg-gray-50 border-t p-4">
        <p>Coloring and creative activities can be meditative, helping to reduce stress and anxiety while promoting mindfulness.</p>
      </CardFooter>
    </Card>
  );
}

function MemoryGame({ onGameComplete }) {
  const [level, setLevel] = useState("easy");
  const [cards, setCards] = useState(() => generateCards(level));
  const [flippedIndices, setFlippedIndices] = useState([]);
  const [moves, setMoves] = useState(0);
  const [isChecking, setIsChecking] = useState(false);
  const [startTime, setStartTime] = useState(null);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [timer, setTimer] = useState(null);
  const [isGameComplete, setIsGameComplete] = useState(false);
  
  function generateCards(difficulty) {
    const levelConfig = {
      easy: { pairs: 8, gridSize: 4 },
      medium: { pairs: 12, gridSize: 6 },
      hard: { pairs: 18, gridSize: 6 }
    };
    
    const config = levelConfig[difficulty];
    
    // Emoji sets based on difficulty
    const easyEmojis = ["🌟", "🌈", "🌺", "🌻", "🦋", "🐢", "🐬", "🦜"];
    const mediumEmojis = [...easyEmojis, "🦊", "🐘", "🐙", "🦄"];
    const hardEmojis = [...mediumEmojis, "🍎", "🍕", "🚀", "🎸", "🏀", "⚽"];
    
    // Select emojis based on difficulty
    let emojis;
    if (difficulty === "easy") emojis = easyEmojis.slice(0, config.pairs);
    else if (difficulty === "medium") emojis = mediumEmojis.slice(0, config.pairs);
    else emojis = hardEmojis.slice(0, config.pairs);
    
    // Create pairs and shuffle
    const allEmojis = [...emojis, ...emojis];
    return allEmojis.sort(() => Math.random() - 0.5).map((emoji) => ({ 
      emoji, 
      isFlipped: false, 
      isMatched: false 
    }));
  }
  
// Fix for useEffect in MemoryGame (Line 843)
useEffect(() => {
  // Reset the game when difficulty changes
  resetGame();
}, [level, resetGame]); // Added resetGame

  useEffect(() => {
    // Start the timer on first move
    if (moves === 1 && !timer) {
      setStartTime(Date.now());
      const newTimer = setInterval(() => {
        setElapsedTime(Math.floor((Date.now() - (startTime || Date.now())) / 1000));
      }, 1000);
      setTimer(newTimer);
    }
    
    // Check if game is complete
    const allMatched = cards.every((card) => card.isMatched);
    if (allMatched && !isGameComplete && moves > 0) {
      if (timer) clearInterval(timer);
      setTimer(null);
      setIsGameComplete(true);
      onGameComplete(moves);
    }
    
    return () => {
      if (timer) clearInterval(timer);
    };
  }, [moves, cards, timer, startTime, isGameComplete, onGameComplete]);

  const handleCardClick = (index) => {
    // Prevent clicking if already checking a pair or clicking a matched/flipped card
    if (isChecking || cards[index].isMatched || cards[index].isFlipped || flippedIndices.length === 2) {
      return;
    }

    // Flip the card
    const newCards = [...cards];
    newCards[index].isFlipped = true;
    setCards(newCards);

    // Add to flipped indices
    const newFlippedIndices = [...flippedIndices, index];
    setFlippedIndices(newFlippedIndices);

    // If we have 2 flipped cards, check for a match
    if (newFlippedIndices.length === 2) {
      setMoves(moves + 1);
      setIsChecking(true);

      setTimeout(() => {
        const [firstIndex, secondIndex] = newFlippedIndices;
        const updatedCards = [...newCards];

        if (updatedCards[firstIndex].emoji === updatedCards[secondIndex].emoji) {
          // Match found
          updatedCards[firstIndex].isMatched = true;
          updatedCards[secondIndex].isMatched = true;
        } else {
          // No match
          updatedCards[firstIndex].isFlipped = false;
          updatedCards[secondIndex].isFlipped = false;
        }

        setCards(updatedCards);
        setFlippedIndices([]);
        setIsChecking(false);
      }, 1000);
    }
  };

  const resetGame = useCallback(() => {
    if (timer) clearInterval(timer);
    setTimer(null);
    setCards(generateCards(level));
    setFlippedIndices([]);
    setMoves(0);
    setIsChecking(false);
    setStartTime(null);
    setElapsedTime(0);
    setIsGameComplete(false);
  }, [timer, level]);

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds < 10 ? '0' : ''}${remainingSeconds}`;
  };
  
  const getGridColsClass = () => {
    if (level === "easy") return "grid-cols-4";
    return "grid-cols-6";
  };

  return (
    <Card className="shadow-md border-transparent">
      <CardHeader className="bg-gradient-to-r from-blue-50 to-green-50 border-b pb-3">
        <div className="flex justify-between items-start">
          <div>
            <CardTitle>Memory Game</CardTitle>
            <CardDescription>Find matching pairs to improve focus and memory</CardDescription>
          </div>
          
          <div className="flex gap-2">
            <Badge variant="outline" className="font-mono">
              <Clock className="h-3 w-3 mr-1" />
              {formatTime(elapsedTime)}
            </Badge>
            <Badge variant="outline" className="font-mono">
              Moves: {moves}
            </Badge>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-6">
        <div className="flex flex-col items-center space-y-6">
          <div className="flex justify-between w-full max-w-md bg-gray-50 p-3 rounded-lg border border-gray-100">
            <div className="flex gap-2">
              <Button 
                variant={level === "easy" ? "default" : "outline"} 
                size="sm" 
                onClick={() => setLevel("easy")}
                className="h-8 text-xs"
                disabled={moves > 0 && !isGameComplete}
              >
                Easy
              </Button>
              <Button 
                variant={level === "medium" ? "default" : "outline"} 
                size="sm" 
                onClick={() => setLevel("medium")}
                className="h-8 text-xs"
                disabled={moves > 0 && !isGameComplete}
              >
                Medium
              </Button>
              <Button 
                variant={level === "hard" ? "default" : "outline"} 
                size="sm" 
                onClick={() => setLevel("hard")}
                className="h-8 text-xs"
                disabled={moves > 0 && !isGameComplete}
              >
                Hard
              </Button>
            </div>
            
            <Button variant="outline" size="sm" onClick={resetGame} className="h-8 text-xs flex items-center gap-1">
              <RefreshCw className="h-3 w-3" />
              Reset
            </Button>
          </div>

          <div className={`grid ${getGridColsClass()} gap-2 w-full max-w-md mx-auto`}>
            {cards.map((card, index) => (
              <div
                key={index}
                className={`aspect-square flex items-center justify-center rounded-md cursor-pointer transition-all duration-300 shadow-sm ${
                  card.isFlipped || card.isMatched 
                    ? "bg-primary text-primary-foreground rotate-y-180" 
                    : "bg-gray-100 hover:bg-gray-200 border border-gray-300"
                }`}
                onClick={() => handleCardClick(index)}
              >
                <span className="text-2xl">
                  {card.isFlipped || card.isMatched ? card.emoji : ""}
                </span>
              </div>
            ))}
          </div>

          {isGameComplete && (
            <div className="bg-green-50 text-green-800 p-4 rounded-lg border border-green-200 text-center w-full max-w-md">
              <div className="bg-green-100 rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-2">
                <Award className="h-6 w-6 text-green-600" />
              </div>
              <p className="font-bold text-lg mb-1">Congratulations! 🎉</p>
              <p className="mb-2">You completed the game in {moves} moves and {formatTime(elapsedTime)}.</p>
              <Button onClick={resetGame} className="mt-2 bg-green-600 hover:bg-green-700 rounded-full">
                Play Again
              </Button>
            </div>
          )}
        </div>
      </CardContent>
      <CardFooter className="flex-col text-sm text-muted-foreground bg-gray-50 border-t p-4">
        <p>Memory games can help improve concentration and provide a healthy distraction from stress while enhancing cognitive abilities.</p>
      </CardFooter>

      <style jsx global>{`
        .rotate-y-180 {
          transform: rotateY(180deg);
        }
      `}</style>
    </Card>
  );
}

// JournalComponent
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
  }, [JOURNAL_PROMPTS]); // Added JOURNAL_PROMPTS
  
  
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
    <div className="p-4">
      <div className="flex justify-between items-center mb-6">
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

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-1 space-y-5">
          <Card className="border-transparent shadow-md">
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

        <div className="md:col-span-2">
          {selectedEntry ? (
            <Card className="border-transparent shadow-md">
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
                    <AlertDialogContent className="rounded-lg">
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
              <CardContent className="p-6" ref={contentRef}>
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
  );
}

// MoodTrackerComponent
export function MoodTrackerComponent() {
  const [entries, setEntries] = useState([]);
  const [open, setOpen] = useState(false);
  const [newEntry, setNewEntry] = useState({
    date: new Date().toISOString().split("T")[0],
    mood: 3,
    note: "",
  });
  const [activeTab, setActiveTab] = useState("overview");
  const [moodTip, setMoodTip] = useState("");
  const latestEntriesRef = useRef(null);

  const MOODS = [
    { value: 1, label: "Very Low", color: "bg-red-500", emoji: "😔" },
    { value: 2, label: "Low", color: "bg-orange-500", emoji: "😕" },
    { value: 3, label: "Neutral", color: "bg-yellow-500", emoji: "😐" },
    { value: 4, label: "Good", color: "bg-green-400", emoji: "🙂" },
    { value: 5, label: "Excellent", color: "bg-green-600", emoji: "😁" },
  ];

  const SUGGESTIONS = [
    "I went for a walk in nature today",
    "I practiced meditation for 10 minutes",
    "I connected with a friend",
    "I got enough sleep last night",
    "I exercised today",
    "I ate healthy meals today"
  ];

  useEffect(() => {
    // Define moodTips inside the effect
    const moodTips = [
      "Try some deep breathing exercises if you're feeling stressed.",
      "Remember that it's okay to ask for help when you need it.",
      "Consider taking a short walk to boost your mood.",
      "Talking to someone you trust can often help improve your mood.",
      "Small acts of self-care can make a big difference in how you feel.",
      "Remember that moods are temporary and will change with time."
    ];

    const randomIndex = Math.floor(Math.random() * moodTips.length);
    setMoodTip(moodTips[randomIndex]);
  
    // Load saved entries
    const savedEntries = localStorage.getItem("moodEntries");
  if (savedEntries) {
    setEntries(JSON.parse(savedEntries));
  }
}, []); // Added moodTips

  useEffect(() => {
    if (activeTab === "history" && entries.length > 0) {
      latestEntriesRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [activeTab, entries.length]);

  const saveEntry = () => {
    const updatedEntries = [
      ...entries,
      {
        ...newEntry,
        id: Date.now().toString(),
      },
    ];
    setEntries(updatedEntries);
    localStorage.setItem("moodEntries", JSON.stringify(updatedEntries));
    setNewEntry({
      date: new Date().toISOString().split("T")[0],
      mood: 3,
      note: "",
    });
    setOpen(false);
  };

  const addSuggestionToNote = (suggestion) => {
    setNewEntry({
      ...newEntry,
      note: newEntry.note ? `${newEntry.note}\n• ${suggestion}` : `• ${suggestion}`
    });
  };

  const getLastWeekEntries = () => {
    const today = new Date();
    const lastWeek = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
    return entries.filter((entry) => new Date(entry.date) >= lastWeek);
  };

  const getAverageMood = (entries) => {
    if (entries.length === 0) return 0;
    const sum = entries.reduce((acc, entry) => acc + entry.mood, 0);
    return Math.round((sum / entries.length) * 10) / 10;
  };

  const getMoodTrend = () => {
    if (entries.length < 2) return "neutral";
    
    const sortedEntries = [...entries].sort((a, b) => 
      new Date(a.date).getTime() - new Date(b.date).getTime()
    );
    
    const recentEntries = sortedEntries.slice(Math.max(sortedEntries.length - 5, 0));
    const firstMood = recentEntries[0].mood;
    const lastMood = recentEntries[recentEntries.length - 1].mood;
    
    if (lastMood > firstMood) return "improving";
    if (lastMood < firstMood) return "declining";
    return "stable";
  };

  const lastWeekEntries = getLastWeekEntries();
  const averageMood = getAverageMood(lastWeekEntries);
  const moodTrend = getMoodTrend();

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-xl font-bold text-primary">Mood Tracker</h1>
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
  );
}