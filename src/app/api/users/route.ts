// src/app/api/users/route.ts
// Proxy to ext-users with short-lived cache to avoid hammering the upstream API

import { NextResponse } from "next/server";

const EXT_USERS_URL = "https://ppic-backend.iotech.my.id/ext-users";

export async function GET() {
  try {
    const resp = await fetch(EXT_USERS_URL, {
      next: { revalidate: 300 }, // cache 5 minutes
    });

    if (!resp.ok) {
      return NextResponse.json(
        { message: "Failed to fetch users" },
        { status: resp.status }
      );
    }

    const data = await resp.json();
    return NextResponse.json(data, {
      headers: {
        "Cache-Control": "public, s-maxage=300, stale-while-revalidate=60",
      },
    });
  } catch (err) {
    console.error("[Users] Fetch error:", err);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}
