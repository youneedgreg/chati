"use client";

import { useState, useEffect } from "react";
import { CardHeader, CardTitle } from "@/components/ui/card";
import { MessageCircle, Gamepad2, BookOpen, BarChart2, Heart, CloudSun, Brain, Smile } from "lucide-react";
import Image from "next/image";
import { motion } from "framer-motion";

// Import our component functions
import { ChatComponent, GamesComponent, JournalComponent, MoodTrackerComponent } from "./../components/components";
import { Navbar } from "./../components/Navbar"; // Import the Navbar component

// Topic interface for the featured topics
interface Topic {
  id: string;
  title: string;
  image: string;
  color: string;
}

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

// Mindful Loader Component
function MindfulLoader() {
  const icons = [
    { component: Heart, color: "text-pink-500" },
    { component: CloudSun, color: "text-blue-400" },
    { component: Brain, color: "text-purple-500" },
    { component: Smile, color: "text-yellow-500" }
  ];

  return (
    <div className="fixed inset-0 bg-gradient-to-b from-blue-100 to-green-200 flex flex-col items-center justify-center z-50">
      <div className="bg-white p-8 rounded-xl shadow-lg flex flex-col items-center">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">CHATI</h2>
        <div className="flex space-x-4 mb-6">
          {icons.map((Icon, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 10 }}
              animate={{ 
                opacity: [0.2, 1, 0.2], 
                y: [0, -15, 0],
                rotate: [0, 5, 0, -5, 0]
              }}
              transition={{ 
                duration: 2, 
                repeat: Infinity, 
                delay: index * 0.3 
              }}
              className={`${Icon.color}`}
            >
              <Icon.component size={32} />
            </motion.div>
          ))}
        </div>
        <p className="text-gray-600 text-center font-medium mb-2">Taking a moment to center...</p>
        <p className="text-gray-500 text-sm text-center">Your wellness journey is about to begin</p>
        <div className="mt-6 flex space-x-3">
          {[0, 1, 2].map((dot) => (
            <motion.div
              key={dot}
              className="h-3 w-3 bg-green-500 rounded-full"
              initial={{ opacity: 0.3 }}
              animate={{ opacity: [0.3, 1, 0.3] }}
              transition={{ 
                duration: 1.5, 
                repeat: Infinity, 
                delay: dot * 0.4
              }}
            />
          ))}
        </div>
      </div>
    </div>
  );
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
      {/* New Brainstorm and Learn Sections */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-medium text-gray-800">Quick Access</h2>
        </div>
        
        <div className="grid grid-cols-2 gap-3">
          {/* Brainstorm Ideas Section */}
          <div 
            className="relative rounded-lg overflow-hidden cursor-pointer hover:shadow-lg transition-shadow h-24"
            onClick={() => onTopicClick('brainstorm')}
          >
            <div className="w-full h-full absolute inset-0">
              <Image 
                src="/image.png" 
                alt="Brainstorm Ideas" 
                fill
                sizes="(max-width: 768px) 50vw, 33vw"
                className="object-cover"
                priority={true}
              />
            </div>
            <div className="absolute inset-0 bg-opacity-70 bg-yellow-500"></div>
            <div className="absolute inset-0 p-4 flex flex-col justify-center items-center">
              <h3 className="text-white font-bold text-center text-sm leading-tight">Brainstorm Ideas</h3>
            </div>
          </div>
          
          {/* Learn Something New Section */}
          <div 
            className="relative rounded-lg overflow-hidden cursor-pointer hover:shadow-lg transition-shadow h-24"
            onClick={() => onTopicClick('learn')}
          >
            <div className="w-full h-full absolute inset-0">
              <Image 
                src="/api/placeholder/280/180" 
                alt="Learn Something New" 
                fill
                sizes="(max-width: 768px) 50vw, 33vw"
                className="object-cover"
                priority={true}
              />
            </div>
            <div className="absolute inset-0 bg-opacity-70 " ></div>
            <div className="absolute inset-0 p-4 flex flex-col justify-center items-center">
              <h3 className="text-white font-bold text-center text-sm leading-tight">Learn Something New</h3>
            </div>
          </div>
        </div>
      </div>
      
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
  const [activeTopic, setActiveTopic] = useState<string | undefined>();
  const [greeting, setGreeting] = useState<string>("");
  const [showMobileChat, setShowMobileChat] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  
  // Set up greeting based on time of day and handle initial loading
  useEffect(() => {
    const timeBasedGreeting = getGreeting();
    setGreeting(timeBasedGreeting);
    
    // Simulate loading for a better experience
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 2000); // Show loader for 2 seconds for a better UX
    
    // Update greeting every hour
    const intervalId = setInterval(() => {
      const updatedGreeting = getGreeting();
      setGreeting(updatedGreeting);
    }, 3600000); // 1 hour in milliseconds
    
    return () => {
      clearInterval(intervalId);
      clearTimeout(timer);
    };
  }, []);
  
  // Check if we're on mobile for responsive display
  useEffect(() => {
    const checkScreenSize = () => {
      const isMobileView = window.innerWidth < 768; // Set breakpoint at md (768px)
      
      // Only set showMobileChat to false if we're on mobile and it's currently true
      if (isMobileView && showMobileChat && activeTab !== "chat") {
        setShowMobileChat(false);
      }
    };
    
    // Initial check
    checkScreenSize();
    
    // Listen for resize events
    window.addEventListener("resize", checkScreenSize);
    
    // Cleanup
    return () => window.removeEventListener("resize", checkScreenSize);
  }, [activeTab, showMobileChat]);

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
  
  // Show loader while initializing
  if (isLoading) {
    return <MindfulLoader />;
  }
  
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-100 to-green-200 flex flex-col">
      {/* Add the Navbar at the top */}
      <Navbar />
      
      <div className="flex h-screen pt-16"> {/* Add padding top to account for navbar height */}
        {/* Left Sidebar for larger screens */}
        <div className="hidden md:flex flex-col fixed left-0 top-16 bottom-0 w-64 bg-white border-r border-gray-200 p-4 space-y-2 shadow-lg z-10">
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
        <div className="hidden md:flex flex-col fixed left-64 top-16 bottom-0 w-64 bg-gray-50 border-r border-gray-200 p-4 overflow-y-auto">
          {/* Quick Access Section */}
          <div className="mb-6">
            <h2 className="font-medium text-gray-800 mb-4">Quick Access</h2>
            <div className="grid gap-3">
              {/* Brainstorm Ideas Section */}
              <div 
                className="relative rounded-lg overflow-hidden cursor-pointer hover:shadow-lg transition-shadow h-24"
                onClick={() => handleTopicClick('brainstorm')}
              >
                <div className="w-full h-full absolute inset-0">
                  <Image 
                    src="/api/placeholder/280/180" 
                    alt="Brainstorm Ideas" 
                    fill
                    sizes="(max-width: 768px) 50vw, 33vw"
                    className="object-cover"
                    priority={true}
                  />
                </div>
                <div className="absolute inset-0 bg-opacity-70 bg-yellow-500"></div>
                <div className="absolute inset-0 p-4 flex flex-col justify-center items-center">
                  <h3 className="text-white font-bold text-center text-sm leading-tight">Brainstorm Ideas</h3>
                </div>
              </div>
              
              {/* Learn Something New Section */}
              <div 
                className="relative rounded-lg overflow-hidden cursor-pointer hover:shadow-lg transition-shadow h-24"
                onClick={() => handleTopicClick('learn')}
              >
                <div className="w-full h-full absolute inset-0">
                  <Image 
                    src="/api/placeholder/280/180" 
                    alt="Learn Something New" 
                    fill
                    sizes="(max-width: 768px) 50vw, 33vw"
                    className="object-cover"
                    priority={true}
                  />
                </div>
                <div className="absolute inset-0 bg-opacity-70 bg-emerald-500"></div>
                <div className="absolute inset-0 p-4 flex flex-col justify-center items-center">
                  <h3 className="text-white font-bold text-center text-sm leading-tight">Learn Something New</h3>
                </div>
              </div>
            </div>
          </div>
          
          {/* Original Featured Topics */}
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