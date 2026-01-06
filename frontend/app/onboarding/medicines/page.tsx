"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import Link from "next/link"

interface Medicine {
  name: string
  dosage: string
  timing: string
}

export default function MedicinesPage() {
  const [medicines, setMedicines] = useState<Medicine[]>([{ name: "", dosage: "", timing: "Morning" }])

  const timings = ["Morning", "Afternoon", "Evening", "Night", "As needed"]

  const addMedicine = () => {
    setMedicines([...medicines, { name: "", dosage: "", timing: "Morning" }])
  }

  const updateMedicine = (index: number, field: keyof Medicine, value: string) => {
    const updated = [...medicines]
    updated[index][field] = value
    setMedicines(updated)
  }

  const removeMedicine = (index: number) => {
    setMedicines(medicines.filter((_, i) => i !== index))
  }

  const hasValidMedicines = medicines.some((m) => m.name.trim() !== "")

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-2xl">
        {/* Progress Bar */}
        <div className="mb-12">
          <div className="flex items-center justify-between text-sm text-muted-foreground mb-2">
            <span>Step 3 of 3</span>
            <span>Your Current Medicines</span>
          </div>
          <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
            <div className="h-full w-full bg-primary rounded-full transition-all"></div>
          </div>
        </div>

        {/* Content */}
        <div className="space-y-8">
          <div>
            <h1 className="text-4xl font-bold text-foreground mb-4">Your current medicines</h1>
            <p className="text-lg text-muted-foreground">Add the medicines you're currently taking</p>
          </div>

          {/* Medicines List */}
          <div className="space-y-4">
            {medicines.map((medicine, index) => (
              <div key={index} className="bg-card border border-border rounded-2xl p-6">
                <div className="flex items-start justify-between mb-4">
                  <h3 className="text-lg font-semibold text-foreground">Medicine {index + 1}</h3>
                  {medicines.length > 1 && (
                    <button
                      onClick={() => removeMedicine(index)}
                      className="text-destructive hover:text-destructive/80 font-medium"
                    >
                      Remove
                    </button>
                  )}
                </div>

                <div className="space-y-4">
                  {/* Medicine Name */}
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">Medicine Name</label>
                    <input
                      type="text"
                      value={medicine.name}
                      onChange={(e) => updateMedicine(index, "name", e.target.value)}
                      placeholder="e.g., Metformin"
                      className="w-full px-4 py-2.5 rounded-lg bg-muted border border-input text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                    />
                  </div>

                  {/* Dosage */}
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">Dosage</label>
                    <input
                      type="text"
                      value={medicine.dosage}
                      onChange={(e) => updateMedicine(index, "dosage", e.target.value)}
                      placeholder="e.g., 500mg"
                      className="w-full px-4 py-2.5 rounded-lg bg-muted border border-input text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                    />
                  </div>

                  {/* Timing */}
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">Time of Intake</label>
                    <select
                      value={medicine.timing}
                      onChange={(e) => updateMedicine(index, "timing", e.target.value)}
                      className="w-full px-4 py-2.5 rounded-lg bg-muted border border-input text-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                    >
                      {timings.map((timing) => (
                        <option key={timing} value={timing}>
                          {timing}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Add Medicine Button */}
          <button
            onClick={addMedicine}
            className="w-full p-4 rounded-xl border-2 border-dashed border-primary text-primary font-semibold hover:bg-primary/5 transition-colors"
          >
            + Add another medicine
          </button>

          {/* Navigation */}
          <div className="flex items-center justify-between">
            <Link href="/onboarding/diseases">
              <Button variant="outline">Back</Button>
            </Link>
            {hasValidMedicines && (
              <Link href="/onboarding/confirmation">
                <Button className="bg-primary hover:bg-primary/90">Review Profile</Button>
              </Link>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
