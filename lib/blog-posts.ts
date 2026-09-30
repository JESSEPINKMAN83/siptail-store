/**
 * Walk Essentials blog posts — static data for the four published Wix Blog posts.
 * SEO titles and meta descriptions are baked in here because the Wix SEO Tags
 * API is unavailable on headless sites (returns 428 MISSING_HTML_WEB_APP).
 * The Next.js generateMetadata function reads from this map by slug.
 */

export type BlogPost = {
  id: string;
  slug: string;
  title: string;
  seoTitle: string;
  seoDescription: string;
  excerpt: string;
  keyword: string;
};

export const BLOG_POSTS: BlogPost[] = [
  {
    id: "c8289463-d103-41b2-b698-2549aa9a99b9",
    slug: "the-7-things-every-dog-owner-forgets-to-pack-on-a-walk-ff073537",
    title: "The 7 Things Every Dog Owner Forgets to Pack on a Walk",
    seoTitle: "The 7 Things Every Dog Owner Forgets to Pack on a Walk",
    seoDescription:
      "Discover the 7 things most dog owners forget to bring on a walk — from water and poop bags to a portable bowl. Fix your routine and keep your dog safe and happy.",
    excerpt:
      "Most dog owners fall into the same trap: we get so used to our walk routine that we stop thinking about what we're actually bringing. Here are the 7 things every dog owner forgets to pack.",
    keyword: "what to bring on a walk with your dog",
  },
  {
    id: "0b7455a4-08c5-4530-93ec-ab87e58c46a2",
    slug: "how-much-water-does-your-dog-actually-need-on-a-hike-a0d21ef0",
    title: "How Much Water Does Your Dog Actually Need on a Hike?",
    seoTitle: "How Much Water Does Your Dog Actually Need on a Hike?",
    seoDescription:
      "Learn exactly how much water your dog needs on a hike based on their weight, signs of dehydration to watch for, and how to keep them safe in hot weather.",
    excerpt:
      "Most dog owners guess. They bring a bottle, offer some along the way, and hope for the best. Here's what the numbers actually look like.",
    keyword: "how much water does a dog need on a hike",
  },
  {
    id: "a78cfd47-7f00-4fa1-ab10-26e30f6576ec",
    slug: "5-signs-your-dog-is-dehydrated-and-what-to-do-right-now-23e19d4f",
    title: "5 Signs Your Dog is Dehydrated (And What to Do Right Now)",
    seoTitle: "5 Signs Your Dog is Dehydrated (And What to Do Right Now)",
    seoDescription:
      "Know the 5 warning signs of dehydration in dogs — dry gums, lethargy, sunken eyes, loss of skin elasticity, and dark urine — and what to do about each one.",
    excerpt:
      "Your dog can't tell you they're thirsty. By the time a dog shows obvious distress from dehydration, they're already past the mild stage. These are the five signals that matter.",
    keyword: "signs dog is dehydrated",
  },
  {
    id: "81215489-39b3-4867-b05d-6bf7f4a5c0cd",
    slug: "the-best-dog-water-bottles-of-2026-what-actually-works-on-the-trail-99cd869a",
    title: "The Best Dog Water Bottles of 2026: What Actually Works on the Trail",
    seoTitle: "The Best Dog Water Bottles of 2026: What Actually Works on the Trail",
    seoDescription:
      "An honest review of the best dog water bottles in 2026. What to look for, which brands hold up on the trail, and our top pick for everyday walks and hikes.",
    excerpt:
      "There's no shortage of dog water bottles on the market. The reality is that most of them have the same problem. This is an honest look at what to look for.",
    keyword: "best dog water bottle 2026",
  },
];

/** Look up a post by its Wix-assigned URL slug. */
export function getPostBySlug(slug: string): BlogPost | undefined {
  return BLOG_POSTS.find((p) => p.slug === slug);
}
