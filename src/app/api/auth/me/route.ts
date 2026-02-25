// src/app/api/auth/me/route.ts
import { NextRequest, NextResponse } from "next/server";

function decodeJwtPayload(token: string): Record<string, unknown> {
  try {
    const base64 = token.split(".")[1];
    const json = Buffer.from(base64, "base64url").toString("utf-8");
    return JSON.parse(json);
  } catch {
    return {};
  }
}

export async function GET(request: NextRequest) {
  const token = request.cookies.get("auth_token")?.value;

  if (!token) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const payload = decodeJwtPayload(token);

  // Try common field names from auth servers
  const username =
    (payload.username as string) ??
    (payload.name as string) ??
    (payload.sub as string) ??
    "User";

  const email =
    (payload.email as string) ??
    (payload.mail as string) ??
    null;

  const role =
    (payload.role as string) ??
    (payload.roles as string) ??
    null;

  return NextResponse.json({ username, email, role });
}
