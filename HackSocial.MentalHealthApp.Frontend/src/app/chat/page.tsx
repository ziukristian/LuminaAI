"use client"

import { useState, useRef, useEffect } from "react"
import {
  Send,
  Mic,
  MicOff,
  Heart,
  Settings,
  BookOpen,
  BarChart3,
  Phone,
  Smile,
  Meh,
  Frown,
  Wind,
  Brain,
  AlertCircle,
} from "lucide-react"
import { Button } from "@/src/components/ui/button"
import { Card, CardContent } from "@/src/components/ui/card"
import { Avatar, AvatarFallback } from "@/src/components/ui/avatar"
import { Textarea } from "@/src/components/ui/textarea"
import Link from "next/link"

interface Message {
  id: string
  content: string
  sender: "user" | "ai"
  timestamp: Date
  type?: "text" | "mood-check" | "tool-suggestion"
}

export default function ChatPage() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      content:
        "Hi there! I'm your AI Mental Health Buddy. I'm here to listen, support, and help you navigate whatever you're going through. How are you feeling today?",
      sender: "ai",
      timestamp: new Date(),
    },
  ])
  const [inputMessage, setInputMessage] = useState("")
  const [isRecording, setIsRecording] = useState(false)
  const [showMoodCheck, setShowMoodCheck] = useState(false)
  const [showQuickTools, setShowQuickTools] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const sendMessage = () => {
    if (!inputMessage.trim()) return

    const userMessage: Message = {
      id: Date.now().toString(),
      content: inputMessage,
      sender: "user",
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, userMessage])
    setInputMessage("")

    // Simulate AI response
    setTimeout(() => {
      const aiResponse: Message = {
        id: (Date.now() + 1).toString(),
        content: generateAIResponse(inputMessage),
        sender: "ai",
        timestamp: new Date(),
      }
      setMessages((prev) => [...prev, aiResponse])
    }, 1000)
  }

  const generateAIResponse = (userInput: string): string => {
    const responses = [
      "I hear you, and I want you to know that what you're feeling is valid. Can you tell me more about what's been on your mind?",
      "Thank you for sharing that with me. It takes courage to open up. How long have you been feeling this way?",
      "I'm here to support you through this. Would you like to explore some coping strategies together?",
      "That sounds really challenging. You're not alone in this. What usually helps you feel a bit better?",
      "I appreciate you trusting me with this. Let's take this one step at a time. What feels most overwhelming right now?",
    ]
    return responses[Math.floor(Math.random() * responses.length)]
  }

  const handleMoodSelection = (mood: string) => {
    const moodMessage: Message = {
      id: Date.now().toString(),
      content: `I'm feeling ${mood} today`,
      sender: "user",
      timestamp: new Date(),
      type: "mood-check",
    }
    setMessages((prev) => [...prev, moodMessage])
    setShowMoodCheck(false)

    // AI response to mood
    setTimeout(() => {
      const aiResponse: Message = {
        id: (Date.now() + 1).toString(),
        content: `Thank you for sharing that you're feeling ${mood}. I'm here to support you. Would you like to talk about what's contributing to this feeling, or would you prefer to try a quick exercise to help?`,
        sender: "ai",
        timestamp: new Date(),
      }
      setMessages((prev) => [...prev, aiResponse])
    }, 1000)
  }

  return (
    <div className="h-screen bg-gradient-to-br from-sage-50 via-white to-lavender-50 flex flex-col md:flex-row">
      {/* Sidebar - hidden on mobile, shown as overlay when needed */}
      <div className="hidden md:flex w-80 bg-white border-r border-sage-100 flex-col">
        {/* Header */}
        <div className="p-4 border-b border-sage-100">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-br from-sage-400 to-sage-600 rounded-lg flex items-center justify-center">
             <span className="text-white font-bold text-sm">L</span>
            </div>
            <div>
              <h1 className="font-semibold text-sage-900">LUMINA AI</h1>
              <p className="text-sm text-sage-600">Always here for you</p>
            </div>
          </div>
        </div>

        {/* Quick Tools */}
        <div className="p-4 space-y-3">
          <h3 className="text-sm font-medium text-sage-900">Quick Tools</h3>

          <Button
            variant="outline"
            className="w-full justify-start border-sage-200 text-sage-700 hover:bg-sage-50 bg-transparent"
            onClick={() => setShowMoodCheck(true)}
          >
            <Smile className="w-4 h-4 mr-2" />
            Mood Check-in
          </Button>

          <Button
            variant="outline"
            className="w-full justify-start border-sage-200 text-sage-700 hover:bg-sage-50 bg-transparent"
            asChild
          >
            <Link href="/tools/breathing">
              <Wind className="w-4 h-4 mr-2" />
              Breathing Exercise
            </Link>
          </Button>

          <Button
            variant="outline"
            className="w-full justify-start border-sage-200 text-sage-700 hover:bg-sage-50 bg-transparent"
            asChild
          >
            <Link href="/tools/journal">
              <BookOpen className="w-4 h-4 mr-2" />
              Journal Prompt
            </Link>
          </Button>

          <Button
            variant="outline"
            className="w-full justify-start border-sage-200 text-sage-700 hover:bg-sage-50 bg-transparent"
            asChild
          >
            <Link href="/tools/cbt">
              <Brain className="w-4 h-4 mr-2" />
              CBT Exercise
            </Link>
          </Button>
        </div>

        {/* Crisis Support */}
        <div className="p-4 mt-auto">
          <Card className="border-red-200 bg-red-50">
            <CardContent className="p-3">
              <div className="flex items-start space-x-2">
                <AlertCircle className="w-4 h-4 text-red-600 mt-0.5" />
                <div className="space-y-2">
                  <p className="text-sm font-medium text-red-900">Need immediate help?</p>
                  <Button size="sm" className="bg-red-600 hover:bg-red-700 text-white">
                    <Phone className="w-3 h-3 mr-1" />
                    Crisis Support
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Chat Area */}
      <div className="flex-1 flex flex-col min-h-0">
        {/* Mobile Header - only visible on mobile */}
        <div className="md:hidden p-4 border-b border-sage-100 bg-white">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-gradient-to-br from-sage-400 to-sage-600 rounded-lg flex items-center justify-center">
                <Heart className="w-5 h-5 text-white" />
              </div>
              <span className="font-semibold text-sage-900">AI Mental Health Buddy</span>
            </div>
            <div className="flex items-center space-x-2">
              <Button variant="ghost" size="sm" asChild>
                <Link href="/">
                  <BarChart3 className="w-4 h-4" />
                </Link>
              </Button>
            </div>
          </div>
        </div>

        {/* Chat Header */}
        <div className="p-4 border-b border-sage-100 bg-white hidden md:block">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Avatar className="w-8 h-8">
                <AvatarFallback className="bg-sage-100 text-sage-600">AI</AvatarFallback>
              </Avatar>
              <div>
                <p className="font-medium text-sage-900">Your AI Companion</p>
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span className="text-sm text-sage-600">Online & Ready to Help</span>
                </div>
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <Button variant="ghost" size="sm" asChild>
                <Link href="/">
                  <BarChart3 className="w-4 h-4" />
                </Link>
              </Button>
              <Button variant="ghost" size="sm">
                <Settings className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.map((message) => (
            <div key={message.id} className={`flex ${message.sender === "user" ? "justify-end" : "justify-start"}`}>
              <div
                className={`max-w-xs lg:max-w-md px-4 py-3 rounded-2xl ${
                  message.sender === "user" ? "bg-sage-600 text-white" : "bg-white border border-sage-100 text-sage-900"
                }`}
              >
                <p className="text-sm leading-relaxed">{message.content}</p>
                <p className={`text-xs mt-2 ${message.sender === "user" ? "text-sage-200" : "text-sage-500"}`}>
                  {message.timestamp.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                </p>
              </div>
            </div>
          ))}

          {/* Mood Check Modal */}
          {showMoodCheck && (
            <div className="flex justify-center">
              <Card className="border-sage-200 bg-sage-25 max-w-md">
                <CardContent className="p-4">
                  <h3 className="font-medium text-sage-900 mb-3">How are you feeling right now?</h3>
                  <div className="grid grid-cols-3 gap-3">
                    <Button
                      variant="outline"
                      className="flex flex-col items-center p-3 h-auto border-sage-200 hover:bg-sage-50 bg-transparent"
                      onClick={() => handleMoodSelection("happy")}
                    >
                      <Smile className="w-6 h-6 text-green-500 mb-1" />
                      <span className="text-xs">Happy</span>
                    </Button>
                    <Button
                      variant="outline"
                      className="flex flex-col items-center p-3 h-auto border-sage-200 hover:bg-sage-50 bg-transparent"
                      onClick={() => handleMoodSelection("okay")}
                    >
                      <Meh className="w-6 h-6 text-yellow-500 mb-1" />
                      <span className="text-xs">Okay</span>
                    </Button>
                    <Button
                      variant="outline"
                      className="flex flex-col items-center p-3 h-auto border-sage-200 hover:bg-sage-50 bg-transparent"
                      onClick={() => handleMoodSelection("sad")}
                    >
                      <Frown className="w-6 h-6 text-red-500 mb-1" />
                      <span className="text-xs">Sad</span>
                    </Button>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="w-full mt-3 text-sage-600"
                    onClick={() => setShowMoodCheck(false)}
                  >
                    Maybe later
                  </Button>
                </CardContent>
              </Card>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <div className="p-3 md:p-4 border-t border-sage-100 bg-white">
          <div className="flex items-end space-x-2 md:space-x-3">
            <div className="flex-1">
              <Textarea
                placeholder="Share what's on your mind... I'm here to listen."
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyPress={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault()
                    sendMessage()
                  }
                }}
                className="min-h-[44px] max-h-32 border-sage-200 focus:border-sage-400 focus:ring-sage-400 resize-none"
                rows={1}
              />
            </div>

            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                size="sm"
                className={`border-sage-200 ${isRecording ? "bg-red-50 border-red-200" : ""}`}
                onClick={() => setIsRecording(!isRecording)}
              >
                {isRecording ? <MicOff className="w-4 h-4 text-red-600" /> : <Mic className="w-4 h-4 text-sage-600" />}
              </Button>

              <Button
                onClick={sendMessage}
                disabled={!inputMessage.trim()}
                className="bg-sage-600 hover:bg-sage-700 text-white"
              >
                <Send className="w-4 h-4" />
              </Button>
            </div>
          </div>

          <p className="text-xs text-sage-500 mt-2 text-center">
            Your conversations are private and encrypted. Press Enter to send, Shift+Enter for new line.
          </p>
        </div>
      </div>
    </div>
  )
}
