"use client"

import { useState } from "react"
import { Calendar } from "@/components/ui/calendar"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Plus, Calendar as CalendarIcon, MoreHorizontal, Clock, CheckCircle2, AlertCircle, Linkedin, Twitter, Mail } from "lucide-react"
import { cn } from "@/lib/utils"

// ------------------------------------------------------------------
// Types & Mock Data Construction
// ------------------------------------------------------------------

type PostStatus = "Scheduled" | "Published" | "Draft"
type Platform = "LinkedIn" | "Twitter" | "Newsletter"

interface Post {
    id: number
    title: string
    platform: Platform
    tone: string
    date: Date
    status: PostStatus
    content: string
}

const scheduledPosts: Post[] = [
    // Today
    {
        id: 3,
        title: "Weekly Tech Digest",
        platform: "Newsletter",
        tone: "Curated",
        date: new Date(),
        status: "Published",
        content: "This week in tech: OpenAI's new model, Apple's event..."
    },
    // Tomorrow
    {
        id: 1,
        title: "5 AI Tools You Missed This Week",
        platform: "LinkedIn",
        tone: "Professional",
        date: new Date(new Date().setDate(new Date().getDate() + 1)),
        status: "Scheduled",
        content: "Here are the top 5 AI tools that are changing the game..."
    },
    // +3 Days
    {
        id: 2,
        title: "Why SEO is changing forever",
        platform: "Twitter",
        tone: "Hooky",
        date: new Date(new Date().setDate(new Date().getDate() + 3)),
        status: "Scheduled",
        content: "SEO is dead. Long live SGE. 🧵"
    },
    // +5 Days (Multiple posts same day)
    {
        id: 5,
        title: "Startup Lessons Learned",
        platform: "LinkedIn",
        tone: "Storytelling",
        date: new Date(new Date().setDate(new Date().getDate() + 5)),
        status: "Draft",
        content: "I f*cked up. Here is what I learned..."
    },
    {
        id: 6,
        title: "New Product Launch Teaser",
        platform: "Twitter",
        tone: "Hype",
        date: new Date(new Date().setDate(new Date().getDate() + 5)),
        status: "Scheduled",
        content: "Something big is coming... 👀"
    },
    // Past posts (Beginning of month)
    {
        id: 7,
        title: "Monthly Recap",
        platform: "Newsletter",
        tone: "Professional",
        date: new Date(new Date().getFullYear(), new Date().getMonth(), 1),
        status: "Published",
        content: "October was a wild month. Here is the breakdown."
    },
    // Future Drafts
    {
        id: 4,
        title: "Hidden Gem: Shadcn UI",
        platform: "Twitter",
        tone: "Funny",
        date: new Date(new Date().setDate(new Date().getDate() + 10)),
        status: "Draft",
        content: "Frontend devs be like..."
    }
]

export default function SchedulerPage() {
    const [date, setDate] = useState<Date | undefined>(new Date())
    const [isDetailsOpen, setIsDetailsOpen] = useState(false)
    const [selectedDatePosts, setSelectedDatePosts] = useState<Post[]>([])

    // Function to handle date click
    const handleDateSelect = (newDate: Date | undefined) => {
        if (!newDate) return
        setDate(newDate)

        const posts = scheduledPosts.filter(p =>
            p.date.getDate() === newDate.getDate() &&
            p.date.getMonth() === newDate.getMonth() &&
            p.date.getFullYear() === newDate.getFullYear()
        )

        setSelectedDatePosts(posts)
        setIsDetailsOpen(true)
    }

    // Custom Day Component to render indicators
    const CustomDay = (props: any) => {
        const { date: dayDate } = props

        const dayPosts = scheduledPosts.filter(p =>
            p.date.getDate() === dayDate.getDate() &&
            p.date.getMonth() === dayDate.getMonth() &&
            p.date.getFullYear() === dayDate.getFullYear()
        )

        const hasPublished = dayPosts.some(p => p.status === "Published")
        const hasScheduled = dayPosts.some(p => p.status === "Scheduled")
        const hasDraft = dayPosts.some(p => p.status === "Draft")

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

    return (
        <div className="h-[calc(100vh-6rem)] flex flex-col">
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Content Calendar</h1>
                    <p className="text-muted-foreground">Manage your publishing schedule.</p>
                </div>
                <div className="flex gap-4 items-center">
                    <div className="flex gap-2 text-sm text-muted-foreground mr-4">
                        <div className="flex items-center gap-1.5"><div className="w-2 h-2 rounded-full bg-emerald-500" /> Published</div>
                        <div className="flex items-center gap-1.5"><div className="w-2 h-2 rounded-full bg-blue-500" /> Scheduled</div>
                        <div className="flex items-center gap-1.5"><div className="w-2 h-2 rounded-full bg-slate-300" /> Draft</div>
                    </div>
                    <Button onClick={() => alert("New Post Wizard (Coming Soon)")}>
                        <Plus className="mr-2 h-4 w-4" /> New Post
                    </Button>
                </div>
            </div>

            <Card className="flex-1 overflow-hidden flex flex-col border rounded-xl bg-white dark:bg-zinc-950 shadow-sm">
                <CardContent className="p-0 h-full overflow-hidden flex flex-col">
                    <Calendar
                        mode="single"
                        selected={date}
                        onSelect={handleDateSelect}
                        className="w-full h-full p-6"
                        classNames={{
                            months: "w-full h-full flex flex-col",
                            month: "w-full h-full flex flex-col",

                            // Navigation Fix: Center Caption, Flank with Arrows
                            caption: "grid grid-cols-[auto_1fr_auto] items-center w-full mb-4 px-2 relative",
                            caption_label: "text-xl font-bold text-center col-start-2", // Center label in the middle column
                            nav: "contents", // Use grid placement for children
                            nav_button: "h-8 w-8 bg-transparent p-0 opacity-50 hover:opacity-100 hover:bg-muted rounded-md transition-all flex items-center justify-center border border-border",
                            nav_button_previous: "col-start-1 order-first", // Left arrow
                            nav_button_next: "col-start-3 order-last",    // Right arrow

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
                        }}
                    />
                </CardContent>
            </Card>

            {/* Day Details Modal (Previously approved design) */}
            <Dialog open={isDetailsOpen} onOpenChange={setIsDetailsOpen}>
                <DialogContent className="sm:max-w-[500px]">
                    <DialogHeader>
                        <DialogTitle className="flex items-center gap-2 text-xl">
                            <div className="p-2 bg-muted rounded-md">
                                <CalendarIcon className="h-5 w-5" />
                            </div>
                            {date?.toLocaleDateString(undefined, { weekday: 'long', month: 'long', day: 'numeric' })}
                        </DialogTitle>
                        <DialogDescription>
                            {selectedDatePosts.length} posts scheduled for this day
                        </DialogDescription>
                    </DialogHeader>

                    <div className="space-y-3 py-4 max-h-[60vh] overflow-y-auto">
                        {selectedDatePosts.length === 0 ? (
                            <div className="text-center py-12 text-muted-foreground border-2 border-dashed rounded-xl">
                                <p>No posts scheduled.</p>
                                <Button variant="link" className="mt-2 text-emerald-600">
                                    + Create Content
                                </Button>
                            </div>
                        ) : (
                            selectedDatePosts.map(post => (
                                <div key={post.id} className="group relative flex items-start gap-4 p-4 rounded-xl border bg-card/50 hover:bg-card hover:shadow-lg transition-all border-l-4"
                                    style={{ borderLeftColor: post.platform === 'LinkedIn' ? '#0077b5' : post.platform === 'Twitter' ? '#000000' : '#f97316' }}>

                                    <div className={cn("p-2 rounded-lg shrink-0",
                                        post.platform === "LinkedIn" ? "bg-blue-50 text-blue-700 dark:bg-blue-950 dark:text-blue-300" :
                                            post.platform === "Twitter" ? "bg-zinc-100 text-black dark:bg-zinc-800 dark:text-white" :
                                                "bg-orange-50 text-orange-600 dark:bg-orange-950 dark:text-orange-300"
                                    )}>
                                        {post.platform === "LinkedIn" && <Linkedin className="h-5 w-5" />}
                                        {post.platform === "Twitter" && <Twitter className="h-5 w-5" />}
                                        {post.platform === "Newsletter" && <Mail className="h-5 w-5" />}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center justify-between">
                                            <h4 className="font-semibold text-sm truncate pr-2">{post.title}</h4>

                                        </div>
                                        <div className="flex items-center gap-2 mt-1">
                                            <Badge variant={
                                                post.status === "Published" ? "default" :
                                                    post.status === "Scheduled" ? "secondary" : "outline"
                                            } className={cn("text-[10px] h-5 px-1.5 tracking-wide uppercase",
                                                post.status === "Published" && "bg-emerald-500 hover:bg-emerald-600 text-white border-none",
                                                post.status === "Scheduled" && "bg-blue-100 text-blue-700 border-blue-200 dark:bg-blue-900 dark:text-blue-100 dark:border-blue-800"
                                            )}>
                                                {post.status}
                                            </Badge>
                                            <span className="text-[10px] text-muted-foreground flex items-center gap-1">
                                                <Clock className="h-3 w-3" />
                                                {post.status === "Published" ? "9:00 AM" : "10:00 AM"}
                                            </span>
                                        </div>
                                        <p className="text-xs text-muted-foreground mt-2 line-clamp-2 leading-relaxed bg-muted/50 p-2 rounded-md">
                                            "{post.content}"
                                        </p>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>

                    <div className="flex justify-between items-center pt-2 border-t">
                        <span className="text-xs text-muted-foreground">Timezone: Europe/Bratislava</span>
                        <Button onClick={() => alert("Create new post flow")}>Add Activity</Button>
                    </div>
                </DialogContent>
            </Dialog>
        </div>
    )
}
