"use client"

import { Button } from "@/components/ui/button"
import Link from "next/link"

export default function ConfirmationPage() {
  // This would come from state management or context in a real app
  const diseases = ["Diabetes", "Blood Pressure"]
  const medicines = [
    { name: "Metformin", dosage: "500mg", timing: "Morning, Evening" },
    { name: "Aspirin", dosage: "100mg", timing: "Morning" },
  ]

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-2xl">
        {/* Header */}
        <div className="mb-12">
          <h1 className="text-4xl font-bold text-foreground mb-4">Review your health profile</h1>
          <p className="text-lg text-muted-foreground">Please review your information before continuing</p>
        </div>

        {/* Summary Cards */}
        <div className="space-y-6">
          {/* Diseases Summary */}
          <div className="bg-card border border-border rounded-2xl p-8">
            <h2 className="text-xl font-bold text-foreground mb-6">Medical Conditions</h2>
            <div className="space-y-2">
              {diseases.map((disease) => (
                <div key={disease} className="flex items-center gap-3 p-3 rounded-lg bg-muted">
                  <span className="text-primary">✓</span>
                  <span className="text-foreground font-medium">{disease}</span>
                </div>
              ))}
            </div>
            <Link href="/onboarding/diseases">
              <button className="mt-4 text-sm text-primary font-semibold hover:underline">Edit conditions</button>
            </Link>
          </div>

          {/* Medicines Summary */}
          <div className="bg-card border border-border rounded-2xl p-8">
            <h2 className="text-xl font-bold text-foreground mb-6">Current Medicines</h2>
            <div className="space-y-4">
              {medicines.map((medicine, idx) => (
                <div key={idx} className="p-4 rounded-lg bg-muted">
                  <div className="font-semibold text-foreground">{medicine.name}</div>
                  <div className="text-sm text-muted-foreground">
                    {medicine.dosage} - {medicine.timing}
                  </div>
                </div>
              ))}
            </div>
            <Link href="/onboarding/medicines">
              <button className="mt-4 text-sm text-primary font-semibold hover:underline">Edit medicines</button>
            </Link>
          </div>

          {/* Continue Section */}
          <div className="bg-gradient-to-r from-primary/10 to-accent/10 border border-primary/20 rounded-2xl p-8">
            <h3 className="text-lg font-bold text-foreground mb-3">You're all set!</h3>
            <p className="text-muted-foreground mb-6">
              Your health profile is ready. Click below to access your dashboard and start monitoring your medicine
              safety.
            </p>

            <div className="flex items-center justify-between gap-4">
              <Link href="/onboarding/medicines">
                <Button variant="outline">Back</Button>
              </Link>
              <Link href="/dashboard">
                <Button className="bg-primary hover:bg-primary/90">Go to Dashboard</Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
