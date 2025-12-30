"use client"

import type React from "react"
import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { AlertCircle, Send, CheckCircle, Share2, Download, Copy, Mail } from "lucide-react"
import { useHealthData } from "@/hooks/use-health-data"

interface Message {
  id: string
  type: "user" | "ai"
  content: string
  timestamp: Date
}

export default function RiskCheckPage() {
  const { data, safetyScore, shareDoctorReport, downloadReport } = useHealthData()
  const [messages, setMessages] = useState<Message[]>([])
  const [userInput, setUserInput] = useState("")
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [reportCopied, setReportCopied] = useState(false)
  const scrollRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight
    }
  }, [messages])

  useEffect(() => {
    if (data && safetyScore && messages.length === 0) {
      const activeMeds = data.medicines.filter((m) => m.status === "active")
      const initialMessage: Message = {
        id: "1",
        type: "ai",
        content: `I've analyzed your health profile. You're currently taking ${activeMeds.length} active medicines. Your safety score is ${safetyScore.finalScore}/100. ${safetyScore.warnings.length > 0 ? `I detected ${safetyScore.warnings.length} potential issues that we should discuss.` : "Your current medications appear to be safe. "}Feel free to ask me about any interactions or health concerns.`,
        timestamp: new Date(),
      }
      setMessages([initialMessage])
    }
  }, [data, safetyScore])

  if (!data || !safetyScore) {
    return (
      <main className="min-h-screen bg-background py-8">
        <div className="mx-auto max-w-5xl px-6">
          <p className="text-muted-foreground">Loading safety analysis...</p>
        </div>
      </main>
    )
  }

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!userInput.trim()) return

    const userMessage: Message = {
      id: Date.now().toString(),
      type: "user",
      content: userInput,
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, userMessage])
    setUserInput("")
    setIsAnalyzing(true)

    setTimeout(() => {
      let aiResponse = ""
      const input = userInput.toLowerCase()

      const activeMeds = data.medicines.filter((m) => m.status === "active")
      const medNames = activeMeds.map((m) => m.name.toLowerCase())

      // Check for medicine interactions
      for (const med of medNames) {
        if (input.includes(med) || input.includes("interaction") || input.includes("safe")) {
          const warnings = safetyScore.warnings.filter((w) =>
            w.message.includes(activeMeds.find((m) => m.name.toLowerCase() === med)?.name || ""),
          )
          if (warnings.length > 0) {
            aiResponse = `Regarding your concern about ${activeMeds.find((m) => m.name.toLowerCase() === med)?.name}: ${warnings[0].message}. I recommend consulting your doctor before taking any additional medications.`
          } else {
            aiResponse = `Based on my analysis, your current medications appear to be compatible. However, always inform your healthcare provider before starting new treatments.`
          }
          break
        }
      }

      // Check for symptoms/side effects
      if (input.includes("symptom") || input.includes("side effect") || input.includes("feeling")) {
        aiResponse =
          "I understand you're experiencing symptoms. This is important information. I recommend logging these daily to help identify patterns. Would you like to record your symptoms in the system?"
      }

      // Check for allergies
      if (input.includes("allerg")) {
        aiResponse = `Your recorded allergies are: ${data.user.allergies.join(", ")}. If you've discovered new allergies, please update your profile immediately.`
      }

      // Default response
      if (!aiResponse) {
        aiResponse =
          "That's a great question. Based on your current health profile and medications, I'd recommend discussing this with your healthcare provider for personalized medical advice. Is there anything else I can help you with?"
      }

      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: "ai",
        content: aiResponse,
        timestamp: new Date(),
      }

      setMessages((prev) => [...prev, aiMessage])
      setIsAnalyzing(false)
    }, 1500)
  }

  const handleShareWithDoctor = () => {
    const report = shareDoctorReport()
    const email = `mailto:doctor@example.com?subject=Patient Health Report - ${data.user.fullName}&body=${encodeURIComponent(report)}`
    window.location.href = email
  }

  const handleCopyReport = () => {
    const report = shareDoctorReport()
    navigator.clipboard.writeText(report).then(() => {
      setReportCopied(true)
      setTimeout(() => setReportCopied(false), 2000)
    })
  }

  const activeMeds = data.medicines.filter((m) => m.status === "active")

  return (
    <main className="min-h-screen bg-background py-8">
      <div className="mx-auto max-w-5xl px-6">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground">Safety Analysis Chat</h1>
          <p className="mt-2 text-muted-foreground">Verify medicine safety and ask questions about your health</p>
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          {/* Chat Section */}
          <div className="lg:col-span-2">
            <Card className="flex h-[600px] flex-col">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-primary" />
                  Safety Analysis
                </CardTitle>
                <CardDescription>
                  Risk Level: <span className="font-semibold capitalize text-foreground">{safetyScore.riskLevel}</span>
                </CardDescription>
              </CardHeader>
              <CardContent className="flex-1 overflow-hidden">
                <div ref={scrollRef} className="flex h-full flex-col space-y-4 overflow-y-auto pr-4">
                  {messages.map((message) => (
                    <div
                      key={message.id}
                      className={`flex ${message.type === "user" ? "justify-end" : "justify-start"}`}
                    >
                      <div
                        className={`max-w-xs rounded-lg px-4 py-3 ${
                          message.type === "user"
                            ? "bg-primary text-primary-foreground"
                            : "bg-secondary text-foreground"
                        }`}
                      >
                        <p className="text-sm whitespace-pre-line">{message.content}</p>
                      </div>
                    </div>
                  ))}

                  {isAnalyzing && (
                    <div className="flex justify-start">
                      <div className="rounded-lg bg-secondary px-4 py-3">
                        <div className="flex gap-2">
                          <div className="h-2 w-2 rounded-full bg-muted-foreground animate-bounce"></div>
                          <div className="h-2 w-2 rounded-full bg-muted-foreground animate-bounce delay-100"></div>
                          <div className="h-2 w-2 rounded-full bg-muted-foreground animate-bounce delay-200"></div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>

              {/* Chat Input */}
              <div className="border-t border-border p-4">
                <form onSubmit={handleSendMessage} className="flex gap-2">
                  <Input
                    placeholder="Ask about drug interactions..."
                    value={userInput}
                    onChange={(e) => setUserInput(e.target.value)}
                    disabled={isAnalyzing}
                    className="bg-secondary/50"
                  />
                  <Button
                    type="submit"
                    disabled={isAnalyzing || !userInput.trim()}
                    className="bg-primary hover:bg-primary/90"
                  >
                    <Send className="h-4 w-4" />
                  </Button>
                </form>
              </div>
            </Card>
          </div>

          {/* Right Panel - Analysis Results */}
          <div className="space-y-6">
            <Card className="bg-gradient-to-br from-primary/5 to-primary/10">
              <CardHeader>
                <CardTitle className="text-lg">Safety Score</CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <div className="flex h-32 w-32 items-center justify-center rounded-full border-4 border-primary bg-primary/10 mx-auto mb-4">
                  <div>
                    <p className="text-3xl font-bold text-primary">{safetyScore.finalScore}</p>
                    <p className="text-xs text-muted-foreground">/100</p>
                  </div>
                </div>
                <p className="font-semibold text-foreground capitalize">{safetyScore.riskLevel} Risk</p>
                <p className="text-sm text-muted-foreground">Last updated: Today</p>
              </CardContent>
            </Card>

            {/* Your Medications */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Your Medications</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {activeMeds.map((med) => (
                  <div
                    key={med.id}
                    className="flex items-center justify-between rounded-lg border border-border bg-secondary/30 p-3"
                  >
                    <p className="font-medium text-sm text-foreground">{med.name}</p>
                    <Badge variant="outline" className="bg-transparent">
                      Active
                    </Badge>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Key Findings */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base flex items-center gap-2">
                  <AlertCircle className="h-4 w-4 text-primary" />
                  Key Findings
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm">
                {safetyScore.warnings.length === 0 ? (
                  <div className="rounded-lg bg-primary/5 p-3">
                    <p className="font-semibold text-foreground">All Clear</p>
                    <p className="text-xs text-muted-foreground mt-1">No significant interactions detected</p>
                  </div>
                ) : (
                  safetyScore.warnings.map((warning, idx) => (
                    <div
                      key={idx}
                      className={`rounded-lg p-3 ${
                        warning.severity === "critical"
                          ? "bg-red-50 dark:bg-red-950/20"
                          : "bg-yellow-50 dark:bg-yellow-950/20"
                      }`}
                    >
                      <p
                        className={`font-semibold text-xs ${
                          warning.severity === "critical"
                            ? "text-red-800 dark:text-red-200"
                            : "text-yellow-800 dark:text-yellow-200"
                        }`}
                      >
                        {warning.severity === "critical" ? "Critical" : "Warning"}
                      </p>
                      <p
                        className={`text-xs mt-1 ${
                          warning.severity === "critical"
                            ? "text-red-700 dark:text-red-300"
                            : "text-yellow-700 dark:text-yellow-300"
                        }`}
                      >
                        {warning.message}
                      </p>
                    </div>
                  ))
                )}
              </CardContent>
            </Card>

            {/* Share and Download Buttons */}
            <div className="space-y-2">
              <Dialog>
                <DialogTrigger asChild>
                  <Button variant="outline" className="w-full justify-start bg-transparent">
                    <Share2 className="h-4 w-4 mr-2" />
                    Share with Doctor
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Share Health Report with Doctor</DialogTitle>
                    <DialogDescription>Choose how to share your health information</DialogDescription>
                  </DialogHeader>
                  <div className="space-y-3">
                    <Button onClick={handleShareWithDoctor} className="w-full bg-primary hover:bg-primary/90">
                      <Mail className="h-4 w-4 mr-2" />
                      Send via Email
                    </Button>
                    <Button onClick={handleCopyReport} variant="outline" className="w-full bg-transparent">
                      <Copy className="h-4 w-4 mr-2" />
                      {reportCopied ? "Copied to Clipboard!" : "Copy to Clipboard"}
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>

              <Button onClick={downloadReport} variant="outline" className="w-full justify-start bg-transparent">
                <Download className="h-4 w-4 mr-2" />
                Download Report
              </Button>
            </div>
          </div>
        </div>

        {/* Disclaimer */}
        <div className="mt-6 rounded-lg border border-border bg-secondary/30 p-4">
          <div className="flex gap-3">
            <AlertCircle className="h-5 w-5 flex-shrink-0 text-muted-foreground mt-0.5" />
            <div className="text-sm text-muted-foreground">
              <p className="font-semibold text-foreground">Medical Disclaimer</p>
              <p className="mt-1">
                This analysis is for informational purposes only and should not replace professional medical advice.
                Always consult your healthcare provider before making changes to your medications.
              </p>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}
