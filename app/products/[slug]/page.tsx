export const dynamic = "force-dynamic";
import { getLocale } from "@/lib/locale";
import { t } from "@/lib/translations";
import { getWhatsAppUrl } from "@/lib/config";
import { PRODUCTS, getProductBySlug, formatIls } from "@/lib/products";
import ProductPageClient from "@/components/ProductPageClient";
import Link from "next/link";
import { notFound } from "next/navigation";

const WIX_SITE_ID = process.env.NEXT_PUBLIC_WIX_SITE_ID || "c9466f44-badc-4481-af3e-2b00fa6472c8";
const WIX_CLIENT_ID = process.env.NEXT_PUBLIC_WIX_CLIENT_ID || "1d47ce62-8390-4782-86d3-c706cde04ec3";

// Shape returned by the Wix Stores v3 REST GET product endpoint
// with ?fields=MEDIA_ITEMS_INFO (required to populate itemsInfo.items)
type WixRestProduct = {
  id?: string | null;
  slug?: string | null;
  name?: string | null;
  description?: string | null;
  revision?: string | null;
  media?: {
    main?: {
      image?: { url?: string | null } | null;
      mediaType?: string | null;
    } | null;
    itemsInfo?: {
      items?: Array<{
        image?: { url?: string | null } | null;
        mediaType?: string | null;
      }> | null;
    } | null;
  } | null;
  priceData?: {
    price?: number | null;
    currency?: string | null;
  } | null;
  variants?: Array<{
    id?: string | null;
    choices?: Record<string, string> | null;
    variant?: { priceData?: { price?: number | null } | null } | null;
  }> | null;
};

// Fetch a product using the Wix REST API with MEDIA_ITEMS_INFO so all images come back.
// The Wix SDK's queryProducts() never returns media.itemsInfo — only the REST endpoint does.
async function fetchProductRest(wixId: string): Promise<WixRestProduct | null> {
  try {
    // Get an anonymous visitor token from the Wix OAuth endpoint
    const tokenRes = await fetch(
      `https://www.wixapis.com/oauth2/token`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          clientId: WIX_CLIENT_ID,
          grantType: "anonymous",
        }),
        next: { revalidate: 0 },
      }
    );
    const tokenData = await tokenRes.json().catch(() => ({}));
    const accessToken: string | undefined = tokenData?.access_token;

    if (!accessToken) {
      console.error("[fetchProductRest] could not get visitor token:", tokenData);
      return null;
    }

    const res = await fetch(
      `https://www.wixapis.com/stores/v3/products/${wixId}?fields=MEDIA_ITEMS_INFO`,
      {
        headers: {
          Authorization: accessToken,
          "wix-site-id": WIX_SITE_ID,
        },
        next: { revalidate: 0 },
      }
    );

    if (!res.ok) {
      console.error("[fetchProductRest] HTTP", res.status, await res.text().catch(() => ""));
      return null;
    }

    const data = await res.json();
    return (data?.product ?? null) as WixRestProduct | null;
  } catch (e) {
    console.error("[fetchProductRest] error:", e);
    return null;
  }
}

type AnyVariant = {
  _id?: string | null; id?: string | null;
  choices?: Record<string, string> | null;
  variant?: { priceData?: { formatted?: { price?: string | null } | null } | null } | null;
  price?: { actualPrice?: { amount?: string | null } | null } | null;
};

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

  // 404 for unknown slugs
  const catalogEntry = getProductBySlug(slug);
  if (!catalogEntry) {
    notFound();
  }

  const hebrewName = t("he", `product.${slug}.name` as any) || slug;
  const englishName = t("en", `product.${slug}.name` as any) || slug;
  const displayName = isHe ? hebrewName : englishName;

  // REST fetch with MEDIA_ITEMS_INFO — gets all images, not just the first
  const wixProduct = await fetchProductRest(catalogEntry.wixId);

  // Build image array from all itemsInfo.items, then main as fallback
  const images: string[] = [];
  const allItems = wixProduct?.media?.itemsInfo?.items ?? [];
  for (const item of allItems) {
    const url = item?.image?.url;
    if (url && !images.includes(url)) images.push(url);
  }
  // If itemsInfo was empty, fall back to media.main
  if (images.length === 0 && wixProduct?.media?.main?.image?.url) {
    images.push(wixProduct.media.main.image.url);
  }

  // Variants from Wix (if any)
  const rawVariants: AnyVariant[] = (wixProduct?.variants as AnyVariant[]) ?? [];

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
    (wixProduct as any)?.description ??
    (wixProduct as any)?.plainDescription ??
    "";

  const productId = wixProduct?.id ?? catalogEntry.wixId;

  return (
    <div style={{ background: "#F5F4F0" }} dir={isHe ? "rtl" : "ltr"}>
      {/* Breadcrumb */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4 pb-2">
        <nav
          className="flex items-center gap-2 text-xs flex-wrap"
          style={{ justifyContent: isHe ? "flex-end" : "flex-start" }}
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
          <span style={{ color: "#1A1A1A" }}>{displayName}</span>
        </nav>
      </div>

      {/* Shipping contract */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-0">
        <div
          className="flex flex-wrap gap-4 text-xs py-3 border-b"
          style={{ borderColor: "#D4E6D4", color: "#4A7C59", flexDirection: isHe ? "row-reverse" : "row" }}
        >
          <span>
            <strong style={{ color: "#1B4332" }}>{t(locale, "shipping.homeDelivery")}</strong>
            {" · "}{t(locale, "shipping.businessDays")}
            {" · "}{t(locale, "shipping.belowThreshold")}
            {" · "}{t(locale, "shipping.aboveThreshold")}
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
