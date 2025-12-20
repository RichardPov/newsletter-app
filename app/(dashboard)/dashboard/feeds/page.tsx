import { getFeeds } from "@/lib/actions"
import { FeedManager } from "@/components/feed-manager"
import { Button } from "@/components/ui/button"
import { RefreshCw } from "lucide-react"

export default async function FeedsPage() {
    const feeds = await getFeeds()

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">RSS Feeds</h1>
                    <p className="text-muted-foreground">Manage your content sources.</p>
                </div>
                {/* Refresh is manual in this simple MVP, but typically would be a background job */}
                <Button variant="outline" disabled>
                    <RefreshCw className="mr-2 h-4 w-4" /> Auto-Sync Active
                </Button>
            </div>

            <FeedManager initialFeeds={feeds} />
        </div>
    )
}
