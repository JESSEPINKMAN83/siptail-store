"use client";
import { useState } from "react";
import { serverAddToCart } from "@/app/actions/cart-actions";
import { useRouter } from "next/navigation";

declare global { var fbq: ((...args: unknown[]) => void) | undefined; }

interface Variant { id: string; label: string; price: string; }
interface Props { productId: string; productName: string; variants: Variant[]; isLive: boolean; }

export default function AddToCartButton({ productId, productName, variants }: Props) {
  const [selected, setSelected] = useState(variants[0]?.id || "");
  const [loading, setLoading] = useState(false);
  const [added, setAdded] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();
  const sel = variants.find(v => v.id === selected) ?? variants[0];
  const priceNum = sel?.price ? parseFloat(sel.price.replace(/[^0-9.]/g, "")) || 0 : 0;

  async function handleAdd() {
    setLoading(true);
    setError("");
    try {
      const result = await serverAddToCart(productId, selected || null, 1);
      if (!result.ok) {
        // Product not in Wix catalog yet — show a helpful message
        setError(result.error?.includes("not found") || result.error?.includes("catalog")
          ? "This product isn't available for purchase yet. Check back soon."
          : "Could not add to cart. Please try again.");
        console.error("[AddToCart] error:", result.error);
        return;
      }
      if (typeof window !== "undefined" && window.fbq) {
        window.fbq("track", "AddToCart", {
          value: priceNum, currency: "USD",
          content_ids: [productId], content_name: productName, content_type: "product",
        });
      }
      setAdded(true);
      setTimeout(() => setAdded(false), 2500);
      router.refresh();
      // Navigate to cart after success
      router.push("/cart");
    } catch (e) {
      console.error("[AddToCart] unexpected:", e);
      setError("Could not add to cart. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-2">
      {variants.length > 1 && (
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wide mb-2" style={{ color: "#1A1A1A" }}>Size</label>
          <div className="flex flex-wrap gap-2">
            {variants.map(v => (
              <button key={v.id} onClick={() => setSelected(v.id)}
                className={`px-4 py-2 text-sm font-medium transition-colors touch-manipulation min-h-[44px] border`}
                style={{
                  background: selected === v.id ? "#1B4332" : "#FFFFFF",
                  color: selected === v.id ? "#FFFFFF" : "#1A1A1A",
                  borderColor: selected === v.id ? "#1B4332" : "#D4E6D4",
                }}>
                {v.label}{v.price && <span className="ml-1 opacity-70"> — {v.price}</span>}
              </button>
            ))}
          </div>
        </div>
      )}
      <button onClick={handleAdd} disabled={loading}
        className="w-full py-4 px-8 font-semibold text-sm uppercase tracking-wide transition-all touch-manipulation min-h-[56px]"
        style={{
          background: added ? "#4A7C59" : loading ? "#D4E6D4" : "#1B4332",
          color: (loading && !added) ? "#1A1A1A" : "#FFFFFF",
          cursor: loading ? "not-allowed" : "pointer",
        }}>
        {added ? "Added to Cart ✓" : loading ? "Adding..." : `Add to Cart${sel?.price ? ` — ${sel.price}` : ""}`}
      </button>
      {error && <p className="text-red-600 text-sm text-center bg-red-50 px-3 py-2">{error}</p>}
    </div>
  );
}
