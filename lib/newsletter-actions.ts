'use server'

import { prisma } from "@/lib/db"
import { auth } from "@clerk/nextjs/server"
import { revalidatePath } from "next/cache"
import { writeFile } from "fs/promises"
import path from "path"

// Get all newsletters for current user
export async function getNewsletters() {
    const { userId } = await auth()
    if (!userId) return []

    return await prisma.newsletter.findMany({
        where: { userId },
        orderBy: { updatedAt: 'desc' },
        include: {
            articleLinks: {
                include: {
                    article: {
                        include: {
                            feed: true
                        }
                    }
                },
                orderBy: { order: 'asc' }
            }
        }
    })
}

// Get single newsletter with articles
export async function getNewsletter(id: string) {
    const { userId } = await auth()
    if (!userId) return null

    return await prisma.newsletter.findFirst({
        where: { id, userId },
        include: {
            articleLinks: {
                include: {
                    article: {
                        include: {
                            feed: true
                        }
                    }
                },
                orderBy: { order: 'asc' }
            }
        }
    })
}

// Create new newsletter
export async function createNewsletter(data: {
    title: string,
    intro?: string,
    outro?: string
}) {
    const { userId } = await auth()
    if (!userId) throw new Error("Unauthorized")

    const newsletter = await prisma.newsletter.create({
        data: {
            userId,
            title: data.title,
            intro: data.intro,
            outro: data.outro
        }
    })

    revalidatePath('/dashboard/newsletter')
    return { success: true, newsletter }
}

// Update newsletter customization
export async function updateNewsletter(id: string, data: {
    title?: string,
    intro?: string,
    outro?: string,
    headerColor?: string,
    textColor?: string,
    footerText?: string,
    logoUrl?: string
}) {
    const { userId } = await auth()
    if (!userId) throw new Error("Unauthorized")

    await prisma.newsletter.update({
        where: { id, userId },
        data
    })

    revalidatePath('/dashboard/newsletter')
    return { success: true }
}

// Add article to newsletter
export async function addArticleToNewsletter(newsletterId: string, articleId: string, order?: number) {
    const { userId } = await auth()
    if (!userId) throw new Error("Unauthorized")

    // Verify newsletter belongs to user
    const newsletter = await prisma.newsletter.findFirst({
        where: { id: newsletterId, userId }
    })
    if (!newsletter) throw new Error("Newsletter not found")

    // Get current max order if order not provided
    if (order === undefined) {
        const maxOrder = await prisma.articleNewsletter.aggregate({
            where: { newsletterId },
            _max: { order: true }
        })
        order = (maxOrder._max.order ?? -1) + 1
    }

    await prisma.articleNewsletter.upsert({
        where: {
            newsletterId_articleId: {
                newsletterId,
                articleId
            }
        },
        update: { order },
        create: {
            newsletterId,
            articleId,
            order
        }
    })

    revalidatePath('/dashboard/newsletter')
    return { success: true }
}

// Remove article from newsletter
export async function removeArticleFromNewsletter(newsletterId: string, articleId: string) {
    const { userId } = await auth()
    if (!userId) throw new Error("Unauthorized")

    await prisma.articleNewsletter.deleteMany({
        where: {
            newsletterId,
            articleId,
            newsletter: {
                userId
            }
        }
    })

    revalidatePath('/dashboard/newsletter')
    return { success: true }
}

// Reorder articles
export async function reorderArticles(newsletterId: string, articleIds: string[]) {
    const { userId } = await auth()
    if (!userId) throw new Error("Unauthorized")

    // Update order for each article
    await Promise.all(
        articleIds.map((articleId, index) =>
            prisma.articleNewsletter.updateMany({
                where: {
                    newsletterId,
                    articleId,
                    newsletter: { userId }
                },
                data: { order: index }
            })
        )
    )

    revalidatePath('/dashboard/newsletter')
    return { success: true }
}

// Upload newsletter logo
export async function uploadNewsletterLogo(formData: FormData) {
    const { userId } = await auth()
    if (!userId) throw new Error("Unauthorized")

    const file = formData.get('logo') as File
    if (!file) throw new Error("No file provided")

    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)

    // Save to public/uploads
    const filename = `logo-${userId}-${Date.now()}${path.extname(file.name)}`
    const filepath = path.join(process.cwd(), 'public', 'uploads', filename)

    await writeFile(filepath, buffer)

    const logoUrl = `/uploads/${filename}`

    return { success: true, logoUrl }
}

// Export newsletter as HTML
export async function exportNewsletter(id: string) {
    const { userId } = await auth()
    if (!userId) throw new Error("Unauthorized")

    const newsletter = await getNewsletter(id)
    if (!newsletter) throw new Error("Newsletter not found")

    // Generate HTML email template
    const html = generateEmailHTML(newsletter)

    return { success: true, html }
}

// Generate Email HTML Template
function generateEmailHTML(newsletter: any) {
    const { title, intro, outro, headerColor, textColor, footerText, logoUrl, articleLinks } = newsletter

    return `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${title}</title>
</head>
<body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Arial, sans-serif; background-color: #f3f4f6">
    <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f3f4f6; padding: 40px 20px">
        <tr>
            <td align="center">
                <table width="600" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border-radius: 8px; overflow: hidden">
                    <!-- Header -->
                    <tr>
                        <td style="background-color: ${headerColor}; padding: 40px 30px; text-align: center">
                            ${logoUrl ? `<img src="${process.env.NEXT_PUBLIC_BASE_URL}${logoUrl}" alt="Logo" style="max-width: 200px; height: auto; margin-bottom: 20px">` : ''}
                            <h1 style="margin: 0; color: #ffffff; font-size: 28px; font-weight: bold">${title}</h1>
                        </td>
                    </tr>
                    
                    <!-- Intro -->
                    ${intro ? `
                    <tr>
                        <td style="padding: 30px; color: ${textColor}; font-size: 16px; line-height: 1.6">
                            ${intro}
                        </td>
                    </tr>
                    ` : ''}
                    
                    <!-- Articles -->
                    ${articleLinks.map((link: any, index: number) => `
                    <tr>
                        <td style="padding: ${index === 0 ? '30px' : '0 30px 30px 30px'}">
                            <table width="100%" cellpadding="0" cellspacing="0" style="border: 1px solid #e5e7eb; border-radius: 8px; overflow: hidden">
                                <tr>
                                    <td style="padding: 20px">
                                        <h2 style="margin: 0 0 10px 0; color: ${textColor}; font-size: 20px; font-weight: 600">
                                            <a href="${link.article.url}" style="color: ${textColor}; text-decoration: none">${link.article.title}</a>
                                        </h2>
                                        <p style="margin: 0 0 15px 0; color: #6b7280; font-size: 14px; line-height: 1.5">${link.article.summary}</p>
                                        <a href="${link.article.url}" style="display: inline-block; background-color: ${headerColor}; color: #ffffff; padding: 10px 20px; border-radius: 6px; text-decoration: none; font-size: 14px; font-weight: 500">Read More →</a>
                                    </td>
                                </tr>
                            </table>
                        </td>
                    </tr>
                    `).join('')}
                    
                    <!-- Outro -->
                    ${outro ? `
                    <tr>
                        <td style="padding: 30px; color: ${textColor}; font-size: 16px; line-height: 1.6; border-top: 1px solid #e5e7eb">
                            ${outro}
                        </td>
                    </tr>
                    ` : ''}
                    
                    <!-- Footer -->
                    ${footerText ? `
                    <tr>
                        <td style="padding: 30px; background-color: #f9fafb; color: #6b7280; font-size: 14px; line-height: 1.6; text-align: center">
                            ${footerText}
                        </td>
                    </tr>
                    ` : ''}
                </table>
            </td>
        </tr>
    </table>
</body>
</html>
    `.trim()
}

// Delete newsletter
export async function deleteNewsletter(id: string) {
    const { userId } = await auth()
    if (!userId) throw new Error("Unauthorized")

    await prisma.newsletter.delete({
        where: { id, userId }
    })

    revalidatePath('/dashboard/newsletter')
    return { success: true }
}
