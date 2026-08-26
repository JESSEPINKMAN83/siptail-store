// Walk Essentials — static product catalog
// Source of truth for slugs, Wix product IDs, ₪ prices, categories, and hero image fallbacks.
// Wix API provides images and stock status; this file provides everything else.
// heroImage is a fallback shown while Wix media propagates, sourced from CJ Dropshipping CDN.

export const PRODUCTS = [
  { slug: "siptail-trail-bottle",       wixId: "62ebc9f7-1e77-4595-aa6b-53aa6c225c70", ils: 59,  category: "dog-gear",            heroImage: "https://cdn.cjdropshipping.com/product/1510128912444985344/1.jpg" },
  { slug: "trailcool-cooling-vest",     wixId: "040a4d17-a53c-420a-9a48-3a22789c93a0", ils: 69,  category: "dog-gear",            heroImage: "https://cj-product-center.oss-accelerate.aliyuncs.com/supplier/1688/e201847b-8a49-4425-b51f-f5613ce55c2e.jpg" },
  { slug: "trailpop-dog-bowl",          wixId: "5582bb18-81b8-44f7-9b99-e969098623c2", ils: 29,  category: "dog-gear",            heroImage: "https://cf.cjdropshipping.com/78e7e883-a610-4c7d-a0f8-d2e3e99e3a66.jpg" },
  { slug: "trailrun-hands-free-leash",  wixId: "8e47c5f5-f179-4f00-b3c5-f235329bd650", ils: 39,  category: "dog-gear",            heroImage: "https://cj-product-center.oss-accelerate.aliyuncs.com/supplier/1688/0a234bad-1817-4b4c-b7f5-ac06cf0ddaa5.jpg" },
  { slug: "coolwrap-trail-towel",       wixId: "102495a8-2ec2-45cf-b038-74a6368d2806", ils: 29,  category: "hiking-gear",         heroImage: "https://cf.cjdropshipping.com/17870112/36ce14fc-3fd5-40e8-8f60-acba82796371.jpg" },
  { slug: "trailtrack-dog-harness",     wixId: "e81ea2b2-a15f-406d-915a-afe1001ab463", ils: 89,  category: "dog-gear",            heroImage: "https://cj-product-center.oss-accelerate.aliyuncs.com/supplier/1688/5d63fce0-01c9-425a-b06d-92bfece7a882.jpg" },
  { slug: "trailshield-phone-pouch",    wixId: "92c0f7ed-4cdd-437b-b646-5c3238009274", ils: 39,  category: "outdoor-accessories", heroImage: "https://cj-product-center.oss-accelerate.aliyuncs.com/supplier/1688/79b1012b-85c2-4c7c-8a88-25f96b001ab6.jpg" },
  { slug: "coolrest-dog-mat",           wixId: "be4266f0-4d97-4c1c-abcb-71635c567089", ils: 69,  category: "dog-gear",            heroImage: "https://cf.cjdropshipping.com/quick/product/c2f365fa-fa4e-4865-9d19-3be1672092bc.jpg" },
  { slug: "aquatrail-dog-life-jacket",  wixId: "464f0043-5b70-4341-9cbe-fbbff7529678", ils: 89,  category: "dog-gear",            heroImage: "https://cj-product-center.oss-accelerate.aliyuncs.com/supplier/1688/5d63fce0-01c9-425a-b06d-92bfece7a882.jpg" },
  { slug: "trailpaws-dog-boots",        wixId: "2c424565-1a38-4617-bce1-a17609a12a14", ils: 49,  category: "dog-gear",            heroImage: "https://cj-product-center.oss-accelerate.aliyuncs.com/supplier/1688/c8b43a6a-f066-4c07-8e36-f592ac5e767d.jpg" },
  { slug: "trailpaws-paw-wax",          wixId: "eac5dace-e7f0-4a74-b2c5-5ffffd5036ff", ils: 29,  category: "dog-gear",            heroImage: "https://cj-product-center.oss-accelerate.aliyuncs.com/supplier/1688/c8b43a6a-f066-4c07-8e36-f592ac5e767d.jpg" },
  { slug: "trailvest-hydration-pack",   wixId: "d51e5da0-bead-4d96-b419-f1af3b1b583d", ils: 119, category: "hiking-gear",         heroImage: "https://cf.cjdropshipping.com/fecc7fed-2dc9-459c-a7a9-d9c74aab2a10.png" },
  { slug: "trailshade-sun-hat",         wixId: "49af0250-bc1c-4b54-b95f-ba934ff07b68", ils: 39,  category: "hiking-gear",         heroImage: "https://cf.cjdropshipping.com/quick/product/0fa45535-2f4e-445f-a02e-c630ad79a9d9.jpg" },
  { slug: "trailrest-blanket",          wixId: "d2704572-3f82-4773-915f-bd15dc606855", ils: 69,  category: "outdoor-accessories", heroImage: "https://cf.cjdropshipping.com/e33e9b03-70de-4129-9874-c9a7fac79c66.jpg" },
  { slug: "trailguard-repellent-bands", wixId: "57ea99f1-5799-4ac9-a028-e784fe77ff0d", ils: 25,  category: "outdoor-accessories", heroImage: "https://cf.cjdropshipping.com/05c65cf0-7eef-40c8-bca4-d1ccedf6a2e1.jpg" },
  { slug: "trailcharge-solar-bank",     wixId: "4d6a679e-1f87-493f-97f7-4ef02217fab1", ils: 79,  category: "outdoor-accessories", heroImage: "https://cf.cjdropshipping.com/quick/product/a7eacc6d-f82e-4bca-b8eb-105a8105124a.jpg" },
  { slug: "trailduo-double-dog-leash",  wixId: "77ad3d1d-09f2-4a0f-a07b-39647aae16bf", ils: 29,  category: "dog-gear",            heroImage: "https://cf.cjdropshipping.com/15445440/6458130631125.jpg" },
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
