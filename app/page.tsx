export const dynamic = "force-dynamic";
import Link from "next/link";
import WishlistButton from "@/components/WishlistButton";
import { getWixServerClient } from "@/lib/wix-client";
import { getLocale } from "@/lib/locale";
import { t } from "@/lib/translations";
import { WE_CONFIG, ilsFromUsd, TEQPET_LOGO_URL } from "@/lib/config";

const LOGO_URL = TEQPET_LOGO_URL;

type AnyProduct = {
  _id?: string | null; name?: string | null; slug?: string | null;
  description?: string | null; priceData?: { formatted?: { price?: string | null } | null } | null;
  media?: { mainMedia?: { image?: { url?: string | null } | null } | null } | null;
};

async function fetchProducts(): Promise<AnyProduct[]> {
  try {
    const c = await getWixServerClient();
    const r = await c.products.queryProducts().find();
    return r.items.length > 0 ? r.items as AnyProduct[] : [];
  } catch { return []; }
}

// 9 TeqPet product categories
const TEQPET_CATEGORIES_HE = [
  { label: "מזינים חכמים",    slug: "smart-feeders" },
  { label: "מזרקות מים",     slug: "water-fountains" },
  { label: "GPS ומעקב",      slug: "gps-tracking" },
  { label: "צעצועים חכמים",  slug: "smart-toys" },
  { label: "טיפוח טכנולוגי", slug: "tech-grooming" },
  { label: "אביזרי טיפוח",   slug: "grooming-accessories" },
  { label: "אביזרי טיול",    slug: "travel-accessories" },
  { label: "מצלמות חיות",    slug: "pet-cameras" },
  { label: "מוניטורי פעילות", slug: "activity-monitors" },
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
  { icon: "🔒", label: "תשלום מאובטח" },
  { icon: "↩", label: "14 יום החזרה" },
  { icon: "📄", label: "חשבונית מס" },
  { icon: "💬", label: "תמיכה בעברית" },
];
const TRUST_ITEMS_EN = [
  { icon: "🔒", label: "Secure payment" },
  { icon: "↩", label: "14-day returns" },
  { icon: "📄", label: "Tax invoice" },
  { icon: "💬", label: "Support in Hebrew" },
];

export default async function HomePage() {
  const locale = await getLocale();
  const isHe = locale === "he";
  const wixProducts = await fetchProducts();

  const displayProducts = wixProducts.length > 0 ? wixProducts : [];
  const categories = isHe ? TEQPET_CATEGORIES_HE : TEQPET_CATEGORIES_EN;
  const trustItems = isHe ? TRUST_ITEMS_HE : TRUST_ITEMS_EN;

  const tagline = isHe
    ? "הטכנולוגיה שחיות המחמד אוהבות"
    : "The technology pets love";
  const heroSub = isHe
    ? "מזינים חכמים, מזרקות, GPS, צעצועים אינטראקטיביים ועוד — כל הטק לחיות המחמד שלך במקום אחד."
    : "Smart feeders, water fountains, GPS trackers, interactive toys and more — all the pet tech you need in one place.";

  return (
    <div style={{ background: "#FFFFFF" }}>

      {/* Hero */}
      <section className="px-4 py-20 md:py-28" style={{ background: "#1B2A4A" }}>
        <div className="max-w-7xl mx-auto">
          <div className={`grid grid-cols-1 md:grid-cols-2 gap-12 items-center`}>
            <div className={isHe ? "text-right" : ""} style={isHe ? { order: 2 } : undefined}>
              <p className="text-xs uppercase tracking-widest mb-4 font-medium" style={{ color: "#FF6B2B" }}>
                {isHe ? "חנות הטק המובילה לחיות מחמד בישראל" : "Israel's #1 pet tech store"}
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
                  className="inline-block px-8 py-4 text-sm font-semibold uppercase tracking-wide text-center text-[#1B2A4A] hover:opacity-90 transition-opacity touch-manipulation"
                  style={{ background: "#FF6B2B", color: "#FFFFFF" }}>
                  {isHe ? "לכל המוצרים" : "Shop Now"}
                </Link>
                <Link href={`/products?cat=smart-feeders&lang=${locale}`}
                  className="inline-block px-8 py-4 text-sm font-semibold uppercase tracking-wide text-center border hover:opacity-80 transition-opacity touch-manipulation"
                  style={{ color: "#FFFFFF", borderColor: "#FF6B2B" }}>
                  {isHe ? "מזינים חכמים" : "Smart Feeders"}
                </Link>
              </div>
              <div className={`flex flex-wrap gap-x-4 gap-y-1 text-xs ${isHe ? "justify-end" : ""}`} style={{ color: "#FF6B2B" }}>
                <span>✓ {isHe ? "משלוח חינם מעל ₪149" : "Free shipping over ₪149"}</span>
                <span>✓ {isHe ? "14 יום החזרה" : "14-day returns"}</span>
                <span>✓ {isHe ? "תמיכה בעברית" : "Hebrew support"}</span>
              </div>
            </div>
            {/* Hero image — TeqPet logo on navy */}
            <div className="relative" style={isHe ? { order: 1 } : undefined}>
              <div className="aspect-square overflow-hidden flex items-center justify-center" style={{ background: "#2D4270", borderRadius: 12 }}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={LOGO_URL}
                  alt="TeqPet"
                  className="w-3/4 h-3/4 object-contain"
                />
              </div>
              <div className={`absolute top-4 px-3 py-1.5 text-xs font-bold uppercase tracking-wide text-white ${isHe ? "right-4" : "left-4"}`}
                style={{ background: "#FF6B2B" }}>
                {isHe ? "חדש" : "New"}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Category grid */}
      <section className="py-14 px-4" style={{ background: "#F8F9FC" }}>
        <div className="max-w-7xl mx-auto">
          <h2 className="text-2xl font-bold mb-8" style={{ color: "#1B2A4A", textAlign: isHe ? "right" : "left" }}>
            {isHe ? "קנה לפי קטגוריה" : "Shop by Category"}
          </h2>
          <div className="grid grid-cols-3 lg:grid-cols-9 gap-3">
            {categories.map((cat) => (
              <Link key={cat.slug} href={`/products?cat=${cat.slug}&lang=${locale}`}
                className="group flex flex-col items-center gap-2.5 p-4 border text-center hover:opacity-80 active:scale-[0.98] transition-all touch-manipulation"
                style={{ background: "#FFFFFF", borderColor: "#D0D8EC" }}>
                <span className="text-xl">🐾</span>
                <span className="text-xs font-medium leading-tight" style={{ color: "#1B2A4A" }}>{cat.label}</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Best sellers — live Wix products */}
      <section className="py-14 px-4" style={{ background: "#FFFFFF" }}>
        <div className="max-w-7xl mx-auto">
          <div className={`flex items-center justify-between mb-8 ${isHe ? "flex-row-reverse" : ""}`}>
            <h2 className="text-2xl font-bold" style={{ color: "#1B2A4A" }}>
              {isHe ? "המוצרים שלנו" : "Our Products"}
            </h2>
            <Link href={`/products?lang=${locale}`} className="text-xs font-semibold uppercase tracking-wide hover:opacity-70" style={{ color: "#FF6B2B" }}>
              {isHe ? "כל המוצרים ←" : "View All →"}
            </Link>
          </div>
          {displayProducts.length === 0 ? (
            <div className={`grid grid-cols-2 lg:grid-cols-4 gap-4`}>
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
                    <span className="text-xs font-medium" style={{ color: "#FF6B2B" }}>{isHe ? "לקטגוריה ←" : "Browse →"}</span>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className={`grid gap-4 ${displayProducts.length === 1 ? "grid-cols-1 max-w-xs mx-auto" : "grid-cols-2 lg:grid-cols-4"}`}>
              {displayProducts.slice(0, 8).map((p, i) => {
                const img = p.media?.mainMedia?.image?.url ?? LOGO_URL;
                const rawPrice = p.priceData?.formatted?.price ?? "";
                const price = isHe ? ilsFromUsd(rawPrice) : rawPrice;
                return (
                  <Link key={`${p._id}-${i}`} href={`/products/${p.slug ?? "products"}?lang=${locale}`}
                    className="group border hover:shadow-md active:scale-[0.98] transition-all touch-manipulation"
                    style={{ background: "#FFFFFF", borderColor: "#D0D8EC" }}>
                    <div className="relative aspect-square overflow-hidden" style={{ background: "#F8F9FC" }}>
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={img} alt={p.name ?? "Product"} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
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
