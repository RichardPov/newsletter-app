'use server'

import { prisma } from "@/lib/db"
import { auth, currentUser } from "@clerk/nextjs/server"
import Parser from 'rss-parser'
import { revalidatePath } from "next/cache"
import OpenAI from "openai"

const parser = new Parser()

export async function getFeeds() {
    const { userId } = await auth()
    if (!userId) return []

    const feeds = await prisma.feed.findMany({
        where: { userId },
        orderBy: { createdAt: 'desc' }
    })

    // Auto-seed if empty
    if (feeds.length === 0) {
        console.log("No feeds found, attempting to seed TechCrunch...")
        try {
            const feedUrl = "https://techcrunch.com/feed/";
            const defaultFeed = await parser.parseURL(feedUrl)
            const newFeed = await prisma.feed.create({
                data: {
                    userId,
                    url: feedUrl,
                    name: defaultFeed.title || "TechCrunch"
                }
            })
            console.log("Seeded successfully:", newFeed.id)
            return [newFeed]
        } catch (e: any) {
            console.error("Failed to seed default feed:", e.message)
            // Return empty if seeding fails, don't crash
            return []
        }
    }

    return feeds
}

// ... (inside addFeed)
export async function addFeed(rawUrl: string, category?: string, skipRefresh: boolean = false) {
    // ... existing logic ...

    await prisma.feed.create({
        data: {
            userId,
            url,
            name,
            category  // Add category if provided
        }
    })

    // Immediately fetch articles unless skipped
    if (!skipRefresh) {
        await refreshFeeds()
    }

    revalidatePath('/dashboard/feeds')
    revalidatePath('/dashboard/discover')
    return { success: true }
} catch (e: any) {
    // ...

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

        const openai = new OpenAI({
            apiKey: process.env.OPENAI_API_KEY,
        })

        let newCount = 0

        for (const feed of feeds) {
            try {
                const parsed = await parser.parseURL(feed.url)

                // Limit to top 5 most recent items per feed to avoid rate limits/cost spikes
                const recentItems = parsed.items.slice(0, 5)

                for (const item of recentItems) {
                    if (!item.link || !item.title) continue

                    // Check for duplicate BEFORE processing AI to save money
                    const existing = await prisma.article.findFirst({
                        where: {
                            userId,
                            url: item.link
                        }
                    })

                    if (existing) continue

                    let viralScore = 0
                    let summary = "No summary available."

                    // REAL AI ANALYSIS
                    if (process.env.OPENAI_API_KEY) {
                        try {
                            const contentToAnalyze = (item.contentSnippet || item.content || item.title).substring(0, 1000)

                            const completion = await openai.chat.completions.create({
                                model: "gpt-4o-mini",
                                messages: [
                                    {
                                        role: "system",
                                        content: `You are an expert content curator for a tech newsletter. Analyze the article.
                                    Return a JSON object with:
                                    - "summary": A concise, engaging summary (max 2 sentences).
                                    - "viralScore": A number between 0-10 indicating potential virality on social media (Tech/Business audience).`
                                    },
                                    {
                                        role: "user",
                                        content: `Title: ${item.title}\nContent: ${contentToAnalyze}`
                                    }
                                ],
                                response_format: { type: "json_object" }
                            })

                            const result = JSON.parse(completion.choices[0].message.content || "{}")
                            summary = result.summary || summary
                            viralScore = result.viralScore || 0

                        } catch (aiError) {
                            console.error("OpenAI Error:", aiError)
                            summary = "AI analysis failed, using fallback."
                        }
                    } else {
                        // Fallback Mock
                        viralScore = Math.floor(Math.random() * 10) + 1
                        summary = "AI summary pending... (Key missing)"
                    }

                    try {
                        await prisma.article.create({
                            data: {
                                userId,
                                feedId: feed.id,
                                title: item.title,
                                url: item.link,
                                content: item.contentSnippet || item.content || "",
                                summary: summary,
                                publishedAt: item.isoDate ? new Date(item.isoDate) : new Date(),
                                viralScore: viralScore,
                                status: "REVIEW"
                            }
                        })
                        newCount++
                    } catch (e) {
                        // Ignore unique constraint violations if they slip through
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

    // System-level refresh (For Cron Jobs - No Auth Required)
    export async function refreshAllFeeds() {
        // Fetch ALL active feeds regardless of user
        const feeds = await prisma.feed.findMany({
            where: { isActive: true }
        })

        const openai = new OpenAI({
            apiKey: process.env.OPENAI_API_KEY,
        })

        let newCount = 0

        for (const feed of feeds) {
            try {
                const parsed = await parser.parseURL(feed.url)
                const recentItems = parsed.items.slice(0, 5)

                for (const item of recentItems) {
                    if (!item.link || !item.title) continue

                    // Check duplicate
                    const existing = await prisma.article.findFirst({
                        where: {
                            userId: feed.userId, // Use feed's owner ID
                            url: item.link
                        }
                    })

                    if (existing) continue

                    let viralScore = 0
                    let summary = "No summary available."

                    // REAL AI ANALYSIS
                    if (process.env.OPENAI_API_KEY) {
                        try {
                            const contentToAnalyze = (item.contentSnippet || item.content || item.title).substring(0, 1000)

                            const completion = await openai.chat.completions.create({
                                model: "gpt-4o-mini",
                                messages: [
                                    {
                                        role: "system",
                                        content: `You are an expert content curator. Analyze the article.
                                    Return a JSON object with:
                                    - "summary": A concise summary (max 2 sentences).
                                    - "viralScore": A number between 0-10 indicating potential virality.`
                                    },
                                    {
                                        role: "user",
                                        content: `Title: ${item.title}\nContent: ${contentToAnalyze}`
                                    }
                                ],
                                response_format: { type: "json_object" }
                            })

                            const result = JSON.parse(completion.choices[0].message.content || "{}")
                            summary = result.summary || summary
                            viralScore = result.viralScore || 0

                        } catch (aiError) {
                            console.error("OpenAI Error:", aiError)
                            summary = "AI analysis failed, using fallback."
                        }
                    } else {
                        viralScore = Math.floor(Math.random() * 10) + 1
                        summary = "AI summary pending... (Key missing)"
                    }

                    try {
                        await prisma.article.create({
                            data: {
                                userId: feed.userId,
                                feedId: feed.id,
                                title: item.title,
                                url: item.link,
                                content: item.contentSnippet || item.content || "",
                                summary: summary,
                                publishedAt: item.isoDate ? new Date(item.isoDate) : new Date(),
                                viralScore: viralScore,
                                status: "REVIEW"
                            }
                        })
                        newCount++
                    } catch (e) {
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
