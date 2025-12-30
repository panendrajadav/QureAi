"use client"

import type React from "react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Plus, Trash2, AlertCircle, Edit2 } from "lucide-react"
import { useHealthData } from "@/hooks/use-health-data"
import { getInteractionDetails } from "@/lib/safety-score"

const AVAILABLE_MEDICINES = [
  "Metformin",
  "Aspirin",
  "Lisinopril",
  "Ibuprofen",
  "Warfarin",
  "Amoxicillin",
  "Omeprazole",
  "Atorvastatin",
]

export default function MedicinesPage() {
  const { data, updateMedicine, removeMedicine, addMedicine } = useHealthData()
  const [showAddDialog, setShowAddDialog] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [formData, setFormData] = useState({
    name: "",
    dosage: "",
    frequency: "",
    times: "",
    reason: "",
    startDate: "",
    prescribedBy: "",
  })

  if (!data) {
    return (
      <main className="min-h-screen bg-background py-8">
        <div className="mx-auto max-w-6xl px-6">
          <p className="text-muted-foreground">Loading medicines...</p>
        </div>
      </main>
    )
  }

  const getActiveInteractions = () => {
    const interactions: { pair: string; severity: "warning" | "critical"; message: string }[] = []
    const activeMeds = data.medicines.filter((m) => m.status === "active")

    for (let i = 0; i < activeMeds.length; i++) {
      for (let j = i + 1; j < activeMeds.length; j++) {
        const interaction = getInteractionDetails(activeMeds[i].name, activeMeds[j].name)
        if (interaction) {
          interactions.push({
            pair: `${activeMeds[i].name} + ${activeMeds[j].name}`,
            severity: interaction.severity,
            message: interaction.message,
          })
        }
      }
    }
    return interactions
  }

  const handleAddOrUpdateMedicine = (e: React.FormEvent) => {
    e.preventDefault()

    if (!formData.name) {
      alert("Please select a medicine")
      return
    }

    if (editingId) {
      updateMedicine(editingId, {
        name: formData.name,
        dosage: formData.dosage,
        frequency: formData.frequency,
        times: formData.times,
        reason: formData.reason,
        startDate: formData.startDate,
        prescribedBy: formData.prescribedBy,
      })
      setEditingId(null)
    } else {
      addMedicine({
        id: `med_${Date.now()}`,
        name: formData.name,
        dosage: formData.dosage,
        frequency: formData.frequency,
        times: formData.times,
        reason: formData.reason,
        startDate: formData.startDate,
        prescribedBy: formData.prescribedBy,
        status: "active",
        dailyUsage: [],
      })
    }

    setFormData({
      name: "",
      dosage: "",
      frequency: "",
      times: "",
      reason: "",
      startDate: "",
      prescribedBy: "",
    })
    setShowAddDialog(false)
  }

  const startEdit = (medicine: (typeof data.medicines)[0]) => {
    setFormData({
      name: medicine.name,
      dosage: medicine.dosage,
      frequency: medicine.frequency,
      times: medicine.times,
      reason: medicine.reason,
      startDate: medicine.startDate,
      prescribedBy: medicine.prescribedBy,
    })
    setEditingId(medicine.id)
    setShowAddDialog(true)
  }

  const activeInteractions = getActiveInteractions()
  const activeMedicines = data.medicines.filter((m) => m.status === "active")

  return (
    <main className="min-h-screen bg-background py-8">
      <div className="mx-auto max-w-6xl px-6">
        {/* Header */}
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">My Medicines</h1>
            <p className="mt-2 text-muted-foreground">Track all your medications and dosages</p>
          </div>
          <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
            <DialogTrigger asChild>
              <Button
                className="bg-primary hover:bg-primary/90"
                onClick={() => {
                  setEditingId(null)
                  setFormData({
                    name: "",
                    dosage: "",
                    frequency: "",
                    times: "",
                    reason: "",
                    startDate: "",
                    prescribedBy: "",
                  })
                }}
              >
                <Plus className="mr-2 h-4 w-4" />
                Add Medicine
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle>{editingId ? "Edit Medicine" : "Add New Medicine"}</DialogTitle>
                <DialogDescription>Enter details about your medication</DialogDescription>
              </DialogHeader>
              <form onSubmit={handleAddOrUpdateMedicine} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Medicine Name</Label>
                  <Select value={formData.name} onValueChange={(value) => setFormData({ ...formData, name: value })}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a medicine" />
                    </SelectTrigger>
                    <SelectContent>
                      {AVAILABLE_MEDICINES.map((drug) => (
                        <SelectItem key={drug} value={drug}>
                          {drug}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="dosage">Dosage</Label>
                  <Input
                    id="dosage"
                    placeholder="e.g., 500mg"
                    value={formData.dosage}
                    onChange={(e) => setFormData({ ...formData, dosage: e.target.value })}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="frequency">Frequency</Label>
                  <Input
                    id="frequency"
                    placeholder="e.g., 2 tablets daily"
                    value={formData.frequency}
                    onChange={(e) => setFormData({ ...formData, frequency: e.target.value })}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="times">Times to Take</Label>
                  <Input
                    id="times"
                    placeholder="e.g., Morning, Evening"
                    value={formData.times}
                    onChange={(e) => setFormData({ ...formData, times: e.target.value })}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="reason">Reason for Taking</Label>
                  <Input
                    id="reason"
                    placeholder="e.g., Diabetes Management"
                    value={formData.reason}
                    onChange={(e) => setFormData({ ...formData, reason: e.target.value })}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="startDate">Start Date</Label>
                  <Input
                    id="startDate"
                    type="date"
                    value={formData.startDate}
                    onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="prescribedBy">Prescribed By</Label>
                  <Input
                    id="prescribedBy"
                    placeholder="e.g., Dr. Smith"
                    value={formData.prescribedBy}
                    onChange={(e) => setFormData({ ...formData, prescribedBy: e.target.value })}
                  />
                </div>

                <Button type="submit" className="w-full bg-primary hover:bg-primary/90">
                  {editingId ? "Update Medicine" : "Add Medicine"}
                </Button>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        {/* Interaction Alerts */}
        {activeInteractions.length > 0 && (
          <Card className="mb-6 border-l-4 border-l-yellow-500 bg-yellow-50 dark:bg-yellow-950/20">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-yellow-700 dark:text-yellow-400">
                <AlertCircle className="h-5 w-5" />
                Drug Interactions Detected
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {activeInteractions.map((interaction, idx) => (
                  <div
                    key={idx}
                    className={`rounded-lg p-3 ${
                      interaction.severity === "critical"
                        ? "bg-red-100 dark:bg-red-900/30 border border-red-200 dark:border-red-800"
                        : "bg-yellow-100 dark:bg-yellow-900/30 border border-yellow-200 dark:border-yellow-800"
                    }`}
                  >
                    <p
                      className={`text-sm font-semibold ${interaction.severity === "critical" ? "text-red-800 dark:text-red-200" : "text-yellow-800 dark:text-yellow-200"}`}
                    >
                      {interaction.severity === "critical" ? "⛔" : "⚠"} {interaction.pair}
                    </p>
                    <p
                      className={`text-xs mt-1 ${interaction.severity === "critical" ? "text-red-700 dark:text-red-300" : "text-yellow-700 dark:text-yellow-300"}`}
                    >
                      {interaction.message}
                    </p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Current Medicines */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Current Medications ({activeMedicines.length})</CardTitle>
            <CardDescription>All medicines you are taking</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {activeMedicines.length === 0 ? (
                <p className="py-8 text-center text-muted-foreground">No medicines added yet</p>
              ) : (
                activeMedicines.map((medicine) => (
                  <div
                    key={medicine.id}
                    className="flex items-start justify-between rounded-lg border border-border bg-secondary/30 p-4"
                  >
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-foreground">{medicine.name}</h3>

                      <div className="mt-2 grid gap-2 md:grid-cols-3">
                        <div>
                          <p className="text-xs text-muted-foreground">Dosage</p>
                          <p className="font-medium text-foreground">{medicine.dosage}</p>
                        </div>
                        <div>
                          <p className="text-xs text-muted-foreground">Frequency</p>
                          <p className="font-medium text-foreground">{medicine.frequency}</p>
                        </div>
                        <div>
                          <p className="text-xs text-muted-foreground">Times</p>
                          <p className="font-medium text-foreground">{medicine.times}</p>
                        </div>
                      </div>

                      <div className="mt-2 grid gap-2 md:grid-cols-3">
                        <div>
                          <p className="text-xs text-muted-foreground">Reason</p>
                          <p className="font-medium text-foreground">{medicine.reason}</p>
                        </div>
                        <div>
                          <p className="text-xs text-muted-foreground">Started</p>
                          <p className="font-medium text-foreground">{medicine.startDate}</p>
                        </div>
                        <div>
                          <p className="text-xs text-muted-foreground">Prescribed By</p>
                          <p className="font-medium text-foreground">{medicine.prescribedBy}</p>
                        </div>
                      </div>
                    </div>

                    <div className="ml-4 flex gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => startEdit(medicine)}
                        className="text-primary hover:bg-primary/10"
                      >
                        <Edit2 className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeMedicine(medicine.id)}
                        className="text-destructive hover:bg-destructive/10 hover:text-destructive"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>

        {/* Medicine Tips */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Medicine Safety Tips</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>✓ Always take medicines at the prescribed times</li>
              <li>✓ Check interactions when adding new medicines</li>
              <li>✓ Store medicines in a cool, dry place</li>
              <li>✓ Keep medicines in their original containers</li>
              <li>✓ Inform your doctor before starting new supplements</li>
              <li>✓ Never skip doses without consulting your doctor</li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </main>
  )
}
