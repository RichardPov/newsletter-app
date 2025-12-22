import { getSocialPosts } from "@/lib/social-actions"
import { SocialFeed } from "@/components/social-feed"

export const dynamic = "force-dynamic"

export default async function SocialPage() {
    const posts = await getSocialPosts()

    return <SocialFeed initialPosts={posts} />
}
