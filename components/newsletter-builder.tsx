"use client"

import { useState } from "react"
import { ArticleData } from "./article-feed" // Reuse interface
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Trash2, GripVertical, Mail, Download, Send, Sparkles } from "lucide-react"
import { toast } from "sonner"
import { saveNewsletter } from "@/lib/actions"

interface NewsletterBuilderProps {
    availableArticles: ArticleData[]
}

export function NewsletterBuilder({ availableArticles }: NewsletterBuilderProps) {
    const [selectedArticles, setSelectedArticles] = useState<ArticleData[]>([])
    const [subjectLine, setSubjectLine] = useState("Weekly Digest: The Future of Tech 🚀")
    const [introText, setIntroText] = useState("Welcome to this week's curated newsletter. Here are the stories that caught my eye.")
    const [outroText, setOutroText] = useState("Thanks for reading! See you next week.")
    const [isSaving, setIsSaving] = useState(false)

    const handleDragStart = (e: React.DragEvent, article: ArticleData) => {
        e.dataTransfer.setData("articleId", article.id)
    }

    const handleDrop = (e: React.DragEvent) => {
        const articleId = e.dataTransfer.getData("articleId")
        const article = availableArticles.find((a) => a.id === articleId)
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

    const handleSave = async () => {
        if (selectedArticles.length === 0) {
            toast.error("Please add at least one article.")
            return
        }
        setIsSaving(true)
        try {
            await saveNewsletter({
                title: subjectLine,
                intro: introText,
                outro: outroText,
                articleIds: selectedArticles.map(a => a.id)
            })
            toast.success("Newsletter saved as Draft!")
        } catch (error) {
            toast.error("Failed to save newsletter.")
        } finally {
            setIsSaving(false)
        }
    }

    return (
        <div className="grid h-[calc(100vh-6rem)] gap-6 lg:grid-cols-2">
            {/* Left Panel: Source Articles */}
            <div className="flex flex-col gap-6 overflow-hidden">
                <div className="space-y-2">
                    <h1 className="text-3xl font-bold tracking-tight">Newsletter Builder</h1>
                    <p className="text-muted-foreground">Drag articles to build your issue.</p>
                </div>

                <Card className="flex-1 overflow-auto">
                    <CardHeader>
                        <CardTitle className="text-sm font-medium">Available Articles (From Your Feeds)</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        {availableArticles.length === 0 ? (
                            <p className="text-sm text-muted-foreground">No articles found. Go to "Article Feed" and refresh sources.</p>
                        ) : availableArticles.map(article => (
                            <div
                                key={article.id}
                                draggable
                                onDragStart={(e) => handleDragStart(e, article)}
                                className="flex items-start gap-4 rounded-lg border p-3 hover:bg-muted cursor-move active:opacity-50"
                            >
                                <GripVertical className="h-5 w-5 text-muted-foreground mt-1" />
                                <div>
                                    <h4 className="font-semibold text-sm line-clamp-1">{article.title}</h4>
                                    <p className="text-xs text-muted-foreground">{article.feed?.name || "RSS"} • {new Date(article.publishedAt).toLocaleDateString()}</p>
                                </div>
                            </div>
                        ))}
                    </CardContent>
                </Card>
            </div>

            {/* Right Panel: The Newsletter Preview */}
            <div className="flex flex-col gap-6 overflow-hidden">
                <div className="flex justify-between items-center bg-background py-1">
                    <div className="flex items-center gap-2">
                        <Badge variant="secondary"><Sparkles className="mr-1 h-3 w-3" /> Drag & Drop Editor</Badge>
                    </div>
                    <div className="flex gap-2">
                        <Button variant="outline" size="sm" onClick={handleSave} disabled={isSaving}>
                            <Download className="mr-2 h-4 w-4" />
                            {isSaving ? "Saving..." : "Save Draft"}
                        </Button>
                        <Button size="sm" onClick={() => toast.success("Email sent to test recipients!")}>
                            <Send className="mr-2 h-4 w-4" /> Send Test
                        </Button>
                    </div>
                </div>

                <div
                    className="flex-1 overflow-auto rounded-xl border bg-white text-slate-900 shadow-sm p-8"
                    onDrop={handleDrop}
                    onDragOver={handleAllowDrop}
                >
                    <div className="mx-auto max-w-[600px] space-y-8 font-sans">
                        <div className="border-b pb-6 text-center">
                            <h2 className="text-2xl font-bold text-slate-800">NewsWeave Weekly</h2>
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
                                className="border-none resize-none p-0 text-base focus-visible:ring-0 text-slate-600 leading-relaxed min-h-[80px]"
                                value={introText}
                                onChange={(e) => setIntroText(e.target.value)}
                            />
                        </div>

                        {/* Active Articles Area */}
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
                                            {article.summary === "AI summary pending..." ? "Summary coming soon..." : article.summary}
                                        </p>
                                        <a href={article.url} target="_blank" className="flex items-center text-blue-600 text-sm font-semibold hover:underline">
                                            Read more on {article.feed?.name || "Source"} →
                                        </a>
                                    </div>
                                ))
                            )}
                        </div>

                        {/* Custom Outro */}
                        <div className="prose prose-slate max-w-none border-t pt-6">
                            <span className="text-xs text-slate-300 font-bold uppercase tracking-wider mb-1 block">Outro</span>
                            <Textarea
                                className="border-none resize-none p-0 text-base focus-visible:ring-0 text-slate-600 min-h-[60px]"
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
