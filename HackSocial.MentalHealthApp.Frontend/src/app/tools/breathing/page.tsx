"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { ArrowLeft, Play, Pause, RotateCcw, Wind } from "lucide-react"
import { Button } from "@/src/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/src/components/ui/card"
import { Progress } from "@/src/components/ui/progress"
import { SidebarTrigger, SidebarProvider } from "@/src/components/ui/sidebar"
import AppSidebar from "@/src/components/ui/appsidebar"

export default function BreathingExercisePage() {
  const [isActive, setIsActive] = useState(false)
  const [phase, setPhase] = useState<"inhale" | "hold" | "exhale" | "pause">("inhale")
  const [timeLeft, setTimeLeft] = useState(4)
  const [cycle, setCycle] = useState(0)
  const [totalCycles] = useState(8)

  const phases = {
    inhale: { duration: 4, next: "hold", instruction: "Breathe in slowly" },
    hold: { duration: 7, next: "exhale", instruction: "Hold your breath" },
    exhale: { duration: 8, next: "pause", instruction: "Breathe out slowly" },
    pause: { duration: 2, next: "inhale", instruction: "Rest" },
  }

  useEffect(() => {
    let interval: NodeJS.Timeout

    if (isActive && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((prev) => prev - 1)
      }, 1000)
    } else if (isActive && timeLeft === 0) {
      const currentPhase = phases[phase]
      const nextPhase = currentPhase.next as keyof typeof phases

      if (phase === "pause") {
        setCycle((prev) => prev + 1)
      }

      if (cycle >= totalCycles && phase === "pause") {
        setIsActive(false)
        setPhase("inhale")
        setTimeLeft(4)
        setCycle(0)
      } else {
        setPhase(nextPhase)
        setTimeLeft(phases[nextPhase].duration)
      }
    }

    return () => clearInterval(interval)
  }, [isActive, timeLeft, phase, cycle, totalCycles])

  const startExercise = () => {
    setIsActive(true)
    setPhase("inhale")
    setTimeLeft(4)
    setCycle(0)
  }

  const pauseExercise = () => {
    setIsActive(false)
  }

  const resetExercise = () => {
    setIsActive(false)
    setPhase("inhale")
    setTimeLeft(4)
    setCycle(0)
  }

  const getCircleScale = () => {
    switch (phase) {
      case "inhale":
        return 1 + (phases.inhale.duration - timeLeft) * 0.3
      case "hold":
        return 2.2
      case "exhale":
        return 2.2 - (phases.exhale.duration - timeLeft) * 0.15
      case "pause":
        return 1
      default:
        return 1
    }
  }

  const getCircleColor = () => {
    switch (phase) {
      case "inhale":
        return "from-sage-400 to-sage-600"
      case "hold":
        return "from-amber-400 to-amber-600"
      case "exhale":
        return "from-lavender-400 to-lavender-600"
      case "pause":
        return "from-sage-300 to-sage-500"
      default:
        return "from-sage-400 to-sage-600"
    }
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
                <h1 className="text-lg sm:text-xl font-semibold text-sage-900">Breathing Exercise</h1>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-6 sm:py-8 max-w-6xl"> {/* Changed max-w-4xl to max-w-6xl */}
        <div className="grid lg:grid-cols-3 gap-6 lg:gap-8">
          {/* Main Exercise */}
          <div className="lg:col-span-2 space-y-6">
            <Card className="border-sage-100">
              <CardHeader className="text-center">
                <CardTitle className="text-sage-900">4-7-8 Breathing Technique</CardTitle>
                <p className="text-sage-600">A calming breath pattern to reduce anxiety and promote relaxation</p>
              </CardHeader>
              <CardContent className="space-y-8">
                {/* Breathing Circle */}
                <div className="flex justify-center">
                  <div className="relative w-64 h-64 sm:w-80 sm:h-80 flex items-center justify-center">
                    <div
                      className={`absolute rounded-full bg-gradient-to-br ${getCircleColor()} transition-all duration-1000 ease-in-out opacity-20`}
                      style={{
                        width: `${getCircleScale() * 100}px`,
                        height: `${getCircleScale() * 100}px`,
                      }}
                    />
                    <div
                      className={`absolute rounded-full bg-gradient-to-br ${getCircleColor()} transition-all duration-1000 ease-in-out opacity-40`}
                      style={{
                        width: `${getCircleScale() * 80}px`,
                        height: `${getCircleScale() * 80}px`,
                      }}
                    />
                    <div
                      className={`absolute rounded-full bg-gradient-to-br ${getCircleColor()} transition-all duration-1000 ease-in-out`}
                      style={{
                        width: `${getCircleScale() * 60}px`,
                        height: `${getCircleScale() * 60}px`,
                      }}
                    />
                    <div className="absolute text-center">
                      <p className="text-2xl sm:text-3xl font-bold text-white mb-2">{timeLeft}</p>
                      <p className="text-sm sm:text-base text-white font-medium">{phases[phase].instruction}</p>
                    </div>
                  </div>
                </div>

                {/* Progress */}
                <div className="space-y-4">
                  <div className="flex justify-between text-sm text-sage-600">
                    <span>
                      Cycle {cycle + 1} of {totalCycles}
                    </span>
                    <span className="capitalize">{phase} Phase</span>
                  </div>
                  <Progress value={(cycle / totalCycles) * 100} className="h-2" />
                </div>

                {/* Controls */}
                <div className="flex justify-center space-x-4">
                  {!isActive ? (
                    <Button onClick={startExercise} className="bg-sage-600 hover:bg-sage-700 text-white px-8" size="lg">
                      <Play className="w-5 h-5 mr-2" />
                      Start Exercise
                    </Button>
                  ) : (
                    <Button
                      onClick={pauseExercise}
                      variant="outline"
                      className="border-sage-200 text-sage-700 hover:bg-sage-50 px-8 bg-transparent"
                      size="lg"
                    >
                      <Pause className="w-5 h-5 mr-2" />
                      Pause
                    </Button>
                  )}
                  <Button
                    onClick={resetExercise}
                    variant="outline"
                    className="border-sage-200 text-sage-700 hover:bg-sage-50 bg-transparent"
                    size="lg"
                  >
                    <RotateCcw className="w-5 h-5" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Instructions & Benefits - Wider Cards */}
          <div className="space-y-6 lg:col-span-1"> {/* Added lg:col-span-1 to ensure proper grid layout */}
            <Card className="border-sage-100 w-full"> {/* Added w-full */}
              <CardHeader>
                <CardTitle className="text-sage-900">How It Works</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex items-start space-x-3">
                    <div className="w-6 h-6 bg-sage-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="text-xs font-medium text-sage-600">1</span>
                    </div>
                    <div>
                      <p className="font-medium text-sage-900">Inhale (4 seconds)</p>
                      <p className="text-sm text-sage-600">Breathe in slowly through your nose</p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-3">
                    <div className="w-6 h-6 bg-amber-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="text-xs font-medium text-amber-600">2</span>
                    </div>
                    <div>
                      <p className="font-medium text-sage-900">Hold (7 seconds)</p>
                      <p className="text-sm text-sage-600">Hold your breath gently</p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-3">
                    <div className="w-6 h-6 bg-lavender-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="text-xs font-medium text-lavender-600">3</span>
                    </div>
                    <div>
                      <p className="font-medium text-sage-900">Exhale (8 seconds)</p>
                      <p className="text-sm text-sage-600">Breathe out slowly through your mouth</p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-3">
                    <div className="w-6 h-6 bg-sage-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="text-xs font-medium text-sage-600">4</span>
                    </div>
                    <div>
                      <p className="font-medium text-sage-900">Pause (2 seconds)</p>
                      <p className="text-sm text-sage-600">Rest before the next cycle</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-sage-100 w-full"> {/* Added w-full */}
              <CardHeader>
                <CardTitle className="text-sage-900">Benefits</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3 text-sm text-sage-700"> {/* Increased space-y-2 to space-y-3 */}
                  <li className="flex items-start space-x-2">
                    <div className="w-1.5 h-1.5 bg-sage-400 rounded-full mt-1.5"></div>
                    <span>Reduces anxiety and stress</span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <div className="w-1.5 h-1.5 bg-sage-400 rounded-full mt-1.5"></div>
                    <span>Promotes better sleep</span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <div className="w-1.5 h-1.5 bg-sage-400 rounded-full mt-1.5"></div>
                    <span>Lowers heart rate</span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <div className="w-1.5 h-1.5 bg-sage-400 rounded-full mt-1.5"></div>
                    <span>Improves focus</span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <div className="w-1.5 h-1.5 bg-sage-400 rounded-full mt-1.5"></div>
                    <span>Activates relaxation response</span>
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card className="border-sage-100 bg-sage-25 w-full"> {/* Added w-full */}
              <CardContent className="p-6"> {/* Increased padding from p-4 to p-6 */}
                <p className="text-sm text-sage-700 mb-4"> {/* Increased mb-3 to mb-4 */}
                  Find a comfortable position and try to practice this technique daily for best results.
                </p>
                <Button
                  variant="outline"
                  className="w-full border-sage-300 text-sage-700 hover:bg-sage-50 bg-transparent"
                  asChild
                >
                  <Link href="/chat">Share Your Experience</Link>
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