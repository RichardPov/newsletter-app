"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Share2, FileText, CheckCircle, RefreshCw, Calendar as CalendarIcon, Loader2, Sparkles, Heart } from "lucide-react"
import { Progress } from "@/components/ui/progress"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Calendar } from "@/components/ui/calendar"
import { cn } from "@/lib/utils"
import { toast } from "sonner"
import { refreshFeeds } from "@/lib/actions"
import { useAppStore } from "@/lib/store"
import { toggleArticleLike } from "@/lib/category-actions"
import { useRouter } from "next/navigation"

// Type definition matching the Prisma result + UI needs
export interface ArticleData {
    id: string
    title: string
    url: string
    summary: string | null
    publishedAt: Date
    viralScore: number
    isLiked?: boolean
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
                    <TabsTrigger value="liked">
                        <Heart className="mr-2 h-4 w-4 fill-red-500 text-red-500" />
                        Liked ({articles.filter(a => a.isLiked).length})
                    </TabsTrigger>
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
                                            <div className="flex items-center gap-2">
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    className="h-8 w-8"
                                                    onClick={() => handleLike(article.id)}
                                                >
                                                    <Heart
                                                        className={cn(
                                                            "h-4 w-4 transition-colors",
                                                            article.isLiked
                                                                ? "fill-red-500 text-red-500"
                                                                : "text-slate-400 hover:text-red-500"
                                                        )}
                                                    />
                                                </Button>
                                                <span className="text-xs text-muted-foreground">
                                                    {new Date(article.publishedAt).toLocaleDateString()}
                                                </span>
                                            </div>
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

                <TabsContent value="liked" className="mt-6">
                    {articles.filter(a => a.isLiked).length === 0 ? (
                        <div className="text-center py-12 text-muted-foreground border rounded-lg border-dashed">
                            <Heart className="h-12 w-12 mx-auto mb-4 opacity-20" />
                            <p>No liked articles yet</p>
                            <p className="text-sm mt-2">Click the heart icon on articles you want to save</p>
                        </div>
                    ) : (
                        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                            {articles.filter(a => a.isLiked).map((article) => (
                                <Card key={article.id} className="flex flex-col border-l-4 border-l-red-500">
                                    <CardHeader>
                                        <div className="flex justify-between items-start mb-2">
                                            <Badge variant="secondary">{article.feed?.name || "RSS"}</Badge>
                                            <div className="flex items-center gap-2">
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    className="h-8 w-8"
                                                    onClick={() => handleLike(article.id)}
                                                >
                                                    <Heart className="h-4 w-4 fill-red-500 text-red-500" />
                                                </Button>
                                                <span className="text-xs text-muted-foreground">
                                                    {new Date(article.publishedAt).toLocaleDateString()}
                                                </span>
                                            </div>
                                        </div>
                                        <CardTitle className="leading-snug text-lg line-clamp-2">
                                            <a href={article.url} target="_blank" rel="noopener noreferrer" className="hover:underline">
                                                {article.title}
                                            </a>
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent className="flex-1">
                                        <p className="text-sm text-muted-foreground line-clamp-3">
                                            {article.summary || ""}
                                        </p>
                                    </CardContent>
                                    <CardFooter className="flex gap-2">
                                        <Button
                                            className="flex-1"
                                            variant="default"
                                            onClick={() => handleGenerateSocial(article.id)}
                                            disabled={generatingPost === article.id}
                                        >
                                            {generatingPost === article.id ? (
                                                <>
                                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                                    Generating...
                                                </>
                                            ) : (
                                                <>
                                                    <Sparkles className="mr-2 h-4 w-4" />
                                                    Generate Posts
                                                </>
                                            )}
                                        </Button>
                                    </CardFooter>
                                </Card>
                            ))}
                        </div>
                    )}
                </TabsContent>

                <TabsContent value="saved" className="mt-6">

                    {/* Social Media Preview Article Dialog */}
                    <Dialog open={isSocialOpen} onOpenChange={setIsSocialOpen}>
                        <DialogContent className="sm:max-w-[600px] max-h-[85vh] flex flex-col p-0">
                            <DialogHeader className="px-6 py-4 border-b">
                                <DialogTitle>Social Media Generator</DialogTitle>
                                <DialogDescription>
                                    AI-generated posts based on "{selectedArticle?.title}"
                                </DialogDescription>
                            </DialogHeader>
                            <div className="flex-1 overflow-y-auto p-6">
                                <Tabs defaultValue="linkedin">
                                    <TabsList className="grid w-full grid-cols-2 mb-4">
                                        <TabsTrigger value="linkedin">LinkedIn</TabsTrigger>
                                        <TabsTrigger value="twitter">Twitter / X</TabsTrigger>
                                    </TabsList>

                                    <TabsContent value="linkedin" className="space-y-4 m-0">
                                        <div className="space-y-2">
                                            <Label>Tone of Voice</Label>
                                            <Select value={linkedinTone} onValueChange={setLinkedinTone}>
                                                <SelectTrigger>
                                                    <SelectValue />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="professional">Professional & Insightful</SelectItem>
                                                    <SelectItem value="casual">Casual & Storytelling</SelectItem>
                                                    <SelectItem value="educational">Educational & How-to</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </div>
                                        <div className="rounded-md bg-muted p-4 text-sm whitespace-pre-wrap">
                                            {linkedinTone === "professional" && (
                                                <>
                                                    🚀 <strong>New Insights on this topic</strong>{"\n\n"}
                                                    I just read "{selectedArticle?.title}" and found it fascinating.{"\n\n"}
                                                    {selectedArticle?.summary}{"\n\n"}
                                                    What are your thoughts? #Tech #Innovation
                                                </>
                                            )}
                                            {/* Simplified templates for MVP */}
                                            {linkedinTone !== "professional" && "Content generation pending..."}
                                        </div>

                                        <div className="space-y-2">
                                            {!linkedinConnected ? (
                                                <Button className="w-full bg-[#0077b5] hover:bg-[#005e93] text-white" onClick={() => setLinkedinConnected(true)}>
                                                    Connect LinkedIn Account
                                                </Button>
                                            ) : (
                                                <Button
                                                    className="w-full bg-[#0077b5] hover:bg-[#005e93] text-white"
                                                    disabled={isPosting}
                                                    onClick={() => handlePost('linkedin')}
                                                >
                                                    {isPosting ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Posting...</> : "Post to LinkedIn Now"}
                                                </Button>
                                            )}
                                            {/* Planner Integration */}
                                            <div className="flex gap-2">
                                                <Popover>
                                                    <PopoverTrigger asChild>
                                                        <Button
                                                            variant={"outline"}
                                                            className={cn(
                                                                "flex-1 justify-start text-left font-normal",
                                                                !scheduleDate && "text-muted-foreground"
                                                            )}
                                                        >
                                                            <CalendarIcon className="mr-2 h-4 w-4" />
                                                            {scheduleDate ? scheduleDate.toLocaleDateString() : <span>Pick a date</span>}
                                                        </Button>
                                                    </PopoverTrigger>
                                                    <PopoverContent className="w-auto p-0" align="start">
                                                        <Calendar
                                                            mode="single"
                                                            selected={scheduleDate}
                                                            onSelect={setScheduleDate}
                                                            initialFocus
                                                        />
                                                    </PopoverContent>
                                                </Popover>
                                                <Button variant="secondary" onClick={() => handleSchedule('linkedin')}>
                                                    Schedule in Planner
                                                </Button>
                                            </div>
                                        </div>
                                    </TabsContent>

                                    <TabsContent value="twitter" className="space-y-4 m-0">
                                        <div className="space-y-2">
                                            <Label>Thread Style</Label>
                                            <Select value={twitterTone} onValueChange={setTwitterTone}>
                                                <SelectTrigger>
                                                    <SelectValue />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="hooky">Viral / Hooky</SelectItem>
                                                    <SelectItem value="direct">Direct / News</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </div>
                                        <div className="rounded-md bg-muted p-4 text-sm whitespace-pre-wrap">
                                            🧵 {selectedArticle?.title}{"\n\n"}
                                            {selectedArticle?.summary ? selectedArticle.summary.substring(0, 100) + "..." : "Check this out."}
                                        </div>

                                        <div className="space-y-2">
                                            {!twitterConnected ? (
                                                <Button className="w-full bg-black hover:bg-zinc-800 text-white dark:bg-white dark:text-black dark:hover:bg-zinc-200" onClick={() => setTwitterConnected(true)}>
                                                    Connect X (Twitter) Account
                                                </Button>
                                            ) : (
                                                <Button
                                                    className="w-full bg-black hover:bg-zinc-800 text-white dark:bg-white dark:text-black dark:hover:bg-zinc-200"
                                                    disabled={isPosting}
                                                    onClick={() => handlePost('twitter')}
                                                >
                                                    {isPosting ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Posting...</> : "Post to X Now"}
                                                </Button>
                                            )}
                                            {/* Planner Integration */}
                                            <div className="flex gap-2">
                                                <Popover>
                                                    <PopoverTrigger asChild>
                                                        <Button
                                                            variant={"outline"}
                                                            className={cn(
                                                                "flex-1 justify-start text-left font-normal",
                                                                !scheduleDate && "text-muted-foreground"
                                                            )}
                                                        >
                                                            <CalendarIcon className="mr-2 h-4 w-4" />
                                                            {scheduleDate ? scheduleDate.toLocaleDateString() : <span>Pick a date</span>}
                                                        </Button>
                                                    </PopoverTrigger>
                                                    <PopoverContent className="w-auto p-0" align="start">
                                                        <Calendar
                                                            mode="single"
                                                            selected={scheduleDate}
                                                            onSelect={setScheduleDate}
                                                            initialFocus
                                                        />
                                                    </PopoverContent>
                                                </Popover>
                                                <Button variant="secondary" onClick={() => handleSchedule('twitter')}>
                                                    Schedule in Planner
                                                </Button>
                                            </div>
                                        </div>
                                    </TabsContent>
                                </Tabs>
                            </div>
                        </DialogContent>
                    </Dialog>
                </div>
                )
}
