"use client"

import { Button } from "@/components/ui/button"
import Link from "next/link"

export default function SimpleModeSetupPage() {
  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-2xl">
        {/* Header */}
        <div className="mb-12">
          <h1 className="text-4xl font-bold text-foreground mb-4">You're all set!</h1>
          <p className="text-lg text-muted-foreground">You can ask general health questions and get wellness advice</p>
        </div>

        {/* Content Card */}
        <div className="bg-card border border-border rounded-2xl p-8 space-y-8">
          <div>
            <h2 className="text-2xl font-bold text-foreground mb-4">General Health Mode</h2>
            <p className="text-muted-foreground leading-relaxed">
              Since you don't have any diagnosed medical conditions, you can still benefit from QuraAI by:
            </p>
          </div>

          <div className="space-y-4">
            <div className="flex gap-4 p-4 rounded-xl bg-muted">
              <span className="text-2xl flex-shrink-0">💊</span>
              <div>
                <h3 className="font-semibold text-foreground mb-1">Ask About Medicines</h3>
                <p className="text-sm text-muted-foreground">
                  Get information about any over-the-counter or prescription medicines
                </p>
              </div>
            </div>

            <div className="flex gap-4 p-4 rounded-xl bg-muted">
              <span className="text-2xl flex-shrink-0">❤️</span>
              <div>
                <h3 className="font-semibold text-foreground mb-1">Wellness Tips</h3>
                <p className="text-sm text-muted-foreground">
                  Receive personalized health and wellness recommendations
                </p>
              </div>
            </div>

            <div className="flex gap-4 p-4 rounded-xl bg-muted">
              <span className="text-2xl flex-shrink-0">🔄</span>
              <div>
                <h3 className="font-semibold text-foreground mb-1">Update Anytime</h3>
                <p className="text-sm text-muted-foreground">Add health conditions later if needed</p>
              </div>
            </div>
          </div>

          {/* Navigation */}
          <div className="flex items-center justify-between gap-4 pt-4">
            <Link href="/onboarding/health-status">
              <Button variant="outline">Back</Button>
            </Link>
            <Link href="/dashboard">
              <Button className="bg-primary hover:bg-primary/90">Go to Dashboard</Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
