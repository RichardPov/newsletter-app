'use server'

import { prisma } from "@/lib/db"
import { auth } from "@clerk/nextjs/server"
import Parser from 'rss-parser'
import { revalidatePath } from "next/cache"

const parser = new Parser()

export async function getFeeds() {
    const { userId } = await auth()
    if (!userId) return []

    return await prisma.feed.findMany({
        where: { userId },
        orderBy: { createdAt: 'desc' }
    })
}

export async function addFeed(url: string) {
    const { userId } = await auth()
    if (!userId) throw new Error("Unauthorized")

    try {
        // validate RSS
        const feed = await parser.parseURL(url)
        if (!feed) throw new Error("Invalid RSS feed")

        const name = feed.title || new URL(url).hostname

        await prisma.feed.create({
            data: {
                userId,
                url,
                name
            }
        })

        revalidatePath('/dashboard/feeds')
        return { success: true }
    } catch (e) {
        console.error(e)
        return { success: false, error: "Failed to parse or add feed." }
    }
}

export async function removeFeed(id: string) {
    const { userId } = await auth()
    if (!userId) throw new Error("Unauthorized")

    await prisma.feed.delete({
        where: { id, userId } // Ensure user owns the feed
    })

    revalidatePath('/dashboard/feeds')
}

// Articles Setup
export async function refreshFeeds() {
    const { userId } = await auth()
    if (!userId) throw new Error("Unauthorized")

    const feeds = await prisma.feed.findMany({
        where: { userId, isActive: true }
    })

    let newCount = 0

    for (const feed of feeds) {
        try {
            const parsed = await parser.parseURL(feed.url)

            for (const item of parsed.items) {
                if (!item.link || !item.title) continue

                // Basic AI Mock (later we replace this with real OpenAI call)
                const mockViralScore = Math.floor(Math.random() * 10) + 1

                try {
                    await prisma.article.create({
                        data: {
                            userId,
                            feedId: feed.id,
                            title: item.title,
                            url: item.link,
                            content: item.contentSnippet || item.content || "",
                            summary: "AI summary pending...", // Placeholder
                            publishedAt: item.isoDate ? new Date(item.isoDate) : new Date(),
                            viralScore: mockViralScore,
                            status: "REVIEW"
                        }
                    })
                    newCount++
                } catch (e) {
                    // Ignore unique constraint violations (duplicates)
                    continue
                }
            }
        } catch (e) {
            console.error(`Failed to parse feed ${feed.url}`, e)
        }
    }

    revalidatePath('/dashboard/articles')
    return { success: true, count: newCount }
}

export async function getArticles() {
    const { userId } = await auth()
    if (!userId) return []

    return await prisma.article.findMany({
        where: { userId },
        orderBy: { publishedAt: 'desc' },
        include: { feed: true }
    })
}

export async function saveNewsletter(data: {
    title: string,
    intro: string,
    outro: string,
    articleIds: string[]
}) {
    const { userId } = await auth()
    if (!userId) throw new Error("Unauthorized")

    // Create a new draft (MVP: always new for now, or we can add ID update logic later)
    await prisma.newsletter.create({
        data: {
            userId,
            title: data.title,
            intro: data.intro,
            outro: data.outro,
            status: "DRAFT",
            articles: {
                connect: data.articleIds.map(id => ({ id }))
            }
        }
    })

    return { success: true }
}

export async function completeOnboarding(data: {
    name: string,
    feeds: string[],
    toneRawText?: string
}) {
    const { userId } = await auth()
    if (!userId) throw new Error("Unauthorized")

    // 1. Update User (Name + Flag)
    await prisma.user.update({
        where: { id: userId },
        data: {
            name: data.name,
            onboardingCompleted: true
        }
    })

    // 2. Add Feeds
    for (const url of data.feeds) {
        try {
            // Check if already exists to be safe
            const existing = await prisma.feed.findFirst({ where: { userId, url } })
            if (!existing) {
                // simple add, ideally we parse name but for onboarding we might just use hostname
                const name = new URL(url).hostname
                await prisma.feed.create({ data: { userId, url, name } })
            }
        } catch (e) { }
    }

    // 3. Analyze Tone (Mock) if provided
    if (data.toneRawText) {
        // Mock AI analysis
        const styles = ["Professional", "Casual", "Witty", "Authoritative"]
        const randomStyle = styles[Math.floor(Math.random() * styles.length)]

        await prisma.toneProfile.upsert({
            where: { userId },
            update: {
                name: "Analyzed Persona",
                style: `Based on your inputs, we detected a ${randomStyle} tone. ${data.toneRawText.substring(0, 50)}...`
            },
            create: {
                userId,
                name: "Analyzed Persona",
                style: `Based on your inputs, we detected a ${randomStyle} tone.`
            }
        })
    }

    // 4. Trigger initial fetch
    await refreshFeeds()

    return { success: true }
}
