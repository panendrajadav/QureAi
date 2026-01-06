import { DashboardHeader } from "@/components/dashboard-header"
import { MedicineCard } from "@/components/medicine-card"
import { Button } from "@/components/ui/button"
import Link from "next/link"

export default function MedicinesPage() {
  const medicines = [
    {
      id: 1,
      name: "Metformin",
      dosage: "500mg",
      frequency: "2 tablets daily",
      times: "Morning, Evening",
      reason: "Diabetes Management",
      prescribedBy: "Dr. Smith",
      startDate: "Jan 10, 2024",
    },
    {
      id: 2,
      name: "Aspirin",
      dosage: "100mg",
      frequency: "1 tablet daily",
      times: "Morning",
      reason: "Blood Clot Prevention",
      prescribedBy: "Dr. Johnson",
      startDate: "Dec 15, 2023",
    },
    {
      id: 3,
      name: "Lisinopril",
      dosage: "10mg",
      frequency: "1 tablet daily",
      times: "Evening",
      reason: "Hypertension Control",
      prescribedBy: "Dr. Smith",
      startDate: "Nov 20, 2023",
    },
  ]

  return (
    <div className="min-h-screen bg-background">
      <DashboardHeader />

      <main className="p-4 md:p-6">
        <div className="max-w-7xl mx-auto">
          {/* Page Header */}
          <div className="flex items-start justify-between mb-8">
            <div>
              <h1 className="text-4xl font-bold text-foreground mb-2">My Medicines</h1>
              <p className="text-muted-foreground">Track all your medications and dosages</p>
            </div>
            <Link href="/medicines/add">
              <Button className="bg-primary hover:bg-primary/90 gap-2">
                <span>+</span> Add Medicine
              </Button>
            </Link>
          </div>

          {/* Medicines List */}
          <div className="bg-card border border-border rounded-2xl p-6">
            <h2 className="text-2xl font-bold text-foreground mb-2">Current Medications ({medicines.length})</h2>
            <p className="text-muted-foreground mb-6">All medicines you are taking</p>

            <div className="space-y-4">
              {medicines.map((medicine) => (
                <MedicineCard key={medicine.id} medicine={medicine} />
              ))}
            </div>
          </div>

          {/* Additional Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
            <div className="bg-gradient-to-br from-primary/10 to-accent/10 border border-primary/20 rounded-2xl p-6">
              <h3 className="text-lg font-bold text-foreground mb-3">Track Changes</h3>
              <p className="text-sm text-muted-foreground">
                Whenever you add, remove, or change a medicine, your safety score updates automatically to reflect
                potential interactions.
              </p>
            </div>

            <div className="bg-gradient-to-br from-primary/10 to-accent/10 border border-primary/20 rounded-2xl p-6">
              <h3 className="text-lg font-bold text-foreground mb-3">Need Help?</h3>
              <p className="text-sm text-muted-foreground">
                Use our Safety Analysis Chat to ask about medicine interactions or get personalized health advice based
                on your profile.
              </p>
              <Link href="/risk-checks">
                <Button variant="outline" size="sm" className="mt-4 bg-transparent">
                  Ask AI
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
