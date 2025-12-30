"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { useHealthData } from "@/hooks/use-health-data"

interface DailyTrackerProps {
  date?: string
  onClose?: () => void
}

export function DailyTracker({ date = new Date().toISOString().split("T")[0], onClose }: DailyTrackerProps) {
  const { data, recordMedicationUsage } = useHealthData()
  const [trackedMeds, setTrackedMeds] = useState<Record<string, { taken: boolean; skipped: boolean }>>({})

  if (!data) return null

  const activeMeds = data.medicines.filter((m) => m.status === "active")

  const handleMedicineChange = (medId: string, taken: boolean, skipped: boolean) => {
    setTrackedMeds((prev) => ({
      ...prev,
      [medId]: { taken, skipped },
    }))
  }

  const handleSave = () => {
    Object.entries(trackedMeds).forEach(([medId, { taken, skipped }]) => {
      recordMedicationUsage(medId, date, taken, skipped)
    })
    onClose?.()
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Track Today's Medications</CardTitle>
        <CardDescription>{date}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {activeMeds.map((med) => (
          <div key={med.id} className="flex items-center justify-between p-3 rounded-lg border border-border">
            <div>
              <p className="font-medium text-foreground">{med.name}</p>
              <p className="text-xs text-muted-foreground">{med.times}</p>
            </div>
            <div className="flex gap-3">
              <label className="flex items-center gap-2 cursor-pointer">
                <Checkbox
                  checked={trackedMeds[med.id]?.taken || false}
                  onCheckedChange={(checked) =>
                    handleMedicineChange(med.id, checked as boolean, trackedMeds[med.id]?.skipped || false)
                  }
                />
                <span className="text-xs">Taken</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <Checkbox
                  checked={trackedMeds[med.id]?.skipped || false}
                  onCheckedChange={(checked) =>
                    handleMedicineChange(med.id, trackedMeds[med.id]?.taken || false, checked as boolean)
                  }
                />
                <span className="text-xs">Skipped</span>
              </label>
            </div>
          </div>
        ))}
        <Button onClick={handleSave} className="w-full bg-primary hover:bg-primary/90">
          Save
        </Button>
      </CardContent>
    </Card>
  )
}
