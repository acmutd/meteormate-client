import { NextRequest, NextResponse } from "next/server";
import { HttpMethod } from "@/types/apiCalls";

const BACKEND_URL = (process.env.NEXT_PUBLIC_API_BASE_URL ?? "");

async function proxyRequest(req: NextRequest, method: HttpMethod) {
    if (!BACKEND_URL) {
        return new NextResponse(JSON.stringify({ detail: "No backend URL configured" }), {
            status: 503,
            headers: { "Content-Type": "application/json" },
        });
    }
    const authorization = req.headers.get("Authorization");

    const headers: Record<string, string> = {
        "Content-Type": "application/json",
    };

    if (authorization) {
        headers["Authorization"] = authorization;
    }

    let body: string | undefined;
    if (method !== "GET" && method !== "HEAD") {
        body = await req.text();
    }

    // forward the exact path and search parameters if there are
    const { pathname, search } = new URL(req.url);

    try {
        const url = `${BACKEND_URL.replace(/\/$/, "")}${pathname}${search}`;
        const response = await fetch(url, {
            method,
            headers,
            body,
        });

        const data = await response.text();

        return new NextResponse(data, {
            status: response.status,
            headers: {
                "Content-Type": response.headers.get("Content-Type") ?? "application/json",
            },
        });
    } catch (err) {
        console.error("Failed to reach backend:", err);
        return new NextResponse(JSON.stringify({ detail: "Could not reach backend" }), {
            status: 500,
            headers: { "Content-Type": "application/json" },
        });
    }
}

export async function GET(req: NextRequest) {
    return proxyRequest(req, "GET");
}

export async function POST(req: NextRequest) {
    return proxyRequest(req, "POST");
}

export async function PUT(req: NextRequest) {
    return proxyRequest(req, "PUT");
}

export async function DELETE(req: NextRequest) {
    return proxyRequest(req, "DELETE");
}

export async function HEAD(req: NextRequest) {
    return proxyRequest(req, "HEAD");
}

export async function PATCH(req: NextRequest) {
    return proxyRequest(req, "PATCH");
}
