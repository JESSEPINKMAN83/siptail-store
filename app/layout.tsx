import type { Metadata } from "next";
import "./globals.css";
import Navbar from "@/components/Navbar";
import NewsletterSignup from "@/components/NewsletterSignup";
import Script from "next/script";

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
      <body className="min-h-screen bg-white">
        {/* Meta Pixel */}
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

        <footer className="bg-[#2d5016] text-white mt-16">
          {/* Newsletter strip */}
          <div className="border-b border-green-800">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
              <div className="flex flex-col sm:flex-row items-center gap-4 justify-between">
                <div>
                  <p className="font-bold text-base">Join the Walk Essentials crew 🐾</p>
                  <p className="text-green-300 text-sm mt-0.5">New gear drops, trail tips, and member deals.</p>
                </div>
                <div className="w-full sm:w-auto sm:min-w-[360px]">
                  <NewsletterSignup compact />
                </div>
              </div>
            </div>
          </div>
          {/* Main footer */}
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-10">
              <div>
                <h3 className="font-bold text-sm uppercase tracking-widest mb-4 text-green-300">About Us</h3>
                <ul className="space-y-2 text-sm text-green-100">
                  <li><a href="/about" className="hover:text-white transition-colors">Our Story</a></li>
                  <li><a href="/sustainability" className="hover:text-white transition-colors">Sustainability</a></li>
                  <li><a href="/press" className="hover:text-white transition-colors">Press</a></li>
                </ul>
              </div>
              <div>
                <h3 className="font-bold text-sm uppercase tracking-widest mb-4 text-green-300">Shop</h3>
                <ul className="space-y-2 text-sm text-green-100">
                  <li><a href="/products" className="hover:text-white transition-colors">All Products</a></li>
                  <li><a href="/products?cat=new" className="hover:text-white transition-colors">New Arrivals</a></li>
                  <li><a href="/products?cat=sale" className="hover:text-white transition-colors">Sale</a></li>
                </ul>
              </div>
              <div>
                <h3 className="font-bold text-sm uppercase tracking-widest mb-4 text-green-300">Support</h3>
                <ul className="space-y-2 text-sm text-green-100">
                  <li><a href="/contact" className="hover:text-white transition-colors">Contact Us</a></li>
                  <li><a href="/contact" className="hover:text-white transition-colors">Shipping &amp; Returns</a></li>
                  <li><a href="/login" className="hover:text-white transition-colors">My Account</a></li>
                </ul>
              </div>
              <div>
                <h3 className="font-bold text-sm uppercase tracking-widest mb-4 text-green-300">Follow Us</h3>
                <ul className="space-y-2 text-sm text-green-100">
                  <li><a href="https://instagram.com" className="hover:text-white transition-colors">Instagram</a></li>
                  <li><a href="https://tiktok.com" className="hover:text-white transition-colors">TikTok</a></li>
                  <li><a href="https://facebook.com" className="hover:text-white transition-colors">Facebook</a></li>
                </ul>
              </div>
            </div>
            <div className="border-t border-green-800 pt-6 text-center text-sm text-green-300">
              <p>&copy; {new Date().getFullYear()} Walk Essentials. All rights reserved.</p>
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}
