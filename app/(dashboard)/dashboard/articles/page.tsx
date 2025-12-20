import { getArticles } from "@/lib/actions"
import { ArticleFeed } from "@/components/article-feed"

export default async function ArticlesPage() {
    const articles = await getArticles()

    return (
        <ArticleFeed initialArticles={articles} />
    )
}
