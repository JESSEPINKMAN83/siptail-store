import { NextRequest, NextResponse } from "next/server";
import { createWixAuthClient, SESSION_COOKIE } from "@/lib/wix-auth-client";

export async function POST(req: NextRequest) {
  try {
    const { email, password } = await req.json();
    if (!email || !password) return NextResponse.json({ error: "Email and password required" }, { status: 400 });

    const client = createWixAuthClient();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const loginResponse = await (client.auth as any).login({ email, password });

    const state = loginResponse?.loginState ?? loginResponse?.state;
    const sessionToken = loginResponse?.sessionToken;

    if ((state === "SUCCESS" || state === "success") && sessionToken) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const tokens = await (client.auth as any).getMemberTokensForDirectLogin(sessionToken);
      const res = NextResponse.json({ ok: true });
      res.cookies.set(SESSION_COOKIE, JSON.stringify(tokens), {
        httpOnly: true, secure: process.env.NODE_ENV === "production",
        sameSite: "lax", maxAge: 60 * 60 * 24 * 30, path: "/",
      });
      return res;
    }
    if (state === "EMAIL_VERIFICATION_REQUIRED" || state === "emailVerificationRequired")
      return NextResponse.json({ error: "Please verify your email before logging in." }, { status: 401 });
    return NextResponse.json({ error: "Invalid email or password." }, { status: 401 });
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : "Login failed";
    console.error("Login error:", msg);
    return NextResponse.json({ error: "Invalid email or password." }, { status: 401 });
  }
}
