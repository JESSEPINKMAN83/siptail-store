"use client";
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

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

export default function CartContents({ initialCart, isPreview }: { initialCart: unknown; isPreview?: boolean }) {
  const [cart, setCart] = useState<CartData | null>(initialCart as CartData | null);
  const [loading, setLoading] = useState(false);
  const [checkingOut, setCheckingOut] = useState(false);
  const router = useRouter();

  async function removeItem(id: string) {
    setLoading(true);
    try {
      const res = await fetch("/api/cart/remove", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ lineItemId: id }),
      });
      if (res.ok) { const d = await res.json(); setCart(d.cart ?? null); }
    } catch (e) { console.error("[cart] remove failed:", e); }
    finally { setLoading(false); }
  }

  async function updateQty(id: string, qty: number) {
    if (qty < 1) { await removeItem(id); return; }
    setLoading(true);
    try {
      const res = await fetch("/api/cart/update-qty", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ lineItemId: id, quantity: qty }),
      });
      if (res.ok) { const d = await res.json(); setCart(d.cart ?? null); }
    } catch (e) { console.error("[cart] update qty failed:", e); }
    finally { setLoading(false); }
  }

  function handleCheckout() {
    // Fire Meta Pixel InitiateCheckout
    if (typeof window !== "undefined" && window.fbq) {
      const subtotalNum = parseFloat(cart?.subtotal?.amount ?? "0") || 0;
      window.fbq("track", "InitiateCheckout", {
        value: subtotalNum,
        currency: "USD",
        num_items: cart?.lineItems?.reduce((a, i) => a + (i.quantity ?? 0), 0) ?? 0,
      });
    }
    setCheckingOut(true);
    router.push("/checkout");
  }

  if (isPreview) return (
    <div className="text-center py-20">
      <div className="text-5xl mb-6">🛒</div>
      <p className="text-lg text-gray-600 mb-4">Cart preview — Add to Cart is working correctly.</p>
      <p className="text-sm text-gray-400 mb-8">Connect real Wix products to enable live cart and checkout.</p>
      <Link href="/products" className="bg-[#1B4332] text-white px-6 py-3 rounded-full font-semibold hover:bg-[#2d5a3d] transition-colors">Continue Shopping</Link>
    </div>
  );

  const items = cart?.lineItems ?? [];

  if (items.length === 0) return (
    <div className="text-center py-20">
      <div className="text-5xl mb-6">🛒</div>
      <p className="text-lg text-gray-600 mb-8">Your cart is empty.</p>
      <Link href="/products" className="bg-[#1B4332] text-white px-6 py-3 rounded-full font-semibold hover:bg-[#2d5a3d] transition-colors">Shop Now</Link>
    </div>
  );

  return (
    <div>
      <div className="space-y-3 mb-8">
        {items.map(item => {
          const id = item._id ?? "u";
          return (
            <div key={id} className="flex gap-4 bg-white border border-gray-100 rounded-xl p-4">
              <div className="w-20 h-20 bg-[#F4F4F4] rounded-lg flex items-center justify-center flex-shrink-0">
                {item.image
                  ? <img src={item.image} alt={item.productName?.original ?? ""} className="w-full h-full object-cover rounded-lg" />
                  : <span className="text-3xl">🐾</span>}
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-gray-900 text-sm mb-1 truncate">{item.productName?.original}</h3>
                <p className="text-[#1B4332] font-semibold text-sm mb-2">{item.price?.formattedAmount}</p>
                <div className="flex items-center gap-2">
                  <button onClick={() => updateQty(id, (item.quantity ?? 1) - 1)} disabled={loading}
                    className="w-8 h-8 rounded-full border border-gray-200 flex items-center justify-center text-gray-600 hover:border-gray-400 active:bg-gray-50 disabled:opacity-50 touch-manipulation">−</button>
                  <span className="text-sm font-medium w-5 text-center">{item.quantity}</span>
                  <button onClick={() => updateQty(id, (item.quantity ?? 1) + 1)} disabled={loading}
                    className="w-8 h-8 rounded-full border border-gray-200 flex items-center justify-center text-gray-600 hover:border-gray-400 active:bg-gray-50 disabled:opacity-50 touch-manipulation">+</button>
                  <button onClick={() => removeItem(id)} disabled={loading}
                    className="text-xs text-red-400 hover:text-red-600 transition-colors ml-1 touch-manipulation py-2 px-1">Remove</button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="bg-gray-50 rounded-2xl p-6">
        <div className="flex justify-between items-center mb-2">
          <span className="text-gray-600 font-medium">Subtotal</span>
          <span className="text-xl font-bold text-gray-900">{cart?.subtotal?.formattedAmount ?? "—"}</span>
        </div>
        <p className="text-xs text-gray-400 mb-6">Taxes and shipping calculated at checkout.</p>
        <button onClick={handleCheckout} disabled={checkingOut}
          className="w-full bg-[#1B4332] text-white py-4 rounded-full font-bold text-lg hover:bg-[#2d5a3d] active:bg-[#143326] transition-colors disabled:opacity-60 touch-manipulation min-h-[56px]">
          {checkingOut ? "Going to checkout..." : "Proceed to Checkout"}
        </button>
        <Link href="/products" className="block text-center mt-4 text-sm text-gray-400 hover:text-gray-600 transition-colors py-2">Continue Shopping</Link>
      </div>
    </div>
  );
}
