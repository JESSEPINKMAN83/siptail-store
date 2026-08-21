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
    if (!isLive) { router.push("/cart?preview=1"); return; }
    setLoading(true);
    try {
      const client = getWixBrowserClient();
      await client.currentCart.addToCurrentCart({
        lineItems: [{ catalogReference: { appId: "1380b703-ce81-ff05-f115-39571d94dfcd", catalogItemId: productId, options: selected ? { variantId: selected } : {} }, quantity: 1 }],
      });
      setAdded(true); setTimeout(() => setAdded(false), 2000); router.refresh();
    } catch (err) { console.error(err); alert("Could not add to cart. Check your Wix Client ID."); }
    finally { setLoading(false); }
  }

  return (
    <div className="space-y-4">
      {variants.length > 1 && (
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Size</label>
          <div className="flex flex-wrap gap-2">
            {variants.map(v => (
              <button key={v.id} onClick={() => setSelected(v.id)}
                className={`px-4 py-2 rounded-lg border text-sm font-medium transition-colors ${selected === v.id ? "border-blue-600 bg-blue-50 text-blue-700" : "border-gray-200 text-gray-700 hover:border-gray-300"}`}>
                {v.label}{v.price && <span className="ml-1 text-gray-400 font-normal"> — {v.price}</span>}
              </button>
            ))}
          </div>
        </div>
      )}
      <button onClick={handleAdd} disabled={loading}
        className={`w-full py-4 px-8 rounded-full font-semibold text-lg transition-all ${added ? "bg-green-600 text-white" : loading ? "bg-gray-400 text-white cursor-not-allowed" : "bg-blue-600 text-white hover:bg-blue-700"}`}>
        {added ? "Added ✓" : loading ? "Adding..." : `Add to Cart${sel?.price ? ` — ${sel.price}` : ""}`}
      </button>
    </div>
  );
}
