import { NextResponse } from "next/server"
import { prisma } from "@/lib/db"

export async function GET() {
    try {
        await prisma.$connect()
        // Try a simple query
        const userCount = await prisma.user.count()
        return NextResponse.json({ status: "ok", userCount, databaseUrl: process.env.DATABASE_URL ? "Defined" : "Missing" })
    } catch (e: any) {
        return NextResponse.json({
            status: "error",
            message: e.message,
            stack: e.stack,
            env: {
                hasDbUrl: !!process.env.DATABASE_URL,
                nodeEnv: process.env.NODE_ENV
            }
        }, { status: 500 })
    }
}
