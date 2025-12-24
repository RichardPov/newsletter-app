import { getScheduledPosts } from "@/lib/post-actions"
import { PlannerLayout } from "@/components/planner-layout"
import { Metadata } from "next"

export const dynamic = "force-dynamic"

export const metadata: Metadata = {
    title: "Planner | Social Auto",
    description: "Manage your scheduled social media posts",
}

export default async function SchedulePage() {
    const posts = await getScheduledPosts()

    return (
        <div className="flex-1 h-full p-4 md:p-8 pt-6 overflow-hidden">
            <PlannerLayout posts={posts} />
        </div>
    )
}
