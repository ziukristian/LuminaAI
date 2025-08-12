"use client"

import { useState } from "react"
import Link from "next/link"
import { ArrowLeft, Brain, CheckCircle, ArrowRight, RotateCcw } from "lucide-react"
import { Button } from "@/src/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/src/components/ui/card"
import { Textarea } from "@/src/components/ui/textarea"
import { Label } from "@/src/components/ui/label"
import { Badge } from "@/src/components/ui/badge"
import AppSidebar from "@/src/components/ui/appsidebar"
import { SidebarProvider, SidebarTrigger } from "@/src/components/ui/sidebar"

export default function CBTExercisePage() {
  const [currentStep, setCurrentStep] = useState(0)
  const [responses, setResponses] = useState<string[]>(["", "", "", "", ""])
  const [selectedExercise, setSelectedExercise] = useState<string>("thought-record")

  const exercises = {
    "thought-record": {
      title: "Thought Record",
      description: "Identify and challenge negative thought patterns",
      steps: [
        {
          title: "Situation",
          question: "Describe the situation that triggered your negative thoughts. What happened?",
          placeholder: "Example: I received critical feedback at work...",
        },
        {
          title: "Emotions",
          question: "What emotions are you feeling? Rate their intensity from 1-10.",
          placeholder: "Example: Anxious (8/10), Disappointed (6/10)...",
        },
        {
          title: "Automatic Thoughts",
          question: "What thoughts went through your mind? What were you telling yourself?",
          placeholder: "Example: I'm terrible at my job, I'm going to get fired...",
        },
        {
          title: "Evidence For",
          question: "What evidence supports these thoughts? Be specific and factual.",
          placeholder: "Example: I did make some mistakes in the project...",
        },
        {
          title: "Evidence Against",
          question: "What evidence contradicts these thoughts? Consider alternative perspectives.",
          placeholder: "Example: My manager also mentioned things I did well...",
        },
        {
          title: "Balanced Thought",
          question: "Based on the evidence, what's a more balanced, realistic thought?",
          placeholder:
            "Example: I made some mistakes, but I also did many things well. This is feedback to help me improve...",
        },
      ],
    },
    "worry-time": {
      title: "Worry Time",
      description: "Schedule and contain your worries to reduce anxiety",
      steps: [
        {
          title: "Current Worries",
          question: "List all the things you're worried about right now.",
          placeholder: "Example: Job security, health, relationships...",
        },
        {
          title: "Categorize",
          question: "Which worries can you control vs. which are outside your control?",
          placeholder:
            "Can control: My work performance, my health habits...\nCannot control: Economic conditions, other people's opinions...",
        },
        {
          title: "Action Plan",
          question: "For controllable worries, what specific actions can you take?",
          placeholder: "Example: Schedule a meeting with my manager, start exercising 3x per week...",
        },
        {
          title: "Acceptance",
          question: "For uncontrollable worries, how can you practice acceptance?",
          placeholder: "Example: I can't control the economy, but I can focus on doing my best work...",
        },
      ],
    },
    "gratitude-reframe": {
      title: "Gratitude Reframing",
      description: "Shift perspective by finding positive aspects in difficult situations",
      steps: [
        {
          title: "Difficult Situation",
          question: "Describe a challenging situation you're facing.",
          placeholder: "Example: I'm dealing with a difficult relationship conflict...",
        },
        {
          title: "Growth Opportunity",
          question: "How might this situation help you grow or learn something new?",
          placeholder: "Example: This is teaching me to communicate more clearly and set boundaries...",
        },
        {
          title: "Hidden Blessings",
          question: "What unexpected positive outcomes might come from this situation?",
          placeholder: "Example: This conflict is helping me understand what I truly value in relationships...",
        },
        {
          title: "Gratitude Statement",
          question: "Write a gratitude statement about this situation, even if it feels difficult.",
          placeholder: "Example: I'm grateful for this challenge because it's helping me become more resilient...",
        },
      ],
    },
  }

  const currentExercise = exercises[selectedExercise as keyof typeof exercises]
  const isLastStep = currentStep === currentExercise.steps.length - 1
  const isComplete = responses.every((response) => response.trim() !== "")

  const handleNext = () => {
    if (currentStep < currentExercise.steps.length - 1) {
      setCurrentStep(currentStep + 1)
    }
  }

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1)
    }
  }

  const handleResponseChange = (value: string) => {
    const newResponses = [...responses]
    newResponses[currentStep] = value
    setResponses(newResponses)
  }

  const resetExercise = () => {
    setCurrentStep(0)
    setResponses(["", "", "", "", ""])
  }

  const switchExercise = (exerciseKey: string) => {
    setSelectedExercise(exerciseKey)
    resetExercise()
  }

  return (
    <SidebarProvider>
    <div className="flex min-h-screen bg-gradient-to-br from-sage-50 via-white to-lavender-50">
      <AppSidebar />
      <div className="flex-1 overflow-y-auto">
      {/* Header */}
      <div className="bg-white border-b border-sage-100">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
               <SidebarTrigger className="hover:bg-sage-100 rounded-lg" />
              <div className="flex items-center space-x-2">
                <h1 className="text-lg sm:text-xl font-semibold text-sage-900">CBT Exercises</h1>
              </div>
            </div>

            <Button
              onClick={resetExercise}
              variant="outline"
              className="border-sage-200 text-sage-700 hover:bg-sage-50 bg-transparent"
            >
              <RotateCcw className="w-4 h-4 mr-2" />
              <span className="hidden sm:inline">Reset</span>
            </Button>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-6 sm:py-8 max-w-6xl">
        <div className="grid lg:grid-cols-4 gap-6 lg:gap-8">
          {/* Exercise Selection */}
          <div className="lg:col-span-1 space-y-6">
            <Card className="border-sage-100">
              <CardHeader>
                <CardTitle className="text-sage-900">Choose Exercise</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {Object.entries(exercises).map(([key, exercise]) => (
                  <div
                    key={key}
                    className={`p-3 rounded-lg border cursor-pointer transition-all ${
                      selectedExercise === key
                        ? "border-sage-300 bg-sage-50"
                        : "border-sage-100 hover:border-sage-200 hover:bg-sage-25"
                    }`}
                    onClick={() => switchExercise(key)}
                  >
                    <h4 className="font-medium text-sage-900 mb-1">{exercise.title}</h4>
                    <p className="text-sm text-sage-600">{exercise.description}</p>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Progress */}
            <Card className="border-sage-100">
              <CardHeader>
                <CardTitle className="text-sage-900">Progress</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {currentExercise.steps.map((step, index) => (
                    <div key={index} className="flex items-center space-x-2">
                      <div
                        className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-medium ${
                          index < currentStep
                            ? "bg-green-100 text-green-600"
                            : index === currentStep
                              ? "bg-sage-100 text-sage-600"
                              : "bg-gray-100 text-gray-400"
                        }`}
                      >
                        {index < currentStep ? <CheckCircle className="w-4 h-4" /> : index + 1}
                      </div>
                      <span className={`text-sm ${index <= currentStep ? "text-sage-900" : "text-sage-500"}`}>
                        {step.title}
                      </span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Main Exercise */}
          <div className="lg:col-span-3 space-y-6">
            <Card className="border-sage-100">
              <CardHeader>
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <CardTitle className="text-sage-900">{currentExercise.title}</CardTitle>
                    <p className="text-sage-600 mt-1">{currentExercise.description}</p>
                  </div>
                  <Badge className="bg-sage-100 text-sage-800 w-fit">
                    Step {currentStep + 1} of {currentExercise.steps.length}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="response" className="text-lg font-medium text-sage-900">
                      {currentExercise.steps[currentStep].title}
                    </Label>
                    <p className="text-sage-600 mt-1">{currentExercise.steps[currentStep].question}</p>
                  </div>

                  <Textarea
                    id="response"
                    placeholder={currentExercise.steps[currentStep].placeholder}
                    value={responses[currentStep]}
                    onChange={(e) => handleResponseChange(e.target.value)}
                    className="min-h-[200px] border-sage-200 focus:border-sage-400 focus:ring-sage-400 resize-none"
                  />
                </div>

                {/* Navigation */}
                <div className="flex flex-col sm:flex-row justify-between gap-4">
                  <Button
                    onClick={handlePrevious}
                    disabled={currentStep === 0}
                    variant="outline"
                    className="border-sage-200 text-sage-700 hover:bg-sage-50 bg-transparent"
                  >
                    Previous
                  </Button>

                  <div className="flex gap-2">
                    {!isLastStep ? (
                      <Button
                        onClick={handleNext}
                        disabled={!responses[currentStep].trim()}
                        className="bg-sage-600 hover:bg-sage-700 text-white"
                      >
                        Next Step
                        <ArrowRight className="w-4 h-4 ml-2" />
                      </Button>
                    ) : (
                      <Button
                        disabled={!responses[currentStep].trim()}
                        className="bg-green-600 hover:bg-green-700 text-white"
                      >
                        <CheckCircle className="w-4 h-4 mr-2" />
                        Complete Exercise
                      </Button>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Summary (shown when complete) */}
            {isComplete && (
              <Card className="border-green-200 bg-green-25">
                <CardHeader>
                  <CardTitle className="text-green-900 flex items-center">
                    <CheckCircle className="w-5 h-5 mr-2" />
                    Exercise Complete!
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-green-800">
                    Great work! You've completed the {currentExercise.title} exercise. Take a moment to reflect on your
                    insights.
                  </p>
                  <div className="flex flex-col sm:flex-row gap-3">
                    <Button
                      variant="outline"
                      className="border-green-300 text-green-700 hover:bg-green-50 bg-transparent"
                      asChild
                    >
                      <Link href="/chat">Discuss with AI Buddy</Link>
                    </Button>
                    <Button
                      onClick={resetExercise}
                      variant="outline"
                      className="border-sage-200 text-sage-700 hover:bg-sage-50 bg-transparent"
                    >
                      Try Another Exercise
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
    </div>
    </SidebarProvider>
  )
}
