"use client"

import { useState } from "react"
import { useAppStore, RSSFeed } from "@/lib/store"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Plus, Trash2, RefreshCw } from "lucide-react"

export default function FeedsPage() {
    const { feeds, addFeed, removeFeed } = useAppStore()
    const [newFeedUrl, setNewFeedUrl] = useState("")
    const [isLoading, setIsLoading] = useState(false)

    const handleAddFeed = () => {
        if (!newFeedUrl) return
        setIsLoading(true)

        // Mock Fetch & Parse
        setTimeout(() => {
            const id = Math.random().toString(36).substring(7)
            // Mock name extraction from URL
            const name = newFeedUrl.includes('techcrunch') ? 'TechCrunch' :
                newFeedUrl.includes('verge') ? 'The Verge' :
                    'New Feed ' + id

            addFeed({
                id,
                name,
                url: newFeedUrl,
                active: true
            })
            setNewFeedUrl("")
            setIsLoading(false)
        }, 1000)
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">RSS Feeds</h1>
                    <p className="text-muted-foreground">Manage your content sources.</p>
                </div>
                <Button variant="outline">
                    <RefreshCw className="mr-2 h-4 w-4" /> Refresh All
                </Button>
            </div>

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
                            {feeds.map((feed) => (
                                <TableRow key={feed.id}>
                                    <TableCell className="font-medium">{feed.name}</TableCell>
                                    <TableCell className="text-muted-foreground truncate max-w-[300px]">{feed.url}</TableCell>
                                    <TableCell>
                                        <span className="inline-flex items-center rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-medium text-green-800 dark:bg-green-900 dark:text-green-300">
                                            Active
                                        </span>
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <Button variant="ghost" size="sm" onClick={() => removeFeed(feed.id)}>
                                            <Trash2 className="h-4 w-4 text-red-500" />
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            ))}
                            {feeds.length === 0 && (
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
