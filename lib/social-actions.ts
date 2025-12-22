'use server'

import { prisma } from "@/lib/db"
import { auth } from "@clerk/nextjs/server"
import { revalidatePath } from "next/cache"
import OpenAI from "openai"

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
})

// Generate social media posts from article
export async function generateSocialPosts(articleId: string) {
    const { userId } = await auth()
    if (!userId) throw new Error("Unauthorized")

    const article = await prisma.article.findFirst({
        where: { id: articleId, userId }
    })

    if (!article) throw new Error("Article not found")

    try {
        // Generate Twitter thread
        const twitterCompletion = await openai.chat.completions.create({
            model: "gpt-4o-mini",
            messages: [
                {
                    role: "system",
                    content: "You are a social media expert. Create engaging Twitter/X threads from articles. Format: Thread of 3-5 tweets, numbered. First tweet is the hook, last is CTA. Keep it conversational and punchy."
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
                    content: "You are a professional LinkedIn content creator. Create engaging, thought-provoking posts from articles. Include: Hook, 2-3 key insights, call to action. Use line breaks for readability. Professional but conversational tone."
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
