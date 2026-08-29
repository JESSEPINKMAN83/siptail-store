export const dynamic = "force-dynamic";
import Link from "next/link";
import WishlistButton from "@/components/WishlistButton";
import { fetchWixProductsRest } from "@/lib/wix-client";
import { getLocale } from "@/lib/locale";
import { TEQPET_LOGO_URL } from "@/lib/config";

const LOGO_URL = TEQPET_LOGO_URL;

// 9 TeqPet product categories
const TEQPET_CATEGORIES_HE = [
  { label: "\u05de\u05d6\u05d9\u05e0\u05d9\u05dd \u05d7\u05db\u05de\u05d9\u05dd",    slug: "smart-feeders" },
  { label: "\u05de\u05d6\u05e8\u05e7\u05d5\u05ea \u05de\u05d9\u05dd",     slug: "water-fountains" },
  { label: "GPS \u05d5\u05de\u05e2\u05e7\u05d1",      slug: "gps-tracking" },
  { label: "\u05e6\u05e2\u05e6\u05d5\u05e2\u05d9\u05dd \u05d7\u05db\u05de\u05d9\u05dd",  slug: "smart-toys" },
  { label: "\u05d8\u05d9\u05e4\u05d5\u05d7 \u05d8\u05db\u05e0\u05d5\u05dc\u05d5\u05d2\u05d9", slug: "tech-grooming" },
  { label: "\u05d0\u05d1\u05d9\u05d6\u05e8\u05d9 \u05d8\u05d9\u05e4\u05d5\u05d7",   slug: "grooming-accessories" },
  { label: "\u05d0\u05d1\u05d9\u05d6\u05e8\u05d9 \u05d8\u05d9\u05d5\u05dc",    slug: "travel-accessories" },
  { label: "\u05de\u05e6\u05dc\u05de\u05d5\u05ea \u05d7\u05d9\u05d5\u05ea",    slug: "pet-cameras" },
  { label: "\u05de\u05d5\u05e0\u05d9\u05d8\u05d5\u05e8\u05d9 \u05e4\u05e2\u05d9\u05dc\u05d5\u05ea", slug: "activity-monitors" },
];

const TEQPET_CATEGORIES_EN = [
  { label: "Smart Feeders",        slug: "smart-feeders" },
  { label: "Water Fountains",      slug: "water-fountains" },
  { label: "GPS & Tracking",       slug: "gps-tracking" },
  { label: "Smart Toys",           slug: "smart-toys" },
  { label: "Tech Grooming",        slug: "tech-grooming" },
  { label: "Grooming Accessories", slug: "grooming-accessories" },
  { label: "Travel Accessories",   slug: "travel-accessories" },
  { label: "Pet Cameras",          slug: "pet-cameras" },
  { label: "Activity Monitors",    slug: "activity-monitors" },
];

const TRUST_ITEMS_HE = [
  { icon: "\uD83D\uDD12", label: "\u05ea\u05e9\u05dc\u05d5\u05dd \u05de\u05d0\u05d5\u05d1\u05d8\u05d7" },
  { icon: "\u21A9", label: "14 \u05d9\u05d5\u05dd \u05d4\u05d7\u05d6\u05e8\u05d4" },
  { icon: "\uD83D\uDCC4", label: "\u05d7\u05e9\u05d1\u05d5\u05e0\u05d9\u05ea \u05de\u05e1" },
  { icon: "\uD83D\uDCAC", label: "\u05ea\u05de\u05d9\u05db\u05d4 \u05d1\u05e2\u05d1\u05e8\u05d9\u05ea" },
];
const TRUST_ITEMS_EN = [
  { icon: "\uD83D\uDD12", label: "Secure payment" },
  { icon: "\u21A9", label: "14-day returns" },
  { icon: "\uD83D\uDCC4", label: "Tax invoice" },
  { icon: "\uD83D\uDCAC", label: "Support in Hebrew" },
];

export default async function HomePage() {
  const locale = await getLocale();
  const isHe = locale === "he";

  // Use direct REST query -- the SDK's queryProducts() can bind to a different
  // Wix site depending on which OAuth app the clientId was created on.
  const wixProducts = await fetchWixProductsRest();

  const categories = isHe ? TEQPET_CATEGORIES_HE : TEQPET_CATEGORIES_EN;
  const trustItems = isHe ? TRUST_ITEMS_HE : TRUST_ITEMS_EN;

  const tagline = isHe
    ? "\u05d4\u05d8\u05db\u05e0\u05d5\u05dc\u05d5\u05d2\u05d9\u05d4 \u05e9\u05d7\u05d9\u05d5\u05ea \u05d4\u05de\u05d7\u05de\u05d3 \u05d0\u05d5\u05d4\u05d1\u05d5\u05ea"
    : "The technology pets love";
  const heroSub = isHe
    ? "\u05de\u05d6\u05d9\u05e0\u05d9\u05dd \u05d7\u05db\u05de\u05d9\u05dd, \u05de\u05d6\u05e8\u05e7\u05d5\u05ea, GPS, \u05e6\u05e2\u05e6\u05d5\u05e2\u05d9\u05dd \u05d0\u05d9\u05e0\u05d8\u05e8\u05d0\u05e7\u05d8\u05d9\u05d1\u05d9\u05d9\u05dd \u05d5\u05e2\u05d5\u05d3 \u2014 \u05db\u05dc \u05d4\u05d8\u05e7 \u05dc\u05d7\u05d9\u05d5\u05ea \u05d4\u05de\u05d7\u05de\u05d3 \u05e9\u05dc\u05da \u05d1\u05de\u05e7\u05d5\u05dd \u05d0\u05d7\u05d3."
    : "Smart feeders, water fountains, GPS trackers, interactive toys and more -- all the pet tech you need in one place.";

  return (
    <div style={{ background: "#FFFFFF" }}>

      {/* Hero */}
      <section className="px-4 py-20 md:py-28" style={{ background: "#1B2A4A" }}>
        <div className="max-w-7xl mx-auto">
          <div className={`grid grid-cols-1 md:grid-cols-2 gap-12 items-center`}>
            <div className={isHe ? "text-right" : ""} style={isHe ? { order: 2 } : undefined}>
              <p className="text-xs uppercase tracking-widest mb-4 font-medium" style={{ color: "#FF6B2B" }}>
                {isHe ? "\u05d7\u05e0\u05d5\u05ea \u05d4\u05d8\u05e7 \u05d4\u05de\u05d5\u05d1\u05d9\u05dc\u05d4 \u05dc\u05d7\u05d9\u05d5\u05ea \u05de\u05d7\u05de\u05d3 \u05d1\u05d9\u05e9\u05e8\u05d0\u05dc" : "Israel's #1 pet tech store"}
              </p>
              <h1 className="text-5xl md:text-6xl font-bold leading-tight mb-6"
                style={{ fontFamily: isHe ? "Noto Serif Hebrew, Georgia, serif" : "Inter, system-ui, sans-serif", color: "#FFFFFF" }}>
                {tagline}
              </h1>
              <p className="text-lg mb-8 max-w-md leading-relaxed" style={{ color: "#D0D8EC" }}>
                {heroSub}
              </p>
              <div className={`flex flex-col sm:flex-row gap-3 mb-6 ${isHe ? "sm:flex-row-reverse" : ""}`}>
                <Link href={`/products?lang=${locale}`}
                  className="inline-block px-8 py-4 text-sm font-semibold uppercase tracking-wide text-center hover:opacity-90 transition-opacity touch-manipulation"
                  style={{ background: "#FF6B2B", color: "#FFFFFF" }}>
                  {isHe ? "\u05dc\u05db\u05dc \u05d4\u05de\u05d5\u05e6\u05e8\u05d9\u05dd" : "Shop Now"}
                </Link>
                <Link href={`/products?cat=smart-feeders&lang=${locale}`}
                  className="inline-block px-8 py-4 text-sm font-semibold uppercase tracking-wide text-center border hover:opacity-80 transition-opacity touch-manipulation"
                  style={{ color: "#FFFFFF", borderColor: "#FF6B2B" }}>
                  {isHe ? "\u05de\u05d6\u05d9\u05e0\u05d9\u05dd \u05d7\u05db\u05de\u05d9\u05dd" : "Smart Feeders"}
                </Link>
              </div>
              <div className={`flex flex-wrap gap-x-4 gap-y-1 text-xs ${isHe ? "justify-end" : ""}`} style={{ color: "#FF6B2B" }}>
                <span>\u2713 {isHe ? "\u05de\u05e9\u05dc\u05d5\u05d7 \u05d7\u05d9\u05e0\u05dd \u05de\u05e2\u05dc \u20aa149" : "Free shipping over \u20aa149"}</span>
                <span>\u2713 {isHe ? "14 \u05d9\u05d5\u05dd \u05d4\u05d7\u05d6\u05e8\u05d4" : "14-day returns"}</span>
                <span>\u2713 {isHe ? "\u05ea\u05de\u05d9\u05db\u05d4 \u05d1\u05e2\u05d1\u05e8\u05d9\u05ea" : "Hebrew support"}</span>
              </div>
            </div>
            <div className="relative" style={isHe ? { order: 1 } : undefined}>
              <div className="aspect-square overflow-hidden flex items-center justify-center" style={{ background: "#2D4270", borderRadius: 12 }}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={LOGO_URL} alt="TeqPet" className="w-3/4 h-3/4 object-contain" />
              </div>
              <div className={`absolute top-4 px-3 py-1.5 text-xs font-bold uppercase tracking-wide text-white ${isHe ? "right-4" : "left-4"}`}
                style={{ background: "#FF6B2B" }}>
                {isHe ? "\u05d7\u05d3\u05e9" : "New"}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Category grid */}
      <section className="py-14 px-4" style={{ background: "#F8F9FC" }}>
        <div className="max-w-7xl mx-auto">
          <h2 className="text-2xl font-bold mb-8" style={{ color: "#1B2A4A", textAlign: isHe ? "right" : "left" }}>
            {isHe ? "\u05e7\u05e0\u05d4 \u05dc\u05e4\u05d9 \u05e7\u05d8\u05d2\u05d5\u05e8\u05d9\u05d4" : "Shop by Category"}
          </h2>
          <div className="grid grid-cols-3 lg:grid-cols-9 gap-3">
            {categories.map((cat) => (
              <Link key={cat.slug} href={`/products?cat=${cat.slug}&lang=${locale}`}
                className="group flex flex-col items-center gap-2.5 p-4 border text-center hover:opacity-80 active:scale-[0.98] transition-all touch-manipulation"
                style={{ background: "#FFFFFF", borderColor: "#D0D8EC" }}>
                <span className="text-xl">&#128062;</span>
                <span className="text-xs font-medium leading-tight" style={{ color: "#1B2A4A" }}>{cat.label}</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Products live from Wix REST API via wix-site-id scoped to TeqPet */}
      <section className="py-14 px-4" style={{ background: "#FFFFFF" }}>
        <div className="max-w-7xl mx-auto">
          <div className={`flex items-center justify-between mb-8 ${isHe ? "flex-row-reverse" : ""}`}>
            <h2 className="text-2xl font-bold" style={{ color: "#1B2A4A" }}>
              {isHe ? "\u05d4\u05de\u05d5\u05e6\u05e8\u05d9\u05dd \u05e9\u05dc\u05e0\u05d5" : "Our Products"}
            </h2>
            <Link href={`/products?lang=${locale}`} className="text-xs font-semibold uppercase tracking-wide hover:opacity-70" style={{ color: "#FF6B2B" }}>
              {isHe ? "\u05db\u05dc \u05d4\u05de\u05d5\u05e6\u05e8\u05d9\u05dd \u2190" : "View All \u2192"}
            </Link>
          </div>
          {wixProducts.length === 0 ? (
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              {categories.slice(0, 4).map((cat) => (
                <Link key={cat.slug} href={`/products?cat=${cat.slug}&lang=${locale}`}
                  className="group border hover:shadow-md transition-all"
                  style={{ background: "#FFFFFF", borderColor: "#D0D8EC" }}>
                  <div className="aspect-square overflow-hidden flex items-center justify-center" style={{ background: "#F8F9FC" }}>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={LOGO_URL} alt={cat.label} className="w-3/4 h-3/4 object-contain" />
                  </div>
                  <div className={`p-4 ${isHe ? "text-right" : ""}`}>
                    <h3 className="font-semibold text-sm mb-2" style={{ color: "#1B2A4A" }}>{cat.label}</h3>
                    <span className="text-xs font-medium" style={{ color: "#FF6B2B" }}>{isHe ? "\u05dc\u05e7\u05d8\u05d2\u05d5\u05e8\u05d9\u05d4 \u2190" : "Browse \u2192"}</span>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              {wixProducts.slice(0, 8).map((p, i) => {
                const img = p.mainImageUrl ?? LOGO_URL;
                const price = p.priceFormatted ?? "";
                return (
                  <Link key={`${p.id}-${i}`} href={`/products/${p.slug}?lang=${locale}`}
                    className="group border hover:shadow-md active:scale-[0.98] transition-all touch-manipulation"
                    style={{ background: "#FFFFFF", borderColor: "#D0D8EC" }}>
                    <div className="relative aspect-square overflow-hidden" style={{ background: "#F8F9FC" }}>
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={img} alt={p.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                      <WishlistButton />
                    </div>
                    <div className={`p-4 ${isHe ? "text-right" : ""}`}>
                      <h3 className="font-semibold text-sm mb-2 leading-snug" style={{ color: "#1A1A1A" }}>
                        {p.name}
                      </h3>
                      <span className="font-bold text-sm" style={{ color: "#FF6B2B" }}>{price}</span>
                    </div>
                  </Link>
                );
              })}
            </div>
          )}
        </div>
      </section>

      {/* Trust strip */}
      <section className="py-10 px-4 border-t" style={{ background: "#F8F9FC", borderColor: "#D0D8EC" }}>
        <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
          {trustItems.map(item => (
            <div key={String(item.label)} className="flex flex-col items-center gap-2 p-3">
              <span className="flex items-center justify-center w-10 h-10 rounded-full text-lg" style={{ background: "#FFE8DC", color: "#FF6B2B" }}>
                {item.icon}
              </span>
              <span className="text-xs font-semibold" style={{ color: "#1B2A4A" }}>{item.label}</span>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
