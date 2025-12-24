"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Activity, CalendarDays, Clock, Linkedin, Sparkles, Twitter } from "lucide-react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import Link from "next/link"

export default function DashboardPage() {
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
                    {/* Getting Started - Onboarding Highlight */}
                    <div className="grid gap-4 md:grid-cols-1 lg:grid-cols-1">
                        <Card className="col-span-full border-emerald-500/50 bg-emerald-50/50 dark:bg-emerald-950/10 dark:border-emerald-500/30">
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2 text-emerald-800 dark:text-emerald-400">
                                    <Sparkles className="h-5 w-5" />
                                    Getting Started
                                </CardTitle>
                                <CardDescription className="text-emerald-700/80 dark:text-emerald-500/80">
                                    Complete these steps to automate your social media growth.
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="grid gap-6 md:grid-cols-3 pt-2">
                                    <div className="relative pl-6 border-l-2 border-emerald-200 dark:border-emerald-800">
                                        <div className="absolute -left-[9px] top-0 h-4 w-4 rounded-full bg-emerald-500 ring-4 ring-white dark:ring-slate-950" />
                                        <h3 className="font-semibold text-sm">1. Select Segments</h3>
                                        <p className="text-sm text-muted-foreground mt-1">
                                            Choose topics like Tech, Business or Design in <Link href="/dashboard/discover" className="underline decoration-emerald-500/30 hover:decoration-emerald-500">Discover tab</Link>.
                                        </p>
                                    </div>
                                    <div className="relative pl-6 border-l-2 border-slate-200 dark:border-slate-800">
                                        <div className="absolute -left-[9px] top-0 h-4 w-4 rounded-full bg-slate-200 dark:bg-slate-800 border-2 border-white dark:border-slate-950" />
                                        <h3 className="font-semibold text-sm">2. Generate Content</h3>
                                        <p className="text-sm text-muted-foreground mt-1">
                                            Go to Articles, pick a story, and click "Generate Post".
                                        </p>
                                    </div>
                                    <div className="relative pl-6 border-l-2 border-slate-200 dark:border-slate-800">
                                        <div className="absolute -left-[9px] top-0 h-4 w-4 rounded-full bg-slate-200 dark:bg-slate-800 border-2 border-white dark:border-slate-950" />
                                        <h3 className="font-semibold text-sm">3. Schedule</h3>
                                        <p className="text-sm text-muted-foreground mt-1">
                                            Review your generated posts and drag them to your Calendar.
                                        </p>
                                    </div>
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
