export const dynamic = "force-dynamic";
import Link from "next/link";
import WishlistButton from "@/components/WishlistButton";
import { getWixServerClient } from "@/lib/wix-client";

type AnyProduct = {
  _id?: string | null; name?: string | null; slug?: string | null;
  description?: string | null; priceData?: { formatted?: { price?: string | null } | null } | null;
  media?: { mainMedia?: { image?: { url?: string | null } | null } | null } | null;
};

const FALLBACK: AnyProduct[] = [{
  _id: "fallback-1", name: "SipTail Trail Bottle", slug: "siptail-trail-bottle",
  description: "One-handed, no-spill, BPA-free. Built for every trail.",
  priceData: { formatted: { price: "$24.99" } }, media: null,
}];

const BADGES = ["Best Seller", "New In", "Staff Pick", "Top Rated"];

const CATEGORIES = [
  { icon: "◎", label: "Hydration", href: "/products?cat=hydration" },
  { icon: "▲", label: "Trail & Hike", href: "/products?cat=trail-hike" },
  { icon: "◈", label: "Dog Safety", href: "/products?cat=dog-safety" },
  { icon: "⬡", label: "Walk Gear", href: "/products?cat=walk-gear" },
  { icon: "◉", label: "Active & Sport", href: "/products?cat=active" },
  { icon: "◇", label: "Gift Ideas", href: "/products?cat=gifts" },
];

async function fetchProducts(): Promise<AnyProduct[]> {
  try {
    const c = await getWixServerClient();
    const r = await c.products.queryProducts().find();
    return r.items.length > 0 ? r.items as AnyProduct[] : FALLBACK;
  } catch { return FALLBACK; }
}

export default async function HomePage() {
  const products = await fetchProducts();
  const bestSellers = products.length >= 4 ? products.slice(0, 4) : [0,1,2,3].map(() => ({ ...FALLBACK[0] }));

  return (
    <div style={{ background: "#F5F4F0" }}>

      {/* Hero */}
      <section className="px-4 py-20 md:py-32">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div>
              <p className="text-xs uppercase tracking-widest mb-4 font-medium" style={{ color: "#1B4332" }}>
                New season collection
              </p>
              <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold leading-tight mb-6"
                style={{ fontFamily: "Georgia, 'Times New Roman', serif", color: "#1B4332" }}>
                Every walk,<br />better.
              </h1>
              <p className="text-lg mb-8 max-w-md leading-relaxed" style={{ color: "#1A1A1A" }}>
                Premium gear for every trail, path and adventure. Built for dogs who keep up.
              </p>
              <div className="flex flex-col sm:flex-row gap-3">
                <Link href="/products"
                  className="inline-block px-8 py-4 text-sm font-semibold uppercase tracking-wide text-center text-white hover:opacity-90 active:opacity-80 transition-opacity touch-manipulation"
                  style={{ background: "#1B4332" }}>
                  Shop Now
                </Link>
                <Link href="/products/siptail-trail-bottle"
                  className="inline-block px-8 py-4 text-sm font-semibold uppercase tracking-wide text-center border hover:opacity-80 active:opacity-70 transition-opacity touch-manipulation"
                  style={{ color: "#1B4332", borderColor: "#1B4332" }}>
                  See the Trail Bottle
                </Link>
              </div>
            </div>
            {/* Hero image block */}
            <div className="relative">
              <div className="aspect-square flex items-center justify-center" style={{ background: "#D4E6D4" }}>
                <div className="text-center p-10">
                  <svg viewBox="0 0 120 80" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-32 h-20 mx-auto mb-4">
                    <path d="M10 70 L38 18 L66 70" stroke="#1B4332" strokeWidth="3" strokeLinejoin="round" fill="none"/>
                    <path d="M52 70 L82 8 L112 70" stroke="#1B4332" strokeWidth="3" strokeLinejoin="round" fill="none"/>
                    <path d="M6 75 Q26 69 46 73 Q66 77 86 71 Q106 65 116 70" stroke="#4A7C59" strokeWidth="2" strokeLinecap="round" fill="none"/>
                  </svg>
                  <p className="text-sm font-medium" style={{ fontFamily: "Georgia, serif", color: "#1B4332" }}>SipTail Trail Bottle</p>
                  <p className="text-xs mt-1" style={{ color: "#4A7C59" }}>Product photography coming soon</p>
                </div>
              </div>
              <div className="absolute top-4 left-4 px-3 py-1.5 text-xs font-bold uppercase tracking-wide text-white"
                style={{ background: "#1B4332" }}>
                New Arrival
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Category grid */}
      <section className="py-16 px-4" style={{ background: "#FFFFFF" }}>
        <div className="max-w-7xl mx-auto">
          <h2 className="text-2xl font-bold mb-10" style={{ fontFamily: "Georgia, serif", color: "#1A1A1A" }}>
            Shop by Category
          </h2>
          <div className="grid grid-cols-3 lg:grid-cols-6 gap-3">
            {CATEGORIES.map((cat) => (
              <Link key={cat.label} href={cat.href}
                className="group flex flex-col items-center gap-3 p-4 border text-center hover:opacity-80 active:scale-[0.98] transition-all touch-manipulation"
                style={{ background: "#F5F4F0", borderColor: "#D4E6D4" }}>
                <span className="text-2xl" style={{ color: "#1B4332" }}>{cat.icon}</span>
                <span className="text-xs font-medium uppercase tracking-wide" style={{ color: "#1A1A1A" }}>{cat.label}</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Best sellers */}
      <section className="py-16 px-4" style={{ background: "#F5F4F0" }}>
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-10">
            <h2 className="text-2xl font-bold" style={{ fontFamily: "Georgia, serif", color: "#1A1A1A" }}>Best Sellers</h2>
            <Link href="/products" className="text-xs font-semibold uppercase tracking-wide hover:opacity-70 transition-opacity"
              style={{ color: "#1B4332" }}>View All →</Link>
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {bestSellers.map((p, i) => {
              const badge = BADGES[i % BADGES.length];
              const img = p.media?.mainMedia?.image?.url;
              const price = p.priceData?.formatted?.price ?? "$24.99";
              return (
                <Link key={`${p._id}-${i}`} href={`/products/${p.slug ?? "siptail-trail-bottle"}`}
                  className="group border hover:shadow-md active:scale-[0.98] transition-all touch-manipulation"
                  style={{ background: "#FFFFFF", borderColor: "#D4E6D4" }}>
                  <div className="relative aspect-square flex items-center justify-center overflow-hidden"
                    style={{ background: "#F5F4F0" }}>
                    {img
                      ? <img src={img} alt={p.name ?? ""} className="w-full h-full object-cover" />
                      : <svg viewBox="0 0 64 64" fill="none" className="w-16 h-16 opacity-20">
                          <path d="M8 56 L28 16 L48 56" stroke="#1B4332" strokeWidth="2.5" strokeLinejoin="round" fill="none"/>
                          <path d="M30 56 L50 8 L70 56" stroke="#1B4332" strokeWidth="2.5" strokeLinejoin="round" fill="none"/>
                        </svg>}
                    <div className="absolute top-0 left-0 px-2 py-1 text-xs font-bold uppercase tracking-wide text-white"
                      style={{ background: "#1B4332" }}>{badge}</div>
                    <WishlistButton />
                  </div>
                  <div className="p-4">
                    <h3 className="font-semibold text-sm mb-1 leading-snug line-clamp-2"
                      style={{ fontFamily: "Georgia, serif", color: "#1A1A1A" }}>{p.name}</h3>
                    <div className="flex items-center gap-1 mb-2 text-xs" style={{ color: "#4A7C59" }}>
                      ★★★★★ <span style={{ color: "#6B7280" }}>4.8 (124)</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-sm" style={{ color: "#1B4332" }}>{price}</span>
                      <div className="w-8 h-8 flex items-center justify-center text-white"
                        style={{ background: "#1B4332" }}>
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                        </svg>
                      </div>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* Trust bar */}
      <section className="py-10 px-4 border-t" style={{ background: "#FFFFFF", borderColor: "#D4E6D4" }}>
        <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          {[
            { icon: "→", title: "Free US Shipping", desc: "Orders over $50" },
            { icon: "↩", title: "30-Day Returns", desc: "No-hassle policy" },
            { icon: "✓", title: "BPA-Free & Safe", desc: "Vet approved materials" },
            { icon: "◎", title: "Trail Tested", desc: "Built for real adventures" },
          ].map(t => (
            <div key={t.title} className="flex flex-col items-center gap-1 p-3">
              <span className="text-lg font-bold mb-1" style={{ color: "#1B4332" }}>{t.icon}</span>
              <span className="font-semibold text-sm" style={{ fontFamily: "Georgia, serif", color: "#1A1A1A" }}>{t.title}</span>
              <span className="text-xs" style={{ color: "#6B7280" }}>{t.desc}</span>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
