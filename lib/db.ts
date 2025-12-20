import { PrismaClient } from '@prisma/client'
import { Pool } from 'pg'
import { PrismaPg } from '@prisma/adapter-pg'

// Ensure we don't start multiple pools in development
const globalForPrisma = globalThis as unknown as {
    prisma: PrismaClient | undefined
}

const connectionString = process.env.DATABASE_URL

if (!connectionString) {
    throw new Error("DATABASE_URL is not set")
}

const pool = new Pool({
    connectionString,
    max: 1, // Optimization for Vercel Serverless Function Limits
    ssl: { rejectUnauthorized: false }
})
const adapter = new PrismaPg(pool)

export const prisma = globalForPrisma.prisma ?? new PrismaClient({ adapter })

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma
