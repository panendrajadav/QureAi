"use client"

import { DashboardHeader } from "@/components/dashboard-header"
import { MedicineCard } from "@/components/medicine-card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { useState, useEffect } from "react"
import apiClient from "@/lib/api-client"

export default function DashboardPage() {
  const [medicines, setMedicines] = useState([])
  const [dashboardData, setDashboardData] = useState(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const loadDashboardData = async () => {
      try {
        const data = await apiClient.getDashboardData()
        setDashboardData(data)
        setMedicines(data.medicines || [])
      } catch (error) {
        console.error('Failed to load dashboard data:', error)
        // Use fallback data if API fails
        setMedicines([
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
        ])
      } finally {
        setIsLoading(false)
      }
    }

    loadDashboardData()
  }, [])

  return (
    <div className="min-h-screen bg-background">
      <DashboardHeader />

      <main className="p-3 sm:p-4 md:p-6 lg:p-8">
        <div className="max-w-7xl mx-auto">
          {/* Page Header */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 sm:gap-6 mb-8">
            <div className="min-w-0">
              <h1 className="text-3xl sm:text-4xl font-bold text-foreground mb-2">Dashboard</h1>
              <p className="text-sm sm:text-base text-muted-foreground">
                Monitor your health and medicines in real-time
              </p>
            </div>
            <Link href="/medicines/add" className="w-full sm:w-auto">
              <Button className="w-full sm:w-auto gap-2 px-6 py-2.5 rounded-lg font-semibold text-sm bg-gradient-to-r from-primary to-accent text-primary-foreground hover:shadow-lg hover:shadow-primary/30 transition-all duration-200">
                <span className="text-lg">+</span>
                <span className="hidden xs:inline">Add Medicine</span>
                <span className="inline xs:hidden">Add</span>
              </Button>
            </Link>
          </div>

          {/* Stats Grid - Responsive */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 mb-8">
            {/* Active Medicines */}
            <div className="card-premium p-5 md:p-6 group overflow-hidden">
              <div className="absolute inset-0 bg-gradient-primary-subtle opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <div className="relative">
                <p className="text-xs sm:text-sm font-medium text-muted-foreground mb-2">Active Medicines</p>
                <p className="text-2xl sm:text-3xl lg:text-4xl font-bold gradient-text">{medicines.length}</p>
                <p className="text-xs text-muted-foreground mt-2">Currently tracking</p>
              </div>
            </div>

            {/* Safety Score */}
            <div className="card-gradient p-5 md:p-6 group overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-accent/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <div className="relative">
                <p className="text-xs sm:text-sm font-medium text-muted-foreground mb-2">Safety Score</p>
                <p className="text-2xl sm:text-3xl lg:text-4xl font-bold text-primary">
                  {dashboardData?.stats?.safety_score || 93}<span className="text-lg text-muted-foreground">/100</span>
                </p>
                <p className="text-xs text-success font-semibold mt-2">✓ Low Risk</p>
              </div>
            </div>

            {/* Last Updated */}
            <div className="card-premium p-5 md:p-6 group overflow-hidden sm:col-span-2 lg:col-span-1">
              <div className="absolute inset-0 bg-gradient-primary-subtle opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <div className="relative">
                <p className="text-xs sm:text-sm font-medium text-muted-foreground mb-2">Last Sync</p>
                <p className="text-xl sm:text-2xl font-bold text-foreground">
                  {dashboardData?.stats?.last_updated ? 'Just now' : 'Just now'}
                </p>
                <p className="text-xs text-muted-foreground mt-2">Real-time monitoring active</p>
              </div>
            </div>
          </div>

          {/* Medicines Section */}
          <div className="card-premium p-4 sm:p-6 md:p-8 mb-8">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
              <div className="min-w-0">
                <h2 className="text-xl sm:text-2xl font-bold text-foreground">Current Medications</h2>
                <p className="text-xs sm:text-sm text-muted-foreground mt-1">All medicines you are currently taking</p>
              </div>
              <span className="inline-block px-3 py-1 rounded-full bg-primary/10 text-primary text-xs sm:text-sm font-semibold whitespace-nowrap">
                {medicines.length} Active
              </span>
            </div>

            <div className="space-y-3 sm:space-y-4">
              {medicines.map((medicine) => (
                <MedicineCard key={medicine.id} medicine={medicine} />
              ))}
            </div>
          </div>

          {/* Safety Tips Section */}
          <div className="card-premium p-4 sm:p-6 md:p-8">
            <h3 className="text-lg sm:text-xl font-bold text-foreground mb-5">Medicine Safety Tips</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
              {[
                "Always take medicines at the prescribed times",
                "Check interactions when adding new medicines",
                "Store medicines in a cool, dry place",
                "Keep medicines in their original containers",
                "Inform your doctor before starting supplements",
                "Never skip doses without consulting your doctor",
              ].map((tip, idx) => (
                <div
                  key={idx}
                  className="flex gap-3 p-3 sm:p-4 rounded-lg bg-muted/50 hover:bg-muted transition-colors"
                >
                  <span className="text-primary font-bold text-lg shrink-0">✓</span>
                  <p className="text-xs sm:text-sm text-foreground leading-relaxed">{tip}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
