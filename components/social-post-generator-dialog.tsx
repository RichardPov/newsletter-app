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
import { Loader2, Sparkles, Linkedin, Twitter, Calendar as CalendarIcon, Save } from "lucide-react"
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
                            <div className="space-y-3">
                                <Label>Select Platforms</Label>
                                <div className="flex gap-4">
                                    <div
                                        className={cn(
                                            "flex items-center gap-2 border rounded-lg p-3 cursor-pointer transition-all",
                                            selectedPlatforms.includes("LINKEDIN") ? "border-blue-500 bg-blue-50 dark:bg-blue-950/20" : "opacity-60"
                                        )}
                                        onClick={() => {
                                            if (selectedPlatforms.includes("LINKEDIN")) {
                                                setSelectedPlatforms(prev => prev.filter(p => p !== "LINKEDIN"))
                                            } else {
                                                setSelectedPlatforms(prev => [...prev, "LINKEDIN"])
                                            }
                                        }}
                                    >
                                        <div className={cn("w-4 h-4 rounded border flex items-center justify-center", selectedPlatforms.includes("LINKEDIN") ? "bg-blue-500 border-blue-500" : "border-muted-foreground")}>
                                            {selectedPlatforms.includes("LINKEDIN") && <div className="w-2 h-2 bg-white rounded-sm" />}
                                        </div>
                                        <Linkedin className="h-4 w-4 text-blue-600" />
                                        <span className="text-sm font-medium">LinkedIn</span>
                                    </div>

                                    <div
                                        className={cn(
                                            "flex items-center gap-2 border rounded-lg p-3 cursor-pointer transition-all",
                                            selectedPlatforms.includes("TWITTER") ? "border-black dark:border-white bg-neutral-50 dark:bg-neutral-900" : "opacity-60"
                                        )}
                                        onClick={() => {
                                            if (selectedPlatforms.includes("TWITTER")) {
                                                setSelectedPlatforms(prev => prev.filter(p => p !== "TWITTER"))
                                            } else {
                                                setSelectedPlatforms(prev => [...prev, "TWITTER"])
                                            }
                                        }}
                                    >
                                        <div className={cn("w-4 h-4 rounded border flex items-center justify-center", selectedPlatforms.includes("TWITTER") ? "bg-black dark:bg-white border-black dark:border-white" : "border-muted-foreground")}>
                                            {selectedPlatforms.includes("TWITTER") && <div className="w-2 h-2 bg-white dark:bg-black rounded-sm" />}
                                        </div>
                                        <Twitter className="h-4 w-4" />
                                        <span className="text-sm font-medium">Twitter / X</span>
                                    </div>
                                </div>
                            </div>

                            <Tabs defaultValue={selectedPlatforms[0] || "linkedin"} className="w-full">
                                <TabsList className="grid w-full grid-cols-2">
                                    <TabsTrigger value="linkedin" disabled={!selectedPlatforms.includes("LINKEDIN")}>
                                        <Linkedin className="mr-2 h-4 w-4" />
                                        LinkedIn Settings
                                    </TabsTrigger>
                                    <TabsTrigger value="twitter" disabled={!selectedPlatforms.includes("TWITTER")}>
                                        <Twitter className="mr-2 h-4 w-4" />
                                        Twitter Settings
                                    </TabsTrigger>
                                </TabsList>

                                <TabsContent value="linkedin" className="space-y-4 pt-4">
                                    <div className="space-y-2">
                                        <Label>Tone of Voice</Label>
                                        <Select value={linkedinTone} onValueChange={setLinkedinTone}>
                                            <SelectTrigger>
                                                <SelectValue />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {TONE_OPTIONS.map(tone => (
                                                    <SelectItem key={tone.value} value={tone.value}>
                                                        <div className="flex flex-col">
                                                            <span className="font-medium">{tone.label}</span>
                                                            <span className="text-xs text-muted-foreground">{tone.description}</span>
                                                        </div>
                                                    </SelectItem>
                                                ))}
                                                {customToneName && (
                                                    <SelectItem value="custom">
                                                        <div className="flex flex-col">
                                                            <span className="font-medium">✨ Custom: {customToneName}</span>
                                                            <span className="text-xs text-muted-foreground">Your saved tone profile</span>
                                                        </div>
                                                    </SelectItem>
                                                )}
                                            </SelectContent>
                                        </Select>
                                    </div>
                                    <div className="space-y-2">
                                        <Label>Style</Label>
                                        <Select value={linkedinStyle} onValueChange={setLinkedinStyle}>
                                            <SelectTrigger>
                                                <SelectValue />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {STYLE_OPTIONS.map(style => (
                                                    <SelectItem key={style.value} value={style.value}>
                                                        <div className="flex flex-col">
                                                            <span className="font-medium">{style.label}</span>
                                                            <span className="text-xs text-muted-foreground">{style.description}</span>
                                                        </div>
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </div>
                                </TabsContent>

                                <TabsContent value="twitter" className="space-y-4 pt-4">
                                    <div className="space-y-2">
                                        <Label>Tone of Voice</Label>
                                        <Select value={twitterTone} onValueChange={setTwitterTone}>
                                            <SelectTrigger>
                                                <SelectValue />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {TONE_OPTIONS.map(tone => (
                                                    <SelectItem key={tone.value} value={tone.value}>
                                                        <div className="flex flex-col">
                                                            <span className="font-medium">{tone.label}</span>
                                                            <span className="text-xs text-muted-foreground">{tone.description}</span>
                                                        </div>
                                                    </SelectItem>
                                                ))}
                                                {customToneName && (
                                                    <SelectItem value="custom">
                                                        <div className="flex flex-col">
                                                            <span className="font-medium">✨ Custom: {customToneName}</span>
                                                            <span className="text-xs text-muted-foreground">Your saved tone profile</span>
                                                        </div>
                                                    </SelectItem>
                                                )}
                                            </SelectContent>
                                        </Select>
                                    </div>
                                    <div className="space-y-2">
                                        <Label>Style</Label>
                                        <Select value={twitterStyle} onValueChange={setTwitterStyle}>
                                            <SelectTrigger>
                                                <SelectValue />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {STYLE_OPTIONS.filter(s => s.value !== 'professional').map(style => (
                                                    <SelectItem key={style.value} value={style.value}>
                                                        <div className="flex flex-col">
                                                            <span className="font-medium">{style.label}</span>
                                                            <span className="text-xs text-muted-foreground">{style.description}</span>
                                                        </div>
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
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
