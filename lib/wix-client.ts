import { createClient, OAuthStrategy } from "@wix/sdk";
import { products } from "@wix/stores";
import { currentCart } from "@wix/ecom";
import { cookies } from "next/headers";

const WIX_CLIENT_ID = process.env.NEXT_PUBLIC_WIX_CLIENT_ID || "1d47ce62-8390-4782-86d3-c706cde04ec3";
// The TeqPet headless site ID — must match the site where the 23 products live.
// Set NEXT_PUBLIC_WIX_SITE_ID in Vercel env vars if this ever changes.
export const WIX_SITE_ID = process.env.NEXT_PUBLIC_WIX_SITE_ID || "c9466f44-badc-4481-af3e-2b00fa6472c8";
const WIX_SESSION_COOKIE = "wix_session";

export async function getWixServerClient() {
  const cookieStore = await cookies();
  const sessionToken = cookieStore.get(WIX_SESSION_COOKIE)?.value;
  return createClient({
    modules: { products, currentCart },
    auth: OAuthStrategy({
      clientId: WIX_CLIENT_ID,
      tokens: sessionToken ? JSON.parse(sessionToken) : undefined,
    }),
  });
}

/**
 * Fetch a visitor access token from the Wix OAuth endpoint.
 * Used for direct REST calls that need an Authorization header.
 */
export async function getWixVisitorToken(): Promise<string | null> {
  try {
    const res = await fetch("https://www.wixapis.com/oauth2/token", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ clientId: WIX_CLIENT_ID, grantType: "anonymous" }),
      next: { revalidate: 0 },
    });
    const data = await res.json().catch(() => ({}));
    return data?.access_token ?? null;
  } catch {
    return null;
  }
}

export type WixRestProductSummary = {
  id: string;
  name: string;
  slug: string;
  visible: boolean;
  mainImageUrl: string | null;
  priceFormatted: string | null;
};

/**
 * Query all products from the correct TeqPet site using the Stores v3 REST API.
 * The Wix SDK queryProducts() is bound to whichever Wix site the OAuth app was
 * originally created for — which may not be the TeqPet site. This direct REST
 * call uses the explicit wix-site-id header to always reach the right site.
 */
export async function fetchWixProductsRest(): Promise<WixRestProductSummary[]> {
  try {
    const token = await getWixVisitorToken();
    if (!token) return [];

    const res = await fetch("https://www.wixapis.com/stores/v3/products/query", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: token,
        "wix-site-id": WIX_SITE_ID,
      },
      body: JSON.stringify({ query: { cursorPaging: { limit: 100 } } }),
      next: { revalidate: 0 },
    });

    if (!res.ok) return [];

    const data = await res.json().catch(() => ({}));
    const items: any[] = data?.products ?? [];

    return items.map((p) => ({
      id: p.id ?? "",
      name: p.name ?? "",
      slug: p.slug ?? "",
      visible: p.visible !== false,
      mainImageUrl: p.media?.main?.url ?? null,
      priceFormatted: p.priceData?.price != null
        ? `\u20aa${Math.round(p.priceData.price)}`
        : null,
    }));
  } catch {
    return [];
  }
}

export { WIX_SESSION_COOKIE };
