"use client"

import { useState } from "react"
import { useAppStore, Article } from "@/lib/store"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Trash2, GripVertical, Mail, Download, Send, Eye, Sparkles, AlertCircle, ArrowRight } from "lucide-react"
import Link from "next/link"

export default function NewsletterPage() {
    const { articles, toneProfile } = useAppStore()
    const [selectedArticles, setSelectedArticles] = useState<Article[]>([])
    const [subjectLine, setSubjectLine] = useState("Weekly Digest: The Future of Tech 🚀") // Default subject
    const [introText, setIntroText] = useState("Welcome to this week's curated newsletter. Here are the stories that caught my eye.")
    const [outroText, setOutroText] = useState("Thanks for reading! See you next week.")
    const [style, setStyle] = useState("professional")

    const handleDragStart = (e: React.DragEvent, article: Article) => {
        e.dataTransfer.setData("articleId", article.id)
    }

    const handleDrop = (e: React.DragEvent) => {
        const articleId = e.dataTransfer.getData("articleId")
        const article = articles.find((a) => a.id === articleId)
        if (article && !selectedArticles.find((a) => a.id === article.id)) {
            setSelectedArticles([...selectedArticles, article])
        }
    }

    const handleAllowDrop = (e: React.DragEvent) => {
        e.preventDefault()
    }

    const removeArticle = (id: string) => {
        setSelectedArticles(selectedArticles.filter((a) => a.id !== id))
    }

    // Check if custom tone is selected but not configured
    const isMissingTone = style === "custom" && !toneProfile

    return (
        <div className="grid h-[calc(100vh-6rem)] gap-6 lg:grid-cols-2">
            {/* Left Panel: Source Articles & Builder Input */}
            <div className="flex flex-col gap-6 overflow-hidden">
                <div className="space-y-2">
                    <h1 className="text-3xl font-bold tracking-tight">Newsletter Builder</h1>
                    <p className="text-muted-foreground">Drag articles to build your issue.</p>
                </div>

                <Card className="flex-1 overflow-auto">
                    <CardHeader>
                        <CardTitle className="text-sm font-medium">Available Articles</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        {articles.map(article => (
                            <div
                                key={article.id}
                                draggable
                                onDragStart={(e) => handleDragStart(e, article)}
                                className="flex items-start gap-4 rounded-lg border p-3 hover:bg-muted cursor-move active:opacity-50"
                            >
                                <GripVertical className="h-5 w-5 text-muted-foreground mt-1" />
                                <div>
                                    <h4 className="font-semibold text-sm line-clamp-1">{article.title}</h4>
                                    <p className="text-xs text-muted-foreground">{article.source} • {article.date}</p>
                                </div>
                            </div>
                        ))}
                    </CardContent>
                </Card>
            </div>

            {/* Right Panel: The Newsletter Preview */}
            <div className="flex flex-col gap-6 overflow-hidden">
                <div className="flex flex-col gap-4">
                    <div className="flex justify-between items-center">
                        <div className="flex items-center gap-2">
                            <Select value={style} onValueChange={setStyle}>
                                <SelectTrigger className="w-[180px]">
                                    <SelectValue placeholder="Tone of Voice" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="professional">Professional</SelectItem>
                                    <SelectItem value="casual">Casual</SelectItem>
                                    <SelectItem value="sarcastic">Sarcastic</SelectItem>
                                    <SelectItem value="custom">
                                        <span className="flex items-center gap-1">
                                            <Sparkles className="h-3 w-3 text-emerald-500" /> My Custom Tone
                                        </span>
                                    </SelectItem>
                                </SelectContent>
                            </Select>
                            <Badge variant="secondary">Previewing: HTML</Badge>
                        </div>
                        <div className="flex gap-2">
                            <Button variant="outline" size="sm">
                                <Download className="mr-2 h-4 w-4" /> Export
                            </Button>
                            <Button size="sm">
                                <Send className="mr-2 h-4 w-4" /> Send Test
                            </Button>
                        </div>
                    </div>

                    {/* Alert for Missing Tone */}
                    {isMissingTone && (
                        <Alert variant="destructive" className="bg-red-50 border-red-200 text-red-800">
                            <AlertCircle className="h-4 w-4" />
                            <AlertTitle>Tone Profile Not Set</AlertTitle>
                            <AlertDescription className="flex items-center justify-between">
                                <span>You selected "My Custom Tone" but haven't analyzed your writing style yet.</span>
                                <Button variant="link" asChild className="text-red-900 underline font-bold px-0 ml-2">
                                    <Link href="/dashboard/tone">Set it up now <ArrowRight className="ml-1 h-3 w-3" /></Link>
                                </Button>
                            </AlertDescription>
                        </Alert>
                    )}
                </div>

                <div
                    className="flex-1 overflow-auto rounded-xl border bg-white text-slate-900 shadow-sm p-8"
                    onDrop={handleDrop}
                    onDragOver={handleAllowDrop}
                >
                    {/* Mock Email Template */}
                    <div className="mx-auto max-w-[600px] space-y-8 font-sans">
                        <div className="border-b pb-6 text-center">
                            <h2 className="text-2xl font-bold text-slate-800">NewsWeave Weekly</h2>

                            {/* Editable Subject Line Display */}
                            <div className="mt-4 bg-slate-50 p-3 rounded text-left border border-slate-100">
                                <span className="text-xs text-slate-400 font-bold uppercase tracking-wider block mb-1">Subject Line</span>
                                <Input
                                    className="border-none bg-transparent p-0 h-auto font-medium text-slate-700 focus-visible:ring-0"
                                    value={subjectLine}
                                    onChange={(e) => setSubjectLine(e.target.value)}
                                />
                            </div>
                        </div>

                        {/* Custom Intro */}
                        <div className="prose prose-slate max-w-none">
                            <span className="text-xs text-slate-300 font-bold uppercase tracking-wider mb-1 block">Intro</span>
                            <Textarea
                                className="border-none resize-none p-0 text-base focus-visible:ring-0 text-slate-600 leading-relaxed"
                                value={introText}
                                onChange={(e) => setIntroText(e.target.value)}
                            />
                        </div>

                        {/* Active Articles */}
                        <div className="space-y-8 min-h-[200px] rounded-lg border-2 border-dashed border-slate-200 p-4 transition-colors hover:border-blue-200 bg-slate-50/50">
                            {selectedArticles.length === 0 ? (
                                <div className="flex h-full flex-col items-center justify-center text-slate-400">
                                    <Mail className="h-10 w-10 mb-2 opacity-20" />
                                    <p className="text-sm">Drag articles here from the left sidebar</p>
                                </div>
                            ) : (
                                selectedArticles.map((article, index) => (
                                    <div key={article.id} className="group relative bg-white p-4 rounded-lg shadow-sm border border-slate-100">
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            className="absolute -right-2 -top-2 h-6 w-6 opacity-0 group-hover:opacity-100 bg-red-100 hover:bg-red-200 text-red-600 rounded-full"
                                            onClick={() => removeArticle(article.id)}
                                        >
                                            <Trash2 className="h-3 w-3" />
                                        </Button>
                                        <h3 className="text-xl font-bold text-slate-800 mb-2">
                                            {index + 1}. {article.title}
                                        </h3>
                                        <p className="text-slate-600 leading-relaxed mb-3">
                                            {/* Simulate tone application */}
                                            {style === 'custom' && toneProfile
                                                ? `[${toneProfile.name} Style]: ` + article.summary
                                                : article.summary}
                                        </p>
                                        <a href="#" className="flex items-center text-blue-600 text-sm font-semibold hover:underline">
                                            Read more on {article.source} →
                                        </a>
                                    </div>
                                ))
                            )}
                        </div>

                        {/* Custom Outro */}
                        <div className="prose prose-slate max-w-none border-t pt-6">
                            <span className="text-xs text-slate-300 font-bold uppercase tracking-wider mb-1 block">Outro</span>
                            <Textarea
                                className="border-none resize-none p-0 text-base focus-visible:ring-0 text-slate-600"
                                value={outroText}
                                onChange={(e) => setOutroText(e.target.value)}
                            />
                        </div>

                        <div className="text-center text-xs text-slate-400 pt-8">
                            <p>Sent via NewsWeave • Unsubscribe</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
