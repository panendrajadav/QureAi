"use client"

import type React from "react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { useRouter } from "next/navigation"
import apiClient from "@/lib/api-client"

export default function LoginPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const router = useRouter()

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email || !password) {
      setError("Please fill in all fields")
      return
    }
    
    setIsLoading(true)
    setError("")
    
    try {
      const result = await apiClient.login(email, password)
      if (result.success) {
        router.push("/dashboard")
      } else {
        setError(result.message || "Login failed")
      }
    } catch (error) {
      setError("Login failed. Please check your credentials.")
      console.error("Login error:", error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen grid grid-cols-1 md:grid-cols-2">
      {/* Left Form Section */}
      <div className="flex items-center justify-center px-4 py-12 bg-background">
        <div className="w-full max-w-md">
          {/* Logo */}
          <div className="flex items-center gap-2 mb-8">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground font-bold text-sm">
              Q
            </div>
            <span className="text-2xl font-bold text-primary">QuraAI</span>
          </div>

          {/* Form Content */}
          <div>
            <h1 className="text-3xl font-bold text-foreground mb-2">Welcome Back</h1>
            <p className="text-muted-foreground mb-8">Continue your health journey</p>

            <form onSubmit={handleLogin} className="space-y-6">
              {/* Error Message */}
              {error && (
                <div className="p-3 rounded-lg bg-red-50 border border-red-200 text-red-700 text-sm">
                  {error}
                </div>
              )}
              
              {/* Email Input */}
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-foreground mb-2">
                  Email or Phone Number
                </label>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="sarah@example.com"
                  className="w-full px-4 py-2.5 rounded-lg bg-muted border border-input text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                />
              </div>

              {/* Password Input */}
              <div>
                <div className="flex justify-between items-center mb-2">
                  <label htmlFor="password" className="block text-sm font-medium text-foreground">
                    Password
                  </label>
                  <Link href="/forgot-password" className="text-sm text-primary hover:underline">
                    Forgot Password?
                  </Link>
                </div>
                <div className="relative">
                  <input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full px-4 py-2.5 rounded-lg bg-muted border border-input text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  >
                    {showPassword ? "🔒" : "👁️"}
                  </button>
                </div>
              </div>

              {/* Login Button */}
              <Button
                type="submit"
                disabled={isLoading}
                className="w-full h-11 bg-primary text-primary-foreground font-semibold rounded-lg hover:bg-primary/90 disabled:opacity-50"
              >
                {isLoading ? "Logging in..." : "Log In"}
              </Button>
            </form>

            {/* Divider */}
            <div className="flex items-center my-6">
              <div className="flex-1 border-t border-border"></div>
              <span className="px-3 text-sm text-muted-foreground">OR</span>
              <div className="flex-1 border-t border-border"></div>
            </div>

            {/* Biometric Login */}
            <button
              onClick={() => console.log("[v0] Biometric login initiated")}
              className="w-full px-4 py-2.5 rounded-lg border border-border text-foreground hover:bg-muted transition-colors flex items-center justify-center gap-2 font-medium"
            >
              <span>🔐</span>
              Use Biometric Login
            </button>

            {/* Sign Up Link */}
            <p className="text-center text-muted-foreground text-sm mt-6">
              Don't have an account?{" "}
              <Link href="/signup" className="text-primary font-semibold hover:underline">
                Sign up →
              </Link>
            </p>
          </div>
        </div>
      </div>

      {/* Right Hero Section */}
      <div className="hidden md:flex items-center justify-center bg-gradient-to-b from-primary to-accent text-primary-foreground p-12">
        <div className="max-w-md text-center">
          <h2 className="text-4xl font-bold mb-6">Welcome Back</h2>
          <p className="text-lg opacity-90 mb-12 leading-relaxed">
            Continue monitoring your health and checking drug interactions with QuraAI.
          </p>

          <div className="space-y-4">
            <div className="bg-primary/20 backdrop-blur rounded-xl p-4 border border-primary/30">
              <h3 className="font-semibold mb-1">Track Medications</h3>
              <p className="text-sm opacity-85">Keep all your medicines in one place</p>
            </div>
            <div className="bg-primary/20 backdrop-blur rounded-xl p-4 border border-primary/30">
              <h3 className="font-semibold mb-1">Get Alerts</h3>
              <p className="text-sm opacity-85">Be notified of any drug interactions</p>
            </div>
            <div className="bg-primary/20 backdrop-blur rounded-xl p-4 border border-primary/30">
              <h3 className="font-semibold mb-1">Health Reports</h3>
              <p className="text-sm opacity-85">Access your complete health records</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
