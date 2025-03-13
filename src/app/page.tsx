"use client";

import { useState, useEffect } from "react";
import {  CardHeader, CardTitle } from "@/components/ui/card";
import { MessageCircle, Gamepad2, BookOpen, BarChart2 } from "lucide-react";

// Import our component functions
import { ChatComponent, GamesComponent, JournalComponent, MoodTrackerComponent } from "./../components/components";

type TabType = "chat" | "games" | "journal" | "mood-tracker";

interface NavItemProps {
  icon: React.ReactNode;
  label: string;
  isActive: boolean;
  onClick: () => void;
}

const NavItem = ({ icon, label, isActive, onClick }: NavItemProps) => {
  return (
    <button
      onClick={onClick}
      className={`flex items-center gap-3 py-3 px-4 w-full rounded-lg transition-colors ${
        isActive 
          ? "bg-blue-100 text-blue-600 font-medium" 
          : "text-gray-600 hover:bg-gray-100"
      }`}
    >
      {icon}
      <span>{label}</span>
    </button>
  );
};

const MobileNavItem = ({ icon, label, isActive, onClick }: NavItemProps) => {
  return (
    <button
      onClick={onClick}
      className={`flex-1 py-3 flex flex-col items-center justify-center ${
        isActive ? "text-blue-600 border-t-2 border-blue-600" : "text-gray-500"
      }`}
    >
      {icon}
      <span className="text-xs mt-1">{label}</span>
    </button>
  );
};

export default function ChatiApp() {
  const [activeTab, setActiveTab] = useState<TabType>("chat");
  const [, setIsMobile] = useState<boolean>(false);
  
  // Check screen size on mount and when window resizes
  useEffect(() => {
    const checkScreenSize = () => {
      setIsMobile(window.innerWidth < 768); // Set breakpoint at md (768px)
    };
    
    // Initial check
    checkScreenSize();
    
    // Listen for resize events
    window.addEventListener("resize", checkScreenSize);
    
    // Cleanup
    return () => window.removeEventListener("resize", checkScreenSize);
  }, []);

  const navItems = [
    { id: "chat" as TabType, label: "Chat", icon: <MessageCircle className="h-5 w-5" /> },
    { id: "games" as TabType, label: "Games", icon: <Gamepad2 className="h-5 w-5" /> },
    { id: "journal" as TabType, label: "Journal", icon: <BookOpen className="h-5 w-5" /> },
    { id: "mood-tracker" as TabType, label: "Mood Tracker", icon: <BarChart2 className="h-5 w-5" /> }
  ];
  
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-100 to-green-200 flex flex-col">
      <div className="flex h-screen">
        {/* Left Sidebar for larger screens */}
        <div className="hidden md:flex flex-col fixed left-0 top-0 bottom-0 w-64 bg-white border-r border-gray-200 p-4 space-y-2 shadow-lg z-10">
          <CardTitle className="text-xl font-bold text-gray-800 mb-6 px-4">CHATI</CardTitle>
          
          {navItems.map((item) => (
            <NavItem 
              key={item.id}
              icon={item.icon}
              label={item.label}
              isActive={activeTab === item.id}
              onClick={() => setActiveTab(item.id)}
            />
          ))}
        </div>
        
        {/* Main Content Area */}
        <div className="flex-grow w-full md:pl-64">
          {/* Content Container */}
          <div className="h-full pb-16 md:pb-0">
            <div className="h-full bg-white md:rounded-none">
              <CardHeader className="md:hidden border-b bg-gray-100 py-3">
                <CardTitle className="text-center text-lg font-semibold text-gray-800">CHATI</CardTitle>
              </CardHeader>
              
              <div className="h-full">
                {activeTab === "chat" && <ChatComponent />}
                {activeTab === "games" && <GamesComponent />}
                {activeTab === "journal" && <JournalComponent />}
                {activeTab === "mood-tracker" && <MoodTrackerComponent />}
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Fixed Mobile Tab Navigation */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 flex z-10">
        {navItems.map((item) => (
          <MobileNavItem
            key={item.id}
            icon={item.icon}
            label={item.label}
            isActive={activeTab === item.id}
            onClick={() => setActiveTab(item.id)}
          />
        ))}
      </div>
    </div>
  );
}