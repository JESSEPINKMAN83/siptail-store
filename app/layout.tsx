import type { Metadata } from "next";
import "./globals.css";
import Navbar from "@/components/Navbar";
import NewsletterSignup from "@/components/NewsletterSignup";
import Script from "next/script";
import Logo from "@/components/Logo";

export const metadata: Metadata = {
  title: {
    default: "Walk Essentials — Premium Dog Walk & Hike Gear",
    template: "%s | Walk Essentials",
  },
  description: "Everything your dog needs for the perfect walk or hike. BPA-free water bottles, trail-ready gear, and more. Fast shipping to the US and Europe.",
  openGraph: {
    title: "Walk Essentials — Premium Dog Walk & Hike Gear",
    description: "Everything your dog needs for the perfect walk or hike. BPA-free water bottles, trail-ready gear, and more. Fast shipping to the US and Europe.",
    url: "https://siptail-store.vercel.app",
    siteName: "Walk Essentials",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Walk Essentials — Premium Dog Walk & Hike Gear",
    description: "Everything your dog needs for the perfect walk or hike.",
  },
  alternates: { canonical: "https://siptail-store.vercel.app" },
};

const META_PIXEL_ID = "1375359411376605";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen" style={{ background: "#F5F4F0" }}>
        <Script id="meta-pixel" strategy="afterInteractive">{`
          !function(f,b,e,v,n,t,s)
          {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
          n.callMethod.apply(n,arguments):n.queue.push(arguments)};
          if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
          n.queue=[];t=b.createElement(e);t.async=!0;
          t.src=v;s=b.getElementsByTagName(e)[0];
          s.parentNode.insertBefore(t,s)}(window, document,'script',
          'https://connect.facebook.net/en_US/fbevents.js');
          fbq('init', '${META_PIXEL_ID}');
          fbq('track', 'PageView');
        `}</Script>
        <noscript>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img height="1" width="1" style={{ display: "none" }}
            src={`https://www.facebook.com/tr?id=${META_PIXEL_ID}&ev=PageView&noscript=1`}
            alt="" />
        </noscript>

        <Navbar />
        <main>{children}</main>

        <footer className="mt-16" style={{ background: "#1B4332", color: "#FFFFFF" }}>
          <div className="border-b border-[#4A7C59]">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
              <div className="flex flex-col sm:flex-row items-center gap-4 justify-between">
                <div>
                  <p className="font-bold text-base" style={{ fontFamily: "Georgia, serif" }}>Stay in the loop</p>
                  <p className="text-sm mt-0.5" style={{ color: "#D4E6D4" }}>New gear drops, trail guides, and member deals.</p>
                </div>
                <div className="w-full sm:w-auto sm:min-w-[360px]">
                  <NewsletterSignup compact />
                </div>
              </div>
            </div>
          </div>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <div className="flex justify-center mb-10">
              <Logo variant="white" />
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-10">
              {[
                { title: "About", links: [{ label: "Our Story", href: "/about" }, { label: "Sustainability", href: "/sustainability" }, { label: "Press", href: "/press" }] },
                { title: "Shop", links: [{ label: "All Products", href: "/products" }, { label: "New Arrivals", href: "/products?cat=new" }, { label: "Sale", href: "/products?cat=sale" }] },
                { title: "Support", links: [{ label: "Contact Us", href: "/contact" }, { label: "Shipping & Returns", href: "/contact" }, { label: "My Account", href: "/login" }] },
                { title: "Follow", links: [{ label: "Instagram", href: "https://instagram.com" }, { label: "TikTok", href: "https://tiktok.com" }, { label: "Facebook", href: "https://facebook.com" }] },
              ].map(col => (
                <div key={col.title}>
                  <h3 className="font-bold text-xs uppercase tracking-widest mb-4" style={{ color: "#D4E6D4" }}>{col.title}</h3>
                  <ul className="space-y-2">
                    {col.links.map(l => (
                      <li key={l.label}><a href={l.href} className="text-sm hover:text-white transition-colors" style={{ color: "#D4E6D4" }}>{l.label}</a></li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
            <div className="border-t pt-6 text-center text-xs" style={{ borderColor: "#4A7C59", color: "#D4E6D4" }}>
              <p>&copy; {new Date().getFullYear()} Walk Essentials. All rights reserved.</p>
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}
