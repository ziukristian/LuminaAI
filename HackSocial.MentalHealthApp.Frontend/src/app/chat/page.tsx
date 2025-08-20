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
  Plus,
  MessageSquare,
  Clock,
  Trash2,
  Menu,
  ChevronLeft,
  LayoutDashboard
} from "lucide-react"
import { Button } from "@/src/components/ui/button"
import { Card, CardContent } from "@/src/components/ui/card"
import { Avatar, AvatarFallback } from "@/src/components/ui/avatar"
import { Textarea } from "@/src/components/ui/textarea"
import Link from "next/link"
import { SidebarHeader } from "@/src/components/ui/sidebar"
import apiHandler, { IChat, IMessage } from "@/src/data/api/apiHandler"
import { v4 as uuidv4 } from "uuid"

interface Message {
  id: string
  content: string
  isUserMessage: boolean
  timestamp: Date | string
  type?: "text" | "mood-check" | "tool-suggestion"
  isTempMessage?: boolean
  failed?: boolean
}

interface ChatUI {
  id: string
  title: string
  lastMessage: string
  timestamp: Date
}

export default function ChatPage() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      content:
        "Hi there! I'm your AI Mental Health Buddy. I'm here to listen, support, and help you navigate whatever you're going through. How are you feeling today?",
      isUserMessage: false,
      timestamp: new Date(),
    },
  ])
  const [chats, setChats] = useState<ChatUI[]>([])
  const [currentChatId, setCurrentChatId] = useState("1")
  const [inputMessage, setInputMessage] = useState("")
  const [isRecording, setIsRecording] = useState(false)
  const [showMoodCheck, setShowMoodCheck] = useState(false)
  const [mobileView, setMobileView] = useState<"sidebar" | "chat">("sidebar")
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

 useEffect(() => {
  async function fetchChats() {
    try {
      const data = await apiHandler.chats.list() 
      setChats(
        data.map(chat => ({
          id: chat.id,
          title: chat.name,    
          lastMessage: "",   
          timestamp: new Date(chat.timestamp)
        }))
      )
    } catch (err) {
      console.error("Error loading chats:", err)
    }
  }
  fetchChats()
}, [])

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const createNewChat = async () => {
  try {
    const newChat = await apiHandler.chats.create({
      name: `New Chat ${Date.now()}` 
      ,
      id: "",
      timestamp: ""
    })

    setChats(prev => [
  {
    id: newChat.id,
    title: newChat.name,
    lastMessage: "",
    timestamp: new Date(newChat.timestamp)
  },
  ...prev
])

    setCurrentChatId(newChat.id)
    setMessages([{
      id: "init",
      content: "Hi there! I'm your AI Mental Health Buddy. How are you feeling today?",
      isUserMessage: false,
      timestamp: new Date()
    }])
    setMobileView("chat")
  } catch (err) {
  if (err instanceof Error) {
    console.error("Error creating chat:", err.message)
  } else {
    console.error("Error creating chat:", err)
  }
}
}

 const switchChat = async (chatId: string) => {
  setCurrentChatId(chatId)
  try {
    const msgs = await apiHandler.chats.listMessages(chatId)
    setMessages(
      msgs.map(m => ({
        id: m.id,
        content: m.content,
        isUserMessage: m.isUserMessage,
        timestamp: new Date(m.timestamp)
      }))
    )
    setMobileView("chat")
  } catch (err) {
    console.error("Error loading messages:", err)
  }
}

 const deleteChat = async (chatId: string, e: React.MouseEvent) => {
  e.stopPropagation()
  try {
    await apiHandler.chats.delete(chatId)
    setChats(prev => prev.filter(chat => chat.id !== chatId))
    if (chatId === currentChatId) {
      setCurrentChatId("")
      setMessages([])
    }
  } catch (err) {
    console.error("Error deleting chat:", err)
  }
}

const sendMessage = async () => {
  if (!inputMessage.trim() || !currentChatId) return;

  // Generate a temporary ID for the user message
  const tempId = uuidv4();
  
  // Create and display the user message immediately with a temporary ID
  const userMessage: Message = {
    id: tempId,
    content: inputMessage,
    isUserMessage: true,
    timestamp: new Date(),
    isTempMessage: true // Flag to identify this as a temporary message
  };

  setMessages(prev => [...prev, userMessage]);
  setInputMessage("");

  try {
    // Send message to the API
    const response = await apiHandler.chats.sendMessage(currentChatId, {
      content: inputMessage,
      sender: "user", // Keep this as is for API compatibility
      userId: "USER_ID",
    });
    
    // Handle the response which contains both system and user messages
    if (response.systemMessage && response.userMessage) {
      setMessages(prev => {
        // Filter out the temporary message
        const filteredMessages = prev.filter(m => !m.isTempMessage);
        
        // Add the official user message from the API
        const apiUserMessage: Message = {
          id: response.userMessage.id,
          content: response.userMessage.content,
          isUserMessage: response.userMessage.isUserMessage,
          timestamp: new Date(response.userMessage.timestamp)
        };
        
        // Add the system response
        const apiSystemMessage: Message = {
          id: response.systemMessage.id,
          content: response.systemMessage.content,
          isUserMessage: response.systemMessage.isUserMessage,
          timestamp: new Date(response.systemMessage.timestamp)
        };
        
        return [...filteredMessages, apiUserMessage, apiSystemMessage];
      });
    } else {
      // Fallback to the old approach if the response format is different
      const allMessages = await apiHandler.chats.listMessages(currentChatId);
      
      setMessages(prev => {
        // Remove temporary messages
        const filteredMessages = prev.filter(m => !m.isTempMessage);
        
        // Get the IDs of existing (non-temporary) messages
        const existingIds = new Set(filteredMessages.map(m => m.id));
        
        // Add new messages from the API
        const newOnes: Message[] = allMessages
          .filter(m => !existingIds.has(m.id))
          .map(m => ({
            id: m.id,
            content: m.content,
            isUserMessage: m.isUserMessage,
            timestamp: new Date(m.timestamp),
          }));
        
        return [...filteredMessages, ...newOnes];
      });
    }
  } catch (err) {
    console.error("Error sending message:", err);
    // Mark the temporary message as failed
    setMessages(prev =>
      prev.map(msg =>
        msg.id === tempId ? { ...msg, failed: true } : msg
      )
    );
  }
};

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
      isUserMessage: true,
      timestamp: new Date(),
      type: "mood-check",
    }
    setMessages((prev) => [...prev, moodMessage])
    setShowMoodCheck(false)

    setTimeout(() => {
      const aiResponse: Message = {
        id: (Date.now() + 1).toString(),
        content: `Thank you for sharing that you're feeling ${mood}. I'm here to support you. Would you like to talk about what's contributing to this feeling, or would you prefer to try a quick exercise to help?`,
        isUserMessage: false,
        timestamp: new Date(),
      }
      setMessages((prev) => [...prev, aiResponse])
    }, 1000)
  }

  return (
    <div className="h-screen bg-gradient-to-br from-sage-50 via-white to-lavender-50 flex flex-col md:flex-row">
      <div className="hidden md:flex w-80 bg-white border-r border-sage-100 flex-col">
          <SidebarHeader className="border-b border-sage-100 p-6">
  <div className="flex items-center gap-2">
    <div className="w-8 h-8 bg-sage-600 rounded-lg flex items-center justify-center">
      <span className="text-white font-bold text-sm">L</span>
    </div>

    <span className="font-bold text-sage-600 text-lg">LUMINA AI</span>

    <Link href="/dashboard" className="ml-auto">
      <LayoutDashboard className="w-6 h-6 text-sage-600 hover:text-sage-800 cursor-pointer" />
    </Link>
  </div>
</SidebarHeader>
        <div className="p-4 border-b border-sage-100">
          <Button 
            onClick={createNewChat}
            className="w-full bg-sage-600 hover:bg-sage-700 text-white"
          >
            <Plus className="w-4 h-4 mr-2" />
            New chat
          </Button>
        </div>

        <div className="flex-1 overflow-y-auto p-2 space-y-1">
          {chats.map((chat) => (
            <div
              key={chat.id}
              onClick={() => switchChat(chat.id)}
              className={`flex items-center justify-between p-3 rounded-lg cursor-pointer hover:bg-sage-50 ${
                chat.id === currentChatId ? "bg-sage-100" : ""
              }`}
            >
              <div className="flex items-center space-x-3 overflow-hidden">
                <MessageSquare className="w-4 h-4 text-sage-600 flex-shrink-0" />
                <div className="overflow-hidden">
                  <p className="text-sm font-medium text-sage-900 truncate">{chat.title}</p>
                  <p className="text-xs text-sage-500 truncate">{chat.lastMessage}</p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-xs text-sage-500">
                  {chat.timestamp.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                </span>
                <Button
                  variant="ghost"
                  size="icon"
                  className="w-6 h-6 text-sage-500 hover:text-red-500 hover:bg-transparent"
                  onClick={(e) => deleteChat(chat.id, e)}
                >
                  <Trash2 className="w-3 h-3" />
                </Button>
              </div>
            </div>
          ))}
        </div>

        <div className="p-4 space-y-3 border-t border-sage-100">
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
        </div>

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

      {mobileView === "sidebar" && (
        <div className="md:hidden flex-1 flex flex-col bg-white">
              <SidebarHeader className="border-b border-sage-100 p-6">
  <div className="flex items-center justify-between w-full">
    <div className="flex items-center gap-2">
      <div className="w-8 h-8 bg-sage-600 rounded-lg flex items-center justify-center">
        <span className="text-white font-bold text-sm">L</span>
      </div>
      <span className="font-bold text-sage-600 text-lg">LUMINA AI</span>
    </div>

     <Link href="/dashboard">
      <LayoutDashboard className="w-6 h-6 text-sage-600 hover:text-sage-800 cursor-pointer" />
    </Link>
  </div>
</SidebarHeader>
          <div className="p-4 border-b border-sage-100">
            <Button 
              onClick={createNewChat}
              className="w-full bg-sage-600 hover:bg-sage-700 text-white"
            >
              <Plus className="w-4 h-4 mr-2" />
              New chat
            </Button>
          </div>

          <div className="flex-1 overflow-y-auto p-2 space-y-1">
            {chats.map((chat) => (
              <div
                key={chat.id}
                onClick={() => switchChat(chat.id)}
                className={`flex items-center justify-between p-3 rounded-lg cursor-pointer hover:bg-sage-50 ${
                  chat.id === currentChatId ? "bg-sage-100" : ""
                }`}
              >
                <div className="flex items-center space-x-3 overflow-hidden">
                  <MessageSquare className="w-4 h-4 text-sage-600 flex-shrink-0" />
                  <div className="overflow-hidden">
                    <p className="text-sm font-medium text-sage-900 truncate">{chat.title}</p>
                    <p className="text-xs text-sage-500 truncate">{chat.lastMessage}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-xs text-sage-500">
                    {chat.timestamp.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                  </span>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="w-6 h-6 text-sage-500 hover:text-red-500 hover:bg-transparent"
                    onClick={(e) => deleteChat(chat.id, e)}
                  >
                    <Trash2 className="w-3 h-3" />
                  </Button>
                </div>
              </div>
            ))}
          </div>

          <div className="p-4 space-y-3 border-t border-sage-100">
            <h3 className="text-sm font-medium text-sage-900">Quick Tools</h3>
            <Button
              variant="outline"
              className="w-full justify-start border-sage-200 text-sage-700 hover:bg-sage-50 bg-transparent"
              onClick={() => {
                setShowMoodCheck(true)
                setMobileView("chat")
              }}
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
          </div>

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
      )}

      {(mobileView === "chat" || !mobileView) && (
        <div className="flex-1 flex flex-col min-h-0">
          <div className="md:hidden p-4 border-b border-sage-100 bg-white flex items-center justify-between">
            <Button 
              variant="ghost" 
              size="icon"
              onClick={() => setMobileView("sidebar")}
            >
              <ChevronLeft className="w-5 h-5" />
            </Button>
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-gradient-to-br from-sage-400 to-sage-600 rounded-lg flex items-center justify-center">
                <Heart className="w-5 h-5 text-white" />
              </div>
              <span className="font-semibold text-sage-900 truncate max-w-[180px]">
                {chats.find(chat => chat.id === currentChatId)?.title || "New chat"}
              </span>
            </div>
            <div className="w-10"></div> 
          </div>

          <div className="p-4 border-b border-sage-100 bg-white hidden md:block">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <Avatar className="w-8 h-8">
                  <AvatarFallback className="bg-sage-100 text-sage-600">AI</AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-medium text-sage-900">
                    {chats.find(chat => chat.id === currentChatId)?.title || "New conversation"}
                  </p>
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span className="text-sm text-sage-600">Online & Ready to Help</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <Button variant="ghost" size="sm" asChild>
                  <Link href="/dashboard">
                    <BarChart3 className="w-4 h-4" />
                  </Link>
                </Button>
                <Button variant="ghost" size="sm">
                  <Settings className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-4">
             {messages.map((message) => (
    <div 
      key={message.id} 
      className={`flex ${message.isUserMessage ? "justify-end" : "justify-start"}`}
    >
      <div
        className={`max-w-xs lg:max-w-md px-4 py-3 rounded-2xl ${
          message.isUserMessage 
            ? "bg-sage-600 text-white rounded-tr-none" 
            : "bg-white border border-sage-100 text-sage-900 rounded-tl-none"
        }`}
      >
        <p className="text-sm leading-relaxed">{message.content}</p>
        <p className={`text-xs mt-2 ${message.isUserMessage ? "text-sage-200" : "text-sage-500"}`}>
          {(typeof message.timestamp === 'string' ? new Date(message.timestamp) : message.timestamp).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
        </p>
      </div>
    </div>
  ))}
  <div ref={messagesEndRef} />

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
      )}
    </div>
  )
}