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
    const match = document.cookie.match(/wix_session=([^;]+)/);
    if (match) {
      try {
        const parsed = JSON.parse(decodeURIComponent(match[1]));
        if (parsed?.accessToken && parsed?.refreshToken) tokens = parsed as Tokens;
      } catch {}
    }
  }
  _client = createClient({
    modules: { products, currentCart },
    auth: OAuthStrategy({ clientId: WIX_CLIENT_ID, tokens }),
  });
  return _client;
}

export function resetWixBrowserClient() { _client = null; }
