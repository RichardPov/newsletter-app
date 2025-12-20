import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function LandingLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <div className="flex min-h-screen flex-col bg-white text-slate-900 dark:bg-white dark:text-slate-900">
            {/* Navbar - Forced Light Theme Styles */}
            <header className="sticky top-0 z-40 w-full border-b bg-white/80 backdrop-blur-md">
                <div className="container mx-auto flex h-16 items-center justify-between px-4">
                    <div className="flex items-center gap-2">
                        <span className="text-xl font-bold tracking-tight text-slate-900">NewsWeave</span>
                    </div>
                    <nav className="hidden gap-6 md:flex">
                        <Link href="#features" className="text-sm font-medium hover:underline">
                            Features
                        </Link>
                        <Link href="#pricing" className="text-sm font-medium hover:underline">
                            Pricing
                        </Link>
                        <Link href="#about" className="text-sm font-medium hover:underline">
                            About
                        </Link>
                    </nav>
                    <div className="flex items-center gap-4">
                        <Button variant="ghost" asChild className="text-slate-600 hover:text-emerald-600 hover:bg-emerald-50 rounded-full">
                            <Link href="/login">Log in</Link>
                        </Button>
                        <Button className="bg-emerald-500 hover:bg-emerald-600 text-white rounded-full px-6 shadow-md shadow-emerald-100" asChild>
                            <Link href="/dashboard">Get Started</Link>
                        </Button>
                    </div>
                </div>
            </header>
            <main className="flex-1">
                {children}
            </main>
            <footer className="border-t py-6 md:py-0">
                <div className="container mx-auto flex flex-col items-center justify-between gap-4 md:h-24 md:flex-row px-4">
                    <p className="text-center text-sm leading-loose text-slate-600 md:text-left">
                        © 2024 NewsWeave. Built for curators.
                    </p>
                    <div className="flex gap-4 text-sm text-slate-600">
                        <Link href="/onboarding" className="hover:text-emerald-600 hover:underline">
                            Onboarding Demo
                        </Link>
                    </div>
                </div>
            </footer>
        </div>
    )
}
