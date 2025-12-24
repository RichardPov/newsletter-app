"use client"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Calendar } from "@/components/ui/calendar"
import { format } from "date-fns"
import { Calendar as CalendarIcon, Clock, Linkedin, Twitter, AlertCircle, Loader2, Save } from "lucide-react"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { cn } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"
import { Label } from "@/components/ui/label"
import { toast } from "sonner"
import { updatePost } from "@/lib/post-actions"

interface EditPostDialogProps {
    open: boolean
    onOpenChange: (open: boolean) => void
    post: {
        id: string
        content: string
        platform: string
        scheduledFor?: Date | null
        status: string
    }
    onPostUpdated: (updatedPost: any) => void
}

export function EditPostDialog({ open, onOpenChange, post, onPostUpdated }: EditPostDialogProps) {
    const [content, setContent] = useState(post.content)
    const [date, setDate] = useState<Date | undefined>(post.scheduledFor ? new Date(post.scheduledFor) : undefined)
    const [isSaving, setIsSaving] = useState(false)

    // Reset state when post changes
    useEffect(() => {
        setContent(post.content)
        setDate(post.scheduledFor ? new Date(post.scheduledFor) : undefined)
    }, [post, open])

    const handleSave = async () => {
        setIsSaving(true)
        try {
            const status = date ? "SCHEDULED" : "DRAFT"

            await updatePost(post.id, {
                content,
                scheduledFor: date,
                status
            })

            onPostUpdated({
                ...post,
                content,
                scheduledFor: date,
                status
            })

            toast.success("Post updated successfully")
            onOpenChange(false)
        } catch (error) {
            toast.error("Failed to update post")
        } finally {
            setIsSaving(false)
        }
    }

    const platformIcon = post.platform === "LINKEDIN" ? <Linkedin className="h-4 w-4" /> : <Twitter className="h-4 w-4" />
    const platformColor = post.platform === "LINKEDIN" ? "bg-blue-100 text-blue-700 border-blue-200" : "bg-neutral-100 text-neutral-900 border-neutral-200"

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[600px] overflow-hidden p-0 gap-0">
                <div className="p-6 pb-4 border-b">
                    <DialogHeader>
                        <DialogTitle className="flex items-center gap-3 text-xl">
                            Edit Post
                            <Badge variant="outline" className={cn("gap-1 font-normal", platformColor)}>
                                {platformIcon}
                                {post.platform}
                            </Badge>
                        </DialogTitle>
                    </DialogHeader>
                </div>

                <div className="p-6 space-y-6">
                    <div className="space-y-2">
                        <Label className="text-sm font-medium text-muted-foreground">Post Content</Label>
                        <Textarea
                            value={content}
                            onChange={(e) => setContent(e.target.value)}
                            className="min-h-[200px] font-mono text-sm resize-none focus-visible:ring-emerald-500"
                            placeholder="Write your post content here..."
                        />
                        <div className="flex justify-between text-xs text-muted-foreground">
                            <span>{content.length} characters</span>
                            {post.platform === "TWITTER" && content.length > 280 && (
                                <span className="text-red-500 flex items-center gap-1">
                                    <AlertCircle className="h-3 w-3" /> Over limit
                                </span>
                            )}
                        </div>
                    </div>

                    <div className="p-6 border-t bg-muted/5">
                        <div className="flex items-center justify-between gap-4">
                            <Button
                                variant="ghost"
                                onClick={() => onOpenChange(false)}
                                className="text-muted-foreground hover:text-foreground"
                            >
                                Cancel
                            </Button>
                            <div className="flex items-center gap-3">
                                <Popover>
                                    <PopoverTrigger asChild>
                                        <Button
                                            variant="outline"
                                            className={cn(
                                                "w-[200px] justify-start text-left font-normal bg-white",
                                                !date && "text-muted-foreground"
                                            )}
                                        >
                                            <CalendarIcon className="mr-2 h-4 w-4" />
                                            {date ? format(date, "PPP") : <span>Schedule for...</span>}
                                        </Button>
                                    </PopoverTrigger>
                                    <PopoverContent className="w-auto p-0" align="end">
                                        <Calendar
                                            mode="single"
                                            selected={date}
                                            onSelect={setDate}
                                            initialFocus
                                            disabled={(date) => date < new Date(new Date().setHours(0, 0, 0, 0))}
                                        />
                                    </PopoverContent>
                                </Popover>
                                <Button
                                    onClick={handleSave}
                                    disabled={isSaving}
                                    className={cn(
                                        "gap-2 shadow-sm min-w-[140px] text-white",
                                        date
                                            ? "bg-emerald-600 hover:bg-emerald-700"
                                            : "bg-blue-600 hover:bg-blue-700"
                                    )}
                                >
                                    {isSaving ? (
                                        <Loader2 className="h-4 w-4 animate-spin" />
                                    ) : (
                                        date ? <CalendarIcon className="h-4 w-4" /> : <Save className="h-4 w-4" />
                                    )}
                                    {date ? "Schedule Post" : "Save Changes"}
                                </Button>
                            </div>
                        </div>
                    </div>
            </DialogContent>
        </Dialog>
    )
}
