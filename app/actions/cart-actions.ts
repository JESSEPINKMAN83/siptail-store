"use server";

import { createClient, OAuthStrategy, Tokens } from "@wix/sdk";
import { currentCart } from "@wix/ecom";
import { products } from "@wix/stores";
import { cookies } from "next/headers";

const WIX_CLIENT_ID = process.env.NEXT_PUBLIC_WIX_CLIENT_ID || "placeholder-client-id";
const VISITOR_COOKIE = "wix_visitor";
const SESSION_COOKIE = "wix_session";

function getWixServerClient(existingTokens?: Tokens) {
  return createClient({
    modules: { products, currentCart },
    auth: OAuthStrategy({ clientId: WIX_CLIENT_ID, tokens: existingTokens }),
  });
}

async function getOrCreateTokens(): Promise<Tokens | undefined> {
  const cookieStore = await cookies();

  // First try the member session (logged-in user)
  const sessionRaw = cookieStore.get(SESSION_COOKIE)?.value;
  if (sessionRaw) {
    try {
      const parsed = JSON.parse(sessionRaw);
      if (parsed?.accessToken && parsed?.refreshToken) return parsed as Tokens;
    } catch {}
  }

  // Then try the visitor token (anonymous cart)
  const visitorRaw = cookieStore.get(VISITOR_COOKIE)?.value;
  if (visitorRaw) {
    try {
      const parsed = JSON.parse(visitorRaw);
      if (parsed?.accessToken && parsed?.refreshToken) return parsed as Tokens;
    } catch {}
  }

  return undefined;
}

async function persistTokens(client: ReturnType<typeof getWixServerClient>) {
  try {
    const cookieStore = await cookies();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const tokens = await (client.auth as any).getTokens?.();
    if (tokens?.accessToken && tokens?.refreshToken) {
      cookieStore.set(VISITOR_COOKIE, JSON.stringify(tokens), {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: 60 * 60 * 24 * 30, // 30 days
        path: "/",
      });
    }
  } catch {
    // Non-fatal — cart still worked, just won't persist across sessions
  }
}

export async function serverAddToCart(
  productId: string,
  variantId: string | null,
  quantity: number
): Promise<{ ok: boolean; itemCount: number; error?: string }> {
  try {
    const tokens = await getOrCreateTokens();
    const client = getWixServerClient(tokens);

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

    // Persist the visitor tokens so the cart survives navigation
    await persistTokens(client);

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const cart = (response as any).cart ?? response;
    const itemCount: number =
      cart?.lineItems?.reduce(
        (acc: number, item: { quantity?: number }) => acc + (item.quantity ?? 0),
        0
      ) ?? 0;

    return { ok: true, itemCount };
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : "Add to cart failed";
    console.error("[serverAddToCart]", msg);
    return { ok: false, itemCount: 0, error: msg };
  }
}

export async function serverGetCart(): Promise<{
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  cart: any | null;
  itemCount: number;
}> {
  try {
    const tokens = await getOrCreateTokens();
    if (!tokens) return { cart: null, itemCount: 0 };

    const client = getWixServerClient(tokens);
    const cart = await client.currentCart.getCurrentCart();
    const itemCount: number =
      cart?.lineItems?.reduce(
        (acc: number, item: { quantity?: number }) => acc + (item.quantity ?? 0),
        0
      ) ?? 0;

    return { cart, itemCount };
  } catch {
    return { cart: null, itemCount: 0 };
  }
}
