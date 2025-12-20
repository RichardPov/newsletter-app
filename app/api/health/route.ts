import { NextResponse } from "next/server"
import { Pool } from "pg"

export async function GET() {
    let pool = null;
    try {
        const connectionString = process.env.DATABASE_URL;
        if (!connectionString) throw new Error("DATABASE_URL is missing");

        // Parse and mask for debug
        const url = new URL(connectionString);
        const maskedUrl = `${url.protocol}//${url.username}:***@${url.hostname}:${url.port}${url.pathname}${url.search}`;

        pool = new Pool({
            connectionString,
            ssl: { rejectUnauthorized: false }, // Explicitly allow self-signed for Supabase
            connectionTimeoutMillis: 5000,
        });

        const client = await pool.connect();
        const res = await client.query('SELECT NOW()');
        client.release();

        return NextResponse.json({
            status: "ok",
            time: res.rows[0],
            debug: { maskedUrl, port: url.port, host: url.hostname }
        });
    } catch (e: any) {
        return NextResponse.json({
            status: "error",
            message: e.message,
            stack: e.stack,
            code: e.code,
            env: {
                hasDbUrl: !!process.env.DATABASE_URL,
                nodeEnv: process.env.NODE_ENV
            }
        }, { status: 500 })
    } finally {
        if (pool) await pool.end().catch(() => { });
    }
}
