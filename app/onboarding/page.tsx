"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { useRouter } from "next/navigation"
import { Check, Plus, ArrowRight, Rss, Wand2, Loader2 } from "lucide-react"
import { completeOnboarding } from "@/lib/actions"
import { toast } from "sonner"

// Mock Interests Data
const INTERESTS = [
    "Technology", "Marketing", "Startups", "AI", "Design",
    "Business", "Crypto", "Productivity", "Writing", "Science",
    "Health", "Politics", "Finance", "SaaS", "Indie Hacking"
]

// Mock Feeds Suggestions
const FEED_SUGGESTIONS: Record<string, { name: string, url: string }[]> = {
    "Technology": [
        { name: "TechCrunch", url: "https://techcrunch.com/feed" },
        { name: "The Verge", url: "https://www.theverge.com/rss/index.xml" },
        { name: "Hacker News", url: "https://news.ycombinator.com/rss" }
    ],
    "Marketing": [
        { name: "Marketing Land", url: "https://marketingland.com/feed" },
        { name: "HubSpot Blog", url: "https://blog.hubspot.com/feed" },
        { name: "Neil Patel", url: "https://neilpatel.com/feed" }
    ],
    "Startups": [
        { name: "Indie Hackers", url: "https://www.indiehackers.com/feed" },
        { name: "Y Combinator", url: "https://blog.ycombinator.com/rss/" }
    ],
    "AI": [
        // { name: "OpenAI Blog", url: "openai.com/blog" }, // often hard to RSS, using wired instead
        { name: "Wired AI", url: "https://www.wired.com/feed/category/ai/latest/rss" }
    ],
    "default": [
        { name: "Medium Top", url: "https://medium.com/feed/topic/technology" },
        { name: "Wired", url: "https://www.wired.com/feed/rss" }
    ]
}

export default function OnboardingPage() {
    const router = useRouter()
    const [step, setStep] = useState(1)
    const [name, setName] = useState("")
    const [selectedInterests, setSelectedInterests] = useState<string[]>([])
    const [selectedFeeds, setSelectedFeeds] = useState<string[]>([])
    const [customFeed, setCustomFeed] = useState("")

    // Step 4 Tone
    const [toneMethod, setToneMethod] = useState<'url' | 'text'>('url')
    const [toneInput, setToneInput] = useState("")
    const [isSubmitting, setIsSubmitting] = useState(false)

    const handleNext = () => setStep(step + 1)

    const toggleInterest = (interest: string) => {
        if (selectedInterests.includes(interest)) {
            setSelectedInterests(selectedInterests.filter(i => i !== interest))
        } else {
            setSelectedInterests([...selectedInterests, interest])
        }
    }

    const toggleFeed = (feedUrl: string) => {
        if (selectedFeeds.includes(feedUrl)) {
            setSelectedFeeds(selectedFeeds.filter(f => f !== feedUrl))
        } else {
            if (selectedFeeds.length < 5) {
                setSelectedFeeds([...selectedFeeds, feedUrl])
            }
        }
    }

    // Get suggestions based on selected interests
    const getSuggestions = () => {
        let suggestions: { name: string, url: string }[] = []
        selectedInterests.forEach(interest => {
            const feeds = FEED_SUGGESTIONS[interest] || FEED_SUGGESTIONS["default"]
            suggestions = [...suggestions, ...feeds]
        })
        // Deduplicate
        return suggestions.filter((v, i, a) => a.findIndex(t => (t.url === v.url)) === i).slice(0, 9)
    }

    const handleFinish = async (skipTone = false) => {
        setIsSubmitting(true)
        try {
            console.log("Submitting onboarding...", { name, feeds: selectedFeeds, skipTone })

            // Call server action
            const result = await completeOnboarding({
                name,
                feeds: selectedFeeds,
                toneRawText: skipTone ? undefined : (toneInput || "Skipped")
            })

            // Check if server action returned success (implied void/success currently, but let's be safe)
            // If completeOnboarding throws, it goes to catch. 
            // If it returns { success: false }, we should handle it. 
            // Currently completeOnboarding returns { success: true } or throws.

            console.log("Onboarding action success, moving to step 5")
            setStep(5)
        } catch (e: any) {
            console.error("Onboarding failed:", e)
            toast.error("Failed to complete setup: " + (e.message || "Unknown error"))
            setIsSubmitting(false)
        }
    }

    // ... inside return ...
    // Add Step 5 block before end of component
    if (step === 5) {
        return (
            <div className="text-center space-y-8 animate-in fade-in zoom-in duration-500 pt-20">
                <div className="mx-auto w-24 h-24 bg-emerald-100 rounded-full flex items-center justify-center mb-6">
                    <Check className="h-12 w-12 text-emerald-600" />
                </div>
                <div>
                    <h1 className="text-3xl font-serif font-medium text-slate-900 mb-4">You're all set!</h1>
                    <p className="text-slate-500 max-w-md mx-auto">
                        Your dashboard is ready. We've started curating content based on your interests.
                    </p>
                </div>
                <Button
                    className="bg-slate-900 hover:bg-slate-800 text-white h-12 px-12 rounded-full text-lg"
                    onClick={() => router.push("/dashboard")}
                >
                    Go to Dashboard <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
            </div>
        )
    }

    return (
        <div className="w-full max-w-2xl mx-auto pt-10 px-4 pb-20">
            {/* Step 1: Welcome */}
            {step === 1 && (
                <div className="text-center space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                    <div className="mx-auto w-24 h-24 bg-slate-50 rounded-full flex items-center justify-center mb-6">
                        <span className="text-4xl">👋</span>
                    </div>
                    <div>
                        <h1 className="text-3xl font-serif font-medium text-slate-900 mb-2">Welcome to NewsWeave!</h1>
                        <p className="text-slate-500">Let's get your personal curator set up.</p>
                    </div>

                    <div className="max-w-sm mx-auto space-y-4">
                        <div className="space-y-2 text-left">
                            <label className="text-sm font-medium text-slate-700">What's your full name?</label>
                            <Input
                                placeholder="e.g. Richard Povysil"
                                className="h-12 text-lg"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                            />
                        </div>
                        <Button
                            className="w-full h-12 text-lg bg-slate-900 hover:bg-slate-800 text-white rounded-full"
                            onClick={handleNext}
                            disabled={!name}
                        >
                            Next <ArrowRight className="ml-2 h-4 w-4" />
                        </Button>
                    </div>
                </div>
            )}

            {/* Step 2: Interests */}
            {step === 2 && (
                <div className="text-center space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                    <div>
                        <h1 className="text-3xl font-serif font-medium text-slate-900 mb-4">What are you interested in?</h1>
                        <p className="text-slate-500">Choose three or more to get better suggestions.</p>
                    </div>

                    <div className="flex flex-wrap justify-center gap-3">
                        {INTERESTS.map(interest => (
                            <button
                                key={interest}
                                onClick={() => toggleInterest(interest)}
                                className={`px-6 py-3 rounded-full text-sm font-medium transition-all ${selectedInterests.includes(interest)
                                    ? "bg-emerald-600 text-white shadow-md scale-105"
                                    : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                                    }`}
                            >
                                <span className="flex items-center gap-2">
                                    {interest}
                                    {selectedInterests.includes(interest) ? <Check className="h-3 w-3" /> : <Plus className="h-3 w-3" />}
                                </span>
                            </button>
                        ))}
                    </div>

                    <div className="pt-8">
                        <Button
                            className="bg-slate-900 hover:bg-slate-800 text-white h-12 px-12 rounded-full text-lg"
                            onClick={handleNext}
                            disabled={selectedInterests.length < 1}
                        >
                            Continue
                        </Button>
                    </div>
                </div>
            )}

            {/* Step 3: Feeds */}
            {step === 3 && (
                <div className="text-center space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                    <div>
                        <h1 className="text-3xl font-serif font-medium text-slate-900 mb-4">Pick your sources</h1>
                        <p className="text-slate-500">Select at least one feed to start tracking.</p>
                    </div>

                    <div className="grid md:grid-cols-2 gap-4 text-left max-w-xl mx-auto">
                        {getSuggestions().map(feed => (
                            <div
                                key={feed.url}
                                onClick={() => toggleFeed(feed.url)}
                                className={`p-4 rounded-xl border cursor-pointer transition-all flex items-center justify-between ${selectedFeeds.includes(feed.url)
                                    ? "border-emerald-500 bg-emerald-50 ring-1 ring-emerald-500"
                                    : "border-slate-200 hover:border-slate-300 bg-white"
                                    }`}
                            >
                                <div className="flex items-center gap-3">
                                    <div className="bg-slate-100 p-2 rounded-lg">
                                        <Rss className="h-4 w-4 text-slate-600" />
                                    </div>
                                    <span className="font-medium text-slate-900 line-clamp-1">{feed.name}</span>
                                </div>
                                {selectedFeeds.includes(feed.url) && <Check className="h-4 w-4 text-emerald-600" />}
                            </div>
                        ))}
                    </div>

                    <div className="max-w-xl mx-auto pt-4 border-t border-slate-100 mt-4">
                        <p className="text-sm text-slate-500 mb-2 text-left">Or add your own RSS link:</p>
                        <div className="flex gap-2">
                            <Input
                                placeholder="https://example.com/feed"
                                value={customFeed}
                                onChange={(e) => setCustomFeed(e.target.value)}
                            />
                            <Button variant="outline" onClick={() => {
                                if (customFeed) {
                                    toggleFeed(customFeed)
                                    setCustomFeed("")
                                    toast.success("Custom feed selected")
                                }
                            }}>Add</Button>
                        </div>
                    </div>

                    <div className="pt-8">
                        <Button
                            className="bg-slate-900 hover:bg-slate-800 text-white h-12 px-12 rounded-full text-lg"
                            onClick={handleNext}
                            disabled={selectedFeeds.length < 1}
                        >
                            Continue
                        </Button>
                    </div>
                </div>
            )}

            {/* Step 4: Tone Analysis */}
            {step === 4 && (
                <div className="text-center space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                    <div>
                        <h1 className="text-3xl font-serif font-medium text-slate-900 mb-4">Train your AI Twin</h1>
                        <p className="text-slate-500">Paste your recent blog or LinkedIn post so we can mimic your style.</p>
                    </div>

                    <div className="max-w-xl mx-auto space-y-6 text-left">
                        <div className="grid grid-cols-2 gap-2 bg-slate-100 p-1 rounded-lg">
                            <button
                                className={`py-2 text-sm font-medium rounded-md transition-all ${toneMethod === 'url' ? 'bg-white shadow text-slate-900' : 'text-slate-500 hover:text-slate-900'}`}
                                onClick={() => setToneMethod('url')}
                            >
                                Paste URL
                            </button>
                            <button
                                className={`py-2 text-sm font-medium rounded-md transition-all ${toneMethod === 'text' ? 'bg-white shadow text-slate-900' : 'text-slate-500 hover:text-slate-900'}`}
                                onClick={() => setToneMethod('text')}
                            >
                                Paste Text
                            </button>
                        </div>

                        {toneMethod === 'url' ? (
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-slate-700">URL to your content</label>
                                <div className="relative">
                                    <Wand2 className="absolute left-3 top-3.5 h-4 w-4 text-slate-400" />
                                    <Input
                                        placeholder="https://medium.com/@richard/my-latest-post"
                                        className="pl-9 h-11"
                                        value={toneInput}
                                        onChange={(e) => setToneInput(e.target.value)}
                                    />
                                </div>
                                <p className="text-xs text-slate-500">We'll scan this page and analyze the writing structure.</p>
                            </div>
                        ) : (
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-slate-700">Paste your writing</label>
                                <Textarea
                                    placeholder="Paste 1-2 paragraphs here..."
                                    className="min-h-[150px]"
                                    value={toneInput}
                                    onChange={(e) => setToneInput(e.target.value)}
                                />
                            </div>
                        )}
                    </div>

                    <div className="pt-8 space-y-3">
                        <Button
                            className="bg-emerald-600 hover:bg-emerald-700 text-white h-12 px-12 rounded-full text-lg shadow-lg hover:shadow-xl transition-all w-full max-w-sm"
                            onClick={() => handleFinish(false)}
                            disabled={isSubmitting || !toneInput}
                        >
                            {isSubmitting ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Analyzing & Setting up...</> : "Analyze & Finish"}
                        </Button>
                        <br />
                        <button
                            onClick={() => handleFinish(true)}
                            className="text-sm text-slate-500 hover:text-slate-800 underline disabled:opacity-50"
                            disabled={isSubmitting}
                        >
                            Skip for now (I'll do this later)
                        </button>
                    </div>
                </div>
            )}
        </div>
    )
}
