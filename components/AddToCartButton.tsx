"use client";
import { useState } from "react";
import { serverAddToCart } from "@/app/actions/cart-actions";
import { useRouter } from "next/navigation";

declare global {
  // eslint-disable-next-line no-var
  var fbq: ((...args: unknown[]) => void) | undefined;
}

interface Variant { id: string; label: string; price: string; }
interface Props { productId: string; productName: string; variants: Variant[]; isLive: boolean; }

export default function AddToCartButton({ productId, productName, variants, isLive }: Props) {
  const [selected, setSelected] = useState(variants[0]?.id || "");
  const [loading, setLoading] = useState(false);
  const [added, setAdded] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();
  const sel = variants.find(v => v.id === selected) ?? variants[0];

  // Parse price as a number for pixel events
  const priceNum = sel?.price
    ? parseFloat(sel.price.replace(/[^0-9.]/g, "")) || 0
    : 0;

  async function handleAdd() {
    if (!isLive) {
      router.push("/cart?preview=1");
      return;
    }
    setLoading(true);
    setError("");
    try {
      console.log("[AddToCart] calling serverAddToCart", { productId, selected, qty: 1 });
      const result = await serverAddToCart(productId, selected || null, 1);
      console.log("[AddToCart] result:", result);

      if (!result.ok) {
        setError("Could not add to cart. Please try again.");
        console.error("[AddToCart] server error:", result.error);
        return;
      }

      // Fire Meta Pixel AddToCart event
      if (typeof window !== "undefined" && window.fbq) {
        window.fbq("track", "AddToCart", {
          value: priceNum,
          currency: "USD",
          content_ids: [productId],
          content_name: productName,
          content_type: "product",
        });
      }

      setAdded(true);
      setTimeout(() => setAdded(false), 2500);
      router.refresh();
    } catch (e) {
      console.error("[AddToCart] unexpected error:", e);
      setError("Could not add to cart. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-2">
      {variants.length > 1 && (
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Size</label>
          <div className="flex flex-wrap gap-2">
            {variants.map(v => (
              <button key={v.id} onClick={() => setSelected(v.id)}
                className={`px-4 py-2 rounded-lg border text-sm font-medium transition-colors touch-manipulation min-h-[44px] ${
                  selected === v.id
                    ? "border-[#1B4332] bg-green-50 text-[#1B4332]"
                    : "border-gray-200 text-gray-700 hover:border-gray-300 active:bg-gray-50"
                }`}>
                {v.label}
                {v.price && <span className="ml-1 text-gray-400 font-normal"> — {v.price}</span>}
              </button>
            ))}
          </div>
        </div>
      )}

      <button onClick={handleAdd} disabled={loading}
        className={`w-full py-4 px-8 rounded-full font-bold text-lg transition-all touch-manipulation min-h-[56px] ${
          added
            ? "bg-green-600 text-white"
            : loading
            ? "bg-gray-300 text-gray-500 cursor-not-allowed"
            : "bg-[#1B4332] text-white hover:bg-[#2d5a3d] active:bg-[#143326]"
        }`}>
        {added ? "Added to cart ✓" : loading ? "Adding..." : `Add to Cart${sel?.price ? ` — ${sel.price}` : ""}`}
      </button>

      {error && <p className="text-red-500 text-sm text-center bg-red-50 rounded-lg px-3 py-2">{error}</p>}
    </div>
  );
}
