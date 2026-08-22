export const dynamic = "force-dynamic";
import { getWixServerClient } from "@/lib/wix-client";
import { getLocale } from "@/lib/locale";
import { t } from "@/lib/translations";
import { ilsFromUsd, WE_CONFIG, getWhatsAppUrl } from "@/lib/config";
import ProductPageClient from "@/components/ProductPageClient";
import Link from "next/link";

const PHOTOS = WE_CONFIG.PRODUCT_IMAGES;

type AnyVariant = { _id?: string | null; choices?: Record<string, string> | null; variant?: { priceData?: { formatted?: { price?: string | null } | null } | null } | null };
type AnyProduct = { _id?: string | null; name?: string | null; slug?: string | null; description?: string | null; priceData?: { formatted?: { price?: string | null } | null } | null; variants?: AnyVariant[] | null; media?: { mainMedia?: { image?: { url?: string | null } | null } | null; items?: { image?: { url?: string | null } | null }[] | null } | null };

const FALLBACK_EN: AnyProduct = {
  _id: "siptail-1", name: "SipTail Trail Bottle", slug: "siptail-trail-bottle",
  description: "520ml squeeze-to-fill bottle with a silicone leaf-bowl. One-squeeze fills the bowl, release and unused water returns. BPA-free, food-grade materials. Leak-proof rotational lock. Adjustable carry strap.",
  priceData: { formatted: { price: "$24.99" } },
  variants: [
    { _id: "v1", choices: { Size: "Small (350ml)" }, variant: { priceData: { formatted: { price: "$24.99" } } } },
    { _id: "v2", choices: { Size: "Medium (520ml)" }, variant: { priceData: { formatted: { price: "$29.99" } } } },
    { _id: "v3", choices: { Size: "Large (750ml)" }, variant: { priceData: { formatted: { price: "$34.99" } } } },
  ],
  media: null,
};

// WE-16: Hebrew product description — native copy
const FALLBACK_HE: AnyProduct = {
  ...FALLBACK_EN,
  name: "בקבוק מים SipTail לכלבים",
  description: "נפח: 500 מ״ל · משקל: 180 גרם · חומר: HDPE בדרגת מזון, נטול BPA · אטימה: מכסה סיליקון אטום — לא נשפך בתיק\n\nכל טיול טוב מתחיל בהכנה נכונה. בקבוק SipTail Trail נועד בדיוק לזה — קל, אטום לחלוטין, ומחזיק 500 מ״ל שיספיקו לכם ולכלב לאורך כל השביל. שתייה קלה בלחיצה אחת, ניקוי בשנייה.",
  variants: [
    { _id: "v1", choices: { Size: "קטן (350 מ״ל)" }, variant: { priceData: { formatted: { price: "$24.99" } } } },
    { _id: "v2", choices: { Size: "בינוני (520 מ״ל)" }, variant: { priceData: { formatted: { price: "$29.99" } } } },
    { _id: "v3", choices: { Size: "גדול (750 מ״ל)" }, variant: { priceData: { formatted: { price: "$34.99" } } } },
  ],
};

async function fetchProduct(slug: string): Promise<AnyProduct | null> {
  try {
    const c = await getWixServerClient();
    const r = await c.products.queryProducts().eq("slug", slug).find();
    return (r.items[0] as AnyProduct) ?? null;
  } catch { return null; }
}

export default async function ProductDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const locale = await getLocale();
  const isHe = locale === "he";
  const wixProduct = await fetchProduct(slug);
  const p: AnyProduct = wixProduct ?? (isHe ? FALLBACK_HE : FALLBACK_EN);
  const isLive = !!wixProduct;

  // Build image array — WE-01: real photos
  const images: string[] = [];
  if (p.media?.mainMedia?.image?.url) images.push(p.media.mainMedia.image.url);
  if (p.media?.items) { for (const item of p.media.items) { if (item.image?.url && !images.includes(item.image.url)) images.push(item.image.url); } }
  // Fill with product photos if we don't have enough
  while (images.length < 4) images.push(PHOTOS[images.length % PHOTOS.length]);

  const variants = p.variants ?? [];
  const basePrice = p.priceData?.formatted?.price ?? variants[0]?.variant?.priceData?.formatted?.price ?? "$24.99";

  // WE-05: All prices in ₪ for Hebrew
  const displayVariants = variants.map(v => ({
    id: v._id ?? "",
    label: Object.values(v.choices ?? {}).join(" / "),
    price: isHe ? ilsFromUsd(v.variant?.priceData?.formatted?.price ?? basePrice) : (v.variant?.priceData?.formatted?.price ?? basePrice),
    rawPrice: v.variant?.priceData?.formatted?.price ?? basePrice,
  }));
  const displayBasePrice = isHe ? ilsFromUsd(basePrice) : basePrice;

  const waUrl = getWhatsAppUrl(locale);

  return (
    <div style={{ background: "#F5F4F0" }}>
      {/* Breadcrumb — WE-04: RTL */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4 pb-2">
        <nav className={`flex items-center gap-2 text-xs flex-wrap ${isHe ? "flex-row-reverse" : ""}`} aria-label="breadcrumb">
          <Link href={`/?lang=${locale}`} className="hover:text-[#1B4332] transition-colors" style={{ color: "#6B7280" }}>
            {isHe ? "בית" : "Home"}
          </Link>
          <span style={{ color: "#D4E6D4" }}>{isHe ? "←" : "/"}</span>
          <Link href={`/products?lang=${locale}`} className="hover:text-[#1B4332] transition-colors" style={{ color: "#6B7280" }}>
            {isHe ? "חנות" : "Shop"}
          </Link>
          <span style={{ color: "#D4E6D4" }}>{isHe ? "←" : "/"}</span>
          <span style={{ color: "#1A1A1A" }}>{isHe && p._id === "siptail-1" ? "בקבוק מים SipTail לכלבים" : p.name}</span>
        </nav>
      </div>

      {/* WE-11/12: Shipping contract + lead time — ABOVE the fold, BEFORE add to cart */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-0">
        <div className={`flex flex-wrap gap-4 text-xs py-3 border-b ${isHe ? "flex-row-reverse" : ""}`} style={{ borderColor: "#D4E6D4", color: "#4A7C59" }}>
          <span>
            <strong style={{ color: "#1B4332" }}>{t(locale, "shipping.homeDelivery")}</strong>
            {" · "}
            {t(locale, "shipping.businessDays")}
            {" · "}
            {t(locale, "shipping.belowThreshold")}
            {" · "}
            {t(locale, "shipping.aboveThreshold")}
          </span>
          <span style={{ color: "#6B7280" }}>
            {t(locale, "shipping.leadTime")}
          </span>
        </div>
      </div>

      {/* Main product */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 pb-32 md:pb-10">
        <ProductPageClient
          product={{
            id: p._id ?? "siptail-1",
            name: isHe && p._id === "siptail-1" ? "בקבוק מים SipTail לכלבים" : (p.name ?? "SipTail Trail Bottle"),
            slug: p.slug ?? slug,
            description: p.description ?? "",
            basePrice: displayBasePrice,
            isLive,
            images,
            variants: displayVariants,
          }}
          locale={locale}
          waUrl={waUrl}
          related={[
            { name: isHe ? "קערת נסיעות מתקפלת" : "Collapsible Dog Travel Bowl", price: isHe ? "₪67" : "$18", slug: "collapsible-dog-travel-bowl" },
            { name: isHe ? "בקבוק סיליקון מתקפל" : "Collapsible Silicone Bottle", price: isHe ? "₪81" : "$22", slug: "collapsible-silicone-bottle" },
            { name: isHe ? "מגבת קירור מיידית" : "Instant Cooling Towel", price: isHe ? "₪81" : "$22", slug: "cooling-towel" },
          ]}
        />
      </div>
    </div>
  );
}
