export const dynamic = "force-dynamic";
import Link from "next/link";
import { getWixServerClient } from "@/lib/wix-client";

const FALLBACK: AnyProduct[] = [{
  _id: "fallback-1", name: "SipTail Trail Bottle", slug: "siptail-trail-bottle",
  description: "One-handed, no-spill, BPA-free. Built for every trail.",
  priceData: { formatted: { price: "$24.99" } }, media: null,
}];

type AnyProduct = {
  _id?: string | null; name?: string | null; slug?: string | null;
  description?: string | null; priceData?: { formatted?: { price?: string | null } | null } | null;
  media?: { mainMedia?: { image?: { url?: string | null } | null } | null } | null;
};

async function fetchProducts(): Promise<{ products: AnyProduct[]; isLive: boolean }> {
  try {
    const c = await getWixServerClient();
    const r = await c.products.queryProducts().find();
    return r.items.length > 0 ? { products: r.items as AnyProduct[], isLive: true } : { products: FALLBACK, isLive: false };
  } catch { return { products: FALLBACK, isLive: false }; }
}

export default async function ProductsPage() {
  const { products, isLive } = await fetchProducts();
  return (
    <div style={{ background: "#F5F4F0" }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex items-center justify-between mb-2">
          <h1 className="text-3xl font-bold" style={{ fontFamily: "Georgia, serif", color: "#1A1A1A" }}>All Products</h1>
          <span className="text-sm" style={{ color: "#6B7280" }}>{isLive ? `${products.length} products` : "Preview"}</span>
        </div>
        <p className="mb-8 text-sm" style={{ color: "#6B7280" }}>Walk gear and hydration for every adventure.</p>

        {!isLive && (
          <div className="mb-6 px-4 py-3 text-sm border" style={{ background: "#F5F4F0", borderColor: "#D4E6D4", color: "#1B4332" }}>
            No published products yet — showing a preview. Add products in your Wix dashboard.
          </div>
        )}

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {products.map(p => {
            const price = p.priceData?.formatted?.price ?? "";
            const img = p.media?.mainMedia?.image?.url;
            return (
              <Link key={p._id ?? "u"} href={`/products/${p.slug ?? "siptail-trail-bottle"}`}
                className="group border transition-all hover:shadow-md active:scale-[0.98] touch-manipulation"
                style={{ background: "#FFFFFF", borderColor: "#D4E6D4" }}>
                <div className="aspect-square flex items-center justify-center overflow-hidden" style={{ background: "#F5F4F0" }}>
                  {img
                    ? <img src={img} alt={p.name ?? ""} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                    : <svg viewBox="0 0 64 64" fill="none" className="w-14 h-14 opacity-25"><path d="M8 56 L28 16 L48 56" stroke="#1B4332" strokeWidth="2.5" strokeLinejoin="round" fill="none"/><path d="M30 56 L50 8 L70 56" stroke="#1B4332" strokeWidth="2.5" strokeLinejoin="round" fill="none"/></svg>}
                </div>
                <div className="p-4">
                  <h2 className="font-semibold text-sm mb-1 line-clamp-2" style={{ fontFamily: "Georgia, serif", color: "#1A1A1A" }}>{p.name}</h2>
                  <div className="text-xs mb-2" style={{ color: "#4A7C59" }}>★★★★★ 4.8</div>
                  {price && <p className="font-bold text-sm" style={{ color: "#1B4332" }}>From {price}</p>}
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}
