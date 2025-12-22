import { getArticles } from "@/lib/actions"
import { ArticleFeed } from "@/components/article-feed"

export const dynamic = "force-dynamic"

export default async function ArticlesPage() {
    const articles = await getArticles()

    return (
        <ArticleFeed initialArticles={articles} />
    )
}
