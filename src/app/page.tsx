"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, MessageCircle, Gamepad2, BookOpen, BarChart2 } from "lucide-react";
import Link from "next/link";

// Import our component functions
import { ChatComponent, GamesComponent, JournalComponent, MoodTrackerComponent } from "./../components/components";

export default function ChatiApp() {
  const [activeTab, setActiveTab] = useState("chat");
  
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-100 to-green-200 flex flex-col">
      <div className="container mx-auto px-4 py-6 flex-1 flex flex-col max-w-4xl">
        <div className="mb-4">
        </div>
        
        <Card className="flex-1 flex flex-col shadow-lg rounded-lg border border-gray-200 bg-white">
          <CardHeader className="border-b bg-gray-100 py-3">
            <CardTitle className="text-center text-lg font-semibold text-gray-800">CHATI</CardTitle>
          </CardHeader>
          
          {/* Tab Content */}
          <CardContent className="p-0 flex-1 flex flex-col overflow-hidden">
            {activeTab === "chat" && <ChatComponent />}
            {activeTab === "games" && <GamesComponent />}
            {activeTab === "journal" && <JournalComponent />}
            {activeTab === "mood-tracker" && <MoodTrackerComponent />}
          </CardContent>
          
          {/* Tab Navigation */}
          <div className="bg-white border-t border-gray-200 flex">
            <button
              onClick={() => setActiveTab("chat")}
              className={`flex-1 py-3 flex flex-col items-center justify-center ${
                activeTab === "chat" ? "text-blue-600 border-t-2 border-blue-600" : "text-gray-500"
              }`}
            >
              <MessageCircle className="h-5 w-5" />
              <span className="text-xs mt-1">Chat</span>
            </button>
            <button
              onClick={() => setActiveTab("games")}
              className={`flex-1 py-3 flex flex-col items-center justify-center ${
                activeTab === "games" ? "text-blue-600 border-t-2 border-blue-600" : "text-gray-500"
              }`}
            >
              <Gamepad2 className="h-5 w-5" />
              <span className="text-xs mt-1">Games</span>
            </button>
            <button
              onClick={() => setActiveTab("journal")}
              className={`flex-1 py-3 flex flex-col items-center justify-center ${
                activeTab === "journal" ? "text-blue-600 border-t-2 border-blue-600" : "text-gray-500"
              }`}
            >
              <BookOpen className="h-5 w-5" />
              <span className="text-xs mt-1">Journal</span>
            </button>
            <button
              onClick={() => setActiveTab("mood-tracker")}
              className={`flex-1 py-3 flex flex-col items-center justify-center ${
                activeTab === "mood-tracker" ? "text-blue-600 border-t-2 border-blue-600" : "text-gray-500"
              }`}
            >
              <BarChart2 className="h-5 w-5" />
              <span className="text-xs mt-1">Mood</span>
            </button>
          </div>
        </Card>
      </div>
    </div>
  );
}