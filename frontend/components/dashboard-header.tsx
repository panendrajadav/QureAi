"use client"
import { Button } from "@/components/ui/button"
import Link from "next/link"

export function DashboardHeader() {
  const handleSignOut = () => {
    window.location.href = "/login"
  }

  return (
    <header className="border-b border-border bg-background sticky top-0 z-40">
      <div className="flex h-16 items-center justify-between px-4 md:px-6">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground font-bold text-sm">
            Q
          </div>
          <span className="text-lg md:text-xl font-bold text-primary hidden sm:inline">QuraAI</span>
        </div>

        <nav className="hidden md:flex gap-1 lg:gap-2">
          <Link href="/dashboard">
            <Button variant="ghost" className="text-sm">
              Dashboard
            </Button>
          </Link>
          <Link href="/medicines">
            <Button variant="ghost" className="text-sm">
              Medicines
            </Button>
          </Link>
          <Link href="/risk-checks">
            <Button variant="ghost" className="text-sm">
              Safety Check
            </Button>
          </Link>
          <Link href="/profile">
            <Button variant="ghost" className="text-sm">
              Profile
            </Button>
          </Link>
        </nav>

        <div className="flex items-center gap-2 md:gap-3">
          <Button variant="ghost" size="sm" onClick={handleSignOut} className="text-sm">
            Sign Out
          </Button>
        </div>
      </div>
    </header>
  )
}
