export const dynamic = "force-dynamic";

import { getWixServerClient } from "@/lib/wix-client";
import { getLocale } from "@/lib/locale";
import { t } from "@/lib/translations";
import { PRODUCTS, formatIls, type ProductCategory } from "@/lib/products";
import Link from "next/link";

// Brand green placeholder SVG as a data URL — shown when Wix image is missing
const PLACEHOLDER_SVG = `data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='400' height='400' viewBox='0 0 400 400'><rect width='400' height='400' fill='%231B4332'/><text x='50%25' y='50%25' dominant-baseline='middle' text-anchor='middle' font-family='Georgia,serif' font-size='48' fill='%23D4E6D4'>WE</text></svg>`;

type WixProduct = {
  _id?: string | null;
  name?: string | null;
  slug?: string | null;
  media?: {
    mainMedia?: { image?: { url?: string | null } | null } | null;
  } | null;
};

type CatalogEntry = typeof PRODUCTS[number];

type DisplayProduct = {
  slug: string;
  ils: number;
  category: string;
  nameEn: string;
  nameHe: string;
  imageUrl: string | null;
  wixId: string;
};

async function fetchAllWixProducts(): Promise<WixProduct[]> {
  try {
    const c = await getWixServerClient();
    const res = await c.products.queryProducts().limit(100).find();
    return (res.items as WixProduct[]) ?? [];
  } catch {
    return [];
  }
}

export default async function ProductsPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string>>;
}) {
  const locale = await getLocale();
  const isHe = locale === "he";
  const params = await searchParams;
  const activeCategory = (params.cat ?? "all") as ProductCategory | "all";

  // Fetch live Wix products for images
  const wixProducts = await fetchAllWixProducts();

  // Build a map from wixId → image URL
  const wixImageMap = new Map<string, string>();
  for (const wp of wixProducts) {
    const id = wp._id;
    const url = wp.media?.mainMedia?.image?.url ?? null;
    if (id && url) wixImageMap.set(id, url);
  }

  // Also build a slug→wixProduct map for slug-based lookup
  const wixSlugMap = new Map<string, WixProduct>();
  for (const wp of wixProducts) {
    if (wp.slug) wixSlugMap.set(wp.slug, wp);
  }

  // Merge catalog with live Wix data
  const displayProducts: DisplayProduct[] = PRODUCTS.map((entry: CatalogEntry) => {
    // Try by wixId first, then by slug
    const imageFromId = wixImageMap.get(entry.wixId) ?? null;
    const wixBySlug = wixSlugMap.get(entry.slug);
    const imageFromSlug = wixBySlug?.media?.mainMedia?.image?.url ?? null;
    const imageUrl = imageFromId ?? imageFromSlug ?? null;

    const nameEn = t("en", `product.${entry.slug}.name` as any) || entry.slug;
    const nameHe = t("he", `product.${entry.slug}.name` as any) || nameEn;

    return {
      slug: entry.slug,
      ils: entry.ils,
      category: entry.category,
      nameEn,
      nameHe,
      imageUrl,
      wixId: entry.wixId,
    };
  });

  const categories: { key: ProductCategory | "all"; labelKey: any }[] = [
    { key: "all",                  labelKey: "category.all" },
    { key: "dog-gear",             labelKey: "category.dog-gear" },
    { key: "hiking-gear",          labelKey: "category.hiking-gear" },
    { key: "outdoor-accessories",  labelKey: "category.outdoor-accessories" },
  ];

  const filtered =
    activeCategory === "all"
      ? displayProducts
      : displayProducts.filter((p) => p.category === activeCategory);

  const missingImages = displayProducts.filter((p) => !p.imageUrl).map((p) => p.slug);

  return (
    <div style={{ background: "#F5F4F0" }} dir={isHe ? "rtl" : "ltr"}>
      {/* Free shipping banner */}
      <div
        className="w-full text-center text-sm py-2 font-medium"
        style={{ background: "#1B4332", color: "#D4E6D4" }}
      >
        {t(locale, "products.free.shipping")}
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* Page title */}
        <h1
          className="text-3xl font-bold mb-8"
          style={{
            fontFamily: isHe
              ? "Noto Serif Hebrew, Georgia, serif"
              : "Georgia, 'Times New Roman', serif",
            color: "#1A1A1A",
            textAlign: isHe ? "right" : "left",
          }}
        >
          {t(locale, "products.page.title")}
        </h1>

        {/* Category filter tabs */}
        <div
          className={`flex gap-2 mb-8 flex-wrap ${isHe ? "justify-end" : "justify-start"}`}
        >
          {categories.map(({ key, labelKey }) => {
            const isActive = activeCategory === key;
            return (
              <Link
                key={key}
                href={`/products${key === "all" ? "" : `?cat=${key}`}&lang=${locale}`}
                className="px-4 py-2 text-sm font-medium border transition-colors"
                style={{
                  background: isActive ? "#1B4332" : "#FFFFFF",
                  color: isActive ? "#FFFFFF" : "#1A1A1A",
                  borderColor: isActive ? "#1B4332" : "#D4E6D4",
                  borderRadius: "2px",
                }}
              >
                {t(locale, labelKey)}
              </Link>
            );
          })}
        </div>

        {/* Product grid — 4 col desktop, 2 tablet, 1 mobile */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {filtered.map((p) => {
            const displayName = isHe ? p.nameHe : p.nameEn;
            const priceDisplay = isHe ? formatIls(p.ils) : `$${(p.ils / 3.7).toFixed(2)}`;
            const imgSrc = p.imageUrl ?? PLACEHOLDER_SVG;

            return (
              <Link
                key={p.slug}
                href={`/products/${p.slug}?lang=${locale}`}
                className="group border hover:shadow-md active:scale-[0.98] transition-all touch-manipulation"
                style={{ background: "#FFFFFF", borderColor: "#D4E6D4" }}
              >
                {/* Product image */}
                <div
                  className="aspect-square overflow-hidden"
                  style={{ background: "#F5F4F0" }}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={imgSrc}
                    alt={displayName}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    loading="lazy"
                  />
                </div>

                {/* Card body */}
                <div
                  className="p-4"
                  style={{ textAlign: isHe ? "right" : "left" }}
                >
                  <h2
                    className="font-semibold text-sm mb-2 line-clamp-2"
                    style={{
                      fontFamily: isHe
                        ? "Noto Serif Hebrew, Georgia, serif"
                        : "Georgia, serif",
                      color: "#1A1A1A",
                    }}
                  >
                    {displayName}
                  </h2>
                  <span
                    className="font-bold text-sm"
                    style={{ color: "#1B4332" }}
                  >
                    {priceDisplay}
                  </span>
                </div>

                {/* Add to Cart CTA */}
                <div className="px-4 pb-4">
                  <div
                    className="w-full text-center text-xs font-medium py-2 transition-colors"
                    style={{
                      background: "#1B4332",
                      color: "#FFFFFF",
                      borderRadius: "2px",
                    }}
                  >
                    {isHe ? "הוסף לסל" : "Add to Cart"}
                  </div>
                </div>
              </Link>
            );
          })}
        </div>

        {/* Dev note: products with no Wix image (hidden from UI, visible in HTML comment) */}
        {missingImages.length > 0 && (
          <div
            style={{ display: "none" }}
            data-missing-images={missingImages.join(",")}
          />
        )}
      </div>
    </div>
  );
}
