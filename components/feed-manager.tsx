"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Plus, Trash2, RefreshCw } from "lucide-react"
import { addFeed, removeFeed } from "@/lib/actions"
import { toast } from "sonner"

interface Feed {
    id: string
    url: string
    name: string
    isActive: boolean
    createdAt?: Date
}

interface FeedManagerProps {
    initialFeeds: Feed[]
}

export function FeedManager({ initialFeeds }: FeedManagerProps) {
    const [feeds, setFeeds] = useState<Feed[]>(initialFeeds)
    const [newFeedUrl, setNewFeedUrl] = useState("")
    const [isLoading, setIsLoading] = useState(false)

    // Sync with server state on re-render if needed, 
    // but usually Server Actions + revalidatePath handles this effectively via parent refresh.
    // However, for immediate optimistic UI, we might want local state.
    // For now, simpler approach: relying on server revalidation (user refreshes or router.refresh() handles it).
    // Actually, simplest is direct mutation and router.refresh() in handling function.

    // NOTE: In a real "Senior" app, we'd use useOptimistic or similar. 
    // To keep it robust without overengineering for this strict context, let's trust the server re-render.
    // IF the parent passes fresh data, this component re-renders.

    // But wait, "initialFeeds" only updates if the PARENT re-renders. 
    // Server Actions with revalidatePath re-run the server component, so initialFeeds WILL update.

    const handleAddFeed = async () => {
        if (!newFeedUrl) return
        setIsLoading(true)

        try {
            const result = await addFeed(newFeedUrl)
            if (result.success) {
                toast.success("Feed added successfully")
                setNewFeedUrl("")
            } else {
                toast.error(result.error || "Failed to add feed")
            }
        } catch (error) {
            toast.error("An unexpected error occurred")
        } finally {
            setIsLoading(false)
        }
    }

    const handleRemove = async (id: string) => {
        try {
            await removeFeed(id)
            toast.success("Feed removed")
        } catch (error) {
            toast.error("Failed to remove feed")
        }
    }

    return (
        <div className="space-y-6">
            <Card>
                <CardHeader>
                    <CardTitle>Add New Feed</CardTitle>
                    <CardDescription>Enter the URL of an RSS feed to start tracking articles.</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="flex gap-2">
                        <Input
                            placeholder="https://techcrunch.com/feed"
                            value={newFeedUrl}
                            onChange={(e) => setNewFeedUrl(e.target.value)}
                        />
                        <Button onClick={handleAddFeed} disabled={isLoading}>
                            {isLoading ? <RefreshCw className="mr-2 h-4 w-4 animate-spin" /> : <Plus className="mr-2 h-4 w-4" />}
                            Add Feed
                        </Button>
                    </div>
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle>Active Feeds</CardTitle>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Feed Name</TableHead>
                                <TableHead>URL</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead className="text-right">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {initialFeeds.map((feed) => (
                                <TableRow key={feed.id}>
                                    <TableCell className="font-medium">{feed.name}</TableCell>
                                    <TableCell className="text-muted-foreground truncate max-w-[300px]">{feed.url}</TableCell>
                                    <TableCell>
                                        <span className="inline-flex items-center rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-medium text-green-800 dark:bg-green-900 dark:text-green-300">
                                            {feed.isActive ? 'Active' : 'Inactive'}
                                        </span>
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <Button variant="ghost" size="sm" onClick={() => handleRemove(feed.id)}>
                                            <Trash2 className="h-4 w-4 text-red-500" />
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            ))}
                            {initialFeeds.length === 0 && (
                                <TableRow>
                                    <TableCell colSpan={4} className="text-center py-8 text-muted-foreground">
                                        No feeds added yet. Add one above to get started.
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </div>
    )
}
