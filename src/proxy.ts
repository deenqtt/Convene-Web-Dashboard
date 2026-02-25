// src/proxy.ts
import { NextRequest, NextResponse } from "next/server";

const PUBLIC_PATHS = ["/login", "/api/auth"];

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Allow public paths (login page + auth API)
  if (PUBLIC_PATHS.some((p) => pathname.startsWith(p))) {
    return NextResponse.next();
  }

  const token = request.cookies.get("auth_token");

  if (!token?.value) {
    const loginUrl = new URL("/login", request.url);
    if (pathname !== "/") {
      loginUrl.searchParams.set("from", pathname);
    }
    return NextResponse.redirect(loginUrl);
  }

  // Inject MEETING_API_SECRET as Authorization header for all proxied API calls
  if (pathname.startsWith("/api")) {
    const apiSecret = process.env.MEETING_API_SECRET;
    if (apiSecret) {
      const headers = new Headers(request.headers);
      headers.set("authorization", `Bearer ${apiSecret}`);
      return NextResponse.next({ request: { headers } });
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon\\.ico|.*\\.svg|.*\\.png|.*\\.jpg|.*\\.ico).*)",
  ],
};
