"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { ShieldCheck } from "lucide-react"
import { Button } from "@/components/ui/button"

export function Navbar() {
  const pathname = usePathname()

  const isAuthPage = pathname === "/" || pathname === "/auth/login" || pathname === "/auth/signup"
  const isLoggedIn =
    pathname.startsWith("/dashboard") ||
    pathname === "/profile" ||
    pathname === "/medicines" ||
    pathname === "/risk-check" ||
    pathname === "/reports" ||
    pathname === "/daily-feedback"

  if (isAuthPage && pathname !== "/dashboard") {
    return (
      <nav className="border-b border-border bg-card">
        <div className="flex items-center justify-between px-6 py-4">
          <Link href="/" className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
              <ShieldCheck className="h-5 w-5 text-primary-foreground" />
            </div>
            <span className="text-xl font-bold text-foreground">QuraAI</span>
          </Link>
          <div className="flex gap-3">
            <Button variant="ghost" asChild>
              <Link href="/auth/login">Log In</Link>
            </Button>
            <Button asChild>
              <Link href="/auth/signup">Sign Up</Link>
            </Button>
          </div>
        </div>
      </nav>
    )
  }

  if (isLoggedIn) {
    return (
      <nav className="border-b border-border bg-card">
        <div className="flex items-center justify-between px-6 py-4">
          <Link href="/dashboard" className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
              <ShieldCheck className="h-5 w-5 text-primary-foreground" />
            </div>
            <span className="text-xl font-bold text-foreground">QuraAI</span>
          </Link>
          <div className="flex items-center gap-6">
            <Link
              href="/dashboard"
              className={`text-sm font-medium transition-colors ${
                pathname === "/dashboard" ? "text-primary" : "text-muted-foreground hover:text-foreground"
              }`}
            >
              Dashboard
            </Link>
            <Link
              href="/medicines"
              className={`text-sm font-medium transition-colors ${
                pathname === "/medicines" ? "text-primary" : "text-muted-foreground hover:text-foreground"
              }`}
            >
              Medicines
            </Link>
            <Link
              href="/reports"
              className={`text-sm font-medium transition-colors ${
                pathname === "/reports" ? "text-primary" : "text-muted-foreground hover:text-foreground"
              }`}
            >
              Reports
            </Link>
            <Link
              href="/risk-check"
              className={`text-sm font-medium transition-colors ${
                pathname === "/risk-check" ? "text-primary" : "text-muted-foreground hover:text-foreground"
              }`}
            >
              Risk Checks
            </Link>
            <Link
              href="/profile"
              className={`text-sm font-medium transition-colors ${
                pathname === "/profile" ? "text-primary" : "text-muted-foreground hover:text-foreground"
              }`}
            >
              Profile
            </Link>
            <Button variant="ghost" size="sm" asChild>
              <Link href="/auth/login">Sign Out</Link>
            </Button>
          </div>
        </div>
      </nav>
    )
  }

  return null
}
