"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import {
    Linkedin,
    Twitter,
    Calendar,
    Clock,
    Trash2,
    Edit,
    CheckCircle2
} from "lucide-react"
import { cn } from "@/lib/utils"
import { deletePost, updatePost } from "@/lib/post-actions" // Using the new actions
import { toast } from "sonner"
import { format } from "date-fns"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Calendar as CalendarPicker } from "@/components/ui/calendar"

interface Post {
    id: string
    platform: string
    content: string
    scheduledFor?: Date | null
    status: string
    createdAt: Date
}

interface ScheduleListProps {
    initialPosts: Post[]
}

export function ScheduleList({ initialPosts }: ScheduleListProps) {
    const [posts, setPosts] = useState(initialPosts)
    const [editingId, setEditingId] = useState<string | null>(null)
    const [editContent, setEditContent] = useState("")
    const [editDate, setEditDate] = useState<Date | undefined>(undefined)

    // Sort: Scheduled first (asc), then drafts (desc by creation)
    // Sort: Scheduled first (asc), then drafts (desc by creation)
    const sortedPosts = [...posts].sort((a, b) => {
        // Both are scheduled
        if (a.status === "SCHEDULED" && b.status === "SCHEDULED") {
            if (!a.scheduledFor) return 1
            if (!b.scheduledFor) return -1
            return new Date(a.scheduledFor).getTime() - new Date(b.scheduledFor).getTime()
        }

        // One is scheduled, one is draft
        if (a.status === "SCHEDULED") return -1
        if (b.status === "SCHEDULED") return 1

        // Both are drafts (or other), sort by created desc
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    })

    const getPlatformIcon = (platform: string) => {
        switch (platform) {
            case "LINKEDIN": return <Linkedin className="h-4 w-4" />
            case "TWITTER": return <Twitter className="h-4 w-4" />
            default: return null
        }
    }

    const getPlatformColor = (platform: string) => {
        switch (platform) {
            case "LINKEDIN": return "bg-blue-50 text-blue-700 border-blue-200"
            case "TWITTER": return "bg-slate-100 text-slate-900 border-slate-300"
            default: return "bg-slate-100"
        }
    }

    const handleDelete = async (id: string) => {
        if (!confirm("Delete this scheduled post?")) return

        try {
            await deletePost(id)
            setPosts(posts.filter(p => p.id !== id))
            toast.success("Post deleted")
        } catch (error) {
            toast.error("Failed to delete")
        }
    }

    const startEditing = (post: Post) => {
        setEditingId(post.id)
        setEditContent(post.content)
        setEditDate(post.scheduledFor ? new Date(post.scheduledFor) : undefined)
    }

    const handleSaveEdit = async () => {
        if (!editingId) return

        try {
            await updatePost(editingId, { // This updatePost needs to handle partials
                content: editContent,
                scheduledFor: editDate,
                status: editDate ? "SCHEDULED" : "DRAFT"
            })

            setPosts(posts.map(p => p.id === editingId ? {
                ...p,
                content: editContent,
                scheduledFor: editDate || null,
                status: editDate ? "SCHEDULED" : "DRAFT"
            } : p))

            setEditingId(null)
            toast.success("Post updated")
        } catch (error) {
            toast.error("Failed to update")
        }
    }

    return (
        <div className="space-y-6">
            <div className="grid gap-6">
                {sortedPosts.length === 0 ? (
                    <div className="text-center py-12 bg-slate-50 rounded-lg border border-dashed">
                        <Calendar className="h-10 w-10 mx-auto text-slate-300 mb-2" />
                        <h3 className="font-medium text-slate-900">No posts scheduled</h3>
                        <p className="text-sm text-slate-500">Generate posts from articles to see them here.</p>
                    </div>
                ) : (
                    sortedPosts.map(post => (
                        <Card key={post.id} className={cn(
                            "transition-all",
                            editingId === post.id && "ring-2 ring-emerald-500",
                            post.status === "SCHEDULED" ? "border-l-4 border-l-emerald-500" : "border-l-4 border-l-slate-300"
                        )}>
                            <CardHeader className="py-4">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <Badge className={cn("border gap-1", getPlatformColor(post.platform))}>
                                            {getPlatformIcon(post.platform)}
                                            {post.platform}
                                        </Badge>

                                        {post.status === "SCHEDULED" && post.scheduledFor ? (
                                            <div className="flex items-center text-sm font-medium text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full">
                                                <Calendar className="h-3 w-3 mr-1.5" />
                                                {format(new Date(post.scheduledFor), "PPp")}
                                            </div>
                                        ) : (
                                            <Badge variant="secondary" className="bg-slate-100 text-slate-600">
                                                <Edit className="h-3 w-3 mr-1" />
                                                Draft
                                            </Badge>
                                        )}
                                    </div>

                                    <div className="flex gap-1">
                                        {editingId === post.id ? (
                                            <div className="flex gap-2">
                                                <Button size="sm" onClick={handleSaveEdit} className="bg-emerald-600 hover:bg-emerald-700">
                                                    Save Changes
                                                </Button>
                                                <Button size="sm" variant="ghost" onClick={() => setEditingId(null)}>
                                                    Cancel
                                                </Button>
                                            </div>
                                        ) : (
                                            <>
                                                <Button variant="ghost" size="icon" onClick={() => startEditing(post)}>
                                                    <Edit className="h-4 w-4" />
                                                </Button>
                                                <Button variant="ghost" size="icon" className="text-red-500 hover:text-red-600 hover:bg-red-50" onClick={() => handleDelete(post.id)}>
                                                    <Trash2 className="h-4 w-4" />
                                                </Button>
                                            </>
                                        )}
                                    </div>
                                </div>
                            </CardHeader>
                            <CardContent className="py-4 pt-0">
                                {editingId === post.id ? (
                                    <div className="space-y-4 mt-2">
                                        <Textarea
                                            value={editContent}
                                            onChange={(e) => setEditContent(e.target.value)}
                                            className="font-mono text-sm"
                                            rows={5}
                                        />
                                        <div className="flex items-center gap-2">
                                            <span className="text-sm font-medium">Reschedule:</span>
                                            <Popover>
                                                <PopoverTrigger asChild>
                                                    <Button
                                                        variant={"outline"}
                                                        className={cn(
                                                            "w-[240px] justify-start text-left font-normal",
                                                            !editDate && "text-muted-foreground"
                                                        )}
                                                    >
                                                        <Calendar className="mr-2 h-4 w-4" />
                                                        {editDate ? format(editDate, "PPP") : <span>Pick a date</span>}
                                                    </Button>
                                                </PopoverTrigger>
                                                <PopoverContent className="w-auto p-0" align="start">
                                                    <CalendarPicker
                                                        mode="single"
                                                        selected={editDate}
                                                        onSelect={setEditDate}
                                                        initialFocus
                                                        disabled={(date) => date < new Date()}
                                                    />
                                                </PopoverContent>
                                            </Popover>
                                            {editDate && (
                                                <Button variant="ghost" size="sm" onClick={() => setEditDate(undefined)}>
                                                    Clear Date (Set as Draft)
                                                </Button>
                                            )}
                                        </div>
                                    </div>
                                ) : (
                                    <p className="text-sm text-slate-700 dark:text-slate-300 whitespace-pre-wrap font-mono bg-slate-50 dark:bg-slate-900/50 p-3 rounded-md border border-slate-100 dark:border-slate-800">
                                        {post.content}
                                    </p>
                                )}
                            </CardContent>
                        </Card>
                    ))
                )}
            </div>
        </div>
    )
}
