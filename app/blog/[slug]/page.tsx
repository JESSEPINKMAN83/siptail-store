import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { getLocale } from "@/lib/locale";
import { getPostBySlug, BLOG_POSTS } from "@/lib/blog-posts";
import { getWixVisitorToken, WIX_SITE_ID } from "@/lib/wix-client";

export const dynamic = "force-dynamic";

const SITE_URL = "https://siptail-store.vercel.app";

// --- generateStaticParams ---------------------------------------------------
export function generateStaticParams() {
  return BLOG_POSTS.map((p) => ({ slug: p.slug }));
}

// --- generateMetadata -------------------------------------------------------
export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = getPostBySlug(slug);

  if (!post) {
    return { title: "Post not found" };
  }

  const canonical = `${SITE_URL}/blog/${post.slug}`;

  return {
    title: post.seoTitle,
    description: post.seoDescription,
    openGraph: {
      title: post.seoTitle,
      description: post.seoDescription,
      url: canonical,
      type: "article",
      siteName: "Walk Essentials",
    },
    twitter: {
      card: "summary_large_image",
      title: post.seoTitle,
      description: post.seoDescription,
    },
    alternates: {
      canonical,
    },
  };
}

// --- Wix Blog post fetch ----------------------------------------------------
async function fetchPostContent(postId: string): Promise<string | null> {
  try {
    const token = await getWixVisitorToken();
    if (!token) return null;

    const res = await fetch(
      `https://www.wixapis.com/blog/v3/posts/${postId}?fieldsets=CONTENT`,
      {
        headers: {
          Authorization: token,
          "wix-site-id": WIX_SITE_ID,
        },
        next: { revalidate: 3600 },
      }
    );

    if (!res.ok) return null;

    const data = await res.json().catch(() => ({}));
    const nodes = data?.post?.richContent?.nodes ?? [];
    const lines: string[] = [];
    for (const node of nodes) {
      extractText(node, lines);
    }
    return lines.filter(Boolean).join("\n\n") || null;
  } catch {
    return null;
  }
}

function extractText(node: Record<string, unknown>, out: string[]): void {
  if (!node || typeof node !== "object") return;
  const type = node.type as string | undefined;
  const nodes = (node.nodes as Record<string, unknown>[] | undefined) ?? [];

  if (type === "TEXT") {
    const text = (node as { textData?: { text?: string } }).textData?.text ?? "";
    if (text.trim()) out.push(text);
    return;
  }

  for (const child of nodes) {
    extractText(child, out);
  }
}

// --- Page component ---------------------------------------------------------
export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const locale = await getLocale();
  const isHe = locale === "he";

  const post = getPostBySlug(slug);
  if (!post) notFound();

  const content = await fetchPostContent(post.id);
  const otherPosts = BLOG_POSTS.filter((p) => p.slug !== post.slug);

  return (
    <div style={{ background: "#F5F4F0", minHeight: "100vh" }} dir={isHe ? "rtl" : "ltr"}>
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-10">

        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-xs mb-8" style={{ color: "#6B7280" }}>
          <Link href="/" className="hover:text-[#1B4332] transition-colors">Home</Link>
          <span style={{ color: "#D4E6D4" }}>&rsaquo;</span>
          <Link href="/blog" className="hover:text-[#1B4332] transition-colors">Blog</Link>
          <span style={{ color: "#D4E6D4" }}>&rsaquo;</span>
          <span style={{ color: "#1A1A1A" }}>{post.title}</span>
        </nav>

        {/* Article */}
        <article>
          <header className="mb-8">
            <p className="text-xs font-semibold uppercase tracking-widest mb-3" style={{ color: "#4A7C59" }}>
              Walk Essentials Guide
            </p>
            <h1
              className="text-3xl sm:text-4xl font-bold leading-tight mb-4"
              style={{ fontFamily: "Georgia, 'Times New Roman', serif", color: "#1A1A1A" }}
            >
              {post.title}
            </h1>
            <p className="text-base" style={{ color: "#4A7C59" }}>
              {post.seoDescription}
            </p>
          </header>

          <div className="prose prose-lg max-w-none" style={{ color: "#1A1A1A", lineHeight: "1.75" }}>
            {content ? (
              content.split("\n\n").map((para, i) => (
                <p key={i} className="mb-4">{para}</p>
              ))
            ) : (
              <p className="mb-4">{post.excerpt}</p>
            )}
          </div>

          {/* CTA */}
          <div
            className="mt-10 p-6 rounded-lg"
            style={{ background: "#D4E6D4", border: "1px solid #4A7C59" }}
          >
            <p className="font-bold text-lg mb-2" style={{ color: "#1B4332", fontFamily: "Georgia, serif" }}>
              Keep your dog hydrated on every walk.
            </p>
            <p className="text-sm mb-4" style={{ color: "#1A1A1A" }}>
              The SipTail Trail Bottle — one-handed dispense, leak-proof lock, water returns to the bottle unused.
            </p>
            <Link
              href="/products"
              className="inline-block px-5 py-2.5 text-sm font-semibold transition-colors"
              style={{ background: "#1B4332", color: "#FFFFFF", borderRadius: "4px", textDecoration: "none" }}
            >
              Shop Now
            </Link>
          </div>
        </article>

        {/* Related posts */}
        {otherPosts.length > 0 && (
          <section className="mt-14">
            <h2
              className="text-xl font-bold mb-6"
              style={{ fontFamily: "Georgia, serif", color: "#1A1A1A" }}
            >
              More guides
            </h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {otherPosts.map((related) => (
                <Link
                  key={related.slug}
                  href={`/blog/${related.slug}`}
                  className="block p-4 rounded-lg transition-shadow hover:shadow-md"
                  style={{ background: "#FFFFFF", border: "1px solid #D4E6D4", textDecoration: "none" }}
                >
                  <p className="text-xs font-semibold uppercase tracking-wide mb-2" style={{ color: "#4A7C59" }}>
                    Guide
                  </p>
                  <h3
                    className="text-sm font-bold leading-snug"
                    style={{ fontFamily: "Georgia, serif", color: "#1A1A1A" }}
                  >
                    {related.title}
                  </h3>
                </Link>
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
