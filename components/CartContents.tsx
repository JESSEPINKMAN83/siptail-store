"use client";
import { useState } from "react";
import { getWixBrowserClient } from "@/lib/wix-client-browser";
import Link from "next/link";
import { useRouter } from "next/navigation";

interface LineItem {
  _id?: string | null;
  quantity?: number | null;
  productName?: { original?: string | null } | null;
  price?: { formattedAmount?: string | null } | null;
  image?: string | null;
}
interface CartData {
  lineItems?: LineItem[] | null;
  subtotal?: { formattedAmount?: string | null } | null;
}

export default function CartContents({
  initialCart,
  isPreview,
}: {
  initialCart: unknown;
  isPreview?: boolean;
}) {
  const [cart, setCart] = useState<CartData | null>(initialCart as CartData | null);
  const [loading, setLoading] = useState(false);
  const [checkingOut, setCheckingOut] = useState(false);
  const router = useRouter();

  async function removeItem(id: string) {
    setLoading(true);
    try {
      const c = getWixBrowserClient();
      const u = await c.currentCart.removeLineItemsFromCurrentCart([id]);
      setCart((u as { cart?: CartData }).cart ?? null);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }

  async function updateQty(id: string, qty: number) {
    if (qty < 1) { await removeItem(id); return; }
    setLoading(true);
    try {
      const c = getWixBrowserClient();
      const u = await c.currentCart.updateCurrentCartLineItemQuantity([{ _id: id, quantity: qty }]);
      setCart((u as { cart?: CartData }).cart ?? null);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }

  async function handleCheckout() {
    setCheckingOut(true);
    try {
      // Navigate to /checkout which handles the Wix redirect
      router.push("/checkout");
    } catch (e) {
      console.error(e);
      setCheckingOut(false);
    }
  }

  if (isPreview) {
    return (
      <div className="text-center py-20">
        <div className="text-5xl mb-6">🛒</div>
        <p className="text-lg text-gray-600 mb-4">Cart is previewing correctly.</p>
        <p className="text-sm text-gray-400 mb-8">Add a product to test the full flow.</p>
        <Link href="/products" className="bg-blue-600 text-white px-6 py-3 rounded-full font-semibold hover:bg-blue-700 transition-colors">
          Continue Shopping
        </Link>
      </div>
    );
  }

  const items = cart?.lineItems ?? [];

  if (items.length === 0) {
    return (
      <div className="text-center py-20">
        <div className="text-5xl mb-6">🛒</div>
        <p className="text-lg text-gray-600 mb-8">Your cart is empty.</p>
        <Link href="/products" className="bg-blue-600 text-white px-6 py-3 rounded-full font-semibold hover:bg-blue-700 transition-colors">
          Shop Now
        </Link>
      </div>
    );
  }

  return (
    <div>
      <div className="space-y-3 mb-8">
        {items.map((item) => {
          const id = item._id ?? "u";
          return (
            <div key={id} className="flex gap-4 bg-white border border-gray-100 rounded-xl p-4">
              <div className="w-20 h-20 bg-blue-50 rounded-lg flex items-center justify-center flex-shrink-0">
                {item.image ? (
                  <img
                    src={item.image}
                    alt={item.productName?.original ?? ""}
                    className="w-full h-full object-cover rounded-lg"
                  />
                ) : (
                  <span className="text-3xl">🐾</span>
                )}
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-gray-900 text-sm leading-snug mb-1">
                  {item.productName?.original}
                </h3>
                <p className="text-blue-600 font-semibold text-sm mb-2">
                  {item.price?.formattedAmount}
                </p>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => updateQty(id, (item.quantity ?? 1) - 1)}
                    disabled={loading}
                    className="w-8 h-8 rounded-full border border-gray-200 flex items-center justify-center text-gray-600 hover:border-gray-400 active:bg-gray-50 disabled:opacity-50 text-lg"
                  >
                    −
                  </button>
                  <span className="text-sm font-medium w-5 text-center">{item.quantity}</span>
                  <button
                    onClick={() => updateQty(id, (item.quantity ?? 1) + 1)}
                    disabled={loading}
                    className="w-8 h-8 rounded-full border border-gray-200 flex items-center justify-center text-gray-600 hover:border-gray-400 active:bg-gray-50 disabled:opacity-50 text-lg"
                  >
                    +
                  </button>
                  <button
                    onClick={() => removeItem(id)}
                    disabled={loading}
                    className="text-xs text-red-400 hover:text-red-600 transition-colors ml-1"
                  >
                    Remove
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Order summary */}
      <div className="bg-gray-50 rounded-2xl p-6">
        <div className="flex justify-between items-center mb-2">
          <span className="text-gray-600 font-medium">Subtotal</span>
          <span className="text-xl font-bold text-gray-900">
            {cart?.subtotal?.formattedAmount ?? "—"}
          </span>
        </div>
        <p className="text-xs text-gray-400 mb-6">Taxes and shipping calculated at checkout.</p>
        <button
          onClick={handleCheckout}
          disabled={checkingOut}
          className="w-full bg-blue-600 text-white py-4 rounded-full font-semibold text-lg hover:bg-blue-700 active:bg-blue-800 transition-colors disabled:opacity-60 touch-manipulation"
        >
          {checkingOut ? "Going to checkout..." : "Proceed to Checkout"}
        </button>
        <Link
          href="/products"
          className="block text-center mt-4 text-sm text-gray-400 hover:text-gray-600 transition-colors py-2"
        >
          Continue Shopping
        </Link>
      </div>
    </div>
  );
}
