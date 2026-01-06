"use client"

import type React from "react"
import { useState, Suspense } from "react"
import dynamic from "next/dynamic"
import { DashboardHeader } from "@/components/dashboard-header"
import { ChatMessage } from "@/components/chat-message"
import { SafetyScore } from "@/components/safety-score"
import { MedicationsList } from "@/components/medications-list"
import { Button } from "@/components/ui/button"

// Dynamic import for 3D component
const MedicineInteractionVisualizer = dynamic(() => import("@/components/medicine-3d-visualizer"), {
  ssr: false,
  loading: () => (
    <div className="w-full h-64 bg-muted rounded-lg animate-pulse flex items-center justify-center text-muted-foreground">
      Loading 3D Visualization...
    </div>
  ),
})

interface Message {
  id: number
  type: "user" | "ai"
  content: string
}

interface RiskAlert {
  id: number
  severity: "critical" | "warning" | "info"
  title: string
  description: string
  action?: string
}

export default function RiskChecksPage() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      type: "ai",
      content:
        "I've analyzed your health profile. You're currently taking 3 active medicines. Your safety score is 93/100. I detected 1 potential issue that we should discuss. Feel free to ask me about any interactions or health concerns.",
    },
  ])
  const [inputValue, setInputValue] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [activeTab, setActiveTab] = useState<"chat" | "interactions" | "analytics">("chat")

  const [riskAlerts] = useState<RiskAlert[]>([
    {
      id: 1,
      severity: "warning",
      title: "Potential Drug Interaction",
      description: "Metformin + Aspirin may increase bleeding risk",
      action: "Consult doctor",
    },
    {
      id: 2,
      severity: "info",
      title: "Medication Timing Optimization",
      description: "Taking Lisinopril 12 hours apart improves absorption",
      action: "Adjust timing",
    },
  ])

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!inputValue.trim()) return

    const userMessage: Message = {
      id: Date.now(),
      type: "user",
      content: inputValue,
    }
    setMessages((prev) => [...prev, userMessage])
    setInputValue("")
    setIsLoading(true)

    setTimeout(() => {
      const aiMessage: Message = {
        id: Date.now() + 1,
        type: "ai",
        content:
          "Based on your health profile, I've reviewed your inquiry. Your current medications appear to have good compatibility. However, I recommend consulting with your doctor before adding any new supplements.",
      }
      setMessages((prev) => [...prev, aiMessage])
      setIsLoading(false)
    }, 1000)
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <DashboardHeader />

      <main className="flex-1 p-3 sm:p-4 md:p-6 lg:p-8 overflow-hidden">
        <div className="max-w-7xl mx-auto h-full flex flex-col">
          {/* Header */}
          <div className="mb-6 md:mb-8">
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold gradient-text">Advanced Safety Analysis</h1>
            <p className="text-xs sm:text-sm text-muted-foreground mt-1 md:mt-2">
              AI-powered medicine interaction detection with 3D visualization
            </p>
          </div>

          {/* Tabs */}
          <div className="flex gap-2 md:gap-4 mb-6 border-b border-border">
            <button
              onClick={() => setActiveTab("chat")}
              className={`px-3 md:px-4 py-2.5 text-xs sm:text-sm font-medium border-b-2 transition-colors ${
                activeTab === "chat"
                  ? "border-primary text-primary"
                  : "border-transparent text-muted-foreground hover:text-foreground"
              }`}
            >
              Chat Assistant
            </button>
            <button
              onClick={() => setActiveTab("interactions")}
              className={`px-3 md:px-4 py-2.5 text-xs sm:text-sm font-medium border-b-2 transition-colors ${
                activeTab === "interactions"
                  ? "border-primary text-primary"
                  : "border-transparent text-muted-foreground hover:text-foreground"
              }`}
            >
              3D Interactions
            </button>
            <button
              onClick={() => setActiveTab("analytics")}
              className={`px-3 md:px-4 py-2.5 text-xs sm:text-sm font-medium border-b-2 transition-colors ${
                activeTab === "analytics"
                  ? "border-primary text-primary"
                  : "border-transparent text-muted-foreground hover:text-foreground"
              }`}
            >
              Risk Analytics
            </button>
          </div>

          {/* Content Area */}
          <div className="flex-1 flex flex-col lg:flex-row gap-4 md:gap-6 min-h-0">
            {/* Main Chat Area */}
            {activeTab === "chat" && (
              <div className="flex-1 flex flex-col min-h-0">
                <div className="flex-1 card-premium p-3 sm:p-4 md:p-6 flex flex-col min-h-0 mb-4">
                  <div className="flex-1 overflow-y-auto space-y-3 md:space-y-4 mb-4 md:mb-6 pr-2">
                    {messages.map((message) => (
                      <ChatMessage key={message.id} message={message} />
                    ))}
                    {isLoading && (
                      <div className="flex justify-start">
                        <div className="bg-muted rounded-lg px-4 py-3 max-w-xs">
                          <div className="flex gap-2">
                            <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce"></div>
                            <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce delay-100"></div>
                            <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce delay-200"></div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>

                  <form onSubmit={handleSendMessage} className="flex gap-2 md:gap-3">
                    <input
                      type="text"
                      value={inputValue}
                      onChange={(e) => setInputValue(e.target.value)}
                      placeholder="Ask about drug interactions..."
                      className="flex-1 px-3 md:px-4 py-2.5 md:py-3 rounded-lg bg-muted border border-input text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-xs sm:text-sm"
                    />
                    <Button
                      type="submit"
                      size="icon"
                      className="flex-shrink-0 rounded-lg px-3 py-2.5 bg-gradient-to-r from-primary to-accent text-primary-foreground hover:shadow-lg hover:shadow-primary/30 transition-all duration-200"
                    >
                      <svg
                        className="w-4 h-4 md:w-5 md:h-5"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5.951-1.429 5.951 1.429a1 1 0 001.169-1.409l-7-14z"></path>
                      </svg>
                    </Button>
                  </form>
                </div>
              </div>
            )}

            {/* 3D Interaction Visualizer */}
            {activeTab === "interactions" && (
              <div className="flex-1 flex flex-col min-h-0">
                <div className="card-premium p-3 sm:p-4 md:p-6 flex-1 flex flex-col min-h-0">
                  <h2 className="text-lg sm:text-xl font-semibold mb-4 text-foreground">
                    Medicine Interaction Network
                  </h2>
                  <Suspense fallback={<div className="flex-1 bg-muted rounded-lg animate-pulse" />}>
                    <MedicineInteractionVisualizer />
                  </Suspense>
                </div>
              </div>
            )}

            {/* Risk Analytics */}
            {activeTab === "analytics" && (
              <div className="flex-1 flex flex-col min-h-0">
                <div className="space-y-4 overflow-y-auto">
                  {riskAlerts.map((alert) => (
                    <div
                      key={alert.id}
                      className={`card-premium p-4 md:p-6 border-l-4 ${
                        alert.severity === "critical"
                          ? "border-l-red-500 bg-red-50 dark:bg-red-950/20"
                          : alert.severity === "warning"
                            ? "border-l-yellow-500 bg-yellow-50 dark:bg-yellow-950/20"
                            : "border-l-blue-500 bg-blue-50 dark:bg-blue-950/20"
                      }`}
                    >
                      <div className="flex items-start justify-between">
                        <div>
                          <h3 className="font-semibold text-foreground text-sm md:text-base">{alert.title}</h3>
                          <p className="text-xs md:text-sm text-muted-foreground mt-1">{alert.description}</p>
                        </div>
                        {alert.action && (
                          <Button variant="outline" size="sm" className="ml-4 flex-shrink-0 text-xs bg-transparent">
                            {alert.action}
                          </Button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Sidebar */}
            <div className="w-full lg:w-80 flex flex-col gap-4 md:gap-6 min-h-0">
              {/* Safety Score */}
              <SafetyScore score={93} riskLevel="Low Risk" lastUpdated="Today" />

              {/* Current Medications */}
              <MedicationsList
                medications={[
                  { name: "Metformin", status: "Active" },
                  { name: "Aspirin", status: "Active" },
                  { name: "Lisinopril", status: "Active" },
                ]}
              />

              {/* Quick Stats */}
              <div className="card-premium p-4 md:p-6">
                <h3 className="font-semibold text-foreground mb-4 text-sm md:text-base">Quick Stats</h3>
                <div className="grid grid-cols-2 gap-3 md:gap-4">
                  <div className="bg-gradient-to-br from-primary/10 to-accent/10 rounded-lg p-3">
                    <p className="text-xs text-muted-foreground">Total Meds</p>
                    <p className="text-lg md:text-xl font-bold text-foreground">3</p>
                  </div>
                  <div className="bg-gradient-to-br from-green-500/10 to-emerald-500/10 rounded-lg p-3">
                    <p className="text-xs text-muted-foreground">Safety Score</p>
                    <p className="text-lg md:text-xl font-bold text-green-600 dark:text-green-400">93%</p>
                  </div>
                  <div className="bg-gradient-to-br from-yellow-500/10 to-orange-500/10 rounded-lg p-3">
                    <p className="text-xs text-muted-foreground">Alerts</p>
                    <p className="text-lg md:text-xl font-bold text-orange-600 dark:text-orange-400">2</p>
                  </div>
                  <div className="bg-gradient-to-br from-blue-500/10 to-cyan-500/10 rounded-lg p-3">
                    <p className="text-xs text-muted-foreground">Compliance</p>
                    <p className="text-lg md:text-xl font-bold text-blue-600 dark:text-blue-400">100%</p>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="space-y-2 md:space-y-3">
                <Button variant="outline" className="w-full bg-transparent justify-start text-xs md:text-sm py-2.5">
                  <span className="mr-2">↗️</span> Share with Doctor
                </Button>
                <Button variant="outline" className="w-full bg-transparent justify-start text-xs md:text-sm py-2.5">
                  <span className="mr-2">📥</span> Download Full Report
                </Button>
              </div>

              {/* Medical Disclaimer */}
              <div className="bg-muted rounded-xl p-3 md:p-4 border border-border">
                <h4 className="text-xs font-semibold text-foreground mb-2 flex items-center gap-2">
                  <span>ℹ️</span> Medical Disclaimer
                </h4>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  This analysis is for informational purposes only and should not replace professional medical advice.
                  Always consult your healthcare provider.
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
