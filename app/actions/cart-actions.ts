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
    maxAge: 60 * 60 * 24 * 7, // 7 days
    path: "/",
  });
}

// Build a Wix client with valid tokens.
// If stored tokens exist, reuse them so the cart page sees the same identity.
// If not, generate fresh visitor tokens first and persist them — this is what
// ties the add-to-cart call to the same session the /cart page will read.
async function getCartClient(): Promise<ReturnType<typeof createClient>> {
  const stored = await readStoredTokens();

  if (stored) {
    return createClient({
      modules: { products, currentCart },
      auth: OAuthStrategy({ clientId: WIX_CLIENT_ID, tokens: stored }),
    });
  }

  // No stored tokens — generate visitor tokens before calling addToCurrentCart.
  // These tokens are saved to the wix_visitor cookie here, in the server action
  // response, so the browser sends them on the very next request to /cart.
  const bootstrapClient = createClient({
    modules: { products, currentCart },
    auth: OAuthStrategy({ clientId: WIX_CLIENT_ID }),
  });

  try {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const visitorTokens = await (bootstrapClient.auth as any).generateVisitorTokens();
    await saveVisitorTokens(visitorTokens);
    return createClient({
      modules: { products, currentCart },
      auth: OAuthStrategy({ clientId: WIX_CLIENT_ID, tokens: visitorTokens }),
    });
  } catch (e) {
    console.error("[cartClient] generateVisitorTokens failed:", e);
    // Fall back to the token-less client; addToCurrentCart will still work
    // but the resulting cart may not persist across the navigation.
    return bootstrapClient;
  }
}

export async function serverAddToCart(
  productId: string,
  variantId: string | null,
  quantity: number
): Promise<{ ok: boolean; itemCount: number; error?: string }> {
  try {
    const client = await getCartClient();

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

    // After a successful addToCurrentCart, persist the current tokens so the
    // SDK's internal token refresh (if it happened during the call) is captured.
    // This ensures /cart always reads fresh, valid credentials.
    try {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const liveTokens = (client.auth as any).getTokens() as Tokens;
      await saveVisitorTokens(liveTokens);
    } catch (e) {
      // Non-fatal: tokens were already saved before the API call in getCartClient().
      console.error("[serverAddToCart] post-call saveVisitorTokens:", e);
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
