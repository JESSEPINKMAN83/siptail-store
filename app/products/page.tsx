export const dynamic = "force-dynamic";

import { fetchWixProductsRest } from "@/lib/wix-client";
import { getLocale } from "@/lib/locale";
import { t } from "@/lib/translations";
import { PRODUCTS, formatIls } from "@/lib/products";
import Link from "next/link";
import { TEQPET_LOGO_URL } from "@/lib/config";

const PLACEHOLDER_SVG = `data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='400' height='400' viewBox='0 0 400 400'><rect width='400' height='400' fill='%231B2A4A'/><text x='50%25' y='50%25' dominant-baseline='middle' text-anchor='middle' font-family='Inter,sans-serif' font-size='48' fill='%23FF6B2B'>TeqPet</text></svg>`;

// All 9 TeqPet category filter tabs
const CATEGORY_TABS = [
  { key: "all",                   labelHe: "\u05db\u05dc \u05d4\u05de\u05d5\u05e6\u05e8\u05d9\u05dd",     labelEn: "All" },
  { key: "smart-feeders",         labelHe: "\u05de\u05d6\u05d9\u05e0\u05d9\u05dd \u05d7\u05db\u05de\u05d9\u05dd",    labelEn: "Smart Feeders" },
  { key: "water-fountains",       labelHe: "\u05de\u05d6\u05e8\u05e7\u05d5\u05ea \u05de\u05d9\u05dd",     labelEn: "Water Fountains" },
  { key: "gps-tracking",          labelHe: "GPS \u05d5\u05de\u05e2\u05e7\u05d1",       labelEn: "GPS & Tracking" },
  { key: "smart-toys",            labelHe: "\u05e6\u05e2\u05e6\u05d5\u05e2\u05d9\u05dd \u05d7\u05db\u05de\u05d9\u05dd",  labelEn: "Smart Toys" },
  { key: "tech-grooming",         labelHe: "\u05d8\u05d9\u05e4\u05d5\u05d7 \u05d8\u05db\u05e0\u05d5\u05dc\u05d5\u05d2\u05d9", labelEn: "Tech Grooming" },
  { key: "grooming-accessories",  labelHe: "\u05d0\u05d1\u05d9\u05d6\u05e8\u05d9 \u05d8\u05d9\u05e4\u05d5\u05d7",   labelEn: "Grooming Accessories" },
  { key: "travel-accessories",    labelHe: "\u05d0\u05d1\u05d9\u05d6\u05e8\u05d9 \u05d8\u05d9\u05d5\u05dc",    labelEn: "Travel Accessories" },
  { key: "pet-cameras",           labelHe: "\u05de\u05e6\u05dc\u05de\u05d5\u05ea \u05d7\u05d9\u05d5\u05ea",    labelEn: "Pet Cameras" },
  { key: "activity-monitors",     labelHe: "\u05de\u05d5\u05e0\u05d9\u05d8\u05d5\u05e8\u05d9 \u05e4\u05e2\u05d9\u05dc\u05d5\u05ea", labelEn: "Activity Monitors" },
];

export default async function ProductsPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string>>;
}) {
  const locale = await getLocale();
  const isHe = locale === "he";
  const params = await searchParams;
  const activeCategory = params.cat ?? "all";

  // Fetch live products via direct REST call scoped to the TeqPet site.
  const wixProducts = await fetchWixProductsRest();
  // Index by wixId for image lookup
  const wixById = new Map(wixProducts.map((p) => [p.id, p]));

  // Build display list from the static catalog (correct categories/ILS prices),
  // enriched with live Wix images where available.
  type DisplayProduct = {
    wixId: string;
    ils: number;
    category: string;
    name: string;
    imageUrl: string | null;
  };

  const allDisplay: DisplayProduct[] = PRODUCTS.map((entry) => {
    const live = wixById.get(entry.wixId);
    return {
      wixId: entry.wixId,
      ils: entry.ils,
      category: entry.category,
      name: live?.name ?? entry.slug,
      imageUrl: live?.mainImageUrl ?? entry.image ?? null,
    };
  });

  const filtered =
    activeCategory === "all"
      ? allDisplay
      : allDisplay.filter((p) => p.category === activeCategory);

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
        <h1
          className="text-3xl font-bold mb-8"
          style={{
            fontFamily: isHe ? "Noto Serif Hebrew, Georgia, serif" : "Inter, system-ui, sans-serif",
            color: "#1B2A4A",
            textAlign: isHe ? "right" : "left",
          }}
        >
          {isHe ? "\u05db\u05dc \u05de\u05d5\u05e6\u05e8\u05d9 TeqPet" : "Shop TeqPet"}
        </h1>

        {/* Category filter tabs */}
        <div className={`flex gap-2 mb-8 flex-wrap ${isHe ? "justify-end" : "justify-start"}`}>
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

        {/* Product grid — links now use /products/${wixId} (ASCII UUIDs, no Hebrew in URL) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {filtered.map((p) => {
            const priceDisplay = isHe ? formatIls(p.ils) : `$${(p.ils / 3.7).toFixed(2)}`;
            const imgSrc = p.imageUrl ?? TEQPET_LOGO_URL ?? PLACEHOLDER_SVG;

            return (
              <Link
                key={p.wixId}
                href={`/products/${p.wixId}?lang=${locale}`}
                className="group border hover:shadow-md active:scale-[0.98] transition-all touch-manipulation"
                style={{ background: "#FFFFFF", borderColor: "#D0D8EC" }}
              >
                <div className="aspect-square overflow-hidden" style={{ background: "#F8F9FC" }}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={imgSrc}
                    alt={p.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    loading="lazy"
                  />
                </div>
                <div className="p-4" style={{ textAlign: isHe ? "right" : "left" }}>
                  <h2
                    className="font-semibold text-sm mb-2 line-clamp-2"
                    style={{
                      fontFamily: isHe ? "Noto Serif Hebrew, Georgia, serif" : "Inter, system-ui, sans-serif",
                      color: "#1B2A4A",
                    }}
                  >
                    {p.name}
                  </h2>
                  <span className="font-bold text-sm" style={{ color: "#FF6B2B" }}>
                    {priceDisplay}
                  </span>
                </div>
                <div className="px-4 pb-4">
                  <div
                    className="w-full text-center text-xs font-medium py-2"
                    style={{ background: "#1B2A4A", color: "#FFFFFF", borderRadius: "2px" }}
                  >
                    {isHe ? "\u05d4\u05d5\u05e1\u05e3 \u05dc\u05e1\u05dc" : "Add to Cart"}
                  </div>
                </div>
              </Link>
            );
          })}
        </div>

        {filtered.length === 0 && (
          <p className="text-center py-12" style={{ color: "#666" }}>
            {isHe ? "\u05d0\u05d9\u05df \u05de\u05d5\u05e6\u05e8\u05d9\u05dd \u05d1\u05e7\u05d8\u05d2\u05d5\u05e8\u05d9\u05d4 \u05d6\u05d5" : "No products in this category"}
          </p>
        )}
      </div>
    </div>
  );
}
