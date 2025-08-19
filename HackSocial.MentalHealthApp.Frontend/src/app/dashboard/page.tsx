"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import {
  BookOpen,
  Plus,
  Calendar,
  BarChart3,
  Home,
  Search,
  Bell,
  ChevronDown,
  ChevronRight,
  Sparkles,
  Edit,
  Trash2,
  Smile,
  Meh,
  Frown,
  Heart,
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
import AppSidebar from "@/src/components/ui/appsidebar"
import apiHandler from "@/src/data/api/apiHandler"
import { IJournalEntry } from "@/src/data/api/apiHandler"
import MoodCalendar from "@/src/components/ui/moodcalendar"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

export default function JournalDashboard() {
  const [selectedPeriod, setSelectedPeriod] = useState("week")
  const [journalEntries, setJournalEntries] = useState<IJournalEntry[]>([])
  const [loading, setLoading] = useState(true)
  const [moodSummary, setMoodSummary] = useState({
    happy: 0,
    neutral: 0,
    sad: 0,
    average: 0
  })

  useEffect(() => {
    const fetchJournalEntries = async () => {
      try {
        const entries = await apiHandler.journalEntries.list()
        setJournalEntries(entries)
        calculateMoodSummary(entries)
      } catch (error) {
        console.error("Failed to fetch journal entries:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchJournalEntries()
  }, [])

  const moodData = [
  { date: "Mon", mood: 3 },
  { date: "Tue", mood: 4 },
  { date: "Wed", mood: 2 },
  { date: "Thu", mood: 5 },
  { date: "Fri", mood: 3 },
  { date: "Sat", mood: 4 },
  { date: "Sun", mood: 5 },
];

  const calculateMoodSummary = (entries: IJournalEntry[]) => {
    if (entries.length === 0) return
    
    let happy = 0, neutral = 0, sad = 0, total = 0
    entries.forEach(entry => {
      total += entry.feelingScore
      if (entry.feelingScore >= 7) happy++
      else if (entry.feelingScore >= 4) neutral++
      else sad++
    })

    setMoodSummary({
      happy,
      neutral,
      sad,
      average: Math.round((total / entries.length) * 10) / 10
    })
  }

  const handleDeleteEntry = async (id: string) => {
    try {
      await apiHandler.journalEntries.delete(id)
      setJournalEntries(prev => prev.filter(entry => entry.id !== id))
      calculateMoodSummary(journalEntries.filter(entry => entry.id !== id))
    } catch (error) {
      console.error("Failed to delete entry:", error)
    }
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', { 
      weekday: 'short', 
      month: 'short', 
      day: 'numeric' 
    })
  }

  const getMoodIcon = (score: number) => {
    if (score >= 7) return <Smile className="w-5 h-5 text-green-500" />
    if (score >= 4) return <Meh className="w-5 h-5 text-yellow-500" />
    return <Frown className="w-5 h-5 text-red-500" />
  }

  const getMoodColor = (score: number) => {
    if (score >= 7) return "bg-green-100 text-green-800"
    if (score >= 4) return "bg-yellow-100 text-yellow-800"
    return "bg-red-100 text-red-800"
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
                  <h1 className="text-xl md:text-2xl font-bold text-sage-900">Journal Dashboard</h1>
                  <p className="text-sm text-sage-600">Reflect on your thoughts and feelings</p>
                </div>
              </div>

              <div className="flex items-center space-x-3">
                <button className="p-2 rounded-full hover:bg-sage-100 transition-colors">
                  <Bell className="w-5 h-5 text-sage-700" />
                </button>
                <button className="p-2 rounded-full hover:bg-sage-100 transition-colors">
                  <Search className="w-5 h-5 text-sage-700" />
                </button>
       <div className="relative group">
         <div className="flex items-center space-x-2 p-2 rounded-lg cursor-pointer hover:bg-sage-100 transition-colors">
           <div className="w-9 h-9 rounded-full bg-sage-200 flex items-center justify-center">
           <span className="text-sage-800 font-medium text-sm">LO</span>
          </div>
           <div className="hidden md:block">
             <h1 className="text-sm font-semibold text-sage-900">Lois O.</h1>
           <p className="text-xs text-sage-500">Premium Member</p>
          </div>
        </div>

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
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              <Card className="border-0 shadow-sm hover:shadow-md transition-shadow bg-white">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-12 h-12 rounded-xl bg-green-100 text-green-600 flex items-center justify-center">
                      <Smile className="w-6 h-6" />
                    </div>
                    <Sparkles className="w-4 h-4 text-sage-400" />
                  </div>
                  <div className="space-y-1">
                    <p className="text-2xl font-bold text-sage-900">{moodSummary.happy}</p>
                    <p className="text-sm text-sage-600">Happy Days</p>
                    <Badge variant="outline" className="text-xs border-sage-200 text-sage-500 bg-sage-25">
                      {moodSummary.happy > 0 ? `${Math.round((moodSummary.happy / journalEntries.length) * 100)}%` : '0%'}
                    </Badge>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-0 shadow-sm hover:shadow-md transition-shadow bg-white">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-12 h-12 rounded-xl bg-yellow-100 text-yellow-600 flex items-center justify-center">
                      <Meh className="w-6 h-6" />
                    </div>
                    <Sparkles className="w-4 h-4 text-sage-400" />
                  </div>
                  <div className="space-y-1">
                    <p className="text-2xl font-bold text-sage-900">{moodSummary.neutral}</p>
                    <p className="text-sm text-sage-600">Neutral Days</p>
                    <Badge variant="outline" className="text-xs border-sage-200 text-sage-500 bg-sage-25">
                      {moodSummary.neutral > 0 ? `${Math.round((moodSummary.neutral / journalEntries.length) * 100)}%` : '0%'}
                    </Badge>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-0 shadow-sm hover:shadow-md transition-shadow bg-white">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-12 h-12 rounded-xl bg-red-100 text-red-600 flex items-center justify-center">
                      <Frown className="w-6 h-6" />
                    </div>
                    <Sparkles className="w-4 h-4 text-sage-400" />
                  </div>
                  <div className="space-y-1">
                    <p className="text-2xl font-bold text-sage-900">{moodSummary.sad}</p>
                    <p className="text-sm text-sage-600">Difficult Days</p>
                    <Badge variant="outline" className="text-xs border-sage-200 text-sage-500 bg-sage-25">
                      {moodSummary.sad > 0 ? `${Math.round((moodSummary.sad / journalEntries.length) * 100)}%` : '0%'}
                    </Badge>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-0 shadow-sm hover:shadow-md transition-shadow bg-white">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-12 h-12 rounded-xl bg-sage-100 text-sage-600 flex items-center justify-center">
                      <BarChart3 className="w-6 h-6" />
                    </div>
                    <Sparkles className="w-4 h-4 text-sage-400" />
                  </div>
                  <div className="space-y-1">
                    <p className="text-2xl font-bold text-sage-900">{moodSummary.average}</p>
                    <p className="text-sm text-sage-600">Average Mood</p>
                    <Badge variant="outline" className="text-xs border-sage-200 text-sage-500 bg-sage-25">
                      {journalEntries.length} entries
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="grid lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2 space-y-8">
                <Card className="border-0 shadow-sm bg-white">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-sage-900 flex items-center">
                        <BookOpen className="w-5 h-5 text-sage-600 mr-2" />
                        Recent Journal Entries
                      </CardTitle>
                      <Link href="/tools/journal">
                        <Button variant="ghost" size="sm" className="text-sage-600 hover:bg-sage-50">
                          <Plus className="w-4 h-4 mr-1" />
                          Add Entry
                        </Button>
                      </Link>
                    </div>
                  </CardHeader>
                  <CardContent>
                    {loading ? (
                      <div className="flex justify-center items-center h-32">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-sage-600"></div>
                      </div>
                    ) : journalEntries.length === 0 ? (
                      <div className="text-center py-8">
                        <BookOpen className="mx-auto h-12 w-12 text-sage-300" />
                        <h3 className="mt-2 text-sm font-medium text-sage-900">No journal entries</h3>
                        <p className="mt-1 text-sm text-sage-500">Get started by creating your first entry.</p>
                        <div className="mt-6">
                          <Link href="/tools/journal">
                            <Button className="bg-sage-600 hover:bg-sage-700">
                              <Plus className="w-4 h-4 mr-1" />
                              New Entry
                            </Button>
                          </Link>
                        </div>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        {journalEntries.slice(0, 5).map((entry) => (
                          <div key={entry.id} className="p-4 border border-sage-100 rounded-lg hover:bg-sage-25 transition-colors">
                            <div className="flex items-start justify-between">
                              <div className="flex items-start space-x-3">
                                <div className={`mt-1 p-2 rounded-full ${getMoodColor(entry.feelingScore)}`}>
                                  {getMoodIcon(entry.feelingScore)}
                                </div>
                                <div>
                                  <div className="flex items-center space-x-2">
                                    <h3 className="font-medium text-sage-900">Mood: {entry.feelingScore}/10</h3>
                                    <Badge variant="outline" className="text-xs border-sage-200 text-sage-500">
                                      {formatDate(entry.timestamp)}
                                    </Badge>
                                  </div>
                                  <p className="mt-1 text-sm text-sage-700 line-clamp-2">
                                    {entry.content}
                                  </p>
                                </div>
                              </div>
                              <div className="flex space-x-1">
                                <Link href={`/journal/edit/${entry.id}`}>
                                  <Button variant="ghost" size="sm" className="text-sage-600 hover:bg-sage-100">
                                    <Edit className="w-4 h-4" />
                                  </Button>
                                </Link>
                                <Button 
                                  variant="ghost" 
                                  size="sm" 
                                  className="text-red-600 hover:bg-red-50"
                                  onClick={() => handleDeleteEntry(entry.id)}
                                >
                                  <Trash2 className="w-4 h-4" />
                                </Button>
                              </div>
                            </div>
                          </div>
                        ))}
                        {journalEntries.length > 5 && (
                          <div className="text-center">
                            <Link href="/journal">
                              <Button variant="link" className="text-sage-600">
                                View all entries <ChevronRight className="w-4 h-4 ml-1" />
                              </Button>
                            </Link>
                          </div>
                        )}
                      </div>
                    )}
                  </CardContent>
                </Card>

                <Card className="border-0 shadow-sm bg-white">
                      <MoodCalendar />
                </Card>
              </div>

              <div className="space-y-6">
                <Card className="border-0 shadow-sm bg-white">
                  <CardHeader>
                    <CardTitle className="text-sage-900">Journal Prompts</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {[
                      "What are three things you're grateful for today?",
                      "Describe a challenge you faced and how you handled it.",
                      "What's something you learned about yourself recently?",
                      "Write about a recent accomplishment, no matter how small.",
                      "What's one thing you can do tomorrow to take care of yourself?"
                    ].map((prompt, index) => (
                      <div key={index} className="p-3 bg-sage-25 rounded-lg">
                        <p className="text-sm text-sage-800">{prompt}</p>
                      </div>
                    ))}
                  </CardContent>
                </Card>
                <Card className="border-0 shadow-sm bg-white">
                  <CardHeader>
                    <CardTitle className="text-sage-900 flex items-center">
                      <Calendar className="w-5 h-5 text-sage-600 mr-2" />
                      Journaling Goals
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-sage-700 font-medium">This week's entries</span>
                        <span className="text-sage-600 font-semibold">
                          {journalEntries.filter(entry => {
                            const entryDate = new Date(entry.timestamp)
                            const weekStart = new Date()
                            weekStart.setDate(weekStart.getDate() - weekStart.getDay())
                            return entryDate >= weekStart
                          }).length}/3
                        </span>
                      </div>
                      <Progress 
                        value={
                          (journalEntries.filter(entry => {
                            const entryDate = new Date(entry.timestamp)
                            const weekStart = new Date()
                            weekStart.setDate(weekStart.getDate() - weekStart.getDay())
                            return entryDate >= weekStart
                          }).length / 3) * 100
                        } 
                        className="h-2 bg-sage-100" 
                      />
                    </div>

                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-sage-700 font-medium">Reflection consistency</span>
                        <span className="text-sage-600 font-semibold">
                          {journalEntries.length > 0 ? 
                            `${Math.round((journalEntries.length / 30) * 100)}%` : '0%'}
                        </span>
                      </div>
                      <Progress 
                        value={journalEntries.length > 0 ? 
                          Math.min((journalEntries.length / 30) * 100, 100) : 0} 
                        className="h-2 bg-sage-100" 
                      />
                    </div>

                    <div className="pt-4 border-t border-sage-100">
                      <Link href="/tools/breathing">
                        <Button className="w-full bg-sage-600 hover:bg-sage-700">
                          <Heart className="w-4 h-4 mr-2" />
                          Do some Breathing Excercises
                        </Button>
                      </Link>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}