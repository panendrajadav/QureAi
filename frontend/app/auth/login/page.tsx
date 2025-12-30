"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Eye, EyeOff, Fingerprint } from "lucide-react"

export default function LoginPage() {
  const router = useRouter()
  const [showPassword, setShowPassword] = useState(false)
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault()
    // Store user data in session storage for demo
    sessionStorage.setItem(
      "user",
      JSON.stringify({
        email,
        name: "Sarah Johnson",
      }),
    )
    router.push("/dashboard")
  }

  const handleBiometricLogin = () => {
    sessionStorage.setItem(
      "user",
      JSON.stringify({
        email: "sarah@example.com",
        name: "Sarah Johnson",
      }),
    )
    router.push("/dashboard")
  }

  return (
    <div className="grid min-h-screen grid-cols-1 lg:grid-cols-2">
      {/* Left side - Form */}
      <div className="flex items-center justify-center bg-gradient-to-br from-background to-secondary px-4 py-12">
        <Card className="w-full max-w-md border-0 shadow-lg">
          <CardHeader>
            <CardTitle className="text-2xl">Welcome Back</CardTitle>
            <CardDescription>Continue your health journey</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="email">Email or Phone Number</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="sarah@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="bg-secondary/50"
                />
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="password">Password</Label>
                  <Link href="#" className="text-sm text-primary hover:underline">
                    Forgot Password?
                  </Link>
                </div>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
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

              <Button type="submit" className="w-full bg-primary hover:bg-primary/90 text-primary-foreground">
                Log In
              </Button>

              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-border"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="bg-card px-2 text-muted-foreground">OR</span>
                </div>
              </div>

              <Button type="button" variant="outline" className="w-full bg-transparent" onClick={handleBiometricLogin}>
                <Fingerprint className="mr-2 h-4 w-4" />
                Use Biometric Login
              </Button>

              <div className="text-center text-sm">
                <span className="text-muted-foreground">Don't have an account? </span>
                <Link href="/auth/signup" className="text-primary hover:underline font-medium">
                  Sign up →
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
            <h2 className="mb-4 text-4xl font-bold">Welcome Back</h2>
            <p className="text-lg opacity-90">
              Continue monitoring your health and checking drug interactions with QuraAI.
            </p>
          </div>
          <div className="space-y-4">
            <div className="rounded-lg bg-white/10 p-4 backdrop-blur">
              <p className="font-semibold">Track Medications</p>
              <p className="text-sm opacity-80">Keep all your medicines in one place</p>
            </div>
            <div className="rounded-lg bg-white/10 p-4 backdrop-blur">
              <p className="font-semibold">Get Alerts</p>
              <p className="text-sm opacity-80">Be notified of any drug interactions</p>
            </div>
            <div className="rounded-lg bg-white/10 p-4 backdrop-blur">
              <p className="font-semibold">Health Reports</p>
              <p className="text-sm opacity-80">Access your complete health records</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
