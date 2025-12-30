"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Eye, EyeOff } from "lucide-react"

const HEALTH_INTERESTS = [
  { id: "diabetes", label: "Diabetes Management" },
  { id: "blood-pressure", label: "Blood Pressure Monitoring" },
  { id: "heart", label: "Heart Health" },
  { id: "pregnancy", label: "Pregnancy Care" },
  { id: "elderly", label: "Elderly Care" },
  { id: "medicine-reminders", label: "Medicine Reminders" },
]

export default function SignupPage() {
  const router = useRouter()
  const [showPassword, setShowPassword] = useState(false)
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
    healthInterests: [] as string[],
    emergencyContact: false,
  })
  const [otp, setOtp] = useState("")
  const [showOtp, setShowOtp] = useState(false)

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleHealthInterestChange = (id: string) => {
    setFormData((prev) => ({
      ...prev,
      healthInterests: prev.healthInterests.includes(id)
        ? prev.healthInterests.filter((item) => item !== id)
        : [...prev.healthInterests, id],
    }))
  }

  const handleSignup = (e: React.FormEvent) => {
    e.preventDefault()
    // Store user data in session storage for demo
    sessionStorage.setItem(
      "user",
      JSON.stringify({
        fullName: formData.fullName,
        email: formData.email,
        healthInterests: formData.healthInterests,
        emergencyContact: formData.emergencyContact,
      }),
    )
    router.push("/dashboard")
  }

  return (
    <div className="grid min-h-screen grid-cols-1 lg:grid-cols-2">
      {/* Left side - Signup form */}
      <div className="flex items-center justify-center bg-gradient-to-br from-background to-secondary px-4 py-12">
        <Card className="w-full max-w-md border-0 shadow-lg">
          <CardHeader>
            <CardTitle className="text-2xl">Create Your Account</CardTitle>
            <CardDescription>Join QuraAI for personalized health monitoring</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSignup} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="fullName">Full Name</Label>
                <Input
                  id="fullName"
                  name="fullName"
                  placeholder="John Doe"
                  value={formData.fullName}
                  onChange={handleInputChange}
                  required
                  className="bg-secondary/50"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email or Phone Number</Label>
                <Input
                  id="email"
                  name="email"
                  placeholder="john@example.com"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                  className="bg-secondary/50"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Create Password</Label>
                <div className="relative">
                  <Input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    value={formData.password}
                    onChange={handleInputChange}
                    required
                    className="bg-secondary/50 pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="otp">Enter OTP</Label>
                <div className="flex gap-2">
                  <Input
                    id="otp"
                    placeholder="000000"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                    className="flex-1 bg-secondary/50"
                  />
                  <Button type="button" variant="outline" className="px-6 bg-transparent">
                    Send OTP
                  </Button>
                </div>
              </div>

              <div className="space-y-3">
                <p className="text-sm font-semibold text-foreground">Health Interests</p>
                <p className="text-xs text-muted-foreground">Help us personalize your experience</p>
                <div className="grid gap-3">
                  {HEALTH_INTERESTS.map((interest) => (
                    <div key={interest.id} className="flex items-center space-x-2">
                      <Checkbox
                        id={interest.id}
                        checked={formData.healthInterests.includes(interest.id)}
                        onCheckedChange={() => handleHealthInterestChange(interest.id)}
                      />
                      <Label htmlFor={interest.id} className="text-sm font-normal cursor-pointer">
                        {interest.label}
                      </Label>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="emergency"
                  checked={formData.emergencyContact}
                  onCheckedChange={(checked) =>
                    setFormData((prev) => ({ ...prev, emergencyContact: checked as boolean }))
                  }
                />
                <Label htmlFor="emergency" className="text-sm font-normal cursor-pointer">
                  Enable Emergency Contact Sharing
                </Label>
              </div>

              <Button type="submit" className="w-full bg-primary hover:bg-primary/90 text-primary-foreground">
                Create Account
              </Button>

              <div className="text-center text-sm">
                <span className="text-muted-foreground">Already have an account? </span>
                <Link href="/auth/login" className="text-primary hover:underline font-medium">
                  Log in →
                </Link>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>

      {/* Right side - Info */}
      <div className="hidden items-center justify-center bg-primary p-8 lg:flex">
        <div className="space-y-8 text-center text-primary-foreground">
          <div>
            <h2 className="mb-4 text-4xl font-bold">Welcome to QuraAI</h2>
            <p className="text-lg opacity-90">
              Take control of your health with AI-powered drug interaction checking and personalized medicine tracking.
            </p>
          </div>
          <div className="space-y-4">
            <div className="rounded-lg bg-white/10 p-4 backdrop-blur">
              <p className="font-semibold">HIPAA Compliant</p>
              <p className="text-sm opacity-80">Your health data is secure and private</p>
            </div>
            <div className="rounded-lg bg-white/10 p-4 backdrop-blur">
              <p className="font-semibold">24/7 Monitoring</p>
              <p className="text-sm opacity-80">Get real-time alerts about drug interactions</p>
            </div>
            <div className="rounded-lg bg-white/10 p-4 backdrop-blur">
              <p className="font-semibold">Expert Insights</p>
              <p className="text-sm opacity-80">AI-powered health recommendations</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
