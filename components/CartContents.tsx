"use client";
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import type { Locale } from "@/lib/translations";
import { t } from "@/lib/translations";

declare global {
  // eslint-disable-next-line no-var
  var fbq: ((...args: unknown[]) => void) | undefined;
}

interface LineItem {
  _id?: string | null; quantity?: number | null;
  productName?: { original?: string | null } | null;
  price?: { formattedAmount?: string | null; amount?: string | null } | null;
  image?: string | null;
}
interface CartData {
  lineItems?: LineItem[] | null;
  subtotal?: { formattedAmount?: string | null; amount?: string | null } | null;
}

export default function CartContents({ initialCart, isPreview, locale = 'en' }: { initialCart: unknown; isPreview?: boolean; locale?: Locale }) {
  const [cart, setCart] = useState<CartData | null>(initialCart as CartData | null);
  const [loading, setLoading] = useState(false);
  const [checkingOut, setCheckingOut] = useState(false);
  const router = useRouter();

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
      const subtotalNum = parseFloat(cart?.subtotal?.amount ?? "0") || 0;
      window.fbq("track", "InitiateCheckout", { value: subtotalNum, currency: "USD", num_items: cart?.lineItems?.reduce((a, i) => a + (i.quantity ?? 0), 0) ?? 0 });
    }
    setCheckingOut(true);
    router.push("/checkout");
  }

  if (isPreview) return (
    <div className="text-center py-20">
      <p className="text-lg mb-4" style={{ color: "#1A1A1A" }}>Cart preview — Add to Cart is working correctly.</p>
      <p className="text-sm mb-8" style={{ color: "#6B7280" }}>Connect real Wix products to enable live cart.</p>
      <Link href="/products" className="inline-block px-6 py-3 text-sm font-semibold uppercase tracking-wide" style={{ background: "#1B4332", color: "#FFFFFF" }}>{t(locale, "continue_shopping")}</Link>
    </div>
  );

  const items = cart?.lineItems ?? [];

  if (items.length === 0) return (
    <div className="text-center py-20">
      <p className="text-lg mb-8" style={{ color: "#1A1A1A" }}>Your cart is empty.</p>
      <Link href="/products" className="inline-block px-6 py-3 text-sm font-semibold uppercase tracking-wide" style={{ background: "#1B4332", color: "#FFFFFF" }}>{t(locale, "shop_now")}</Link>
    </div>
  );

  return (
    <div>
      <div className="space-y-3 mb-8">
        {items.map(item => {
          const id = item._id ?? "u";
          return (
            <div key={id} className="flex gap-4 p-4 border" style={{ background: "#FFFFFF", borderColor: "#D4E6D4" }}>
              <div className="w-20 h-20 flex items-center justify-center flex-shrink-0" style={{ background: "#F5F4F0" }}>
                {item.image ? <img src={item.image} alt={item.productName?.original ?? ""} className="w-full h-full object-cover" /> : <span className="text-xs uppercase tracking-wide" style={{ color: "#6B7280" }}>Trail Bottle</span>}
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-sm mb-1 truncate" style={{ fontFamily: "Georgia, serif", color: "#1A1A1A" }}>{item.productName?.original}</h3>
                <p className="font-bold text-sm mb-2" style={{ color: "#1B4332" }}>{item.price?.formattedAmount}</p>
                <div className="flex items-center gap-2">
                  <button onClick={() => updateQty(id, (item.quantity ?? 1) - 1)} disabled={loading}
                    className="w-8 h-8 border flex items-center justify-center text-sm font-medium hover:bg-gray-50 disabled:opacity-50 touch-manipulation"
                    style={{ borderColor: "#D4E6D4", color: "#1A1A1A" }}>−</button>
                  <span className="text-sm font-medium w-5 text-center" style={{ color: "#1A1A1A" }}>{item.quantity}</span>
                  <button onClick={() => updateQty(id, (item.quantity ?? 1) + 1)} disabled={loading}
                    className="w-8 h-8 border flex items-center justify-center text-sm font-medium hover:bg-gray-50 disabled:opacity-50 touch-manipulation"
                    style={{ borderColor: "#D4E6D4", color: "#1A1A1A" }}>+</button>
                  <button onClick={() => removeItem(id)} disabled={loading}
                    className="text-xs ml-1 hover:opacity-70 transition-opacity touch-manipulation py-2 px-1"
                    style={{ color: "#6B7280" }}>Remove</button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
      <div className="p-6 border" style={{ background: "#FFFFFF", borderColor: "#D4E6D4" }}>
        <div className="flex justify-between items-center mb-2">
          <span className="font-medium text-sm" style={{ color: "#1A1A1A" }}>Subtotal</span>
          <span className="text-xl font-bold" style={{ fontFamily: "Georgia, serif", color: "#1A1A1A" }}>{cart?.subtotal?.formattedAmount ?? "—"}</span>
        </div>
        <p className="text-xs mb-6" style={{ color: "#6B7280" }}>Taxes and shipping calculated at checkout.</p>
        <button onClick={handleCheckout} disabled={checkingOut}
          className="w-full py-4 text-sm font-semibold uppercase tracking-wide transition-colors touch-manipulation min-h-[52px]"
          style={{ background: checkingOut ? "#D4E6D4" : "#1B4332", color: checkingOut ? "#1A1A1A" : "#FFFFFF", cursor: checkingOut ? "not-allowed" : "pointer" }}>
          {checkingOut ? t(locale, "going_to_checkout") : t(locale, "checkout")}
        </button>
        <Link href="/products" className="block text-center mt-4 text-xs uppercase tracking-wide hover:opacity-70 transition-opacity py-2" style={{ color: "#6B7280" }}>{t(locale, "continue_shopping")}</Link>
      </div>
    </div>
  );
}
