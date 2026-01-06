"use client"

import { Button } from "@/components/ui/button"
import Link from "next/link"

export function LandingHero() {
  return (
    <section className="min-h-[calc(100vh-4rem)] flex items-center justify-center px-4 py-12 md:py-0">
      <div className="w-full max-w-6xl grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 items-center">
        {/* Left Content */}
        <div className="flex flex-col justify-center">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-6 leading-tight text-balance">
            Your Personal Drug Safety Guardian
          </h1>

          <p className="text-lg text-muted-foreground mb-8 text-balance leading-relaxed">
            QuraAI uses advanced AI to analyze drug interactions, help you track medications, and ensure your health
            safety with personalized recommendations.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 mb-8">
            <Button size="lg" asChild>
              <Link href="/signup">Get Started</Link>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <Link href="#learn">Learn More</Link>
            </Button>
          </div>

          {/* Trust Indicators */}
          <div className="flex flex-wrap gap-6 items-center text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded-full bg-primary flex items-center justify-center">
                <svg className="w-3 h-3 text-primary-foreground" fill="currentColor" viewBox="0 0 20 20">
                  <path
                    fillRule="evenodd"
                    d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <span>HIPAA Compliant</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded-full bg-primary flex items-center justify-center">
                <svg className="w-3 h-3 text-primary-foreground" fill="currentColor" viewBox="0 0 20 20">
                  <path
                    fillRule="evenodd"
                    d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <span>End-to-End Encrypted</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded-full bg-primary flex items-center justify-center">
                <svg className="w-3 h-3 text-primary-foreground" fill="currentColor" viewBox="0 0 20 20">
                  <path
                    fillRule="evenodd"
                    d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <span>Medical Grade</span>
            </div>
          </div>
        </div>

        {/* Right Hero Section */}
        <div className="relative">
          <div className="bg-gradient-to-b from-primary to-accent rounded-2xl p-8 md:p-12 text-primary-foreground shadow-lg">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">Welcome to QuraAI</h2>
            <p className="text-lg mb-8 opacity-90 leading-relaxed">
              Take control of your health with AI-powered drug interaction checking and personalized medicine tracking.
            </p>

            <div className="space-y-4">
              <div className="bg-primary/20 backdrop-blur rounded-xl p-4 border border-primary/30">
                <h3 className="font-semibold mb-2">Medicine Tracking</h3>
                <p className="text-sm opacity-85">Monitor all your medications in one place</p>
              </div>

              <div className="bg-primary/20 backdrop-blur rounded-xl p-4 border border-primary/30">
                <h3 className="font-semibold mb-2">Interaction Alerts</h3>
                <p className="text-sm opacity-85">Real-time safety notifications</p>
              </div>

              <div className="bg-primary/20 backdrop-blur rounded-xl p-4 border border-primary/30">
                <h3 className="font-semibold mb-2">Health Insights</h3>
                <p className="text-sm opacity-85">Personalized recommendations</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
