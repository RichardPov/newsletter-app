'use server'

import { prisma } from "@/lib/db"
import { auth } from "@clerk/nextjs/server"
import { revalidatePath } from "next/cache"
import OpenAI from "openai"

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
})

// Generate social media posts from article
export async function generateSocialPosts(
    articleId: string,
    options?: {
        linkedinTone?: string
        linkedinStyle?: string
        twitterTone?: string
        twitterStyle?: string
    }
) {
    const { userId } = await auth()
    if (!userId) throw new Error("Unauthorized")

    const article = await prisma.article.findFirst({
        where: { id: articleId, userId }
    })

    if (!article) throw new Error("Article not found")

    // Get custom tone if "custom" is selected
    let customTone = null
    if (options?.linkedinTone === 'custom' || options?.twitterTone === 'custom') {
        customTone = await prisma.toneProfile.findFirst({
            where: { userId }
        })
    }

    try {
        // Build LinkedIn prompt with tone and style
        const linkedinTone = options?.linkedinTone === 'custom'
            ? `${customTone?.name} (${customTone?.style})`
            : options?.linkedinTone || 'professional'
        const linkedinStyle = options?.linkedinStyle || 'professional'

        const linkedinSystemPrompt = `You are a LinkedIn content expert. Create an engaging post with these specifications:
- Tone: ${linkedinTone}
- Style: ${linkedinStyle}
${linkedinStyle === 'viral' ? '- Use strong hooks, emotion, and controversy' : ''}
${linkedinStyle === 'hooky' ? '- Start with curiosity gap or provocative question' : ''}
${linkedinStyle === 'story' ? '- Use narrative arc with beginning, middle, end' : ''}
Format with line breaks for readability. Keep it professional yet engaging.`

        // Build Twitter prompt with tone and style
        const twitterTone = options?.twitterTone === 'custom'
            ? `${customTone?.name} (${customTone?.style})`
            : options?.twitterTone || 'witty'
        const twitterStyle = options?.twitterStyle || 'hooky'

        const twitterSystemPrompt = `You are a Twitter/X content expert. Create an engaging thread with these specifications:
- Tone: ${twitterTone}
- Style: ${twitterStyle}
${twitterStyle === 'viral' ? '- Use strong hooks, emotional triggers, and controversy' : ''}
${twitterStyle === 'hooky' ? '- Start with curiosity gap or provocative question' : ''}
${twitterStyle === 'thread' ? '- Create 3-5 tweet thread with numbered format' : ''}
${twitterStyle === 'story' ? '- Use narrative storytelling across tweets' : ''}
Format as a thread. First tweet is the hook, last tweet includes a CTA. Keep tweets punchy (under 280 chars).`

        // Generate Twitter thread
        const twitterCompletion = await openai.chat.completions.create({
            model: "gpt-4o-mini",
            messages: [
                {
                    role: "system",
                    content: twitterSystemPrompt
                },
                {
                    role: "user",
                    content: `Create a Twitter thread about this article:\n\nTitle: ${article.title}\nSummary: ${article.summary}\nURL: ${article.url}`
                }
            ],
            max_tokens: 500,
            temperature: 0.7
        })

        const twitterContent = twitterCompletion.choices[0].message.content || "Thread generation failed"

        // Generate LinkedIn post
        const linkedinCompletion = await openai.chat.completions.create({
            model: "gpt-4o-mini",
            messages: [
                {
                    role: "system",
                    content: linkedinSystemPrompt
                },
                {
                    role: "user",
                    content: `Create a LinkedIn post about this article:\n\nTitle: ${article.title}\nSummary: ${article.summary}\nURL: ${article.url}`
                }
            ],
            max_tokens: 600,
            temperature: 0.7
        })

        const linkedinContent = linkedinCompletion.choices[0].message.content || "LinkedIn post generation failed"

        // Save both posts to database
        const twitterPost = await prisma.post.create({
            data: {
                userId,
                articleId,
                platform: "TWITTER",
                content: twitterContent,
                status: "DRAFT"
            }
        })

        const linkedinPost = await prisma.post.create({
            data: {
                userId,
                articleId,
                platform: "LINKEDIN",
                content: linkedinContent,
                status: "DRAFT"
            }
        })

        revalidatePath('/dashboard/social')

        return {
            success: true,
            posts: {
                twitter: twitterPost,
                linkedin: linkedinPost
            }
        }
    } catch (error: any) {
        console.error("Social post generation error:", error)

        // Fallback to mock if OpenAI fails
        const twitterPost = await prisma.post.create({
            data: {
                userId,
                articleId,
                platform: "TWITTER",
                content: `🚀 Just read: ${article.title}\n\nKey takeaway: ${article.summary?.slice(0, 200)}\n\nFull story: ${article.url}`,
                status: "DRAFT"
            }
        })

        const linkedinPost = await prisma.post.create({
            data: {
                userId,
                articleId,
                platform: "LINKEDIN",
                content: `📰 Interesting read: ${article.title}\n\n${article.summary}\n\nWhat are your thoughts on this? 💭\n\nRead more: ${article.url}`,
                status: "DRAFT"
            }
        })

        return {
            success: true,
            posts: {
                twitter: twitterPost,
                linkedin: linkedinPost
            },
            usedFallback: true
        }
    }
}

// Get all posts for user
export async function getSocialPosts(platform?: string) {
    const { userId } = await auth()
    if (!userId) return []

    const where: any = { userId }
    if (platform && platform !== 'ALL') {
        where.platform = platform
    }

    return await prisma.post.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        include: {
            article: {
                include: {
                    feed: true
                }
            }
        },
        take: 50
    })
}

// Update post
export async function updatePost(postId: string, data: {
    content?: string
    scheduledFor?: Date
    status?: 'DRAFT' | 'SCHEDULED' | 'PUBLISHED'
}) {
    const { userId } = await auth()
    if (!userId) throw new Error("Unauthorized")

    await prisma.post.updateMany({
        where: {
            id: postId,
            userId
        },
        data
    })

    revalidatePath('/dashboard/social')
    revalidatePath('/dashboard/scheduler')
    return { success: true }
}

// Delete post
export async function deletePost(postId: string) {
    const { userId } = await auth()
    if (!userId) throw new Error("Unauthorized")

    await prisma.post.deleteMany({
        where: {
            id: postId,
            userId
        }
    })

    revalidatePath('/dashboard/social')
    return { success: true }
}
