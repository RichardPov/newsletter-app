"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Share2, FileText, CheckCircle, RefreshCw, Calendar as CalendarIcon, Loader2 } from "lucide-react"
import { Progress } from "@/components/ui/progress"
import { SocialPostGeneratorDialog } from "@/components/social-post-generator-dialog"
import { cn } from "@/lib/utils"
// removed unused imports
import { toast } from "sonner"
import { refreshFeeds } from "@/lib/actions"
import { useAppStore } from "@/lib/store"

// Type definition matching the Prisma result + UI needs
export interface ArticleData {
    id: string
    title: string
    url: string
    summary: string | null
    publishedAt: Date
    viralScore: number
    feed: {
        name: string
    } | null
    // Mock / Helper fields for UI
    keyTakeaways?: string[]
    category?: string
}

interface ArticleFeedProps {
    initialArticles: ArticleData[]
}

export function ArticleFeed({ initialArticles }: ArticleFeedProps) {
    const { toneProfile } = useAppStore() // Still use store for global settings like Tone
    const [articles, setArticles] = useState<ArticleData[]>(initialArticles)
    const [selectedArticle, setSelectedArticle] = useState<ArticleData | null>(null)
    const [isSocialOpen, setIsSocialOpen] = useState(false)
    const [isRefreshing, setIsRefreshing] = useState(false)
    const [twitterTone, setTwitterTone] = useState("hooky")
    const [linkedinTone, setLinkedinTone] = useState("professional")
    const [twitterConnected, setTwitterConnected] = useState(false)
    const [linkedinConnected, setLinkedinConnected] = useState(false)
    const [isPosting, setIsPosting] = useState(false)
    const [scheduleDate, setScheduleDate] = useState<Date | undefined>(new Date())

    const handleRefresh = async () => {
        setIsRefreshing(true)
        try {
            const result = await refreshFeeds()
            if (result.success) {
                toast.success(`Fetched ${result.count} new articles!`)
                // In a real app, we'd merge new data or router.refresh() would update 'initialArticles',
                // but since this is a client state initialization, we might need to manually trigger a router refresh
                // or just trust the user to reload. 
                // Better UX: window.location.reload() or router.refresh() from next/navigation.
                // using window.location for simplicity in this step.
                window.location.reload()
            } else {
                toast.error("Failed to fetch feeds")
            }
        } catch (e) {
            toast.error("Error fetching feeds")
        } finally {
            setIsRefreshing(false)
        }
    }

    const handleOpenSocial = (article: ArticleData) => {
        setSelectedArticle(article)
        setIsSocialOpen(true)
    }

    const handlePost = async (platform: 'twitter' | 'linkedin') => {
        setIsPosting(true)
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1500))
        setIsPosting(false)
        toast.success(`Successfully posted to ${platform === 'twitter' ? 'X (Twitter)' : 'LinkedIn'}! 🚀`)
    }

    const handleSchedule = (platform: 'twitter' | 'linkedin') => {
        if (!scheduleDate) {
            toast.error("Please pick a date first.")
            return
        }
        toast.success(`${platform === 'twitter' ? 'X' : 'LinkedIn'} post scheduled for ${scheduleDate.toLocaleDateString()}`)
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Article Feed</h1>
                    <p className="text-muted-foreground">AI-curated content from your sources.</p>
                </div>
                <div className="flex items-center gap-2">
                    <Button variant="outline" onClick={handleRefresh} disabled={isRefreshing}>
                        <RefreshCw className={cn("mr-2 h-4 w-4", isRefreshing && "animate-spin")} />
                        {isRefreshing ? "Fetching..." : "Refresh Feeds"}
                    </Button>
                    {toneProfile && (
                        <Badge variant="outline" className="text-green-600 border-green-200 bg-green-50">
                            <CheckCircle className="mr-1 h-3 w-3" /> Tone: {toneProfile.name}
                        </Badge>
                    )}
                </div>
            </div>

            <Tabs defaultValue="all" className="w-full">
                <TabsList>
                    <TabsTrigger value="all">All Articles</TabsTrigger>
                    <TabsTrigger value="saved">Saved</TabsTrigger>
                </TabsList>

                <TabsContent value="all" className="mt-6">
                    {articles.length === 0 ? (
                        <div className="text-center py-12 text-muted-foreground border rounded-lg border-dashed">
                            No articles found. Add some RSS feeds and click Refresh!
                        </div>
                    ) : (
                        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                            {articles.map((article) => (
                                <Card key={article.id} className="flex flex-col">
                                    <CardHeader>
                                        <div className="flex justify-between items-start mb-2">
                                            <Badge variant="secondary">{article.feed?.name || "RSS"}</Badge>
                                            <span className="text-xs text-muted-foreground">
                                                {new Date(article.publishedAt).toLocaleDateString()}
                                            </span>
                                        </div>
                                        <CardTitle className="leading-snug text-lg line-clamp-2">
                                            <a href={article.url} target="_blank" rel="noopener noreferrer" className="hover:underline">
                                                {article.title}
                                            </a>
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent className="flex-1">
                                        <div className="mb-4">
                                            <p className="text-sm text-muted-foreground line-clamp-3">
                                                {article.summary === "AI summary pending..." ? (
                                                    <span className="italic opacity-50">AI summary processing...</span>
                                                ) : article.summary}
                                            </p>
                                        </div>
                                        <div className="space-y-2">
                                            <div className="flex justify-between text-xs font-medium">
                                                <span>Viral Score</span>
                                                <span>{article.viralScore}/10</span>
                                            </div>
                                            <Progress value={article.viralScore * 10} className="h-2" />
                                        </div>
                                    </CardContent>
                                    <CardFooter className="flex gap-2">
                                        <Button className="flex-1" variant="default">
                                            <FileText className="mr-2 h-4 w-4" /> Newsletter
                                        </Button>
                                        <Button size="icon" variant="outline" onClick={() => handleOpenSocial(article)}>
                                            <Share2 className="h-4 w-4" />
                                        </Button>
                                    </CardFooter>
                                </Card>
                            ))}
                        </div>
                    )}
                </TabsContent>
            </Tabs>

            {/* Social Media Preview Article Dialog */}
            {selectedArticle && (
                <SocialPostGeneratorDialog
                    open={isSocialOpen}
                    onOpenChange={setIsSocialOpen}
                    articleId={selectedArticle.id}
                    articleTitle={selectedArticle.title}
                    customToneName={toneProfile?.name}
                />
            )}
        </div>
    )
}
