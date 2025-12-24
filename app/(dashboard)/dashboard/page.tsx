
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Activity, CalendarDays, Clock, Linkedin, Sparkles, Twitter, CheckCircle2, ArrowRight } from "lucide-react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import Link from "next/link"
import { cn } from "@/lib/utils"
import { auth } from "@clerk/nextjs/server"
import { prisma } from "@/lib/db"
import { Button } from "@/components/ui/button"

import { format } from "date-fns"

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

    // Fetch Upcoming Posts
    const upcomingPosts = await prisma.post.findMany({
        where: {
            userId,
            status: "SCHEDULED",
            scheduledFor: {
                gte: new Date()
            }
        },
        orderBy: {
            scheduledFor: "asc"
        },
        take: 3
    })

    // Fetch Recent Activity (latest posts created/updated)
    const recentPosts = await prisma.post.findMany({
        where: { userId },
        orderBy: { createdAt: "desc" },
        take: 5,
        include: { article: true } // To show source article title if available
    })

    const timeSavedHours = (generatedPostsCount * 0.5).toFixed(1) // Assume 30 mins per post

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
                <TabsContent value="overview" className="space-y-4">
                    {/* Getting Started - Interactive Widget */}
                    <div className="grid gap-4 md:grid-cols-1 lg:grid-cols-1">
                        <Card className="col-span-full border-blue-100 bg-blue-50/30 dark:bg-blue-950/10 dark:border-blue-900/30">
                            <CardHeader className="pb-4">
                                <div className="flex items-center gap-2">
                                    <Sparkles className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                                    <CardTitle className="text-xl text-blue-950 dark:text-blue-50">Getting Started</CardTitle>
                                </div>
                                <CardDescription className="text-blue-800/70 dark:text-blue-300/70">
                                    Complete these steps to set up your automated workflow.
                                </CardDescription>
                            </CardHeader>

                            <CardContent>
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                    {steps.map((step) => (
                                        <div key={step.id} className={cn(
                                            "relative flex flex-col gap-4 p-5 rounded-xl border transition-all h-full",
                                            step.isCompleted
                                                ? "border-emerald-100 bg-emerald-50/50 dark:bg-emerald-950/20 dark:border-emerald-900/30 opacity-80"
                                                : "border-blue-100/50 bg-white shadow-sm hover:shadow-md dark:bg-neutral-900 dark:border-neutral-800"
                                        )}>
                                            <div className="flex items-center justify-between">
                                                <div className={cn(
                                                    "h-10 w-10 rounded-lg flex items-center justify-center text-sm font-bold transition-colors",
                                                    step.isCompleted
                                                        ? "bg-emerald-100 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400"
                                                        : "bg-blue-50 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400"
                                                )}>
                                                    {step.isCompleted ? <CheckCircle2 className="h-5 w-5" /> : step.id}
                                                </div>
                                                {step.isCompleted && (
                                                    <Badge variant="secondary" className="bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400 hover:bg-emerald-100 border-none">
                                                        Done
                                                    </Badge>
                                                )}
                                            </div>

                                            <div className="space-y-1">
                                                <h4 className={cn("font-semibold", step.isCompleted ? "text-muted-foreground" : "text-foreground")}>
                                                    {step.title}
                                                </h4>
                                                <p className="text-xs text-muted-foreground leading-relaxed line-clamp-2">
                                                    {step.description}
                                                </p>
                                            </div>

                                            {!step.isCompleted ? (
                                                <Button size="sm" className="w-full bg-blue-600 hover:bg-blue-700 text-white shadow-sm mt-auto h-9" asChild>
                                                    <Link href={step.href}>
                                                        {step.cta}
                                                        <ArrowRight className="ml-2 h-3 w-3 opacity-70" />
                                                    </Link>
                                                </Button>
                                            ) : (
                                                <div className="mt-auto h-9 flex items-center text-xs text-emerald-600 font-medium">
                                                    <span className="flex items-center gap-1.5">
                                                        <CheckCircle2 className="h-3.5 w-3.5" />
                                                        Completed
                                                    </span>
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
                                <div className="text-2xl font-bold">{generatedPostsCount}</div>
                                <p className="text-xs text-muted-foreground">
                                    Total generated
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
                                <div className="text-2xl font-bold">{scheduledPostsCount}</div>
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
                                <div className="text-2xl font-bold">{timeSavedHours}h</div>
                                <p className="text-xs text-muted-foreground">
                                    Estimated total
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
                                <div className="text-2xl font-bold">{activeFeedsCount}</div>
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
                                    {upcomingPosts.length === 0 ? (
                                        <p className="text-sm text-muted-foreground text-center py-4">
                                            No upcoming posts scheduled.
                                        </p>
                                    ) : (
                                        upcomingPosts.map((post) => (
                                            <div key={post.id} className="flex items-center border p-3 rounded-lg bg-slate-50 dark:bg-slate-900/50">
                                                <div className={cn(
                                                    "h-8 w-8 rounded flex items-center justify-center mr-3",
                                                    post.platform === "LINKEDIN" ? "bg-blue-100 text-blue-600" : "bg-black text-white"
                                                )}>
                                                    {post.platform === "LINKEDIN" ? <Linkedin className="h-4 w-4" /> : <Twitter className="h-4 w-4" />}
                                                </div>
                                                <div className="overflow-hidden">
                                                    <p className="text-sm font-medium truncate w-[200px] sm:w-[300px]">
                                                        {post.content}
                                                    </p>
                                                    <p className="text-xs text-muted-foreground">
                                                        {post.scheduledFor ? format(post.scheduledFor, "MMM d, h:mm a") : "Scheduled"}
                                                    </p>
                                                </div>
                                            </div>
                                        ))
                                    )}
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
                                <div className="space-y-6">
                                    {recentPosts.length === 0 ? (
                                        <p className="text-sm text-muted-foreground text-center py-8">
                                            No recent activity. Start by generating a post!
                                        </p>
                                    ) : (
                                        recentPosts.map((post) => (
                                            <div key={post.id} className="flex items-center justify-between">
                                                <div className="flex items-center gap-3 overflow-hidden">
                                                    <div className={cn(
                                                        "h-2 w-2 rounded-full flex-shrink-0",
                                                        post.status === "PUBLISHED" ? "bg-emerald-500" :
                                                            post.status === "SCHEDULED" ? "bg-blue-500" : "bg-slate-300"
                                                    )} />
                                                    <div className="flex flex-col overflow-hidden">
                                                        <span className="text-sm font-medium truncate max-w-[250px]">
                                                            {post.article?.title ? `Draft from "${post.article.title}"` : (post.content.slice(0, 30) + "...")}
                                                        </span>
                                                        <span className="text-xs text-muted-foreground capitalize">
                                                            {post.platform.toLowerCase()} • {format(post.createdAt, "MMM d")}
                                                        </span>
                                                    </div>
                                                </div>
                                                <Badge variant="outline" className="ml-2 text-[10px] h-5">
                                                    {post.status}
                                                </Badge>
                                            </div>
                                        ))
                                    )}
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </TabsContent>
            </Tabs>
        </div>
    )
}
