"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import Link from "next/link"
import { Check, Plus, ArrowRight, Rss } from "lucide-react"

// Mock Interests Data
const INTERESTS = [
    "Technology", "Marketing", "Startups", "AI", "Design",
    "Business", "Crypto", "Productivity", "Writing", "Science",
    "Health", "Politics", "Finance", "SaaS", "Indie Hacking"
]

// Mock Feeds Suggestions
const FEED_SUGGESTIONS: Record<string, { name: string, url: string }[]> = {
    "Technology": [
        { name: "TechCrunch", url: "techcrunch.com" },
        { name: "The Verge", url: "theverge.com" },
        { name: "Hacker News", url: "news.ycombinator.com" }
    ],
    "Marketing": [
        { name: "Marketing Land", url: "marketingland.com" },
        { name: "HubSpot Blog", url: "blog.hubspot.com" },
        { name: "Neil Patel", url: "neilpatel.com" }
    ],
    "Startups": [
        { name: "Indie Hackers", url: "indiehackers.com" },
        { name: "Y Combinator", url: "ycombinator.com/blog" }
    ],
    "AI": [
        { name: "OpenAI Blog", url: "openai.com/blog" },
        { name: "MIT AI News", url: "news.mit.edu/topic/artificial-intelligence2" }
    ],
    // Fallback for others
    "default": [
        { name: "Medium Top", url: "medium.com" },
        { name: "Wired", url: "wired.com" }
    ]
}

export default function OnboardingPage() {
    const [step, setStep] = useState(1)
    const [name, setName] = useState("")
    const [selectedInterests, setSelectedInterests] = useState<string[]>([])
    const [selectedFeeds, setSelectedFeeds] = useState<string[]>([])
    const [customFeed, setCustomFeed] = useState("")

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
            if (selectedFeeds.length < 3) {
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

    return (
        <div className="w-full max-w-2xl mx-auto">
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
                        <p className="text-slate-500">Choose three or more.</p>
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
                        <p className="text-slate-500">We found these based on your interests. Select up to 3 to start.</p>
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
                                    <span className="font-medium text-slate-900">{feed.name}</span>
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
                                    // Just a mock action
                                    setCustomFeed("")
                                    alert("Custom feed added!")
                                }
                            }}>Add</Button>
                        </div>
                    </div>

                    <div className="pt-8">
                        <Button
                            className="bg-emerald-600 hover:bg-emerald-700 text-white h-12 px-12 rounded-full text-lg shadow-lg hover:shadow-xl transition-all"
                            asChild
                        >
                            <Link href="/dashboard">Finish & Go to Dashboard</Link>
                        </Button>
                    </div>
                </div>
            )}
        </div>
    )
}
