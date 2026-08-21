"use client";
import { useState } from "react";
import { getWixBrowserClient } from "@/lib/wix-client-browser";
import { useRouter } from "next/navigation";

interface Variant { id: string; label: string; price: string; }
interface Props { productId: string; productName: string; variants: Variant[]; isLive: boolean; }

export default function AddToCartButton({ productId, variants, isLive }: Props) {
  const [selected, setSelected] = useState(variants[0]?.id || "");
  const [loading, setLoading] = useState(false);
  const [added, setAdded] = useState(false);
  const router = useRouter();
  const sel = variants.find(v => v.id === selected);

  async function handleAdd() {
    if (!isLive) {
      // Preview mode — go to cart with preview flag
      router.push("/cart?preview=1");
      return;
    }
    setLoading(true);
    try {
      const client = getWixBrowserClient();
      await client.currentCart.addToCurrentCart({
        lineItems: [{
          catalogReference: {
            appId: "1380b703-ce81-ff05-f115-39571d94dfcd", // Wix Stores app ID
            catalogItemId: productId,
            options: selected ? { variantId: selected } : {},
          },
          quantity: 1,
        }],
      });
      setAdded(true);
      setTimeout(() => setAdded(false), 2000);
      // Refresh server components so cart icon count updates
      router.refresh();
    } catch (err) {
      console.error("Add to cart failed:", err);
      alert("Could not add to cart. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-4">
      {/* Variant selector */}
      {variants.length > 1 && (
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Size</label>
          <div className="flex flex-wrap gap-2">
            {variants.map(v => (
              <button
                key={v.id}
                onClick={() => setSelected(v.id)}
                className={`px-4 py-2 rounded-lg border text-sm font-medium transition-colors touch-manipulation min-h-[44px] ${
                  selected === v.id
                    ? "border-blue-600 bg-blue-50 text-blue-700"
                    : "border-gray-200 text-gray-700 hover:border-gray-300 active:bg-gray-50"
                }`}
              >
                {v.label}
                {v.price && <span className="ml-1 text-gray-400 font-normal"> — {v.price}</span>}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Add to cart button — min 44px tap target for mobile */}
      <button
        onClick={handleAdd}
        disabled={loading}
        className={`w-full py-4 px-8 rounded-full font-semibold text-lg transition-all touch-manipulation min-h-[56px] ${
          added
            ? "bg-green-600 text-white"
            : loading
            ? "bg-gray-300 text-gray-500 cursor-not-allowed"
            : "bg-blue-600 text-white hover:bg-blue-700 active:bg-blue-800"
        }`}
      >
        {added
          ? "Added to cart ✓"
          : loading
          ? "Adding..."
          : `Add to Cart${sel?.price ? ` — ${sel.price}` : ""}`}
      </button>
    </div>
  );
}
