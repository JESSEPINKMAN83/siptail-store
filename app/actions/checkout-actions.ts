"use server";

import { createClient, OAuthStrategy, Tokens } from "@wix/sdk";
import { currentCart } from "@wix/ecom";
import { products } from "@wix/stores";
import { redirects } from "@wix/redirects";
import { cookies } from "next/headers";

const WIX_CLIENT_ID = process.env.NEXT_PUBLIC_WIX_CLIENT_ID || "placeholder-client-id";
const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://siptail-store.vercel.app";

async function readCartTokens(): Promise<Tokens | undefined> {
  const cookieStore = await cookies();
  for (const name of ["wix_session", "wix_visitor"]) {
    const raw = cookieStore.get(name)?.value;
    if (!raw) continue;
    try {
      const parsed = JSON.parse(raw);
      if (parsed?.accessToken?.value && parsed?.refreshToken?.value) {
        return parsed as Tokens;
      }
    } catch {}
  }
  return undefined;
}

export async function serverCreateCheckout(): Promise<
  { ok: true; redirectUrl: string } | { ok: false; error: string }
> {
  try {
    const tokens = await readCartTokens();
    if (!tokens) {
      return { ok: false, error: "No cart session found. Please add items to your cart first." };
    }

    const client = createClient({
      modules: { currentCart, products, redirects },
      auth: OAuthStrategy({ clientId: WIX_CLIENT_ID, tokens }),
    });

    // Step 1: Create checkout from current cart
    console.log("[checkout] calling createCheckoutFromCurrentCart...");
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const checkoutResult = await (client.currentCart as any).createCheckoutFromCurrentCart({
      channelType: "WEB",
    });
    console.log("[checkout] checkoutResult keys:", Object.keys(checkoutResult ?? {}));

    const checkoutId = checkoutResult?.checkoutId ?? checkoutResult?.checkout?._id ?? checkoutResult?._id;
    if (!checkoutId) {
      console.error("[checkout] no checkoutId in result:", JSON.stringify(checkoutResult).slice(0, 200));
      return { ok: false, error: "Checkout creation failed — no checkout ID returned." };
    }
    console.log("[checkout] checkoutId:", checkoutId);

    // Step 2: Create redirect session to get hosted checkout URL
    console.log("[checkout] calling createRedirectSession...");
    const redirectResult = await client.redirects.createRedirectSession({
      ecomCheckout: { checkoutId },
      callbacks: {
        thankYouPageUrl: `${BASE_URL}/thank-you`,
        cartPageUrl: `${BASE_URL}/cart`,
        postFlowUrl: BASE_URL,
      },
    });
    console.log("[checkout] redirectResult keys:", Object.keys(redirectResult ?? {}));

    const redirectUrl = redirectResult?.redirectSession?.fullUrl;
    if (!redirectUrl) {
      console.error("[checkout] no fullUrl in redirectResult:", JSON.stringify(redirectResult).slice(0, 300));
      return { ok: false, error: "Could not get checkout URL from Wix." };
    }

    console.log("[checkout] redirectUrl:", redirectUrl.slice(0, 80) + "...");
    return { ok: true, redirectUrl };
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : String(e);
    console.error("[checkout] error:", msg);
    return { ok: false, error: msg };
  }
}
