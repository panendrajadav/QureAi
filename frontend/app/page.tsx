import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ShieldCheck, Heart, Pill, AlertCircle } from "lucide-react"

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-background via-secondary to-background">
      {/* Hero Section */}
      <div className="mx-auto max-w-7xl px-6 py-20">
        <div className="grid gap-12 lg:grid-cols-2 lg:gap-8 lg:py-20">
          <div className="flex flex-col justify-center space-y-8">
            <div className="space-y-4">
              <h1 className="text-5xl font-bold tracking-tight text-foreground lg:text-6xl">
                Your Personal Drug Safety Guardian
              </h1>
              <p className="text-lg text-muted-foreground">
                QuraAI uses advanced AI to analyze drug interactions, help you track medications, and ensure your health
                safety with personalized recommendations.
              </p>
            </div>
            <div className="flex flex-col gap-3 sm:flex-row">
              <Button asChild size="lg" className="rounded-full">
                <Link href="/auth/signup">Get Started</Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="rounded-full bg-transparent">
                <Link href="/auth/login">Sign In</Link>
              </Button>
            </div>
            <div className="space-y-4 pt-8">
              <p className="text-sm font-medium text-muted-foreground">Trusted by healthcare providers</p>
              <div className="flex flex-wrap gap-4">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="h-5 w-5 text-primary" />
                  <span className="text-sm text-foreground">HIPAA Compliant</span>
                </div>
                <div className="flex items-center gap-2">
                  <ShieldCheck className="h-5 w-5 text-primary" />
                  <span className="text-sm text-foreground">End-to-End Encrypted</span>
                </div>
                <div className="flex items-center gap-2">
                  <ShieldCheck className="h-5 w-5 text-primary" />
                  <span className="text-sm text-foreground">Medical Grade</span>
                </div>
              </div>
            </div>
          </div>
          <div className="flex items-center justify-center">
            <div className="space-y-4 rounded-xl border border-border bg-card p-8 shadow-lg">
              <div className="space-y-4">
                <div className="flex items-center gap-4 rounded-lg bg-secondary p-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                    <Pill className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <p className="font-semibold text-foreground">Medicine Tracking</p>
                    <p className="text-sm text-muted-foreground">Monitor all your medications</p>
                  </div>
                </div>
                <div className="flex items-center gap-4 rounded-lg bg-secondary p-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                    <AlertCircle className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <p className="font-semibold text-foreground">Interaction Alerts</p>
                    <p className="text-sm text-muted-foreground">Real-time safety notifications</p>
                  </div>
                </div>
                <div className="flex items-center gap-4 rounded-lg bg-secondary p-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                    <Heart className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <p className="font-semibold text-foreground">Health Insights</p>
                    <p className="text-sm text-muted-foreground">Personalized recommendations</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="border-t border-border bg-card py-20">
        <div className="mx-auto max-w-7xl px-6">
          <div className="mb-12 text-center">
            <h2 className="mb-4 text-4xl font-bold text-foreground">Why Choose QuraAI?</h2>
            <p className="text-lg text-muted-foreground">Advanced safety features designed for your health</p>
          </div>
          <div className="grid gap-8 md:grid-cols-3">
            <div className="rounded-lg border border-border bg-background p-6">
              <ShieldCheck className="mb-4 h-8 w-8 text-primary" />
              <h3 className="mb-2 text-lg font-semibold text-foreground">Comprehensive Database</h3>
              <p className="text-muted-foreground">
                Access to a massive database of medications and their interactions
              </p>
            </div>
            <div className="rounded-lg border border-border bg-background p-6">
              <Pill className="mb-4 h-8 w-8 text-primary" />
              <h3 className="mb-2 text-lg font-semibold text-foreground">Easy Management</h3>
              <p className="text-muted-foreground">Simple tools to track multiple medications and dosages</p>
            </div>
            <div className="rounded-lg border border-border bg-background p-6">
              <Heart className="mb-4 h-8 w-8 text-primary" />
              <h3 className="mb-2 text-lg font-semibold text-foreground">AI-Powered Insights</h3>
              <p className="text-muted-foreground">Get personalized health recommendations based on your profile</p>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}
