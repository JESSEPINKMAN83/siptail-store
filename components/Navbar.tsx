import Link from "next/link";
import CartIcon from "./CartIcon";
import NavbarAuth from "./NavbarAuth";
import { LogoHorizontal } from "./Logo";
import LangToggle from "./LangToggle";
import type { Locale } from "@/lib/translations";
import { t } from "@/lib/translations";

export default function Navbar({ locale }: { locale: Locale }) {
  const isHe = locale === "he";

  const cats = [
    { label: isHe ? "מבצע" : "Sale", href: `/products?cat=sale&lang=${locale}` },
    { label: isHe ? "הידרציה" : "Hydration", href: `/products?cat=hydration&lang=${locale}` },
    { label: isHe ? "ציוד הליכה" : "Walk Gear", href: `/products?cat=walk-gear&lang=${locale}` },
    { label: isHe ? "טיול וטרקים" : "Trail & Hike", href: `/products?cat=trail-hike&lang=${locale}` },
    { label: isHe ? "בטיחות" : "Dog Safety", href: `/products?cat=dog-safety&lang=${locale}` },
    { label: isHe ? "חדש" : "New Arrivals", href: `/products?cat=new&lang=${locale}` },
    { label: t(locale, "contact_us"), href: "/contact" },
  ];

  return (
    <>
      {/* Utility bar */}
      <div className="bg-[#1B4332] text-white text-xs py-2 px-4">
        <div className={`max-w-7xl mx-auto flex items-center gap-4 ${isHe ? "flex-row-reverse" : "justify-between"}`}>
          {/* WE-05: Hebrew → ₪199, English → ₪199 (unified) */}
          <span className="whitespace-nowrap">
            {t(locale, "shipping.freeThreshold")}
          </span>
          <div className={`hidden sm:flex items-center gap-4 text-green-200 ${isHe ? "flex-row-reverse" : ""}`}>
            {/* WE-08: Phone — tappable on mobile */}
            <a href="tel:+972509033022" className="hover:text-white transition-colors whitespace-nowrap">
              {isHe ? "שירות לקוחות: " : "Tel: "}03-000-0000
            </a>
            <span>·</span>
            <span className="whitespace-nowrap" style={{ color: "#D4E6D4" }}>hello@walkessentials.com</span>
          </div>
          <div className="flex items-center gap-1">
            <LangToggle currentLocale={locale} />
          </div>
        </div>
      </div>

      {/* Main header */}
      <nav className="bg-[#F5F4F0] border-b border-[#D4E6D4] sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* WE-04: RTL mirror — logo RIGHT, nav LEFT in Hebrew */}
          <div className={`flex items-center gap-3 h-16 ${isHe ? "flex-row-reverse" : ""}`}>

            {/* Logo — RIGHT in Hebrew, LEFT in English */}
            <Link href="/" className="flex-shrink-0 hover:opacity-80 transition-opacity" aria-label="Walk Essentials Home">
              <LogoHorizontal />
            </Link>

            {/* Search — center */}
            <div className="flex-1 mx-2 sm:mx-6">
              <div className="relative">
                <input
                  type="search"
                  placeholder={isHe ? "חפש ציוד לטיולים..." : "Search walk gear, hydration, trail..."}
                  dir={isHe ? "rtl" : "ltr"}
                  className={`w-full py-2.5 rounded-sm border border-[#D4E6D4] bg-white text-sm text-[#1A1A1A] placeholder-gray-400 focus:outline-none focus:border-[#1B4332] focus:ring-1 focus:ring-[#1B4332] transition-colors ${isHe ? "pr-4 pl-10" : "pl-4 pr-10"}`}
                />
                <div className={`absolute top-1/2 -translate-y-1/2 text-gray-400 ${isHe ? "left-3" : "right-3"}`}>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
              </div>
            </div>

            {/* Icons — LEFT in Hebrew (flex-row-reverse flips them), RIGHT in English */}
            <div className={`flex items-center gap-1 sm:gap-2 flex-shrink-0 ${isHe ? "flex-row-reverse" : ""}`}>
              <button className="p-2 text-[#1A1A1A] hover:text-[#1B4332] transition-colors hidden sm:flex items-center" aria-label={isHe ? "רשימת משאלות" : "Wishlist"}>
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
              </button>
              {/* WE-19: Show translated Sign In */}
              <NavbarAuth signInLabel={t(locale, "nav.signIn")} accountLabel={t(locale, "nav.account")} />
              <Link href="/login" className="sm:hidden p-2 text-[#1A1A1A] hover:text-[#1B4332] transition-colors" aria-label={t(locale, "nav.signIn")}>
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </Link>
              <CartIcon label={t(locale, "cart")} />
            </div>
          </div>
        </div>

        {/* Category nav — WE-04: reversed in RTL */}
        <div className="border-t border-[#D4E6D4] overflow-x-auto scrollbar-hide">
          <div className="max-w-7xl mx-auto px-4">
            <div className={`flex items-center py-2 w-max min-w-full sm:w-auto sm:min-w-0 ${isHe ? "flex-row-reverse" : ""}`}>
              {cats.map((cat) => (
                <Link key={cat.label} href={cat.href}
                  className="flex-shrink-0 px-4 py-2 text-xs font-medium text-[#1A1A1A] hover:text-[#1B4332] hover:bg-[#D4E6D4]/40 transition-colors whitespace-nowrap uppercase tracking-wide">
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
