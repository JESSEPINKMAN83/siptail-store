export const dynamic = "force-dynamic";
import Link from "next/link";
import WishlistButton from "@/components/WishlistButton";
import { getWixServerClient } from "@/lib/wix-client";
import { getLocale } from "@/lib/locale";
import { t } from "@/lib/translations";
import { WE_CONFIG, ilsFromUsd } from "@/lib/config";

type AnyProduct = {
  _id?: string | null; name?: string | null; slug?: string | null;
  description?: string | null; priceData?: { formatted?: { price?: string | null } | null } | null;
  media?: { mainMedia?: { image?: { url?: string | null } | null } | null } | null;
};

// WE-01: Real product photos (CJ CJJJCWGY00675 — portable dog water bottle)
// TODO: Replace with official CJ CDN URLs once direct access is available
const PRODUCT_PHOTOS = WE_CONFIG.PRODUCT_IMAGES;

const PRODUCT_EN: AnyProduct = {
  _id: "siptail-1", name: "SipTail Trail Bottle", slug: "siptail-trail-bottle",
  description: "520ml squeeze-to-fill bottle with a silicone leaf-bowl. BPA-free, leak-proof, 180g.",
  priceData: { formatted: { price: "$24.99" } },
  media: { mainMedia: { image: { url: PRODUCT_PHOTOS[0] } } },
};
const PRODUCT_HE: AnyProduct = {
  _id: "siptail-1", name: "בקבוק מים SipTail לכלבים", slug: "siptail-trail-bottle",
  description: "בקבוק המים הנייד המושלם לטיולים. 520 מ״ל, קערת סיליקון מתקפלת, חסין דליפות, 180 גרם.",
  priceData: { formatted: { price: "$24.99" } },
  media: { mainMedia: { image: { url: PRODUCT_PHOTOS[0] } } },
};

// WE-03: Inline SVG category icons — no font dependency
const CATEGORY_ICONS = {
  hydration: (<svg viewBox="0 0 24 24" fill="none" stroke="#1B4332" strokeWidth={1.8} className="w-6 h-6"><path strokeLinecap="round" strokeLinejoin="round" d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2z"/><path strokeLinecap="round" strokeLinejoin="round" d="M8 12h8M12 8v8"/></svg>),
  trail: (<svg viewBox="0 0 24 24" fill="none" stroke="#1B4332" strokeWidth={1.8} className="w-6 h-6"><path strokeLinecap="round" strokeLinejoin="round" d="M3 20l4-8 4 4 4-8 4 8"/></svg>),
  safety: (<svg viewBox="0 0 24 24" fill="none" stroke="#1B4332" strokeWidth={1.8} className="w-6 h-6"><path strokeLinecap="round" strokeLinejoin="round" d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>),
  walk: (<svg viewBox="0 0 24 24" fill="none" stroke="#1B4332" strokeWidth={1.8} className="w-6 h-6"><circle cx="12" cy="5" r="2"/><path strokeLinecap="round" strokeLinejoin="round" d="M9 12l-2 6m5-6l2 6m-5-6l1-4 3 2 2-4"/></svg>),
  sport: (<svg viewBox="0 0 24 24" fill="none" stroke="#1B4332" strokeWidth={1.8} className="w-6 h-6"><path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z"/></svg>),
  gift: (<svg viewBox="0 0 24 24" fill="none" stroke="#1B4332" strokeWidth={1.8} className="w-6 h-6"><path strokeLinecap="round" strokeLinejoin="round" d="M20 12v10H4V12M22 7H2v5h20V7zM12 22V7M12 7H7.5a2.5 2.5 0 010-5C11 2 12 7 12 7zM12 7h4.5a2.5 2.5 0 000-5C13 2 12 7 12 7z"/></svg>),
};

// WE-03: Inline SVG trust icons
const TRUST_ICONS = {
  secure: (<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/><path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4"/></svg>),
  returns: (<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M3 10h10a8 8 0 018 8v2M3 10l4-4M3 10l4 4"/></svg>),
  invoice: (<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M9 14h6M9 10h6M17 21H7a2 2 0 01-2-2V5a2 2 0 012-2h7l5 5v11a2 2 0 01-2 2z"/></svg>),
  support: (<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"/></svg>),
};

async function fetchProducts(): Promise<AnyProduct[]> {
  try {
    const c = await getWixServerClient();
    const r = await c.products.queryProducts().find();
    return r.items.length > 0 ? r.items as AnyProduct[] : [];
  } catch { return []; }
}

export default async function HomePage() {
  const locale = await getLocale();
  const isHe = locale === "he";
  const wixProducts = await fetchProducts();
  const fallback = isHe ? PRODUCT_HE : PRODUCT_EN;

  // WE-02: Show 1 product when catalogue has 1 item; fill from Wix when more exist
  const displayProducts = wixProducts.length > 0 ? wixProducts : [fallback];

  const priceIls = ilsFromUsd(fallback.priceData?.formatted?.price ?? "$24.99");
  const priceFrom = isHe ? `מחיר החל מ ${priceIls}` : `From ${priceIls}`;

  const categories = [
    { icon: CATEGORY_ICONS.hydration, label: isHe ? "הידרציה" : "Hydration", href: `/products?cat=hydration&lang=${locale}` },
    { icon: CATEGORY_ICONS.trail, label: isHe ? "טיול וטרקים" : "Trail & Hike", href: `/products?cat=trail-hike&lang=${locale}` },
    { icon: CATEGORY_ICONS.safety, label: isHe ? "בטיחות" : "Dog Safety", href: `/products?cat=dog-safety&lang=${locale}` },
    { icon: CATEGORY_ICONS.walk, label: isHe ? "ציוד הליכה" : "Walk Gear", href: `/products?cat=walk-gear&lang=${locale}` },
    { icon: CATEGORY_ICONS.sport, label: isHe ? "ספורט" : "Active & Sport", href: `/products?cat=active&lang=${locale}` },
    { icon: CATEGORY_ICONS.gift, label: isHe ? "מתנות" : "Gift Ideas", href: `/products?cat=gifts&lang=${locale}` },
  ];

  const trustItems = [
    { icon: TRUST_ICONS.secure, label: t(locale, "trust.securePayment") },
    { icon: TRUST_ICONS.returns, label: t(locale, "trust.returns") },
    { icon: TRUST_ICONS.invoice, label: t(locale, "trust.invoice") },
    { icon: TRUST_ICONS.support, label: t(locale, "trust.hebrewSupport") },
  ];

  return (
    <div style={{ background: "#F5F4F0" }}>

      {/* Hero — WE-20 additions below CTAs */}
      <section className="px-4 py-20 md:py-28">
        <div className="max-w-7xl mx-auto">
          <div className={`grid grid-cols-1 md:grid-cols-2 gap-12 items-center ${isHe ? "md:direction-rtl" : ""}`}>
            <div className={isHe ? "text-right" : ""}>
              <p className="text-xs uppercase tracking-widest mb-4 font-medium" style={{ color: "#1B4332" }}>
                {isHe ? "קולקציית העונה החדשה" : "New season collection"}
              </p>
              <h1 className="text-5xl md:text-6xl font-bold leading-tight mb-6"
                style={{ fontFamily: isHe ? "Noto Serif Hebrew, Georgia, serif" : "Georgia, 'Times New Roman', serif", color: "#1B4332" }}>
                {t(locale, "hero_headline")}
              </h1>
              <p className="text-lg mb-8 max-w-md leading-relaxed" style={{ color: "#1A1A1A" }}>
                {t(locale, "hero_sub")}
              </p>
              <div className={`flex flex-col sm:flex-row gap-3 mb-6 ${isHe ? "sm:flex-row-reverse" : ""}`}>
                <Link href={`/products?lang=${locale}`}
                  className="inline-block px-8 py-4 text-sm font-semibold uppercase tracking-wide text-center text-white hover:opacity-90 transition-opacity touch-manipulation"
                  style={{ background: "#1B4332" }}>
                  {t(locale, "hero_cta")}
                </Link>
                <Link href={`/products/siptail-trail-bottle?lang=${locale}`}
                  className="inline-block px-8 py-4 text-sm font-semibold uppercase tracking-wide text-center border hover:opacity-80 transition-opacity touch-manipulation"
                  style={{ color: "#1B4332", borderColor: "#1B4332" }}>
                  {t(locale, "hero_sub_cta")}
                </Link>
              </div>
              {/* WE-20: trust proof points below CTAs */}
              <div className={`flex flex-wrap gap-x-4 gap-y-1 text-xs ${isHe ? "justify-end" : ""}`} style={{ color: "#4A7C59" }}>
                <span>✓ {t(locale, "shipping.freeThreshold")}</span>
                <span>✓ {priceFrom}</span>
                <span>✓ {t(locale, "shipping.leadTime")}</span>
              </div>
            </div>
            <div className="relative">
              <div className="aspect-square overflow-hidden" style={{ background: "#FFFFFF" }}>
                <img
                  src={PRODUCT_PHOTOS[0]}
                  alt={isHe ? "בקבוק מים לכלבים SipTail Trail" : "SipTail Trail dog water bottle"}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className={`absolute top-4 px-3 py-1.5 text-xs font-bold uppercase tracking-wide text-white ${isHe ? "right-4" : "left-4"}`}
                style={{ background: "#1B4332" }}>
                {t(locale, "new_arrival")}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Category grid — WE-03 real SVG icons */}
      <section className="py-14 px-4" style={{ background: "#FFFFFF" }}>
        <div className="max-w-7xl mx-auto">
          <h2 className="text-2xl font-bold mb-8" style={{ fontFamily: "Georgia, serif", color: "#1A1A1A" }}>
            {t(locale, "shop_by_category")}
          </h2>
          <div className="grid grid-cols-3 lg:grid-cols-6 gap-3">
            {categories.map((cat) => (
              <Link key={cat.label} href={cat.href}
                className="group flex flex-col items-center gap-2.5 p-4 border text-center hover:opacity-80 active:scale-[0.98] transition-all touch-manipulation"
                style={{ background: "#F5F4F0", borderColor: "#D4E6D4" }}>
                <span className="flex items-center justify-center">{cat.icon}</span>
                <span className="text-xs font-medium leading-tight" style={{ color: "#1A1A1A" }}>{cat.label}</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* WE-02: Best sellers — show real products, 1 if only 1 exists, NO fake ratings */}
      <section className="py-14 px-4" style={{ background: "#F5F4F0" }}>
        <div className="max-w-7xl mx-auto">
          <div className={`flex items-center justify-between mb-8 ${isHe ? "flex-row-reverse" : ""}`}>
            <h2 className="text-2xl font-bold" style={{ fontFamily: "Georgia, serif", color: "#1A1A1A" }}>
              {t(locale, "best_sellers")}
            </h2>
            <Link href={`/products?lang=${locale}`} className="text-xs font-semibold uppercase tracking-wide hover:opacity-70" style={{ color: "#1B4332" }}>
              {t(locale, "view_all")} {isHe ? "←" : "→"}
            </Link>
          </div>
          {/* WE-02: Grid is 1 col when 1 product, 2-4 when more */}
          <div className={`grid gap-4 ${displayProducts.length === 1 ? "grid-cols-1 max-w-xs mx-auto" : "grid-cols-2 lg:grid-cols-4"}`}>
            {displayProducts.slice(0, 4).map((p, i) => {
              const img = p.media?.mainMedia?.image?.url ?? PRODUCT_PHOTOS[i % PRODUCT_PHOTOS.length];
              const rawPrice = p.priceData?.formatted?.price ?? "$24.99";
              const price = isHe ? ilsFromUsd(rawPrice) : rawPrice;
              return (
                <Link key={`${p._id}-${i}`} href={`/products/${p.slug ?? "siptail-trail-bottle"}?lang=${locale}`}
                  className="group border hover:shadow-md active:scale-[0.98] transition-all touch-manipulation"
                  style={{ background: "#FFFFFF", borderColor: "#D4E6D4" }}>
                  <div className="relative aspect-square overflow-hidden" style={{ background: "#F5F4F0" }}>
                    <img src={img} alt={p.name ?? "Product"} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                    <WishlistButton />
                  </div>
                  <div className={`p-4 ${isHe ? "text-right" : ""}`}>
                    <h3 className="font-semibold text-sm mb-2 leading-snug"
                      style={{ fontFamily: isHe ? "Noto Serif Hebrew, Georgia, serif" : "Georgia, serif", color: "#1A1A1A" }}>
                      {isHe && p._id === "siptail-1" ? "בקבוק מים SipTail לכלבים" : p.name}
                    </h3>
                    {/* WE-02: NO fake star ratings — removed entirely */}
                    <span className="font-bold text-sm" style={{ color: "#1B4332" }}>{price}</span>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* WE-03: Trust strip with real inline SVG icons */}
      <section className="py-10 px-4 border-t" style={{ background: "#FFFFFF", borderColor: "#D4E6D4" }}>
        <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
          {trustItems.map(item => (
            <div key={String(item.label)} className="flex flex-col items-center gap-2 p-3">
              <span className="flex items-center justify-center w-10 h-10 rounded-full" style={{ background: "#D4E6D4", color: "#1B4332" }}>
                {item.icon}
              </span>
              <span className="text-xs font-semibold" style={{ color: "#1A1A1A" }}>{item.label}</span>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
