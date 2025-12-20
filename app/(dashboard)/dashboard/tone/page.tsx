"use client"

import { useState } from "react"
import { useAppStore, UserTone } from "@/lib/store"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Loader2, Wand2, CheckCircle2 } from "lucide-react"
import { Badge } from "@/components/ui/badge"

export default function TonePage() {
    const { toneProfile, setToneProfile } = useAppStore()
    const [analyzing, setAnalyzing] = useState(false)
    const [inputText, setInputText] = useState("")

    const handleAnalyze = () => {
        if (!inputText) return
        setAnalyzing(true)

        // Mock AI Analysis
        setTimeout(() => {
            const mockProfile: UserTone = {
                name: "My Sarcastic Tech Persona",
                description: "A witty, slightly cynical take on technology trends.",
                style: "sarcastic",
                keywords: ["witty", "cynical", "sharp", "tech-savvy"]
            }
            setToneProfile(mockProfile)
            setAnalyzing(false)
        }, 2000)
    }

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">Tone of Voice</h1>
                <p className="text-muted-foreground">
                    Teach NewsWeave to write like you.
                </p>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
                {/* Upload / Input Section */}
                <Card>
                    <CardHeader>
                        <CardTitle>Upload Writings</CardTitle>
                        <CardDescription>Paste 3-5 examples of your past newsletters or blog posts.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Textarea
                            placeholder="Paste your text here..."
                            className="min-h-[300px]"
                            value={inputText}
                            onChange={(e) => setInputText(e.target.value)}
                        />
                    </CardContent>
                    <CardFooter>
                        <Button onClick={handleAnalyze} disabled={analyzing || !inputText} className="w-full">
                            {analyzing ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Analyzing Style...
                                </>
                            ) : (
                                <>
                                    <Wand2 className="mr-2 h-4 w-4" /> Analyze Tone
                                </>
                            )}
                        </Button>
                    </CardFooter>
                </Card>

                {/* Results Section */}
                <Card className="flex flex-col">
                    <CardHeader>
                        <CardTitle>Your Tone Profile</CardTitle>
                        <CardDescription>How AI will write your summaries.</CardDescription>
                    </CardHeader>
                    <CardContent className="flex-1">
                        {toneProfile ? (
                            <div className="space-y-4">
                                <div className="flex items-center gap-2 text-green-600">
                                    <CheckCircle2 className="h-5 w-5" />
                                    <span className="font-medium">Profile Active</span>
                                </div>
                                <div className="space-y-2 rounded-lg border p-4 bg-muted/50">
                                    <h3 className="font-semibold">{toneProfile.name}</h3>
                                    <p className="text-sm text-muted-foreground">{toneProfile.description}</p>
                                    <div className="flex flex-wrap gap-2 mt-2">
                                        <Badge variant="secondary">{toneProfile.style}</Badge>
                                        {toneProfile.keywords.map(k => (
                                            <Badge key={k} variant="outline">{k}</Badge>
                                        ))}
                                    </div>
                                </div>

                                <div className="rounded-lg border p-4 border-blue-200 bg-blue-50 dark:bg-blue-950 dark:border-blue-900">
                                    <h4 className="text-sm font-semibold text-blue-800 dark:text-blue-200 mb-2">AI Simulation</h4>
                                    <p className="text-sm italic text-slate-600 dark:text-slate-300">
                                        "This is an example of how I'll rewrite articles. I'll keep it short, punchy, and maybe a little snarky, just like you prefer."
                                    </p>
                                </div>
                            </div>
                        ) : (
                            <div className="flex h-full flex-col items-center justify-center text-center text-muted-foreground p-8">
                                <Wand2 className="h-12 w-12 mb-4 opacity-20" />
                                <p>Analyze your writing to generate a tone profile.</p>
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}
