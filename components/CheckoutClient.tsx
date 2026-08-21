"use client";
import { useEffect } from "react";
import { getWixBrowserClient } from "@/lib/wix-client-browser";

export default function CheckoutClient() {
  useEffect(() => {
    async function redirect() {
      try {
        const c = getWixBrowserClient();
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const result = await (c.currentCart as any).createCheckoutFromCurrentCart({ channelType: "WEB" });
        if (result?.checkoutId) window.location.href = `https://www.wix.com/checkout?checkoutId=${result.checkoutId}`;
      } catch (e) { console.error(e); }
    }
    redirect();
  }, []);
  return (
    <div className="max-w-xl mx-auto px-4 py-32 text-center">
      <div className="text-5xl mb-6">🛒</div>
      <h1 className="text-2xl font-bold text-gray-900 mb-3">Heading to checkout...</h1>
      <p className="text-gray-500 text-sm">Redirecting to Wix checkout. If nothing happens, <a href="/cart" className="text-blue-600 underline">go back to your cart</a>.</p>
    </div>
  );
}
