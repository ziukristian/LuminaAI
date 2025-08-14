"use client"

import { useState } from "react"
import Link from "next/link"
import { ArrowLeft, Heart, Eye, EyeOff, Shield, Lock } from "lucide-react"
import { Button } from "@/src/components/ui/button"
import { Input } from "@/src/components/ui/input"
import { Label } from "@/src/components/ui/label"
import { Card, CardContent, CardHeader } from "@/src/components/ui/card"
import { Checkbox } from "@/src/components/ui/checkbox"
import { useRouter } from "next/navigation";

export default function SignInPage() {
  const [showPassword, setShowPassword] = useState(false)
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const router = useRouter();

  return (
    <div className="min-h-screen bg-gradient-to-br from-sage-50 via-white to-lavender-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md space-y-6">
        <div className="text-center space-y-4">
          {/* <Link href="/" className="inline-flex items-center text-sage-600 hover:text-sage-700 transition-colors mb-4">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to home
          </Link> */}

          <div className="flex items-center justify-center space-x-2">
            <div className="w-10 h-10 bg-gradient-to-br from-sage-400 to-sage-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">L</span>
            </div>
            <span className="text-2xl font-semibold text-sage-900">Welcome back</span>
          </div>

          <p className="text-sage-700">Continue your wellness journey in a safe, private space</p>
        </div>

        <Card className="border-sage-100 shadow-lg">
          <CardHeader className="space-y-2 pb-4">
            <div className="flex items-center justify-center space-x-2 text-sage-600">
              <Shield className="w-4 h-4" />
              <span className="text-sm">Your privacy is protected</span>
            </div>
          </CardHeader>

          <CardContent className="space-y-6">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-sage-900">
                  Email
                </Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="your.email@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="border-sage-200 focus:border-sage-400 focus:ring-sage-400"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password" className="text-sage-900">
                  Password
                </Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="border-sage-200 focus:border-sage-400 focus:ring-sage-400 pr-10"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4 text-sage-500" />
                    ) : (
                      <Eye className="h-4 w-4 text-sage-500" />
                    )}
                  </Button>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Checkbox id="remember" className="border-sage-300" />
                  <Label htmlFor="remember" className="text-sm text-sage-700">
                    Remember me
                  </Label>
                </div>
                <Link href="/auth/forgot-password" className="text-sm text-sage-600 hover:text-sage-700">
                  Forgot password?
                </Link>
              </div>
            </div>

            <Button
      onClick={() => router.push("/dashboard")}
      className="w-full bg-sage-600 hover:bg-sage-700 text-white"
      size="lg"
    >
      <Lock className="w-4 h-4 mr-2" />
      Sign in securely
    </Button>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t border-sage-200" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-white px-2 text-sage-500">Or continue with</span>
              </div>
            </div>

            <div className="space-y-3">
              <Button
                variant="outline"
                className="w-full border-sage-200 text-sage-700 hover:bg-sage-50 bg-transparent"
              >
                <svg className="w-4 h-4 mr-2" viewBox="0 0 24 24">
                  <path
                    fill="currentColor"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="currentColor"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="currentColor"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                  />
                  <path
                    fill="currentColor"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  />
                </svg>
                Continue with Google
              </Button>

              <Button
                variant="outline"
                className="w-full border-sage-200 text-sage-700 hover:bg-sage-50 bg-transparent"
              >
                <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12.017 0C5.396 0 .029 5.367.029 11.987c0 5.079 3.158 9.417 7.618 11.024-.105-.949-.199-2.403.041-3.439.219-.937 1.406-5.957 1.406-5.957s-.359-.72-.359-1.781c0-1.663.967-2.911 2.168-2.911 1.024 0 1.518.769 1.518 1.688 0 1.029-.653 2.567-.992 3.992-.285 1.193.6 2.165 1.775 2.165 2.128 0 3.768-2.245 3.768-5.487 0-2.861-2.063-4.869-5.008-4.869-3.41 0-5.409 2.562-5.409 5.199 0 1.033.394 2.143.889 2.741.097.118.112.221.085.345-.09.375-.293 1.199-.334 1.363-.053.225-.172.271-.402.165-1.495-.69-2.433-2.878-2.433-4.646 0-3.776 2.748-7.252 7.92-7.252 4.158 0 7.392 2.967 7.392 6.923 0 4.135-2.607 7.462-6.233 7.462-1.214 0-2.357-.629-2.75-1.378l-.748 2.853c-.271 1.043-1.002 2.35-1.492 3.146C9.57 23.812 10.763 24.009 12.017 24.009c6.624 0 11.99-5.367 11.99-11.988C24.007 5.367 18.641.001.012.017z" />
                </svg>
                Continue with Apple
              </Button>
            </div>

            <div className="text-center space-y-2">
              <p className="text-sm text-sage-600">
                Don't have an account?{" "}
                <Link href="/auth/signup" className="text-sage-700 hover:text-sage-800 font-medium">
                  Sign up for free
                </Link>
              </p>
              <p className="text-xs text-sage-500">
                By signing in, you agree to our{" "}
                <Link href="/privacy" className="underline hover:text-sage-600">
                  Privacy Policy
                </Link>
              </p>
            </div>
          </CardContent>
        </Card>

        <Card className="border-sage-100 bg-sage-25">
          <CardContent className="p-4 text-center">
            <p className="text-sm text-sage-700 mb-3">Need support right now? You can start chatting anonymously.</p>
            <Button variant="outline" className="border-sage-300 text-sage-700 hover:bg-sage-50 bg-transparent" asChild>
              <Link href="/chat/anonymous">Start Anonymous Chat</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
