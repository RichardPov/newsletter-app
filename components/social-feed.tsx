"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
    Linkedin,
    Twitter,
    Mail,
    Sparkles,
    Calendar,
    Trash2,
    Edit,
    Save,
    ChevronDown,
    ChevronUp,
    FileText,
    ExternalLink
} from "lucide-react"
import { cn } from "@/lib/utils"
import { deletePost, updatePost } from "@/lib/social-actions"
import { toast } from "sonner"
import { useRouter } from "next/navigation"
import { format } from "date-fns"

interface SocialFeedProps {
    initialPosts: any[]
}

type GroupedPost = {
    articleId?: string
    articleTitle?: string
    articleUrl?: string
    createdAt: Date
    posts: any[]
}

export function SocialFeed({ initialPosts }: SocialFeedProps) {
    const [posts, setPosts] = useState(initialPosts)
    const [expandedGroup, setExpandedGroup] = useState<string | null>(null)
    const [editingId, setEditingId] = useState<string | null>(null)
    const [editContent, setEditContent] = useState("")
    const router = useRouter()

    // Group posts by Article ID
    const groupedPosts: GroupedPost[] = []

    // Helper to find existing group
    const findGroup = (articleId: string) => groupedPosts.find(g => g.articleId === articleId)

    posts.forEach(post => {
        if (post.articleId) {
            const group = findGroup(post.articleId)
            if (group) {
                group.posts.push(post)
            } else {
                groupedPosts.push({
                    articleId: post.articleId,
                    articleTitle: post.article?.title,
                    articleUrl: post.article?.url,
                    createdAt: new Date(post.createdAt),
                    posts: [post]
                })
            }
        } else {
            // Manual post (no article) - treated as its own group
            groupedPosts.push({
                articleId: undefined, // Distinct group identifier
                createdAt: new Date(post.createdAt),
                posts: [post]
            })
        }
    })

    // Sort groups by most recent post
    groupedPosts.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())

    const getPlatformIcon = (platform: string) => {
        switch (platform) {
            case "LINKEDIN": return <Linkedin className="h-4 w-4" />
            case "TWITTER": return <Twitter className="h-4 w-4" />
            case "NEWSLETTER": return <Mail className="h-4 w-4" />
            default: return null
        }
    }

    const handleDelete = async (id: string) => {
        if (!confirm("Delete this draft?")) return
        try {
            await deletePost(id)
            setPosts(posts.filter(p => p.id !== id))
            toast.success("Draft deleted")
        } catch (error) {
            toast.error("Failed to delete")
        }
    }

    const handleEdit = (post: any) => {
        setEditingId(post.id)
        setEditContent(post.content)
    }

    const handleSaveEdit = async (id: string) => {
        try {
            await updatePost(id, { content: editContent })
            setPosts(posts.map(p => p.id === id ? { ...p, content: editContent } : p))
            setEditingId(null)
            toast.success("Draft updated")
        } catch (error) {
            toast.error("Failed to update")
        }
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Saved Drafts</h1>
                    <p className="text-muted-foreground">Manage your generated social content</p>
                </div>
                <Button onClick={() => router.push('/dashboard/articles')}>
                    <Sparkles className="mr-2 h-4 w-4" />
                    New Draft from Article
                </Button>
            </div>

            <div className="space-y-4">
                {groupedPosts.length === 0 ? (
                    <Card className="p-12 text-center border-dashed">
                        <Sparkles className="h-12 w-12 mx-auto mb-4 text-slate-300" />
                        <h3 className="text-lg font-semibold mb-2">No drafts yet</h3>
                        <p className="text-muted-foreground mb-4">
                            Select an article to generate social posts.
                        </p>
                        <Button onClick={() => router.push('/dashboard/articles')}>
                            Go to Articles
                        </Button>
                    </Card>
                ) : (
                    groupedPosts.map((group, groupIndex) => {
                        const groupId = group.articleId || `manual-${groupIndex}`
                        const isExpanded = expandedGroup === groupId

                        return (
                            <Card key={groupId} className={cn("transition-all", isExpanded ? "ring-2 ring-primary/20" : "hover:border-primary/50")}>
                                <div
                                    className="p-6 cursor-pointer flex items-start justify-between"
                                    onClick={() => setExpandedGroup(isExpanded ? null : groupId)}
                                >
                                    <div className="space-y-1">
                                        <div className="flex items-center gap-2">
                                            <h3 className="font-semibold text-lg flex items-center gap-2">
                                                {group.articleTitle || "Untitled Draft"}
                                            </h3>
                                            {group.articleUrl && (
                                                <a href={group.articleUrl} target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-primary transition-colors" onClick={e => e.stopPropagation()}>
                                                    <ExternalLink className="h-3 w-3" />
                                                </a>
                                            )}
                                        </div>
                                        <p className="text-sm text-muted-foreground">
                                            Created {format(group.createdAt, "PPP")} • {group.posts.length} draft{group.posts.length !== 1 ? 's' : ''}
                                        </p>
                                    </div>

                                    <div className="flex items-center gap-3">
                                        <div className="flex -space-x-2">
                                            {group.posts.map((p, i) => (
                                                <div key={p.id} className={cn(
                                                    "w-8 h-8 rounded-full border-2 border-background flex items-center justify-center text-white text-xs ring-1 ring-black/5",
                                                    p.platform === 'LINKEDIN' ? "bg-blue-600" : "bg-black dark:bg-white dark:text-black"
                                                )} title={p.platform}>
                                                    {p.platform === 'LINKEDIN' ? <Linkedin className="h-3 w-3" /> : <Twitter className="h-3 w-3" />}
                                                </div>
                                            ))}
                                        </div>
                                        <Button variant="ghost" size="sm">
                                            {isExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                                        </Button>
                                    </div>
                                </div>

                                {isExpanded && (
                                    <div className="border-t bg-muted/5 p-6 animate-in slide-in-from-top-2 duration-200">
                                        <Tabs defaultValue={group.posts[0].id} className="w-full">
                                            <TabsList className="w-full justify-start mb-4 h-auto p-1 bg-muted/50">
                                                {group.posts.map(post => (
                                                    <TabsTrigger
                                                        key={`tab-${post.id}`}
                                                        value={post.id}
                                                        className="flex items-center gap-2"
                                                    >
                                                        {getPlatformIcon(post.platform)}
                                                        {post.platform}
                                                        <Badge variant="secondary" className="ml-1 text-[10px] h-4 px-1">{post.status}</Badge>
                                                    </TabsTrigger>
                                                ))}
                                            </TabsList>

                                            {group.posts.map(post => (
                                                <TabsContent key={post.id} value={post.id} className="mt-0">
                                                    <Card className="border-none shadow-none bg-background">
                                                        <CardContent className="p-4 space-y-4">
                                                            {editingId === post.id ? (
                                                                <div className="space-y-3">
                                                                    <Textarea
                                                                        value={editContent}
                                                                        onChange={(e) => setEditContent(e.target.value)}
                                                                        className="min-h-[200px] font-mono text-sm leading-relaxed"
                                                                    />
                                                                    <div className="flex justify-end gap-2">
                                                                        <Button variant="ghost" onClick={() => setEditingId(null)}>Cancel</Button>
                                                                        <Button onClick={() => handleSaveEdit(post.id)}>
                                                                            <Save className="h-4 w-4 mr-2" /> Save Changes
                                                                        </Button>
                                                                    </div>
                                                                </div>
                                                            ) : (
                                                                <>
                                                                    <div className="whitespace-pre-wrap font-mono text-sm leading-relaxed p-4 bg-muted/30 rounded-md border border-dashed">
                                                                        {post.content}
                                                                    </div>
                                                                    <div className="flex justify-between items-center pt-2">
                                                                        <div className="text-xs text-muted-foreground flex items-center gap-2">
                                                                            <FileText className="h-3 w-3" /> {post.content.length} characters
                                                                        </div>
                                                                        <div className="flex gap-2">
                                                                            <Button variant="outline" size="sm" onClick={() => handleEdit(post)}>
                                                                                <Edit className="h-3 w-3 mr-2" /> Edit
                                                                            </Button>
                                                                            <Button variant="destructive" size="sm" onClick={() => handleDelete(post.id)}>
                                                                                <Trash2 className="h-3 w-3 mr-2" /> Delete
                                                                            </Button>
                                                                        </div>
                                                                    </div>
                                                                </>
                                                            )}
                                                        </CardContent>
                                                    </Card>
                                                </TabsContent>
                                            ))}
                                        </Tabs>
                                    </div>
                                )}
                            </Card>
                        )
                    })
                )}
            </div>
        </div>
    )
}
