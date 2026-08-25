"use client";
import { useEffect, useState } from "react";
import { serverCreateCheckout } from "@/app/actions/checkout-actions";
import Link from "next/link";
import type { Locale } from "@/lib/translations";

export default function CheckoutClient({ locale = "en" }: { locale?: Locale }) {
  const isHe = locale === "he";
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    async function run() {
      try {
        const result = await serverCreateCheckout();
        if (cancelled) return;
        if (result.ok) {
          window.location.href = result.redirectUrl;
        } else {
          console.error("[CheckoutClient] server error:", result.error);
          setErrorMsg(result.error);
        }
      } catch (e) {
        if (!cancelled) {
          console.error("[CheckoutClient] unexpected:", e);
          setErrorMsg(String(e));
        }
      }
    }
    run();
    return () => { cancelled = true; };
  }, []);

  if (errorMsg !== null) {
    return (
      <div className="max-w-xl mx-auto px-4 py-32 text-center" dir={isHe ? "rtl" : "ltr"}>
        <div className="text-5xl mb-6">😔</div>
        <h1 className="text-2xl font-bold mb-3" style={{ fontFamily: "Georgia, serif", color: "#1A1A1A" }}>
          {isHe ? "התשלום אינו זמין" : "Checkout unavailable"}
        </h1>
        <p className="text-sm mb-3" style={{ color: "#6B7280" }}>
          {isHe ? "אירעה שגיאה בהפניה לתשלום" : "Something went wrong redirecting to checkout."}
        </p>
        {/* Show technical error in console only — not to user */}
        <p className="text-xs mb-8 px-4 py-2 rounded" style={{ color: "#9CA3AF", background: "#F5F4F0" }}>
          {isHe ? "ניתן לנסות שוב או לחזור לסל הקניות." : "You can try again or go back to your cart."}
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <button
            onClick={() => { setErrorMsg(null); window.location.reload(); }}
            className="px-6 py-3 text-sm font-semibold uppercase tracking-wide text-white touch-manipulation"
            style={{ background: "#1B4332" }}>
            {isHe ? "נסה שוב" : "Try again"}
          </button>
          <Link href="/cart"
            className="px-6 py-3 text-sm font-semibold uppercase tracking-wide border touch-manipulation"
            style={{ color: "#1B4332", borderColor: "#1B4332" }}>
            {isHe ? "חזרה לסל" : "Back to cart"}
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-xl mx-auto px-4 py-32 text-center" dir={isHe ? "rtl" : "ltr"}>
      <div className="text-5xl mb-6" style={{ animation: "pulse 2s infinite" }}>🛒</div>
      <h1 className="text-2xl font-bold mb-3" style={{ fontFamily: "Georgia, serif", color: "#1A1A1A" }}>
        {isHe ? "עובר לתשלום..." : "Heading to checkout..."}
      </h1>
      <p className="text-sm" style={{ color: "#6B7280" }}>
        {isHe ? "מעביר אותך לעמוד התשלום המאובטח." : "Redirecting to secure checkout."}{" "}
        {isHe ? "" : "If nothing happens, "}
        <Link href="/cart" style={{ color: "#1B4332" }}>
          {isHe ? "חזרה לסל" : "go back to your cart"}
        </Link>.
      </p>
    </div>
  );
}
