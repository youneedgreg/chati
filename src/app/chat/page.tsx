"use client";

import { useRef, useEffect } from "react";
import { useChat } from "ai/react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { ArrowLeft, Send } from "lucide-react";
import Link from "next/link";

export default function ChatPage() {
  const { messages, input, handleInputChange, handleSubmit, isLoading } = useChat({
    initialMessages: [
      {
        id: "welcome-message",
        role: "assistant",
        content: "Hi there! I'm here to listen and support you. How are you feeling today?",
      },
    ],
  });

  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-100 to-green-200 flex flex-col">
      <div className="container mx-auto px-4 py-6 flex-1 flex flex-col max-w-4xl">
        <div className="mb-4">
          <Link href="/">
            <Button variant="ghost" className="flex items-center gap-2 text-gray-700 hover:text-gray-900">
              <ArrowLeft className="h-5 w-5" />
              Back to Home
            </Button>
          </Link>
        </div>

        <Card className="flex-1 flex flex-col shadow-lg rounded-lg border border-gray-200 bg-white">
          <CardHeader className="border-b bg-gray-100 py-3">
            <CardTitle className="text-center text-lg font-semibold text-gray-800">Chati</CardTitle>
          </CardHeader>

          <CardContent className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
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
          </CardContent>

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
        </Card>
      </div>
    </div>
  );
}
