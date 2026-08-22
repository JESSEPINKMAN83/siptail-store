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
  PRODUCT_IMAGES: [
    "https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=800&q=80", // dog drinking water
    "https://images.unsplash.com/photo-1601758125946-6ec2ef64daf8?w=800&q=80", // pet water bottle
    "https://images.unsplash.com/photo-1548199973-03cce0bbc87b?w=800&q=80",   // dog outdoors
    "https://images.unsplash.com/photo-1450778869180-41d0601e046e?w=800&q=80", // dog hiking
    "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&q=80",   // dog trail
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
