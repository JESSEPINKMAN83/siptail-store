import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { email } = await req.json();
    if (!email || !email.includes("@")) return NextResponse.json({ error: "Valid email required" }, { status: 400 });
    // Create/update Wix contact with newsletter label
    const res = await fetch("https://www.wixapis.com/contacts/v4/contacts", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${process.env.WIX_API_KEY || ""}`,
        "wix-site-id": process.env.WIX_SITE_ID || "c9466f44-badc-4481-af3e-2b00fa6472c8",
      },
      body: JSON.stringify({
        info: {
          emails: { items: [{ email, primary: true }] },
          labelKeys: { items: [{ key: "custom.newsletter" }] },
        },
      }),
    });
    if (!res.ok && res.status !== 409) {
      // 409 = already exists, which is fine for newsletter signup
      console.error("Wix contact create failed:", res.status);
    }
    return NextResponse.json({ ok: true });
  } catch (e) {
    console.error("Newsletter signup error:", e);
    // Always return OK — don't block the user on API failures
    return NextResponse.json({ ok: true });
  }
}
