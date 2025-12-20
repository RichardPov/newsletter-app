"use client"

import { useEffect, useState } from "react"
import { useAppStore, Article } from "@/lib/store"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Sparkles, Share2, TrendingUp, CheckCircle, FileText, Calendar as CalendarIcon, Loader2 } from "lucide-react"
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
// import { toast } from "@/hooks/use-toast" // Replaced with alert for now to avoid dependency issues or use sonner if available
import { toast } from "sonner"

// Mock Data Generators
const generateMockArticles = (count: number): Article[] => {
    const titles = [
        "The Future of AI is Agentic: Why Chatbots are Dead",
        "DeepDeepMind's New Model Solves Math Problems 10x Faster",
        "TechCrunch Disrupt 2024: Top 5 Startups to Watch",
        "Why Marketing Teams are Switching to Decentralized Social",
        "Apple's Vision Pro 2: Leaked Specs Reveal Lightweight Design",
        "The End of SEO: How Search Generative Experience Changes Everything",
        "Tesla's Robotaxis Finally Get Regulatory Approval in CA",
        "Next.js 15 Released: Turbopack is Now Stable",
        "How to Scale Your SaaS from $0 to $1M ARR in 6 Months",
        "The state of Venture Capital in Q4 2025"
    ]

    return Array.from({ length: count }).map((_, i) => ({
        id: `art-${i}-${Date.now()}`,
        title: titles[i % titles.length],
        source: i % 2 === 0 ? "TechCrunch" : "The Verge",
        date: new Date(Date.now() - i * 86400000).toLocaleDateString(),
        url: "#",
        summary: "This is a placeholder summary. The AI would usually analyze the full text and extract key insights based on your tone profile.",
        viralScore: Math.floor(Math.random() * 10) + 1,
        keyTakeaways: ["AI agents are the future", "Efficiency is up 50%", "Investors are bullish"],
        category: i % 3 === 0 ? 'Tech' : i % 3 === 1 ? 'Marketing' : 'Business'
    }))
}

export default function ArticlesPage() {
    const { articles, setArticles, toneProfile } = useAppStore()
    const [selectedArticle, setSelectedArticle] = useState<Article | null>(null)
    const [isSocialOpen, setIsSocialOpen] = useState(false)
    const [twitterTone, setTwitterTone] = useState("hooky")
    const [linkedinTone, setLinkedinTone] = useState("professional")

    const [twitterConnected, setTwitterConnected] = useState(false)
    const [linkedinConnected, setLinkedinConnected] = useState(false)
    const [isPosting, setIsPosting] = useState(false)
    const [scheduleDate, setScheduleDate] = useState<Date | undefined>(new Date())

    // Initial Data Load
    useEffect(() => {
        if (articles.length === 0) {
            setArticles(generateMockArticles(6))
        }
    }, [articles.length, setArticles])

    const handleOpenSocial = (article: Article) => {
        setSelectedArticle(article)
        setIsSocialOpen(true)
    }

    const handlePost = async (platform: 'twitter' | 'linkedin') => {
        setIsPosting(true)
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1500))
        setIsPosting(false)
        // toast({ title: "Posted!", description: `Successfully posted to ${platform === 'twitter' ? 'X (Twitter)' : 'LinkedIn'}! 🚀` })
        toast.success(`Successfully posted to ${platform === 'twitter' ? 'X (Twitter)' : 'LinkedIn'}! 🚀`)
    }

    const handleSchedule = (platform: 'twitter' | 'linkedin') => {
        if (!scheduleDate) {
            toast.error("Please pick a date first.")
            return
        }
        // toast({ title: "Scheduled!", description: `${platform === 'twitter' ? 'X' : 'LinkedIn'} post scheduled for ${scheduleDate.toLocaleDateString()}` })
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
                    {toneProfile ? (
                        <Badge variant="outline" className="text-green-600 border-green-200 bg-green-50">
                            <CheckCircle className="mr-1 h-3 w-3" /> Tone: {toneProfile.name}
                        </Badge>
                    ) : (
                        <Badge variant="outline" className="text-amber-600 border-amber-200 bg-amber-50">
                            Tone: Default (Generic)
                        </Badge>
                    )}
                </div>
            </div>

            <Tabs defaultValue="all" className="w-full">
                <TabsList>
                    <TabsTrigger value="all">All Articles</TabsTrigger>
                    <TabsTrigger value="tech">Tech</TabsTrigger>
                    <TabsTrigger value="marketing">Marketing</TabsTrigger>
                    <TabsTrigger value="business">Business</TabsTrigger>
                </TabsList>

                <TabsContent value="all" className="mt-6">
                    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                        {articles.map((article) => (
                            <Card key={article.id} className="flex flex-col">
                                <CardHeader>
                                    <div className="flex justify-between items-start mb-2">
                                        <Badge variant="secondary">{article.source}</Badge>
                                        <span className="text-xs text-muted-foreground">{article.date}</span>
                                    </div>
                                    <CardTitle className="leading-snug text-lg">
                                        {article.title}
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="flex-1">
                                    <div className="mb-4">
                                        <p className="text-sm text-muted-foreground line-clamp-3">
                                            {toneProfile ? (
                                                <span className="text-blue-600 font-medium italic pr-1">
                                                    [{toneProfile.style}]
                                                </span>
                                            ) : null}
                                            {article.summary}
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
                                    <Button className="flex-1" variant="default" onClick={() => { }}>
                                        <FileText className="mr-2 h-4 w-4" /> Add to Newsletter
                                    </Button>
                                    <Button size="icon" variant="outline" onClick={() => handleOpenSocial(article)}>
                                        <Share2 className="h-4 w-4" />
                                    </Button>
                                </CardFooter>
                            </Card>
                        ))}
                    </div>
                </TabsContent>
                {/* Other tabs would filter the list, but keeping it simple for MVP */}
            </Tabs>

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
                        <Tabs defaultValue="angles">
                            <TabsList className="grid w-full grid-cols-2 lg:grid-cols-3 mb-4">
                                <TabsTrigger value="angles">Angles</TabsTrigger>
                                <TabsTrigger value="linkedin">LinkedIn</TabsTrigger>
                                <TabsTrigger value="twitter">Twitter / X</TabsTrigger>
                            </TabsList>

                            <TabsContent value="angles" className="space-y-4 m-0">
                                <div className="space-y-4">
                                    <div className="rounded-lg border p-4">
                                        <h4 className="font-semibold text-sm mb-1 text-indigo-600">Tech Enthusiast Angle</h4>
                                        <p className="text-sm text-muted-foreground">Focuses on specs, performance, and innovation.</p>
                                        <p className="text-sm mt-2 border-l-2 border-indigo-200 pl-3 italic">"The new architecture improves efficiency by 40%..."</p>
                                    </div>
                                    <div className="rounded-lg border p-4">
                                        <h4 className="font-semibold text-sm mb-1 text-pink-600">Marketing Pro Angle</h4>
                                        <p className="text-sm text-muted-foreground">Focuses on user acquisition and market impact.</p>
                                        <p className="text-sm mt-2 border-l-2 border-pink-200 pl-3 italic">"This shift opens up a new channel for brand engagement..."</p>
                                    </div>
                                    <div className="rounded-lg border p-4">
                                        <h4 className="font-semibold text-sm mb-1 text-emerald-600">Business Strategist Angle</h4>
                                        <p className="text-sm text-muted-foreground">Focuses on revenue, stock impact, and competitive advantage.</p>
                                        <p className="text-sm mt-2 border-l-2 border-emerald-200 pl-3 italic">"Investors should watch this space as it disrupts the $5B market..."</p>
                                    </div>
                                </div>
                            </TabsContent>

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
                                            🚀 <strong>New Insights on {selectedArticle?.category}</strong>{"\n\n"}
                                            The landscape of {selectedArticle?.category} is shifting rapidly. I just analyzed "{selectedArticle?.title}" from {selectedArticle?.source} and wanted to share the critical implications for our industry.{"\n\n"}
                                            <strong>Key Strategic Takeaways:</strong>{"\n"}
                                            {selectedArticle?.keyTakeaways.map(t => `• ${t}\n`)}
                                            {"\n"}
                                            What are your thoughts on this development?{"\n\n"}
                                            #TechNews #Innovation #Strategy #{selectedArticle?.category}
                                        </>
                                    )}
                                    {linkedinTone === "casual" && (
                                        <>
                                            👋 <strong>Guys, you need to see this.</strong>{"\n\n"}
                                            Just read about {selectedArticle?.title} and my mind is blown. 🤯{"\n\n"}
                                            Basically, {selectedArticle?.source} is saying everything we know about {selectedArticle?.category} is about to change.{"\n\n"}
                                            Here's the TL;DR:{"\n"}
                                            {selectedArticle?.keyTakeaways.map(t => `👉 ${t}\n`)}
                                            {"\n"}
                                            Agree or disagree? Let's discuss in the comments! 👇{"\n\n"}
                                            #Growth #Mindset #{selectedArticle?.category}
                                        </>
                                    )}
                                    {linkedinTone === "educational" && (
                                        <>
                                            📚 <strong>Today I Learned: {selectedArticle?.title}</strong>{"\n\n"}
                                            If you're working in {selectedArticle?.category}, here is what you need to know about the latest update from {selectedArticle?.source}.{"\n\n"}
                                            <strong>3 Things You Must Know:</strong>{"\n"}
                                            {selectedArticle?.keyTakeaways.map((t, i) => `${i + 1}. ${t}\n`)}
                                            {"\n"}
                                            Save this post for later reference! 📌{"\n\n"}
                                            #Learning #Tips #{selectedArticle?.category}
                                        </>
                                    )}
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
                                            <SelectItem value="contrarian">Contrarian / Hot Take</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="rounded-md bg-muted p-4 text-sm whitespace-pre-wrap">
                                    {twitterTone === "hooky" && (
                                        <>
                                            1/5 🧵 {selectedArticle?.title}{"\n\n"}
                                            This changes EVERYTHING for {selectedArticle?.category}. 🤯{"\n\n"}
                                            Most people are ignoring this, but here is why you shouldn't:{"\n\n"}
                                            👇 Breakdown below
                                        </>
                                    )}
                                    {twitterTone === "direct" && (
                                        <>
                                            🚨 BREAKING: {selectedArticle?.source} reports {selectedArticle?.title}{"\n\n"}
                                            Key details:{"\n"}
                                            - {selectedArticle?.keyTakeaways[0]}{"\n"}
                                            - {selectedArticle?.keyTakeaways[1]}{"\n"}
                                            - {selectedArticle?.keyTakeaways[2]}{"\n\n"}
                                            Full link in bio. 🔗
                                        </>
                                    )}
                                    {twitterTone === "contrarian" && (
                                        <>
                                            Everyone is excited about {selectedArticle?.title}.{"\n\n"}
                                            Here is why they are wrong. 🧵👇{"\n\n"}
                                            (1/6)
                                        </>
                                    )}
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
