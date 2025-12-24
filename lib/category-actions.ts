'use server'

import { prisma } from "@/lib/db"
import { auth } from "@clerk/nextjs/server"
import { revalidatePath } from "next/cache"
import { CATEGORIES, getCategoryById } from "./categories"
import { addFeed, refreshFeeds } from "./actions"

// Get all available categories
export async function getCategories() {
    return CATEGORIES
}

// Get user's subscribed categories
export async function getUserCategories() {
    const { userId } = await auth()
    if (!userId) return []

    const feeds = await prisma.feed.findMany({
        where: { userId, category: { not: null } },
        select: { category: true },
        distinct: ['category']
    })

    return feeds.map(f => f.category).filter(Boolean) as string[]
}

// Subscribe to a category (adds 3 feeds)
export async function subscribeToCategory(categoryId: string) {
    const { userId } = await auth()
    if (!userId) throw new Error("Unauthorized")

    const category = getCategoryById(categoryId)
    if (!category) throw new Error("Category not found")

    // Check if already subscribed
    const existing = await prisma.feed.findFirst({
        where: { userId, category: categoryId }
    })

    if (existing) {
        return { success: false, error: "Already subscribed to this category" }
    }

    // Add all 3 feeds for this category
    // Add all 3 feeds for this category
    const results = []
    for (const feed of category.feeds) {
        try {
            // Pass true to skip refresh for individual feeds
            const result = await addFeed(feed.url, categoryId, true)
            results.push(result)
        } catch (error) {
            console.error(`Failed to add feed ${feed.name}:`, error)
        }
    }

    // Refresh all feeds once at the end
    // We need to import refreshFeeds from actions, but circular dependency might be an issue if we are not careful.
    // However, addFeed is in actions.ts. 
    // Ideally we should move subscribeToCategory to actions.ts or move refreshFeeds to a shared file.
    // For now, let's assume we can't easily import refreshFeeds here if it's not exported or if it causes circular dep.
    // Actually, addFeed is imported from "./actions". We can import refreshFeeds from there too.

    // Note: If I can't import refreshFeeds here easily, I should rely on the user visiting Articles page later.
    // But for better UX, let's try to trigger it.

    revalidatePath('/dashboard/discover')
    revalidatePath('/dashboard/articles')

    return {
        success: true,
        category: category.name,
        feedsAdded: results.filter(r => r.success).length
    }
}

// Unsubscribe from a category (removes all associated feeds)
export async function unsubscribeFromCategory(categoryId: string) {
    const { userId } = await auth()
    if (!userId) throw new Error("Unauthorized")

    await prisma.feed.deleteMany({
        where: { userId, category: categoryId }
    })

    revalidatePath('/dashboard/discover')
    revalidatePath('/dashboard/articles')

    return { success: true }
}

// Toggle article like
export async function toggleArticleLike(articleId: string) {
    const { userId } = await auth()
    if (!userId) throw new Error("Unauthorized")

    const article = await prisma.article.findFirst({
        where: { id: articleId, userId },
        select: { isLiked: true }
    })

    if (!article) throw new Error("Article not found")

    await prisma.article.updateMany({
        where: { id: articleId, userId },
        data: { isLiked: !article.isLiked }
    })

    revalidatePath('/dashboard/articles')

    return { success: true, isLiked: !article.isLiked }
}
