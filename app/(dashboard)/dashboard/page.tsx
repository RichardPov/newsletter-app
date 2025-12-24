
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Activity, CalendarDays, Clock, Linkedin, Sparkles, Twitter, CheckCircle2, ArrowRight } from "lucide-react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import Link from "next/link"
import { cn } from "@/lib/utils"
import { auth } from "@clerk/nextjs/server"
import { prisma } from "@/lib/db"
import { Button } from "@/components/ui/button"

export default async function DashboardPage() {
    const { userId } = await auth()
    if (!userId) return null

    // Fetch data for Getting Started logic
    const activeFeedsCount = await prisma.feed.count({
        where: { userId, isActive: true }
    })
    const generatedPostsCount = await prisma.post.count({
        where: { userId }
    })
    const scheduledPostsCount = await prisma.post.count({
        where: { userId, status: "SCHEDULED" }
    })

    const steps = [
        {
            id: 1,
            title: "Select Segments",
            description: "Choose content sources",
            href: "/dashboard/discover",
            isCompleted: activeFeedsCount > 0,
            cta: "Select Segments"
        },
        {
            id: 2,
            title: "Generate Content",
            description: "Create AI posts",
            href: "/dashboard/articles",
            isCompleted: generatedPostsCount > 0,
            cta: "Generate Now"
        },
        {
            id: 3,
            title: "Schedule",
            description: "Plan your calendar",
            href: "/dashboard/schedule",
            isCompleted: scheduledPostsCount > 0,
            cta: "Go to Planner"
        }
    ]

    return (
        <div className="flex-1 space-y-4">
            <div className="flex items-center justify-between space-y-2">
                <h2 className="text-3xl font-bold tracking-tight">Overview</h2>
            </div>
            <Tabs defaultValue="overview" className="space-y-4">
                <TabsList>
                    <TabsTrigger value="overview">Overview</TabsTrigger>
                    {/* <TabsTrigger value="analytics">Analytics</TabsTrigger> */}
                </TabsList>
                <TabsContent value="overview" className="space-y-4">
                    {/* Getting Started - Interactive Widget */}
                    <div className="grid gap-4 md:grid-cols-1 lg:grid-cols-1">
                        <Card className="col-span-full border-blue-500/50 bg-blue-50/50 dark:bg-blue-950/10 dark:border-blue-500/30">
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2 text-blue-900 dark:text-blue-100">
                                    <Sparkles className="h-5 w-5 text-blue-600" />
                                    Getting Started
                                </CardTitle>
                                <CardDescription className="text-blue-700/80 dark:text-blue-300/80">
                                    Complete these steps to automate your social media growth.
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                    {steps.map((step) => (
                                        <div key={step.id} className={cn(
                                            "flex flex-col gap-3 p-4 rounded-lg border transition-all h-full",
                                            step.isCompleted
                                                ? "bg-emerald-50/50 border-emerald-100 dark:bg-emerald-900/10 dark:border-emerald-900/50"
                                                : "bg-blue-50/50 border-blue-100 dark:bg-blue-900/10 dark:border-blue-800 shadow-sm"
                                        )}>
                                            <div className="flex items-center justify-between">
                                                <div className="flex items-center gap-2">
                                                    <div className={cn(
                                                        "h-6 w-6 rounded-full flex items-center justify-center text-xs font-bold",
                                                        step.isCompleted
                                                            ? "bg-emerald-500 text-white"
                                                            : "bg-blue-600 text-white shadow-sm"
                                                    )}>
                                                        {step.isCompleted ? <CheckCircle2 className="h-4 w-4" /> : step.id}
                                                    </div>
                                                    <span className={cn(
                                                        "font-medium",
                                                        step.isCompleted ? "text-emerald-800 dark:text-emerald-400" : "text-blue-900 dark:text-blue-100"
                                                    )}>{step.title}</span>
                                                </div>
                                            </div>

                                            <p className="text-xs text-muted-foreground">{step.description}</p>

                                            {!step.isCompleted ? (
                                                <Button size="sm" className="w-full bg-blue-600 hover:bg-blue-700 text-white shadow-none mt-auto" asChild>
                                                    <Link href={step.href}>
                                                        {step.cta}
                                                        <ArrowRight className="ml-2 h-3 w-3" />
                                                    </Link>
                                                </Button>
                                            ) : (
                                                <div className="mt-auto flex items-center text-xs text-emerald-600 font-medium pt-2">
                                                    <CheckCircle2 className="mr-1 h-3 w-3" />
                                                    Completed
                                                </div>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Metrics */}
                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">
                                    Generated Posts
                                </CardTitle>
                                <Sparkles className="h-4 w-4 text-emerald-500" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">12</div>
                                <p className="text-xs text-muted-foreground">
                                    +4 this week
                                </p>
                            </CardContent>
                        </Card>
                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">
                                    Scheduled
                                </CardTitle>
                                <CalendarDays className="h-4 w-4 text-blue-500" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">8</div>
                                <p className="text-xs text-muted-foreground">
                                    Upcoming posts
                                </p>
                            </CardContent>
                        </Card>
                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">Time Saved</CardTitle>
                                <Clock className="h-4 w-4 text-orange-500" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">4.5h</div>
                                <p className="text-xs text-muted-foreground">
                                    Estimated this month
                                </p>
                            </CardContent>
                        </Card>
                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">
                                    Active Segments
                                </CardTitle>
                                <Activity className="h-4 w-4 text-purple-500" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">3</div>
                                <p className="text-xs text-muted-foreground">
                                    Feeds monitored
                                </p>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Bottom Section */}
                    <div className="grid gap-4 md:grid-cols-1 lg:grid-cols-2">
                        <Card className="col-span-1">
                            <CardHeader>
                                <CardTitle>Next Scheduled</CardTitle>
                                <CardDescription>
                                    Coming up in your calendar
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-4">
                                    {/* Mock Data */}
                                    <div className="flex items-center border p-3 rounded-lg bg-slate-50 dark:bg-slate-900/50">
                                        <div className="h-8 w-8 rounded bg-blue-100 text-blue-600 flex items-center justify-center mr-3">
                                            <Linkedin className="h-4 w-4" />
                                        </div>
                                        <div>
                                            <p className="text-sm font-medium">AI Trends in 2025</p>
                                            <p className="text-xs text-muted-foreground">Tomorrow, 9:00 AM</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center border p-3 rounded-lg bg-slate-50 dark:bg-slate-900/50">
                                        <div className="h-8 w-8 rounded bg-black text-white flex items-center justify-center mr-3">
                                            <Twitter className="h-4 w-4" />
                                        </div>
                                        <div>
                                            <p className="text-sm font-medium">SaaS Growth Hacks</p>
                                            <p className="text-xs text-muted-foreground">Wed, 2:00 PM</p>
                                        </div>
                                    </div>
                                    <div className="text-center pt-2">
                                        <Link href="/dashboard/schedule" className="text-sm text-emerald-600 hover:underline">
                                            View full planner →
                                        </Link>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                        <Card className="col-span-1">
                            <CardHeader>
                                <CardTitle>Recent Activity</CardTitle>
                                <CardDescription>
                                    Your latest generations
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-8">
                                    <div className="flex items-center">
                                        <div className="ml-auto font-medium text-sm text-muted-foreground">Just now</div>
                                    </div>
                                    <p className="text-sm text-muted-foreground text-center py-8">
                                        No recent activity. Start by generating a post!
                                    </p>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </TabsContent>
            </Tabs>
        </div>
    )
}
