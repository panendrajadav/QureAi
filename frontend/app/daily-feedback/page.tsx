"use client"

import type React from "react"

import { useState, useRef } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { CheckCircle2, Clock, Activity, Upload, AlertCircle, TrendingUp } from "lucide-react"
import { useHealthData } from "@/hooks/use-health-data"

export default function DailyFeedbackPage() {
  const { data, updateDailyFeedback } = useHealthData()
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [selectedDay] = useState(new Date().toISOString().split("T")[0])
  const [medicationLogs, setMedicationLogs] = useState<
    Record<
      string,
      {
        times: Record<string, "taken" | "missed" | "delayed">
        dosageAccuracy: Record<string, "prescribed" | "extra" | "less">
        sideEffects: string[]
      }
    >
  >({})
  const [healthCheck, setHealthCheck] = useState({
    overallFeeling: "good",
    painLevel: 5,
    energyLevel: "normal",
  })
  const [uploadedReports, setUploadedReports] = useState<
    { id: string; name: string; type: string; uploadedAt: string }[]
  >([])
  const [selectedSideEffects, setSelectedSideEffects] = useState<Record<string, string[]>>({})

  if (!data) {
    return (
      <main className="min-h-screen bg-background py-8">
        <div className="mx-auto max-w-6xl px-6">
          <p className="text-muted-foreground">Loading daily feedback...</p>
        </div>
      </main>
    )
  }

  const activeMedicines = data.medicines.filter((m) => m.status === "active")
  const timeSlots = ["morning", "afternoon", "evening", "night"] as const
  const sideEffectOptions = ["Nausea", "Dizziness", "Fatigue", "Headache", "None"]

  const handleMedicationLog = (medId: string, time: string, status: string) => {
    setMedicationLogs((prev) => ({
      ...prev,
      [medId]: {
        ...prev[medId],
        times: {
          ...prev[medId]?.times,
          [time]: status,
        },
      },
    }))
  }

  const handleDosageAccuracy = (medId: string, time: string, accuracy: "prescribed" | "extra" | "less") => {
    setMedicationLogs((prev) => ({
      ...prev,
      [medId]: {
        ...prev[medId],
        dosageAccuracy: {
          ...prev[medId]?.dosageAccuracy,
          [time]: accuracy,
        },
      },
    }))
  }

  const handleSideEffectToggle = (medId: string, effect: string) => {
    setSelectedSideEffects((prev) => ({
      ...prev,
      [medId]: prev[medId]?.includes(effect)
        ? prev[medId].filter((e) => e !== effect)
        : [...(prev[medId] || []), effect],
    }))
  }

  const handleReportUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (files) {
      Array.from(files).forEach((file) => {
        const reportType = file.name.includes("lab")
          ? "Lab Results"
          : file.name.includes("prescription")
            ? "Prescription"
            : "Document"
        setUploadedReports((prev) => [
          ...prev,
          {
            id: `report_${Date.now()}`,
            name: file.name,
            type: reportType,
            uploadedAt: new Date().toLocaleDateString(),
          },
        ])
      })
    }
    if (fileInputRef.current) fileInputRef.current.value = ""
  }

  const handleSaveFeedback = () => {
    updateDailyFeedback({
      id: `feedback_${Date.now()}`,
      date: selectedDay,
      medicationLogs: activeMedicines.map((med) => ({
        medicineId: med.id,
        medicineName: med.name,
        timesOfDay: timeSlots.map((time) => ({
          time,
          taken: (medicationLogs[med.id]?.times?.[time] || "not-taken") as any,
          dosageAccuracy: (medicationLogs[med.id]?.dosageAccuracy?.[time] || "prescribed") as any,
        })),
        sideEffects: selectedSideEffects[med.id] || [],
      })),
      healthCheck,
      reportUploads: uploadedReports,
      notes: "",
    })

    alert("Daily feedback saved successfully!")
  }

  const getMedicationAdherence = () => {
    let taken = 0
    let total = 0
    activeMedicines.forEach((med) => {
      timeSlots.forEach(() => {
        total++
        if (medicationLogs[med.id]?.times && medicationLogs[med.id].times !== {}) {
          if (
            Object.values(medicationLogs[med.id].times).filter((status) => status === "taken" || status === "delayed")
              .length > 0
          ) {
            taken++
          }
        }
      })
    })
    return total > 0 ? Math.round((taken / total) * 100) : 0
  }

  const getMissedDoses = () => {
    let missed = 0
    activeMedicines.forEach((med) => {
      if (medicationLogs[med.id]?.times) {
        Object.values(medicationLogs[med.id].times).forEach((status) => {
          if (status === "missed") missed++
        })
      }
    })
    return missed
  }

  const getActiveSideEffects = () => {
    const effects = new Set<string>()
    Object.values(selectedSideEffects).forEach((medEffects) => {
      medEffects.forEach((effect) => {
        if (effect !== "None") effects.add(effect)
      })
    })
    return Array.from(effects)
  }

  return (
    <main className="min-h-screen bg-background py-8">
      <div className="mx-auto max-w-6xl px-6">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground">Daily Medication & Health Feedback</h1>
          <p className="mt-2 text-muted-foreground">Track your medications, symptoms, and upload reports anytime</p>
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          {/* Main Feedback Form */}
          <div className="lg:col-span-2 space-y-6">
            {/* Medication Tracking with Dosage & Side Effects */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Activity className="h-5 w-5 text-primary" />
                  Medication Intake Log
                </CardTitle>
                <CardDescription>Mark your medicines, dosage, and any side effects</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {activeMedicines.map((medicine) => (
                  <div key={medicine.id} className="border-b border-border pb-6 last:border-0">
                    <div className="mb-4">
                      <h3 className="font-semibold text-foreground">{medicine.name}</h3>
                      <p className="text-sm text-muted-foreground">
                        {medicine.dosage} - {medicine.frequency}
                      </p>
                    </div>

                    {/* Time Slots */}
                    <div className="mb-4">
                      <p className="text-sm font-semibold text-foreground mb-2">Time Slots</p>
                      <div className="grid grid-cols-4 gap-2">
                        {timeSlots.map((time) => (
                          <button
                            key={time}
                            onClick={() => {
                              const current = medicationLogs[medicine.id]?.times?.[time]
                              const next = current === "taken" ? "missed" : current === "missed" ? "delayed" : "taken"
                              handleMedicationLog(medicine.id, time, next)
                            }}
                            className={`rounded-lg p-3 text-xs font-medium transition-all text-center capitalize ${
                              medicationLogs[medicine.id]?.times?.[time] === "taken"
                                ? "bg-primary text-primary-foreground"
                                : medicationLogs[medicine.id]?.times?.[time] === "missed"
                                  ? "bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-200"
                                  : medicationLogs[medicine.id]?.times?.[time] === "delayed"
                                    ? "bg-yellow-100 text-yellow-700 dark:bg-yellow-950 dark:text-yellow-200"
                                    : "bg-secondary text-muted-foreground hover:bg-secondary/80"
                            }`}
                          >
                            <Clock className="h-4 w-4 mx-auto mb-1" />
                            {time}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Dosage Accuracy - Only if medicine was taken */}
                    {medicationLogs[medicine.id]?.times &&
                      Object.values(medicationLogs[medicine.id].times).includes("taken") && (
                        <div className="mb-4">
                          <p className="text-sm font-semibold text-foreground mb-2">Dosage Accuracy</p>
                          <div className="grid grid-cols-3 gap-2">
                            {["prescribed", "extra", "less"].map((accuracy) => (
                              <button
                                key={accuracy}
                                onClick={() => {
                                  const takenTime = Object.entries(medicationLogs[medicine.id].times).find(
                                    ([_, status]) => status === "taken",
                                  )?.[0]
                                  if (takenTime) {
                                    handleDosageAccuracy(
                                      medicine.id,
                                      takenTime,
                                      accuracy as "prescribed" | "extra" | "less",
                                    )
                                  }
                                }}
                                className={`rounded-lg p-2 text-xs font-medium transition-all capitalize ${
                                  Object.values(medicationLogs[medicine.id].dosageAccuracy || {}).includes(
                                    accuracy as any,
                                  )
                                    ? "bg-primary text-primary-foreground"
                                    : "bg-secondary text-muted-foreground hover:bg-secondary/80"
                                }`}
                              >
                                {accuracy === "prescribed" ? "Prescribed" : accuracy === "extra" ? "Extra" : "Less"}
                              </button>
                            ))}
                          </div>
                        </div>
                      )}

                    {/* Side Effects */}
                    <div>
                      <p className="text-sm font-semibold text-foreground mb-2">Side Effects</p>
                      <div className="grid grid-cols-5 gap-2">
                        {sideEffectOptions.map((effect) => (
                          <button
                            key={effect}
                            onClick={() => handleSideEffectToggle(medicine.id, effect)}
                            className={`rounded-lg p-2 text-xs font-medium transition-all ${
                              selectedSideEffects[medicine.id]?.includes(effect)
                                ? "bg-primary text-primary-foreground"
                                : "bg-secondary text-muted-foreground hover:bg-secondary/80"
                            }`}
                          >
                            {effect}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Health Check */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CheckCircle2 className="h-5 w-5 text-primary" />
                  Daily Health Check
                </CardTitle>
                <CardDescription>Quick 30-second health assessment</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <label className="text-sm font-semibold text-foreground mb-3 block">How are you feeling today?</label>
                  <div className="grid grid-cols-3 gap-3">
                    {[
                      { value: "good", emoji: "😊", label: "Good" },
                      { value: "okay", emoji: "😐", label: "Okay" },
                      { value: "bad", emoji: "😔", label: "Bad" },
                    ].map(({ value, emoji, label }) => (
                      <button
                        key={value}
                        onClick={() => setHealthCheck({ ...healthCheck, overallFeeling: value as any })}
                        className={`rounded-lg p-4 text-center font-medium transition-all ${
                          healthCheck.overallFeeling === value
                            ? "bg-primary text-primary-foreground"
                            : "bg-secondary text-foreground hover:bg-secondary/80"
                        }`}
                      >
                        <span className="text-2xl">{emoji}</span>
                        <p className="text-xs mt-1">{label}</p>
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="text-sm font-semibold text-foreground mb-3 block">
                    Pain Level: {healthCheck.painLevel}/10
                  </label>
                  <input
                    type="range"
                    min="0"
                    max="10"
                    value={healthCheck.painLevel}
                    onChange={(e) => setHealthCheck({ ...healthCheck, painLevel: Number.parseInt(e.target.value) })}
                    className="w-full"
                  />
                </div>

                <div>
                  <label className="text-sm font-semibold text-foreground mb-3 block">Energy Level</label>
                  <div className="grid grid-cols-3 gap-3">
                    {["low", "normal", "high"].map((level) => (
                      <button
                        key={level}
                        onClick={() => setHealthCheck({ ...healthCheck, energyLevel: level as any })}
                        className={`rounded-lg p-3 text-center font-medium capitalize transition-all ${
                          healthCheck.energyLevel === level
                            ? "bg-primary text-primary-foreground"
                            : "bg-secondary text-foreground hover:bg-secondary/80"
                        }`}
                      >
                        {level}
                      </button>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Report Upload */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Upload className="h-5 w-5 text-primary" />
                  Upload Reports & Documents
                </CardTitle>
                <CardDescription>Share lab results, prescriptions, or doctor notes anytime</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div
                  onClick={() => fileInputRef.current?.click()}
                  className="border-2 border-dashed border-primary/30 rounded-lg p-8 text-center cursor-pointer hover:bg-primary/5 transition-colors"
                >
                  <Upload className="h-8 w-8 text-primary mx-auto mb-2" />
                  <p className="text-sm font-semibold text-foreground">Click to upload or drag and drop</p>
                  <p className="text-xs text-muted-foreground">PDF, images, or text files</p>
                </div>
                <input
                  ref={fileInputRef}
                  type="file"
                  multiple
                  onChange={handleReportUpload}
                  className="hidden"
                  accept=".pdf,.jpg,.jpeg,.png,.txt,.doc,.docx"
                />

                {uploadedReports.length > 0 && (
                  <div className="space-y-2">
                    <p className="text-sm font-semibold text-foreground">Uploaded Today</p>
                    {uploadedReports.map((report) => (
                      <div key={report.id} className="flex items-center justify-between rounded-lg bg-secondary/30 p-3">
                        <div className="flex items-center gap-2">
                          <span className="text-lg">📄</span>
                          <div>
                            <p className="text-sm font-medium text-foreground">{report.name}</p>
                            <p className="text-xs text-muted-foreground">{report.type}</p>
                          </div>
                        </div>
                        <Badge variant="outline" className="text-xs bg-transparent">
                          {report.uploadedAt}
                        </Badge>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

            <Button onClick={handleSaveFeedback} className="w-full bg-primary hover:bg-primary/90 h-12 text-base">
              Save Daily Feedback
            </Button>
          </div>

          {/* Right Sidebar - Metrics & Insights */}
          <div className="space-y-6">
            {/* Adherence Metrics */}
            <Card className="bg-gradient-to-br from-primary/5 to-primary/10 border-0">
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <TrendingUp className="h-5 w-5 text-primary" />
                  Today's Metrics
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <p className="text-xs text-muted-foreground font-semibold">MEDICATION ADHERENCE</p>
                    <span className="text-lg font-bold text-primary">{getMedicationAdherence()}%</span>
                  </div>
                  <div className="h-2 bg-secondary rounded-full overflow-hidden">
                    <div
                      className="h-full bg-primary transition-all"
                      style={{ width: `${getMedicationAdherence()}%` }}
                    />
                  </div>
                </div>

                <div className="pt-2 border-t border-border">
                  <p className="text-xs text-muted-foreground font-semibold mb-2">MISSED DOSES</p>
                  <p className="text-3xl font-bold text-primary">{getMissedDoses()}</p>
                </div>

                {getActiveSideEffects().length > 0 && (
                  <div className="pt-2 border-t border-border">
                    <p className="text-xs text-muted-foreground font-semibold mb-2">SIDE EFFECTS REPORTED</p>
                    <div className="space-y-1">
                      {getActiveSideEffects().map((effect) => (
                        <Badge
                          key={effect}
                          variant="outline"
                          className="bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-200 border-0"
                        >
                          {effect}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}

                {uploadedReports.length > 0 && (
                  <div className="pt-2 border-t border-border">
                    <p className="text-xs text-muted-foreground font-semibold mb-2">REPORTS UPLOADED</p>
                    <p className="text-3xl font-bold text-primary">{uploadedReports.length}</p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Quick Info Card */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Quick Info</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div>
                  <p className="text-xs font-semibold text-muted-foreground">DATE</p>
                  <p className="text-sm text-foreground">{new Date(selectedDay).toLocaleDateString()}</p>
                </div>
                <div>
                  <p className="text-xs font-semibold text-muted-foreground">OVERALL FEELING</p>
                  <Badge variant="outline" className="mt-1 bg-transparent capitalize">
                    {healthCheck.overallFeeling}
                  </Badge>
                </div>
                <div>
                  <p className="text-xs font-semibold text-muted-foreground">PAIN LEVEL</p>
                  <Badge variant="outline" className="mt-1 bg-transparent">
                    {healthCheck.painLevel}/10
                  </Badge>
                </div>
                <div>
                  <p className="text-xs font-semibold text-muted-foreground">ENERGY LEVEL</p>
                  <Badge variant="outline" className="mt-1 bg-transparent capitalize">
                    {healthCheck.energyLevel}
                  </Badge>
                </div>
              </CardContent>
            </Card>

            {/* AI Monitoring Info */}
            <Card className="border-primary/20">
              <CardHeader>
                <CardTitle className="text-base flex items-center gap-2 text-primary">
                  <AlertCircle className="h-4 w-4" />
                  AI Monitoring
                </CardTitle>
              </CardHeader>
              <CardContent className="text-xs space-y-2 text-muted-foreground">
                <p>Your daily feedback powers real-time safety monitoring:</p>
                <ul className="space-y-1 list-disc list-inside">
                  <li>Detects missed dose patterns</li>
                  <li>Tracks repeated side effects</li>
                  <li>Monitors dosage changes</li>
                  <li>Analyzes reports for organ stress</li>
                </ul>
              </CardContent>
            </Card>

            <Button asChild variant="outline" className="w-full bg-transparent">
              <Link href="/dashboard">Back to Dashboard</Link>
            </Button>
          </div>
        </div>
      </div>
    </main>
  )
}
