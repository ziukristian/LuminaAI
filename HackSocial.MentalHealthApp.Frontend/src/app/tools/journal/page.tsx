"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import {
  ArrowLeft,
  BookOpen,
  Save,
  Sparkles,
  Heart,
  Calendar,
  Clock,
} from "lucide-react"
import { Button } from "@/src/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/src/components/ui/card"
import { Textarea } from "@/src/components/ui/textarea"
import { Badge } from "@/src/components/ui/badge"
import { Label } from "@/src/components/ui/label"
import { SidebarProvider, SidebarTrigger } from "@/src/components/ui/sidebar"
import { AppSidebar } from "@/src/components/ui/appsidebar"
import apiHandler from "@/src/data/api/apiHandler"
import { toast } from "sonner"

export default function JournalPage() {
  const router = useRouter()
  const [selectedPrompt, setSelectedPrompt] = useState<number | null>(null)
  const [journalEntry, setJournalEntry] = useState("")
  const [feelingScore, setFeelingScore] = useState<number | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

 const prompts = [
    {
      id: 1,
      category: "Gratitude",
      title: "Three Good Things",
      prompt:
        "Write about three things that went well today and why you think they happened.",
      color: "bg-emerald-100 text-emerald-800",
    },
    {
      id: 2,
      category: "Self-Reflection",
      title: "Emotional Check-in",
      prompt:
        "How are you feeling right now? What emotions are present, and what might be causing them?",
      color: "bg-sage-100 text-sage-800",
    },
    {
      id: 3,
      category: "Growth",
      title: "Learning Moment",
      prompt:
        "Describe a challenge you faced recently. What did you learn from it, and how did you grow?",
      color: "bg-lavender-100 text-lavender-800",
    },
    {
      id: 4,
      category: "Mindfulness",
      title: "Present Moment",
      prompt:
        "Take a moment to notice your surroundings. What do you see, hear, smell, or feel right now?",
      color: "bg-amber-100 text-amber-800",
    },
    {
      id: 5,
      category: "Goals",
      title: "Future Self",
      prompt:
        "What would you like to accomplish tomorrow? How can you take one small step toward a bigger goal?",
      color: "bg-blue-100 text-blue-800",
    },
    {
      id: 6,
      category: "Relationships",
      title: "Connection",
      prompt:
        "Think about someone important to you. How did they impact your day or week?",
      color: "bg-pink-100 text-pink-800",
    },
  ]

  const moodOptions = [
    { value: 1, label: "Very Sad", emoji: "😭", color: "bg-red-100 text-red-800" },
    { value: 2, label: "Sad", emoji: "😢", color: "bg-red-100 text-red-800" },
    { value: 3, label: "Unhappy", emoji: "😞", color: "bg-orange-100 text-orange-800" },
    { value: 4, label: "Neutral", emoji: "😐", color: "bg-yellow-100 text-yellow-800" },
    { value: 5, label: "Okay", emoji: "🙂", color: "bg-lime-100 text-lime-800" },
    { value: 6, label: "Good", emoji: "😊", color: "bg-green-100 text-green-800" },
    { value: 7, label: "Great", emoji: "😄", color: "bg-green-100 text-green-800" },
    { value: 8, label: "Excellent", emoji: "😁", color: "bg-teal-100 text-teal-800" },
    { value: 9, label: "Amazing", emoji: "🤩", color: "bg-blue-100 text-blue-800" },
    { value: 10, label: "Ecstatic", emoji: "😍", color: "bg-indigo-100 text-indigo-800" },
  ]

  const selectedPromptData = prompts.find((p) => p.id === selectedPrompt)

  const handleSave = async () => {
    if (!journalEntry.trim() || feelingScore === null) {
      toast.warning("Please write your entry and select a mood score")
      return
    }

    setIsSubmitting(true)

    try {
      const newEntry = {
        feelingScore,
        content: journalEntry,
      }

      const createdEntry = await apiHandler.journalEntries.create(newEntry)
      
      toast.success("Journal entry saved successfully!")
      router.push("/dashboard")
    } catch (error) {
      console.error("Failed to save journal entry:", error)
      toast.error("Failed to save journal entry. Please try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <SidebarProvider>
      <div className="min-h-screen bg-gradient-to-br from-sage-50 via-white to-lavender-50 flex flex-col">
        <div className="bg-white border-b border-sage-100 sticky top-0 z-10">
          <div className="px-4 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <SidebarTrigger className="hover:bg-sage-100 rounded-lg" />
              </div>

              <Button
                onClick={handleSave}
                disabled={isSubmitting || !journalEntry.trim() || feelingScore === null}
                className="bg-sage-600 hover:bg-sage-700 text-white"
              >
                {isSubmitting ? (
                  <>
                    <Save className="w-4 h-4 mr-2 animate-pulse" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4 mr-2" />
                    Save Entry
                  </>
                )}
              </Button>
            </div>
          </div>
        </div>

        <div className="flex flex-1 overflow-hidden">
          <AppSidebar />

          <main className="flex-1 overflow-y-auto">
            <div className="container mx-auto px-4 py-6 sm:py-8 max-w-6xl">
              <div className="grid lg:grid-cols-3 gap-6 lg:gap-8">
                <div className="lg:col-span-1 space-y-6">
                  <Card className="border-sage-100">
                    <CardHeader>
                      <CardTitle className="text-sage-900 flex items-center">
                        <Sparkles className="w-5 h-5 mr-2" />
                        Journal Prompts
                      </CardTitle>
                      <p className="text-sm text-sage-600">
                        Choose a prompt to guide your reflection
                      </p>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      {prompts.map((prompt) => (
                        <div
                          key={prompt.id}
                          className={`p-3 rounded-lg border cursor-pointer transition-all ${
                            selectedPrompt === prompt.id
                              ? "border-sage-300 bg-sage-50"
                              : "border-sage-100 hover:border-sage-200 hover:bg-sage-25"
                          }`}
                          onClick={() => setSelectedPrompt(prompt.id)}
                        >
                          <div className="flex items-start justify-between mb-2">
                            <Badge className={`${prompt.color} text-xs`}>
                              {prompt.category}
                            </Badge>
                          </div>
                          <h4 className="font-medium text-sage-900 mb-1">
                            {prompt.title}
                          </h4>
                          <p className="text-sm text-sage-600 line-clamp-2">
                            {prompt.prompt}
                          </p>
                        </div>
                      ))}
                    </CardContent>
                  </Card>

                  <Card className="border-sage-100 bg-sage-25">
                    <CardContent className="p-4">
                      <div className="flex items-center space-x-2 mb-2">
                        <Heart className="w-4 h-4 text-sage-600" />
                        <span className="text-sm font-medium text-sage-900">
                          Journaling Tips
                        </span>
                      </div>
                      <ul className="text-xs text-sage-700 space-y-1">
                        <li>• Write without judgment</li>
                        <li>• Focus on your feelings</li>
                        <li>• Be honest with yourself</li>
                        <li>• There's no right or wrong way</li>
                      </ul>
                    </CardContent>
                  </Card>
                </div>

                <div className="lg:col-span-2 space-y-6">
                  <Card className="border-sage-100">
                    <CardHeader>
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                        <div>
                          <CardTitle className="text-sage-900">
                            {selectedPromptData
                              ? selectedPromptData.title
                              : "Free Writing"}
                          </CardTitle>
                          <div className="flex items-center space-x-4 text-sm text-sage-600 mt-1">
                            <div className="flex items-center space-x-1">
                              <Calendar className="w-4 h-4" />
                              <span>{new Date().toLocaleDateString()}</span>
                            </div>
                            <div className="flex items-center space-x-1">
                              <Clock className="w-4 h-4" />
                              <span>
                                {new Date().toLocaleTimeString([], {
                                  hour: "2-digit",
                                  minute: "2-digit",
                                })}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      {selectedPromptData && (
                        <div className="p-4 bg-sage-25 rounded-lg border border-sage-100">
                          <p className="text-sage-800 font-medium mb-2">
                            Today's Prompt:
                          </p>
                          <p className="text-sage-700">
                            {selectedPromptData.prompt}
                          </p>
                        </div>
                      )}

                      <div className="space-y-2">
                        <Label htmlFor="journal-entry" className="text-sage-900">
                          Your thoughts
                        </Label>
                        <Textarea
                          id="journal-entry"
                          placeholder={
                            selectedPromptData
                              ? "Start writing your response to the prompt above..."
                              : "What's on your mind today? Write freely about your thoughts and feelings..."
                          }
                          value={journalEntry}
                          onChange={(e) => setJournalEntry(e.target.value)}
                          className="min-h-[300px] sm:min-h-[400px] border-sage-200 focus:border-sage-400 focus:ring-sage-400 resize-none"
                        />
                        <div className="flex justify-between text-xs text-sage-500">
                          <span>{journalEntry.length} characters</span>
                          <span>
                            ~{Math.ceil(journalEntry.split(" ").length / 200)}{" "}
                            min read
                          </span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                  <Card className="border-sage-100">
                    <CardHeader>
                      <CardTitle className="text-sage-900">
                        How are you feeling?
                      </CardTitle>
                      <p className="text-sm text-sage-600">
                        Rate your current mood (1-10 scale)
                      </p>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="grid grid-cols-5 gap-3">
                        {moodOptions.map((mood) => (
                          <Button
                            key={mood.value}
                            variant={
                              feelingScore === mood.value ? "default" : "outline"
                            }
                            className={`h-auto py-3 flex flex-col items-center ${
                              feelingScore === mood.value
                                ? mood.color.replace("bg-", "bg-").replace("text-", "text-white ")
                                : "border-sage-200 text-sage-700 hover:bg-sage-50 bg-transparent"
                            }`}
                            onClick={() => setFeelingScore(mood.value)}
                          >
                            <span className="text-lg">{mood.emoji}</span>
                            <span className="text-xs">{mood.value}</span>
                          </Button>
                        ))}
                      </div>
                      <div className="flex justify-between text-xs text-sage-600 px-1">
                        <span>Worst</span>
                        <span>Best</span>
                      </div>
                    </CardContent>
                  </Card>

                  <div className="flex flex-col sm:flex-row gap-3">
                    <Button
                      onClick={handleSave}
                      disabled={isSubmitting || !journalEntry.trim() || feelingScore === null}
                      className={`flex-1 ${
                        isSubmitting ? "bg-sage-700" : "bg-sage-600 hover:bg-sage-700"
                      } text-white`}
                    >
                      {isSubmitting ? (
                        <>
                          <Save className="w-4 h-4 mr-2 animate-pulse" />
                          Saving...
                        </>
                      ) : (
                        <>
                          <Save className="w-4 h-4 mr-2" />
                          Save Entry
                        </>
                      )}
                    </Button>
                    <Button
                      variant="outline"
                      className="flex-1 border-sage-200 text-sage-700 hover:bg-sage-50 bg-transparent"
                      asChild
                    >
                      <Link href="/chat">Share with AI Buddy</Link>
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </main>
        </div>
      </div>
    </SidebarProvider>
  )
}