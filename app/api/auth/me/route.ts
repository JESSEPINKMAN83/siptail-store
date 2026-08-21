import { NextRequest, NextResponse } from "next/server";
import { createWixAuthClient, parseSessionFromCookie } from "@/lib/wix-auth-client";

export async function GET(req: NextRequest) {
  try {
    const tokens = parseSessionFromCookie(req.headers.get("cookie"));
    if (!tokens) return NextResponse.json({ member: null });
    const client = createWixAuthClient(tokens);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const auth = client.auth as any;
    if (!auth.loggedIn()) return NextResponse.json({ member: null });
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const result = await (client.members as any).getCurrentMember({ fieldsets: ["FULL"] });
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const m = result?.member as any;
    if (!m) return NextResponse.json({ member: null });
    return NextResponse.json({
      member: {
        id: m._id ?? m.id ?? null,
        loginEmail: m.loginEmail ?? null,
        _createdDate: m._createdDate ?? null,
        profile: {
          firstName: m.profile?.firstName ?? m.profile?.name?.first ?? null,
          lastName: m.profile?.lastName ?? m.profile?.name?.last ?? null,
          nickname: m.profile?.nickname ?? null,
        },
      },
    });
  } catch { return NextResponse.json({ member: null }); }
}
