"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import Link from "next/link"

export default function DiseasesPage() {
  const [selectedDiseases, setSelectedDiseases] = useState<string[]>([])
  const [otherDisease, setOtherDisease] = useState("")

  const diseases = ["Diabetes", "Blood Pressure", "Thyroid", "Asthma", "Heart Condition"]

  const toggleDisease = (disease: string) => {
    setSelectedDiseases((prev) => (prev.includes(disease) ? prev.filter((d) => d !== disease) : [...prev, disease]))
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-2xl">
        {/* Progress Bar */}
        <div className="mb-12">
          <div className="flex items-center justify-between text-sm text-muted-foreground mb-2">
            <span>Step 2 of 3</span>
            <span>Your Health Profile</span>
          </div>
          <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
            <div className="h-full w-2/3 bg-primary rounded-full transition-all"></div>
          </div>
        </div>

        {/* Content */}
        <div className="space-y-8">
          <div>
            <h1 className="text-4xl font-bold text-foreground mb-4">Your health profile</h1>
            <p className="text-lg text-muted-foreground">Select the condition(s) you have. You can add more later.</p>
          </div>

          {/* Disease Selection */}
          <div className="bg-card border border-border rounded-2xl p-8">
            <h2 className="text-xl font-bold text-foreground mb-6">Which condition(s) do you have?</h2>

            <div className="space-y-3 mb-8">
              {diseases.map((disease) => (
                <button
                  key={disease}
                  onClick={() => toggleDisease(disease)}
                  className={`w-full p-4 rounded-xl border-2 transition-all text-left font-medium ${
                    selectedDiseases.includes(disease)
                      ? "border-primary bg-primary/5 text-foreground"
                      : "border-border bg-card text-muted-foreground hover:border-primary/50"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span>{disease}</span>
                    {selectedDiseases.includes(disease) && <span className="text-primary">✓</span>}
                  </div>
                </button>
              ))}
            </div>

            {/* Other Disease Input */}
            <div>
              <label className="block text-sm font-medium text-foreground mb-3">Other condition</label>
              <input
                type="text"
                value={otherDisease}
                onChange={(e) => setOtherDisease(e.target.value)}
                placeholder="Enter another condition..."
                className="w-full px-4 py-2.5 rounded-lg bg-muted border border-input text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              />
            </div>
          </div>

          {/* Navigation */}
          <div className="flex items-center justify-between">
            <Link href="/onboarding/health-status">
              <Button variant="outline">Back</Button>
            </Link>
            {selectedDiseases.length > 0 && (
              <Link href="/onboarding/medicines">
                <Button className="bg-primary hover:bg-primary/90">Continue</Button>
              </Link>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
