'use server'

import { prisma } from "@/lib/db"
import { auth } from "@clerk/nextjs/server"
import { revalidatePath } from "next/cache"

// Get scheduled posts for a specific month
export async function getScheduledPosts(year: number, month: number) {
    const { userId } = await auth()
    if (!userId) return []

    const startDate = new Date(year, month - 1, 1)
    const endDate = new Date(year, month, 0, 23, 59, 59)

    return await prisma.post.findMany({
        where: {
            userId,
            scheduledFor: {
                gte: startDate,
                lte: endDate
            }
        },
        orderBy: {
            scheduledFor: 'asc'
        },
        include: {
            article: {
                include: {
                    feed: true
                }
            }
        }
    })
}

// Get all posts (scheduled + drafts)
export async function getAllPosts(filter?: {
    status?: string,
    platform?: string,
    month?: number,
    year?: number
}) {
    const { userId } = await auth()
    if (!userId) return []

    const where: any = { userId }

    if (filter?.status && filter.status !== 'ALL') {
        where.status = filter.status
    }

    if (filter?.platform && filter.platform !== 'ALL') {
        where.platform = filter.platform
    }

    if (filter?.month && filter?.year) {
        const startDate = new Date(filter.year, filter.month - 1, 1)
        const endDate = new Date(filter.year, filter.month, 0, 23, 59, 59)
        where.scheduledFor = {
            gte: startDate,
            lte: endDate
        }
    }

    return await prisma.post.findMany({
        where,
        orderBy: {
            scheduledFor: 'asc'
        },
        include: {
            article: {
                include: {
                    feed: true
                }
            }
        },
        take: 100
    })
}

// Schedule a post
export async function schedulePost(postId: string, scheduledFor: Date) {
    const { userId } = await auth()
    if (!userId) throw new Error("Unauthorized")

    await prisma.post.updateMany({
        where: {
            id: postId,
            userId
        },
        data: {
            scheduledFor,
            status: 'SCHEDULED'
        }
    })

    revalidatePath('/dashboard/scheduler')
    return { success: true }
}

// Reschedule a post
export async function reschedulePost(postId: string, newDate: Date) {
    const { userId } = await auth()
    if (!userId) throw new Error("Unauthorized")

    await prisma.post.updateMany({
        where: {
            id: postId,
            userId
        },
        data: {
            scheduledFor: newDate
        }
    })

    revalidatePath('/dashboard/scheduler')
    return { success: true }
}

// Cancel scheduled post (back to draft)
export async function cancelScheduledPost(postId: string) {
    const { userId } = await auth()
    if (!userId) throw new Error("Unauthorized")

    await prisma.post.updateMany({
        where: {
            id: postId,
            userId
        },
        data: {
            scheduledFor: null,
            status: 'DRAFT'
        }
    })

    revalidatePath('/dashboard/scheduler')
    return { success: true }
}

// Mark post as published
export async function markPostPublished(postId: string) {
    const { userId } = await auth()
    if (!userId) throw new Error("Unauthorized")

    await prisma.post.updateMany({
        where: {
            id: postId,
            userId
        },
        data: {
            status: 'PUBLISHED'
        }
    })

    revalidatePath('/dashboard/scheduler')
    return { success: true }
}

// Get calendar stats (posts per day for the month)
export async function getCalendarStats(year: number, month: number) {
    const { userId } = await auth()
    if (!userId) return {}

    const startDate = new Date(year, month - 1, 1)
    const endDate = new Date(year, month, 0, 23, 59, 59)

    const posts = await prisma.post.findMany({
        where: {
            userId,
            scheduledFor: {
                gte: startDate,
                lte: endDate
            }
        },
        select: {
            scheduledFor: true
        }
    })

    // Group by day
    const stats: { [day: number]: number } = {}
    posts.forEach(post => {
        if (post.scheduledFor) {
            const day = post.scheduledFor.getDate()
            stats[day] = (stats[day] || 0) + 1
        }
    })

    return stats
}
