"use client";

import { useEffect, useRef, useState } from "react";
import { useChat } from "@ai-sdk/react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Send } from "lucide-react";

// Initial messages for different topics
const topicMessages = {
  "anxiety": "I'd like to discuss managing anxiety in daily life.",
  "procrastination": "I keep putting things off. Can you help me stop procrastinating?",
  "plant-therapy": "I'm interested in using plants for mindfulness and mental health. Any advice?",
  "sleep": "I'm having trouble sleeping. Do you have any sleep hygiene tips?",
  "wellness-trends": "What are the latest health and wellness trends of 2024?",
};

export function ChatComponent({ activeTopic }) {
  const { messages, input, handleInputChange, handleSubmit, isLoading, setMessages } = useChat({
    initialMessages: [
      {
        id: "welcome-message",
        role: "assistant",
        content: "Hi there! I'm here to listen and support you. How are you feeling today?",
      },
    ],
  });

  const messagesEndRef = useRef(null);
  const [topicLoaded, setTopicLoaded] = useState(null);

  // Handle topic changes
  useEffect(() => {
    if (activeTopic && activeTopic !== topicLoaded && topicMessages[activeTopic]) {
      // Add user message for the selected topic
      const newUserMessage = {
        id: `topic-${activeTopic}`,
        role: "user",
        content: topicMessages[activeTopic]
      };
      
      // Add assistant response acknowledging the topic
      const newAssistantMessage = {
        id: `response-${activeTopic}`,
        role: "assistant",
        content: `I'd be happy to chat about ${activeTopic.replace(/-/g, ' ')}. What specific aspects would you like to explore?`
      };
      
      // Set the messages with the new topic
      setMessages([
        messages[0], // Keep the welcome message
        newUserMessage,
        newAssistantMessage
      ]);
      
      // Mark this topic as loaded
      setTopicLoaded(activeTopic);
    }
  }, [activeTopic, topicLoaded, messages, setMessages]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <div className="flex-1 flex flex-col h-full relative">
      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50 pb-20">
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

      <div className="absolute bottom-0 left-0 right-0 border-t bg-white p-4">
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
      </div>
    </div>
  );
}