import { prisma } from "@/lib/prisma";

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default async function TestDbPage() {
    let status = "Pending";
    let message = "";
    let envCheck = "";
    let details = "";

    try {
        // Check if Env var exists (mask it)
        const url = process.env.DATABASE_URL;
        if (!url) {
            throw new Error("DATABASE_URL environment variable is NOT set.");
        }
        envCheck = `Present (Starts with ${url.substring(0, 15)}...)`;

        // Test Connection
        await prisma.$connect();
        status = "Connected";

        // Test Query
        const count = await prisma.level.count();
        message = `Successfully connected! Found ${count} levels.`;

    } catch (error: any) {
        status = "Failed";
        message = error.message;
        details = JSON.stringify(error, null, 2);
        console.error("DB Test Error:", error);
    } finally {
        await prisma.$disconnect();
    }

    return (
        <div className="p-10 font-mono">
            <h1 className="text-2xl font-bold mb-4">Database Connection Test</h1>

            <div className="space-y-4">
                <div className="p-4 border rounded bg-slate-50">
                    <strong>Status:</strong>
                    <span className={status === "Connected" ? "text-green-600 ml-2 font-bold" : "text-red-600 ml-2 font-bold"}>
                        {status}
                    </span>
                </div>

                <div className="p-4 border rounded bg-slate-50">
                    <strong>Environment Variable (DATABASE_URL):</strong>
                    <pre className="mt-2 text-sm">{envCheck || "Missing"}</pre>
                </div>

                <div className="p-4 border rounded bg-slate-50">
                    <strong>Message:</strong>
                    <pre className="mt-2 text-sm whitespace-pre-wrap">{message}</pre>
                </div>

                {details && (
                    <div className="p-4 border rounded bg-red-50 text-red-800">
                        <strong>Error Details:</strong>
                        <pre className="mt-2 text-xs overflow-auto">{details}</pre>
                    </div>
                )}
            </div>
        </div>
    );
}
