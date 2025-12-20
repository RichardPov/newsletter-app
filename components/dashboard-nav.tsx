"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { LayoutDashboard, Radio, MessageSquare, Newspaper, Share2, Settings, Calendar } from "lucide-react"

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
            href: "/dashboard/feeds",
            title: "RSS Feeds",
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
            title: "Social Generator",
            icon: Share2,
        },
        {
            href: "/dashboard/scheduler",
            title: "Planner",
            icon: Calendar,
        },
        {
            href: "/dashboard/newsletter",
            title: "Newsletter Builder",
            icon: Settings, // Placeholder icon
        },
    ]

    return (
        <nav
            className={cn(
                "flex space-x-2 lg:flex-col lg:space-x-0 lg:space-y-1",
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
    )
}
