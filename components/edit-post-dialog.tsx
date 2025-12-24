"use client"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Calendar } from "@/components/ui/calendar"
import { format } from "date-fns"
import { Calendar as CalendarIcon, Clock, Linkedin, Twitter, AlertCircle } from "lucide-react"
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

                    <div className="space-y-2">
                        <Label className="text-sm font-medium text-muted-foreground">Schedule Date</Label>
                        <div className="flex gap-2">
                            <Popover>
                                <PopoverTrigger asChild>
                                    <Button
                                        variant={"outline"}
                                        className={cn(
                                            "w-full justify-start text-left font-normal",
                                            !date && "text-muted-foreground"
                                        )}
                                    >
                                        <CalendarIcon className="mr-2 h-4 w-4" />
                                        {date ? format(date, "PPP") : <span>Pick a date to schedule</span>}
                                    </Button>
                                </PopoverTrigger>
                                <PopoverContent className="w-auto p-0" align="start">
                                    <Calendar
                                        mode="single"
                                        selected={date}
                                        onSelect={setDate}
                                        initialFocus
                                        disabled={(date) => date < new Date(new Date().setHours(0, 0, 0, 0))}
                                    />
                                </PopoverContent>
                            </Popover>

                            {date && (
                                <Button
                                    variant="ghost"
                                    onClick={() => setDate(undefined)}
                                    className="text-red-500 hover:text-red-600 hover:bg-red-50"
                                >
                                    Clear
                                </Button>
                            )}
                        </div>
                        <p className="text-xs text-muted-foreground">
                            {date
                                ? "Post will be automatically published on this date."
                                : "Post will be saved as a Draft."}
                        </p>
                    </div>
                </div>

                <div className="p-4 bg-muted/30 border-t flex justify-end gap-3">
                    <Button variant="ghost" onClick={() => onOpenChange(false)}>
                        Cancel
                    </Button>
                    <Button
                        onClick={handleSave}
                        disabled={isSaving}
                        className="bg-emerald-600 hover:bg-emerald-700 min-w-[100px]"
                    >
                        {isSaving ? "Saving..." : "Save Changes"}
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    )
}
