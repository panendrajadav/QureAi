import { Header } from "@/components/header"
import { LandingHero } from "@/components/landing-hero"
import { FeaturesSection } from "@/components/features-section"
import { Footer } from "@/components/footer"

export default function Home() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <LandingHero />
      <FeaturesSection />
      <Footer />
    </div>
  )
}
