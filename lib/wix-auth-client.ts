import { createClient, OAuthStrategy, Tokens } from "@wix/sdk";
import { members } from "@wix/members";
import { products } from "@wix/stores";
import { currentCart } from "@wix/ecom";

const CLIENT_ID = process.env.NEXT_PUBLIC_WIX_CLIENT_ID || "placeholder-client-id";
export const SESSION_COOKIE = "wix_session";

export function createWixAuthClient(tokens?: Tokens) {
  return createClient({
    modules: { members, products, currentCart },
    auth: OAuthStrategy({ clientId: CLIENT_ID, tokens }),
  });
}

// Server-side: read tokens from cookie header string
export function parseSessionFromCookie(cookieHeader: string | null): Tokens | undefined {
  if (!cookieHeader) return undefined;
  const match = cookieHeader.match(/wix_session=([^;]+)/);
  if (!match) return undefined;
  try {
    const parsed = JSON.parse(decodeURIComponent(match[1]));
    if (parsed?.accessToken && parsed?.refreshToken) return parsed as Tokens;
  } catch {}
  return undefined;
}
