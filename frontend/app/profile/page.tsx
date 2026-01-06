"use client"

import { useState } from "react"
import { DashboardHeader } from "@/components/dashboard-header"
import { Button } from "@/components/ui/button"

type TabType = "personal" | "medical" | "medical-history" | "medications"

export default function ProfilePage() {
  const [activeTab, setActiveTab] = useState<TabType>("personal")
  const [isEditing, setIsEditing] = useState(false)
  const [profileData, setProfileData] = useState({
    fullName: "Sarah Johnson",
    dateOfBirth: "March 15, 1985",
    gender: "Female",
    bloodType: "O+",
    phone: "+1 (555) 123-4567",
    email: "sarah@email.com",
    address: "123 Oak Street, Apt 4B, San Francisco, CA 94102",
    emergencyName: "Michael Johnson",
    emergencyRelationship: "Spouse",
    emergencyPhone: "+1 (555) 987-6543",
  })

  const tabs = [
    { id: "personal", label: "Personal Details" },
    { id: "medical", label: "Medical Details" },
    { id: "medical-history", label: "Medical History" },
    { id: "medications", label: "Medications" },
  ]

  const handleFieldChange = (field: string, value: string) => {
    setProfileData((prev) => ({ ...prev, [field]: value }))
  }

  const handleSaveProfile = () => {
    setIsEditing(false)
  }

  return (
    <div className="min-h-screen bg-background">
      <DashboardHeader />

      <main className="p-3 sm:p-4 md:p-6 lg:p-8">
        <div className="max-w-5xl mx-auto">
          {/* Header Section */}
          <div className="card-gradient p-4 sm:p-6 md:p-8 mb-8 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-transparent opacity-40"></div>
            <div className="relative">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 sm:gap-6">
                <div className="flex items-center gap-4 sm:gap-6 w-full sm:w-auto">
                  <div className="w-14 h-14 sm:w-16 sm:h-16 lg:w-20 lg:h-20 rounded-full bg-gradient-primary text-primary-foreground flex items-center justify-center text-xl sm:text-2xl lg:text-3xl font-bold shrink-0 shadow-lg">
                    SJ
                  </div>
                  <div className="min-w-0 flex-1 sm:flex-none">
                    <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-foreground break-words">
                      {profileData.fullName}
                    </h1>
                    <p className="text-xs sm:text-sm text-muted-foreground truncate">Patient ID: QA-2024-0157</p>
                    <p className="text-xs sm:text-sm text-muted-foreground">Member since: December 2023</p>
                  </div>
                </div>
                <Button
                  onClick={() => setIsEditing(!isEditing)}
                  className="w-full sm:w-auto gap-2 px-6 py-2.5 rounded-lg font-semibold text-sm bg-gradient-to-r from-primary to-accent text-primary-foreground hover:shadow-lg hover:shadow-primary/30 transition-all duration-200"
                >
                  <span>{isEditing ? "✕" : "✏️"}</span>
                  <span className="hidden sm:inline">{isEditing ? "Cancel" : "Edit Profile"}</span>
                  <span className="sm:hidden">{isEditing ? "Cancel" : "Edit"}</span>
                </Button>
              </div>
            </div>
          </div>

          {/* Tabs */}
          <div className="flex gap-2 mb-8 overflow-x-auto pb-2 -mx-3 sm:-mx-4 md:-mx-6 lg:-mx-8 px-3 sm:px-4 md:px-6 lg:px-8 scrollbar-hide">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as TabType)}
                className={`px-3 sm:px-4 py-2.5 rounded-lg font-semibold whitespace-nowrap transition-all duration-200 text-xs sm:text-sm ${
                  activeTab === tab.id
                    ? "bg-gradient-to-r from-primary to-accent text-primary-foreground shadow-lg shadow-primary/30"
                    : "bg-muted text-muted-foreground hover:text-foreground hover:bg-muted"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Tab Content */}
          <div className="space-y-6">
            {/* Personal Details */}
            {activeTab === "personal" && (
              <div className="card-premium p-4 sm:p-6 md:p-8 space-y-6">
                <h2 className="text-lg sm:text-2xl font-bold text-foreground">Basic Information</h2>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                  <div>
                    <label className="block text-xs sm:text-sm font-semibold text-muted-foreground mb-2">
                      Full Name
                    </label>
                    {isEditing ? (
                      <input
                        type="text"
                        value={profileData.fullName}
                        onChange={(e) => handleFieldChange("fullName", e.target.value)}
                        className="w-full px-4 py-2.5 rounded-lg bg-muted border border-input text-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-sm"
                      />
                    ) : (
                      <p className="text-base sm:text-lg font-semibold text-foreground">{profileData.fullName}</p>
                    )}
                  </div>
                  <div>
                    <label className="block text-xs sm:text-sm font-semibold text-muted-foreground mb-2">
                      Date of Birth
                    </label>
                    {isEditing ? (
                      <input
                        type="text"
                        value={profileData.dateOfBirth}
                        onChange={(e) => handleFieldChange("dateOfBirth", e.target.value)}
                        className="w-full px-4 py-2.5 rounded-lg bg-muted border border-input text-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-sm"
                      />
                    ) : (
                      <p className="text-base sm:text-lg font-semibold text-foreground">{profileData.dateOfBirth}</p>
                    )}
                  </div>
                  <div>
                    <label className="block text-xs sm:text-sm font-semibold text-muted-foreground mb-2">Gender</label>
                    {isEditing ? (
                      <select
                        value={profileData.gender}
                        onChange={(e) => handleFieldChange("gender", e.target.value)}
                        className="w-full px-4 py-2.5 rounded-lg bg-muted border border-input text-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-sm"
                      >
                        <option>Male</option>
                        <option>Female</option>
                        <option>Other</option>
                      </select>
                    ) : (
                      <p className="text-base sm:text-lg font-semibold text-foreground">{profileData.gender}</p>
                    )}
                  </div>
                  <div>
                    <label className="block text-xs sm:text-sm font-semibold text-muted-foreground mb-2">
                      Blood Type
                    </label>
                    {isEditing ? (
                      <select
                        value={profileData.bloodType}
                        onChange={(e) => handleFieldChange("bloodType", e.target.value)}
                        className="w-full px-4 py-2.5 rounded-lg bg-muted border border-input text-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-sm"
                      >
                        <option>A+</option>
                        <option>A-</option>
                        <option>B+</option>
                        <option>B-</option>
                        <option>AB+</option>
                        <option>AB-</option>
                        <option>O+</option>
                        <option>O-</option>
                      </select>
                    ) : (
                      <p className="text-base sm:text-lg font-semibold text-foreground">{profileData.bloodType}</p>
                    )}
                  </div>
                </div>

                <div className="border-t border-border pt-6">
                  <h3 className="text-base sm:text-lg font-bold text-foreground mb-4">Contact Information</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                    <div>
                      <label className="block text-xs sm:text-sm font-semibold text-muted-foreground mb-2">
                        Phone Number
                      </label>
                      {isEditing ? (
                        <input
                          type="tel"
                          value={profileData.phone}
                          onChange={(e) => handleFieldChange("phone", e.target.value)}
                          className="w-full px-4 py-2.5 rounded-lg bg-muted border border-input text-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-sm"
                        />
                      ) : (
                        <p className="text-base sm:text-lg font-semibold text-foreground flex items-center gap-2">
                          {profileData.phone}
                          <span className="text-success text-xs">✓</span>
                        </p>
                      )}
                    </div>
                    <div>
                      <label className="block text-xs sm:text-sm font-semibold text-muted-foreground mb-2">Email</label>
                      {isEditing ? (
                        <input
                          type="email"
                          value={profileData.email}
                          onChange={(e) => handleFieldChange("email", e.target.value)}
                          className="w-full px-4 py-2.5 rounded-lg bg-muted border border-input text-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-sm"
                        />
                      ) : (
                        <p className="text-base sm:text-lg font-semibold text-foreground flex items-center gap-2">
                          {profileData.email}
                          <span className="text-success text-xs">✓</span>
                        </p>
                      )}
                    </div>
                  </div>
                </div>

                <div className="border-t border-border pt-6">
                  <h3 className="text-base sm:text-lg font-bold text-foreground mb-4">Address</h3>
                  {isEditing ? (
                    <input
                      type="text"
                      value={profileData.address}
                      onChange={(e) => handleFieldChange("address", e.target.value)}
                      className="w-full px-4 py-2.5 rounded-lg bg-muted border border-input text-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-sm"
                    />
                  ) : (
                    <>
                      <p className="text-base sm:text-lg font-semibold text-foreground">{profileData.address}</p>
                      <div className="mt-4 text-xs sm:text-sm text-muted-foreground flex items-center gap-2">
                        <span>📍</span> Verified address
                      </div>
                    </>
                  )}
                </div>

                <div className="border-t border-border pt-6">
                  <h3 className="text-base sm:text-lg font-bold text-foreground mb-4">Emergency Contact</h3>
                  <div className="bg-muted/50 rounded-xl p-4 sm:p-6 border border-border">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <p className="text-xs sm:text-sm font-semibold text-muted-foreground">Name</p>
                        {isEditing ? (
                          <input
                            type="text"
                            value={profileData.emergencyName}
                            onChange={(e) => handleFieldChange("emergencyName", e.target.value)}
                            className="w-full px-3 py-2 rounded-lg bg-background border border-input text-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent mt-1 text-sm"
                          />
                        ) : (
                          <p className="font-semibold text-foreground mt-1 text-sm sm:text-base">
                            {profileData.emergencyName}
                          </p>
                        )}
                      </div>
                      <div>
                        <p className="text-xs sm:text-sm font-semibold text-muted-foreground">Relationship</p>
                        {isEditing ? (
                          <input
                            type="text"
                            value={profileData.emergencyRelationship}
                            onChange={(e) => handleFieldChange("emergencyRelationship", e.target.value)}
                            className="w-full px-3 py-2 rounded-lg bg-background border border-input text-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent mt-1 text-sm"
                          />
                        ) : (
                          <p className="font-semibold text-foreground mt-1 text-sm sm:text-base">
                            {profileData.emergencyRelationship}
                          </p>
                        )}
                      </div>
                      <div className="sm:col-span-2">
                        <p className="text-xs sm:text-sm font-semibold text-muted-foreground">Phone</p>
                        {isEditing ? (
                          <input
                            type="tel"
                            value={profileData.emergencyPhone}
                            onChange={(e) => handleFieldChange("emergencyPhone", e.target.value)}
                            className="w-full px-3 py-2 rounded-lg bg-background border border-input text-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent mt-1 text-sm"
                          />
                        ) : (
                          <p className="font-semibold text-foreground mt-1 text-sm sm:text-base">
                            {profileData.emergencyPhone}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                {isEditing && (
                  <div className="border-t border-border pt-6 flex flex-col sm:flex-row gap-3 sm:gap-4">
                    <Button
                      onClick={handleSaveProfile}
                      className="flex-1 px-6 py-2.5 rounded-lg font-semibold text-sm bg-gradient-to-r from-primary to-accent text-primary-foreground hover:shadow-lg hover:shadow-primary/30 transition-all duration-200"
                    >
                      Save Changes
                    </Button>
                    <Button onClick={() => setIsEditing(false)} variant="outline" className="flex-1 bg-transparent">
                      Discard
                    </Button>
                  </div>
                )}
              </div>
            )}

            {/* Medical Details */}
            {activeTab === "medical" && (
              <div className="card-premium p-4 sm:p-6 md:p-8">
                <h2 className="text-lg sm:text-2xl font-bold text-foreground mb-6">Medical Information</h2>
                <div className="space-y-6">
                  <div className="border-b border-border pb-6">
                    <h3 className="text-base sm:text-lg font-bold text-foreground mb-4">Known Conditions</h3>
                    <div className="space-y-2">
                      {["Diabetes Type 2", "Hypertension"].map((condition) => (
                        <div
                          key={condition}
                          className="flex items-center gap-3 p-3 rounded-lg hover:bg-muted transition-colors"
                        >
                          <span className="text-primary font-bold text-lg">✓</span>
                          <span className="text-foreground text-sm sm:text-base">{condition}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h3 className="text-base sm:text-lg font-bold text-foreground mb-4">Allergies</h3>
                    <div className="bg-yellow-50 dark:bg-yellow-950/20 border border-yellow-200 dark:border-yellow-800/30 rounded-lg p-4">
                      <p className="text-xs sm:text-sm text-yellow-900 dark:text-yellow-200">
                        ✓ No known drug allergies reported
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Medical History */}
            {activeTab === "medical-history" && (
              <div className="card-premium p-4 sm:p-6 md:p-8">
                <h2 className="text-lg sm:text-2xl font-bold text-foreground mb-6">Medical History Timeline</h2>
                <div className="space-y-4">
                  {[
                    { title: "Diabetes Diagnosis", date: "2015", status: "Ongoing" },
                    { title: "Hypertension Treatment Started", date: "2018", status: "Active" },
                  ].map((item, idx) => (
                    <div
                      key={idx}
                      className="border border-border rounded-lg p-4 sm:p-5 hover:border-primary/30 hover:bg-primary/5 transition-all duration-300"
                    >
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 sm:gap-4">
                        <div className="min-w-0">
                          <h3 className="font-semibold text-foreground text-sm sm:text-base">{item.title}</h3>
                          <p className="text-xs sm:text-sm text-muted-foreground mt-1">Year: {item.date}</p>
                        </div>
                        <span className="inline-block px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-semibold whitespace-nowrap">
                          {item.status}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Current Medications */}
            {activeTab === "medications" && (
              <div className="card-premium p-4 sm:p-6 md:p-8">
                <h2 className="text-lg sm:text-2xl font-bold text-foreground mb-6">Current Medications</h2>
                <div className="space-y-3 sm:space-y-4">
                  {[
                    { name: "Metformin", dosage: "500mg", frequency: "2 tablets daily", status: "Active" },
                    { name: "Aspirin", dosage: "100mg", frequency: "1 tablet daily", status: "Active" },
                    { name: "Lisinopril", dosage: "10mg", frequency: "1 tablet daily", status: "Active" },
                  ].map((med) => (
                    <div
                      key={med.name}
                      className="border border-border rounded-lg p-4 sm:p-5 hover:border-primary/30 hover:bg-primary/5 transition-all duration-300"
                    >
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4">
                        <div className="min-w-0">
                          <h3 className="font-semibold text-foreground text-sm sm:text-base">{med.name}</h3>
                          <p className="text-xs sm:text-sm text-muted-foreground mt-1">
                            {med.dosage} • {med.frequency}
                          </p>
                        </div>
                        <span className="inline-block px-3 py-1 rounded-full bg-success/10 text-success text-xs font-semibold whitespace-nowrap">
                          {med.status}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  )
}
