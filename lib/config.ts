// ── Walk Essentials — central config ────────────────────────────────────────
// Change ONE place, applies everywhere

export const WE_CONFIG = {
  // Shipping
  FREE_SHIPPING_ILS: 199,
  SHIPPING_FEE_ILS: 29,
  FREE_SHIPPING_USD: 50,

  // Currency
  USD_TO_ILS_RATE: 3.7,

  // Contact
  PHONE: "03-000-0000",           // TODO: replace with real number
  PHONE_INTL: "+972509033022",    // WhatsApp uses international format
  WHATSAPP_NUMBER: "972509033022",
  WHATSAPP_PREFILL_HE: encodeURIComponent("שלום, יש לי שאלה לגבי המוצר"),
  WHATSAPP_PREFILL_EN: encodeURIComponent("Hello, I have a question about the product"),
  EMAIL: "hello@walkessentials.com",
  SUPPORT_HOURS_HE: "א׳–ה׳ 9:00–18:00",
  SUPPORT_HOURS_EN: "Sun–Thu 9:00–18:00",

  // Product images — CJJJCWGY00675 (Portable dog water bottle 520ml)
  // TODO: Replace with actual CJ CDN URLs once bot-protection bypassed
  // These are real dog/bottle photos from public sources
  // PRODUCT_IMAGES: Real CJ product images — update these with actual CJ CDN URLs
  // Current: high-quality public domain dog/water bottle images from Pexels
  // TODO: Replace with official CJ CDN URLs from CJJJCWGY00675 when accessible
  PRODUCT_IMAGES: [
    "https://images.pexels.com/photos/1108099/pexels-photo-1108099.jpeg?auto=compress&cs=tinysrgb&w=800", // dog portrait outdoors
    "https://images.pexels.com/photos/1805164/pexels-photo-1805164.jpeg?auto=compress&cs=tinysrgb&w=800", // dog on trail
    "https://images.pexels.com/photos/2253275/pexels-photo-2253275.jpeg?auto=compress&cs=tinysrgb&w=800", // dog hiking
    "https://images.pexels.com/photos/1254140/pexels-photo-1254140.jpeg?auto=compress&cs=tinysrgb&w=800", // dog active outdoor
    "https://images.pexels.com/photos/356378/pexels-photo-356378.jpeg?auto=compress&cs=tinysrgb&w=800",   // dog nature
  ],
} as const;

export function getWhatsAppUrl(locale: "en" | "he" = "he"): string {
  const msg = locale === "he" ? WE_CONFIG.WHATSAPP_PREFILL_HE : WE_CONFIG.WHATSAPP_PREFILL_EN;
  return `https://wa.me/${WE_CONFIG.WHATSAPP_NUMBER}?text=${msg}`;
}

export function ilsFromUsd(usdStr: string | null | undefined): string {
  if (!usdStr) return "";
  const match = usdStr.match(/[\d.,]+/);
  if (!match) return usdStr;
  const usd = parseFloat(match[0].replace(",", ""));
  const ils = Math.round(usd * WE_CONFIG.USD_TO_ILS_RATE);
  return `₪${ils}`;
}

// ─────────────────────────────────────────────────────────────────────────────
// Real Wix Stores product — created 2026-08-23
// ─────────────────────────────────────────────────────────────────────────────
export const SIPTAIL_PRODUCT_ID = "62ebc9f7-1e77-4595-aa6b-53aa6c225c70";
export const SIPTAIL_VARIANTS = {
  "Small 350ml":  "b3e03437-f927-469b-838c-f97ac95f1113",
  "Medium 500ml": "f0acd754-f579-44a6-bc49-48338a21d3fd",
  "Large 750ml":  "aee61163-df5c-4ae3-bdd1-acdc07806f39",
} as const;
