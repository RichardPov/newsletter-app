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
import { ScrollArea } from "@/components/ui/scroll-area"
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

    // Calendar Calculations
    const monthStart = startOfMonth(currentDate)
    const monthEnd = endOfMonth(currentDate)
    const calendarStart = startOfWeek(monthStart, { weekStartsOn: 1 }) // Monday start
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

    const handlePostUpdate = async (id: string, data: any) => {
        try {
            await updatePost(id, data)
            toast.success("Post updated")
            setEditingPost(null)
            // Ideally force refresh or update local state (if passed down)
            // Since this is a server component parent, we rely on router.refresh() usually, 
            // but for instant feedback we might need local state update if 'posts' prop doesn't update auto.
            // For now assume standard flow (EditDialog calls router.refresh usually?)
            // Actually EditDialog calls onSave which calls updatePost.
            // We need to re-fetch or rely on Next.js cache revalidation.
            window.location.reload() // Brute force refresh for now to ensure sync
        } catch (error) {
            toast.error("Update failed")
        }
    }

    const handlePostDelete = async (id: string) => {
        if (!confirm("Delete this scheduled post?")) return
        try {
            await deletePost(id)
            toast.success("Post deleted")
            window.location.reload()
        } catch (e) { toast.error("Delete failed") }
    }

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
                                        className={cn(
                                            "min-h-[100px] border-b border-r p-2 transition-colors hover:bg-muted/5 flex flex-col gap-1",
                                            !isCurrentMonth && "bg-muted/10 text-muted-foreground",
                                            isCurrentDay && "bg-blue-50/30 dark:bg-blue-900/10"
                                        )}
                                    >
                                        <div className="flex items-center justify-between mb-1">
                                            <span className={cn(
                                                "text-sm font-medium h-7 w-7 flex items-center justify-center rounded-full",
                                                isCurrentDay && "bg-blue-600 text-white shadow-sm"
                                            )}>
                                                {format(date, "d")}
                                            </span>
                                            {dayPosts.length > 0 && <span className="text-[10px] text-muted-foreground font-medium">{dayPosts.length} posts</span>}
                                        </div>

                                        <div className="flex-1 flex flex-col gap-1 overflow-visible">
                                            {dayPosts.map(post => (
                                                <div
                                                    key={post.id}
                                                    onClick={() => setEditingPost(post)}
                                                    className={cn(
                                                        "group text-[10px] sm:text-xs p-1.5 rounded border shadow-sm cursor-pointer hover:shadow-md transition-all truncate flex items-center gap-1.5",
                                                        post.platform === "LINKEDIN"
                                                            ? "bg-blue-50 border-blue-100 text-blue-700 hover:border-blue-300 dark:bg-blue-900/30 dark:border-blue-800 dark:text-blue-100"
                                                            : "bg-neutral-50 border-neutral-100 text-neutral-700 hover:border-neutral-300 dark:bg-neutral-800 dark:border-neutral-700 dark:text-neutral-200"
                                                    )}
                                                >
                                                    {post.platform === "LINKEDIN" ? (
                                                        <Linkedin className="h-3 w-3 flex-shrink-0" />
                                                    ) : (
                                                        <Twitter className="h-3 w-3 flex-shrink-0" />
                                                    )}
                                                    <span className="truncate font-medium">
                                                        {post.article?.title || post.content}
                                                    </span>
                                                </div>
                                            ))}
                                            {/* Add Button for empty slots or on hover? Maybe later */}
                                        </div>
                                    </div>
                                )
                            })}
                        </div>
                    </div>
                ) : (
                    // Refined List View
                    <ScrollArea className="flex-1">
                        <div className="p-6">
                            <ScheduleList initialPosts={posts} />
                        </div>
                    </ScrollArea>
                )}
            </div>

            {/* Edit Dialog Integration */}
            {editingPost && (
                <EditPostDialog
                    post={editingPost}
                    open={!!editingPost}
                    onOpenChange={(open) => !open && setEditingPost(null)}
                    onSave={() => window.location.reload()}
                />
            )}
        </div>
    )
}
