export const dynamic = "force-dynamic";

import { getWixServerClient } from "@/lib/wix-client";
import { getLocale } from "@/lib/locale";
import { t } from "@/lib/translations";
import { PRODUCTS, formatIls, type ProductCategory } from "@/lib/products";
import Link from "next/link";
import { TEQPET_LOGO_URL } from "@/lib/config";

// TeqPet navy placeholder SVG when Wix image is missing
const PLACEHOLDER_SVG = `data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='400' height='400' viewBox='0 0 400 400'><rect width='400' height='400' fill='%231B2A4A'/><text x='50%25' y='50%25' dominant-baseline='middle' text-anchor='middle' font-family='Inter,sans-serif' font-size='48' fill='%23FF6B2B'>TeqPet</text></svg>`;

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

// All 9 TeqPet category filter tabs
const CATEGORY_TABS = [
  { key: "all",                   labelHe: "כל המוצרים",    labelEn: "All" },
  { key: "smart-feeders",         labelHe: "מזינים חכמים",   labelEn: "Smart Feeders" },
  { key: "water-fountains",       labelHe: "מזרקות מים",    labelEn: "Water Fountains" },
  { key: "gps-tracking",          labelHe: "GPS ומעקב",     labelEn: "GPS & Tracking" },
  { key: "smart-toys",            labelHe: "צעצועים חכמים", labelEn: "Smart Toys" },
  { key: "tech-grooming",         labelHe: "טיפוח טכנולוגי",labelEn: "Tech Grooming" },
  { key: "grooming-accessories",  labelHe: "אביזרי טיפוח",  labelEn: "Grooming Accessories" },
  { key: "travel-accessories",    labelHe: "אביזרי טיול",   labelEn: "Travel Accessories" },
  { key: "pet-cameras",           labelHe: "מצלמות חיות",   labelEn: "Pet Cameras" },
  { key: "activity-monitors",     labelHe: "מוניטורי פעילות",labelEn: "Activity Monitors" },
];

export default async function ProductsPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string>>;
}) {
  const locale = await getLocale();
  const isHe = locale === "he";
  const params = await searchParams;
  const activeCategory = (params.cat ?? "all") as ProductCategory | "all";

  // Fetch live Wix products
  const wixProducts = await fetchAllWixProducts();

  // If Wix has products, use them directly; otherwise fall back to catalog
  let displayProducts: DisplayProduct[];

  if (wixProducts.length > 0) {
    // Use live Wix products directly
    displayProducts = wixProducts.map((wp) => ({
      slug: wp.slug ?? wp._id ?? "product",
      ils: 0, // price comes from Wix directly in PDP
      category: "all",
      nameEn: wp.name ?? "Product",
      nameHe: wp.name ?? "מוצר",
      imageUrl: wp.media?.mainMedia?.image?.url ?? null,
      wixId: wp._id ?? "",
    }));
  } else {
    // Fallback: static catalog
    const wixImageMap = new Map<string, string>();
    for (const wp of wixProducts) {
      const id = wp._id;
      const url = wp.media?.mainMedia?.image?.url ?? null;
      if (id && url) wixImageMap.set(id, url);
    }
    displayProducts = PRODUCTS.map((entry: CatalogEntry) => {
      const imageUrl = wixImageMap.get(entry.wixId) ?? null;
      const nameEn = t("en", `product.${entry.slug}.name` as any) || entry.slug;
      const nameHe = t("he", `product.${entry.slug}.name` as any) || nameEn;
      return { slug: entry.slug, ils: entry.ils, category: entry.category, nameEn, nameHe, imageUrl, wixId: entry.wixId };
    });
  }

  const filtered =
    activeCategory === "all" || wixProducts.length > 0
      ? displayProducts
      : displayProducts.filter((p) => p.category === activeCategory);

  return (
    <div style={{ background: "#FFFFFF" }} dir={isHe ? "rtl" : "ltr"}>
      {/* Free shipping banner */}
      <div
        className="w-full text-center text-sm py-2 font-medium"
        style={{ background: "#1B2A4A", color: "#D0D8EC" }}
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
              : "Inter, system-ui, sans-serif",
            color: "#1B2A4A",
            textAlign: isHe ? "right" : "left",
          }}
        >
          {isHe ? "כל מוצרי TeqPet" : "Shop TeqPet"}
        </h1>

        {/* Category filter tabs — all 9 collections */}
        <div
          className={`flex gap-2 mb-8 flex-wrap ${isHe ? "justify-end" : "justify-start"}`}
        >
          {CATEGORY_TABS.map(({ key, labelHe, labelEn }) => {
            const isActive = activeCategory === key;
            return (
              <Link
                key={key}
                href={`/products${key === "all" ? "" : `?cat=${key}`}&lang=${locale}`}
                className="px-4 py-2 text-sm font-medium border transition-colors"
                style={{
                  background: isActive ? "#1B2A4A" : "#FFFFFF",
                  color: isActive ? "#FFFFFF" : "#1A1A1A",
                  borderColor: isActive ? "#1B2A4A" : "#D0D8EC",
                  borderRadius: "2px",
                }}
              >
                {isHe ? labelHe : labelEn}
              </Link>
            );
          })}
        </div>

        {/* Product grid — 4 col desktop, 2 tablet, 1 mobile */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {filtered.map((p) => {
            const displayName = isHe ? p.nameHe : p.nameEn;
            const priceDisplay = p.ils > 0
              ? (isHe ? formatIls(p.ils) : `$${(p.ils / 3.7).toFixed(2)}`)
              : "";
            const imgSrc = p.imageUrl ?? TEQPET_LOGO_URL ?? PLACEHOLDER_SVG;

            return (
              <Link
                key={p.slug}
                href={`/products/${p.slug}?lang=${locale}`}
                className="group border hover:shadow-md active:scale-[0.98] transition-all touch-manipulation"
                style={{ background: "#FFFFFF", borderColor: "#D0D8EC" }}
              >
                {/* Product image */}
                <div
                  className="aspect-square overflow-hidden"
                  style={{ background: "#F8F9FC" }}
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
                        : "Inter, system-ui, sans-serif",
                      color: "#1B2A4A",
                    }}
                  >
                    {displayName}
                  </h2>
                  {priceDisplay && (
                    <span
                      className="font-bold text-sm"
                      style={{ color: "#FF6B2B" }}
                    >
                      {priceDisplay}
                    </span>
                  )}
                </div>

                {/* Add to Cart CTA */}
                <div className="px-4 pb-4">
                  <div
                    className="w-full text-center text-xs font-medium py-2 transition-colors"
                    style={{
                      background: "#1B2A4A",
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
      </div>
    </div>
  );
}
