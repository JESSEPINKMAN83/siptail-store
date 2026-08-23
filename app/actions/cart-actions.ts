"use server";

import { createClient, OAuthStrategy, Tokens } from "@wix/sdk";
import { currentCart } from "@wix/ecom";
import { products } from "@wix/stores";
import { cookies } from "next/headers";

const WIX_CLIENT_ID = process.env.NEXT_PUBLIC_WIX_CLIENT_ID || "placeholder-client-id";
const VISITOR_COOKIE = "wix_visitor";
const SESSION_COOKIE = "wix_session";

// Read stored tokens from cookies — returns undefined if none are valid
async function readStoredTokens(): Promise<Tokens | undefined> {
  const cookieStore = await cookies();
  for (const name of [SESSION_COOKIE, VISITOR_COOKIE]) {
    const raw = cookieStore.get(name)?.value;
    if (!raw) continue;
    try {
      const parsed = JSON.parse(raw);
      // Only accept tokens with real (non-empty) values
      if (parsed?.accessToken?.value && parsed?.refreshToken?.value) {
        return parsed as Tokens;
      }
    } catch {}
  }
  return undefined;
}

// Write visitor tokens back to the cookie jar
async function saveVisitorTokens(tokens: Tokens) {
  const cookieStore = await cookies();
  if (!tokens?.accessToken?.value || !tokens?.refreshToken?.value) return;
  cookieStore.set(VISITOR_COOKIE, JSON.stringify(tokens), {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 60 * 60 * 24 * 30, // 30 days
    path: "/",
  });
}

// Build a Wix client. If we have stored tokens, use them.
// If not, generate fresh visitor tokens so the same identity
// is used for both the addToCart call AND the /cart page.
async function getCartClient(): Promise<{ client: ReturnType<typeof createClient>; freshTokens: boolean }> {
  const stored = await readStoredTokens();

  const client = createClient({
    modules: { products, currentCart },
    auth: OAuthStrategy({ clientId: WIX_CLIENT_ID, tokens: stored }),
  });

  if (stored) {
    return { client, freshTokens: false };
  }

  // No stored tokens → generate visitor tokens NOW so the cart page
  // can look up the same cart by reading the same cookie
  try {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const visitorTokens = await (client.auth as any).generateVisitorTokens();
    await saveVisitorTokens(visitorTokens);
    // Recreate client with the real tokens
    const clientWithTokens = createClient({
      modules: { products, currentCart },
      auth: OAuthStrategy({ clientId: WIX_CLIENT_ID, tokens: visitorTokens }),
    });
    return { client: clientWithTokens, freshTokens: true };
  } catch (e) {
    console.error("[cartClient] generateVisitorTokens failed:", e);
    return { client, freshTokens: false };
  }
}

export async function serverAddToCart(
  productId: string,
  variantId: string | null,
  quantity: number
): Promise<{ ok: boolean; itemCount: number; error?: string }> {
  try {
    const { client } = await getCartClient();

    const response = await client.currentCart.addToCurrentCart({
      lineItems: [
        {
          catalogReference: {
            appId: "1380b703-ce81-ff05-f115-39571d94dfcd",
            catalogItemId: productId,
            options: variantId ? { variantId } : {},
          },
          quantity,
        },
      ],
    });

    // After the API call, the client's in-memory tokens are populated.
    // Save them — this is what makes /cart find the same cart.
    try {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const liveTokens = (client.auth as any).getTokens();
      await saveVisitorTokens(liveTokens);
    } catch (e) {
      console.error("[serverAddToCart] saveVisitorTokens after call:", e);
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const cart = (response as any).cart ?? response;
    const itemCount: number =
      cart?.lineItems?.reduce(
        (acc: number, item: { quantity?: number }) => acc + (item.quantity ?? 0),
        0
      ) ?? 0;

    console.log("[serverAddToCart] success, itemCount:", itemCount);
    return { ok: true, itemCount };
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : "Add to cart failed";
    console.error("[serverAddToCart] error:", msg);
    return { ok: false, itemCount: 0, error: msg };
  }
}
