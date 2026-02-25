// src/app/api/auth/login/route.ts
import { NextRequest, NextResponse } from "next/server";

const AUTH_SERVER = "https://authserver-backend.iotech.my.id";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { username, password } = body;

    if (!username || !password) {
      return NextResponse.json(
        { message: "Username and password required" },
        { status: 400 }
      );
    }

    const resp = await fetch(`${AUTH_SERVER}/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password }),
    });

    const raw = await resp.text();

    if (!resp.ok) {
      let message = "Login failed";
      try {
        message = JSON.parse(raw)?.message ?? raw;
      } catch {
        message = raw || "Login failed";
      }
      return NextResponse.json({ message }, { status: resp.status });
    }

    // Auth server may return a raw JWT string or a JSON object
    let token: string | null = null;

    if (raw.startsWith("eyJ")) {
      token = raw.trim();
    } else {
      try {
        const data = JSON.parse(raw);
        token =
          data.token ??
          data.accessToken ??
          data.access_token ??
          data.data?.token ??
          data.data?.accessToken ??
          null;
      } catch {
        token = raw.trim() || null;
      }
    }

    if (!token) {
      return NextResponse.json(
        { message: "Invalid response from auth server" },
        { status: 500 }
      );
    }

    const response = NextResponse.json({ success: true });
    response.cookies.set("auth_token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 7, // 7 days
    });

    return response;
  } catch (err) {
    console.error("[Auth] Login error:", err);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}
