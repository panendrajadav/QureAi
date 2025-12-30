"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Edit, Check, MapPin, Plus } from "lucide-react"
import { useHealthData } from "@/hooks/use-health-data"

const BLOOD_TYPES = ["O+", "O-", "A+", "A-", "B+", "B-", "AB+", "AB-"]
const CHRONIC_CONDITIONS = ["Diabetes", "Hypertension", "Heart Disease", "Asthma", "Arthritis", "Thyroid Disease"]

export default function ProfilePage() {
  const { data, updateUserProfile } = useHealthData()
  const [editMode, setEditMode] = useState(false)
  const [newAllergy, setNewAllergy] = useState("")
  const [newCondition, setNewCondition] = useState("")
  const [formData, setFormData] = useState({
    fullName: "",
    dateOfBirth: "",
    gender: "Female",
    bloodType: "O+",
    height: "",
    weight: "",
    phone: "",
    email: "",
    address: "",
    allergies: [] as string[],
    chronicConditions: [] as string[],
    specialConditions: "",
    emergencyContactName: "",
    emergencyContactRelation: "",
    emergencyContactPhone: "",
  })

  useEffect(() => {
    if (data) {
      setFormData({
        fullName: data.user.fullName,
        dateOfBirth: data.user.dateOfBirth,
        gender: data.user.gender,
        bloodType: data.user.bloodType,
        height: data.user.height,
        weight: data.user.weight,
        phone: data.user.phone,
        email: data.user.email,
        address: data.user.address,
        allergies: data.user.allergies,
        chronicConditions: data.user.chronicConditions,
        specialConditions: data.user.specialConditions,
        emergencyContactName: data.user.emergencyContactName,
        emergencyContactRelation: data.user.emergencyContactRelation,
        emergencyContactPhone: data.user.emergencyContactPhone,
      })
    }
  }, [data])

  if (!data) {
    return (
      <main className="min-h-screen bg-background py-8">
        <div className="mx-auto max-w-6xl px-6">
          <p className="text-muted-foreground">Loading profile...</p>
        </div>
      </main>
    )
  }

  const handleInputChange = (field: string, value: string | string[]) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleSave = () => {
    updateUserProfile({
      fullName: formData.fullName,
      dateOfBirth: formData.dateOfBirth,
      gender: formData.gender,
      bloodType: formData.bloodType,
      height: formData.height,
      weight: formData.weight,
      phone: formData.phone,
      email: formData.email,
      address: formData.address,
      allergies: formData.allergies,
      chronicConditions: formData.chronicConditions,
      specialConditions: formData.specialConditions,
      emergencyContactName: formData.emergencyContactName,
      emergencyContactRelation: formData.emergencyContactRelation,
      emergencyContactPhone: formData.emergencyContactPhone,
    })
    setEditMode(false)
  }

  const addAllergy = () => {
    if (newAllergy && !formData.allergies.includes(newAllergy)) {
      handleInputChange("allergies", [...formData.allergies, newAllergy])
      setNewAllergy("")
    }
  }

  const removeAllergy = (allergy: string) => {
    handleInputChange(
      "allergies",
      formData.allergies.filter((a) => a !== allergy),
    )
  }

  const toggleCondition = (condition: string) => {
    if (formData.chronicConditions.includes(condition)) {
      handleInputChange(
        "chronicConditions",
        formData.chronicConditions.filter((c) => c !== condition),
      )
    } else {
      handleInputChange("chronicConditions", [...formData.chronicConditions, condition])
    }
  }

  return (
    <main className="min-h-screen bg-background py-8">
      <div className="mx-auto max-w-6xl px-6">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground">My Profile</h1>
          <p className="mt-2 text-muted-foreground">Manage your personal and medical information</p>
        </div>

        {/* Profile Header Card */}
        <Card className="mb-8 border-0 bg-gradient-to-r from-primary/5 to-accent/5">
          <CardContent className="flex items-center justify-between pt-6">
            <div className="flex items-center gap-4">
              <div className="flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-primary to-accent text-white text-2xl font-bold">
                {formData.fullName[0]}
              </div>
              <div>
                <h2 className="text-2xl font-bold text-foreground">{formData.fullName}</h2>
                <p className="text-sm text-muted-foreground">Patient ID: QA-2024-0157</p>
                <p className="text-sm text-muted-foreground">Member since: December 2023</p>
              </div>
            </div>
            <Button
              onClick={() => (editMode ? handleSave() : setEditMode(true))}
              className={editMode ? "bg-primary hover:bg-primary/90" : "bg-primary hover:bg-primary/90"}
            >
              {editMode ? (
                <>
                  <Check className="mr-2 h-4 w-4" />
                  Save Changes
                </>
              ) : (
                <>
                  <Edit className="mr-2 h-4 w-4" />
                  Edit Profile
                </>
              )}
            </Button>
          </CardContent>
        </Card>

        {/* Tabs */}
        <Tabs defaultValue="personal" className="w-full">
          <TabsList className="mb-6 bg-secondary">
            <TabsTrigger value="personal">Personal Details</TabsTrigger>
            <TabsTrigger value="medical">Medical Details</TabsTrigger>
            <TabsTrigger value="history">Medical History</TabsTrigger>
            <TabsTrigger value="reports">Reports & Documents</TabsTrigger>
            <TabsTrigger value="medications">Current Medications</TabsTrigger>
          </TabsList>

          {/* Personal Details Tab */}
          <TabsContent value="personal">
            <Card>
              <CardHeader>
                <CardTitle>Basic Information</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid gap-6 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="fullName">Full Name</Label>
                    <Input
                      id="fullName"
                      value={formData.fullName}
                      onChange={(e) => handleInputChange("fullName", e.target.value)}
                      disabled={!editMode}
                      className="bg-secondary/50"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="dateOfBirth">Date of Birth</Label>
                    <Input
                      id="dateOfBirth"
                      value={formData.dateOfBirth}
                      onChange={(e) => handleInputChange("dateOfBirth", e.target.value)}
                      disabled={!editMode}
                      className="bg-secondary/50"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="gender">Gender</Label>
                    {editMode ? (
                      <Select value={formData.gender} onValueChange={(value) => handleInputChange("gender", value)}>
                        <SelectTrigger className="bg-secondary/50">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Female">Female</SelectItem>
                          <SelectItem value="Male">Male</SelectItem>
                          <SelectItem value="Other">Other</SelectItem>
                          <SelectItem value="Prefer not to say">Prefer not to say</SelectItem>
                        </SelectContent>
                      </Select>
                    ) : (
                      <Input value={formData.gender} disabled className="bg-secondary/50" />
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="bloodType">Blood Type (Required)</Label>
                    {editMode ? (
                      <Select
                        value={formData.bloodType}
                        onValueChange={(value) => handleInputChange("bloodType", value)}
                      >
                        <SelectTrigger className="bg-secondary/50">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {BLOOD_TYPES.map((type) => (
                            <SelectItem key={type} value={type}>
                              {type}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    ) : (
                      <Input value={formData.bloodType} disabled className="bg-secondary/50" />
                    )}
                  </div>
                </div>

                <div className="mt-8 border-t border-border pt-6">
                  <h3 className="mb-6 text-lg font-semibold">Contact Information</h3>
                  <div className="grid gap-6 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="phone">Phone Number</Label>
                      <Input
                        id="phone"
                        value={formData.phone}
                        onChange={(e) => handleInputChange("phone", e.target.value)}
                        disabled={!editMode}
                        className="bg-secondary/50"
                      />
                      {!editMode && <Check className="mt-2 h-4 w-4 text-primary" />}
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <Input
                        id="email"
                        value={formData.email}
                        onChange={(e) => handleInputChange("email", e.target.value)}
                        disabled={!editMode}
                        className="bg-secondary/50"
                      />
                      {!editMode && <Check className="mt-2 h-4 w-4 text-primary" />}
                    </div>
                    <div className="space-y-2 md:col-span-2">
                      <Label htmlFor="address">Address</Label>
                      <Input
                        id="address"
                        value={formData.address}
                        onChange={(e) => handleInputChange("address", e.target.value)}
                        disabled={!editMode}
                        className="bg-secondary/50"
                      />
                      {!editMode && <MapPin className="mt-2 h-4 w-4 text-muted-foreground" />}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Medical Details Tab */}
          <TabsContent value="medical">
            <Card>
              <CardHeader>
                <CardTitle>Medical Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid gap-6 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="height">Height</Label>
                    <Input
                      id="height"
                      value={formData.height}
                      onChange={(e) => handleInputChange("height", e.target.value)}
                      disabled={!editMode}
                      className="bg-secondary/50"
                      placeholder="e.g., 165 cm"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="weight">Weight</Label>
                    <Input
                      id="weight"
                      value={formData.weight}
                      onChange={(e) => handleInputChange("weight", e.target.value)}
                      disabled={!editMode}
                      className="bg-secondary/50"
                      placeholder="e.g., 62 kg"
                    />
                  </div>
                </div>

                <div className="border-t border-border pt-6">
                  <div className="mb-4 flex items-center justify-between">
                    <Label>Known Allergies</Label>
                    {editMode && (
                      <div className="flex gap-2">
                        <Input
                          placeholder="Add allergy"
                          value={newAllergy}
                          onChange={(e) => setNewAllergy(e.target.value)}
                          className="w-40"
                        />
                        <Button size="sm" onClick={addAllergy}>
                          <Plus className="h-4 w-4" />
                        </Button>
                      </div>
                    )}
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {formData.allergies.length > 0 ? (
                      formData.allergies.map((allergy) => (
                        <div
                          key={allergy}
                          className="flex items-center gap-2 rounded-full bg-destructive/10 px-3 py-1 text-sm text-destructive"
                        >
                          {allergy}
                          {editMode && (
                            <button
                              onClick={() => removeAllergy(allergy)}
                              className="ml-1 text-destructive hover:font-bold"
                            >
                              ×
                            </button>
                          )}
                        </div>
                      ))
                    ) : (
                      <p className="text-sm text-muted-foreground">No known allergies</p>
                    )}
                  </div>
                </div>

                <div className="border-t border-border pt-6">
                  <Label className="mb-4 block">Chronic Conditions</Label>
                  <div className="grid gap-3 md:grid-cols-2">
                    {CHRONIC_CONDITIONS.map((condition) => (
                      <div key={condition} className="flex items-center gap-2">
                        <Checkbox
                          id={condition}
                          checked={formData.chronicConditions.includes(condition)}
                          onCheckedChange={() => toggleCondition(condition)}
                          disabled={!editMode}
                        />
                        <Label htmlFor={condition} className="font-normal cursor-pointer">
                          {condition}
                        </Label>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Special Conditions */}
                <div className="border-t border-border pt-6">
                  <Label htmlFor="specialConditions">Special Medical Conditions</Label>
                  <Input
                    id="specialConditions"
                    value={formData.specialConditions}
                    onChange={(e) => handleInputChange("specialConditions", e.target.value)}
                    disabled={!editMode}
                    placeholder="e.g., Pregnancy, Kidney disease"
                    className="mt-2 bg-secondary/50"
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Medical History Tab */}
          <TabsContent value="history">
            <Card>
              <CardHeader>
                <CardTitle>Medical History</CardTitle>
                <CardDescription>Your past medical conditions and treatments</CardDescription>
              </CardHeader>
              <CardContent className="text-center text-muted-foreground py-8">
                <p>Medical history details coming soon</p>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Reports Tab */}
          <TabsContent value="reports">
            <Card>
              <CardHeader>
                <CardTitle>Reports & Documents</CardTitle>
                <CardDescription>Your health reports and medical documents</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {data.reports.map((report) => (
                    <div
                      key={report.id}
                      className="flex items-center justify-between rounded-lg border border-border bg-secondary/30 p-4"
                    >
                      <div>
                        <p className="font-semibold text-foreground">{report.name}</p>
                        <p className="text-xs text-muted-foreground">{report.date}</p>
                      </div>
                      <Button variant="ghost" size="sm">
                        Download
                      </Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Medications Tab */}
          <TabsContent value="medications">
            <Card>
              <CardHeader>
                <CardTitle>Current Medications</CardTitle>
                <CardDescription>All medicines you are currently taking</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {data.medicines
                    .filter((m) => m.status === "active")
                    .map((medicine) => (
                      <div key={medicine.id} className="rounded-lg border border-border bg-secondary/30 p-4">
                        <p className="font-semibold text-foreground">{medicine.name}</p>
                        <p className="text-xs text-muted-foreground">
                          {medicine.dosage} • {medicine.frequency} • {medicine.times}
                        </p>
                      </div>
                    ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Emergency Contact Section */}
        <Card className="mt-6 border-l-4 border-l-primary">
          <CardHeader>
            <CardTitle className="text-lg">Emergency Contact</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="bg-primary/5 rounded-lg p-4">
              <div className="space-y-3">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Name</p>
                  <Input
                    value={formData.emergencyContactName}
                    onChange={(e) => handleInputChange("emergencyContactName", e.target.value)}
                    disabled={!editMode}
                    className="mt-1 bg-transparent border-0 text-foreground font-semibold px-0"
                  />
                </div>
                <div className="grid gap-4 md:grid-cols-2">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Relationship</p>
                    <Input
                      value={formData.emergencyContactRelation}
                      onChange={(e) => handleInputChange("emergencyContactRelation", e.target.value)}
                      disabled={!editMode}
                      className="mt-1 bg-transparent border-0 text-foreground font-semibold px-0"
                    />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Phone</p>
                    <Input
                      value={formData.emergencyContactPhone}
                      onChange={(e) => handleInputChange("emergencyContactPhone", e.target.value)}
                      disabled={!editMode}
                      className="mt-1 bg-transparent border-0 text-foreground font-semibold px-0"
                    />
                  </div>
                </div>
                <p className="mt-4 text-xs text-muted-foreground">Accessible in emergencies</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </main>
  )
}
