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
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
    Loader2, Sparkles, Linkedin, Twitter, Calendar as CalendarIcon, Save     Check
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
            <DialogContent className="sm:max-w-[700px] h-[80vh] flex flex-col">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                        <Sparkles className="h-5 w-5 text-emerald-500" />
                        {step === "config" ? "Create Draft" : "Edit Draft & Schedule"}
                    </DialogTitle>
                    <DialogDescription>
                        {step === "config"
                            ? `Convert "${articleTitle}" into a fresh social media draft.`
                            : "Refine your new draft below. Save it for later or schedule it immediately."
                        }
                    </DialogDescription>
                </DialogHeader>

                <div className="flex-1 overflow-y-auto py-4">
                    {step === "config" ? (
                        <div className="space-y-6">
                            {/* Platform Selection */}
                            <div className="space-y-3">
                                <Label className="text-xs uppercase text-muted-foreground font-semibold tracking-wide">Destinations</Label>
                                <div className="grid grid-cols-2 gap-4">
                                    {/* LinkedIn Card */}
                                    <div
                                        className={cn(
                                            "relative flex flex-col items-center justify-center gap-3 p-4 rounded-xl border-2 transition-all cursor-pointer hover:border-blue-400/50",
                                            selectedPlatforms.includes("LINKEDIN")
                                                ? "border-blue-600 bg-blue-50/50 dark:bg-blue-950/20"
                                                : "border-muted/40 hover:bg-muted/50"
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
                                            "absolute top-3 right-3 h-5 w-5 rounded-md border flex items-center justify-center transition-colors",
                                            selectedPlatforms.includes("LINKEDIN") ? "bg-blue-600 border-blue-600" : "border-muted-foreground/30"
                                        )}>
                                            {selectedPlatforms.includes("LINKEDIN") && <Check className="h-3.5 w-3.5 text-white" />}
                                        </div>

                                        <div className="h-10 w-10 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                                            <Linkedin className="h-5 w-5 text-blue-600" />
                                        </div>
                                        <span className="font-semibold text-sm">LinkedIn Post</span>
                                    </div>

                                    {/* Twitter Card */}
                                    <div
                                        className={cn(
                                            "relative flex flex-col items-center justify-center gap-3 p-4 rounded-xl border-2 transition-all cursor-pointer hover:border-black/30 dark:hover:border-white/30",
                                            selectedPlatforms.includes("TWITTER")
                                                ? "border-black dark:border-white bg-neutral-100/50 dark:bg-neutral-900"
                                                : "border-muted/40 hover:bg-muted/50"
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
                                            "absolute top-3 right-3 h-5 w-5 rounded-md border flex items-center justify-center transition-colors",
                                            selectedPlatforms.includes("TWITTER") ? "bg-black dark:bg-white border-black dark:border-white" : "border-muted-foreground/30"
                                        )}>
                                            {selectedPlatforms.includes("TWITTER") && <Check className="h-3.5 w-3.5 text-white dark:text-black" />}
                                        </div>

                                        <div className="h-10 w-10 rounded-full bg-neutral-100 dark:bg-neutral-800 flex items-center justify-center">
                                            <Twitter className="h-5 w-5 text-black dark:text-white" />
                                        </div>
                                        <span className="font-semibold text-sm">Twitter Thread</span>
                                    </div>
                                </div>
                            </div>

                            {/* Configuration Tabs */}
                            <Tabs defaultValue={selectedPlatforms[0] || "linkedin"} className="w-full">
                                <TabsList className="grid w-full grid-cols-2 h-10 bg-muted/50 p-1">
                                    <TabsTrigger value="linkedin" disabled={!selectedPlatforms.includes("LINKEDIN")} className="data-[state=active]:bg-white data-[state=active]:shadow-sm">
                                        LinkedIn Settings
                                    </TabsTrigger>
                                    <TabsTrigger value="twitter" disabled={!selectedPlatforms.includes("TWITTER")} className="data-[state=active]:bg-white data-[state=active]:shadow-sm">
                                        Twitter Settings
                                    </TabsTrigger>
                                </TabsList>

                                <TabsContent value="linkedin" className="space-y-4 pt-4 animate-in fade-in-50 slide-in-from-top-1">
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <Label className="text-xs font-medium text-muted-foreground">TONE OF VOICE</Label>
                                            <Select value={linkedinTone} onValueChange={setLinkedinTone}>
                                                <SelectTrigger>
                                                    <SelectValue />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    {TONE_OPTIONS.map(tone => (
                                                        <SelectItem key={tone.value} value={tone.value}>
                                                            <div className="flex flex-col py-1">
                                                                <span className="font-medium text-sm">{tone.label}</span>
                                                                <span className="text-[10px] text-muted-foreground">{tone.description}</span>
                                                            </div>
                                                        </SelectItem>
                                                    ))}
                                                    {customToneName && (
                                                        <SelectItem value="custom">
                                                            <div className="flex flex-col py-1">
                                                                <span className="font-medium text-sm">✨ Custom: {customToneName}</span>
                                                            </div>
                                                        </SelectItem>
                                                    )}
                                                </SelectContent>
                                            </Select>
                                        </div>
                                        <div className="space-y-2">
                                            <Label className="text-xs font-medium text-muted-foreground">POST STYLE</Label>
                                            <Select value={linkedinStyle} onValueChange={setLinkedinStyle}>
                                                <SelectTrigger>
                                                    <SelectValue />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    {STYLE_OPTIONS.map(style => (
                                                        <SelectItem key={style.value} value={style.value}>
                                                            <div className="flex flex-col py-1">
                                                                <span className="font-medium text-sm">{style.label}</span>
                                                                <span className="text-[10px] text-muted-foreground">{style.description}</span>
                                                            </div>
                                                        </SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                        </div>
                                    </div>
                                </TabsContent>

                                <TabsContent value="twitter" className="space-y-4 pt-4 animate-in fade-in-50 slide-in-from-top-1">
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <Label className="text-xs font-medium text-muted-foreground">TONE OF VOICE</Label>
                                            <Select value={twitterTone} onValueChange={setTwitterTone}>
                                                <SelectTrigger>
                                                    <SelectValue />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    {TONE_OPTIONS.map(tone => (
                                                        <SelectItem key={tone.value} value={tone.value}>
                                                            <div className="flex flex-col py-1">
                                                                <span className="font-medium text-sm">{tone.label}</span>
                                                                <span className="text-[10px] text-muted-foreground">{tone.description}</span>
                                                            </div>
                                                        </SelectItem>
                                                    ))}
                                                    {customToneName && (
                                                        <SelectItem value="custom">
                                                            <div className="flex flex-col py-1">
                                                                <span className="font-medium text-sm">✨ Custom: {customToneName}</span>
                                                            </div>
                                                        </SelectItem>
                                                    )}
                                                </SelectContent>
                                            </Select>
                                        </div>
                                        <div className="space-y-2">
                                            <Label className="text-xs font-medium text-muted-foreground">THREAD STYLE</Label>
                                            <Select value={twitterStyle} onValueChange={setTwitterStyle}>
                                                <SelectTrigger>
                                                    <SelectValue />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    {STYLE_OPTIONS.filter(s => s.value !== 'professional').map(style => (
                                                        <SelectItem key={style.value} value={style.value}>
                                                            <div className="flex flex-col py-1">
                                                                <span className="font-medium text-sm">{style.label}</span>
                                                                <span className="text-[10px] text-muted-foreground">{style.description}</span>
                                                            </div>
                                                        </SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                        </div>
                                    </div>
                                </TabsContent>
                            </Tabs>
                        </div>
                    ) : (
                        <div className="h-full flex flex-col">
                            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full flex-1 flex flex-col">
                                <TabsList className="grid w-full grid-cols-2 mb-4">
                                    <TabsTrigger value="linkedin">
                                        <Linkedin className="mr-2 h-4 w-4" />
                                        LinkedIn
                                    </TabsTrigger>
                                    <TabsTrigger value="twitter">
                                        <Twitter className="mr-2 h-4 w-4" />
                                        Twitter
                                    </TabsTrigger>
                                </TabsList>

                                <TabsContent value="linkedin" className="flex-1 mt-0">
                                    <Textarea
                                        value={generatedLinkedIn}
                                        onChange={(e) => setGeneratedLinkedIn(e.target.value)}
                                        className="h-full min-h-[300px] font-mono text-sm resize-none p-4"
                                        placeholder="Generated LinkedIn post..."
                                    />
                                </TabsContent>
                                <TabsContent value="twitter" className="flex-1 mt-0">
                                    <Textarea
                                        value={generatedTwitter}
                                        onChange={(e) => setGeneratedTwitter(e.target.value)}
                                        className="h-full min-h-[300px] font-mono text-sm resize-none p-4"
                                        placeholder="Generated Twitter thread..."
                                    />
                                </TabsContent>
                            </Tabs>
                        </div>
                    )}
                </div>

                <DialogFooter className="flex justify-between items-center border-t pt-4">
                    {step === "config" ? (
                        <>
                            <Button variant="ghost" onClick={() => onOpenChange(false)}>Cancel</Button>
                            <Button onClick={handleGenerate} disabled={isGenerating}>
                                {isGenerating ? (
                                    <>
                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                        Generating...
                                    </>
                                ) : (
                                    <>
                                        <Sparkles className="mr-2 h-4 w-4" />
                                        Generate Drafts
                                    </>
                                )}
                            </Button>
                        </>
                    ) : (
                        <div className="flex w-full justify-between items-center">
                            <Button variant="ghost" onClick={() => setStep("config")}>Back to Settings</Button>

                            <div className="flex gap-2 items-center">
                                {/* Date Picker */}
                                <Popover>
                                    <PopoverTrigger asChild>
                                        <Button
                                            variant={"outline"}
                                            className={cn(
                                                "w-[200px] justify-start text-left font-normal",
                                                !scheduledDate && "text-muted-foreground"
                                            )}
                                        >
                                            <CalendarIcon className="mr-2 h-4 w-4" />
                                            {scheduledDate ? format(scheduledDate, "PPP") : <span>Schedule for later</span>}
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

                                <Button onClick={handleSave} disabled={isSaving}>
                                    {isSaving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4 mr-2" />}
                                    {scheduledDate ? "Schedule Post" : "Save Draft"}
                                </Button>
                            </div>
                        </div>
                    )}
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}
