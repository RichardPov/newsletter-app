"use client"

import { useState } from "react"
import { Calendar } from "@/components/ui/calendar"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { format, isSameDay, isSameMonth, parseISO } from "date-fns"
import { ScheduleList } from "@/components/schedule-list"
import { cn } from "@/lib/utils"
import { Linkedin, Twitter, Filter, CalendarDays, List } from "lucide-react"

interface PlannerLayoutProps {
    posts: any[]
}

export function PlannerLayout({ posts }: PlannerLayoutProps) {
    const [date, setDate] = useState<Date | undefined>(new Date())
    const [view, setView] = useState<"calendar" | "list">("list") // Keeping list as default per user screenshot preference, but enhanced

    // Get dates that have posts
    const activeDates = posts
        .filter(p => p.scheduledFor)
        .map(p => new Date(p.scheduledFor))

    // Filter posts based on selected date (if any)
    // If no date selected, show all? Or just upcoming? 
    // Screenshot shows "June 2036" list. 
    // Let's show all posts for the Selected Month if a date is picked, or specific day if double clicked?
    // Start with: specific day if picked, otherwise all upcoming.

    const relevantPosts = date
        ? posts.filter(p => p.scheduledFor && isSameDay(new Date(p.scheduledFor), date))
        : posts

    // Grouping for the "List" view (Right side)
    // Actually, if we follow the screenshot, the left is calendar, right is list of ALL posts for that month/period.
    // Let's filter by the selected Month of the Calendar.

    const filteredPosts = posts.filter(p => {
        if (!date) return true
        if (!p.scheduledFor) return true // Always show drafts?
        // Show posts in the same month as selected date
        return isSameMonth(new Date(p.scheduledFor), date) || !p.scheduledFor
    })

    return (
        <div className="flex flex-col lg:flex-row gap-8 h-[calc(100vh-100px)]">
            {/* Sidebar Calendar */}
            <div className="w-full lg:w-80 flex-shrink-0 space-y-6">
                <Card className="border-none shadow-none bg-transparent lg:bg-white lg:dark:bg-neutral-900 lg:border lg:shadow-sm">
                    <CardContent className="p-0 lg:p-4">
                        <Calendar
                            mode="single"
                            selected={date}
                            onSelect={setDate}
                            className="rounded-md w-full flex justify-center"
                            modifiers={{
                                hasPost: activeDates
                            }}
                            modifiersStyles={{
                                hasPost: {
                                    fontWeight: 'bold',
                                    textDecoration: 'underline',
                                    color: 'var(--primary)'
                                }
                            }}
                        />
                    </CardContent>
                </Card>

                {/* Filters / Stats */}
                <div className="hidden lg:block space-y-4 px-1">
                    <h3 className="font-semibold text-sm text-muted-foreground flex items-center gap-2">
                        <Filter className="h-4 w-4" /> Filters
                    </h3>
                    <div className="space-y-2">
                        <div className="flex items-center justify-between text-sm p-2 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded-md cursor-pointer transition-colors">
                            <div className="flex items-center gap-2">
                                <Linkedin className="h-4 w-4 text-blue-600" />
                                <span>LinkedIn</span>
                            </div>
                            <Badge variant="secondary" className="bg-neutral-100 dark:bg-neutral-800">
                                {posts.filter(p => p.platform === "LINKEDIN").length}
                            </Badge>
                        </div>
                        <div className="flex items-center justify-between text-sm p-2 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded-md cursor-pointer transition-colors">
                            <div className="flex items-center gap-2">
                                <Twitter className="h-4 w-4 text-black dark:text-white" />
                                <span>X (Twitter)</span>
                            </div>
                            <Badge variant="secondary" className="bg-neutral-100 dark:bg-neutral-800">
                                {posts.filter(p => p.platform === "TWITTER").length}
                            </Badge>
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Content: List View grouped by Date */}
            <div className="flex-1 min-w-0 flex flex-col">
                <div className="flex items-center justify-between mb-6">
                    <div>
                        <h2 className="text-2xl font-bold tracking-tight">
                            {date ? format(date, "MMMM yyyy") : "All Posts"}
                        </h2>
                        <p className="text-muted-foreground">
                            {filteredPosts.length} posts planned
                        </p>
                    </div>
                    <div className="flex gap-2 bg-neutral-100 dark:bg-neutral-800 p-1 rounded-lg">
                        <Button
                            variant="ghost"
                            size="sm"
                            className={cn("h-8 rounded-md bg-white shadow-sm dark:bg-neutral-900")}
                        >
                            <List className="h-4 w-4 mr-2" /> List
                        </Button>
                        <Button
                            variant="ghost"
                            size="sm"
                            className="h-8 rounded-md text-muted-foreground"
                            disabled
                        >
                            <CalendarDays className="h-4 w-4 mr-2" /> Month
                        </Button>
                    </div>
                </div>

                <ScrollArea className="flex-1 -mx-4 px-4">
                    <ScheduleList initialPosts={filteredPosts} />
                </ScrollArea>
            </div>
        </div>
    )
}
