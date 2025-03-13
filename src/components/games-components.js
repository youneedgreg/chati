"use client";

import { useState, useEffect, useMemo, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
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
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Slider } from "@/components/ui/slider";
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
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Progress } from "@/components/ui/progress";

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

  const updateLastPlayed = useCallback(() => {
    const updatedStats = {
      ...stats,
      lastPlayed: new Date().toISOString()
    };
    setStats(prevStats => ({
      ...prevStats,
      lastPlayed: new Date().toISOString()
    }));
    localStorage.setItem("gameStats", JSON.stringify(updatedStats));
  }, []);
  
  useEffect(() => {
    // Load stats from localStorage
    const savedStats = localStorage.getItem("gameStats");
    if (savedStats) {
      setStats(JSON.parse(savedStats));
    }
    
    // Set last played to today
    updateLastPlayed();
  }, [updateLastPlayed]);
  
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
                const resetStats = {
                  breathingTime: 0,
                  coloringPixels: 0,
                  memoryBestScore: null,
                  memoryGamesPlayed: 0,
                  lastPlayed: new Date().toISOString()
                };
                setStats(resetStats);
                localStorage.setItem("gameStats", JSON.stringify(resetStats));
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
    }, [level]);
    
    useEffect(() => {
      // Reset the game when difficulty changes
      resetGame();
    }, [level, resetGame]);
    
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
  