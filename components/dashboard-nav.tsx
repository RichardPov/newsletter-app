"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { LayoutDashboard, Radio, MessageSquare, Newspaper, Share2, Settings, Calendar, LogOut } from "lucide-react"
import { SignOutButton } from "@clerk/nextjs"

interface DashboardNavProps extends React.HTMLAttributes<HTMLElement> {
    items?: {
        href: string
        title: string
        icon: React.ComponentType<{ className?: string }>
    }[]
}

export function DashboardNav({ className, ...props }: DashboardNavProps) {
    const pathname = usePathname()

    const links = [
        {
            href: "/dashboard",
            title: "Overview",
            icon: LayoutDashboard,
        },
        {
            href: "/dashboard/discover",
            title: "Discover Content",
            icon: Radio,
        },
        {
            href: "/dashboard/tone",
            title: "Tone & Persona",
            icon: MessageSquare,
        },
        {
            href: "/dashboard/articles",
            title: "Article Manager",
            icon: Newspaper,
        },
        {
            href: "/dashboard/social",
            title: "Saved Drafts",
            icon: Share2,
        },
        {
            href: "/dashboard/schedule",
            title: "Planner",
            icon: Calendar,
        },
        {
            href: "/dashboard/newsletter",
            title: "Newsletter Builder",
            icon: Settings, // Placeholder icon
        },
        {
            href: "/onboarding",
            title: "Onboard your Voice",
            icon: MessageSquare, // Reusing icon or new one
        },
    ]

    return (
        <div className="flex flex-col h-full">
            <nav
                className={cn(
                    "flex flex-col space-y-1",
                    className
                )}
                {...props}
            >
                {links.map((item) => (
                    <Button
                        key={item.href}
                        variant={pathname === item.href ? "secondary" : "ghost"}
                        className={cn("justify-start", pathname === item.href && "bg-muted")}
                        asChild
                    >
                        <Link href={item.href}>
                            <item.icon className="mr-2 h-4 w-4" />
                            {item.title}
                        </Link>
                    </Button>
                ))}
            </nav>

            <div className="flex flex-col space-y-1 pt-4 border-t mt-auto mb-4">
                <Button
                    variant={pathname === "/dashboard/settings" ? "secondary" : "ghost"}
                    className={cn("justify-start", pathname === "/dashboard/settings" && "bg-muted")}
                    asChild
                >
                    <Link href="/dashboard/settings">
                        <Settings className="mr-2 h-4 w-4" />
                        Settings
                    </Link>
                </Button>

                <SignOutButton>
                    <Button
                        variant="ghost"
                        className="justify-start text-red-500 hover:text-red-600 hover:bg-red-50"
                    >
                        <LogOut className="mr-2 h-4 w-4" />
                        Log out
                    </Button>
                </SignOutButton>
            </div>
        </div>
    )
}
