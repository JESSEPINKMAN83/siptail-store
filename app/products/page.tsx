export const dynamic = "force-dynamic";
import Link from "next/link";
import { getWixServerClient } from "@/lib/wix-client";

// Shown whenever the Wix catalog has no published products yet.
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
  _id?: string | null;
  name?: string | null;
  slug?: string | null;
  description?: string | null;
  priceData?: { formatted?: { price?: string | null } | null } | null;
  media?: { mainMedia?: { image?: { url?: string | null } | null } | null } | null;
};

async function fetchProducts(): Promise<{ products: AnyProduct[]; isLive: boolean }> {
  try {
    const c = await getWixServerClient();
    const r = await c.products.queryProducts().find();
    if (r.items.length > 0) return { products: r.items as AnyProduct[], isLive: true };
    // Catalog exists but has no published products — show fallback
    return { products: FALLBACK, isLive: false };
  } catch {
    return { products: FALLBACK, isLive: false };
  }
}

export default async function ProductsPage() {
  const { products, isLive } = await fetchProducts();
  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-3xl font-bold text-gray-900 mb-2">Shop</h1>
      <p className="text-gray-600 mb-10">Hydration gear for dogs who keep up.</p>

      {!isLive && (
        <div className="mb-8 bg-amber-50 border border-amber-200 rounded-xl p-4 text-sm text-amber-800">
          No products published in your Wix store yet — showing a preview. Add and publish products in your Wix dashboard to go live.
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {products.map((p) => {
          const price = p.priceData?.formatted?.price ?? "";
          const img = p.media?.mainMedia?.image?.url;
          return (
            <Link
              key={p._id ?? "u"}
              href={`/products/${p.slug ?? "siptail-trail-bottle"}`}
              className="group bg-white rounded-2xl border border-gray-100 overflow-hidden hover:shadow-md transition-shadow active:scale-95"
            >
              <div className="aspect-square bg-blue-50 flex items-center justify-center">
                {img ? (
                  <img src={img} alt={p.name ?? ""} className="w-full h-full object-cover" />
                ) : (
                  <span className="text-6xl">🐾</span>
                )}
              </div>
              <div className="p-5">
                <h2 className="text-lg font-semibold text-gray-900 group-hover:text-blue-600 transition-colors mb-1">
                  {p.name}
                </h2>
                {p.description && (
                  <p className="text-sm text-gray-500 mb-3 line-clamp-2">{p.description}</p>
                )}
                {price && <p className="text-blue-600 font-semibold">From {price}</p>}
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
