"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogFooter
} from "@/components/ui/dialog"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
    Loader2, Sparkles, Linkedin, Twitter, Calendar as CalendarIcon, Save, Check, Mic, PenTool, MessageSquare
} from "lucide-react"
import { generateSocialPosts } from "@/lib/social-actions"
import { savePost, updatePost } from "@/lib/post-actions"
import { toast } from "sonner"
import { useRouter } from "next/navigation"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Calendar } from "@/components/ui/calendar"
import { format } from "date-fns"
import { cn } from "@/lib/utils"

interface SocialPostGeneratorDialogProps {
    open: boolean
    onOpenChange: (open: boolean) => void
    articleId: string
    articleTitle: string
    customToneName?: string
}

const TONE_OPTIONS = [
    { value: "professional", label: "Professional", description: "Formal, business-appropriate" },
    { value: "casual", label: "Casual", description: "Friendly, conversational" },
    { value: "witty", label: "Witty", description: "Humor and clever wordplay" },
    { value: "inspirational", label: "Inspirational", description: "Motivational, uplifting" },
    { value: "educational", label: "Educational", description: "Teaching-focused, informative" },
]

const STYLE_OPTIONS = [
    { value: "viral", label: "Viral", description: "Hooks, controversy, emotion" },
    { value: "hooky", label: "Hooky", description: "Strong openings, curiosity gaps" },
    { value: "thread", label: "Thread", description: "Multi-part storytelling" },
    { value: "professional", label: "Professional", description: "Clean, authoritative" },
    { value: "story", label: "Story-driven", description: "Narrative arc" },
]

export function SocialPostGeneratorDialog({
    open,
    onOpenChange,
    articleId,
    articleTitle,
    customToneName
}: SocialPostGeneratorDialogProps) {
    const [step, setStep] = useState<"config" | "review">("config")

    // Config State
    const [selectedPlatforms, setSelectedPlatforms] = useState<string[]>(["LINKEDIN", "TWITTER"])
    const [linkedinTone, setLinkedinTone] = useState("professional")
    const [linkedinStyle, setLinkedinStyle] = useState("professional")
    const [twitterTone, setTwitterTone] = useState("witty")
    const [twitterStyle, setTwitterStyle] = useState("hooky")

    // ... rest of state
    const [scheduledDate, setScheduledDate] = useState<Date | undefined>()
    const [generatedIds, setGeneratedIds] = useState<{ linkedin?: string, twitter?: string }>({})
    const [generatedLinkedIn, setGeneratedLinkedIn] = useState("")
    const [generatedTwitter, setGeneratedTwitter] = useState("")
    const [activeTab, setActiveTab] = useState("linkedin")
    const [isSaving, setIsSaving] = useState(false)

    const [isGenerating, setIsGenerating] = useState(false)

    const handleGenerate = async () => {
        if (selectedPlatforms.length === 0) {
            toast.error("Select at least one platform")
            return
        }

        setIsGenerating(true)
        try {
            const result = await generateSocialPosts(articleId, {
                linkedinTone,
                linkedinStyle,
                twitterTone,
                twitterStyle,
                platforms: selectedPlatforms as ('LINKEDIN' | 'TWITTER')[]
            })
            // ... (rest of handling)

            if (result.success && result.posts) {
                const li = result.posts.linkedin?.content || ""
                const tw = result.posts.twitter?.content || ""

                // Store IDs so we can update them later instead of creating duplicates
                setGeneratedIds({
                    linkedin: result.posts.linkedin?.id,
                    twitter: result.posts.twitter?.id
                })

                setGeneratedLinkedIn(li)
                setGeneratedTwitter(tw)
                setStep("review")
            } else {
                toast.error("Failed to generate posts")
            }
        } catch (error) {
            toast.error("Something went wrong")
        } finally {
            setIsGenerating(false)
        }
    }

    const handleSave = async () => {
        setIsSaving(true)
        try {
            // Save currently active tab content
            const platform = activeTab === "linkedin" ? "LINKEDIN" : "TWITTER"
            const content = activeTab === "linkedin" ? generatedLinkedIn : generatedTwitter
            const existingId = activeTab === "linkedin" ? generatedIds.linkedin : generatedIds.twitter

            if (!content) {
                toast.error("No content to save")
                return
            }

            if (existingId) {
                // Update existing draft
                await updatePost(existingId, {
                    content,
                    scheduledFor: scheduledDate,
                    status: scheduledDate ? "SCHEDULED" : "DRAFT"
                })
            } else {
                // Fallback: Create new if for some reason ID is missing
                await savePost({
                    articleId,
                    platform,
                    content,
                    scheduledFor: scheduledDate,
                    status: scheduledDate ? "SCHEDULED" : "DRAFT"
                })
            }

            toast.success(scheduledDate ? "Post scheduled!" : "Draft saved!")
            onOpenChange(false)
            setStep("config") // Reset
            setGeneratedIds({}) // Reset IDs
            setScheduledDate(undefined)
            router.refresh()
        } catch (error) {
            toast.error("Failed to save post")
        } finally {
            setIsSaving(false)
        }
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className={cn(
                "flex flex-col gap-0 p-0 sm:max-w-[600px] max-h-[90vh] overflow-hidden",
                step === "review" && "sm:max-w-[900px]" // Wider for review
            )}>
                <DialogHeader className="px-6 py-4 border-b">
                    <DialogTitle className="flex items-center gap-2">
                        <Sparkles className="h-5 w-5 text-emerald-500" />
                        {step === "config" ? "Create Draft" : "Edit Draft & Schedule"}
                    </DialogTitle>
                    <DialogDescription>
                        {step === "config"
                            ? "Select platforms and customize the tone for your post."
                            : "Refine your content below before saving or scheduling."
                        }
                    </DialogDescription>
                </DialogHeader>

                <div className="flex-1 overflow-y-auto px-6 py-6">
                    {step === "config" ? (
                        <div className="space-y-8">
                            {/* Platform Selection */}
                            <div className="space-y-4">
                                <Label className="text-sm font-semibold text-foreground flex items-center gap-2">
                                    <span className="flex items-center justify-center w-5 h-5 rounded-full bg-blue-100 text-blue-600 text-[10px]">1</span>
                                    Choose Destinations
                                </Label>
                                <div className="grid grid-cols-2 gap-4">
                                    {/* LinkedIn Card */}
                                    <div
                                        className={cn(
                                            "relative flex items-center gap-4 p-4 rounded-xl border transition-all cursor-pointer hover:shadow-sm",
                                            selectedPlatforms.includes("LINKEDIN")
                                                ? "border-blue-600 bg-blue-50/50"
                                                : "border-border hover:border-blue-200"
                                        )}
                                        onClick={() => {
                                            if (selectedPlatforms.includes("LINKEDIN")) {
                                                setSelectedPlatforms(prev => prev.filter(p => p !== "LINKEDIN"))
                                            } else {
                                                setSelectedPlatforms(prev => [...prev, "LINKEDIN"])
                                            }
                                        }}
                                    >
                                        <div className={cn(
                                            "flex items-center justify-center h-5 w-5 rounded-full border transition-colors shrink-0",
                                            selectedPlatforms.includes("LINKEDIN") ? "bg-blue-600 border-blue-600" : "border-muted-foreground/30"
                                        )}>
                                            {selectedPlatforms.includes("LINKEDIN") && <Check className="h-3 w-3 text-white" />}
                                        </div>

                                        <div className="flex items-center gap-3">
                                            <div className="h-9 w-9 rounded-lg bg-blue-100 flex items-center justify-center shrink-0">
                                                <Linkedin className="h-5 w-5 text-blue-700" />
                                            </div>
                                            <span className="font-medium text-sm">LinkedIn</span>
                                        </div>
                                    </div>

                                    {/* Twitter Card */}
                                    <div
                                        className={cn(
                                            "relative flex items-center gap-4 p-4 rounded-xl border transition-all cursor-pointer hover:shadow-sm",
                                            selectedPlatforms.includes("TWITTER")
                                                ? "border-black dark:border-white bg-neutral-50/50 dark:bg-neutral-900/50"
                                                : "border-border hover:border-neutral-300"
                                        )}
                                        onClick={() => {
                                            if (selectedPlatforms.includes("TWITTER")) {
                                                setSelectedPlatforms(prev => prev.filter(p => p !== "TWITTER"))
                                            } else {
                                                setSelectedPlatforms(prev => [...prev, "TWITTER"])
                                            }
                                        }}
                                    >
                                        <div className={cn(
                                            "flex items-center justify-center h-5 w-5 rounded-full border transition-colors shrink-0",
                                            selectedPlatforms.includes("TWITTER") ? "bg-black dark:bg-white border-black dark:border-white" : "border-muted-foreground/30"
                                        )}>
                                            {selectedPlatforms.includes("TWITTER") && <Check className="h-3 w-3 text-white dark:text-black" />}
                                        </div>

                                        <div className="flex items-center gap-3">
                                            <div className="h-9 w-9 rounded-lg bg-black/5 dark:bg-white/10 flex items-center justify-center shrink-0">
                                                <Twitter className="h-5 w-5 text-black dark:text-white" />
                                            </div>
                                            <span className="font-medium text-sm">Twitter</span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Configuration Tabs */}
                            <div className="space-y-4">
                                <Label className="text-sm font-semibold text-foreground flex items-center gap-2">
                                    <span className="flex items-center justify-center w-5 h-5 rounded-full bg-blue-100 text-blue-600 text-[10px]">2</span>
                                    Customize Content
                                </Label>

                                <Tabs defaultValue={selectedPlatforms[0] || "linkedin"} className="w-full">
                                    <TabsList className="w-full grid grid-cols-2 p-1 bg-muted/30">
                                        <TabsTrigger value="linkedin" disabled={!selectedPlatforms.includes("LINKEDIN")} className="data-[state=active]:bg-white data-[state=active]:shadow-sm">
                                            LinkedIn
                                        </TabsTrigger>
                                        <TabsTrigger value="twitter" disabled={!selectedPlatforms.includes("TWITTER")} className="data-[state=active]:bg-white data-[state=active]:shadow-sm">
                                            Twitter
                                        </TabsTrigger>
                                    </TabsList>

                                    <div className="pt-4 px-1">
                                        <TabsContent value="linkedin" className="space-y-4 mt-0 animate-in fade-in-50 slide-in-from-top-1">
                                            <div className="grid grid-cols-2 gap-4">
                                                <div className="space-y-2">
                                                    <Label className="text-xs font-medium text-muted-foreground flex items-center gap-2">
                                                        <Mic className="h-3.5 w-3.5" />
                                                        Tone
                                                    </Label>
                                                    <Select value={linkedinTone} onValueChange={setLinkedinTone}>
                                                        <SelectTrigger className="w-full bg-white">
                                                            <SelectValue />
                                                        </SelectTrigger>
                                                        <SelectContent>
                                                            {TONE_OPTIONS.map(tone => (
                                                                <SelectItem key={tone.value} value={tone.value}>
                                                                    <div className="flex flex-col py-0.5">
                                                                        <span className="font-medium text-sm">{tone.label}</span>
                                                                    </div>
                                                                </SelectItem>
                                                            ))}
                                                            {customToneName && (
                                                                <SelectItem value="custom">✨ Custom: {customToneName}</SelectItem>
                                                            )}
                                                        </SelectContent>
                                                    </Select>
                                                </div>
                                                <div className="space-y-2">
                                                    <Label className="text-xs font-medium text-muted-foreground flex items-center gap-2">
                                                        <PenTool className="h-3.5 w-3.5" />
                                                        Style
                                                    </Label>
                                                    <Select value={linkedinStyle} onValueChange={setLinkedinStyle}>
                                                        <SelectTrigger className="w-full bg-white">
                                                            <SelectValue />
                                                        </SelectTrigger>
                                                        <SelectContent>
                                                            {STYLE_OPTIONS.map(style => (
                                                                <SelectItem key={style.value} value={style.value}>
                                                                    <div className="flex flex-col py-0.5">
                                                                        <span className="font-medium text-sm">{style.label}</span>
                                                                    </div>
                                                                </SelectItem>
                                                            ))}
                                                        </SelectContent>
                                                    </Select>
                                                </div>
                                            </div>
                                        </TabsContent>

                                        <TabsContent value="twitter" className="space-y-4 mt-0 animate-in fade-in-50 slide-in-from-top-1">
                                            <div className="grid grid-cols-2 gap-4">
                                                <div className="space-y-2">
                                                    <Label className="text-xs font-medium text-muted-foreground flex items-center gap-2">
                                                        <Mic className="h-3.5 w-3.5" />
                                                        Tone
                                                    </Label>
                                                    <Select value={twitterTone} onValueChange={setTwitterTone}>
                                                        <SelectTrigger className="w-full bg-white">
                                                            <SelectValue />
                                                        </SelectTrigger>
                                                        <SelectContent>
                                                            {TONE_OPTIONS.map(tone => (
                                                                <SelectItem key={tone.value} value={tone.value}>
                                                                    <div className="flex flex-col py-0.5">
                                                                        <span className="font-medium text-sm">{tone.label}</span>
                                                                    </div>
                                                                </SelectItem>
                                                            ))}
                                                            {customToneName && (
                                                                <SelectItem value="custom">✨ Custom: {customToneName}</SelectItem>
                                                            )}
                                                        </SelectContent>
                                                    </Select>
                                                </div>
                                                <div className="space-y-2">
                                                    <Label className="text-xs font-medium text-muted-foreground flex items-center gap-2">
                                                        <MessageSquare className="h-3.5 w-3.5" />
                                                        Format
                                                    </Label>
                                                    <Select value={twitterStyle} onValueChange={setTwitterStyle}>
                                                        <SelectTrigger className="w-full bg-white">
                                                            <SelectValue />
                                                        </SelectTrigger>
                                                        <SelectContent>
                                                            {STYLE_OPTIONS.filter(s => s.value !== 'professional').map(style => (
                                                                <SelectItem key={style.value} value={style.value}>
                                                                    <div className="flex flex-col py-0.5">
                                                                        <span className="font-medium text-sm">{style.label}</span>
                                                                    </div>
                                                                </SelectItem>
                                                            ))}
                                                        </SelectContent>
                                                    </Select>
                                                </div>
                                            </div>
                                        </TabsContent>
                                    </div>
                                </Tabs>
                            </div>
                        </div>
                    ) : (
                        <div className="h-full flex flex-col gap-4">
                            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full flex-1 flex flex-col">
                                <TabsList className="grid w-full grid-cols-2 mb-4">
                                    <TabsTrigger value="linkedin" className="gap-2">
                                        <Linkedin className="h-4 w-4" />
                                        LinkedIn Draft
                                    </TabsTrigger>
                                    <TabsTrigger value="twitter" className="gap-2">
                                        <Twitter className="h-4 w-4" />
                                        Twitter Thread
                                    </TabsTrigger>
                                </TabsList>

                                <div className="flex-1 min-h-[400px]">
                                    <TabsContent value="linkedin" className="h-full mt-0 border-none p-0 data-[state=inactive]:hidden group">
                                        <div className="relative h-full flex flex-col rounded-xl border bg-muted/20 focus-within:ring-2 focus-within:ring-blue-500/20 transition-all">
                                            <div className="flex items-center justify-between p-3 border-b bg-white/50">
                                                <Label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Post Content</Label>
                                                {generatedIds.linkedin && (
                                                    <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                                                        <Check className="w-3 h-3 mr-1" />
                                                        Saved
                                                    </Badge>
                                                )}
                                            </div>
                                            <Textarea
                                                value={generatedLinkedIn}
                                                onChange={(e) => setGeneratedLinkedIn(e.target.value)}
                                                className="flex-1 border-none focus-visible:ring-0 resize-none p-4 text-sm leading-relaxed bg-transparent"
                                                placeholder="Write your LinkedIn post here..."
                                            />
                                        </div>
                                    </TabsContent>

                                    <TabsContent value="twitter" className="h-full mt-0 border-none p-0 data-[state=inactive]:hidden">
                                        <div className="relative h-full flex flex-col rounded-xl border bg-muted/20 focus-within:ring-2 focus-within:ring-blue-500/20 transition-all">
                                            <div className="flex items-center justify-between p-3 border-b bg-white/50">
                                                <Label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Thread Content</Label>
                                                {generatedIds.twitter && (
                                                    <Badge variant="outline" className="bg-neutral-100 text-neutral-700 border-neutral-200">
                                                        <Check className="w-3 h-3 mr-1" />
                                                        Saved
                                                    </Badge>
                                                )}
                                            </div>
                                            <Textarea
                                                value={generatedTwitter}
                                                onChange={(e) => setGeneratedTwitter(e.target.value)}
                                                className="flex-1 border-none focus-visible:ring-0 resize-none p-4 font-mono text-sm bg-transparent"
                                                placeholder="Write your Twitter thread here..."
                                            />
                                        </div>
                                    </TabsContent>
                                </div>
                            </Tabs>
                        </div>
                    )}
                </div>

                <div className="p-6 pt-2">
                    {step === "config" ? (
                        <div className="flex items-center justify-between">
                            <Button
                                variant="ghost"
                                onClick={() => onOpenChange(false)}
                                className="text-muted-foreground hover:text-foreground"
                            >
                                Cancel
                            </Button>
                            <Button
                                onClick={handleGenerate}
                                disabled={isGenerating || selectedPlatforms.length === 0}
                                className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 gap-2 shadow-sm"
                            >
                                {isGenerating ? (
                                    <>
                                        <Loader2 className="h-4 w-4 animate-spin" />
                                        Generating...
                                    </>
                                ) : (
                                    <>
                                        <Sparkles className="h-4 w-4" />
                                        Generate Drafts
                                    </>
                                )}
                            </Button>
                        </div>
                    ) : (
                        <div className="flex items-center justify-between">
                            <Button
                                variant="outline"
                                onClick={() => setStep("config")}
                            >
                                Back
                            </Button>
                            <div className="flex items-center gap-3">
                                <div className="flex flex-col items-end">
                                    <span className="text-xs text-muted-foreground mb-1">Schedule date</span>
                                    <Popover>
                                        <PopoverTrigger asChild>
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                className={cn(
                                                    "w-[160px] justify-start text-left font-normal bg-white",
                                                    !scheduledDate && "text-muted-foreground"
                                                )}
                                            >
                                                <CalendarIcon className="mr-2 h-4 w-4" />
                                                {scheduledDate ? format(scheduledDate, "PPP") : <span>Pick a date</span>}
                                            </Button>
                                        </PopoverTrigger>
                                        <PopoverContent className="w-auto p-0" align="end">
                                            <Calendar
                                                mode="single"
                                                selected={scheduledDate}
                                                onSelect={setScheduledDate}
                                                initialFocus
                                                disabled={(date) => date < new Date()}
                                            />
                                        </PopoverContent>
                                    </Popover>
                                </div>
                                <Button
                                    onClick={handleSave}
                                    disabled={isSaving}
                                    className={cn(
                                        "gap-2 shadow-sm min-w-[140px]",
                                        scheduledDate
                                            ? "bg-emerald-600 hover:bg-emerald-700 text-white"
                                            : "bg-blue-600 hover:bg-blue-700 text-white"
                                    )}
                                >
                                    {isSaving ? (
                                        <Loader2 className="h-4 w-4 animate-spin" />
                                    ) : (
                                        scheduledDate ? <CalendarIcon className="h-4 w-4" /> : <Save className="h-4 w-4" />
                                    )}
                                    {scheduledDate ? "Schedule Post" : "Save as Draft"}
                                </Button>
                            </div>
                        </div>
                    )}
                </div>
            </DialogContent>
        </Dialog>
    )
}
