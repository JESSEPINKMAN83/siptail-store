export const dynamic = "force-dynamic";
import { getWixServerClient } from "@/lib/wix-client";
import { getLocale } from "@/lib/locale";
import { t } from "@/lib/translations";
import { ilsFromUsd, WE_CONFIG, getWhatsAppUrl, SIPTAIL_PRODUCT_ID } from "@/lib/config";
import ProductPageClient from "@/components/ProductPageClient";
import Link from "next/link";

const PHOTOS = WE_CONFIG.PRODUCT_IMAGES;

type AnyVariant = {
  _id?: string | null; id?: string | null;
  choices?: Record<string, string> | null;
  variant?: { priceData?: { formatted?: { price?: string | null } | null } | null } | null;
  price?: { actualPrice?: { amount?: string | null } | null } | null;
  sku?: string | null;
};
type AnyProduct = {
  _id?: string | null; id?: string | null; name?: string | null; slug?: string | null;
  description?: string | null; plainDescription?: string | null;
  priceData?: { formatted?: { price?: string | null } | null } | null;
  actualPriceRange?: { minValue?: string | null } | null;
  variants?: AnyVariant[] | null;
  variantsInfo?: { variants?: AnyVariant[] | null } | null;
  media?: { mainMedia?: { image?: { url?: string | null } | null } | null; items?: { image?: { url?: string | null } | null }[] | null } | null;
};

// Fallback used only if Wix API is unreachable
const FALLBACK_EN: AnyProduct = {
  _id: SIPTAIL_PRODUCT_ID,
  name: "SipTail Trail Bottle",
  slug: "siptail-trail-bottle",
  plainDescription: "The perfect portable water bottle for walks and hikes with your dog. Squeeze-to-fill, leak-proof, BPA-free.",
  variantsInfo: { variants: [
    { id: "b3e03437-f927-469b-838c-f97ac95f1113", choices: { Size: "Small 350ml" }, price: { actualPrice: { amount: "24.99" } } },
    { id: "f0acd754-f579-44a6-bc49-48338a21d3fd", choices: { Size: "Medium 500ml" }, price: { actualPrice: { amount: "29.99" } } },
    { id: "aee61163-df5c-4ae3-bdd1-acdc07806f39", choices: { Size: "Large 750ml" }, price: { actualPrice: { amount: "34.99" } } },
  ]},
  media: null,
};
const FALLBACK_HE: AnyProduct = {
  ...FALLBACK_EN,
  name: "בקבוק מים SipTail לכלבים",
  plainDescription: "נפח: 500 מ\u05F3ל · משקל: 180 גרם · חומר: HDPE בדרגת מזון, נטול BPA.\n\nכל טיול טוב מתחיל בהכנה נכונה. בקבוק SipTail Trail — קל, אטום לחלוטין, ומחזיק 500 מ\u05F3ל שיספיקו לכם ולכלב לאורך כל השביל.",
  variantsInfo: { variants: [
    { id: "b3e03437-f927-469b-838c-f97ac95f1113", choices: { Size: "קטן (350 מ\u05F3ל)" }, price: { actualPrice: { amount: "24.99" } } },
    { id: "f0acd754-f579-44a6-bc49-48338a21d3fd", choices: { Size: "בינוני (500 מ\u05F3ל)" }, price: { actualPrice: { amount: "29.99" } } },
    { id: "aee61163-df5c-4ae3-bdd1-acdc07806f39", choices: { Size: "גדול (750 מ\u05F3ל)" }, price: { actualPrice: { amount: "34.99" } } },
  ]},
};

async function fetchProduct(slug: string): Promise<AnyProduct | null> {
  try {
    const c = await getWixServerClient();
    // Try v3 first via slug
    const res = await fetch(`https://www.wixapis.com/stores/v3/products/slug/${encodeURIComponent(slug)}`, {
      headers: { "Content-Type": "application/json" },
      next: { revalidate: 60 },
    });
    if (res.ok) {
      const data = await res.json();
      return (data.product as AnyProduct) ?? null;
    }
    // Fallback: use @wix/stores SDK
    const r = await c.products.queryProducts().eq("slug", slug).find();
    return (r.items[0] as AnyProduct) ?? null;
  } catch { return null; }
}

function getVariantId(v: AnyVariant): string {
  return (v.id ?? v._id ?? "").toString();
}

function getVariantPrice(v: AnyVariant): string {
  return v.price?.actualPrice?.amount
    ?? v.variant?.priceData?.formatted?.price
    ?? "";
}

export default async function ProductDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const locale = await getLocale();
  const isHe = locale === "he";

  const wixProduct = await fetchProduct(slug);
  // Always use real product ID — fallback only if API is down
  const p: AnyProduct = wixProduct ?? (isHe ? FALLBACK_HE : FALLBACK_EN);

  // Build image array — real Wix images first, then Unsplash
  const images: string[] = [];
  if (p.media?.mainMedia?.image?.url) images.push(p.media.mainMedia.image.url);
  if (p.media?.items) {
    for (const item of p.media.items) {
      if (item.image?.url && !images.includes(item.image.url)) images.push(item.image.url);
    }
  }
  while (images.length < 4) images.push(PHOTOS[images.length % PHOTOS.length]);

  // Variants — prefer variantsInfo (v3 API) then variants (v1 SDK)
  const rawVariants: AnyVariant[] = p.variantsInfo?.variants ?? (p as { variants?: AnyVariant[] }).variants ?? [];

  const baseRawPrice = getVariantPrice(rawVariants[0]) || "24.99";
  const basePrice = isHe ? ilsFromUsd(`$${baseRawPrice}`) : `$${baseRawPrice}`;

  const displayVariants = rawVariants.map(v => ({
    id: getVariantId(v),
    label: Object.values(v.choices ?? {}).join(" / "),
    price: isHe
      ? ilsFromUsd(`$${getVariantPrice(v)}`)
      : `$${getVariantPrice(v)}`,
    rawPrice: getVariantPrice(v),
  }));

  // Real product ID — from Wix or from our known fallback
  const productId = (p._id ?? p.id ?? SIPTAIL_PRODUCT_ID) as string;

  const description = p.plainDescription ?? (p as { description?: string }).description ?? "";

  return (
    <div style={{ background: "#F5F4F0" }}>
      {/* Breadcrumb */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4 pb-2">
        <nav
          className={`flex items-center gap-2 text-xs flex-wrap ${isHe ? "flex-row-reverse" : ""}`}
          aria-label="breadcrumb"
        >
          <Link href={`/?lang=${locale}`} className="hover:text-[#1B4332] transition-colors" style={{ color: "#6B7280" }}>
            {isHe ? "בית" : "Home"}
          </Link>
          <span style={{ color: "#D4E6D4" }}>{isHe ? "‹" : "›"}</span>
          <Link href={`/products?lang=${locale}`} className="hover:text-[#1B4332] transition-colors" style={{ color: "#6B7280" }}>
            {isHe ? "חנות" : "Shop"}
          </Link>
          <span style={{ color: "#D4E6D4" }}>{isHe ? "‹" : "›"}</span>
          <span style={{ color: "#1A1A1A" }}>{p.name}</span>
        </nav>
      </div>

      {/* Shipping contract — above the fold */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-0">
        <div
          className={`flex flex-wrap gap-4 text-xs py-3 border-b ${isHe ? "flex-row-reverse text-right" : ""}`}
          style={{ borderColor: "#D4E6D4", color: "#4A7C59" }}
        >
          <span>
            <strong style={{ color: "#1B4332" }}>{t(locale, "shipping.homeDelivery")}</strong>
            {" · "}
            {t(locale, "shipping.businessDays")}
            {" · "}
            {t(locale, "shipping.belowThreshold")}
            {" · "}
            {t(locale, "shipping.aboveThreshold")}
          </span>
          <span style={{ color: "#6B7280" }}>{t(locale, "shipping.leadTime")}</span>
        </div>
      </div>

      {/* Main product */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 pb-32 md:pb-10">
        <ProductPageClient
          product={{
            id: productId,
            name: p.name ?? "SipTail Trail Bottle",
            slug: p.slug ?? slug,
            description,
            basePrice,
            isLive: true, // always true — real product ID is always used
            images,
            variants: displayVariants,
          }}
          locale={locale}
          waUrl={getWhatsAppUrl(locale)}
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
