"use client";
import { createClient, OAuthStrategy, Tokens } from "@wix/sdk";
import { products } from "@wix/stores";
import { currentCart } from "@wix/ecom";

const WIX_CLIENT_ID = process.env.NEXT_PUBLIC_WIX_CLIENT_ID || "placeholder-client-id";
let _client: ReturnType<typeof createClient> | null = null;

export function getWixBrowserClient() {
  if (_client) return _client;
  let tokens: Tokens | undefined;
  if (typeof document !== "undefined") {
    // Check both wix_session (logged-in member) and wix_visitor (anonymous cart).
    // wix_visitor is httpOnly so it never appears in document.cookie — the cart
    // icon count will fall back to 0 for anonymous visitors (acceptable), but
    // logged-in members will still see their count via wix_session.
    // The authoritative cart state comes from the server-rendered /cart page.
    for (const name of ["wix_session"]) {
      const match = document.cookie.match(new RegExp(`${name}=([^;]+)`));
      if (match) {
        try {
          const parsed = JSON.parse(decodeURIComponent(match[1]));
          if (parsed?.accessToken?.value && parsed?.refreshToken?.value) {
            tokens = parsed as Tokens;
            break;
          }
        } catch {}
      }
    }
  }
  _client = createClient({
    modules: { products, currentCart },
    auth: OAuthStrategy({ clientId: WIX_CLIENT_ID, tokens }),
  });
  return _client;
}

export function resetWixBrowserClient() { _client = null; }
