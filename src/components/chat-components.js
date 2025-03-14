"use client";

import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Send, Loader2, Trash2 } from "lucide-react";

// Initial messages for different topics
const topicMessages = {
  "anxiety": "I'd like to discuss managing anxiety in daily life.",
  "procrastination": "I keep putting things off. Can you help me stop procrastinating?",
  "plant-therapy": "I'm interested in using plants for mindfulness and mental health. Any advice?",
  "sleep": "I'm having trouble sleeping. Do you have any sleep hygiene tips?",
  "wellness-trends": "What are the latest health and wellness trends of 2024?",
};

export function ChatComponent({ activeTopic }) {
  const [messages, setMessages] = useState([
    {
      id: "welcome-message",
      role: "assistant",
      content: "Hi there! I'm CHATI, your wellness assistant. How are you feeling today?",
    },
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);
  const [topicLoaded, setTopicLoaded] = useState(null);

  // Improved API call function 
  const callChatAPI = async (messageHistory) => {
    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          messages: messageHistory
        }),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to fetch response');
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error calling chat API:', error);
      throw error;
    }
  };

  // Format long messages with proper paragraph breaks
  const formatMessage = (content) => {
    if (!content) return "";
    
    // Ensure paragraphs are properly displayed
    return content.split('\n').map((paragraph, index) => (
      <p key={index} className={index > 0 ? "mt-2" : ""}>
        {paragraph}
      </p>
    ));
  };

  // Handle topic changes
  useEffect(() => {
    if (activeTopic && activeTopic !== topicLoaded && topicMessages[activeTopic]) {
      // Add user message for the selected topic
      const newUserMessage = {
        id: `topic-${activeTopic}`,
        role: "user",
        content: topicMessages[activeTopic]
      };
      
      setIsLoading(true);
      
      // Create a function to handle the API call
      const fetchAssistantResponse = async () => {
        try {
          const data = await callChatAPI([
            messages[0], // Keep just the welcome message
            newUserMessage
          ]);
          
          // Add assistant response
          const newAssistantMessage = {
            id: `response-${Date.now()}`,
            role: "assistant",
            content: data.content || `I'd be happy to chat about ${activeTopic.replace(/-/g, ' ')}. What specific aspects would you like to explore?`
          };
          
          // Set the messages with the new topic
          setMessages([
            messages[0], // Keep the welcome message
            newUserMessage,
            newAssistantMessage
          ]);
          
        } catch (err) {
          console.error('Error in fetchAssistantResponse:', err);
          
          // Fallback message in case of error
          const fallbackMessage = {
            id: `response-${Date.now()}`,
            role: "assistant",
            content: `I'd be happy to chat about ${activeTopic.replace(/-/g, ' ')}. What specific aspects would you like to explore?`
          };
          
          setMessages([
            messages[0],
            newUserMessage,
            fallbackMessage
          ]);
        } finally {
          setIsLoading(false);
        }
      };
      
      fetchAssistantResponse();
      
      // Mark this topic as loaded
      setTopicLoaded(activeTopic);
    }
  }, [activeTopic, topicLoaded, messages]);

  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Focus input when component loads
  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);

  // Handle input change
  const handleInputChange = (e) => {
    setInput(e.target.value);
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!input.trim() || isLoading) return;
    
    // Add user message
    const userMessage = {
      id: `user-${Date.now()}`,
      role: "user",
      content: input
    };
    
    // Update messages with user message
    const updatedMessages = [...messages, userMessage];
    setMessages(updatedMessages);
    
    // Clear input
    setInput("");
    
    // Set loading state
    setIsLoading(true);
    
    try {
      // Call the API
      const data = await callChatAPI(updatedMessages);
      
      // Add assistant response
      const assistantMessage = {
        id: `assistant-${Date.now()}`,
        role: "assistant",
        content: data.content
      };
      
      setMessages([...updatedMessages, assistantMessage]);
      
    } catch (err) {
      console.error('Error in handleSubmit:', err);
      
      // Add error message
      const errorMessage = {
        id: `error-${Date.now()}`,
        role: "assistant",
        content: "I'm sorry, I'm having trouble connecting right now. Please try again later."
      };
      
      setMessages([...updatedMessages, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  // Clear chat history
  const handleClearChat = () => {
    setMessages([
      {
        id: "welcome-message",
        role: "assistant",
        content: "Hi there! I'm CHATI, your wellness assistant. How are you feeling today?",
      },
    ]);
    setTopicLoaded(null);
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };

  return (
    <div className="flex-1 flex flex-col h-full relative shadow-md overflow-hidden">
      <div className="bg-gradient-to-r from-blue-600 to-blue-700 p-3 flex justify-between items-center border-b">
        <div className="flex items-center gap-2">
          <Avatar className="h-8 w-8 border-2 border-white">
            <AvatarImage src="/image-4.png" alt="CHATI Logo" />
            <AvatarFallback className="bg-blue-800 text-white">CH</AvatarFallback>
          </Avatar>
          <span className="font-semibold text-white text-lg">CHATI</span>
        </div>
        <div className="flex gap-2">
          <Button 
            onClick={handleClearChat} 
            variant="ghost" 
            size="icon" 
            className="h-8 w-8 rounded-full bg-white/10 hover:bg-white/20 text-white"
            title="Clear chat"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50 pb-20">
        {messages.map((message) => (
          <div key={message.id} className={`flex ${message.role === "user" ? "justify-end" : "justify-start"} animate-fadeIn`}>
            <div className="flex items-start gap-3 max-w-[85%]">
              {message.role === "assistant" && (
                <Avatar className="mt-1 flex-shrink-0 border border-gray-200">
                  <AvatarImage src="/image-4.png" alt="CHATI Logo" />
                  <AvatarFallback className="bg-blue-600 text-white">CH</AvatarFallback>
                </Avatar>
              )}

              <div
                className={`p-3 rounded-xl ${
                  message.role === "user"
                    ? "bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-br-none"
                    : "bg-white text-gray-800 rounded-bl-none border border-gray-200 shadow-sm"
                } break-words`}
              >
                {formatMessage(message.content)}
              </div>

              {message.role === "user" && (
                <Avatar className="mt-1 flex-shrink-0 border border-gray-200">
                  <AvatarFallback className="bg-gradient-to-br from-gray-600 to-gray-700 text-white">You</AvatarFallback>
                </Avatar>
              )}
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
        
        {/* Loading indicator */}
        {isLoading && (
          <div className="flex justify-start animate-fadeIn">
            <div className="flex items-start gap-3 max-w-[85%]">
              <Avatar className="mt-1 flex-shrink-0 border border-gray-200">
                <AvatarImage src="/image-4.png" alt="CHATI Logo" />
                <AvatarFallback className="bg-blue-600 text-white">CH</AvatarFallback>
              </Avatar>
              <div className="p-3 rounded-xl shadow-sm bg-white text-gray-800 rounded-bl-none border border-gray-200 flex items-center">
                <Loader2 className="h-5 w-5 animate-spin text-blue-500 mr-2" />
                <span>Thinking...</span>
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="absolute bottom-0 left-0 right-0 border-t bg-white p-4">
        <form onSubmit={handleSubmit} className="flex w-full gap-2">
          <Input
            ref={inputRef}
            value={input}
            onChange={handleInputChange}
            placeholder="Type your message here..."
            className="flex-1 border border-gray-300 focus:border-blue-500 focus:ring-blue-500 shadow-sm rounded-full px-4 py-2"
            disabled={isLoading}
            onKeyDown={(e) => e.key === 'Enter' && handleSubmit(e)}
          />
          <Button
            type="submit"
            className={`${
              isLoading || !input.trim() 
                ? "bg-gray-400 cursor-not-allowed" 
                : "bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700"
            } transition-all duration-200 text-white px-4 py-2 rounded-full shadow-md`}
            disabled={isLoading || !input.trim()}
          >
            {isLoading ? (
              <Loader2 className="h-5 w-5 animate-spin" />
            ) : (
              <Send className="h-5 w-5" />
            )}
          </Button>
        </form>
      </div>

      {/* Add custom CSS for animations */}
      <style jsx global>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out forwards;
        }
      `}</style>
    </div>
  );
}