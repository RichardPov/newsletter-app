import { getAllPosts } from "@/lib/scheduler-actions"
import { SchedulerClient } from "@/components/scheduler-client"

export const dynamic = "force-dynamic"

export default async function SchedulerPage() {
    // Fetch ALL posts (scheduled + drafts)
    const posts = await getAllPosts()

    return <SchedulerClient initialPosts={posts} />
}
