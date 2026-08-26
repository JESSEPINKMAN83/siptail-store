export const dynamic = "force-dynamic";
import { getWixServerClient } from "@/lib/wix-client";
import { getLocale } from "@/lib/locale";
import { t } from "@/lib/translations";
import { WE_CONFIG, getWhatsAppUrl } from "@/lib/config";
import { PRODUCTS, getProductBySlug, formatIls } from "@/lib/products";
import ProductPageClient from "@/components/ProductPageClient";
import Link from "next/link";
import { notFound } from "next/navigation";

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
  media?: {
    mainMedia?: { image?: { url?: string | null } | null } | null;
    items?: { image?: { url?: string | null } | null }[] | null;
  } | null;
};

async function fetchProduct(wixId: string, slug: string): Promise<AnyProduct | null> {
  try {
    const c = await getWixServerClient();
    // Try querying by slug first (most reliable)
    const r = await c.products.queryProducts().eq("slug", slug).find();
    if (r.items.length > 0) return r.items[0] as AnyProduct;
    // Fallback: query by id
    const r2 = await c.products.queryProducts().eq("_id", wixId).find();
    return (r2.items[0] as AnyProduct) ?? null;
  } catch {
    return null;
  }
}

function getVariantId(v: AnyVariant): string {
  return (v.id ?? v._id ?? "").toString();
}

function getVariantPrice(v: AnyVariant): string {
  return v.price?.actualPrice?.amount
    ?? v.variant?.priceData?.formatted?.price
    ?? "";
}

export default async function ProductDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const locale = await getLocale();
  const isHe = locale === "he";

  // Look up in our static catalog — 404 if slug is unknown
  const catalogEntry = getProductBySlug(slug);
  if (!catalogEntry) {
    notFound();
  }

  // Hebrew name from translations
  const hebrewName = t("he", `product.${slug}.name` as any) || slug;
  const englishName = t("en", `product.${slug}.name` as any) || slug;
  const displayName = isHe ? hebrewName : englishName;

  // Fetch live Wix product for image and description
  const wixProduct = await fetchProduct(catalogEntry.wixId, slug);

  // Build image array — real Wix images first, then brand fallbacks
  const images: string[] = [];
  if (wixProduct?.media?.mainMedia?.image?.url) {
    images.push(wixProduct.media.mainMedia.image.url);
  }
  if (wixProduct?.media?.items) {
    for (const item of wixProduct.media.items) {
      if (item.image?.url && !images.includes(item.image.url)) {
        images.push(item.image.url);
      }
    }
  }


  // Variants from Wix (if any), otherwise no variants
  const rawVariants: AnyVariant[] =
    (wixProduct as any)?.variantsInfo?.variants ??
    (wixProduct as any)?.variants ??
    [];

  // Price display — always use catalog ILS price as the authoritative price
  const ilsPrice = formatIls(catalogEntry.ils);
  const basePrice = isHe
    ? ilsPrice
    : `$${(catalogEntry.ils / 3.7).toFixed(2)}`;

  const displayVariants = rawVariants.map((v) => ({
    id: getVariantId(v),
    label: Object.values(v.choices ?? {}).join(" / "),
    price: basePrice,
    rawPrice: getVariantPrice(v),
  }));

  const description =
    (wixProduct as any)?.plainDescription ??
    (wixProduct as any)?.description ??
    "";

  const productId = wixProduct?._id ?? wixProduct?.id ?? catalogEntry.wixId;

  return (
    <div style={{ background: "#F5F4F0" }} dir={isHe ? "rtl" : "ltr"}>
      {/* Breadcrumb */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4 pb-2">
        <nav
          className="flex items-center gap-2 text-xs flex-wrap"
          style={{ justifyContent: isHe ? "flex-end" : "flex-start" }}
          aria-label="breadcrumb"
        >
          <Link
            href={`/?lang=${locale}`}
            className="hover:text-[#1B4332] transition-colors"
            style={{ color: "#6B7280" }}
          >
            {isHe ? "בית" : "Home"}
          </Link>
          <span style={{ color: "#D4E6D4" }}>{isHe ? "‹" : "›"}</span>
          <Link
            href={`/products?lang=${locale}`}
            className="hover:text-[#1B4332] transition-colors"
            style={{ color: "#6B7280" }}
          >
            {isHe ? "חנות" : "Shop"}
          </Link>
          <span style={{ color: "#D4E6D4" }}>{isHe ? "‹" : "›"}</span>
          <span style={{ color: "#1A1A1A" }}>{displayName}</span>
        </nav>
      </div>

      {/* Shipping contract — above the fold */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-0">
        <div
          className="flex flex-wrap gap-4 text-xs py-3 border-b"
          style={{
            borderColor: "#D4E6D4",
            color: "#4A7C59",
            flexDirection: isHe ? "row-reverse" : "row",
          }}
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
            id: productId as string,
            name: displayName,
            slug,
            description,
            basePrice,
            isLive: !!wixProduct,
            images,
            variants: displayVariants,
          }}
          locale={locale}
          waUrl={getWhatsAppUrl(locale)}
          related={PRODUCTS.filter((p) => p.slug !== slug)
            .slice(0, 3)
            .map((p) => ({
              name: isHe
                ? (t("he", `product.${p.slug}.name` as any) || p.slug)
                : (t("en", `product.${p.slug}.name` as any) || p.slug),
              price: isHe ? formatIls(p.ils) : `$${(p.ils / 3.7).toFixed(2)}`,
              slug: p.slug,
            }))}
        />
      </div>
    </div>
  );
}
