import { MetadataRoute } from "next";

const BASE = "https://siptail-store.vercel.app";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    { url: BASE,                           lastModified: new Date(), changeFrequency: "daily",  priority: 1 },
    { url: `${BASE}/products`,             lastModified: new Date(), changeFrequency: "daily",  priority: 0.9 },
    { url: `${BASE}/products?cat=smart-feeders`,       lastModified: new Date(), changeFrequency: "weekly", priority: 0.8 },
    { url: `${BASE}/products?cat=water-fountains`,     lastModified: new Date(), changeFrequency: "weekly", priority: 0.8 },
    { url: `${BASE}/products?cat=gps-tracking`,        lastModified: new Date(), changeFrequency: "weekly", priority: 0.8 },
    { url: `${BASE}/products?cat=smart-toys`,          lastModified: new Date(), changeFrequency: "weekly", priority: 0.8 },
    { url: `${BASE}/products?cat=tech-grooming`,       lastModified: new Date(), changeFrequency: "weekly", priority: 0.7 },
    { url: `${BASE}/products?cat=grooming-accessories`,lastModified: new Date(), changeFrequency: "weekly", priority: 0.7 },
    { url: `${BASE}/products?cat=travel-accessories`,  lastModified: new Date(), changeFrequency: "weekly", priority: 0.7 },
    { url: `${BASE}/products?cat=pet-cameras`,         lastModified: new Date(), changeFrequency: "weekly", priority: 0.7 },
    { url: `${BASE}/products?cat=activity-monitors`,   lastModified: new Date(), changeFrequency: "weekly", priority: 0.7 },
    { url: `${BASE}/contact`,              lastModified: new Date(), changeFrequency: "monthly", priority: 0.6 },
  ];
}
