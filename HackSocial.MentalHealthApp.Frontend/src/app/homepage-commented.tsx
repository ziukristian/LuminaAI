// "use client"

// import {
//   ArrowRight,
//   MessageCircle,
//   Heart,
//   Shield,
//   Download,
//   Play,
//   Pause,
//   BarChart3,
//   BookOpen,
//   Brain,
//   Users,
//   Clock,
//   CheckCircle,
// } from "lucide-react"
// import { Button } from "@/components/ui/button"
// import { Card, CardContent } from "@/components/ui/card"
// import { Badge } from "@/components/ui/badge"
// import { useState } from "react"
// import Link from "next/link"

// export default function HomePage() {
//   const [isBreathingActive, setIsBreathingActive] = useState(false)

//   const toggleBreathing = () => {
//     setIsBreathingActive(!isBreathingActive)
//   }

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-sage-50 via-white to-lavender-50">
//       {/* Header */}
//       <header className="border-b border-sage-100 bg-white/80 backdrop-blur-sm sticky top-0 z-50">
//         <div className="container mx-auto px-4 py-4 flex items-center justify-between">
//           <div className="flex items-center space-x-2">
//             <div className="w-8 h-8 bg-gradient-to-br from-sage-400 to-sage-600 rounded-lg flex items-center justify-center">
//               <Heart className="w-5 h-5 text-white" />
//             </div>
//             <span className="text-xl font-semibold text-sage-900">AI Mental Health Buddy</span>
//           </div>
//           <nav className="flex items-center space-x-6">
//             <div className="hidden md:flex items-center space-x-6">
//               <a href="#features" className="text-sage-700 hover:text-sage-900 transition-colors">
//                 Features
//               </a>
//               <a href="#how-it-works" className="text-sage-700 hover:text-sage-900 transition-colors">
//                 How It Works
//               </a>
//               <a href="#privacy" className="text-sage-700 hover:text-sage-900 transition-colors">
//                 Privacy
//               </a>
//               <Button
//                 variant="outline"
//                 className="border-sage-200 text-sage-700 hover:bg-sage-50 bg-transparent"
//                 asChild
//               >
//                 <Link href="/auth/signin">Sign In</Link>
//               </Button>
//               <Button className="bg-sage-600 hover:bg-sage-700 text-white" asChild>
//                 <Link href="/chat">Start Chatting</Link>
//               </Button>
//             </div>

//             {/* Mobile menu button */}
//             <div className="md:hidden">
//               <Button className="bg-sage-600 hover:bg-sage-700 text-white" asChild>
//                 <Link href="/chat">Chat</Link>
//               </Button>
//             </div>
//           </nav>
//         </div>
//       </header>

//       {/* Rest of homepage content commented out... */}
//       {/* ... */}
//     </div>
//   )
// }
