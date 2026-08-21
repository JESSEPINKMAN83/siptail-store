export const dynamic = "force-dynamic";
import { getWixServerClient } from "@/lib/wix-client";
import AddToCartButton from "@/components/AddToCartButton";
import Link from "next/link";

type AnyVariant = { _id?: string|null; choices?: Record<string,string>|null; variant?: { priceData?: { formatted?: { price?: string|null }|null }|null }|null };
type AnyProduct = { _id?: string|null; name?: string|null; slug?: string|null; description?: string|null; priceData?: { formatted?: { price?: string|null }|null }|null; variants?: AnyVariant[]|null; media?: { mainMedia?: { image?: { url?: string|null }|null }|null }|null };

const FALLBACK: AnyProduct = {
  _id: "fallback-1", name: "SipTail Trail Bottle", slug: "siptail-trail-bottle",
  description: "Built for dogs who keep up. One-squeeze fill tray, leak-proof lock, BPA-free materials. Three sizes for every breed.",
  priceData: null, media: null,
  variants: [
    { _id: "v1", choices: { Size: "Small 350ml" }, variant: { priceData: { formatted: { price: "$24.99" } } } },
    { _id: "v2", choices: { Size: "Medium 550ml" }, variant: { priceData: { formatted: { price: "$29.99" } } } },
    { _id: "v3", choices: { Size: "Large 750ml" }, variant: { priceData: { formatted: { price: "$34.99" } } } },
  ],
};

async function fetchProduct(slug: string): Promise<AnyProduct | null> {
  try { const c = await getWixServerClient(); const r = await c.products.queryProducts().eq("slug", slug).find(); return (r.items[0] as AnyProduct) ?? null; }
  catch { return null; }
}

export default async function ProductDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const wixProduct = await fetchProduct(slug);
  const p: AnyProduct = wixProduct ?? FALLBACK;
  const isLive = !!wixProduct;
  const img = p.media?.mainMedia?.image?.url ?? null;
  const variants = p.variants ?? [];
  const basePrice = p.priceData?.formatted?.price ?? variants[0]?.variant?.priceData?.formatted?.price ?? "";

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <nav className="text-sm text-gray-400 mb-8 flex items-center gap-2">
        <Link href="/products" className="hover:text-gray-600 transition-colors">Shop</Link>
        <span>/</span><span className="text-gray-700">{p.name}</span>
      </nav>
      {!isLive && (
        <div className="mb-8 bg-amber-50 border border-amber-200 rounded-xl p-4 text-sm text-amber-800">
          Preview mode — add your <code className="font-mono bg-amber-100 px-1 rounded">NEXT_PUBLIC_WIX_CLIENT_ID</code> to connect the live catalog.
        </div>
      )}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-20">
        <div className="aspect-square rounded-2xl bg-blue-50 overflow-hidden flex items-center justify-center">
          {img ? <img src={img} alt={p.name ?? ""} className="w-full h-full object-cover" />
            : <div className="text-center text-blue-300"><div className="text-8xl mb-4">🐾</div><p className="text-sm">Product photo coming soon</p></div>}
        </div>
        <div className="flex flex-col">
          <h1 className="text-3xl font-bold text-gray-900 mb-3">{p.name}</h1>
          {basePrice && <p className="text-2xl font-semibold text-blue-600 mb-6">{variants.length > 1 ? `From ${basePrice}` : basePrice}</p>}
          <p className="text-gray-600 leading-relaxed mb-8">{p.description}</p>
          <AddToCartButton productId={p._id ?? "fallback-1"} productName={p.name ?? "SipTail Trail Bottle"}
            variants={variants.map(v => ({ id: v._id ?? "", label: Object.values(v.choices ?? {}).join(" / "), price: v.variant?.priceData?.formatted?.price ?? "" }))}
            isLive={isLive} />
          <div className="mt-10 space-y-3 border-t border-gray-100 pt-8">
            {["BPA-free, food-grade materials","One-squeeze fill tray, zero waste","Leak-proof lock for bags","Ships to US and EU"].map(h => (
              <div key={h} className="flex items-start gap-3"><span className="text-green-500 mt-0.5">✓</span><span className="text-gray-600 text-sm">{h}</span></div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
