// Walk Essentials — static product catalog
// Source of truth for slugs, Wix product IDs, ₪ prices, categories, and hero image fallbacks.
// Wix API provides images and stock status; this file provides everything else.
// heroImage is a fallback shown while Wix media propagates, sourced from CJ Dropshipping CDN.

export const PRODUCTS = [
  { slug: "siptail-trail-bottle",       wixId: "62ebc9f7-1e77-4595-aa6b-53aa6c225c70", ils: 99,  category: "dog-gear",            heroImage: "https://cdn.cjdropshipping.com/product/1510128912444985344/1.jpg" },
  { slug: "trailcool-cooling-vest",     wixId: "040a4d17-a53c-420a-9a48-3a22789c93a0", ils: 129, category: "dog-gear",            heroImage: "https://cdn.cjdropshipping.com/product/1510128912444985344/1.jpg" },
  { slug: "trailpop-dog-bowl",          wixId: "5582bb18-81b8-44f7-9b99-e969098623c2", ils: 49,  category: "dog-gear",            heroImage: "https://cdn.cjdropshipping.com/quick/product/dce14551-463b-41fd-922d-328abc11d4e4.jpg" },
  { slug: "trailrun-hands-free-leash",  wixId: "8e47c5f5-f179-4f00-b3c5-f235329bd650", ils: 69,  category: "dog-gear",            heroImage: "https://cdn.cjdropshipping.com/quick/product/cjjjcwgy04596-main.jpg" },
  { slug: "coolwrap-trail-towel",       wixId: "102495a8-2ec2-45cf-b038-74a6368d2806", ils: 49,  category: "hiking-gear",         heroImage: "https://cdn.cjdropshipping.com/quick/product/pva-cooling-towel-tube-main.jpg" },
  { slug: "trailtrack-dog-harness",     wixId: "e81ea2b2-a15f-406d-915a-afe1001ab463", ils: 149, category: "dog-gear",            heroImage: "https://cdn.cjdropshipping.com/quick/product/tactical-dog-harness-handle-main.jpg" },
  { slug: "trailshield-phone-pouch",    wixId: "92c0f7ed-4cdd-437b-b646-5c3238009274", ils: 59,  category: "outdoor-accessories", heroImage: "https://cdn.cjdropshipping.com/quick/product/ipx8-floating-phone-pouch-main.jpg" },
  { slug: "coolrest-dog-mat",           wixId: "be4266f0-4d97-4c1c-abcb-71635c567089", ils: 99,  category: "dog-gear",            heroImage: "https://cdn.cjdropshipping.com/product/1383749721731174400/1.jpg" },
  { slug: "aquatrail-dog-life-jacket",  wixId: "464f0043-5b70-4341-9cbe-fbbff7529678", ils: 149, category: "dog-gear",            heroImage: "https://cdn.cjdropshipping.com/quick/product/dog-life-jacket-ripstop-main.jpg" },
  { slug: "trailpaws-dog-boots",        wixId: "2c424565-1a38-4617-bce1-a17609a12a14", ils: 89,  category: "dog-gear",            heroImage: "https://cdn.cjdropshipping.com/product/1589146193309605888/1.jpg" },
  { slug: "trailpaws-paw-wax",          wixId: "eac5dace-e7f0-4a74-b2c5-5ffffd5036ff", ils: 49,  category: "dog-gear",            heroImage: "https://cdn.cjdropshipping.com/product/1589254367352827904/1.jpg" },
  { slug: "trailvest-hydration-pack",   wixId: "d51e5da0-bead-4d96-b419-f1af3b1b583d", ils: 199, category: "hiking-gear",         heroImage: "https://cdn.cjdropshipping.com/quick/product/trail-running-hydration-vest-2l-main.jpg" },
  { slug: "trailshade-sun-hat",         wixId: "49af0250-bc1c-4b54-b95f-ba934ff07b68", ils: 59,  category: "hiking-gear",         heroImage: "https://cdn.cjdropshipping.com/quick/product/upf50-packable-hiking-hat-main.jpg" },
  { slug: "trailrest-blanket",          wixId: "d2704572-3f82-4773-915f-bd15dc606855", ils: 99,  category: "outdoor-accessories", heroImage: "https://cdn.cjdropshipping.com/quick/product/waterproof-picnic-blanket-tote-main.jpg" },
  { slug: "trailguard-repellent-bands", wixId: "57ea99f1-5799-4ac9-a028-e784fe77ff0d", ils: 39,  category: "outdoor-accessories", heroImage: "https://cdn.cjdropshipping.com/quick/product/citronella-repellent-wristband-main.jpg" },
  { slug: "trailcharge-solar-bank",     wixId: "4d6a679e-1f87-493f-97f7-4ef02217fab1", ils: 129, category: "outdoor-accessories", heroImage: "https://cdn.cjdropshipping.com/product/1718163556096503808/1.jpg" },
] as const;

export type ProductSlug = typeof PRODUCTS[number]["slug"];
export type ProductCategory = typeof PRODUCTS[number]["category"];

/** Look up a product by its slug. Returns undefined when not found. */
export function getProductBySlug(slug: string) {
  return PRODUCTS.find((p) => p.slug === slug);
}

/** Look up a product by its Wix product ID. Returns undefined when not found. */
export function getProductByWixId(wixId: string) {
  return PRODUCTS.find((p) => p.wixId === wixId);
}

/** Format an ILS price for display. */
export function formatIls(ils: number): string {
  return `₪${ils}`;
}
