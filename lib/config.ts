// ── TeqPet — central config ──────────────────────────────────────────────────
// Change ONE place, applies everywhere

export const TEQPET_LOGO_URL = "https://static.wixstatic.com/media/70d502_e3e96278eb1444ef83de9003d1ad6795~mv2.jpg";

export const WE_CONFIG = {
  // Shipping
  FREE_SHIPPING_ILS: 149,
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
  EMAIL: "hello@teqpet.com",
  SUPPORT_HOURS_HE: "א׳–ה׳ 9:00–18:00",
  SUPPORT_HOURS_EN: "Sun–Thu 9:00–18:00",

  // Product images — TeqPet logo as default placeholder
  PRODUCT_IMAGES: [
    "https://static.wixstatic.com/media/70d502_e3e96278eb1444ef83de9003d1ad6795~mv2.jpg",
    "https://static.wixstatic.com/media/70d502_6f9c72717a5c4e79b164c77b6b9f7551~mv2.jpg",
    "https://static.wixstatic.com/media/70d502_96ef2f76e9934a03897754717970efbd~mv2.jpg",
    "https://images.pexels.com/photos/1108099/pexels-photo-1108099.jpeg?auto=compress&cs=tinysrgb&w=800",
    "https://images.pexels.com/photos/1805164/pexels-photo-1805164.jpeg?auto=compress&cs=tinysrgb&w=800",
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

// Legacy compat — product IDs unchanged
export const SIPTAIL_PRODUCT_ID = "62ebc9f7-1e77-4595-aa6b-53aa6c225c70";
export const SIPTAIL_VARIANTS = {
  "Small 350ml":  "b3e03437-f927-469b-838c-f97ac95f1113",
  "Medium 500ml": "f0acd754-f579-44a6-bc49-48338a21d3fd",
  "Large 750ml":  "aee61163-df5c-4ae3-bdd1-acdc07806f39",
} as const;
