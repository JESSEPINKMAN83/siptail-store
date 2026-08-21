"use client";
import { useEffect, useState } from "react";
import { getWixBrowserClient } from "@/lib/wix-client-browser";
import Link from "next/link";

export default function CheckoutClient() {
  const [error, setError] = useState(false);

  useEffect(() => {
    async function redirect() {
      try {
        const c = getWixBrowserClient();
        // Use the eCommerce checkout API via currentCart
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const result = await (c.currentCart as any).createCheckoutFromCurrentCart({
          channelType: "WEB",
        });
        const checkoutId = result?.checkoutId;
        if (!checkoutId) { setError(true); return; }

        // Get the checkout URL — Wix returns it directly or we build it
        const checkoutUrl = result?.checkoutUrl
          ?? `https://www.wix.com/checkout?checkoutId=${checkoutId}&successUrl=${encodeURIComponent(window.location.origin + "/thank-you")}&cancelUrl=${encodeURIComponent(window.location.origin + "/cart")}`;
        window.location.href = checkoutUrl;
      } catch (e) {
        console.error("Checkout redirect failed:", e);
        setError(true);
      }
    }
    redirect();
  }, []);

  if (error) {
    return (
      <div className="max-w-xl mx-auto px-4 py-32 text-center">
        <div className="text-5xl mb-6">😔</div>
        <h1 className="text-2xl font-bold text-gray-900 mb-3">Checkout unavailable</h1>
        <p className="text-gray-500 text-sm mb-8">
          Something went wrong redirecting to checkout.
        </p>
        <Link href="/cart" className="bg-blue-600 text-white px-6 py-3 rounded-full font-semibold hover:bg-blue-700 transition-colors">
          Back to cart
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-xl mx-auto px-4 py-32 text-center">
      <div className="text-5xl mb-6 animate-pulse">🛒</div>
      <h1 className="text-2xl font-bold text-gray-900 mb-3">Heading to checkout...</h1>
      <p className="text-gray-500 text-sm">
        Redirecting to secure checkout. If nothing happens,{" "}
        <Link href="/cart" className="text-blue-600 underline">go back to your cart</Link>.
      </p>
    </div>
  );
}
