import { NextRequest, NextResponse } from "next/server";
import { createClient, OAuthStrategy, Tokens } from "@wix/sdk";
import { currentCart } from "@wix/ecom";
import { products } from "@wix/stores";
import { cookies } from "next/headers";

const WIX_CLIENT_ID = process.env.NEXT_PUBLIC_WIX_CLIENT_ID || "placeholder-client-id";

export async function POST(req: NextRequest) {
  try {
    const { lineItemId } = await req.json();
    const cookieStore = await cookies();
    let tokens: Tokens | undefined;
    for (const name of ["wix_session", "wix_visitor"]) {
      const raw = cookieStore.get(name)?.value;
      if (raw) { try { const p = JSON.parse(raw); if (p?.accessToken) { tokens = p; break; } } catch {} }
    }
    if (!tokens) return NextResponse.json({ cart: null });
    const client = createClient({ modules: { products, currentCart }, auth: OAuthStrategy({ clientId: WIX_CLIENT_ID, tokens }) });
    const result = await client.currentCart.removeLineItemsFromCurrentCart([lineItemId]);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return NextResponse.json({ cart: (result as any).cart ?? null });
  } catch (e) { console.error("[api/cart/remove]", e); return NextResponse.json({ cart: null }); }
}
