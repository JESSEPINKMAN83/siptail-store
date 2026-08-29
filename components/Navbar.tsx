import Link from "next/link";
import CartIcon from "./CartIcon";
import NavbarAuth from "./NavbarAuth";
import { LogoHorizontal } from "./Logo";
import LangToggle from "./LangToggle";
import type { Locale } from "@/lib/translations";
import { t } from "@/lib/translations";

// 9 TeqPet collections (Hebrew names from Wix backend)
const TEQPET_CATS_HE = [
  { label: "מזינים חכמים",    slug: "smart-feeders" },
  { label: "מזרקות מים",     slug: "water-fountains" },
  { label: "GPS ומעקב",      slug: "gps-tracking" },
  { label: "צעצועים חכמים",  slug: "smart-toys" },
  { label: "טיפוח טכנולוגי", slug: "tech-grooming" },
  { label: "אביזרי טיפוח",   slug: "grooming-accessories" },
  { label: "אביזרי טיול",    slug: "travel-accessories" },
  { label: "מצלמות חיות",    slug: "pet-cameras" },
  { label: "מוניטורי פעילות", slug: "activity-monitors" },
];

const TEQPET_CATS_EN = [
  { label: "Smart Feeders",      slug: "smart-feeders" },
  { label: "Water Fountains",    slug: "water-fountains" },
  { label: "GPS & Tracking",     slug: "gps-tracking" },
  { label: "Smart Toys",         slug: "smart-toys" },
  { label: "Tech Grooming",      slug: "tech-grooming" },
  { label: "Grooming Accessories", slug: "grooming-accessories" },
  { label: "Travel Accessories", slug: "travel-accessories" },
  { label: "Pet Cameras",        slug: "pet-cameras" },
  { label: "Activity Monitors",  slug: "activity-monitors" },
];

export default function Navbar({ locale }: { locale: Locale }) {
  const isHe = locale === "he";
  const cats = isHe ? TEQPET_CATS_HE : TEQPET_CATS_EN;

  return (
    <>
      {/* Utility bar */}
      <div className="bg-[#1B2A4A] text-white text-xs py-2 px-4">
        <div className={`max-w-7xl mx-auto flex items-center justify-between gap-4 ${isHe ? "flex-row-reverse" : ""}`}>
          {/* Slot A — shipping text */}
          <span className="whitespace-nowrap">
            {t(locale, "shipping.freeThreshold")}
          </span>
          {/* Slot B — contact details (center, hidden on mobile) */}
          <div className={`hidden sm:flex items-center gap-4 text-[#D0D8EC] ${isHe ? "flex-row-reverse" : ""}`}>
            <a href="tel:+972509033022" className="hover:text-white transition-colors whitespace-nowrap">
              {isHe ? "שירות לקוחות: " : "Tel: "}03-000-0000
            </a>
            <span>·</span>
            <span className="whitespace-nowrap" style={{ color: "#D0D8EC" }}>hello@teqpet.com</span>
          </div>
          {/* Slot C — language toggle */}
          <div className="flex items-center gap-1 flex-shrink-0">
            <LangToggle currentLocale={locale} />
          </div>
        </div>
      </div>

      {/* Main header */}
      <nav className="bg-white border-b border-[#D0D8EC] sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className={`flex items-center gap-3 h-16 ${isHe ? "flex-row-reverse" : ""}`}>

            {/* Logo */}
            <Link
              href={`/?lang=${locale}`}
              className="flex-shrink-0 hover:opacity-80 transition-opacity"
              aria-label="TeqPet Home"
            >
              <LogoHorizontal />
            </Link>

            {/* Shop link — desktop only */}
            <Link
              href={`/products?lang=${locale}`}
              className="hidden sm:flex items-center px-3 py-1.5 text-sm font-medium transition-colors hover:text-[#FF6B2B] flex-shrink-0"
              style={{ color: "#1A1A1A" }}
            >
              {t(locale, "nav.shop")}
            </Link>

            {/* Search — takes remaining space */}
            <div className="flex-1 mx-2 sm:mx-4">
              <div className="relative">
                <input
                  type="search"
                  placeholder={isHe ? "חפש מוצרי טק לחיות המחמד..." : "Search pet tech products..."}
                  dir={isHe ? "rtl" : "ltr"}
                  className={`w-full py-2.5 rounded-sm border border-[#D0D8EC] bg-white text-sm text-[#1A1A1A] placeholder-gray-400 focus:outline-none focus:border-[#1B2A4A] focus:ring-1 focus:ring-[#1B2A4A] transition-colors ${isHe ? "pr-4 pl-10" : "pl-4 pr-10"}`}
                />
                <div className={`absolute top-1/2 -translate-y-1/2 text-gray-400 ${isHe ? "left-3" : "right-3"}`}>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
              </div>
            </div>

            {/* Icon cluster */}
            <div className={`flex items-center gap-1 sm:gap-2 flex-shrink-0 ${isHe ? "flex-row-reverse" : ""}`}>
              {/* Mobile shop icon */}
              <Link
                href={`/products?lang=${locale}`}
                className="sm:hidden p-2 text-[#1A1A1A] hover:text-[#FF6B2B] transition-colors"
                aria-label={t(locale, "nav.shop")}
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                </svg>
              </Link>
              <NavbarAuth signInLabel={t(locale, "nav.signIn")} accountLabel={t(locale, "nav.account")} />
              <Link
                href="/login"
                className="sm:hidden p-2 text-[#1A1A1A] hover:text-[#FF6B2B] transition-colors"
                aria-label={t(locale, "nav.signIn")}
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </Link>
              <CartIcon label={t(locale, "cart")} />
            </div>
          </div>
        </div>

        {/* Category strip — all 9 TeqPet collections */}
        <div className="border-t border-[#D0D8EC] overflow-x-auto scrollbar-hide">
          <div className="max-w-7xl mx-auto px-4">
            <div className={`flex items-center py-2 w-max min-w-full sm:w-auto sm:min-w-0 ${isHe ? "flex-row-reverse" : ""}`}>
              {/* All products link */}
              <Link
                href={`/products?lang=${locale}`}
                className="flex-shrink-0 px-4 py-2 text-xs font-medium text-[#1A1A1A] hover:text-[#FF6B2B] hover:bg-[#FFE8DC]/40 transition-colors whitespace-nowrap uppercase tracking-wide"
              >
                {isHe ? "כל המוצרים" : "All"}
              </Link>
              {cats.map((cat) => (
                <Link
                  key={cat.slug}
                  href={`/products?cat=${cat.slug}&lang=${locale}`}
                  className="flex-shrink-0 px-4 py-2 text-xs font-medium text-[#1A1A1A] hover:text-[#FF6B2B] hover:bg-[#FFE8DC]/40 transition-colors whitespace-nowrap uppercase tracking-wide"
                >
                  {cat.label}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </nav>
    </>
  );
}
