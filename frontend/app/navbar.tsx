"use client"

import Link from "next/link"
import { Menu, X } from "lucide-react"
import { useState } from "react"

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <nav className="border-b border-border bg-background sticky top-0 z-50">
      <div className="mx-auto max-w-7xl px-6 py-4 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 font-bold text-lg text-primary">
          <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center text-white text-sm font-bold">
            Q
          </div>
          QuraAI
        </Link>

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center gap-8">
          <Link href="/dashboard" className="text-sm text-muted-foreground hover:text-foreground transition">
            Dashboard
          </Link>
          <Link href="/medicines" className="text-sm text-muted-foreground hover:text-foreground transition">
            Medicines
          </Link>
          <Link href="/reports" className="text-sm text-muted-foreground hover:text-foreground transition">
            Reports
          </Link>
          <Link href="/risk-check" className="text-sm text-muted-foreground hover:text-foreground transition">
            Risk Check
          </Link>
          <Link href="/profile" className="text-sm text-muted-foreground hover:text-foreground transition">
            Profile
          </Link>
        </div>

        {/* Mobile Menu Button */}
        <button className="md:hidden" onClick={() => setIsOpen(!isOpen)}>
          {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden border-t border-border bg-secondary p-4 space-y-2">
          <Link
            href="/dashboard"
            className="block text-sm text-muted-foreground hover:text-foreground transition p-2"
            onClick={() => setIsOpen(false)}
          >
            Dashboard
          </Link>
          <Link
            href="/medicines"
            className="block text-sm text-muted-foreground hover:text-foreground transition p-2"
            onClick={() => setIsOpen(false)}
          >
            Medicines
          </Link>
          <Link
            href="/reports"
            className="block text-sm text-muted-foreground hover:text-foreground transition p-2"
            onClick={() => setIsOpen(false)}
          >
            Reports
          </Link>
          <Link
            href="/risk-check"
            className="block text-sm text-muted-foreground hover:text-foreground transition p-2"
            onClick={() => setIsOpen(false)}
          >
            Risk Check
          </Link>
          <Link
            href="/profile"
            className="block text-sm text-muted-foreground hover:text-foreground transition p-2"
            onClick={() => setIsOpen(false)}
          >
            Profile
          </Link>
        </div>
      )}
    </nav>
  )
}
