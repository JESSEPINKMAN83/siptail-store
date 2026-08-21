export const dynamic = "force-dynamic";
import Link from "next/link";
import { getWixServerClient } from "@/lib/wix-client";

const FALLBACK = [{
  _id: "fallback-1", name: "SipTail Trail Bottle", slug: "siptail-trail-bottle",
  description: "Portable, leak-proof water bottle for dogs. One-squeeze design.",
  priceData: { formatted: { price: "$24.99" } }, media: null as null,
}];

type AnyProduct = {
  _id?: string | null; name?: string | null; slug?: string | null;
  description?: string | null; priceData?: { formatted?: { price?: string | null } | null } | null;
  media?: { mainMedia?: { image?: { url?: string | null } | null } | null } | null;
};

async function fetchProducts(): Promise<AnyProduct[]> {
  try { const c = await getWixServerClient(); const r = await c.products.queryProducts().find(); return r.items as AnyProduct[]; }
  catch { return FALLBACK; }
}

export default async function ProductsPage() {
  const products = await fetchProducts();
  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <h1 className="text-3xl font-bold text-gray-900 mb-4">Shop</h1>
      <p className="text-gray-600 mb-12">Hydration gear for dogs who keep up.</p>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {products.map((p) => {
          const price = p.priceData?.formatted?.price ?? "";
          const img = p.media?.mainMedia?.image?.url;
          return (
            <Link key={p._id ?? "u"} href={`/products/${p.slug ?? "siptail-trail-bottle"}`}
              className="group bg-white rounded-2xl border border-gray-100 overflow-hidden hover:shadow-md transition-shadow">
              <div className="aspect-square bg-blue-50 flex items-center justify-center">
                {img ? <img src={img} alt={p.name ?? ""} className="w-full h-full object-cover" /> : <span className="text-6xl">🐾</span>}
              </div>
              <div className="p-6">
                <h2 className="text-lg font-semibold text-gray-900 group-hover:text-blue-600 transition-colors mb-1">{p.name}</h2>
                {p.description && <p className="text-sm text-gray-500 mb-3 line-clamp-2">{p.description}</p>}
                {price && <p className="text-blue-600 font-semibold">From {price}</p>}
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
