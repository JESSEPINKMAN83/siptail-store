export const dynamic = "force-dynamic";
import Link from "next/link";
import { getWixServerClient } from "@/lib/wix-client";

const FALLBACK: AnyProduct[] = [
  {
    _id: "fallback-1",
    name: "SipTail Trail Bottle",
    slug: "siptail-trail-bottle",
    description: "Portable, leak-proof water bottle for dogs. One-squeeze fill tray, zero waste.",
    priceData: { formatted: { price: "$24.99" } },
    media: null,
  },
];

type AnyProduct = {
  _id?: string | null; name?: string | null; slug?: string | null;
  description?: string | null; priceData?: { formatted?: { price?: string | null } | null } | null;
  media?: { mainMedia?: { image?: { url?: string | null } | null } | null } | null;
};

async function fetchProducts(): Promise<{ products: AnyProduct[]; isLive: boolean }> {
  try {
    const c = await getWixServerClient();
    const r = await c.products.queryProducts().find();
    if (r.items.length > 0) return { products: r.items as AnyProduct[], isLive: true };
    return { products: FALLBACK, isLive: false };
  } catch { return { products: FALLBACK, isLive: false }; }
}

export default async function ProductsPage() {
  const { products, isLive } = await fetchProducts();
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="flex items-center justify-between mb-2">
        <h1 className="text-2xl font-bold text-gray-900">All Products</h1>
        <span className="text-sm text-gray-500">{isLive ? `${products.length} products` : "Preview mode"}</span>
      </div>
      <p className="text-gray-500 text-sm mb-8">Hydration gear and walk essentials for dogs.</p>

      {!isLive && (
        <div className="mb-6 bg-amber-50 border border-amber-200 rounded-xl p-4 text-sm text-amber-800">
          No published products in your Wix store yet — showing a preview card. Add and publish products in your Wix dashboard to go live.
        </div>
      )}

      <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        {products.map((p) => {
          const price = p.priceData?.formatted?.price ?? "";
          const img = p.media?.mainMedia?.image?.url;
          return (
            <Link
              key={p._id ?? "u"}
              href={`/products/${p.slug ?? "siptail-trail-bottle"}`}
              className="group bg-white rounded-2xl border border-gray-100 overflow-hidden hover:shadow-md active:scale-[0.98] transition-all touch-manipulation"
            >
              <div className="aspect-square bg-[#f0f4f0] flex items-center justify-center overflow-hidden">
                {img
                  ? <img src={img} alt={p.name ?? ""} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                  : <span className="text-5xl">🐾</span>}
              </div>
              <div className="p-4">
                <h2 className="font-semibold text-gray-900 group-hover:text-[#2d5016] transition-colors text-sm mb-1 line-clamp-2">{p.name}</h2>
                <div className="flex items-center gap-1 mb-2">
                  <span className="text-yellow-400 text-xs">★★★★★</span>
                  <span className="text-xs text-gray-400">4.8</span>
                </div>
                {p.description && <p className="text-xs text-gray-400 mb-3 line-clamp-2">{p.description}</p>}
                {price && <p className="text-[#2d5016] font-bold text-sm">From {price}</p>}
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
