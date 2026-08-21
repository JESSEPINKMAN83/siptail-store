import { NextRequest, NextResponse } from "next/server";
import { createWixAuthClient, parseSessionFromCookie } from "@/lib/wix-auth-client";

export async function POST(req: NextRequest) {
  try {
    const tokens = parseSessionFromCookie(req.headers.get("cookie"));
    if (!tokens) return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    const { firstName, lastName } = await req.json();
    const client = createWixAuthClient(tokens);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const membersApi = client.members as any;
    const result = await membersApi.getCurrentMember();
    const memberId = result?.member?._id ?? result?.member?.id;
    if (!memberId) return NextResponse.json({ error: "Member not found" }, { status: 404 });
    await membersApi.updateMember(memberId, { profile: { firstName, lastName } });
    return NextResponse.json({ ok: true });
  } catch (e: unknown) {
    return NextResponse.json({ error: e instanceof Error ? e.message : "Update failed" }, { status: 500 });
  }
}
