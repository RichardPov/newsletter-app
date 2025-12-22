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
    Send
} from "lucide-react"
import { cn } from "@/lib/utils"
import { generateSocialPosts, deletePost, updatePost } from "@/lib/social-actions"
import { toast } from "sonner"
import { useRouter } from "next/navigation"

interface SocialFeedProps {
    initialPosts: any[]
}

export function SocialFeed({ initialPosts }: SocialFeedProps) {
    const [posts, setPosts] = useState(initialPosts)
    const [selectedPlatform, setSelectedPlatform] = useState<string>("ALL")
    const [editingId, setEditingId] = useState<string | null>(null)
    const [editContent, setEditContent] = useState("")
    const router = useRouter()

    const filteredPosts = selectedPlatform === "ALL"
        ? posts
        : posts.filter(p => p.platform === selectedPlatform)

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
            case "LINKEDIN": return "bg-blue-50 text-blue-700 border-blue-200"
            case "TWITTER": return "bg-slate-100 text-slate-900 border-slate-300"
            case "NEWSLETTER": return "bg-emerald-50 text-emerald-700 border-emerald-200"
            default: return "bg-slate-100"
        }
    }

    const handleDelete = async (id: string) => {
        if (!confirm("Delete this post?")) return

        try {
            await deletePost(id)
            setPosts(posts.filter(p => p.id !== id))
            toast.success("Post deleted")
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
            toast.success("Post updated")
        } catch (error) {
            toast.error("Failed to update")
        }
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Social Posts</h1>
                    <p className="text-muted-foreground">AI-generated posts from your articles</p>
                </div>
                <Button onClick={() => router.push('/dashboard/articles')}>
                    <Sparkles className="mr-2 h-4 w-4" />
                    Generate from Articles
                </Button>
            </div>

            <Tabs value={selectedPlatform} onValueChange={setSelectedPlatform}>
                <TabsList>
                    <TabsTrigger value="ALL">All ({posts.length})</TabsTrigger>
                    <TabsTrigger value="TWITTER">
                        <Twitter className="mr-2 h-4 w-4" />
                        Twitter ({posts.filter(p => p.platform === "TWITTER").length})
                    </TabsTrigger>
                    <TabsTrigger value="LINKEDIN">
                        <Linkedin className="mr-2 h-4 w-4" />
                        LinkedIn ({posts.filter(p => p.platform === "LINKEDIN").length})
                    </TabsTrigger>
                    <TabsTrigger value="NEWSLETTER">
                        <Mail className="mr-2 h-4 w-4" />
                        Newsletter ({posts.filter(p => p.platform === "NEWSLETTER").length})
                    </TabsTrigger>
                </TabsList>

                <TabsContent value={selectedPlatform} className="mt-6">
                    <div className="grid gap-4 md:grid-cols-2">
                        {filteredPosts.length === 0 ? (
                            <Card className="col-span-2 p-12 text-center">
                                <Sparkles className="h-12 w-12 mx-auto mb-4 text-slate-300" />
                                <h3 className="text-lg font-semibold mb-2">No posts yet</h3>
                                <p className="text-muted-foreground mb-4">
                                    Generate AI posts from your curated articles
                                </p>
                                <Button onClick={() => router.push('/dashboard/articles')}>
                                    Go to Articles
                                </Button>
                            </Card>
                        ) : (
                            filteredPosts.map(post => (
                                <Card key={post.id} className="hover:shadow-md transition-shadow">
                                    <CardHeader>
                                        <div className="flex items-start justify-between">
                                            <div className="flex items-center gap-2">
                                                <Badge className={cn("border", getPlatformColor(post.platform))}>
                                                    {getPlatformIcon(post.platform)}
                                                    <span className="ml-1">{post.platform}</span>
                                                </Badge>
                                                <Badge variant="outline">
                                                    {post.status}
                                                </Badge>
                                            </div>
                                            <div className="flex gap-1">
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    onClick={() => handleEdit(post)}
                                                >
                                                    <Edit className="h-4 w-4" />
                                                </Button>
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    onClick={() => handleDelete(post.id)}
                                                >
                                                    <Trash2 className="h-4 w-4 text-red-500" />
                                                </Button>
                                            </div>
                                        </div>
                                        {post.article && (
                                            <CardTitle className="text-sm text-muted-foreground font-normal mt-2">
                                                From: {post.article.title}
                                            </CardTitle>
                                        )}
                                    </CardHeader>
                                    <CardContent>
                                        {editingId === post.id ? (
                                            <div className="space-y-2">
                                                <Textarea
                                                    value={editContent}
                                                    onChange={(e) => setEditContent(e.target.value)}
                                                    rows={8}
                                                    className="font-mono text-sm"
                                                />
                                                <div className="flex gap-2">
                                                    <Button onClick={() => handleSaveEdit(post.id)}>
                                                        Save
                                                    </Button>
                                                    <Button variant="outline" onClick={() => setEditingId(null)}>
                                                        Cancel
                                                    </Button>
                                                </div>
                                            </div>
                                        ) : (
                                            <div className="space-y-4">
                                                <div className="bg-slate-50 rounded-lg p-4 border">
                                                    <p className="text-sm whitespace-pre-wrap font-mono">
                                                        {post.content}
                                                    </p>
                                                </div>
                                                <div className="flex items-center justify-between text-xs text-muted-foreground">
                                                    <span>
                                                        {new Date(post.createdAt).toLocaleDateString()}
                                                    </span>
                                                    {post.scheduledFor && (
                                                        <div className="flex items-center gap-1">
                                                            <Calendar className="h-3 w-3" />
                                                            {new Date(post.scheduledFor).toLocaleString()}
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        )}
                                    </CardContent>
                                </Card>
                            ))
                        )}
                    </div>
                </TabsContent>
            </Tabs>
        </div>
    )
}
