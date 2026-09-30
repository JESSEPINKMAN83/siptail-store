import type { Metadata } from "next";
import Link from "next/link";
import { getLocale } from "@/lib/locale";
import { BLOG_POSTS } from "@/lib/blog-posts";

export const dynamic = "force-dynamic";

const SITE_URL = "https://siptail-store.vercel.app";

export const metadata: Metadata = {
  title: "Dog Walking & Hiking Guides",
  description:
    "Expert guides on keeping your dog safe, hydrated and happy on walks and hikes. Tips on water, dehydration signs, gear and more.",
  openGraph: {
    title: "Dog Walking & Hiking Guides | Walk Essentials",
    description:
      "Expert guides on keeping your dog safe, hydrated and happy on walks and hikes.",
    url: `${SITE_URL}/blog`,
    type: "website",
    siteName: "Walk Essentials",
  },
  alternates: { canonical: `${SITE_URL}/blog` },
};

export default async function BlogListingPage() {
  const locale = await getLocale();
  const isHe = locale === "he";

  return (
    <div style={{ background: "#F5F4F0", minHeight: "100vh" }} dir={isHe ? "rtl" : "ltr"}>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">

        {/* Header */}
        <header className="mb-10">
          <p className="text-xs font-semibold uppercase tracking-widest mb-2" style={{ color: "#4A7C59" }}>
            Walk Essentials
          </p>
          <h1
            className="text-4xl font-bold mb-3"
            style={{ fontFamily: "Georgia, 'Times New Roman', serif", color: "#1A1A1A" }}
          >
            Dog Walking &amp; Hiking Guides
          </h1>
          <p className="text-base" style={{ color: "#6B7280" }}>
            Practical advice on keeping your dog safe, hydrated and happy on every walk.
          </p>
        </header>

        {/* Post grid */}
        <div className="grid sm:grid-cols-2 gap-6">
          {BLOG_POSTS.map((post) => (
            <Link
              key={post.slug}
              href={`/blog/${post.slug}`}
              className="block rounded-lg transition-shadow hover:shadow-md"
              style={{
                background: "#FFFFFF",
                border: "1px solid #D4E6D4",
                textDecoration: "none",
                padding: "1.5rem",
              }}
            >
              <p
                className="text-xs font-semibold uppercase tracking-wide mb-2"
                style={{ color: "#4A7C59" }}
              >
                Guide
              </p>
              <h2
                className="text-lg font-bold leading-snug mb-2"
                style={{ fontFamily: "Georgia, 'Times New Roman', serif", color: "#1A1A1A" }}
              >
                {post.title}
              </h2>
              <p className="text-sm" style={{ color: "#6B7280" }}>
                {post.excerpt}
              </p>
              <span
                className="inline-block mt-4 text-xs font-semibold"
                style={{ color: "#1B4332" }}
              >
                Read guide →
              </span>
            </Link>
          ))}
        </div>

        {/* CTA strip */}
        <div
          className="mt-12 p-6 rounded-lg text-center"
          style={{ background: "#1B4332" }}
        >
          <p
            className="text-lg font-bold mb-1"
            style={{ color: "#FFFFFF", fontFamily: "Georgia, serif" }}
          >
            Ready for your next walk?
          </p>
          <p className="text-sm mb-4" style={{ color: "#D4E6D4" }}>
            The SipTail Trail Bottle keeps your dog hydrated — one-handed, leak-proof, no mess.
          </p>
          <Link
            href="/products"
            className="inline-block px-6 py-2.5 text-sm font-semibold transition-colors"
            style={{
              background: "#FFFFFF",
              color: "#1B4332",
              borderRadius: "4px",
              textDecoration: "none",
            }}
          >
            Shop Now
          </Link>
        </div>
      </div>
    </div>
  );
}
