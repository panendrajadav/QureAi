"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import Link from "next/link"

export default function SignupPage() {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
    otp: "",
  })
  const [healthInterests, setHealthInterests] = useState<string[]>([])
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const healthOptions = [
    "Diabetes Management",
    "Blood Pressure Monitoring",
    "Heart Health",
    "Pregnancy Care",
    "Elderly Care",
    "Medicine Reminders",
    "Enable Emergency Contact Sharing",
  ]

  const toggleHealth = (option: string) => {
    setHealthInterests((prev) => (prev.includes(option) ? prev.filter((h) => h !== option) : [...prev, option]))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1500))
      console.log("[v0] Signup successful with interests:", healthInterests)
      // Redirect to onboarding
      window.location.href = "/onboarding/health-status"
    } catch (error) {
      console.error("[v0] Signup error:", error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen grid grid-cols-1 md:grid-cols-2">
      {/* Left Form Section */}
      <div className="flex items-center justify-center px-4 py-8 md:py-12 bg-background">
        <div className="w-full max-w-md">
          {/* Logo */}
          <div className="flex items-center gap-2 mb-8">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground font-bold text-sm">
              Q
            </div>
            <span className="text-xl md:text-2xl font-bold text-primary">QuraAI</span>
          </div>

          {/* Form Content */}
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-foreground mb-2">Create Your Account</h1>
            <p className="text-muted-foreground mb-8 text-sm md:text-base">
              Join QuraAI for personalized health monitoring
            </p>

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Full Name */}
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-foreground mb-2">
                  Full Name
                </label>
                <input
                  id="name"
                  type="text"
                  value={formData.fullName}
                  onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                  placeholder="John Doe"
                  className="w-full px-4 py-2.5 rounded-lg bg-muted border border-input text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-sm"
                />
              </div>

              {/* Email */}
              <div>
                <label htmlFor="signup-email" className="block text-sm font-medium text-foreground mb-2">
                  Email or Phone Number
                </label>
                <input
                  id="signup-email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="john@example.com"
                  className="w-full px-4 py-2.5 rounded-lg bg-muted border border-input text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-sm"
                />
              </div>

              {/* Password */}
              <div>
                <label htmlFor="signup-password" className="block text-sm font-medium text-foreground mb-2">
                  Create Password
                </label>
                <div className="relative">
                  <input
                    id="signup-password"
                    type={showPassword ? "text" : "password"}
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    placeholder="••••••••"
                    className="w-full px-4 py-2.5 rounded-lg bg-muted border border-input text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-sm"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground text-lg"
                  >
                    {showPassword ? "🔒" : "👁️"}
                  </button>
                </div>
              </div>

              {/* OTP */}
              <div>
                <label htmlFor="otp" className="block text-sm font-medium text-foreground mb-2">
                  Enter OTP
                </label>
                <div className="flex gap-2">
                  <input
                    id="otp"
                    type="text"
                    value={formData.otp}
                    onChange={(e) => setFormData({ ...formData, otp: e.target.value })}
                    placeholder="000000"
                    className="flex-1 px-4 py-2.5 rounded-lg bg-muted border border-input text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-sm"
                  />
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => console.log("[v0] OTP sent to:", formData.email)}
                    className="whitespace-nowrap bg-transparent text-sm"
                  >
                    Send OTP
                  </Button>
                </div>
              </div>

              {/* Health Interests */}
              <div>
                <label className="block text-sm font-medium text-foreground mb-3">Health Interests</label>
                <p className="text-sm text-muted-foreground mb-3">Help us personalize your experience</p>
                <div className="space-y-2 max-h-48 overflow-y-auto">
                  {healthOptions.map((option) => (
                    <label
                      key={option}
                      className="flex items-center gap-3 cursor-pointer p-2 rounded-lg hover:bg-muted transition-colors"
                    >
                      <input
                        type="checkbox"
                        checked={healthInterests.includes(option)}
                        onChange={() => toggleHealth(option)}
                        className="w-4 h-4 accent-primary"
                      />
                      <span className="text-sm text-foreground">{option}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Submit Button */}
              <Button
                type="submit"
                disabled={isLoading || !formData.fullName || !formData.email || !formData.password}
                className="w-full h-11 bg-primary text-primary-foreground font-semibold rounded-lg hover:bg-primary/90 disabled:opacity-50 text-sm"
              >
                {isLoading ? "Creating Account..." : "Create Account"}
              </Button>
            </form>

            {/* Login Link */}
            <p className="text-center text-muted-foreground text-sm mt-6">
              Already have an account?{" "}
              <Link href="/login" className="text-primary font-semibold hover:underline">
                Log in →
              </Link>
            </p>
          </div>
        </div>
      </div>

      {/* Right Hero Section */}
      <div className="hidden md:flex items-center justify-center bg-gradient-to-b from-primary to-accent text-primary-foreground p-8 lg:p-12">
        <div className="max-w-md text-center space-y-8">
          <div>
            <h2 className="text-3xl lg:text-4xl font-bold mb-4">Welcome to QuraAI</h2>
            <p className="text-base lg:text-lg opacity-90 leading-relaxed">
              Take control of your health with AI-powered drug interaction checking and personalized medicine tracking.
            </p>
          </div>

          <div className="space-y-4">
            <div className="bg-primary/20 backdrop-blur rounded-xl p-4 border border-primary/30">
              <h3 className="font-semibold mb-1 text-sm lg:text-base">HIPAA Compliant</h3>
              <p className="text-xs lg:text-sm opacity-85">Your health data is secure and private</p>
            </div>
            <div className="bg-primary/20 backdrop-blur rounded-xl p-4 border border-primary/30">
              <h3 className="font-semibold mb-1 text-sm lg:text-base">24/7 Monitoring</h3>
              <p className="text-xs lg:text-sm opacity-85">Get real-time alerts about drug interactions</p>
            </div>
            <div className="bg-primary/20 backdrop-blur rounded-xl p-4 border border-primary/30">
              <h3 className="font-semibold mb-1 text-sm lg:text-base">Expert Insights</h3>
              <p className="text-xs lg:text-sm opacity-85">AI-powered health recommendations</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
