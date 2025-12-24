import { getScheduledPosts } from "@/lib/post-actions"
import { ScheduleList } from "@/components/schedule-list"
import { Metadata } from "next"

export const metadata: Metadata = {
    title: "Schedule | Social Auto",
    description: "Manage your scheduled social media posts",
}

export default async function SchedulePage() {
    const posts = await getScheduledPosts()

    return (
        <div className="flex-1 space-y-4 p-8 pt-6">
            <div className="flex items-center justify-between space-y-2">
                <h2 className="text-3xl font-bold tracking-tight">Content Planner</h2>
                <div className="flex items-center space-x-2">
                    {/* Add filters if needed later */}
                </div>
            </div>

            <div className="grid gap-4">
                <ScheduleList initialPosts={posts} />
            </div>
        </div>
    )
}
