import Link from "next/link"
import { Button } from "@/components/ui/button"

export function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="flex h-16 items-center justify-between px-4 md:px-6">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground font-bold">
            Q
          </div>
          <span className="text-xl font-bold text-primary">QuraAI</span>
        </div>

        <nav className="hidden md:flex gap-6 flex-1 ml-8">
          <Link href="#features" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
            Features
          </Link>
          <Link href="#security" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
            Security
          </Link>
          <Link href="#faq" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
            About
          </Link>
        </nav>

        <div className="flex items-center gap-3">
          <Button variant="ghost" size="sm" asChild>
            <Link href="/login">Log In</Link>
          </Button>
          <Button size="sm" asChild>
            <Link href="/signup">Sign Up</Link>
          </Button>
        </div>
      </div>
    </header>
  )
}
