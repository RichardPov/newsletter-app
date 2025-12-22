"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Avatar } from "@/components/ui/avatar"
import {
    ChevronLeft,
    ChevronRight,
    Calendar as CalendarIcon,
    Clock,
    User,
    MoreVertical,
    CheckCircle,
    AlertCircle,
    Circle
} from "lucide-react"
import { cn } from "@/lib/utils"
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameDay, isToday, addMonths, subMonths } from "date-fns"

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

const platformColors: { [key: string]: string } = {
    TWITTER: "bg-slate-100 text-slate-900",
    LINKEDIN: "bg-blue-50 text-blue-700",
    NEWSLETTER: "bg-emerald-50 text-emerald-700"
}

const statusConfig: { [key: string]: { label: string, color: string, icon: any } } = {
    SCHEDULED: { label: "Scheduled", color: "bg-emerald-100 text-emerald-700", icon: CheckCircle },
    DRAFT: { label: "Pending internal approval", color: "bg-purple-100 text-purple-700", icon: AlertCircle },
    PUBLISHED: { label: "Approved by client", color: "bg-blue-100 text-blue-700", icon: CheckCircle }
}

export function SchedulerClient({ initialPosts }: SchedulerClientProps) {
    const [currentMonth, setCurrentMonth] = useState(new Date())
    const [selectedDate, setSelectedDate] = useState<Date | null>(null)

    const monthStart = startOfMonth(currentMonth)
    const monthEnd = endOfMonth(currentMonth)
    const daysInMonth = eachDayOfInterval({ start: monthStart, end: monthEnd })

    // Group posts by date
    const groupedPosts: { [key: string]: Post[] } = {}
    initialPosts.forEach(post => {
        if (post.scheduledFor) {
            const dateKey = format(new Date(post.scheduledFor), 'yyyy-MM-dd')
            if (!groupedPosts[dateKey]) {
                groupedPosts[dateKey] = []
            }
            groupedPosts[dateKey].push(post)
        }
    })

    // Get posts for timeline (sorted by date)
    const sortedDates = Object.keys(groupedPosts).sort()

    const getPostCountForDay = (day: Date) => {
        const dateKey = format(day, 'yyyy-MM-dd')
        return groupedPosts[dateKey]?.length || 0
    }

    return (
        <div className="h-[calc(100vh-6rem)] flex gap-4">

            {/* Left Sidebar - Calendar */}
            <Card className="w-[320px] p-6 flex flex-col">
                <div className="space-y-4">
                    <div>
                        <h2 className="text-sm font-semibold text-slate-600 mb-1">Planned posts</h2>
                        <div className="flex items-center justify-between mb-4">
                            <Button
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8"
                                onClick={() => setCurrentMonth(subMonths(currentMonth, 1))}
                            >
                                <ChevronLeft className="h-4 w-4" />
                            </Button>
                            <span className="text-base font-semibold">
                                {format(currentMonth, 'MMMM yyyy')}
                            </span>
                            <Button
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8"
                                onClick={() => setCurrentMonth(addMonths(currentMonth, 1))}
                            >
                                <ChevronRight className="h-4 w-4" />
                            </Button>
                        </div>
                    </div>

                    {/* Mini Calendar */}
                    <div className="space-y-2">
                        <div className="grid grid-cols-7 gap-1 text-center text-xs font-medium text-slate-500 mb-2">
                            {['Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa', 'Su'].map(day => (
                                <div key={day}>{day}</div>
                            ))}
                        </div>
                        <div className="grid grid-cols-7 gap-1">
                            {/* Empty cells for days before month starts */}
                            {Array.from({ length: (monthStart.getDay() + 6) % 7 }).map((_, i) => (
                                <div key={`empty-${i}`} className="h-9" />
                            ))}

                            {daysInMonth.map(day => {
                                const postCount = getPostCountForDay(day)
                                const isSelected = selectedDate && isSameDay(day, selectedDate)
                                const isTodayDate = isToday(day)

                                return (
                                    <button
                                        key={day.toISOString()}
                                        onClick={() => setSelectedDate(day)}
                                        className={cn(
                                            "h-9 rounded-lg text-sm font-medium transition-colors relative",
                                            isSelected && "bg-blue-600 text-white",
                                            !isSelected && isTodayDate && "bg-slate-100",
                                            !isSelected && !isTodayDate && "hover:bg-slate-50",
                                        )}
                                    >
                                        {day.getDate()}
                                        {postCount > 0 && !isSelected && (
                                            <div className="absolute bottom-1 left-1/2 -translate-x-1/2 flex gap-0.5">
                                                {Array.from({ length: Math.min(postCount, 3) }).map((_, i) => (
                                                    <div key={i} className="w-1 h-1 rounded-full bg-blue-500" />
                                                ))}
                                            </div>
                                        )}
                                    </button>
                                )
                            })}
                        </div>
                    </div>

                    {/* Type Filters */}
                    <div className="pt-4 border-t space-y-2">
                        <h3 className="text-sm font-semibold text-slate-600">Type</h3>
                        <div className="space-y-1">
                            <label className="flex items-center gap-2 text-sm">
                                <input type="checkbox" className="rounded" defaultChecked />
                                <span>Photo</span>
                                <span className="ml-auto text-slate-400">1 post</span>
                            </label>
                            <label className="flex items-center gap-2 text-sm">
                                <input type="checkbox" className="rounded" defaultChecked />
                                <span>Reel</span>
                                <span className="ml-auto text-slate-400">3 posts</span>
                            </label>
                            <label className="flex items-center gap-2 text-sm">
                                <input type="checkbox" className="rounded" defaultChecked />
                                <span>Slideshow</span>
                                <span className="ml-auto text-slate-400">2 posts</span>
                            </label>
                            <label className="flex items-center gap-2 text-sm">
                                <input type="checkbox" className="rounded" defaultChecked />
                                <span>Story</span>
                                <span className="ml-auto text-slate-400">2 posts</span>
                            </label>
                        </div>
                    </div>
                </div>
            </Card>

            {/* Right - Timeline */}
            <div className="flex-1 overflow-y-auto space-y-6 pr-2">
                <div className="flex items-center justify-between sticky top-0 bg-slate-50 py-4 z-10">
                    <h1 className="text-2xl font-bold">{format(currentMonth, 'MMMM, yyyy')}</h1>
                    <div className="flex gap-2 items-center text-sm text-slate-600">
                        <span>Posts: <strong>{initialPosts.length}</strong></span>
                        <span>•</span>
                        <span>Budget: <strong>320 USD</strong></span>
                        <Badge variant="secondary" className="ml-2">Blog</Badge>
                        <Badge variant="secondary">Spring</Badge>
                        <Badge variant="secondary">Team</Badge>
                        <Badge variant="secondary">2023</Badge>
                        <button className="ml-2 text-blue-600">More</button>
                    </div>
                </div>

                {sortedDates.map(dateKey => {
                    const posts = groupedPosts[dateKey]
                    const date = new Date(dateKey)

                    return (
                        <div key={dateKey} className="space-y-3">
                            <div className="flex items-center gap-2">
                                <Badge className="bg-blue-600 text-white px-3 py-1">
                                    {format(date, 'd MMM')}
                                </Badge>
                            </div>

                            <div className="space-y-2">
                                {posts.map(post => {
                                    const StatusIcon = statusConfig[post.status]?.icon || Circle

                                    return (
                                        <Card key={post.id} className="p-4 hover:shadow-md transition-shadow">
                                            <div className="flex items-start gap-4">
                                                {/* Thumbnail placeholder */}
                                                <div className="w-16 h-16 rounded-lg bg-gradient-to-br from-orange-400 to-pink-500 flex-shrink-0" />

                                                {/* Content */}
                                                <div className="flex-1 min-w-0">
                                                    <div className="flex items-start justify-between gap-4">
                                                        <div className="flex-1">
                                                            <div className="flex items-center gap-2 mb-1">
                                                                <Clock className="h-3 w-3 text-slate-400" />
                                                                <span className="text-sm font-medium">
                                                                    {post.scheduledFor ? format(new Date(post.scheduledFor), 'HH:mm') : '12:00'}
                                                                </span>
                                                            </div>
                                                            <p className="text-sm text-slate-600 line-clamp-1">
                                                                {post.article?.title || post.content.slice(0, 60)}
                                                            </p>
                                                        </div>

                                                        {/* Budget */}
                                                        <span className="text-sm font-semibold">$350</span>
                                                    </div>

                                                    {/* Tags & Status */}
                                                    <div className="flex items-center gap-2 mt-3 flex-wrap">
                                                        <Badge variant="secondary" className={platformColors[post.platform] || ""}>
                                                            {post.article?.feed?.name || post.platform}
                                                        </Badge>
                                                        <Badge variant="secondary">Spring</Badge>
                                                        <Badge variant="secondary">Team</Badge>
                                                        <Badge variant="secondary">2023</Badge>

                                                        <div className="ml-auto flex items-center gap-2">
                                                            <div className={cn(
                                                                "flex items-center gap-1.5 px-2 py-1 rounded-md text-xs font-medium",
                                                                statusConfig[post.status]?.color || "bg-slate-100"
                                                            )}>
                                                                <StatusIcon className="h-3 w-3" />
                                                                {statusConfig[post.status]?.label || post.status}
                                                            </div>

                                                            <Button variant="ghost" size="icon" className="h-8 w-8">
                                                                <User className="h-4 w-4" />
                                                            </Button>
                                                            <Button variant="ghost" size="icon" className="h-8 w-8">
                                                                <Clock className="h-4 w-4" />
                                                            </Button>
                                                            <Button variant="ghost" size="icon" className="h-8 w-8">
                                                                <MoreVertical className="h-4 w-4" />
                                                            </Button>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </Card>
                                    )
                                })}
                            </div>
                        </div>
                    )
                })}

                {sortedDates.length === 0 && (
                    <div className="text-center py-12 text-slate-400">
                        <CalendarIcon className="h-12 w-12 mx-auto mb-4 opacity-20" />
                        <p>No posts scheduled for this month</p>
                        <Button className="mt-4">Create Your First Post</Button>
                    </div>
                )}
            </div>
        </div>
    )
}
