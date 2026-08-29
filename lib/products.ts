// TeqPet — static product catalog
// Source of truth for slugs, Wix product IDs (from the TeqPet Wix site), ILS prices, and categories.
// These 23 products are confirmed live on the TeqPet Wix backend (metaSiteId 44cb7e7b-183f-40d1-bcfd-7c2d95e536ab).

export const PRODUCTS = [
  // Smart Feeders (3)
  { slug: "\u05de\u05d6\u05d9\u05df-\u05d0\u05d5\u05d8\u05d5\u05de\u05d8\u05d9-wifi-\u05e2\u05dd-\u05de\u05e6\u05dc\u05de\u05d4-hd-4l",           wixId: "e1f0db48-a191-4a2c-a1ab-b27163eaf807", ils: 349, category: "smart-feeders" },
  { slug: "\u05de\u05d6\u05d9\u05df-\u05d0\u05d5\u05d8\u05d5\u05de\u05d8\u05d9-\u05db\u05e4\u05d5\u05dc-wifi-\u05e2\u05dd-\u05d0\u05e4\u05dc\u05d9\u05e7\u05e6\u05d9\u05d4-6l",       wixId: "fd902e22-a113-43f2-bb4c-7d8bf1bc7e39", ils: 299, category: "smart-feeders" },
  { slug: "\u05e7\u05e2\u05e8\u05ea-\u05d4\u05d0\u05db\u05dc\u05d4-\u05d0\u05d9\u05d8\u05d9\u05ea-\u05de\u05d7\u05e6\u05dc\u05ea-\u05dc\u05d9\u05e7\u05d5\u05e7-\u05e1\u05d9\u05dc\u05d9\u05e7\u05d5\u05df",         wixId: "112a75c4-9ed2-4ec5-8fa8-1f33325e6200", ils: 79,  category: "smart-feeders" },
  // Smart Water Fountains (3)
  { slug: "\u05de\u05d6\u05e8\u05e7\u05ea-\u05e0\u05d9\u05e8\u05d5\u05e1\u05d8\u05d4-\u05d7\u05e9\u05de\u05dc\u05d9\u05ea-25l-3-\u05e9\u05dc\u05d1\u05d9-\u05e1\u05d9\u05e0\u05d5\u05df",       wixId: "c84b3124-8220-401f-aab3-7e9c6871c273", ils: 199, category: "water-fountains" },
  { slug: "\u05de\u05d6\u05e8\u05e7\u05d4-\u05d0\u05dc\u05d7\u05d5\u05d8\u05d9\u05ea-35l-\u05e2\u05dd-\u05d7\u05d9\u05d9\u05e9\u05df-\u05ea\u05e0\u05d5\u05e2\u05d4-\u05de\u05e0\u05d5\u05e2-\u05e9\u05e7\u05d8",   wixId: "38be9bc1-cf4a-470f-8fbe-90d4fd11078a", ils: 249, category: "water-fountains" },
  { slug: "\u05de\u05d6\u05e8\u05e7\u05ea-\u05e0\u05d9\u05e8\u05d5\u05e1\u05d8\u05d4-\u05d0\u05dc\u05d7\u05d5\u05d8\u05d9\u05ea-32l-5000mah-\u05d7\u05d9\u05d9\u05e9\u05df-\u05ea\u05e0\u05d5\u05e2\u05d4", wixId: "c43a6814-27de-4523-870c-22df3b59259e", ils: 279, category: "water-fountains" },
  // GPS Trackers (2)
  { slug: "\u05d2\u05e9\u05de\u05df-gps-\u05de\u05d9\u05e0\u05d9-\u05e7\u05dc\u05d9\u05e4-\u05d0\u05d5\u05df-bluetooth-gps-\u05dc\u05dc\u05d0-sim", wixId: "6b5b8fca-fc83-4992-a43d-100a91790228", ils: 149, category: "gps-tracking" },
  { slug: "\u05d2\u05e9\u05de\u05df-gps-\u05e2\u05de\u05d9\u05d3-\u05dc\u05de\u05d9\u05dd-\u05e2\u05dd-\u05de\u05d9\u05e7\u05d5\u05dd-\u05d1\u05d6\u05de\u05df-\u05d0\u05de\u05ea",         wixId: "0dae9cb9-68d5-49c7-aaf5-5eebf7d961f8", ils: 199, category: "gps-tracking" },
  // Smart Toys (2)
  { slug: "\u05e6\u05e2\u05e6\u05d5\u05e2-\u05dc\u05d9\u05d9\u05d6\u05e8-\u05d0\u05d5\u05d8\u05d5\u05de\u05d8\u05d9-\u05dc\u05d7\u05ea\u05d5\u05dc\u05d9\u05dd-360-usb-c",        wixId: "b540f03a-3ee8-4263-bfb7-22d318511d52", ils: 99,  category: "smart-toys" },
  { slug: "\u05e6\u05e2\u05e6\u05d5\u05e2-\u05e2\u05e6\u05dd-\u05de\u05ea\u05d2\u05dc\u05d2\u05dc-\u05d7\u05db\u05dd-\u05dc\u05db\u05dc\u05d1\u05d9\u05dd-usb-c",            wixId: "d07763eb-9cab-4068-a72c-abcc0a4be2a9", ils: 89,  category: "smart-toys" },
  // Grooming Tech (4)
  { slug: "\u05de\u05d1\u05e8\u05e9\u05ea-\u05d2\u05e8\u05d9\u05e4\u05d4-3-\u05d1-1-\u05e2\u05dd-\u05e7\u05d9\u05d8\u05d5\u05e8-\u05d4\u05d5\u05e8\u05d3\u05ea-\u05e9\u05d9\u05e2\u05e8-\u05e8\u05d9\u05e1\u05d5\u05e1-\u05e2\u05d9\u05e1\u05d5\u05d9", wixId: "8d2672cb-6b27-4b5d-b3fd-342bcdf78fdf", ils: 149, category: "tech-grooming" },
  { slug: "\u05de\u05e0\u05e7\u05d4-\u05db\u05e4\u05d5\u05ea-\u05d7\u05e9\u05de\u05dc\u05d9-usb-c-\u05de\u05d1\u05e8\u05e9\u05ea-\u05e1\u05d9\u05dc\u05d9\u05e7\u05d5\u05df",           wixId: "3e89c0a5-740e-4cab-baff-c5dc91e94999", ils: 89,  category: "tech-grooming" },
  { slug: "\u05de\u05e9\u05d7\u05d6\u05ea-\u05e6\u05d9\u05e4\u05d5\u05e8\u05e0\u05d9\u05d9\u05dd-\u05d7\u05e9\u05de\u05dc\u05d9\u05ea-3-\u05de\u05d4\u05d9\u05e8\u05d5\u05d9\u05d5\u05ea-usb-c-\u05e9\u05e7\u05d8",   wixId: "2376d667-2b5b-4fb3-832b-6969d6b9ab2f", ils: 99,  category: "tech-grooming" },
  { slug: "\u05de\u05e1\u05e4\u05e8\u05d9\u05d9\u05dd-\u05de\u05e9\u05d7\u05d6\u05ea-\u05e6\u05d9\u05e4\u05d5\u05e8\u05e0\u05d9\u05d9\u05dd-2-\u05d1-1-\u05e2\u05dd-\u05ea\u05d0\u05d5\u05e8\u05ea-led",    wixId: "8a70eb2c-cb46-4db6-a89a-c705c8122158", ils: 79,  category: "tech-grooming" },
  // Grooming Accessories (1)
  { slug: "\u05de\u05d2\u05d1\u05d5\u05e0\u05d9\u05dd-\u05dc\u05d0\u05e6\u05d1\u05e2-3-\u05d1-1-\u05dc\u05d7\u05d9\u05d5\u05ea-\u05de\u05d7\u05de\u05d3-50-\u05d9\u05d7\u05d9\u05d3\u05d5\u05ea-\u05e9\u05d9\u05e0\u05d9\u05d9\u05dd-\u05e2\u05d9\u05e0\u05d9\u05d9\u05dd-\u05d0\u05d5\u05d6\u05e0\u05d9\u05d9\u05dd", wixId: "ca1c7a83-2f5a-47f8-8f66-581d8130accb", ils: 49,  category: "grooming-accessories" },
  // Travel Accessories (4)
  { slug: "\u05d1\u05e7\u05d1\u05d5\u05e7-\u05e0\u05e1\u05d9\u05e2\u05d4-2-\u05d1-1-\u05e0\u05d9\u05e8\u05d5\u05e1\u05d8\u05d4-285ml-\u05de\u05ea\u05e7\u05e4\u05dc-\u05dc\u05e7\u05e2\u05e8\u05d4",  wixId: "34de7c6b-68f7-4091-b71b-614bbb1855d2", ils: 79,  category: "travel-accessories" },
  { slug: "\u05ea\u05d9\u05e7-\u05d2\u05d1-\u05e0\u05e9\u05d9\u05d0\u05d4-\u05e4\u05e8\u05d9\u05de\u05d9\u05d5\u05dd-\u05dc\u05d7\u05ea\u05d5\u05dc\u05d9\u05dd-\u05d5\u05db\u05dc\u05d1\u05d9\u05dd-\u05e7\u05d8\u05e0\u05d9\u05dd-\u05d7\u05dc\u05d5\u05df-\u05e2\u05d2\u05d5\u05dc", wixId: "5be6abba-5db3-4169-ba57-79be29b09d70", ils: 249, category: "travel-accessories" },
  { slug: "\u05e8\u05ea\u05de\u05ea-\u05d1\u05d8\u05d9\u05d7\u05d5\u05ea-\u05dc\u05e8\u05db\u05d1-\u05dc\u05db\u05dc\u05d1\u05d9\u05dd-\u05d0\u05d1\u05d6\u05dd-crash-tested-\u05e8\u05e4\u05dc\u05e7\u05d8\u05d9\u05d1\u05d9", wixId: "ad5b9d16-6d2f-4668-92f0-15f318d57dd5", ils: 129, category: "travel-accessories" },
  { slug: "\u05e8\u05e6\u05d5\u05e2\u05ea-\u05db\u05dc\u05d1-hands-free-\u05e2\u05dd-\u05d1\u05e0\u05d2\u05d9-\u05e8\u05e4\u05dc\u05e7\u05d8\u05d9\u05d1\u05d9-\u05db\u05d9\u05e1-\u05dc\u05d8\u05dc\u05e4\u05d5\u05df", wixId: "1186163b-f3d4-4b6d-97aa-434bf8edeabe", ils: 99,  category: "travel-accessories" },
  // Pet Cameras (2)
  { slug: "\u05de\u05e6\u05dc\u05de\u05ea-\u05d7\u05d9\u05d5\u05ea-\u05de\u05d6\u05d9\u05df-\u05e4\u05d9\u05e0\u05d5\u05e7\u05d9\u05dd-hd-\u05e9\u05de\u05e2-\u05d3\u05d5-\u05db\u05d9\u05d5\u05d5\u05e0\u05d9-\u05e9\u05dc\u05d9\u05d8\u05d4-\u05de\u05e8\u05d7\u05d5\u05e7", wixId: "94341fe6-9556-47cd-bd7e-90d06558f113", ils: 299, category: "pet-cameras" },
  { slug: "\u05de\u05e6\u05dc\u05de\u05ea-\u05d7\u05d9\u05d5\u05ea-\u05de\u05d7\u05de\u05d3-1080p-\u05e8\u05d0\u05d9\u05d9\u05ea-\u05dc\u05d9\u05dc\u05d4-\u05e9\u05de\u05e2-\u05d3\u05d5-\u05db\u05d9\u05d5\u05d5\u05e0\u05d9-wifi", wixId: "44664d1f-9dcb-4504-8ed6-eed93835faf1", ils: 199, category: "pet-cameras" },
  // Activity Monitors (2)
  { slug: "\u05ea\u05d2-\u05de\u05d5\u05e0\u05d9\u05d8\u05d5\u05e8-\u05d1\u05e8\u05d9\u05d0\u05d5\u05ea-\u05dc\u05d7\u05d9\u05d5\u05ea-\u05e9\u05d9\u05e0\u05d4-\u05e7\u05dc\u05d5\u05e8\u05d9\u05d5\u05ea-\u05e6\u05e2\u05d3\u05d9\u05dd-\u05dc\u05dc\u05d0-gps", wixId: "d02c1336-c429-48a6-8148-cf48ffe2174d", ils: 99,  category: "activity-monitors" },
  { slug: "\u05de\u05e2\u05e7\u05d1-\u05e4\u05e2\u05d9\u05dc\u05d5\u05ea-\u05d7\u05db\u05dd-\u05dc\u05e6\u05d5\u05d5\u05d0\u05e8\u05d5\u05df-gps-\u05e1\u05e4\u05d9\u05e8\u05ea-\u05e6\u05e2\u05d3\u05d9\u05dd-\u05d1\u05e8\u05d9\u05d0\u05d5\u05ea", wixId: "4d673c49-78ed-4a21-bf8f-abcaf601faf6", ils: 149, category: "activity-monitors" },
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
  return `\u20aa${ils}`;
}
