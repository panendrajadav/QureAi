"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import Link from "next/link"

export default function HealthStatusPage() {
  const [hasCondition, setHasCondition] = useState<boolean | null>(null)

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-2xl">
        {/* Progress Bar */}
        <div className="mb-12">
          <div className="flex items-center justify-between text-sm text-muted-foreground mb-2">
            <span>Step 1 of 3</span>
            <span>Health Status</span>
          </div>
          <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
            <div className="h-full w-1/3 bg-primary rounded-full transition-all"></div>
          </div>
        </div>

        {/* Content */}
        <div className="space-y-8">
          <div>
            <h1 className="text-4xl font-bold text-foreground mb-4">Let's understand your health</h1>
            <p className="text-lg text-muted-foreground">
              This helps us provide personalized medicine safety recommendations
            </p>
          </div>

          {/* Question Card */}
          <div className="bg-card border border-border rounded-2xl p-8">
            <h2 className="text-2xl font-bold text-foreground mb-8">
              Do you currently have any diagnosed medical condition?
            </h2>

            <div className="space-y-4">
              <button
                onClick={() => setHasCondition(true)}
                className={`w-full p-6 rounded-xl border-2 transition-all flex items-center justify-between font-semibold text-lg ${
                  hasCondition === true
                    ? "border-primary bg-primary/5 text-foreground"
                    : "border-border bg-card text-muted-foreground hover:border-primary/50"
                }`}
              >
                <span>Yes, I have one or more conditions</span>
                <span className="text-2xl">{hasCondition === true ? "✓" : ""}</span>
              </button>

              <button
                onClick={() => setHasCondition(false)}
                className={`w-full p-6 rounded-xl border-2 transition-all flex items-center justify-between font-semibold text-lg ${
                  hasCondition === false
                    ? "border-primary bg-primary/5 text-foreground"
                    : "border-border bg-card text-muted-foreground hover:border-primary/50"
                }`}
              >
                <span>No, I'm generally healthy</span>
                <span className="text-2xl">{hasCondition === false ? "✓" : ""}</span>
              </button>
            </div>
          </div>

          {/* Navigation */}
          <div className="flex items-center justify-between">
            <Link href="/login">
              <Button variant="outline">Back</Button>
            </Link>
            {hasCondition !== null && (
              <Link href={hasCondition ? "/onboarding/diseases" : "/onboarding/simple-mode"}>
                <Button className="bg-primary hover:bg-primary/90">Continue</Button>
              </Link>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
