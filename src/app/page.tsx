"use client";

import { useState, useEffect } from "react";
import { CardHeader, CardTitle } from "@/components/ui/card";
import { MessageCircle, Gamepad2, BookOpen, BarChart2 } from "lucide-react";
import Image from "next/image"; // Import Next.js Image component

// Import our component functions
import { ChatComponent, GamesComponent, JournalComponent, MoodTrackerComponent } from "./../components/components";

type TabType = "chat" | "games" | "journal" | "mood-tracker";

interface NavItemProps {
  icon: React.ReactNode;
  label: string;
  isActive: boolean;
  onClick: () => void;
}

interface FeaturedTopicProps {
  title: string;
  image: string;
  color: string;
  onClick: () => void;
}

// Topic interface for the featured topics
interface Topic {
  id: string;
  title: string;
  image: string;
  color: string;
}

// Function to get time-appropriate greeting
const getGreeting = () => {
  const hour = new Date().getHours();
  if (hour < 12) return "Good morning, User";
  if (hour < 18) return "Good afternoon, User";
  return "Good evening, User";
};

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

const FeaturedTopic = ({ title, image, color, onClick }: FeaturedTopicProps) => {
  return (
    <div 
      className={`relative rounded-lg overflow-hidden cursor-pointer hover:shadow-lg transition-shadow h-36`}
      onClick={onClick}
    >
      <div className="w-full h-full absolute inset-0">
        <Image 
          src={image} 
          alt={title} 
          fill
          sizes="(max-width: 768px) 50vw, 33vw"
          className="object-cover"
          priority={true}
        />
      </div>
      <div className={`absolute inset-0 bg-opacity-60 ${color}`}></div>
      <div className="absolute inset-0 p-4 flex flex-col justify-end">
        <h3 className="text-white font-medium text-sm leading-tight">{title}</h3>
      </div>
    </div>
  );
};

// Mobile Featured Topics Component with proper TypeScript types
interface MobileFeaturedTopicsProps {
  topics: Topic[];
  onTopicClick: (id: string) => void;
}

const MobileFeaturedTopics = ({ topics, onTopicClick }: MobileFeaturedTopicsProps) => {
  return (
    <div className="p-4 pb-20 overflow-y-auto bg-gray-50">
      <h2 className="font-medium text-gray-800 mb-4">Featured Topics</h2>
      <div className="grid grid-cols-2 gap-3">
        {topics.map((topic) => (
          <FeaturedTopic
            key={topic.id}
            title={topic.title}
            image={topic.image}
            color={topic.color}
            onClick={() => onTopicClick(topic.id)}
          />
        ))}
      </div>
    </div>
  );
};

export default function ChatiApp() {
  const [activeTab, setActiveTab] = useState<TabType>("chat");
  const [, setIsMobile] = useState<boolean>(false);
  const [activeTopic, setActiveTopic] = useState<string | null>(null);
  const [greeting, setGreeting] = useState<string>("");
  const [showMobileChat, setShowMobileChat] = useState<boolean>(false);
  
  // Set up greeting based on time of day
  useEffect(() => {
    const timeBasedGreeting = getGreeting();
    setGreeting(timeBasedGreeting);
    
    // Update greeting every hour
    const intervalId = setInterval(() => {
      const updatedGreeting = getGreeting();
      setGreeting(updatedGreeting);
    }, 3600000); // 1 hour in milliseconds
    
    return () => clearInterval(intervalId);
  }, []);
  
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

  const featuredTopics: Topic[] = [
    { 
      id: "anxiety", 
      title: "Managing anxiety in daily life", 
      image: "/api/placeholder/280/180", 
      color: "bg-blue-500" 
    },
    { 
      id: "procrastination", 
      title: "You CAN stop procrastinating", 
      image: "/api/placeholder/280/180", 
      color: "bg-purple-500" 
    },
    { 
      id: "plant-therapy", 
      title: "Plant therapy and mindfulness", 
      image: "/api/placeholder/280/180", 
      color: "bg-green-600" 
    },
    { 
      id: "sleep", 
      title: "Sleep hygiene tips", 
      image: "/api/placeholder/280/180", 
      color: "bg-indigo-500" 
    },
    { 
      id: "wellness-trends", 
      title: "Health and wellness trends of 2024", 
      image: "/api/placeholder/280/180", 
      color: "bg-teal-500" 
    }
  ];

  const handleTopicClick = (topicId: string) => {
    setActiveTopic(topicId);
    setActiveTab("chat");
    setShowMobileChat(true);
  };
  
  // Handle tab changes
  const handleTabChange = (tabId: TabType) => {
    setActiveTab(tabId);
    // If changing to chat tab, show the chat component on mobile
    if (tabId === "chat") {
      setShowMobileChat(true);
    } else {
      setShowMobileChat(false);
    }
  };

  // Render mobile content based on active tab and chat visibility
  const renderMobileContent = () => {
    if (activeTab === "chat") {
      return showMobileChat ? (
        <ChatComponent activeTopic={activeTopic} />
      ) : (
        <MobileFeaturedTopics topics={featuredTopics} onTopicClick={handleTopicClick} />
      );
    } else if (activeTab === "games") {
      return <GamesComponent />;
    } else if (activeTab === "journal") {
      return <JournalComponent />;
    } else if (activeTab === "mood-tracker") {
      return <MoodTrackerComponent />;
    }
  };
  
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-100 to-green-200 flex flex-col">
      <div className="flex h-screen">
        {/* Left Sidebar for larger screens */}
        <div className="hidden md:flex flex-col fixed left-0 top-0 bottom-0 w-64 bg-white border-r border-gray-200 p-4 space-y-2 shadow-lg z-10">
          <div className="mb-6 px-4">
            <CardTitle className="text-xl font-bold text-gray-800 mb-1">CHATI</CardTitle>
            <p className="text-sm text-gray-600">{greeting}</p>
          </div>
          
          {navItems.map((item) => (
            <NavItem 
              key={item.id}
              icon={item.icon}
              label={item.label}
              isActive={activeTab === item.id}
              onClick={() => handleTabChange(item.id)}
            />
          ))}
        </div>
        
        {/* Featured Topics Section - visible only on larger screens */}
        <div className="hidden md:flex flex-col fixed left-64 top-0 bottom-0 w-64 bg-gray-50 border-r border-gray-200 p-4 overflow-y-auto">
          <h2 className="font-medium text-gray-800 mb-4">Featured Topics</h2>
          <div className="grid gap-4">
            {featuredTopics.map((topic) => (
              <FeaturedTopic
                key={topic.id}
                title={topic.title}
                image={topic.image}
                color={topic.color}
                onClick={() => handleTopicClick(topic.id)}
              />
            ))}
          </div>
        </div>
        
        {/* Main Content Area */}
        <div className="flex-grow w-full md:pl-128 h-full"> {/* 128 = 64px sidebar + 64px topics */}
          {/* Desktop Content */}
          <div className="h-full pb-16 md:pb-0 hidden md:block">
            <div className="h-full bg-white md:rounded-none">
              <div className="h-full">
                {activeTab === "chat" && (
                  <ChatComponent activeTopic={activeTopic} />
                )}
                {activeTab === "games" && <GamesComponent />}
                {activeTab === "journal" && <JournalComponent />}
                {activeTab === "mood-tracker" && <MoodTrackerComponent />}
              </div>
            </div>
          </div>
          
          {/* Mobile Content */}
          <div className="h-full md:hidden">
            <div className="h-full bg-white">
              <CardHeader className="border-b bg-gray-100 py-3">
                <CardTitle className="text-center text-lg font-semibold text-gray-800">CHATI</CardTitle>
                <p className="text-center text-sm text-gray-600">{greeting}</p>
                
                {/* Back to topics button - only show when in chat and topics were clicked */}
                {showMobileChat && activeTab === "chat" && (
                  <button 
                    onClick={() => setShowMobileChat(false)} 
                    className="absolute left-4 top-4 text-gray-600 text-sm flex items-center"
                  >
                    <span className="mr-1">←</span> Topics
                  </button>
                )}
              </CardHeader>
              
              <div className="h-full">
                {renderMobileContent()}
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
            onClick={() => handleTabChange(item.id)}
          />
        ))}
      </div>
    </div>
  );
}