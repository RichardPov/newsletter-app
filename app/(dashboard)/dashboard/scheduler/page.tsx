import { getAllPosts, getScheduledPosts } from "@/lib/scheduler-actions"
import { SchedulerClient } from "@/components/scheduler-client"

export const dynamic = "force-dynamic"

export default async function SchedulerPage() {
    const currentDate = new Date()
    const posts = await getAllPosts({
        month: currentDate.getMonth() + 1,
        year: currentDate.getFullYear()
    })

    return <SchedulerClient initialPosts={posts} />
}
