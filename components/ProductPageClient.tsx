"use client";
import { useState } from "react";
import Link from "next/link";
import { serverAddToCart } from "@/app/actions/cart-actions";
import QuestionForm from "./QuestionForm";
import NewsletterSignup from "./NewsletterSignup";
import type { Locale } from "@/lib/translations";
import { t } from "@/lib/translations";

declare global { var fbq: ((...args: unknown[]) => void) | undefined; }

interface Variant { id: string; label: string; price: string; rawPrice?: string; }
interface Product { id: string; name: string; slug: string; description: string; basePrice: string; isLive: boolean; images: string[]; variants: Variant[]; }
interface Related { name: string; price: string; slug: string; }

function ImgBox({ url, alt }: { url: string; alt: string }) {
  return <img src={url} alt={alt} className="w-full h-full object-cover" />;
}

// WE-17: Tab component
function Tabs({ tabs, isHe }: { tabs: { id: string; label: string; content: React.ReactNode }[]; isHe: boolean }) {
  const [active, setActive] = useState(tabs[0].id);
  return (
    <div>
      <div className={`flex border-b gap-0 ${isHe ? "flex-row-reverse" : ""}`} style={{ borderColor: "#D4E6D4" }}>
        {tabs.map(tab => (
          <button key={tab.id} onClick={() => setActive(tab.id)}
            className={`px-4 py-3 text-xs font-semibold uppercase tracking-wide transition-colors touch-manipulation min-h-[44px] border-b-2 -mb-px ${
              active === tab.id ? "border-[#1B4332] text-[#1B4332]" : "border-transparent text-gray-500 hover:text-[#1A1A1A]"
            }`}>
            {tab.label}
          </button>
        ))}
      </div>
      <div className="py-4 text-sm leading-relaxed" style={{ color: "#1A1A1A" }}>
        {tabs.find(t => t.id === active)?.content}
      </div>
    </div>
  );
}

// WE-10: Trust strip beside Add to Cart
function TrustStrip({ isHe, locale }: { isHe: boolean; locale: Locale }) {
  const items = [
    { label: t(locale, "trust.securePayment"), svg: <svg viewBox="0 0 20 20" fill="none" stroke="#1B4332" strokeWidth={1.5} className="w-4 h-4"><path strokeLinecap="round" strokeLinejoin="round" d="M10 19s7-3.5 7-8.5V4L10 1.5 3 4v6.5C3 15.5 10 19 10 19z"/><path strokeLinecap="round" strokeLinejoin="round" d="M7 10l2 2 4-4"/></svg> },
    { label: t(locale, "trust.returns"), svg: <svg viewBox="0 0 20 20" fill="none" stroke="#1B4332" strokeWidth={1.5} className="w-4 h-4"><path strokeLinecap="round" strokeLinejoin="round" d="M3 8h8a5 5 0 010 10H3M3 8l3-3M3 8l3 3"/></svg> },
    { label: t(locale, "trust.invoice"), svg: <svg viewBox="0 0 20 20" fill="none" stroke="#1B4332" strokeWidth={1.5} className="w-4 h-4"><path strokeLinecap="round" strokeLinejoin="round" d="M7 3h9a1 1 0 011 1v13l-2-2-2 2-2-2-2 2-2-2-2 2V4a1 1 0 011-1h1M7 8h6M7 11h4"/></svg> },
    { label: t(locale, "trust.hebrewSupport"), svg: <svg viewBox="0 0 20 20" fill="none" stroke="#1B4332" strokeWidth={1.5} className="w-4 h-4"><path strokeLinecap="round" strokeLinejoin="round" d="M7 8h6M7 11h4M4 4h12a1 1 0 011 1v8a1 1 0 01-1 1H8l-4 3V5a1 1 0 011-1z"/></svg> },
  ];
  return (
    <div className={`grid grid-cols-2 gap-2 mt-3 ${isHe ? "direction-rtl" : ""}`}>
      {items.map(item => (
        <div key={String(item.label)} className={`flex items-center gap-1.5 text-xs ${isHe ? "flex-row-reverse" : ""}`} style={{ color: "#4A7C59" }}>
          {item.svg}
          <span>{item.label}</span>
        </div>
      ))}
    </div>
  );
}

export default function ProductPageClient({ product, locale = "en", waUrl, related }: { product: Product; locale?: Locale; waUrl?: string; related: Related[] }) {
  const [selectedVariant, setSelectedVariant] = useState(product.variants[0]?.id ?? "");
  const [qty, setQty] = useState(1);
  const [adding, setAdding] = useState(false);
  const [added, setAdded] = useState(false);
  const [mobileImg, setMobileImg] = useState(0);
  const [desktopImg, setDesktopImg] = useState(0);
  const [sizeOpen, setSizeOpen] = useState(false);
  const isHe = locale === "he";

  const sel = product.variants.find(v => v.id === selectedVariant) ?? product.variants[0];
  const price = sel?.price ?? product.basePrice;
  const priceNum = parseFloat((sel?.rawPrice ?? sel?.price ?? "0").replace(/[^0-9.]/g, "")) || 0;

  async function handleAddToCart() {
    setAdding(true);
    try {
      const result = await serverAddToCart(product.id, selectedVariant || null, qty);
      if (!result.ok) {
        console.error("[ProductPage] add to cart error:", result.error);
        setAdding(false);
        return;
      }
      if (typeof window !== "undefined" && window.fbq) {
        window.fbq("track", "AddToCart", { value: priceNum, currency: isHe ? "ILS" : "USD", content_ids: [product.id], content_name: product.name, content_type: "product" });
      }
      setAdded(true);

      // Full-page navigation so the browser applies the Set-Cookie headers from
      // the server action response before the /cart server render fires.
      // router.push() can race ahead of those headers and render an empty cart.
      window.location.href = "/cart";
    } catch (e) { console.error("[ProductPage] unexpected:", e); }
    finally { setAdding(false); }
  }

  const addBtn = (full: boolean, compact = false) => (
    <button onClick={handleAddToCart} disabled={adding}
      className={`${full ? "w-full" : "flex-1"} font-semibold text-sm uppercase tracking-wide transition-all touch-manipulation min-h-[52px]`}
      style={{
        background: added ? "#4A7C59" : adding ? "#D4E6D4" : "#1B4332",
        color: (adding && !added) ? "#1A1A1A" : "#FFFFFF",
        cursor: adding ? "not-allowed" : "pointer",
        padding: compact ? "0.75rem 1rem" : "1rem 2rem",
      }}>
      {added ? (isHe ? "נוסף לסל ✓" : "Added to Cart ✓") : adding ? t(locale, "adding") : `${t(locale, "add_to_cart")}${!compact && sel?.price ? ` — ${price}` : ""}`}
    </button>
  );

  const sizeDropdown = (
    <div className="mb-4">
      {product.variants.length > 1 && (
        <>
          <label className="block text-xs font-semibold uppercase tracking-wide mb-2" style={{ color: "#1A1A1A" }}>
            {t(locale, "size")}
          </label>
          <button onClick={() => setSizeOpen(!sizeOpen)}
            className={`w-full flex items-center justify-between px-4 py-3 border text-sm font-medium hover:border-[#1B4332] transition-colors touch-manipulation min-h-[44px] ${isHe ? "flex-row-reverse" : ""}`}
            style={{ background: "#FFFFFF", borderColor: "#D4E6D4", color: "#1A1A1A" }}>
            <span>{sel?.label ?? (isHe ? "בחר מידה" : "Select size")}</span>
            <svg className={`w-4 h-4 text-gray-400 transition-transform ${sizeOpen ? "rotate-180" : ""}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>
          {sizeOpen && (
            <div className="border border-[#D4E6D4]" style={{ background: "#FFFFFF" }}>
              {product.variants.map(v => (
                <button key={v.id} onClick={() => { setSelectedVariant(v.id); setSizeOpen(false); }}
                  className={`w-full flex items-center justify-between px-4 py-3 text-sm transition-colors touch-manipulation min-h-[44px] ${isHe ? "flex-row-reverse" : ""}`}
                  style={{
                    background: selectedVariant === v.id ? "#1B4332" : "#FFFFFF",
                    color: selectedVariant === v.id ? "#FFFFFF" : "#1A1A1A",
                  }}>
                  <span>{v.label}</span>
                  <span style={{ color: selectedVariant === v.id ? "#D4E6D4" : "#6B7280" }}>{v.price}</span>
                </button>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );

  const qtySelector = (
    <div className={`flex items-center border mb-4 ${isHe ? "flex-row-reverse" : ""}`} style={{ borderColor: "#D4E6D4" }}>
      <button onClick={() => setQty(q => Math.max(1, q - 1))} className="px-4 py-3 text-lg font-medium hover:bg-gray-50 touch-manipulation min-h-[44px] min-w-[44px]" style={{ color: "#1A1A1A" }}>−</button>
      <span className="flex-1 text-center text-sm font-semibold py-3 border-x" style={{ borderColor: "#D4E6D4", color: "#1A1A1A" }}>{qty}</span>
      <button onClick={() => setQty(q => q + 1)} className="px-4 py-3 text-lg font-medium hover:bg-gray-50 touch-manipulation min-h-[44px] min-w-[44px]" style={{ color: "#1A1A1A" }}>+</button>
    </div>
  );

  // WE-17: Tab content
  const descContent = (
    <div className={isHe ? "text-right" : ""}>
      {product.description.split("\n").map((line, i) => (
        <p key={i} className={line === "" ? "mt-3" : ""}>{line}</p>
      ))}
    </div>
  );
  const specsContent = (
    <div className={`space-y-2 ${isHe ? "text-right" : ""}`}>
      <p><strong>{isHe ? "נפח:" : "Volume:"}</strong> {isHe ? "350 / 520 / 750 מ״ל" : "350 / 520 / 750 ml"}</p>
      <p><strong>{isHe ? "משקל:" : "Weight:"}</strong> {isHe ? "180 גרם (בינוני)" : "180g (Medium)"}</p>
      <p><strong>{isHe ? "חומר:" : "Material:"}</strong> {isHe ? "HDPE בדרגת מזון, נטול BPA + סיליקון" : "BPA-free food-grade HDPE + silicone"}</p>
      <p><strong>{isHe ? "ניקוי:" : "Cleaning:"}</strong> {isHe ? "ניתן לשטיפה ידנית. הקערה מתאימה למדיח" : "Hand wash. Bowl is dishwasher safe"}</p>
      <p><strong>{isHe ? "צבעים:" : "Colors:"}</strong> {isHe ? "כחול, ורוד, טורקיז" : "Blue, Pink, Teal"}</p>
    </div>
  );
  const shippingContent = (
    <div className={`space-y-3 ${isHe ? "text-right" : ""}`}>
      <p><strong>{t(locale, "shipping.homeDelivery")}</strong></p>
      <ul className="space-y-1">
        <li>{t(locale, "shipping.businessDays")}</li>
        <li>{t(locale, "shipping.belowThreshold")}</li>
        <li>{t(locale, "shipping.aboveThreshold")}</li>
      </ul>
      <p className="mt-2" style={{ color: "#4A7C59" }}>{t(locale, "shipping.leadTime")}</p>
      <p className="text-xs" style={{ color: "#6B7280" }}>
        {isHe ? "14 ימי החזרה לפי חוק הגנת הצרכן הישראלי." : "14-day returns under Israeli Consumer Protection Law."}
      </p>
    </div>
  );
  const reviewsContent = (
    <div className={isHe ? "text-right" : ""}>
      <p style={{ color: "#6B7280" }}>{isHe ? "ביקורות יתווספו לאחר הזמנות ראשונות." : "Reviews will appear after first orders."}</p>
    </div>
  );

  const tabs = [
    { id: "desc", label: t(locale, "pdp.tabs.description"), content: descContent },
    { id: "specs", label: t(locale, "pdp.tabs.specs"), content: specsContent },
    { id: "reviews", label: t(locale, "pdp.tabs.reviews"), content: reviewsContent },
    { id: "shipping", label: t(locale, "pdp.tabs.shipping"), content: shippingContent },
  ];

  return (
    <>
      {/* Desktop layout */}
      <div className="hidden md:grid md:grid-cols-2 gap-10 lg:gap-16">
        {/* Gallery: main image + scrollable thumbnail strip — no cap */}
        <div className="flex flex-col gap-3">
          {/* Main large image */}
          <div className="relative aspect-square overflow-hidden" style={{ background: "#FFFFFF" }}>
            <ImgBox url={product.images[desktopImg] ?? ""} alt={`${product.name} ${desktopImg + 1}`} />
            <div className={`absolute top-3 flex flex-col gap-1 ${isHe ? "right-3" : "left-3"}`}>
              <span className="text-white text-xs font-bold px-2 py-0.5" style={{ background: "#1B4332" }}>{t(locale, "new_arrival")}</span>
              <span className="text-white text-xs font-bold px-2 py-0.5" style={{ background: "#4A7C59" }}>-50%</span>
            </div>
          </div>
          {/* Scrollable thumbnail strip — all images, no limit */}
          {product.images.length > 1 && (
            <div className="flex gap-2 overflow-x-auto pb-1" style={{ scrollbarWidth: "thin" }}>
              {product.images.map((url, i) => (
                <button
                  key={i}
                  onClick={() => setDesktopImg(i)}
                  className="flex-shrink-0 w-16 h-16 overflow-hidden border-2 transition-colors touch-manipulation"
                  style={{ borderColor: i === desktopImg ? "#1B4332" : "transparent", background: "#FFFFFF" }}
                  aria-label={`View image ${i + 1}`}
                >
                  <img src={url} alt={`${product.name} ${i + 1}`} className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Info panel */}
        <div className={`flex flex-col ${isHe ? "text-right" : ""}`}>
          <h1 className="text-2xl lg:text-3xl font-bold mb-2"
            style={{ fontFamily: isHe ? "Noto Serif Hebrew, Georgia, serif" : "Georgia, serif", color: "#1A1A1A" }}>
            {product.name}
          </h1>
          {/* WE-02: No fake ratings */}
          <div className="flex items-baseline gap-3 mb-5">
            <span className="text-2xl font-bold" style={{ fontFamily: "Georgia, serif", color: "#1B4332" }}>{price}</span>
            <span className="text-base line-through" style={{ color: "#9CA3AF" }}>
              {isHe ? "₪185" : "$49.99"}
            </span>
          </div>

          {sizeDropdown}
          {/* Stock urgency */}
          <div className={`flex items-center gap-2 mb-4 ${isHe ? "flex-row-reverse" : ""}`}>
            <span className="w-2 h-2 rounded-full bg-green-500"></span>
            <span className="text-xs font-semibold text-green-700 uppercase tracking-wide">
              {isHe ? "נותרו רק 3" : "Only 3 left"}
            </span>
          </div>

          {qtySelector}
          {addBtn(true)}

          {/* WE-10: Trust strip */}
          <TrustStrip isHe={isHe} locale={locale} />

          {/* WE-07: WhatsApp link on product page */}
          {waUrl && (
            <a href={waUrl} target="_blank" rel="noopener noreferrer"
              className={`flex items-center gap-2 mt-4 text-xs font-medium hover:opacity-80 transition-opacity touch-manipulation ${isHe ? "flex-row-reverse" : ""}`}
              style={{ color: "#25D366" }}>
              <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347zM12 0C5.373 0 0 5.373 0 12c0 2.123.558 4.117 1.535 5.845L0 24l6.335-1.509A11.944 11.944 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 21.818a9.818 9.818 0 01-5.006-1.374l-.357-.215-3.761.896.952-3.654-.234-.374A9.818 9.818 0 1112 21.818z"/>
              </svg>
              {t(locale, "support.whatsapp")}
            </a>
          )}

          {/* WE-17: Tabbed product detail */}
          <div className="mt-8 border-t" style={{ borderColor: "#D4E6D4" }}>
            <Tabs tabs={tabs} isHe={isHe} />
          </div>

          {/* Meta */}
          <div className={`mt-4 pt-4 border-t space-y-1 text-xs ${isHe ? "text-right" : ""}`} style={{ borderColor: "#D4E6D4", color: "#9CA3AF" }}>
            <p><span className="font-medium" style={{ color: "#1A1A1A" }}>SKU:</span> ST-M-001</p>
            <p><span className="font-medium" style={{ color: "#1A1A1A" }}>{isHe ? "קטגוריה:" : "Category:"}</span> {isHe ? "הידרציה" : "Hydration"}</p>
          </div>
        </div>
      </div>

      {/* Mobile layout */}
      <div className="md:hidden">
        {/* Carousel */}
        <div className="relative w-full aspect-[4/3] -mx-4 sm:mx-0 overflow-hidden mb-4" style={{ background: "#FFFFFF" }}>
          <img src={product.images[mobileImg]} alt={product.name} className="w-full h-full object-cover" />
          <div className={`absolute top-3 flex flex-col gap-1 ${isHe ? "right-3" : "left-3"}`}>
            <span className="text-white text-xs font-bold px-2 py-0.5" style={{ background: "#1B4332" }}>{t(locale, "new_arrival")}</span>
            <span className="text-white text-xs font-bold px-2 py-0.5" style={{ background: "#4A7C59" }}>-50%</span>
          </div>
          {product.images.length > 1 && (
            <>
              <button onClick={() => setMobileImg(i => (i - 1 + product.images.length) % product.images.length)}
                className="absolute top-1/2 -translate-y-1/2 w-9 h-9 bg-white/80 flex items-center justify-center shadow-sm touch-manipulation" style={{ [isHe ? "right" : "left"]: "0.5rem" }}>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
              </button>
              <button onClick={() => setMobileImg(i => (i + 1) % product.images.length)}
                className="absolute top-1/2 -translate-y-1/2 w-9 h-9 bg-white/80 flex items-center justify-center shadow-sm touch-manipulation" style={{ [isHe ? "left" : "right"]: "0.5rem" }}>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
              </button>
            </>
          )}
          <div className="absolute bottom-3 left-0 right-0 flex justify-center gap-1.5">
            {product.images.map((_, i) => (
              <button key={i} onClick={() => setMobileImg(i)} className={`rounded-full transition-all ${i === mobileImg ? "w-4 h-2 bg-[#1B4332]" : "w-2 h-2 bg-white/60"}`} />
            ))}
          </div>
        </div>

        <h1 className={`text-2xl font-bold mb-2 ${isHe ? "text-right" : ""}`}
          style={{ fontFamily: isHe ? "Noto Serif Hebrew, Georgia, serif" : "Georgia, serif", color: "#1A1A1A" }}>
          {product.name}
        </h1>
        <div className={`flex items-baseline gap-3 mb-5 ${isHe ? "flex-row-reverse" : ""}`}>
          <span className="text-2xl font-bold" style={{ color: "#1B4332" }}>{price}</span>
          <span className="text-sm line-through" style={{ color: "#9CA3AF" }}>{isHe ? "₪185" : "$49.99"}</span>
        </div>

        {sizeDropdown}
        <div className={`flex items-center gap-1.5 mb-3 ${isHe ? "flex-row-reverse" : ""}`}>
          <span className="w-2 h-2 rounded-full bg-green-500"></span>
          <span className="text-xs font-semibold text-green-700">{isHe ? "נותרו רק 2" : "Only 2 left"}</span>
        </div>
        {qtySelector}

        {/* Trust strip mobile */}
        <TrustStrip isHe={isHe} locale={locale} />

        {/* WhatsApp inline */}
        {waUrl && (
          <a href={waUrl} target="_blank" rel="noopener noreferrer"
            className={`flex items-center gap-2 mt-4 mb-4 text-xs font-medium ${isHe ? "flex-row-reverse" : ""}`}
            style={{ color: "#25D366" }}>
            <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347zM12 0C5.373 0 0 5.373 0 12c0 2.123.558 4.117 1.535 5.845L0 24l6.335-1.509A11.944 11.944 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 21.818a9.818 9.818 0 01-5.006-1.374l-.357-.215-3.761.896.952-3.654-.234-.374A9.818 9.818 0 1112 21.818z"/></svg>
            {t(locale, "support.whatsapp")}
          </a>
        )}

        {/* Tabs mobile */}
        <div className="border-t mb-4" style={{ borderColor: "#D4E6D4" }}>
          <Tabs tabs={tabs} isHe={isHe} />
        </div>
      </div>

      {/* Related products */}
      {related.length > 0 && (
        <div className="mt-12 border-t pt-10" style={{ borderColor: "#D4E6D4" }}>
          <h2 className={`text-xl font-bold mb-6 ${isHe ? "text-right" : ""}`} style={{ fontFamily: "Georgia, serif", color: "#1A1A1A" }}>
            {isHe ? "אולי גם תאהב" : "You Might Also Like"}
          </h2>
          <div className="grid grid-cols-3 gap-3 sm:gap-5">
            {related.map((rp) => (
              <Link key={rp.slug} href={`/products/${rp.slug}?lang=${locale}`}
                className="group border hover:shadow-md active:scale-[0.98] transition-all touch-manipulation"
                style={{ background: "#FFFFFF", borderColor: "#D4E6D4" }}>
                <div className="aspect-square bg-gray-100 flex items-center justify-center overflow-hidden">
                  <svg viewBox="0 0 24 24" fill="none" stroke="#D4E6D4" strokeWidth={1} className="w-12 h-12"><path d="M8 12h8M12 8v8"/><circle cx="12" cy="12" r="10"/></svg>
                </div>
                <div className={`p-3 ${isHe ? "text-right" : ""}`}>
                  <h3 className="font-semibold text-xs mb-1 line-clamp-2" style={{ color: "#1A1A1A" }}>{rp.name}</h3>
                  <p className="font-bold text-xs" style={{ color: "#1B4332" }}>{rp.price}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* Newsletter */}
      <div className="mt-10 p-6 sm:p-8 text-center border" style={{ background: "#1B4332", borderColor: "#1B4332" }}>
        <p className="font-bold mb-1" style={{ fontFamily: "Georgia, serif", color: "#FFFFFF" }}>
          {isHe ? "הישאר בעניינים" : "Stay in the loop"}
        </p>
        <p className="text-xs mb-4" style={{ color: "#D4E6D4" }}>{isHe ? "טיפים לטיולים ומוצרים חדשים" : "Trail tips, gear drops, and member deals."}</p>
        <div className="max-w-md mx-auto"><NewsletterSignup locale={locale} /></div>
      </div>

      {/* Mobile sticky bar */}
      <div className={`md:hidden fixed bottom-0 left-0 right-0 z-40 border-t px-4 py-3 flex items-center gap-3 shadow-lg ${isHe ? "flex-row-reverse" : ""}`} style={{ background: "#FFFFFF", borderColor: "#D4E6D4" }}>
        <div className={`flex items-center border flex-shrink-0 ${isHe ? "flex-row-reverse" : ""}`} style={{ borderColor: "#D4E6D4" }}>
          <button onClick={() => setQty(q => Math.max(1, q - 1))} className="px-3 py-2 text-lg font-medium touch-manipulation min-h-[44px] min-w-[40px]" style={{ color: "#1A1A1A" }}>−</button>
          <span className="px-3 py-2 text-sm font-semibold border-x min-w-[36px] text-center" style={{ borderColor: "#D4E6D4", color: "#1A1A1A" }}>{qty}</span>
          <button onClick={() => setQty(q => q + 1)} className="px-3 py-2 text-lg font-medium touch-manipulation min-h-[44px] min-w-[40px]" style={{ color: "#1A1A1A" }}>+</button>
        </div>
        {addBtn(false, true)}
      </div>
    </>
  );
}
