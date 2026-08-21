export const dynamic = "force-dynamic";
import { getWixServerClient } from "@/lib/wix-client";
import Link from "next/link";
import ProductPageClient from "@/components/ProductPageClient";

type AnyVariant = {
  _id?: string | null;
  choices?: Record<string, string> | null;
  variant?: { priceData?: { formatted?: { price?: string | null } | null } | null } | null;
};
type AnyProduct = {
  _id?: string | null;
  name?: string | null;
  slug?: string | null;
  description?: string | null;
  additionalInfoSections?: { title?: string | null; description?: string | null }[] | null;
  priceData?: { formatted?: { price?: string | null } | null; price?: number | null } | null;
  variants?: AnyVariant[] | null;
  media?: {
    mainMedia?: { image?: { url?: string | null } | null } | null;
    items?: { image?: { url?: string | null } | null }[] | null;
  } | null;
};

const FALLBACK: AnyProduct = {
  _id: "fallback-1",
  name: "SipTail Trail Bottle",
  slug: "siptail-trail-bottle",
  description: "One-handed, no-spill, BPA-free. Built for dogs who keep up on trails, parks, and beaches.",
  priceData: { formatted: { price: "$29.99" }, price: 29.99 },
  variants: [
    { _id: "v1", choices: { Size: "Small (350ml)" }, variant: { priceData: { formatted: { price: "$24.99" } } } },
    { _id: "v2", choices: { Size: "Medium (550ml)" }, variant: { priceData: { formatted: { price: "$29.99" } } } },
    { _id: "v3", choices: { Size: "Large (750ml)" }, variant: { priceData: { formatted: { price: "$34.99" } } } },
  ],
  media: null,
};

const RELATED = [
  { name: "Collapsible Dog Travel Bowl", price: "$18", slug: "collapsible-dog-travel-bowl" },
  { name: "Collapsible Silicone Water Bottle", price: "$22", slug: "collapsible-silicone-water-bottle" },
  { name: "Instant Cooling Towel", price: "$22", slug: "instant-cooling-towel" },
];

async function fetchProduct(slug: string): Promise<AnyProduct | null> {
  try {
    const c = await getWixServerClient();
    const r = await c.products.queryProducts().eq("slug", slug).find();
    return (r.items[0] as AnyProduct) ?? null;
  } catch { return null; }
}

export default async function ProductDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const wixProduct = await fetchProduct(slug);
  const p: AnyProduct = wixProduct ?? FALLBACK;
  const isLive = !!wixProduct;

  const images: (string | null)[] = [];
  if (p.media?.mainMedia?.image?.url) images.push(p.media.mainMedia.image.url);
  if (p.media?.items) {
    for (const item of p.media.items) {
      if (item.image?.url && !images.includes(item.image.url)) images.push(item.image.url);
    }
  }
  while (images.length < 4) images.push(null);

  const variants = p.variants ?? [];
  const basePrice = p.priceData?.formatted?.price ?? "$29.99";

  return (
    <div className="bg-white min-h-screen">
      {/* Breadcrumb */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4 pb-2">
        <nav className="flex items-center gap-2 text-xs text-gray-400">
          <Link href="/" className="hover:text-[#1B4332] transition-colors">Home</Link>
          <span>/</span>
          <Link href="/products" className="hover:text-[#1B4332] transition-colors">Shop</Link>
          <span>/</span>
          <span className="text-gray-700">{p.name}</span>
        </nav>
      </div>

      {/* Main product section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 pb-28 md:pb-8">
        <ProductPageClient
          product={{
            id: p._id ?? "fallback-1",
            name: p.name ?? "SipTail Trail Bottle",
            slug: p.slug ?? slug,
            description: p.description ?? "",
            basePrice,
            isLive,
            images: images.slice(0, 4),
            variants: variants.map((v) => ({
              id: v._id ?? "",
              label: Object.values(v.choices ?? {}).join(" / "),
              price: v.variant?.priceData?.formatted?.price ?? basePrice,
            })),
          }}
          related={RELATED}
        />
      </div>
    </div>
  );
}
