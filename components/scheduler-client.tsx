"use client"

import { useState } from "react"
import { Calendar } from "@/components/ui/calendar"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetHeader,
    SheetTitle,
} from "@/components/ui/sheet"
import {
    Calendar as CalendarIcon,
    Clock,
    Linkedin,
    Twitter,
    Mail,
    Plus,
    Trash2
} from "lucide-react"
import { cn } from "@/lib/utils"
import { format } from "date-fns"

interface Post {
    id: string
    platform: string
    content: string
    scheduledFor: Date | null
    status: string
    article: {
        title: string
        feed: {
            name: string
        } | null
    } | null
}

interface SchedulerClientProps {
    initialPosts: Post[]
}

export function SchedulerClient({ initialPosts }: SchedulerClientProps) {
    const [date, setDate] = useState<Date | undefined>(new Date())
    const [isDrawerOpen, setIsDrawerOpen] = useState(false)
    const [selectedDatePosts, setSelectedDatePosts] = useState<Post[]>([])

    // Separate scheduled and unscheduled
    const scheduledPosts = initialPosts.filter(p => p.scheduledFor)
    const unscheduledPosts = initialPosts.filter(p => !p.scheduledFor)

    const handleDateSelect = (newDate: Date | undefined) => {
        if (!newDate) return
        setDate(newDate)

        const posts = scheduledPosts.filter(p => {
            if (!p.scheduledFor) return false
            const postDate = new Date(p.scheduledFor)
            return postDate.getDate() === newDate.getDate() &&
                postDate.getMonth() === newDate.getMonth() &&
                postDate.getFullYear() === newDate.getFullYear()
        })

        setSelectedDatePosts(posts)
        setIsDrawerOpen(true)
    }

    // Custom day component with indicators
    const CustomDay = (props: any) => {
        const { date: dayDate } = props

        const dayPosts = scheduledPosts.filter(p => {
            if (!p.scheduledFor) return false
            const postDate = new Date(p.scheduledFor)
            return postDate.getDate() === dayDate.getDate() &&
                postDate.getMonth() === dayDate.getMonth() &&
                postDate.getFullYear() === dayDate.getFullYear()
        })

        const hasPublished = dayPosts.some(p => p.status === "PUBLISHED")
        const hasScheduled = dayPosts.some(p => p.status === "SCHEDULED")
        const hasDraft = dayPosts.some(p => p.status === "DRAFT")

        return (
            <div className="relative w-full h-full flex items-center justify-center cursor-pointer p-2 hover:bg-muted/50 transition-colors rounded-md group">
                <span className="text-sm font-medium relative z-10">{dayDate.getDate()}</span>

                {/* Dot Indicators */}
                <div className="absolute bottom-2 flex gap-1 transform translate-y-1">
                    {hasPublished && <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 shadow-sm" />}
                    {hasScheduled && <div className="w-1.5 h-1.5 rounded-full bg-blue-500 shadow-sm" />}
                    {hasDraft && <div className="w-1.5 h-1.5 rounded-full bg-slate-300 shadow-sm" />}
                </div>
            </div>
        )
    }

    const getPlatformIcon = (platform: string) => {
        switch (platform) {
            case "LINKEDIN": return <Linkedin className="h-4 w-4" />
            case "TWITTER": return <Twitter className="h-4 w-4" />
            case "NEWSLETTER": return <Mail className="h-4 w-4" />
            default: return null
        }
    }

    const getPlatformColor = (platform: string) => {
        switch (platform) {
            case "LINKEDIN": return "border-l-blue-600"
            case "TWITTER": return "border-l-slate-900"
            case "NEWSLETTER": return "border-l-orange-600"
            default: return "border-l-slate-400"
        }
    }

    return (
        <div className="h-[calc(100vh-6rem)] flex flex-col">
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Content Calendar</h1>
                    <p className="text-muted-foreground">Manage your publishing schedule.</p>
                </div>
                <div className="flex gap-4 items-center">
                    <div className="flex gap-2 text-sm text-muted-foreground mr-4">
                        <div className="flex items-center gap-1.5">
                            <div className="w-2 h-2 rounded-full bg-emerald-500" /> Published
                        </div>
                        <div className="flex items-center gap-1.5">
                            <div className="w-2 h-2 rounded-full bg-blue-500" /> Scheduled
                        </div>
                        <div className="flex items-center gap-1.5">
                            <div className="w-2 h-2 rounded-full bg-slate-300" /> Draft
                        </div>
                    </div>
                    <Button>
                        <Plus className="mr-2 h-4 w-4" /> New Post
                    </Button>
                </div>
            </div>

            <div className="grid gap-6 lg:grid-cols-[1fr_300px] flex-1 overflow-hidden">
                {/* Calendar */}
                <Card className="overflow-hidden flex flex-col border rounded-xl bg-white dark:bg-zinc-950 shadow-sm">
                    <CardContent className="p-0 h-full overflow-hidden flex flex-col">
                        <Calendar
                            mode="single"
                            selected={date}
                            onSelect={handleDateSelect}
                            className="w-full h-full p-6"
                            classNames={{
                                months: "w-full h-full flex flex-col",
                                month: "w-full h-full flex flex-col",
                                caption: "grid grid-cols-[auto_1fr_auto] items-center w-full mb-4 px-2 relative",
                                caption_label: "text-xl font-bold text-center col-start-2",
                                nav: "contents",
                                nav_button: "h-8 w-8 bg-transparent p-0 opacity-50 hover:opacity-100 hover:bg-muted rounded-md transition-all flex items-center justify-center border border-border",
                                nav_button_previous: "col-start-1 order-first",
                                nav_button_next: "col-start-3 order-last",
                                table: "w-full h-full border-collapse",
                                head_row: "flex w-full mb-2",
                                head_cell: "text-muted-foreground rounded-md w-full font-medium text-sm tracking-wider uppercase",
                                row: "flex w-full mt-2 flex-1",
                                cell: "w-full h-full text-center text-sm p-0 flex items-center justify-center relative [&:has([aria-selected])]:bg-accent/50 first:[&:has([aria-selected])]:rounded-l-md last:[&:has([aria-selected])]:rounded-r-md focus-within:relative focus-within:z-20",
                                day: "w-full h-full p-0 font-normal aria-selected:opacity-100 transition-all duration-200 rounded-lg group",
                                day_selected: "bg-slate-900 text-white hover:bg-slate-900 hover:text-white dark:bg-white dark:text-black shadow-md",
                                day_today: "bg-slate-100 dark:bg-zinc-800 text-accent-foreground font-bold",
                            }}
                            // @ts-ignore
                            components={{
                                DayContent: CustomDay
                            } as any}
                        />
                    </CardContent>
                </Card>

                {/* Unscheduled Posts Sidebar */}
                <Card className="overflow-y-auto">
                    <CardHeader>
                        <CardTitle className="text-sm">Unscheduled Posts ({unscheduledPosts.length})</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2">
                        {unscheduledPosts.length === 0 ? (
                            <p className="text-sm text-muted-foreground text-center py-8">
                                No unscheduled posts
                            </p>
                        ) : (
                            unscheduledPosts.map(post => (
                                <div
                                    key={post.id}
                                    className={cn(
                                        "p-3 rounded-lg border-l-4 bg-card hover:shadow-md transition-shadow cursor-pointer",
                                        getPlatformColor(post.platform)
                                    )}
                                >
                                    <div className="flex items-start gap-2 mb-2">
                                        <div className={cn(
                                            "p-1.5 rounded",
                                            post.platform === "LINKEDIN" && "bg-blue-50 text-blue-700",
                                            post.platform === "TWITTER" && "bg-slate-100 text-slate-900",
                                            post.platform === "NEWSLETTER" && "bg-orange-50 text-orange-600"
                                        )}>
                                            {getPlatformIcon(post.platform)}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="text-xs font-medium line-clamp-2">
                                                {post.article?.title || post.content.slice(0, 60)}
                                            </p>
                                        </div>
                                    </div>
                                    <Badge variant="outline" className="text-[10px] bg-amber-50 text-amber-700 border-amber-300">
                                        Needs scheduling
                                    </Badge>
                                </div>
                            ))
                        )}
                    </CardContent>
                </Card>
            </div>

            {/* Day Details Drawer */}
            <Sheet open={isDrawerOpen} onOpenChange={setIsDrawerOpen}>
                <SheetContent className="sm:max-w-[500px]">
                    <SheetHeader>
                        <SheetTitle className="flex items-center gap-2 text-xl">
                            <div className="p-2 bg-muted rounded-md">
                                <CalendarIcon className="h-5 w-5" />
                            </div>
                            {date?.toLocaleDateString(undefined, { weekday: 'long', month: 'long', day: 'numeric' })}
                        </SheetTitle>
                        <SheetDescription>
                            {selectedDatePosts.length} posts scheduled for this day
                        </SheetDescription>
                    </SheetHeader>

                    <div className="space-y-3 py-6 max-h-[calc(100vh-200px)] overflow-y-auto">
                        {selectedDatePosts.length === 0 ? (
                            <div className="text-center py-12 text-muted-foreground border-2 border-dashed rounded-xl">
                                <p>No posts scheduled.</p>
                                <Button variant="link" className="mt-2 text-emerald-600">
                                    + Create Content
                                </Button>
                            </div>
                        ) : (
                            selectedDatePosts.map(post => (
                                <div
                                    key={post.id}
                                    className={cn(
                                        "group relative flex items-start gap-4 p-4 rounded-xl border bg-card/50 hover:bg-card hover:shadow-lg transition-all border-l-4",
                                        getPlatformColor(post.platform)
                                    )}
                                >
                                    <div className={cn(
                                        "p-2 rounded-lg shrink-0",
                                        post.platform === "LINKEDIN" && "bg-blue-50 text-blue-700",
                                        post.platform === "TWITTER" && "bg-slate-100 text-slate-900",
                                        post.platform === "NEWSLETTER" && "bg-orange-50 text-orange-600"
                                    )}>
                                        {getPlatformIcon(post.platform)}
                                    </div>

                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center justify-between">
                                            <h4 className="font-semibold text-sm truncate pr-2">
                                                {post.article?.title || "Social Post"}
                                            </h4>
                                            <Button variant="ghost" size="icon" className="h-6 w-6">
                                                <Trash2 className="h-3 w-3 text-red-500" />
                                            </Button>
                                        </div>
                                        <div className="flex items-center gap-2 mt-1">
                                            <Badge variant={
                                                post.status === "PUBLISHED" ? "default" :
                                                    post.status === "SCHEDULED" ? "secondary" : "outline"
                                            } className="text-[10px] h-5 px-1.5">
                                                {post.status}
                                            </Badge>
                                            <span className="text-[10px] text-muted-foreground flex items-center gap-1">
                                                <Clock className="h-3 w-3" />
                                                {post.scheduledFor ? format(new Date(post.scheduledFor), 'HH:mm') : ''}
                                            </span>
                                        </div>
                                        <p className="text-xs text-muted-foreground mt-2 line-clamp-2 leading-relaxed bg-muted/50 p-2 rounded-md">
                                            "{post.content.slice(0, 100)}..."
                                        </p>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </SheetContent>
            </Sheet>
        </div>
    )
}
