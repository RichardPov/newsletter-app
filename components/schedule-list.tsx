"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
    Linkedin,
    Twitter,
    Calendar,
    Trash2,
    Edit
} from "lucide-react"
import { cn } from "@/lib/utils"
import { deletePost } from "@/lib/post-actions"
import { toast } from "sonner"
import { format } from "date-fns"
import { EditPostDialog } from "@/components/edit-post-dialog"

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
    const [editingPost, setEditingPost] = useState<Post | null>(null)

    // Sort: Scheduled first (asc), then drafts (desc by creation)
    const sortedPosts = [...posts].sort((a, b) => {
        if (a.status === "SCHEDULED" && b.status === "SCHEDULED") {
            if (!a.scheduledFor) return 1
            if (!b.scheduledFor) return -1
            return new Date(a.scheduledFor).getTime() - new Date(b.scheduledFor).getTime()
        }
        if (a.status === "SCHEDULED") return -1
        if (b.status === "SCHEDULED") return 1
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

    const handlePostUpdate = (updatedPost: any) => {
        // For list view, we can update locally without full reload if we trust the data
        setPosts(posts.map(p => p.id === updatedPost.id ? updatedPost : p))
        setEditingPost(null)
        // window.location.reload() // Optional, but local update is smoother
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
                            "transition-all hover:shadow-md",
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
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            onClick={() => setEditingPost(post)}
                                            className="text-muted-foreground hover:text-emerald-600 hover:bg-emerald-50"
                                            title="Schedule Post"
                                        >
                                            <Calendar className="h-4 w-4" />
                                        </Button>
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            onClick={() => setEditingPost(post)}
                                            className="text-muted-foreground hover:text-blue-600 hover:bg-blue-50"
                                            title="Edit Post"
                                        >
                                            <Edit className="h-4 w-4" />
                                        </Button>
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            className="text-muted-foreground hover:text-red-600 hover:bg-red-50"
                                            onClick={() => handleDelete(post.id)}
                                            title="Delete Post"
                                        >
                                            <Trash2 className="h-4 w-4" />
                                        </Button>
                                    </div>
                                </div>
                            </CardHeader>
                            <CardContent className="py-4 pt-0">
                                <p className="text-sm text-slate-700 dark:text-slate-300 whitespace-pre-wrap font-mono bg-slate-50 dark:bg-slate-900/50 p-3 rounded-md border border-slate-100 dark:border-slate-800">
                                    {post.content}
                                </p>
                            </CardContent>
                        </Card>
                    ))
                )}
            </div>

            {editingPost && (
                <EditPostDialog
                    post={{
                        ...editingPost,
                        // Ensure scheduledFor is properly typed for the dialog if needed, 
                        // though the dialog expects Date | null | undefined which mimics Prisma type
                    }}
                    open={!!editingPost}
                    onOpenChange={(open) => !open && setEditingPost(null)}
                    onPostUpdated={handlePostUpdate}
                />
            )}
        </div>
    )
}
