import { NextRequest, NextResponse } from "next/server";
import { createWixAuthClient, SESSION_COOKIE } from "@/lib/wix-auth-client";

export async function POST(req: NextRequest) {
  try {
    const { email, password, firstName, lastName } = await req.json();
    if (!email || !password) return NextResponse.json({ error: "Email and password required" }, { status: 400 });

    const client = createWixAuthClient();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const result = await (client.auth as any).register({
      email,
      password,
      profile: { firstName, lastName, nickname: firstName || email.split("@")[0] },
    });

    const state = result?.loginState ?? result?.state;
    const sessionToken = result?.sessionToken;

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
      return NextResponse.json({ ok: true, requiresVerification: true });
    return NextResponse.json({ error: "Registration failed. Please try again." }, { status: 400 });
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : "Registration failed";
    console.error("Register error:", msg);
    if (msg.toLowerCase().includes("already"))
      return NextResponse.json({ error: "An account with this email already exists." }, { status: 409 });
    return NextResponse.json({ error: "Registration failed. Please try again." }, { status: 500 });
  }
}
