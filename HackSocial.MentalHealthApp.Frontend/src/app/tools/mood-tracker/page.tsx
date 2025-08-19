"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { ArrowLeft, Heart, TrendingUp, Plus, Smile, Meh, Frown, Zap, Cloud, Sun } from "lucide-react"
import { Button } from "@/src/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/src/components/ui/card"
import { Badge } from "@/src/components/ui/badge"
import { Textarea } from "@/src/components/ui/textarea"
import { Label } from "@/src/components/ui/label"
import AppSidebar from "@/src/components/ui/appsidebar"
import { SidebarProvider, SidebarTrigger } from "@/src/components/ui/sidebar"
import apiHandler, { IJournalEntry } from "@/src/data/api/apiHandler"

interface MoodEntry {
  value: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  color: string;
  bg: string;
  score: number;
}

interface EnergyEntry {
  value: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  color: string;
  score: number;
}

export default function MoodTrackerPage() {
  const [selectedMood, setSelectedMood] = useState<string>("")
  const [selectedEnergy, setSelectedEnergy] = useState<string>("")
  const [notes, setNotes] = useState("")
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [moodEntries, setMoodEntries] = useState<IJournalEntry[]>([])
  const [loading, setLoading] = useState(true)

  const moods: MoodEntry[] = [
    { value: "amazing", label: "Amazing", icon: Sun, color: "text-yellow-500", bg: "bg-yellow-100", score: 10 },
    { value: "good", label: "Good", icon: Smile, color: "text-green-500", bg: "bg-green-100", score: 7 },
    { value: "okay", label: "Okay", icon: Meh, color: "text-blue-500", bg: "bg-blue-100", score: 5 },
    { value: "low", label: "Low", icon: Frown, color: "text-orange-500", bg: "bg-orange-100", score: 3 },
    { value: "terrible", label: "Terrible", icon: Cloud, color: "text-gray-500", bg: "bg-gray-100", score: 1 },
  ]

  const energyLevels: EnergyEntry[] = [
    { value: "high", label: "High Energy", icon: Zap, color: "text-red-500", score: 10 },
    { value: "medium", label: "Medium Energy", icon: Zap, color: "text-yellow-500", score: 5 },
    { value: "low", label: "Low Energy", icon: Zap, color: "text-blue-500", score: 1 },
  ]

  useEffect(() => {
    const fetchMoodEntries = async () => {
      try {
        const entries = await apiHandler.journalEntries.list()
        setMoodEntries(entries)
      } catch (error) {
        console.error("Failed to fetch mood entries:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchMoodEntries()
  }, [])

  const handleSubmit = async () => {
    if (!selectedMood || !selectedEnergy) return

    setIsSubmitted(true)
    
    try {
      const selectedMoodData = moods.find(m => m.value === selectedMood)
      const selectedEnergyData = energyLevels.find(e => e.value === selectedEnergy)

      if (!selectedMoodData || !selectedEnergyData) {
        throw new Error("Invalid mood or energy selection")
      }

      const newEntry = {
        feelingScore: selectedMoodData.score,
        content: notes || `Mood: ${selectedMood}, Energy: ${selectedEnergy}`
      }

      await apiHandler.journalEntries.create(newEntry)
      
      // Refresh the entries list
      const updatedEntries = await apiHandler.journalEntries.list()
      setMoodEntries(updatedEntries)
      
      // Reset form
      setSelectedMood("")
      setSelectedEnergy("")
      setNotes("")
    } catch (error) {
      console.error("Failed to save mood entry:", error)
    } finally {
      setTimeout(() => setIsSubmitted(false), 3000)
    }
  }

  const getMoodFromScore = (score: number) => {
    if (score >= 5) return "amazing"
    if (score >= 4) return "good"
    if (score >= 3) return "okay"
    if (score >= 2) return "low"
    return "terrible"
  }

  const getEnergyFromScore = (score: number) => {
    if (score >= 3) return "high"
    if (score >= 2) return "medium"
    return "low"
  }

  const getMoodIcon = (moodValue: string) => {
    const mood = moods.find((m) => m.value === moodValue)
    return mood ? mood.icon : Meh
  }

  const getMoodColor = (moodValue: string) => {
    const mood = moods.find((m) => m.value === moodValue)
    return mood ? mood.color : "text-gray-500"
  }

  const getWeekInsights = () => {
    if (moodEntries.length === 0) return null
    
    const weekAgo = new Date()
    weekAgo.setDate(weekAgo.getDate() - 7)
    
    const weekEntries = moodEntries.filter(entry => 
      new Date(entry.timestamp) >= weekAgo
    )
    
    if (weekEntries.length === 0) return null
    
    const avgScore = weekEntries.reduce((sum, entry) => sum + entry.feelingScore, 0) / weekEntries.length
    const avgMood = getMoodFromScore(Math.round(avgScore))
    
    // Simple energy calculation (assuming even distribution)
    const energyCounts = { high: 0, medium: 0, low: 0 }
    weekEntries.forEach(entry => {
      const energy = getEnergyFromScore(entry.feelingScore)
      energyCounts[energy]++
    })
    
    const mostCommonEnergy = Object.entries(energyCounts).reduce((a, b) => 
      a[1] > b[1] ? a : b
    )[0]
    
    return {
      avgMood,
      mostCommonEnergy,
      entryCount: weekEntries.length
    }
  }

  const insights = getWeekInsights()

  return (
    <SidebarProvider>
      <div className="flex min-h-screen bg-gradient-to-br from-sage-50 via-white to-lavender-50">
        <AppSidebar />
        <div className="flex-1 overflow-y-auto">
          <div className="bg-white border-b border-sage-100">
            <div className="container mx-auto px-4 py-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <SidebarTrigger className="hover:bg-sage-100 rounded-lg" />
                  <div className="flex items-center space-x-2">
                    <h1 className="text-lg sm:text-xl font-semibold text-sage-900">Mood Tracker</h1>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="container mx-auto px-4 py-6 sm:py-8 max-w-6xl">
            <div className="grid lg:grid-cols-3 gap-6 lg:gap-8">
              <div className="lg:col-span-2 space-y-6">
                <Card className="border-sage-100">
                  <CardHeader>
                    <CardTitle className="text-sage-900 flex items-center">
                      <Plus className="w-5 h-5 mr-2" />
                      How are you feeling right now?
                    </CardTitle>
                    <p className="text-sage-600">Track your mood and energy to understand patterns over time</p>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="space-y-3">
                      <Label className="text-sage-900 font-medium">Mood</Label>
                      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
                        {moods.map((mood) => {
                          const IconComponent = mood.icon
                          return (
                            <Button
                              key={mood.value}
                              variant={selectedMood === mood.value ? "default" : "outline"}
                              className={`h-auto p-4 flex flex-col items-center space-y-2 ${
                                selectedMood === mood.value
                                  ? "bg-sage-600 hover:bg-sage-700 text-white"
                                  : "border-sage-200 text-sage-700 hover:bg-sage-50 bg-transparent"
                              }`}
                              onClick={() => setSelectedMood(mood.value)}
                            >
                              <IconComponent
                                className={`w-6 h-6 ${selectedMood === mood.value ? "text-white" : mood.color}`}
                              />
                              <span className="text-xs font-medium">{mood.label}</span>
                            </Button>
                          )
                        })}
                      </div>
                    </div>

                    <div className="space-y-3">
                      <Label className="text-sage-900 font-medium">Energy Level</Label>
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                        {energyLevels.map((energy) => {
                          const IconComponent = energy.icon
                          return (
                            <Button
                              key={energy.value}
                              variant={selectedEnergy === energy.value ? "default" : "outline"}
                              className={`h-auto p-4 flex items-center justify-center space-x-2 ${
                                selectedEnergy === energy.value
                                  ? "bg-sage-600 hover:bg-sage-700 text-white"
                                  : "border-sage-200 text-sage-700 hover:bg-sage-50 bg-transparent"
                              }`}
                              onClick={() => setSelectedEnergy(energy.value)}
                            >
                              <IconComponent
                                className={`w-5 h-5 ${selectedEnergy === energy.value ? "text-white" : energy.color}`}
                              />
                              <span className="font-medium">{energy.label}</span>
                            </Button>
                          )
                        })}
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="notes" className="text-sage-900 font-medium">
                        Notes (optional)
                      </Label>
                      <Textarea
                        id="notes"
                        placeholder="What's contributing to how you feel? Any specific events or thoughts?"
                        value={notes}
                        onChange={(e) => setNotes(e.target.value)}
                        className="min-h-[100px] border-sage-200 focus:border-sage-400 focus:ring-sage-400 resize-none"
                      />
                    </div>

                    <Button
                      onClick={handleSubmit}
                      disabled={!selectedMood || !selectedEnergy}
                      className={`w-full ${
                        isSubmitted ? "bg-green-600 hover:bg-green-700" : "bg-sage-600 hover:bg-sage-700"
                      } text-white`}
                      size="lg"
                    >
                      {isSubmitted ? "Mood Logged!" : "Log Mood"}
                    </Button>
                  </CardContent>
                </Card>
              </div>
              <div className="space-y-6">
                <Card className="border-sage-100">
                  <CardHeader>
                    <CardTitle className="text-sage-900">Recent Entries</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {loading ? (
                      <div className="flex justify-center items-center h-32">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-sage-600"></div>
                      </div>
                    ) : moodEntries.length === 0 ? (
                      <p className="text-sm text-sage-500 text-center py-4">No mood entries yet</p>
                    ) : (
                      moodEntries.slice(0, 4).map((entry, index) => {
                        const mood = getMoodFromScore(entry.feelingScore)
                        const MoodIcon = getMoodIcon(mood)
                        const energy = getEnergyFromScore(entry.feelingScore)
                        
                        return (
                          <div key={index} className="p-3 border border-sage-100 rounded-lg">
                            <div className="flex items-center justify-between mb-2">
                              <div className="flex items-center space-x-2">
                                <MoodIcon className={`w-4 h-4 ${getMoodColor(mood)}`} />
                                <span className="text-sm font-medium text-sage-900 capitalize">{mood}</span>
                              </div>
                              <Badge variant="outline" className="border-sage-200 text-sage-600 text-xs">
                                {energy} energy
                              </Badge>
                            </div>
                            <p className="text-xs text-sage-600 mb-1">
                              {new Date(entry.timestamp).toLocaleString()}
                            </p>
                            {entry.content && <p className="text-sm text-sage-700">{entry.content}</p>}
                          </div>
                        )
                      })
                    )}
                  </CardContent>
                </Card>

                <Card className="border-sage-100 bg-sage-25">
                  <CardHeader>
                    <CardTitle className="text-sage-900">This Week's Insights</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {insights ? (
                      <>
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-sage-700">Average mood</span>
                          <Badge className="bg-sage-100 text-sage-800 capitalize">{insights.avgMood}</Badge>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-sage-700">Most common energy</span>
                          <Badge className="bg-sage-100 text-sage-800 capitalize">{insights.mostCommonEnergy}</Badge>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-sage-700">Entries this week</span>
                          <Badge className="bg-sage-100 text-sage-800">{insights.entryCount}</Badge>
                        </div>
                        <div className="pt-3 border-t border-sage-200">
                          <p className="text-sm text-sage-700">
                            {insights.avgMood === "amazing" || insights.avgMood === "good" ? (
                              "You've been feeling great this week! Keep doing what works for you."
                            ) : insights.avgMood === "okay" ? (
                              "Your mood has been average this week. Consider activities that boost your energy."
                            ) : (
                              "You've had some tough days this week. Remember to practice self-care."
                            )}
                          </p>
                        </div>
                      </>
                    ) : (
                      <p className="text-sm text-sage-500">No data available for this week</p>
                    )}
                  </CardContent>
                </Card>

                <Card className="border-sage-100">
                  <CardContent className="p-4">
                    <div className="flex items-center space-x-2 mb-2">
                      <Heart className="w-4 h-4 text-sage-600" />
                      <span className="text-sm font-medium text-sage-900">Quick Tips</span>
                    </div>
                    <ul className="text-xs text-sage-700 space-y-1">
                      <li>• Track your mood 2-3 times daily</li>
                      <li>• Look for patterns over time</li>
                      <li>• Note what influences your mood</li>
                      <li>• Celebrate positive trends</li>
                    </ul>
                    <Button
                      variant="outline"
                      className="w-full mt-3 border-sage-300 text-sage-700 hover:bg-sage-50 bg-transparent"
                      asChild
                    >
                      <Link href="/dashboard">View Full Analytics</Link>
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </div>
    </SidebarProvider>
  )
}