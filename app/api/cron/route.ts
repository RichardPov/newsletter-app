import { refreshAllFeeds } from '@/lib/actions'
import { NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

export async function GET(request: Request) {
    try {
        console.log("Cron job started: Refreshing ALL feeds...")
        const result = await refreshAllFeeds()
        console.log("Cron job finished:", result)

        return NextResponse.json({
            success: true,
            message: `Processed ${result.count} new articles.`,
            details: result
        })
    } catch (error: any) {
        console.error("Cron job failed:", error)
        return NextResponse.json(
            { success: false, error: error.message },
            { status: 500 }
        )
    }
}
