"use client"

import { useState, useEffect, useCallback } from "react"
import { loadHealthData, saveHealthData, generatePDFReport, type HealthData } from "@/lib/health-data"
import { calculateSafetyScore, type SafetyScoreBreakdown } from "@/lib/safety-score"

export const useHealthData = () => {
  const [data, setData] = useState<HealthData | null>(null)
  const [safetyScore, setSafetyScore] = useState<SafetyScoreBreakdown | null>(null)

  // Load data on mount
  useEffect(() => {
    const loadedData = loadHealthData()
    setData(loadedData)
  }, [])

  // Recalculate safety score whenever data changes
  useEffect(() => {
    if (data) {
      const score = calculateSafetyScore(data.medicines, data.dailyFeedback, data.user)
      setSafetyScore(score)
    }
  }, [data])

  const updateUserProfile = useCallback(
    (updates: Partial<HealthData["user"]>) => {
      if (!data) return
      const updated = {
        ...data,
        user: { ...data.user, ...updates },
        lastUpdated: new Date().toISOString(),
      }
      setData(updated)
      saveHealthData(updated)
    },
    [data],
  )

  const addMedicine = useCallback(
    (medicine: HealthData["medicines"][0]) => {
      if (!data) return
      const updated = {
        ...data,
        medicines: [...data.medicines, medicine],
        lastUpdated: new Date().toISOString(),
      }
      setData(updated)
      saveHealthData(updated)
    },
    [data],
  )

  const updateMedicine = useCallback(
    (medicineId: string, updates: Partial<HealthData["medicines"][0]>) => {
      if (!data) return
      const updated = {
        ...data,
        medicines: data.medicines.map((m) => (m.id === medicineId ? { ...m, ...updates } : m)),
        lastUpdated: new Date().toISOString(),
      }
      setData(updated)
      saveHealthData(updated)
    },
    [data],
  )

  const removeMedicine = useCallback(
    (medicineId: string) => {
      if (!data) return
      const updated = {
        ...data,
        medicines: data.medicines.filter((m) => m.id !== medicineId),
        lastUpdated: new Date().toISOString(),
      }
      setData(updated)
      saveHealthData(updated)
    },
    [data],
  )

  const addDailyFeedback = useCallback(
    (feedback: HealthData["dailyFeedback"][0]) => {
      if (!data) return
      const updated = {
        ...data,
        dailyFeedback: [...data.dailyFeedback, feedback],
        lastUpdated: new Date().toISOString(),
      }
      setData(updated)
      saveHealthData(updated)
    },
    [data],
  )

  const updateDailyFeedback = useCallback(
    (feedback: HealthData["dailyFeedback"][0]) => {
      if (!data) return
      const existingIndex = data.dailyFeedback.findIndex((f) => f.date === feedback.date)
      let updatedFeedback
      if (existingIndex >= 0) {
        updatedFeedback = [...data.dailyFeedback]
        updatedFeedback[existingIndex] = feedback
      } else {
        updatedFeedback = [...data.dailyFeedback, feedback]
      }

      const updated = {
        ...data,
        dailyFeedback: updatedFeedback,
        lastUpdated: new Date().toISOString(),
      }
      setData(updated)
      saveHealthData(updated)
    },
    [data],
  )

  const addReport = useCallback(
    (report: HealthData["reports"][0]) => {
      if (!data) return
      const updated = {
        ...data,
        reports: [...data.reports, report],
        lastUpdated: new Date().toISOString(),
      }
      setData(updated)
      saveHealthData(updated)
    },
    [data],
  )

  const deleteReport = useCallback(
    (reportId: string) => {
      if (!data) return
      const updated = {
        ...data,
        reports: data.reports.filter((r) => r.id !== reportId),
        lastUpdated: new Date().toISOString(),
      }
      setData(updated)
      saveHealthData(updated)
    },
    [data],
  )

  const recordMedicationUsage = useCallback(
    (medicineId: string, date: string, taken: boolean, skipped: boolean, notes?: string) => {
      if (!data) return
      const updated = {
        ...data,
        medicines: data.medicines.map((m) =>
          m.id === medicineId
            ? {
                ...m,
                dailyUsage: [...m.dailyUsage.filter((u) => u.date !== date), { date, taken, skipped, notes }],
              }
            : m,
        ),
        lastUpdated: new Date().toISOString(),
      }
      setData(updated)
      saveHealthData(updated)
    },
    [data],
  )

  const shareDoctorReport = useCallback((): string => {
    if (!data) return ""

    const activeMeds = data.medicines.filter((m) => m.status === "active")
    const reportContent = `
PATIENT HEALTH REPORT
Generated: ${new Date().toLocaleDateString()} at ${new Date().toLocaleTimeString()}

PATIENT INFORMATION
==================
Name: ${data.user.fullName}
ID: ${data.user.id}
Contact: ${data.user.phone}
Email: ${data.user.email}

CURRENT MEDICATIONS (${activeMeds.length})
===================
${activeMeds.map((m) => `- ${m.name} ${m.dosage} | ${m.frequency} | Times: ${m.times}`).join("\n")}

ALLERGIES
=========
${data.user.allergies.length > 0 ? data.user.allergies.join(", ") : "None recorded"}

MEDICAL CONDITIONS
==================
${data.user.chronicConditions.length > 0 ? data.user.chronicConditions.join(", ") : "None recorded"}

EMERGENCY CONTACT
=================
${data.user.emergencyContactName} (${data.user.emergencyContactRelation})
Phone: ${data.user.emergencyContactPhone}

---
This report was generated by QuraAI Health Management System.
For medical advice, consult with your healthcare provider.
    `.trim()

    return reportContent
  }, [data])

  const downloadReport = useCallback((): void => {
    if (!data || !safetyScore) return

    const reportContent = shareDoctorReport()
    const element = document.createElement("a")
    const file = new Blob([reportContent], { type: "text/plain;charset=utf-8" })

    element.href = URL.createObjectURL(file)
    element.download = `QuraAI-Health-Report-${new Date().toISOString().split("T")[0]}.txt`
    document.body.appendChild(element)
    element.click()
    document.body.removeChild(element)
  }, [data, safetyScore, shareDoctorReport])

  const generatePDFForShare = useCallback((): void => {
    if (!data) return

    const pdfContent = generatePDFReport(data)
    const element = document.createElement("a")
    const file = new Blob([atob(pdfContent)], { type: "application/pdf" })

    element.href = URL.createObjectURL(file)
    element.download = `QuraAI-Report-${new Date().toISOString().split("T")[0]}.pdf`
    document.body.appendChild(element)
    element.click()
    document.body.removeChild(element)
  }, [data])

  return {
    data,
    safetyScore,
    updateUserProfile,
    addMedicine,
    updateMedicine,
    removeMedicine,
    addDailyFeedback,
    updateDailyFeedback,
    addReport,
    deleteReport,
    recordMedicationUsage,
    shareDoctorReport,
    downloadReport,
    generatePDFForShare,
  }
}
