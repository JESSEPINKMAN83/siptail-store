"use client";
import { useState } from "react";
import Link from "next/link";
import { serverAddToCart } from "@/app/actions/cart-actions";
import { useRouter } from "next/navigation";
import QuestionForm from "./QuestionForm";
import NewsletterSignup from "./NewsletterSignup";

interface Variant { id: string; label: string; price: string; }
interface Product {
  id: string; name: string; slug: string; description: string;
  basePrice: string; isLive: boolean;
  images: (string | null)[];
  variants: Variant[];
}
interface RelatedProduct { name: string; price: string; slug: string; }

function ImgBox({ url, alt, className }: { url: string | null; alt: string; className?: string }) {
  if (url) return <img src={url} alt={alt} className={`w-full h-full object-cover ${className ?? ""}`} />;
  return (
    <div className={`w-full h-full bg-[#F4F4F4] flex items-center justify-center ${className ?? ""}`}>
      <span className="text-5xl">🐾</span>
    </div>
  );
}

function Accordion({ title, children }: { title: string; children: React.ReactNode }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border-b border-[#E5E7EB]">
      <button onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between py-4 text-left text-sm font-semibold text-[#1A1A1A] hover:text-[#1B4332] transition-colors touch-manipulation min-h-[44px]">
        {title}
        <svg className={`w-4 h-4 text-gray-400 transition-transform flex-shrink-0 ${open ? "rotate-180" : ""}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>
      {open && <div className="pb-4 text-sm text-[#6B7280] leading-relaxed">{children}</div>}
    </div>
  );
}

export default function ProductPageClient({ product, related }: { product: Product; related: RelatedProduct[] }) {
  const [selectedVariant, setSelectedVariant] = useState(product.variants[0]?.id ?? "");
  const [qty, setQty] = useState(1);
  const [adding, setAdding] = useState(false);
  const [added, setAdded] = useState(false);
  const [mobileImg, setMobileImg] = useState(0);
  const [sizeOpen, setSizeOpen] = useState(false);
  const router = useRouter();

  const sel = product.variants.find(v => v.id === selectedVariant) ?? product.variants[0];
  const price = sel?.price ?? product.basePrice;

  async function handleAddToCart() {
    if (!product.isLive) { router.push("/cart?preview=1"); return; }
    setAdding(true);
    try {
      const result = await serverAddToCart(product.id, selectedVariant || null, qty);
      if (!result.ok) {
        console.error("[ProductPage] add to cart error:", result.error);
        alert("Could not add to cart. Please try again.");
        return;
      }
      setAdded(true);
      setTimeout(() => setAdded(false), 2500);
      router.refresh();
    } catch (e) { console.error("[ProductPage] add to cart unexpected:", e); alert("Could not add to cart. Please try again."); }
    finally { setAdding(false); }
  }

  const addBtn = (full: boolean) => (
    <button onClick={handleAddToCart} disabled={adding}
      className={`${full ? "w-full" : "flex-1"} py-4 rounded-xl font-bold text-base transition-all touch-manipulation min-h-[52px] ${
        added ? "bg-green-600 text-white" : adding ? "bg-gray-300 text-gray-500 cursor-not-allowed" : "bg-[#1B4332] text-white hover:bg-[#2d5a3d] active:bg-[#143326]"
      }`}>
      {added ? "Added ✓" : adding ? "Adding..." : full ? "Add to Cart" : `Add to Cart — ${price}`}
    </button>
  );

  const sizeSelector = (
    <div className="mb-4">
      <button onClick={() => setSizeOpen(!sizeOpen)}
        className="w-full flex items-center justify-between px-4 py-3 border border-[#E5E7EB] rounded-xl text-sm font-medium text-[#1A1A1A] hover:border-[#1B4332] transition-colors touch-manipulation min-h-[44px]">
        <span>Size: <span className="font-semibold">{sel?.label ?? "Select"}</span></span>
        <svg className={`w-4 h-4 text-gray-400 transition-transform ${sizeOpen ? "rotate-180" : ""}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>
      {sizeOpen && (
        <div className="mt-1 border border-[#E5E7EB] rounded-xl overflow-hidden">
          {product.variants.map(v => (
            <button key={v.id} onClick={() => { setSelectedVariant(v.id); setSizeOpen(false); }}
              className={`w-full flex items-center justify-between px-4 py-3 text-sm transition-colors touch-manipulation min-h-[44px] ${
                selectedVariant === v.id ? "bg-[#1B4332] text-white" : "hover:bg-gray-50 text-[#1A1A1A]"
              }`}>
              <span>{v.label}</span>
              <span className={selectedVariant === v.id ? "text-green-200" : "text-[#6B7280]"}>{v.price}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );

  const qtySelector = (compact: boolean) => (
    <div className={`flex items-center ${compact ? "" : "mb-5"} border border-[#E5E7EB] rounded-xl overflow-hidden`}>
      <button onClick={() => setQty(q => Math.max(1, q - 1))} className="px-4 py-2 text-xl font-medium hover:bg-gray-50 touch-manipulation min-h-[44px] min-w-[44px]">−</button>
      <span className="px-4 py-2 text-sm font-semibold border-x border-[#E5E7EB] min-w-[44px] text-center">{qty}</span>
      <button onClick={() => setQty(q => q + 1)} className="px-4 py-2 text-xl font-medium hover:bg-gray-50 touch-manipulation min-h-[44px] min-w-[44px]">+</button>
    </div>
  );

  const reviewsContent = (
    <div className="space-y-3">
      {[
        { name: "Sarah M.", text: "My lab loves it! The tray design is genius — no more wasteful pours." },
        { name: "James T.", text: "Took this on a 10-mile hike. Zero leaks, easy one-hand use. Worth every penny." },
      ].map(r => (
        <div key={r.name} className="border-b border-[#E5E7EB] pb-3 last:border-0">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-yellow-400 text-xs">★★★★★</span>
            <span className="text-xs font-semibold text-[#1A1A1A]">{r.name}</span>
          </div>
          <p className="text-xs">{r.text}</p>
        </div>
      ))}
    </div>
  );

  const meta = (
    <div className="mt-5 pt-4 border-t border-[#E5E7EB] space-y-1 text-xs text-[#6B7280]">
      <p><span className="font-medium text-[#1A1A1A]">SKU:</span> ST-M-001</p>
      <p><span className="font-medium text-[#1A1A1A]">Category:</span> Hydration</p>
      <p><span className="font-medium text-[#1A1A1A]">Tags:</span> Dog Walk, Hydration, BPA-Free, Trail</p>
    </div>
  );

  const secondaryActions = (
    <div className="flex items-center justify-center gap-6 my-4">
      {[{ icon: "♡", label: "Wishlist" }, { icon: "↗", label: "Share" }].map(a => (
        <button key={a.label} className="flex items-center gap-1 text-xs text-[#6B7280] hover:text-[#1B4332] transition-colors touch-manipulation py-2">
          <span>{a.icon}</span><span>{a.label}</span>
        </button>
      ))}
    </div>
  );

  return (
    <>
      {/* ── Desktop ─────────────────────────────────────────────────── */}
      <div className="hidden md:grid md:grid-cols-2 gap-8 lg:gap-12">
        {/* 2×2 image grid */}
        <div className="grid grid-cols-2 gap-2">
          {product.images.slice(0, 4).map((url, i) => (
            <div key={i} className="relative aspect-square rounded-xl overflow-hidden bg-[#F4F4F4]">
              <ImgBox url={url} alt={`${product.name} ${i + 1}`} />
              {i === 0 && (
                <div className="absolute top-3 left-3 flex flex-col gap-1">
                  <span className="bg-[#1B4332] text-white text-xs font-bold px-2 py-0.5 rounded">NEW</span>
                  <span className="bg-[#2d5016] text-white text-xs font-bold px-2 py-0.5 rounded">−50%</span>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Info panel */}
        <div className="flex flex-col">
          <h1 className="text-2xl lg:text-3xl font-bold text-[#1A1A1A] mb-2">{product.name}</h1>
          <p className="text-[#6B7280] text-sm mb-4 leading-relaxed">{product.description}</p>
          <div className="flex items-center gap-2 mb-4">
            <span className="text-yellow-400 text-sm">★★★★★</span>
            <span className="text-sm font-semibold text-[#1A1A1A]">4.8</span>
            <span className="text-sm text-[#6B7280]">23 Reviews</span>
          </div>
          <div className="flex items-baseline gap-3 mb-6">
            <span className="text-2xl font-bold text-[#1A1A1A]">{price}</span>
            <span className="text-base text-[#6B7280] line-through">$49.99</span>
          </div>
          {sizeSelector}
          <div className="flex items-center gap-2 mb-4">
            <span className="w-2 h-2 rounded-full bg-green-500"></span>
            <span className="text-xs font-semibold text-green-700 uppercase tracking-wide">Only 3 Left</span>
          </div>
          <div className="flex items-center gap-3 mb-5">
            <span className="text-sm text-[#6B7280]">Qty:</span>
            {qtySelector(false)}
          </div>
          {addBtn(true)}
          {secondaryActions}
          <div className="border-t border-[#E5E7EB]">
            <Accordion title="Description">
              <p>{product.description}</p>
              <ul className="mt-3 space-y-1 list-disc list-inside">
                <li>BPA-free, food-grade materials</li>
                <li>One-squeeze auto-fill tray, unused water returns to bottle</li>
                <li>Leak-proof lock for bags and backpacks</li>
                <li>Ships to US and EU</li>
              </ul>
            </Accordion>
            <Accordion title="Additional Info">
              <p>Material: BPA-free Tritan plastic + food-grade silicone tray</p>
              <p className="mt-1">Sizes: Small 350ml, Medium 550ml, Large 750ml</p>
              <p className="mt-1">Dishwasher safe (tray only). Weight: 180g (Medium).</p>
            </Accordion>
            <Accordion title="Reviews (23)">{reviewsContent}</Accordion>
            <Accordion title="Questions">
              <p className="mb-4">Have a question about this product? Ask below.</p>
              <QuestionForm productSlug={product.slug} />
            </Accordion>
          </div>
          {meta}
        </div>
      </div>

      {/* ── Mobile ──────────────────────────────────────────────────── */}
      <div className="md:hidden">
        <div className="relative w-full aspect-[4/3] bg-[#F4F4F4] mb-4 -mx-4 sm:mx-0 sm:rounded-2xl overflow-hidden">
          <ImgBox url={product.images[mobileImg] ?? null} alt={product.name} />
          <div className="absolute top-3 left-3 flex flex-col gap-1">
            <span className="bg-[#1B4332] text-white text-xs font-bold px-2 py-0.5 rounded">NEW</span>
            <span className="bg-[#2d5016] text-white text-xs font-bold px-2 py-0.5 rounded">−50%</span>
          </div>
          {product.images.length > 1 && (
            <>
              <button onClick={() => setMobileImg(i => (i - 1 + product.images.length) % product.images.length)}
                className="absolute left-2 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-white/80 flex items-center justify-center shadow-sm touch-manipulation">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
              </button>
              <button onClick={() => setMobileImg(i => (i + 1) % product.images.length)}
                className="absolute right-2 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-white/80 flex items-center justify-center shadow-sm touch-manipulation">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
              </button>
            </>
          )}
          <div className="absolute bottom-3 left-0 right-0 flex justify-center gap-1.5">
            {product.images.map((_, i) => (
              <button key={i} onClick={() => setMobileImg(i)} className={`rounded-full transition-all touch-manipulation ${i === mobileImg ? "w-4 h-2 bg-[#1B4332]" : "w-2 h-2 bg-white/60"}`} />
            ))}
          </div>
        </div>

        <h1 className="text-2xl font-bold text-[#1A1A1A] mb-1">{product.name}</h1>
        <p className="text-[#6B7280] text-sm mb-3 leading-relaxed line-clamp-2">{product.description}</p>
        <div className="flex items-center gap-2 mb-3">
          <span className="text-yellow-400 text-sm">★★★★★</span>
          <span className="text-sm font-semibold text-[#1A1A1A]">4.8</span>
          <span className="text-sm text-[#6B7280]">23 Reviews</span>
        </div>
        <div className="flex items-baseline gap-3 mb-5">
          <span className="text-2xl font-bold text-[#1A1A1A]">{price}</span>
          <span className="text-sm text-[#6B7280] line-through">$49.99</span>
        </div>
        {sizeSelector}
        <div className="flex items-center gap-2 mb-4">
          <span className="w-2 h-2 rounded-full bg-green-500"></span>
          <span className="text-xs font-semibold text-green-700 uppercase tracking-wide">Only 2 Left</span>
        </div>
        {qtySelector(false)}

        <div className="border-t border-[#E5E7EB] mb-4">
          <Accordion title="Description">
            <p>{product.description}</p>
            <ul className="mt-2 space-y-1 list-disc list-inside text-xs">
              <li>BPA-free, food-grade materials</li>
              <li>One-squeeze auto-fill tray</li>
              <li>Leak-proof lock</li>
            </ul>
          </Accordion>
          <Accordion title="Reviews (23)">{reviewsContent}</Accordion>
          <Accordion title="Questions">
            <p className="mb-3 text-xs">Ask a question about this product:</p>
            <QuestionForm productSlug={product.slug} />
          </Accordion>
        </div>
        {meta}
      </div>

      {/* ── Related products ──────────────────────────────────────── */}
      <div className="mt-12 md:mt-16 border-t border-[#E5E7EB] pt-10">
        <h2 className="text-xl font-bold text-[#1A1A1A] mb-6">You Might Also Like</h2>
        <div className="grid grid-cols-3 gap-3 sm:gap-5">
          {related.map((rp) => (
            <Link key={rp.slug} href={`/products/${rp.slug}`}
              className="group bg-white border border-[#E5E7EB] rounded-2xl overflow-hidden hover:shadow-md active:scale-[0.98] transition-all touch-manipulation">
              <div className="relative aspect-square bg-[#F4F4F4] flex items-center justify-center">
                <span className="text-4xl sm:text-5xl">🐾</span>
                <button onClick={e => e.preventDefault()}
                  className="absolute top-2 right-2 w-8 h-8 rounded-full bg-white/80 flex items-center justify-center text-gray-300 hover:text-red-400 transition-colors shadow-sm">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                  </svg>
                </button>
              </div>
              <div className="p-3 sm:p-4">
                <h3 className="font-semibold text-[#1A1A1A] text-xs sm:text-sm mb-1 line-clamp-2 group-hover:text-[#1B4332] transition-colors">{rp.name}</h3>
                <div className="flex items-center gap-1 mb-2">
                  <span className="text-yellow-400 text-xs">★★★★★</span>
                  <span className="text-xs text-[#6B7280]">4.7</span>
                </div>
                <p className="font-bold text-[#1A1A1A] text-sm mb-2">{rp.price}</p>
                <button onClick={e => e.preventDefault()}
                  className="w-full py-2 bg-[#1B4332] text-white text-xs font-semibold rounded-lg hover:bg-[#2d5a3d] active:bg-[#143326] transition-colors touch-manipulation min-h-[36px]">
                  Add to Cart
                </button>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* ── Newsletter strip ─────────────────────────────────────── */}
      <div className="mt-12 bg-green-50 border border-green-100 rounded-2xl p-6 sm:p-8 text-center">
        <p className="font-bold text-[#1B4332] text-lg mb-1">Stay in the loop 🐾</p>
        <p className="text-gray-500 text-sm mb-4">Get trail tips, gear drops, and members-only deals.</p>
        <div className="max-w-md mx-auto"><NewsletterSignup /></div>
      </div>

      {/* ── Mobile sticky bar ──────────────────────────────────────── */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-[#E5E7EB] px-4 py-3 flex items-center gap-3 shadow-[0_-4px_16px_rgba(0,0,0,0.08)]">
        <div className="flex items-center border border-[#E5E7EB] rounded-xl overflow-hidden flex-shrink-0">
          <button onClick={() => setQty(q => Math.max(1, q - 1))} className="px-3 py-2 text-lg font-medium hover:bg-gray-50 touch-manipulation min-h-[44px] min-w-[40px]">−</button>
          <span className="px-3 py-2 text-sm font-semibold border-x border-[#E5E7EB] min-w-[36px] text-center">{qty}</span>
          <button onClick={() => setQty(q => q + 1)} className="px-3 py-2 text-lg font-medium hover:bg-gray-50 touch-manipulation min-h-[44px] min-w-[40px]">+</button>
        </div>
        {addBtn(false)}
      </div>
    </>
  );
}
