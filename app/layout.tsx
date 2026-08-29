import type { Metadata } from "next";
import "./globals.css";
import Navbar from "@/components/Navbar";
import NewsletterSignup from "@/components/NewsletterSignup";
import Script from "next/script";
import { LogoVertical } from "@/components/Logo";
import { getLocale } from "@/lib/locale";
import { t } from "@/lib/translations";
import WhatsAppButton from "@/components/WhatsAppButton";
import AccessibilityWidget from "@/components/AccessibilityWidget";
import Link from "next/link";

const META_PIXEL_ID = "1375359411376605";
const TEQPET_LOGO_URL = "https://static.wixstatic.com/media/70d502_e3e96278eb1444ef83de9003d1ad6795~mv2.jpg";
const SITE_URL = "https://siptail-store.vercel.app";

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getLocale();
  const isHe = locale === "he";
  return {
    title: {
      default: isHe ? "TeqPet | הטכנולוגיה שחיות המחמד אוהבות" : "TeqPet — Pet Tech Store Israel",
      template: "%s | TeqPet",
    },
    description: isHe
      ? "TeqPet — החנות המובילה לטכנולוגיה חכמה לחיות מחמד. מזינים חכמים, מזרקות מים, GPS, צעצועים חכמים ועוד."
      : "TeqPet — Israel's leading smart pet tech store. Smart feeders, water fountains, GPS trackers, smart toys and more.",
    openGraph: {
      title: isHe ? "TeqPet | הטכנולוגיה שחיות המחמד אוהבות" : "TeqPet — Pet Tech Store Israel",
      description: isHe
        ? "החנות המובילה לטכנולוגיה חכמה לחיות מחמד בישראל."
        : "Israel's leading smart pet tech store.",
      url: SITE_URL,
      siteName: "TeqPet",
      type: "website",
      locale: isHe ? "he_IL" : "en_US",
      images: [
        {
          url: TEQPET_LOGO_URL,
          width: 800,
          height: 800,
          alt: "TeqPet Logo",
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: isHe ? "TeqPet | הטכנולוגיה שחיות המחמד אוהבות" : "TeqPet — Pet Tech Store Israel",
      description: isHe
        ? "החנות המובילה לטכנולוגיה חכמה לחיות מחמד בישראל."
        : "Israel's leading smart pet tech store.",
      images: [TEQPET_LOGO_URL],
    },
    alternates: {
      canonical: SITE_URL,
      languages: {
        "en": `${SITE_URL}?lang=en`,
        "he": `${SITE_URL}?lang=he`,
      },
    },
  };
}

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const locale = await getLocale();
  const isHe = locale === "he";
  const dir = isHe ? "rtl" : "ltr";

  return (
    <html lang={locale} dir={dir}>
      <head>
        {isHe && (
          <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Noto+Serif+Hebrew:wght@400;700&family=Alef:wght@400;700&display=swap" />
        )}
        <style>{`
          [data-contrast="high"] { filter: contrast(1.5); }
          :focus-visible { outline: 3px solid #FF6B2B; outline-offset: 2px; }
        `}</style>
      </head>
      <body className="min-h-screen" style={{
        background: "#FFFFFF",
        fontFamily: isHe ? "Alef, Inter, system-ui, sans-serif" : "Inter, system-ui, sans-serif",
      }}>
        <Script id="meta-pixel" strategy="afterInteractive">{`
          !function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?n.callMethod.apply(n,arguments):n.queue.push(arguments)};if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';n.queue=[];t=b.createElement(e);t.async=!0;t.src=v;s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)}(window,document,'script','https://connect.facebook.net/en_US/fbevents.js');
          fbq('init','${META_PIXEL_ID}');fbq('track','PageView');
        `}</Script>
        <noscript>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img height="1" width="1" style={{display:"none"}} src={`https://www.facebook.com/tr?id=${META_PIXEL_ID}&ev=PageView&noscript=1`} alt="" />
        </noscript>

        <Navbar locale={locale} />
        <main>{children}</main>

        {/* WE-07: WhatsApp floating button */}
        <WhatsAppButton locale={locale} />
        {/* WE-09: Accessibility widget */}
        <AccessibilityWidget />

        <footer className="mt-16" style={{ background: "#1B2A4A", color: "#FFFFFF" }}>
          {/* Newsletter */}
          <div className="border-b border-[#2D4270]">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
              <div className={`flex flex-col sm:flex-row items-center gap-4 justify-between ${isHe ? "sm:flex-row-reverse" : ""}`}>
                <div className={isHe ? "text-right" : ""}>
                  <p className="font-bold text-base" style={{ fontFamily: "Inter, sans-serif" }}>
                    {isHe ? "הישארו מעודכנים" : "Stay in the loop"}
                  </p>
                  <p className="text-sm mt-0.5" style={{ color: "#D0D8EC" }}>
                    {isHe ? "מוצרים חדשים, מבצעים ועדכוני טק לחיות" : "New products, deals and pet-tech updates."}
                  </p>
                </div>
                <div className="w-full sm:w-auto sm:min-w-[360px]">
                  <NewsletterSignup compact locale={locale} />
                </div>
              </div>
            </div>
          </div>
          {/* Main footer */}
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <div className="flex justify-center mb-10">
              <LogoVertical variant="white" />
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-10">
              {(isHe ? [
                { title: "קטגוריות", links: [
                  { label: "מזינים חכמים", href: "/products?cat=smart-feeders" },
                  { label: "מזרקות מים", href: "/products?cat=water-fountains" },
                  { label: "GPS ומעקב", href: "/products?cat=gps-tracking" },
                  { label: "צעצועים חכמים", href: "/products?cat=smart-toys" },
                ]},
                { title: "עוד קטגוריות", links: [
                  { label: "טיפוח טכנולוגי", href: "/products?cat=tech-grooming" },
                  { label: "מצלמות חיות", href: "/products?cat=pet-cameras" },
                  { label: "מוניטורי פעילות", href: "/products?cat=activity-monitors" },
                  { label: "כל המוצרים", href: "/products" },
                ]},
                { title: "תמיכה", links: [
                  { label: t(locale, "contact_us"), href: "/contact" },
                  { label: t(locale, "shipping_policy"), href: "/contact" },
                  { label: "החשבון שלי", href: "/login" },
                ]},
                { title: "משפטי", links: [
                  { label: t(locale, "a11y.statement"), href: "/accessibility" },
                  { label: "מדיניות פרטיות", href: "/privacy" },
                  { label: "תנאי שימוש", href: "/terms" },
                ]},
              ] : [
                { title: "Categories", links: [
                  { label: "Smart Feeders", href: "/products?cat=smart-feeders" },
                  { label: "Water Fountains", href: "/products?cat=water-fountains" },
                  { label: "GPS & Tracking", href: "/products?cat=gps-tracking" },
                  { label: "Smart Toys", href: "/products?cat=smart-toys" },
                ]},
                { title: "More", links: [
                  { label: "Tech Grooming", href: "/products?cat=tech-grooming" },
                  { label: "Pet Cameras", href: "/products?cat=pet-cameras" },
                  { label: "Activity Monitors", href: "/products?cat=activity-monitors" },
                  { label: "All Products", href: "/products" },
                ]},
                { title: "Support", links: [
                  { label: t(locale, "contact_us"), href: "/contact" },
                  { label: t(locale, "shipping_policy"), href: "/contact" },
                  { label: "My Account", href: "/login" },
                ]},
                { title: "Legal", links: [
                  { label: t(locale, "a11y.statement"), href: "/accessibility" },
                  { label: "Privacy Policy", href: "/privacy" },
                  { label: "Terms of Use", href: "/terms" },
                ]},
              ]).map(col => (
                <div key={col.title} className={isHe ? "text-right" : ""}>
                  <h3 className="font-bold text-xs uppercase tracking-widest mb-4" style={{ color: "#D0D8EC" }}>{col.title}</h3>
                  <ul className="space-y-2">
                    {col.links.map(l => (
                      <li key={l.label}><Link href={l.href} className="text-sm hover:text-white transition-colors" style={{ color: "#D0D8EC" }}>{l.label}</Link></li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
            {/* Phone in footer */}
            <div className={`text-center text-xs mb-4 ${isHe ? "space-x-reverse" : ""}`} style={{ color: "#D0D8EC" }}>
              <a href="tel:+972509033022" className="hover:text-white transition-colors">
                {isHe ? "שירות לקוחות: " : "Customer service: "}03-000-0000
              </a>
              {" · "}
              <span>{isHe ? "א׳–ה׳ 9:00–18:00" : "Sun–Thu 9:00–18:00"}</span>
            </div>
            <div className="border-t pt-6 text-center text-xs" style={{ borderColor: "#2D4270", color: "#D0D8EC" }}>
              <p>&copy; {new Date().getFullYear()} TeqPet.{" "}
                <Link href="/accessibility" className="underline hover:text-white">{t(locale, "a11y.statement")}</Link>
              </p>
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}
