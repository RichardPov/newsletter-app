import { NextResponse } from "next/server"
import { Pool } from "pg"

const connectToPort = async (connectionString: string, portOverride: number | null, name: string) => {
    let pool = null;
    let client = null;
    const result = { name, success: false, time: null as any, error: null as any, port: 0 };

    try {
        const url = new URL(connectionString);
        if (portOverride) {
            url.port = portOverride.toString();
        }
        result.port = parseInt(url.port);

        pool = new Pool({
            connectionString: url.toString(),
            ssl: { rejectUnauthorized: false },
            connectionTimeoutMillis: 8000, // Increased timeout 8s
        });

        const start = Date.now();
        client = await pool.connect();
        const res = await client.query('SELECT NOW()');
        result.time = res.rows[0];
        result.success = true;
        result.time = (Date.now() - start) + "ms";
    } catch (e: any) {
        result.error = e.message;
    } finally {
        if (client) (client as any).release();
        if (pool) await pool.end().catch(() => { });
    }
    return result;
}

export async function GET() {
    const connectionString = process.env.DATABASE_URL;
    if (!connectionString) return NextResponse.json({ error: "DATABASE_URL missing" }, { status: 500 });

    // Test both ports
    const [test6543, test5432] = await Promise.all([
        connectToPort(connectionString, 6543, "Transaction Pooler (6543)"),
        connectToPort(connectionString, 5432, "Direct Session (5432)")
    ]);

    const status = (test6543.success || test5432.success) ? "partial_ok" : "error";

    return NextResponse.json({
        status,
        results: [test6543, test5432],
        env: {
            nodeEnv: process.env.NODE_ENV,
            host: new URL(connectionString).hostname
        }
    }, { status: status === "error" ? 500 : 200 })
}
