"use server"

import { auth } from "@clerk/nextjs"
import prisma from "@/lib/prisma"
import { revalidatePath } from "next/cache"

export async function savePost(data: {
    id?: string
    articleId?: string
    platform: string
    content: string
    scheduledFor?: Date
    status: "DRAFT" | "SCHEDULED" | "PUBLISHED"
}) {
    const { userId } = auth()
    if (!userId) {
        throw new Error("Unauthorized")
    }

    // Default to scheduled if date provided, else draft
    const status = data.status || (data.scheduledFor ? "SCHEDULED" : "DRAFT")

    if (data.id) {
        // Update existing
        await prisma.post.update({
            where: {
                id: data.id,
                userId // Ensure ownership
            },
            data: {
                content: data.content,
                scheduledFor: data.scheduledFor,
                status: status
            }
        })
    } else {
        // Create new
        await prisma.post.create({
            data: {
                userId,
                articleId: data.articleId,
                platform: data.platform,
                content: data.content,
                scheduledFor: data.scheduledFor,
                status: status
            }
        })
    }

    revalidatePath("/dashboard")
    revalidatePath("/dashboard/schedule")
    return { success: true }
}

export async function deletePost(postId: string) {
    const { userId } = auth()
    if (!userId) {
        throw new Error("Unauthorized")
    }

    await prisma.post.delete({
        where: {
            id: postId,
            userId // Ensure ownership
        }
    })

    revalidatePath("/dashboard")
    revalidatePath("/dashboard/schedule")
    return { success: true }
}

export async function getScheduledPosts() {
    const { userId } = auth()
    if (!userId) {
        return []
    }

    // Fetch upcoming posts (or recent ones)
    const posts = await prisma.post.findMany({
        where: {
            userId,
            status: {
                in: ["SCHEDULED", "DRAFT"]
            }
        },
        orderBy: {
            scheduledFor: "asc"
        },
        include: {
            article: true // Include article details if needed
        }
    })

    return posts
}
