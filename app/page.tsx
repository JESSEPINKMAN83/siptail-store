import WishlistButton from "@/components/WishlistButton";
export const dynamic = "force-dynamic";
import Link from "next/link";
import { getWixServerClient } from "@/lib/wix-client";

type AnyProduct = {
  _id?: string | null;
  name?: string | null;
  slug?: string | null;
  description?: string | null;
  priceData?: { formatted?: { price?: string | null } | null; discountedPrice?: number | null } | null;
  media?: { mainMedia?: { image?: { url?: string | null } | null } | null } | null;
};

const FALLBACK_PRODUCT: AnyProduct = {
  _id: "fallback-1",
  name: "SipTail Trail Bottle",
  slug: "siptail-trail-bottle",
  description: "One-handed, no-spill, BPA-free. Built for dogs who keep up.",
  priceData: { formatted: { price: "$24.99" } },
  media: null,
};

const BADGES = ["Seller's Choice", "New In", "Hot Price", "Top Rated"];

async function fetchProducts(): Promise<AnyProduct[]> {
  try {
    const c = await getWixServerClient();
    const r = await c.products.queryProducts().find();
    if (r.items.length > 0) return r.items as AnyProduct[];
    return [];
  } catch { return []; }
}

const CATEGORIES = [
  { icon: "💧", label: "Hydration", href: "/products?cat=hydration" },
  { icon: "🥾", label: "Trail & Hike", href: "/products?cat=trail-hike" },
  { icon: "🦺", label: "Dog Safety", href: "/products?cat=dog-safety" },
  { icon: "🎒", label: "Walk Gear", href: "/products?cat=walk-gear" },
  { icon: "🏃", label: "Active & Sport", href: "/products?cat=active" },
  { icon: "🎁", label: "Gift Ideas", href: "/products?cat=gifts" },
];

export default async function HomePage() {
  const wixProducts = await fetchProducts();

  // For best sellers: use real products if available, else repeat fallback with badge variants
  const bestSellers: AnyProduct[] = wixProducts.length > 0
    ? wixProducts.slice(0, 4)
    : [0, 1, 2, 3].map(() => ({ ...FALLBACK_PRODUCT }));

  return (
    <div className="bg-white">

      {/* ── Hero Banner ─────────────────────────────────────── */}
      <section className="relative bg-gradient-to-br from-[#2d5016] via-[#3a6b1e] to-[#1a2e0a] overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-20">
          <div className="flex flex-col md:flex-row items-center gap-8 md:gap-12">

            {/* Left: text */}
            <div className="flex-1 text-white text-center md:text-left">
              <span className="inline-block bg-[#5a8f35] text-white text-xs font-bold uppercase tracking-widest px-3 py-1 rounded-full mb-4">
                New Arrival
              </span>
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold leading-tight mb-4">
                Keep Your Dog Hydrated<br className="hidden sm:block" /> on Every Walk
              </h1>
              <p className="text-green-200 text-base sm:text-lg mb-8 max-w-md mx-auto md:mx-0">
                The SipTail Trail Bottle — one-handed, no-spill, BPA-free. Built for the trail, ready for the park.
              </p>
              <Link
                href="/products/siptail-trail-bottle"
                className="inline-block bg-white text-[#2d5016] px-8 py-4 rounded-full font-bold text-base hover:bg-green-50 active:bg-green-100 transition-colors touch-manipulation"
              >
                Shop Now →
              </Link>
            </div>

            {/* Right: product placeholder */}
            <div className="flex-shrink-0 w-48 h-48 sm:w-64 sm:h-64 md:w-72 md:h-72 rounded-3xl bg-white/10 border-2 border-white/20 flex flex-col items-center justify-center backdrop-blur-sm">
              <span className="text-7xl sm:text-8xl mb-2">🐾</span>
              <span className="text-white/60 text-sm text-center px-4">SipTail Trail Bottle</span>
            </div>
          </div>

          {/* Carousel dots */}
          <div className="flex justify-center gap-2 mt-8 md:mt-10">
            {[0, 1, 2].map((i) => (
              <div
                key={i}
                className={`h-2 rounded-full transition-all ${i === 0 ? "w-6 bg-white" : "w-2 bg-white/40"}`}
              />
            ))}
          </div>
        </div>
      </section>

      {/* ── Shop by Category ────────────────────────────────── */}
      <section className="py-10 sm:py-14 px-4">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-2xl font-bold text-[#1a1a1a] mb-6 sm:mb-8">Shop by Category</h2>
          <div className="grid grid-cols-3 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
            {CATEGORIES.map((cat) => (
              <Link
                key={cat.label}
                href={cat.href}
                className="group flex flex-col items-center gap-2 p-3 sm:p-4 rounded-2xl bg-[#f8f9fa] hover:bg-green-50 hover:shadow-md active:scale-95 transition-all touch-manipulation"
              >
                <div className="text-3xl sm:text-4xl group-hover:scale-110 transition-transform">
                  {cat.icon}
                </div>
                <span className="text-xs sm:text-sm font-medium text-gray-700 group-hover:text-[#2d5016] text-center leading-tight">
                  {cat.label}
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── Best Sellers ────────────────────────────────────── */}
      <section className="py-10 sm:py-14 px-4 bg-[#f8f9fa]">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-6 sm:mb-8">
            <h2 className="text-2xl font-bold text-[#1a1a1a]">Best Sellers</h2>
            <Link href="/products" className="text-sm font-medium text-[#2d5016] hover:text-[#5a8f35] transition-colors">
              View All →
            </Link>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-5">
            {bestSellers.map((product, i) => {
              const badge = BADGES[i % BADGES.length];
              const img = product.media?.mainMedia?.image?.url;
              const price = product.priceData?.formatted?.price ?? "$24.99";
              const slug = product.slug ?? "siptail-trail-bottle";

              return (
                <Link
                  key={`${product._id}-${i}`}
                  href={`/products/${slug}`}
                  className="group bg-white rounded-2xl overflow-hidden border border-gray-100 hover:shadow-lg active:scale-[0.98] transition-all touch-manipulation"
                >
                  {/* Image area */}
                  <div className="relative aspect-square bg-[#f0f4f0] flex items-center justify-center overflow-hidden">
                    {img ? (
                      <img src={img} alt={product.name ?? ""} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                    ) : (
                      <span className="text-5xl sm:text-6xl">🐾</span>
                    )}

                    {/* Badge */}
                    <span className={`absolute top-2 left-2 text-white text-xs font-bold px-2 py-1 rounded-lg ${
                      badge === "Hot Price" ? "bg-red-500" :
                      badge === "New In" ? "bg-blue-500" :
                      badge === "Top Rated" ? "bg-purple-500" :
                      "bg-[#2d5016]"
                    }`}>
                      {badge}
                    </span>
                    <WishlistButton />
                  </div>

                  {/* Info */}
                  <div className="p-3 sm:p-4">
                    <h3 className="font-semibold text-gray-900 text-sm leading-snug mb-1 group-hover:text-[#2d5016] transition-colors line-clamp-2">
                      {product.name}
                    </h3>

                    {/* Stars */}
                    <div className="flex items-center gap-1 mb-2">
                      <span className="text-yellow-400 text-xs">★★★★★</span>
                      <span className="text-xs text-gray-500">4.8 (124)</span>
                    </div>

                    {/* Price row */}
                    <div className="flex items-center justify-between gap-2">
                      <div>
                        <span className="font-bold text-[#2d5016] text-sm sm:text-base">{price}</span>
                        {i % 3 === 0 && (
                          <span className="ml-1 text-xs text-gray-400 line-through">$34.99</span>
                        )}
                      </div>
                      {/* Add to cart icon button */}
                      <div className="w-8 h-8 rounded-full bg-[#2d5016] flex items-center justify-center text-white hover:bg-[#5a8f35] active:bg-[#1a2e0a] transition-colors flex-shrink-0">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-10H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
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

      {/* ── Trust banner ────────────────────────────────────── */}
      <section className="py-8 px-4 border-t border-gray-100">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
            {[
              { icon: "🚚", title: "Free US Shipping", desc: "On orders over $50" },
              { icon: "↩️", title: "Easy Returns", desc: "30-day no-hassle returns" },
              { icon: "🔒", title: "Secure Checkout", desc: "SSL encrypted payment" },
              { icon: "🐾", title: "Dog Approved", desc: "BPA-free, vet tested" },
            ].map((t) => (
              <div key={t.title} className="flex flex-col items-center gap-1 p-3">
                <span className="text-2xl mb-1">{t.icon}</span>
                <span className="font-semibold text-gray-900 text-sm">{t.title}</span>
                <span className="text-xs text-gray-500">{t.desc}</span>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
