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

type WixRestProduct = {
  id?: string | null;
  slug?: string | null;
  name?: string | null;
  description?: string | null;
  revision?: string | null;
  media?: {
    main?: { url?: string | null; mediaType?: string | null } | null;
    itemsInfo?: {
      items?: Array<{ url?: string | null; mediaType?: string | null }> | null;
    } | null;
  } | null;
  priceData?: { price?: number | null; currency?: string | null } | null;
  options?: Array<{
    id?: string | null;
    name?: string | null;
    choicesSettings?: {
      choices?: Array<{ choiceId?: string; name?: string }> | null;
    } | null;
  }> | null;
  variantsInfo?: {
    variants?: Array<{
      id?: string | null;
      choices?: Array<{
        optionChoiceIds?: { optionId?: string; choiceId?: string };
      }> | null;
      price?: { actualPrice?: { amount?: string | null } | null } | null;
      inventoryStatus?: { inStock?: boolean | null } | null;
    }> | null;
  } | null;
};

async function fetchProductRest(wixId: string): Promise<WixRestProduct | null> {
  try {
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
  choices?: Array<{ optionChoiceIds?: { optionId?: string; choiceId?: string } }> | null;
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

function toWixStaticUrl(raw: string | null | undefined, w = 800, h = 800): string | null {
  if (!raw) return null;
  if (raw.startsWith("https://") || raw.startsWith("http://")) return raw;
  const m = raw.match(/^wix:image:\/\/v1\/([^/]+)\/([^#?]+)/);
  if (!m) return raw;
  const [, fileId, filename] = m;
  return `https://static.wixstatic.com/media/${fileId}/v1/fit/w_${w},h_${h},q_85/${filename}`;
}

export default async function ProductDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const locale = await getLocale();
  const isHe = locale === "he";

  const catalogEntry = getProductBySlug(slug);
  if (!catalogEntry) {
    notFound();
  }

  const hebrewName = t("he", `product.${slug}.name` as any) || slug;
  const englishName = t("en", `product.${slug}.name` as any) || slug;
  const displayName = isHe ? hebrewName : englishName;

  const wixProduct = await fetchProductRest(catalogEntry.wixId);

  const images: string[] = [];
  const allItems = wixProduct?.media?.itemsInfo?.items ?? [];
  for (const item of allItems) {
    const converted = toWixStaticUrl(item?.url);
    if (converted && !images.includes(converted)) images.push(converted);
  }
  if (images.length === 0) {
    const mainConverted = toWixStaticUrl(wixProduct?.media?.main?.url);
    if (mainConverted) images.push(mainConverted);
  }
  // No heroImage field in TeqPet catalog; live Wix images populate once media is uploaded.

  const rawVariants: AnyVariant[] = (
    (wixProduct?.variantsInfo?.variants as AnyVariant[]) ?? []
  );

  const ilsPrice = formatIls(catalogEntry.ils);
  const basePrice = isHe
    ? ilsPrice
    : `$${(catalogEntry.ils / 3.7).toFixed(2)}`;

  const heColorMap: Record<string, string> = {
    Black: "\u05e9\u05d7\u05d5\u05e8", Blue: "\u05db\u05d7\u05d5\u05dc", Red: "\u05d0\u05d3\u05d5\u05dd", Purple: "\u05e1\u05d2\u05d5\u05dc",
    Green: "\u05d9\u05e8\u05d5\u05e7", White: "\u05dc\u05d1\u05df", Yellow: "\u05e6\u05d4\u05d5\u05d1", Orange: "\u05db\u05ea\u05d5\u05dd",
  };
  const heSizeMap: Record<string, string> = {
    S: "S", M: "M", L: "L", XL: "XL",
    Small: "\u05e7\u05d8\u05df", Medium: "\u05d1\u05d9\u05e0\u05d5\u05e0\u05d9", Large: "\u05d2\u05d3\u05d5\u05dc",
  };
  function hebrewifyChoiceName(name: string): string {
    return heColorMap[name] ?? heSizeMap[name] ?? name;
  }

  const choiceIdToName: Record<string, string> = {};
  for (const opt of (wixProduct?.options ?? [])) {
    for (const ch of (opt.choicesSettings?.choices ?? [])) {
      if (ch.choiceId && ch.name) choiceIdToName[ch.choiceId] = ch.name;
    }
  }

  const displayVariants = rawVariants.map((v) => {
    const choiceNames = (v.choices ?? []).map((c) => {
      const choiceId = c.optionChoiceIds?.choiceId ?? "";
      const englishName = choiceIdToName[choiceId] ?? choiceId;
      return isHe ? hebrewifyChoiceName(englishName) : englishName;
    });
    return {
      id: getVariantId(v),
      label: choiceNames.join(" / ") || (isHe ? "\u05d1\u05e8\u05d9\u05e8\u05ea \u05de\u05d7\u05d3\u05dc" : "Default"),
      price: basePrice,
      rawPrice: getVariantPrice(v),
    };
  });

  const translationDescKey = `product.${slug}.description` as any;
  const descriptionFromTranslations = t(locale, translationDescKey);
  const description =
    (descriptionFromTranslations && descriptionFromTranslations !== translationDescKey)
      ? descriptionFromTranslations
      : ((wixProduct as any)?.description ?? (wixProduct as any)?.plainDescription ?? "");

  const productId = wixProduct?.id ?? catalogEntry.wixId;

  return (
    <div style={{ background: "#F5F4F0" }} dir={isHe ? "rtl" : "ltr"}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4 pb-2">
        <nav
          className="flex items-center gap-2 text-xs flex-wrap"
          style={{ justifyContent: isHe ? "flex-end" : "flex-start" }}
          aria-label="breadcrumb"
        >
          <Link href={`/?lang=${locale}`} className="hover:text-[#1B4332] transition-colors" style={{ color: "#6B7280" }}>
            {isHe ? "\u05d1\u05d9\u05ea" : "Home"}
          </Link>
          <span style={{ color: "#D4E6D4" }}>{isHe ? "\u2039" : "\u203a"}</span>
          <Link href={`/products?lang=${locale}`} className="hover:text-[#1B4332] transition-colors" style={{ color: "#6B7280" }}>
            {isHe ? "\u05d7\u05e0\u05d5\u05ea" : "Shop"}
          </Link>
          <span style={{ color: "#D4E6D4" }}>{isHe ? "\u2039" : "\u203a"}</span>
          <span style={{ color: "#1A1A1A" }}>{displayName}</span>
        </nav>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-0">
        <div
          className="flex flex-wrap gap-4 text-xs py-3 border-b"
          style={{ borderColor: "#D4E6D4", color: "#4A7C59", flexDirection: isHe ? "row-reverse" : "row" }}
        >
          <span>
            <strong style={{ color: "#1B4332" }}>{t(locale, "shipping.homeDelivery")}</strong>
            {" \u00b7 "}{t(locale, "shipping.businessDays")}
            {" \u00b7 "}{t(locale, "shipping.belowThreshold")}
            {" \u00b7 "}{t(locale, "shipping.aboveThreshold")}
          </span>
          <span style={{ color: "#6B7280" }}>{t(locale, "shipping.leadTime")}</span>
        </div>
      </div>

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
