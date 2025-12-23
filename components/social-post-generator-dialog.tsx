"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Label } from "@/components/ui/label"
import { Loader2, Sparkles, Linkedin, Twitter } from "lucide-react"
import { generateSocialPosts } from "@/lib/social-actions"
import { toast } from "sonner"
import { useRouter } from "next/navigation"

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
    const [linkedinTone, setLinkedinTone] = useState("professional")
    const [linkedinStyle, setLinkedinStyle] = useState("professional")
    const [twitterTone, setTwitterTone] = useState("witty")
    const [twitterStyle, setTwitterStyle] = useState("hooky")
    const [isGenerating, setIsGenerating] = useState(false)
    const router = useRouter()

    const handleGenerate = async () => {
        setIsGenerating(true)

        try {
            const result = await generateSocialPosts(articleId, {
                linkedinTone,
                linkedinStyle,
                twitterTone,
                twitterStyle
            })

            if (result.success) {
                toast.success("Social posts generated!")
                onOpenChange(false)
                router.push('/dashboard/social')
            } else {
                toast.error("Failed to generate posts")
            }
        } catch (error) {
            toast.error("Something went wrong")
        } finally {
            setIsGenerating(false)
        }
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[600px]">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                        <Sparkles className="h-5 w-5 text-emerald-500" />
                        Generate Social Posts
                    </DialogTitle>
                    <DialogDescription>
                        Customize tone and style for: <span className="font-semibold">"{articleTitle}"</span>
                    </DialogDescription>
                </DialogHeader>

                <Tabs defaultValue="linkedin" className="w-full">
                    <TabsList className="grid w-full grid-cols-2">
                        <TabsTrigger value="linkedin">
                            <Linkedin className="mr-2 h-4 w-4" />
                            LinkedIn
                        </TabsTrigger>
                        <TabsTrigger value="twitter">
                            <Twitter className="mr-2 h-4 w-4" />
                            Twitter/X
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

                <div className="flex justify-end gap-2 pt-4">
                    <Button variant="outline" onClick={() => onOpenChange(false)}>
                        Cancel
                    </Button>
                    <Button onClick={handleGenerate} disabled={isGenerating}>
                        {isGenerating ? (
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
                </div>
            </DialogContent>
        </Dialog>
    )
}
