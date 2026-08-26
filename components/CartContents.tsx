"use client";
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import type { Locale } from "@/lib/translations";
import { t } from "@/lib/translations";
import { ilsFromUsd } from "@/lib/config";

declare global { var fbq: ((...args: unknown[]) => void) | undefined; }

// Wix cart API returns image as a wix:image:// URI — transform to HTTPS for <img>.
// Format: wix:image://v1/<fileId>/<filename>#originWidth=W&originHeight=H
// Public Wix CDN URL: https://static.wixstatic.com/media/<fileId>
function wixImageToUrl(raw: string | null | undefined): string | null {
  if (!raw) return null;
  if (raw.startsWith("http")) return raw; // already a plain URL
  const match = raw.match(/wix:image:\/\/v1\/([^/]+)\//);
  if (match) return `https://static.wixstatic.com/media/${match[1]}`;
  return null;
}

interface LineItem {
  _id?: string | null;
  quantity?: number | null;
  productName?: { original?: string | null } | null;
  // price.amount is a numeric string e.g. "35.00"; price.formattedAmount is "£35.00"
  price?: { formattedAmount?: string | null; amount?: string | null } | null;
  // image is a wix:image:// URI string
  image?: string | null;
}

interface CartData {
  lineItems?: LineItem[] | null;
  // getCurrentCart() does NOT return priceSummary — totals must be computed
  // from lineItems[].price.amount * quantity
  priceSummary?: { subtotal?: { formattedAmount?: string | null; amount?: string | null } | null } | null;
  currency?: string | null;
}

function computeSubtotal(items: LineItem[], isHe: boolean): string {
  const total = items.reduce((sum, item) => {
    const amt = parseFloat(item.price?.amount ?? "0") || 0;
    const qty = item.quantity ?? 1;
    return sum + amt * qty;
  }, 0);
  if (total === 0) return "—";
  if (isHe) {
    // Convert USD→ILS using the same helper used site-wide
    const ils = ilsFromUsd(`$${total.toFixed(2)}`);
    return ils;
  }
  return `$${total.toFixed(2)}`;
}

export default function CartContents({
  initialCart, isPreview, locale = "en" as Locale,
}: {
  initialCart: unknown; isPreview?: boolean; locale?: Locale;
}) {
  const [cart, setCart] = useState<CartData | null>(initialCart as CartData | null);
  const [loading, setLoading] = useState(false);
  const [checkingOut, setCheckingOut] = useState(false);
  const router = useRouter();
  const isHe = locale === "he";

  async function removeItem(id: string) {
    setLoading(true);
    try {
      const res = await fetch("/api/cart/remove", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ lineItemId: id }) });
      if (res.ok) { const d = await res.json(); setCart(d.cart ?? null); }
    } catch (e) { console.error(e); } finally { setLoading(false); }
  }

  async function updateQty(id: string, qty: number) {
    if (qty < 1) { await removeItem(id); return; }
    setLoading(true);
    try {
      const res = await fetch("/api/cart/update-qty", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ lineItemId: id, quantity: qty }) });
      if (res.ok) { const d = await res.json(); setCart(d.cart ?? null); }
    } catch (e) { console.error(e); } finally { setLoading(false); }
  }

  function handleCheckout() {
    if (typeof window !== "undefined" && window.fbq) {
      const items = cart?.lineItems ?? [];
      const sub = items.reduce((s, i) => s + (parseFloat(i.price?.amount ?? "0") || 0) * (i.quantity ?? 1), 0);
      window.fbq("track", "InitiateCheckout", {
        value: sub,
        currency: isHe ? "ILS" : "USD",
        num_items: items.reduce((a, i) => a + (i.quantity ?? 0), 0),
      });
    }
    setCheckingOut(true);
    router.push("/checkout");
  }

  const items = cart?.lineItems ?? [];

  if (items.length === 0) return (
    <div className="text-center py-20">
      <div className="text-5xl mb-6">🛒</div>
      <p className="text-lg mb-8" style={{ color: "#1A1A1A" }}>{t(locale, "cart_empty")}</p>
      <Link href="/products" className="inline-block px-6 py-3 text-sm font-semibold uppercase tracking-wide" style={{ background: "#1B4332", color: "#FFFFFF" }}>{t(locale, "shop_now")}</Link>
    </div>
  );

  const subtotalDisplay = computeSubtotal(items, isHe);

  return (
    <div dir={isHe ? "rtl" : "ltr"}>
      <div className="space-y-3 mb-8">
        {items.map(item => {
          const id = item._id ?? "u";
          const imgUrl = wixImageToUrl(item.image);
          // Per-item price display: use formattedAmount when currency matches,
          // otherwise convert to ILS for Hebrew mode
          const rawAmt = parseFloat(item.price?.amount ?? "0") || 0;
          const itemPriceDisplay = isHe
            ? ilsFromUsd(`$${rawAmt.toFixed(2)}`)
            : (item.price?.formattedAmount ?? `$${rawAmt.toFixed(2)}`);

          return (
            <div key={id} className="flex gap-4 p-4 border" style={{ background: "#FFFFFF", borderColor: "#D4E6D4" }}>
              {/* Thumbnail — wix:image:// URI converted to HTTPS */}
              <div className="w-20 h-20 flex items-center justify-center flex-shrink-0 overflow-hidden" style={{ background: "#F5F4F0" }}>
                {imgUrl
                  ? <img src={imgUrl} alt={item.productName?.original ?? ""} className="w-full h-full object-cover" />
                  : <span className="text-xs uppercase tracking-wide text-center px-1" style={{ color: "#6B7280" }}>
                      {item.productName?.original ?? "Product"}
                    </span>}
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-sm mb-1 truncate" style={{ fontFamily: isHe ? "Noto Serif Hebrew, Georgia, serif" : "Georgia, serif", color: "#1A1A1A" }}>
                  {item.productName?.original}
                </h3>
                <p className="font-bold text-sm mb-2" style={{ color: "#1B4332" }}>{itemPriceDisplay}</p>
                <div className="flex items-center gap-2">
                  <button onClick={() => updateQty(id, (item.quantity ?? 1) - 1)} disabled={loading}
                    className="w-8 h-8 border flex items-center justify-center text-sm font-medium hover:bg-gray-50 disabled:opacity-50 touch-manipulation"
                    style={{ borderColor: "#D4E6D4", color: "#1A1A1A" }}>−</button>
                  <span className="text-sm font-medium w-5 text-center" style={{ color: "#1A1A1A" }}>{item.quantity}</span>
                  <button onClick={() => updateQty(id, (item.quantity ?? 1) + 1)} disabled={loading}
                    className="w-8 h-8 border flex items-center justify-center text-sm font-medium hover:bg-gray-50 disabled:opacity-50 touch-manipulation"
                    style={{ borderColor: "#D4E6D4", color: "#1A1A1A" }}>+</button>
                  <button onClick={() => removeItem(id)} disabled={loading}
                    className="text-xs hover:opacity-70 transition-opacity touch-manipulation py-2 px-1"
                    style={{ color: "#6B7280", marginInlineStart: "0.25rem" }}>
                    {t(locale, "remove")}
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="p-6 border" style={{ background: "#FFFFFF", borderColor: "#D4E6D4" }}>
        <div className="flex justify-between items-center mb-2">
          <span className="font-medium text-sm" style={{ color: "#1A1A1A" }}>{t(locale, "subtotal")}</span>
          <span className="text-xl font-bold" style={{ fontFamily: "Georgia, serif", color: "#1A1A1A" }}>
            {subtotalDisplay}
          </span>
        </div>
        <p className="text-xs mb-6" style={{ color: "#6B7280" }}>{t(locale, "taxes_note")}</p>
        <button onClick={handleCheckout} disabled={checkingOut}
          className="w-full py-4 text-sm font-semibold uppercase tracking-wide transition-colors touch-manipulation min-h-[52px]"
          style={{ background: checkingOut ? "#D4E6D4" : "#1B4332", color: checkingOut ? "#1A1A1A" : "#FFFFFF", cursor: checkingOut ? "not-allowed" : "pointer" }}>
          {checkingOut ? t(locale, "going_to_checkout") : t(locale, "checkout")}
        </button>
        <Link href="/products" className="block text-center mt-4 text-xs uppercase tracking-wide hover:opacity-70 transition-opacity py-2" style={{ color: "#6B7280" }}>
          {t(locale, "continue_shopping")}
        </Link>
      </div>
    </div>
  );
}
