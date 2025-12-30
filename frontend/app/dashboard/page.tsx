"use client"

import { useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ResponsiveContainer, PieChart, Pie, Cell } from "recharts"
import { AlertCircle, Bell, Settings, Download, Plus, Eye, Heart, Activity } from "lucide-react"
import { useHealthData } from "@/hooks/use-health-data"
import { Badge } from "@/components/ui/badge"

export default function DashboardPage() {
  const { data, safetyScore } = useHealthData()

  useEffect(() => {
    if (!data) return
  }, [data])

  if (!data || !safetyScore) {
    return (
      <main className="min-h-screen bg-background py-8">
        <div className="mx-auto max-w-7xl px-6">
          <p className="text-muted-foreground">Loading health data...</p>
        </div>
      </main>
    )
  }

  const riskData = [
    { name: "Safe", value: 87 - safetyScore.warnings.length * 5, color: "#0F7172" },
    {
      name: "Warning",
      value: safetyScore.warnings.filter((w) => w.severity === "warning").length * 5,
      color: "#F59E0B",
    },
    {
      name: "Critical",
      value: safetyScore.warnings.filter((w) => w.severity === "critical").length * 8,
      color: "#EF4444",
    },
  ].filter((d) => d.value > 0)

  const getTimeOfDay = () => {
    const hour = new Date().getHours()
    if (hour < 12) return "Monday, January 22, 2024 • 10:30 AM"
    if (hour < 18) return "Monday, January 22, 2024 • 2:30 PM"
    return "Monday, January 22, 2024 • 6:30 PM"
  }

  const profileCompletion = () => {
    let completed = 0
    const total = 10
    if (data.user.fullName) completed++
    if (data.user.dateOfBirth) completed++
    if (data.user.phone) completed++
    if (data.user.email) completed++
    if (data.user.bloodType && data.user.bloodType !== "Select") completed++
    if (data.user.allergies.length > 0) completed++
    if (data.user.chronicConditions.length > 0) completed++
    if (data.user.emergencyContactName) completed++
    if (data.medicines.length > 0) completed++
    if (data.reports.length > 0) completed++

    return Math.round((completed / total) * 100)
  }

  const calculateAdherence = () => {
    if (data.dailyFeedback.length === 0) return 0
    const recentFeedback = data.dailyFeedback.slice(-7) // Last 7 days
    let totalLogs = 0
    let takenCount = 0

    recentFeedback.forEach((feedback) => {
      feedback.medicationLogs.forEach((log) => {
        log.timesOfDay.forEach((time) => {
          totalLogs++
          if (time.taken === "taken" || time.taken === "delayed") {
            takenCount++
          }
        })
      })
    })

    return totalLogs > 0 ? Math.round((takenCount / totalLogs) * 100) : 0
  }

  const getActiveSideEffects = () => {
    const effectMap = new Map<string, number>()
    data.dailyFeedback.slice(-7).forEach((feedback) => {
      feedback.medicationLogs.forEach((log) => {
        log.sideEffects.forEach((effect) => {
          if (effect && effect !== "None") {
            effectMap.set(effect, (effectMap.get(effect) || 0) + 1)
          }
        })
      })
    })
    return Array.from(effectMap.entries())
      .filter(([_, count]) => count > 0)
      .sort((a, b) => b[1] - a[1])
  }

  const getMissedDoses = () => {
    let missed = 0
    data.dailyFeedback.slice(-7).forEach((feedback) => {
      feedback.medicationLogs.forEach((log) => {
        log.timesOfDay.forEach((time) => {
          if (time.taken === "missed") missed++
        })
      })
    })
    return missed
  }

  return (
    <main className="min-h-screen bg-background py-8">
      <div className="mx-auto max-w-7xl px-6">
        {/* Header */}
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Welcome back, {data.user.fullName}</h1>
            <p className="mt-2 text-muted-foreground">{getTimeOfDay()}</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="icon" className="bg-transparent">
              <Bell className="h-5 w-5" />
            </Button>
            <Button variant="outline" size="icon" className="bg-transparent">
              <Settings className="h-5 w-5" />
            </Button>
            <div className="ml-2 h-10 w-10 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center text-primary-foreground font-semibold">
              {data.user.fullName[0]}
            </div>
          </div>
        </div>

        {/* Profile Completion Card */}
        <Card className="mb-8 border-0 bg-gradient-to-r from-primary/5 to-accent/5 shadow-sm">
          <CardContent className="flex items-center justify-between pt-6">
            <div className="flex items-center gap-4">
              <div className="flex h-20 w-20 items-center justify-center rounded-full border-4 border-primary bg-primary/10">
                <span className="text-3xl font-bold text-primary">{profileCompletion()}%</span>
              </div>
              <div>
                <h3 className="font-semibold text-foreground">Complete Your Profile</h3>
                <p className="text-sm text-muted-foreground">Add more information for better recommendations</p>
              </div>
            </div>
            <Button asChild className="bg-primary hover:bg-primary/90">
              <Link href="/profile">Complete Profile</Link>
            </Button>
          </CardContent>
        </Card>

        {/* Main Grid */}
        <div className="grid gap-6 lg:grid-cols-3">
          {/* Left Column - Medicines & Reports */}
          <div className="lg:col-span-2 space-y-6">
            {/* Medicines Section */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>My Medicines</CardTitle>
                    <CardDescription>Your current medications</CardDescription>
                  </div>
                  <Button asChild variant="outline" size="sm" className="bg-transparent">
                    <Link href="/medicines">View All</Link>
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {data.medicines
                  .filter((m) => m.status === "active")
                  .map((medicine) => (
                    <div
                      key={medicine.id}
                      className="flex items-center justify-between rounded-lg border border-border bg-secondary/30 p-4"
                    >
                      <div className="flex items-center gap-3 flex-1">
                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                          <Activity className="h-5 w-5 text-primary" />
                        </div>
                        <div className="flex-1">
                          <p className="font-semibold text-foreground">{medicine.name}</p>
                          <p className="text-xs text-muted-foreground">{medicine.dosage}</p>
                          <p className="text-xs text-muted-foreground">{medicine.times}</p>
                        </div>
                      </div>
                      <span className="text-lg text-primary">●</span>
                    </div>
                  ))}
                <Button asChild variant="outline" className="w-full bg-transparent border-dashed">
                  <Link href="/medicines">
                    <Plus className="mr-2 h-4 w-4" />
                    Add New Medicine
                  </Link>
                </Button>
              </CardContent>
            </Card>

            {/* Medication Adherence Card */}
            <Card>
              <CardHeader>
                <CardTitle>Medication Adherence</CardTitle>
                <CardDescription>Last 7 days tracking</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-semibold text-foreground">Adherence Rate</span>
                    <span className="text-2xl font-bold text-primary">{calculateAdherence()}%</span>
                  </div>
                  <div className="h-3 bg-secondary rounded-full overflow-hidden">
                    <div className="h-full bg-primary transition-all" style={{ width: `${calculateAdherence()}%` }} />
                  </div>
                </div>

                {getMissedDoses() > 0 && (
                  <div className="p-3 rounded-lg bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-800">
                    <p className="text-xs text-red-700 dark:text-red-200">
                      <span className="font-semibold">{getMissedDoses()}</span> missed doses in last 7 days
                    </p>
                  </div>
                )}

                {getActiveSideEffects().length > 0 && (
                  <div className="pt-3 border-t border-border">
                    <p className="text-xs font-semibold text-muted-foreground mb-2">ACTIVE SIDE EFFECTS</p>
                    <div className="space-y-2">
                      {getActiveSideEffects().map(([effect, count]) => (
                        <div key={effect} className="flex items-center justify-between">
                          <span className="text-xs text-muted-foreground">{effect}</span>
                          <Badge
                            variant="outline"
                            className="bg-orange-100 text-orange-700 dark:bg-orange-950 dark:text-orange-200 border-0 text-xs"
                          >
                            {count} times
                          </Badge>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Recent Reports Section */}
            <Card>
              <CardHeader>
                <CardTitle>Recent Reports</CardTitle>
                <CardDescription>Your health documents</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                {data.reports.slice(-2).map((report) => (
                  <div
                    key={report.id}
                    className="flex items-center justify-between rounded-lg border border-border bg-secondary/30 p-4"
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">📋</span>
                      <div>
                        <p className="font-semibold text-foreground">{report.name}</p>
                        <p className="text-xs text-muted-foreground">{report.date}</p>
                      </div>
                    </div>
                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                      <Download className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
                <Button asChild className="w-full bg-primary hover:bg-primary/90">
                  <Link href="/reports">
                    <Plus className="mr-2 h-4 w-4" />
                    Upload New Report
                  </Link>
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Risk Status & Chart */}
          <div className="space-y-6">
            <Card className="border-0 bg-gradient-to-br from-primary/5 to-primary/10 shadow-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <AlertCircle className="h-5 w-5 text-primary" />
                  Safety Score
                </CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <div className="mb-4 flex items-center justify-center">
                  <div className="relative flex h-32 w-32 items-center justify-center rounded-full border-4 border-primary bg-primary/5">
                    <div className="text-center">
                      <p className="text-3xl font-bold text-primary">{safetyScore.finalScore}/100</p>
                      <p className="text-xs text-muted-foreground capitalize">{safetyScore.riskLevel} Risk</p>
                    </div>
                  </div>
                </div>
                <p className="font-semibold text-foreground">
                  {safetyScore.riskLevel === "low"
                    ? "All Clear"
                    : safetyScore.riskLevel === "moderate"
                      ? "Monitor Closely"
                      : "High Risk Detected"}
                </p>
                <p className="text-sm text-muted-foreground">Last updated: Today</p>
                <Button asChild className="mt-4 w-full bg-primary hover:bg-primary/90">
                  <Link href="/risk-check">View Details</Link>
                </Button>
              </CardContent>
            </Card>

            {/* Interaction Risk Chart */}
            <Card>
              <CardHeader>
                <CardTitle>Risk Breakdown</CardTitle>
              </CardHeader>
              <CardContent>
                {riskData.length > 0 ? (
                  <>
                    <ResponsiveContainer width="100%" height={200}>
                      <PieChart>
                        <Pie
                          data={riskData}
                          cx="50%"
                          cy="50%"
                          innerRadius={60}
                          outerRadius={80}
                          paddingAngle={2}
                          dataKey="value"
                        >
                          {riskData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                      </PieChart>
                    </ResponsiveContainer>
                    <div className="mt-4 space-y-2">
                      {riskData.map((item, idx) => (
                        <div key={idx} className="flex items-center justify-between text-sm">
                          <div className="flex items-center gap-2">
                            <div className="h-2 w-2 rounded-full" style={{ backgroundColor: item.color }} />
                            <span className="text-muted-foreground">{item.name}</span>
                          </div>
                          <span className="font-semibold text-foreground">{item.value}%</span>
                        </div>
                      ))}
                    </div>
                  </>
                ) : (
                  <p className="text-center text-muted-foreground py-8">No risk data available</p>
                )}
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <Button asChild variant="outline" className="w-full justify-start bg-transparent">
                  <Link href="/daily-feedback" className="gap-2">
                    <Activity className="h-4 w-4" />
                    Daily Medication Feedback
                  </Link>
                </Button>
                <Button asChild variant="outline" className="w-full justify-start bg-transparent">
                  <Link href="#" className="gap-2">
                    <Bell className="h-4 w-4" />
                    Set Medication Reminders
                  </Link>
                </Button>
                <Button asChild variant="outline" className="w-full justify-start bg-transparent">
                  <Link href="#" className="gap-2">
                    <Heart className="h-4 w-4" />
                    Track Symptoms
                  </Link>
                </Button>
                <Button asChild variant="outline" className="w-full justify-start bg-transparent">
                  <Link href="#" className="gap-2">
                    <Eye className="h-4 w-4" />
                    Find Pharmacy
                  </Link>
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </main>
  )
}
