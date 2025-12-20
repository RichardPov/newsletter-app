import { DashboardNav } from "@/components/dashboard-nav"
import { ModeToggle } from "@/components/mode-toggle"
import { UserNav } from "@/components/user-nav"
import { ScrollArea } from "@/components/ui/scroll-area" // Assuming ScrollArea exists or div fallback
import { Separator } from "@/components/ui/separator"

import { auth } from "@clerk/nextjs/server"
import { redirect } from "next/navigation"
import { prisma } from "@/lib/db"

export default async function DashboardLayout({
    children,
}: {
    children: React.ReactNode
}) {
    const { userId } = await auth()

    if (userId) {
        const user = await prisma.user.findUnique({
            where: { id: userId },
            select: { onboardingCompleted: true }
        })

        // If user exists but hasn't completed onboarding, force them there
        // (Only if user exists - if not syncUser webhook hasn't run yet, but let's assume it has or we handle it gracefully)
        if (user && !user.onboardingCompleted) {
            redirect("/onboarding")
        }
    }
    return (
        <div className="flex h-screen overflow-hidden bg-background">
            {/* Sidebar - Hidden on mobile, usually handled by Sheet for mobile but for MVP basic hidden */}
            <aside className="hidden w-64 flex-col border-r lg:flex">
                <div className="flex h-14 items-center border-b px-6">
                    <span className="text-lg font-bold">NewsWeave</span>
                </div>
                <div className="flex-1 overflow-auto py-4">
                    {/* Add a wrapper or just use nav directly */}
                    <div className="px-4">
                        <DashboardNav />
                    </div>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex flex-1 flex-col overflow-hidden">
                <header className="flex h-14 items-center gap-4 border-b bg-muted/40 px-6 lg:h-[60px]">
                    <div className="w-full flex-1">
                        {/* Breadcrumb or Search could go here */}
                        {/* For now just placeholder space */}
                    </div>
                    <ModeToggle />
                    <UserNav />
                </header>
                <div className="flex-1 overflow-auto p-6">
                    {children}
                </div>
            </main>
        </div>
    )
}
