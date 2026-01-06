"use client"

import type React from "react"

import { useState } from "react"
import { DashboardHeader } from "@/components/dashboard-header"
import { Button } from "@/components/ui/button"
import Link from "next/link"

export default function AddMedicinePage() {
  const [formData, setFormData] = useState({
    name: "",
    dosage: "",
    frequency: "1 tablet daily",
    times: "Morning",
    reason: "",
    prescribedBy: "",
  })
  const [isLoading, setIsLoading] = useState(false)

  const frequencies = [
    "1 tablet daily",
    "2 tablets daily",
    "3 tablets daily",
    "As needed",
    "Once a week",
    "Once a month",
  ]
  const times = ["Morning", "Afternoon", "Evening", "Night", "Multiple times"]

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000))
      console.log("[v0] Medicine added:", formData)
      // Redirect back to medicines
      window.location.href = "/medicines"
    } catch (error) {
      console.error("[v0] Add medicine error:", error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <DashboardHeader />

      <main className="p-4 md:p-6">
        <div className="max-w-2xl mx-auto">
          <Link href="/medicines">
            <Button variant="ghost" className="mb-6 text-sm">
              ← Back to Medicines
            </Button>
          </Link>

          <div className="bg-card border border-border rounded-2xl p-6 md:p-8">
            <h1 className="text-2xl md:text-3xl font-bold text-foreground mb-2">Add a Medicine</h1>
            <p className="text-muted-foreground mb-8 text-sm md:text-base">
              Enter the details of a new medicine you're taking
            </p>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Medicine Name */}
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Medicine Name</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g., Metformin"
                  className="w-full px-4 py-2.5 rounded-lg bg-muted border border-input text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-sm"
                />
              </div>

              {/* Dosage */}
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Dosage</label>
                <input
                  type="text"
                  value={formData.dosage}
                  onChange={(e) => setFormData({ ...formData, dosage: e.target.value })}
                  placeholder="e.g., 500mg"
                  className="w-full px-4 py-2.5 rounded-lg bg-muted border border-input text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-sm"
                />
              </div>

              {/* Frequency */}
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Frequency</label>
                <select
                  value={formData.frequency}
                  onChange={(e) => setFormData({ ...formData, frequency: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-lg bg-muted border border-input text-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-sm"
                >
                  {frequencies.map((freq) => (
                    <option key={freq} value={freq}>
                      {freq}
                    </option>
                  ))}
                </select>
              </div>

              {/* Times */}
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Time of Intake</label>
                <select
                  value={formData.times}
                  onChange={(e) => setFormData({ ...formData, times: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-lg bg-muted border border-input text-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-sm"
                >
                  {times.map((time) => (
                    <option key={time} value={time}>
                      {time}
                    </option>
                  ))}
                </select>
              </div>

              {/* Reason */}
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Reason for Taking</label>
                <input
                  type="text"
                  value={formData.reason}
                  onChange={(e) => setFormData({ ...formData, reason: e.target.value })}
                  placeholder="e.g., Diabetes Management"
                  className="w-full px-4 py-2.5 rounded-lg bg-muted border border-input text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-sm"
                />
              </div>

              {/* Prescribed By */}
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Prescribed By</label>
                <input
                  type="text"
                  value={formData.prescribedBy}
                  onChange={(e) => setFormData({ ...formData, prescribedBy: e.target.value })}
                  placeholder="e.g., Dr. Smith"
                  className="w-full px-4 py-2.5 rounded-lg bg-muted border border-input text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-sm"
                />
              </div>

              {/* Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 pt-6">
                <Link href="/medicines" className="flex-1">
                  <Button variant="outline" className="w-full bg-transparent text-sm">
                    Cancel
                  </Button>
                </Link>
                <Button
                  type="submit"
                  disabled={isLoading || !formData.name || !formData.dosage}
                  className="flex-1 bg-primary hover:bg-primary/90 disabled:opacity-50 text-sm"
                >
                  {isLoading ? "Adding..." : "Add Medicine"}
                </Button>
              </div>
            </form>
          </div>
        </div>
      </main>
    </div>
  )
}
