import { getArticles } from "@/lib/actions"
import { NewsletterBuilder } from "@/components/newsletter-builder"

export default async function NewsletterPage() {
    const articles = await getArticles()

    return (
        <NewsletterBuilder availableArticles={articles} />
    )
}
