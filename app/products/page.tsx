export const dynamic = "force-dynamic";
import Link from "next/link";
import { getWixServerClient } from "@/lib/wix-client";
import { getLocale } from "@/lib/locale";
import { t } from "@/lib/translations";
import { ilsFromUsd, WE_CONFIG } from "@/lib/config";

const FALLBACK_IMGS = WE_CONFIG.PRODUCT_IMAGES;

type AnyProduct = {
  _id?: string | null; name?: string | null; slug?: string | null;
  description?: string | null; priceData?: { formatted?: { price?: string | null } | null } | null;
  media?: { mainMedia?: { image?: { url?: string | null } | null } | null } | null;
};

const FALLBACK: AnyProduct = {
  _id: "siptail-1", name: "SipTail Trail Bottle", slug: "siptail-trail-bottle",
  description: "520ml squeeze-to-fill bottle. BPA-free, leak-proof, 180g.",
  priceData: { formatted: { price: "$24.99" } },
  media: { mainMedia: { image: { url: FALLBACK_IMGS[0] } } },
};
const FALLBACK_HE: AnyProduct = {
  ...FALLBACK,
  name: "בקבוק מים SipTail לכלבים",
  description: "בקבוק המים הנייד המושלם לטיולים. 520 מ״ל, קערת סיליקון מתקפלת.",
};

async function fetchProducts(): Promise<{ products: AnyProduct[]; isLive: boolean }> {
  try {
    const c = await getWixServerClient();
    const r = await c.products.queryProducts().find();
    return r.items.length > 0 ? { products: r.items as AnyProduct[], isLive: true } : { products: [], isLive: false };
  } catch { return { products: [], isLive: false }; }
}

export default async function ProductsPage() {
  const locale = await getLocale();
  const isHe = locale === "he";
  const { products, isLive } = await fetchProducts();
  const fallback = isHe ? FALLBACK_HE : FALLBACK;
  const displayProducts = isLive ? products : [fallback];

  return (
    <div style={{ background: "#F5F4F0" }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className={`flex items-center justify-between mb-8 ${isHe ? "flex-row-reverse" : ""}`}>
          <h1 className="text-3xl font-bold" style={{ fontFamily: "Georgia, serif", color: "#1A1A1A" }}>
            {isHe ? "כל המוצרים" : "All Products"}
          </h1>
          {!isLive && (
            <span className="text-xs px-3 py-1 border" style={{ borderColor: "#D4E6D4", color: "#4A7C59", background: "#F0FAF0" }}>
              {isHe ? "תצוגה מקדימה" : "Preview"}
            </span>
          )}
        </div>

        <div className={`grid gap-4 ${displayProducts.length === 1 ? "grid-cols-1 max-w-sm" : "grid-cols-2 lg:grid-cols-4"}`}>
          {displayProducts.map((p, i) => {
            const img = p.media?.mainMedia?.image?.url ?? FALLBACK_IMGS[i % FALLBACK_IMGS.length];
            const rawPrice = p.priceData?.formatted?.price ?? "$24.99";
            const price = isHe ? ilsFromUsd(rawPrice) : rawPrice;
            return (
              <Link key={p._id ?? i} href={`/products/${p.slug ?? "siptail-trail-bottle"}?lang=${locale}`}
                className="group border hover:shadow-md active:scale-[0.98] transition-all touch-manipulation"
                style={{ background: "#FFFFFF", borderColor: "#D4E6D4" }}>
                <div className="aspect-square overflow-hidden" style={{ background: "#F5F4F0" }}>
                  <img src={img} alt={p.name ?? "Product"} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                </div>
                <div className={`p-4 ${isHe ? "text-right" : ""}`}>
                  <h2 className="font-semibold text-sm mb-2 line-clamp-2" style={{ fontFamily: isHe ? "Noto Serif Hebrew, Georgia, serif" : "Georgia, serif", color: "#1A1A1A" }}>
                    {isHe && p._id === "siptail-1" ? "בקבוק מים SipTail לכלבים" : p.name}
                  </h2>
                  {/* WE-02: No fake ratings */}
                  <span className="font-bold text-sm" style={{ color: "#1B4332" }}>{isHe ? `מחיר: ${price}` : `From ${price}`}</span>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}
