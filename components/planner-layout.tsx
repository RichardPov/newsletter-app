"use client"

import { useState } from "react"
import {
    format,
    startOfMonth,
    endOfMonth,
    eachDayOfInterval,
    startOfWeek,
    endOfWeek,
    isSameMonth,
    isSameDay,
    addMonths,
    subMonths,
    isToday
} from "date-fns"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle
} from "@/components/ui/dialog"
import {
    ChevronLeft,
    ChevronRight,
    Calendar as CalendarIcon,
    List as ListIcon,
    Linkedin,
    Twitter,
    Plus,
    MoreHorizontal
} from "lucide-react"
import { cn } from "@/lib/utils"
import { SocialFeed } from "@/components/social-feed" // Fallback/List view
import { ScheduleList } from "@/components/schedule-list"
import { EditPostDialog } from "@/components/edit-post-dialog"
import { updatePost, deletePost } from "@/lib/social-actions"
import { toast } from "sonner"

interface PlannerLayoutProps {
    posts: any[]
}

export function PlannerLayout({ posts }: PlannerLayoutProps) {
    const [currentDate, setCurrentDate] = useState(new Date())
    const [view, setView] = useState<"calendar" | "list">("calendar")
    const [editingPost, setEditingPost] = useState<any | null>(null)
    const [selectedDay, setSelectedDay] = useState<Date | null>(null)

    // Calendar Calculations
    const monthStart = startOfMonth(currentDate)
    const monthEnd = endOfMonth(currentDate)
    const calendarStart = startOfWeek(monthStart, { weekStartsOn: 1 })
    const calendarEnd = endOfWeek(monthEnd, { weekStartsOn: 1 })

    const calendarDays = eachDayOfInterval({
        start: calendarStart,
        end: calendarEnd
    })

    const weekDays = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]

    // Actions
    const nextMonth = () => setCurrentDate(addMonths(currentDate, 1))
    const prevMonth = () => setCurrentDate(subMonths(currentDate, 1))
    const jumpToToday = () => setCurrentDate(new Date())

    const handlePostUpdate = (updatedPost: any) => {
        window.location.reload()
    }

    // Get posts for the selected day dialog
    const selectedDayPosts = selectedDay
        ? posts.filter(p => p.scheduledFor && isSameDay(new Date(p.scheduledFor), selectedDay))
        : []

    return (
        <div className="flex flex-col h-[calc(100vh-100px)] gap-6">
            {/* Toolbar */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <h2 className="text-3xl font-bold tracking-tight min-w-[200px]">
                        {format(currentDate, "MMMM yyyy")}
                    </h2>
                    <div className="flex items-center bg-muted/50 rounded-lg border p-1 gap-1">
                        <Button variant="ghost" size="icon" className="h-7 w-7" onClick={prevMonth}>
                            <ChevronLeft className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm" className="h-7 text-xs font-medium px-2" onClick={jumpToToday}>
                            Today
                        </Button>
                        <Button variant="ghost" size="icon" className="h-7 w-7" onClick={nextMonth}>
                            <ChevronRight className="h-4 w-4" />
                        </Button>
                    </div>
                </div>

                <div className="flex items-center gap-2 bg-muted/50 p-1 rounded-lg border">
                    <Button
                        variant={view === "calendar" ? "white" : "ghost"}
                        size="sm"
                        className={cn("h-8 gap-2", view === "calendar" && "bg-background shadow-sm")}
                        onClick={() => setView("calendar")}
                    >
                        <CalendarIcon className="h-4 w-4" />
                        <span className="hidden sm:inline">Calendar</span>
                    </Button>
                    <Button
                        variant={view === "list" ? "white" : "ghost"}
                        size="sm"
                        className={cn("h-8 gap-2", view === "list" && "bg-background shadow-sm")}
                        onClick={() => setView("list")}
                    >
                        <ListIcon className="h-4 w-4" />
                        <span className="hidden sm:inline">List</span>
                    </Button>
                </div>
            </div>

            {/* Main Content */}
            <div className="flex-1 bg-white dark:bg-neutral-900 border rounded-xl shadow-sm overflow-hidden flex flex-col">
                {view === "calendar" ? (
                    <div className="flex-1 flex flex-col min-h-0">
                        {/* Days Header */}
                        <div className="grid grid-cols-7 border-b bg-muted/20">
                            {weekDays.map(day => (
                                <div key={day} className="py-3 text-center text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                                    {day}
                                </div>
                            ))}
                        </div>

                        {/* Calendar Grid */}
                        <div className="flex-1 grid grid-cols-7 grid-rows-5 lg:grid-rows-5 overflow-y-auto">
                            {calendarDays.map((date, i) => {
                                const isCurrentMonth = isSameMonth(date, currentDate)
                                const isCurrentDay = isToday(date)
                                const dayPosts = posts.filter(p => p.scheduledFor && isSameDay(new Date(p.scheduledFor), date))

                                return (
                                    <div
                                        key={date.toString()}
                                        onClick={() => setSelectedDay(date)}
                                        className={cn(
                                            "min-h-[100px] border-b border-r p-2 transition-all cursor-pointer hover:bg-muted/5 flex flex-col gap-1 relative group",
                                            !isCurrentMonth && "bg-muted/10 text-muted-foreground",
                                            isCurrentDay && "bg-blue-50/30 dark:bg-blue-900/10"
                                        )}
                                    >
                                        <div className="flex items-center justify-between mb-2">
                                            <span className={cn(
                                                "text-sm font-medium h-7 w-7 flex items-center justify-center rounded-full transition-colors",
                                                isCurrentDay && "bg-blue-600 text-white shadow-sm",
                                                !isCurrentDay && "group-hover:bg-muted/20"
                                            )}>
                                                {format(date, "d")}
                                            </span>
                                        </div>

                                        <div className="flex-1 flex flex-wrap content-start gap-1.5 p-1">
                                            {dayPosts.map(post => (
                                                <div
                                                    key={post.id}
                                                    className={cn(
                                                        "h-2.5 w-2.5 rounded-full shadow-sm ring-1 ring-white dark:ring-neutral-900",
                                                        post.platform === "LINKEDIN" ? "bg-blue-600" : "bg-black dark:bg-neutral-400"
                                                    )}
                                                    title={post.platform}
                                                />
                                            ))}
                                        </div>
                                    </div>
                                )
                            })}
                        </div>
                    </div>
                ) : (
                    // Refined List View
                    <div className="flex-1 overflow-y-auto bg-slate-50/50 dark:bg-black/20">
                        <div className="p-6">
                            <ScheduleList initialPosts={posts} />
                        </div>
                    </div>
                )}
            </div>

            {/* Day Details Modal */}
            <Dialog open={!!selectedDay} onOpenChange={(open) => !open && setSelectedDay(null)}>
                <DialogContent className="sm:max-w-[500px]">
                    <DialogHeader>
                        <DialogTitle className="flex items-center gap-2">
                            <CalendarIcon className="h-5 w-5 text-muted-foreground" />
                            {selectedDay && format(selectedDay, "EEEE, MMMM d")}
                        </DialogTitle>
                        <DialogDescription>
                            {selectedDayPosts.length} posts scheduled for this day
                        </DialogDescription>
                    </DialogHeader>

                    <div className="space-y-3 py-4">
                        {selectedDayPosts.length > 0 ? (
                            selectedDayPosts.map(post => (
                                <div
                                    key={post.id}
                                    onClick={() => {
                                        setEditingPost(post)
                                        // setSelectedDay(null) // Keep open or close? User might want to edit multiple. Let's keep simpler: edit opens on top or swap.
                                        // Dialog stacking works in shadcn but can be messy. 
                                        // Better UX: Close this, open edit.
                                        setSelectedDay(null)
                                    }}
                                    className={cn(
                                        "group flex items-start gap-3 p-3 rounded-lg border transition-all cursor-pointer hover:shadow-md hover:border-blue-300/50",
                                        post.platform === "LINKEDIN"
                                            ? "bg-blue-50/50 dark:bg-blue-900/10"
                                            : "bg-neutral-50/50 dark:bg-neutral-900/10"
                                    )}
                                >
                                    <div className={cn(
                                        "h-8 w-8 rounded-lg flex items-center justify-center shrink-0 border shadow-sm",
                                        post.platform === "LINKEDIN"
                                            ? "bg-blue-100 border-blue-200 text-blue-700"
                                            : "bg-white border-neutral-200 text-neutral-900 dark:bg-neutral-800"
                                    )}>
                                        {post.platform === "LINKEDIN" ? <Linkedin className="h-4 w-4" /> : <Twitter className="h-4 w-4" />}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center justify-between mb-1">
                                            <span className="text-xs font-semibold text-muted-foreground uppercase">{post.platform}</span>
                                            <Badge variant="outline" className="h-5 text-[10px] px-1.5 bg-white">
                                                {format(new Date(post.scheduledFor), "h:mm a")}
                                            </Badge>
                                        </div>
                                        <p className="text-sm line-clamp-2 font-medium text-foreground/90">
                                            {post.content}
                                        </p>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="text-center py-8 text-muted-foreground border-2 border-dashed rounded-xl">
                                <p>No posts scheduled for this day.</p>
                                <Button variant="link" className="text-blue-600" onClick={() => setSelectedDay(null)}>
                                    Close
                                </Button>
                            </div>
                        )}
                    </div>
                </DialogContent>
            </Dialog>

            {/* Edit Dialog Integration */}
            {editingPost && (
                <EditPostDialog
                    post={editingPost}
                    open={!!editingPost}
                    onOpenChange={(open) => !open && setEditingPost(null)}
                    onPostUpdated={handlePostUpdate}
                />
            )}
        </div>
    )
}
