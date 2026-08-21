import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { name, email, question, productSlug } = await req.json();
    if (!name || !email || !question) return NextResponse.json({ error: "All fields required." }, { status: 400 });
    console.log("Product question:", { name, email, question, productSlug });
    // Create contact in Wix
    try {
      await fetch("https://www.wixapis.com/contacts/v4/contacts", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${process.env.WIX_API_KEY || ""}`,
          "wix-site-id": "c9466f44-badc-4481-af3e-2b00fa6472c8",
        },
        body: JSON.stringify({
          info: {
            name: { first: name.split(" ")[0], last: name.split(" ").slice(1).join(" ") || "" },
            emails: { items: [{ email, primary: true }] },
            labelKeys: { items: [{ key: "custom.product-question" }] },
          },
        }),
      });
    } catch (e) { console.error("Wix contact creation failed:", e); }
    return NextResponse.json({ ok: true });
  } catch (e) {
    console.error("Question form error:", e);
    return NextResponse.json({ error: "Something went wrong. Please try again." }, { status: 500 });
  }
}
