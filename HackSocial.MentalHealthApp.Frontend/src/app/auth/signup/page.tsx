"use client"

import { useState } from "react"
import Link from "next/link"
import { ArrowLeft, Heart, Eye, EyeOff, Shield, CheckCircle } from "lucide-react"
import { Button } from "@/src/components/ui/button"
import { Input } from "@/src/components/ui/input"
import { Label } from "@/src/components/ui/label"
import { Card, CardContent, CardHeader } from "@/src/components/ui/card"
import { Checkbox } from "@/src/components/ui/checkbox"
import { useRouter } from "next/navigation";

export default function SignUpPage() {
   const router = useRouter();
  const [showPassword, setShowPassword] = useState(false)
  const [formData, setFormData] = useState({
    firstName: "",
    email: "",
    password: "",
    agreeToTerms: false,
    agreeToPrivacy: false,
  })

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-sage-50 via-white to-lavender-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md space-y-6">
        {/* Header */}
        <div className="text-center space-y-4">

          <div className="flex items-center justify-center space-x-2">
            <div className="w-10 h-10 bg-gradient-to-br from-sage-400 to-sage-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">L</span>
            </div>
            <span className="text-2xl font-semibold text-sage-900">Join our community</span>
          </div>

          <p className="text-sage-700">Create your safe space for mental wellness and growth</p>
        </div>

        {/* Benefits */}
        <Card className="border-sage-100 bg-sage-25">
          <CardContent className="p-4">
            <h3 className="font-medium text-sage-900 mb-3">What you'll get:</h3>
            <div className="space-y-2">
              <div className="flex items-center space-x-2 text-sm text-sage-700">
                <CheckCircle className="w-4 h-4 text-sage-500" />
                <span>Personalized mood tracking & insights</span>
              </div>
              <div className="flex items-center space-x-2 text-sm text-sage-700">
                <CheckCircle className="w-4 h-4 text-sage-500" />
                <span>24/7 AI companion conversations</span>
              </div>
              <div className="flex items-center space-x-2 text-sm text-sage-700">
                <CheckCircle className="w-4 h-4 text-sage-500" />
                <span>Guided journaling & CBT tools</span>
              </div>
              <div className="flex items-center space-x-2 text-sm text-sage-700">
                <CheckCircle className="w-4 h-4 text-sage-500" />
                <span>Complete privacy & encryption</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Sign Up Form */}
        <Card className="border-sage-100 shadow-lg">
          <CardHeader className="space-y-2 pb-4">
            <div className="flex items-center justify-center space-x-2 text-sage-600">
              <Shield className="w-4 h-4" />
              <span className="text-sm">Your data is always private & secure</span>
            </div>
          </CardHeader>

          <CardContent className="space-y-6">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="firstName" className="text-sage-900">
                  First name (optional)
                </Label>
                <Input
                  id="firstName"
                  type="text"
                  placeholder="What should we call you?"
                  value={formData.firstName}
                  onChange={(e) => handleInputChange("firstName", e.target.value)}
                  className="border-sage-200 focus:border-sage-400 focus:ring-sage-400"
                />
                <p className="text-xs text-sage-500">This helps personalize your experience, but you can skip it</p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="email" className="text-sage-900">
                  Email
                </Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="your.email@example.com"
                  value={formData.email}
                  onChange={(e) => handleInputChange("email", e.target.value)}
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
                    placeholder="Create a secure password"
                    value={formData.password}
                    onChange={(e) => handleInputChange("password", e.target.value)}
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
                <p className="text-xs text-sage-500">At least 8 characters with a mix of letters and numbers</p>
              </div>

              <div className="space-y-3">
                <div className="flex items-start space-x-2">
                  <Checkbox
                    id="terms"
                    className="border-sage-300 mt-1"
                    checked={formData.agreeToTerms}
                    onCheckedChange={(checked) => handleInputChange("agreeToTerms", checked as boolean)}
                  />
                  <Label htmlFor="terms" className="text-sm text-sage-700 leading-relaxed">
                    I agree to the{" "}
                    <Link href="/terms" className="text-sage-600 hover:text-sage-700 underline">
                      Terms of Service
                    </Link>
                  </Label>
                </div>

                <div className="flex items-start space-x-2">
                  <Checkbox
                    id="privacy"
                    className="border-sage-300 mt-1"
                    checked={formData.agreeToPrivacy}
                    onCheckedChange={(checked) => handleInputChange("agreeToPrivacy", checked as boolean)}
                  />
                  <Label htmlFor="privacy" className="text-sm text-sage-700 leading-relaxed">
                    I understand the{" "}
                    <Link href="/privacy" className="text-sage-600 hover:text-sage-700 underline">
                      Privacy Policy
                    </Link>{" "}
                    and consent to data processing
                  </Label>
                </div>
              </div>
            </div>

            <Button
              onClick={() => router.push("/auth/signin")}
              className="w-full bg-sage-600 hover:bg-sage-700 text-white"
              size="lg"
              disabled={!formData.agreeToTerms || !formData.agreeToPrivacy}
            >
              Create my safe space
            </Button>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t border-sage-200" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-white px-2 text-sage-500">Or sign up with</span>
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

            <div className="text-center">
              <p className="text-sm text-sage-600">
                Already have an account?{" "}
                <Link href="/auth/signin" className="text-sage-700 hover:text-sage-800 font-medium">
                  Sign in here
                </Link>
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Anonymous Option */}
        <Card className="border-sage-100 bg-sage-25">
          <CardContent className="p-4 text-center">
            <p className="text-sm text-sage-700 mb-3">
              Not ready to create an account? You can start chatting anonymously.
            </p>
            <Button variant="outline" className="border-sage-300 text-sage-700 hover:bg-sage-50 bg-transparent" asChild>
              <Link href="/chat">Try Anonymous Chat</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
