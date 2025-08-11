"use client"

import { useState } from "react"
import Link from "next/link"
import {
  Heart,
  MessageCircle,
  TrendingUp,
  BookOpen,
  Brain,
  Wind,
  Smile,
  Meh,
  Frown,
  Plus,
  Calendar,
  Target,
  Activity,
  BarChart3,
  // Settings,
  // User,
  Home,
  Zap,
  ChevronRight,
  Sparkles,
  LogOut,
  Settings,
  Bell,
  ChevronDown,
  Search,
} from "lucide-react"
import { Button } from "@/src/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/src/components/ui/card"
import { Badge } from "@/src/components/ui/badge"
import { Progress } from "@/src/components/ui/progress"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarInset,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarTrigger,
} from "@/src/components/ui/sidebar"
import MoodCalendar from "@/src/components/ui/moodcalendar"
import AppSidebar from "@/src/components/ui/appsidebar"


export default function Dashboard() {
  const [selectedPeriod, setSelectedPeriod] = useState("week")

  // Enhanced mood data
  const moodData = [
    { date: "Mon", mood: "happy", score: 8, energy: 7, stress: 3 },
    { date: "Tue", mood: "okay", score: 6, energy: 5, stress: 6 },
    { date: "Wed", mood: "sad", score: 4, energy: 4, stress: 8 },
    { date: "Thu", mood: "okay", score: 6, energy: 6, stress: 5 },
    { date: "Fri", mood: "happy", score: 7, energy: 8, stress: 2 },
    { date: "Sat", mood: "happy", score: 8, energy: 9, stress: 1 },
    { date: "Sun", mood: "okay", score: 6, energy: 6, stress: 4 },
  ]

  // Tool usage data
  const toolUsage = [
    { tool: "Chat Sessions", count: 47, trend: "+12%", icon: MessageCircle, color: "bg-sage-500" },
    { tool: "Breathing", count: 23, trend: "+8%", icon: Wind, color: "bg-emerald-500" },
    { tool: "Journaling", count: 18, trend: "+15%", icon: BookOpen, color: "bg-amber-500" },
    { tool: "CBT Tools", count: 12, trend: "+25%", icon: Brain, color: "bg-lavender-500" },
  ]

  // Streak data
  const streaks = [
    { title: "Daily Check-ins", current: 12, best: 28, icon: Calendar, color: "bg-blue-100 text-blue-600" },
    { title: "Mindful Minutes", current: 156, best: 240, icon: Wind, color: "bg-emerald-100 text-emerald-600" },
    { title: "Journal Streak", current: 5, best: 14, icon: BookOpen, color: "bg-amber-100 text-amber-600" },
    { title: "Mood Tracking", current: 8, best: 21, icon: Smile, color: "bg-pink-100 text-pink-600" },
  ]

  // Navigation items
  const navigationItems = [
    {
      title: "Dashboard",
      url: "/",
      icon: Home,
      isActive: true,
    },
    {
      title: "Chat",
      url: "/chat",
      icon: MessageCircle,
    },
  ]

  // const toolItems = [
  //   {
  //     title: "Breathing Exercise",
  //     url: "/tools/breathing",
  //     icon: Wind,
  //     description: "Calm your mind",
  //   },
  //   {
  //     title: "Journal",
  //     url: "/tools/journal",
  //     icon: BookOpen,
  //     description: "Reflect & write",
  //   },
  //   {
  //     title: "CBT Exercises",
  //     url: "/tools/cbt",
  //     icon: Brain,
  //     description: "Challenge thoughts",
  //   },
  //   {
  //     title: "Mood Tracker",
  //     url: "/tools/mood-tracker",
  //     icon: TrendingUp,
  //     description: "Track emotions",
  //   },
  // ]

  const FloatingChatButton = () => {
  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end space-y-2">
      <div className="relative animate-fade-in-up bg-white p-4 rounded-lg shadow-lg max-w-xs border border-sage-200">
        <p className="text-sm text-sage-800">Need someone to talk to? I'm here to help!</p>
        <div className="w-3 h-3 bg-white transform rotate-45 absolute -bottom-1 right-4 border-r border-b border-sage-200" />
      </div>
      <Link href="/chat">
        <div className="w-14 h-14 bg-sage-600 rounded-full flex items-center justify-center shadow-lg hover:bg-sage-700 transition-colors cursor-pointer">
          <MessageCircle className="w-6 h-6 text-white" />
        </div>
      </Link>
    </div>
  )
}

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <div className="min-h-screen bg-gradient-to-br from-sage-25 via-white to-lavender-25">
    
<div className="bg-white/80 backdrop-blur-sm border-b border-sage-100 sticky top-0 z-10">
  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-4 md:p-6">
    
    <div className="flex items-start md:items-center space-x-3">
      <SidebarTrigger className="hover:bg-sage-100 rounded-lg" />
      <div>
        <h1 className="text-xl md:text-2xl font-bold text-sage-900">Good morning, Lois!</h1>
        <p className="text-sm text-sage-600">Wishing you a peaceful and productive day 💚</p>
      </div>
    </div>

    {/* Right controls */}
    <div className="flex items-center space-x-3">
      {/* Notification */}
      <button className="p-2 rounded-full hover:bg-sage-100 transition-colors">
        <Bell className="w-5 h-5 text-sage-700" />
      </button>

      {/* Search */}
      <button className="p-2 rounded-full hover:bg-sage-100 transition-colors">
        <Search className="w-5 h-5 text-sage-700" />
      </button>

      {/* Profile hover dropdown */}
      <div className="relative group">
        {/* Profile button */}
        <div className="flex items-center space-x-2 p-2 rounded-lg cursor-pointer hover:bg-sage-100 transition-colors">
          <div className="w-9 h-9 rounded-full bg-sage-200 flex items-center justify-center">
            <span className="text-sage-800 font-medium text-sm">LO</span>
          </div>
          <div className="hidden md:block">
            <h1 className="text-sm font-semibold text-sage-900">Lois O.</h1>
            <p className="text-xs text-sage-500">Premium Member</p>
          </div>
        </div>

        {/* Dropdown on hover */}
        <div className="absolute right-0 mt-2 w-48 bg-white border border-sage-100 rounded-lg shadow-md hidden group-hover:block z-20">
          <Link href="/profile" className="block px-4 py-2 text-sm text-sage-700 hover:bg-sage-50">
            Edit Profile
          </Link>
          <Link href="/settings" className="block px-4 py-2 text-sm text-sage-700 hover:bg-sage-50">
            Settings
          </Link>
          <Link href="/logout" className="block px-4 py-2 text-sm text-red-600 hover:bg-sage-50">
            Log Out
          </Link>
        </div>
      </div>
    </div>

  </div>
</div>

          <div className="p-6 space-y-8">
            {/* Streak Cards */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              {streaks.map((streak, index) => {
                const IconComponent = streak.icon
                return (
                  <Card key={index} className="border-0 shadow-sm hover:shadow-md transition-shadow bg-white">
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between mb-4">
                        <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${streak.color}`}>
                          <IconComponent className="w-6 h-6" />
                        </div>
                        <Sparkles className="w-4 h-4 text-sage-400" />
                      </div>
                      <div className="space-y-1">
                        <p className="text-2xl font-bold text-sage-900">{streak.current}</p>
                        <p className="text-sm text-sage-600">{streak.title}</p>
                        <Badge variant="outline" className="text-xs border-sage-200 text-sage-500 bg-sage-25">
                          Best: {streak.best}
                        </Badge>
                      </div>
                    </CardContent>
                  </Card>
                )
              })}
            </div>

            <div className="grid lg:grid-cols-3 gap-8">
              {/* Main Content */}
              <div className="lg:col-span-2 space-y-8">
                {/* Mood Trends */}
                <Card className="border-0 shadow-sm bg-white">
                  <CardHeader className="pb-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <BarChart3 className="w-5 h-5 text-sage-600" />
                        <CardTitle className="text-sage-900">Mood Trends</CardTitle>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Button
                          variant={selectedPeriod === "week" ? "default" : "outline"}
                          size="sm"
                          onClick={() => setSelectedPeriod("week")}
                          className={`rounded-lg ${
                            selectedPeriod === "week"
                              ? "bg-sage-600 hover:bg-sage-700 text-white"
                              : "border-sage-200 text-sage-700 hover:bg-sage-50"
                          }`}
                        >
                          Week
                        </Button>
                        <Button
                          variant={selectedPeriod === "month" ? "default" : "outline"}
                          size="sm"
                          onClick={() => setSelectedPeriod("month")}
                          className={`rounded-lg ${
                            selectedPeriod === "month"
                              ? "bg-sage-600 hover:bg-sage-700 text-white"
                              : "border-sage-200 text-sage-700 hover:bg-sage-50"
                          }`}
                        >
                          Month
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    {/* Average Score */}
                    <div className="flex items-center justify-between p-4 bg-sage-25 rounded-xl">
                      <span className="text-sage-700 font-medium">This week's average</span>
                      <Badge className="bg-sage-100 text-sage-800 font-semibold">6.4/10</Badge>
                    </div>

                    {/* Mood Chart */}
                    <div className="grid grid-cols-7 gap-3">
                      {moodData.map((day, index) => (
                        <div key={index} className="text-center space-y-3">
                          <div className="text-xs font-medium text-sage-600 uppercase">{day.date}</div>
                          <div className="flex justify-center">
                            <div className="w-12 h-12 rounded-full bg-sage-50 flex items-center justify-center">
                              {day.mood === "happy" && <Smile className="w-6 h-6 text-green-500" />}
                              {day.mood === "okay" && <Meh className="w-6 h-6 text-yellow-500" />}
                              {day.mood === "sad" && <Frown className="w-6 h-6 text-red-500" />}
                            </div>
                          </div>
                          <div className="space-y-1">
                            <div className="text-sm font-semibold text-sage-900">{day.score}/10</div>
                            <div className="text-xs text-sage-500">Energy: {day.energy}</div>
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Insights */}
                    <div className="grid sm:grid-cols-2 gap-6 pt-6 border-t border-sage-100">
                      <div className="space-y-3">
                        <h4 className="font-semibold text-sage-900 flex items-center">
                          <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                          Positive Trends
                        </h4>
                        <ul className="space-y-2 text-sm text-sage-700">
                          <li className="flex items-center space-x-2">
                            <div className="w-1 h-1 bg-sage-400 rounded-full"></div>
                            <span>Weekend mood improvement</span>
                          </li>
                          <li className="flex items-center space-x-2">
                            <div className="w-1 h-1 bg-sage-400 rounded-full"></div>
                            <span>Higher energy on Fridays</span>
                          </li>
                        </ul>
                      </div>
                      <div className="space-y-3">
                        <h4 className="font-semibold text-sage-900 flex items-center">
                          <div className="w-2 h-2 bg-amber-500 rounded-full mr-2"></div>
                          Areas to Focus
                        </h4>
                        <ul className="space-y-2 text-sm text-sage-700">
                          <li className="flex items-center space-x-2">
                            <div className="w-1 h-1 bg-sage-400 rounded-full"></div>
                            <span>Wednesday stress spikes</span>
                          </li>
                          <li className="flex items-center space-x-2">
                            <div className="w-1 h-1 bg-sage-400 rounded-full"></div>
                            <span>Mid-week energy dips</span>
                          </li>
                        </ul>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Tool Usage */}
                <Card className="border-0 shadow-sm bg-white">
                  <CardHeader>
                    <CardTitle className="text-sage-900 flex items-center">
                      <Activity className="w-5 h-5 text-sage-600 mr-2" />
                      Tool Usage This Week
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid sm:grid-cols-2 gap-4">
                      {toolUsage.map((tool, index) => {
                        const IconComponent = tool.icon
                        return (
                          <div key={index} className="flex items-center justify-between p-4 bg-sage-25 rounded-xl">
                            <div className="flex items-center space-x-3">
                              <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${tool.color}`}>
                                <IconComponent className="w-5 h-5 text-white" />
                              </div>
                              <div>
                                <p className="font-medium text-sage-900">{tool.tool}</p>
                                <p className="text-sm text-sage-600">{tool.count} times</p>
                              </div>
                            </div>
                            <Badge className="bg-green-100 text-green-700 font-medium">{tool.trend}</Badge>
                          </div>
                        )
                      })}
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Right Sidebar */}
              <div className="space-y-6">
                <MoodCalendar />

                {/* Weekly Goals */}
                <Card className="border-0 shadow-sm bg-white">
                  <CardHeader>
                    <CardTitle className="text-sage-900 flex items-center">
                      <Target className="w-5 h-5 text-sage-600 mr-2" />
                      Weekly Goals
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-sage-700 font-medium">Daily check-ins</span>
                        <span className="text-sage-600 font-semibold">5/7</span>
                      </div>
                      <Progress value={71} className="h-2 bg-sage-100" />
                    </div>

                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-sage-700 font-medium">Mindful minutes</span>
                        <span className="text-sage-600 font-semibold">156/200</span>
                      </div>
                      <Progress value={78} className="h-2 bg-sage-100" />
                    </div>

                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-sage-700 font-medium">Journal entries</span>
                        <span className="text-sage-600 font-semibold">3/5</span>
                      </div>
                      <Progress value={60} className="h-2 bg-sage-100" />
                    </div>
                  </CardContent>
                </Card>

                {/* Top Stressors */}
                <Card className="border-0 shadow-sm bg-white">
                  <CardHeader>
                    <CardTitle className="text-sage-900 flex items-center">
                      <Zap className="w-5 h-5 text-sage-600 mr-2" />
                      Top Stressors
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {[
                      { name: "Work Pressure", frequency: 8, impact: "High" },
                      { name: "Sleep Issues", frequency: 6, impact: "Medium" },
                      { name: "Social Situations", frequency: 4, impact: "Medium" },
                    ].map((trigger, index) => (
                      <div key={index} className="flex items-center justify-between p-3 bg-sage-25 rounded-lg">
                        <div>
                          <p className="font-medium text-sage-900">{trigger.name}</p>
                          <p className="text-xs text-sage-600">{trigger.frequency} times this week</p>
                        </div>
                        <Badge
                          variant="outline"
                          className={`text-xs font-medium ${
                            trigger.impact === "High"
                              ? "border-red-200 text-red-700 bg-red-50"
                              : "border-yellow-200 text-yellow-700 bg-yellow-50"
                          }`}
                        >
                          {trigger.impact}
                        </Badge>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </SidebarInset>
      <FloatingChatButton />
    </SidebarProvider>
  )
}
