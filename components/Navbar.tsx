import Link from "next/link";
import CartIcon from "./CartIcon";
import NavbarAuth from "./NavbarAuth";

export default function Navbar() {
  return (
    <>
      {/* Utility bar */}
      <div className="bg-[#1a1a2e] text-white text-xs py-2 px-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
          <span className="whitespace-nowrap">🐾 Free US shipping over $50</span>
          <div className="hidden sm:flex items-center gap-4 text-gray-300">
            <Link href="/products" className="hover:text-white transition-colors">For Dog Owners</Link>
            <span>·</span>
            <Link href="/contact" className="hover:text-white transition-colors">Shipping &amp; Returns</Link>
            <span>·</span>
            <Link href="/contact" className="hover:text-white transition-colors">Help</Link>
          </div>
          <span className="hidden sm:block whitespace-nowrap text-gray-300">hello@walkessentials.com</span>
        </div>
      </div>

      {/* Main header */}
      <nav className="bg-white border-b border-gray-200 sticky top-0 z-50 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3 h-16">
            <Link href="/" className="flex-shrink-0 text-lg font-bold text-[#2d5016] hover:text-[#5a8f35] transition-colors whitespace-nowrap">
              Walk Essentials 🐾
            </Link>
            <div className="flex-1 mx-2 sm:mx-4">
              <div className="relative">
                <input type="search" placeholder="Search for dog walk gear..."
                  className="w-full pl-4 pr-10 py-2 rounded-full border border-gray-200 bg-gray-50 text-sm focus:outline-none focus:border-[#2d5016] focus:ring-1 focus:ring-[#2d5016] transition-colors" />
                <div className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-1 sm:gap-2 flex-shrink-0">
              {/* Wishlist */}
              <button className="p-2 text-gray-500 hover:text-[#2d5016] transition-colors hidden sm:flex items-center" aria-label="Wishlist">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
              </button>
              {/* Dynamic auth — client component */}
              <NavbarAuth />
              {/* Mobile sign-in icon */}
              <Link href="/login" className="sm:hidden p-2 text-gray-500 hover:text-[#2d5016] transition-colors" aria-label="Account">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </Link>
              <CartIcon />
            </div>
          </div>
        </div>

        {/* Category nav */}
        <div className="border-t border-gray-100 overflow-x-auto scrollbar-hide">
          <div className="max-w-7xl mx-auto px-4">
            <div className="flex items-center gap-1 py-2 w-max min-w-full sm:w-auto sm:min-w-0">
              {[
                { label: "🔥 Sale", href: "/products?cat=sale" },
                { label: "💧 Hydration", href: "/products?cat=hydration" },
                { label: "🎒 Walk Gear", href: "/products?cat=walk-gear" },
                { label: "🥾 Trail & Hike", href: "/products?cat=trail-hike" },
                { label: "🦺 Dog Safety", href: "/products?cat=dog-safety" },
                { label: "✨ Accessories", href: "/products?cat=accessories" },
                { label: "🆕 New Arrivals", href: "/products?cat=new" },
                { label: "📬 Contact", href: "/contact" },
              ].map((cat) => (
                <Link key={cat.label} href={cat.href}
                  className="flex-shrink-0 px-3 py-1.5 rounded-full text-xs font-medium text-gray-600 hover:text-[#2d5016] hover:bg-green-50 transition-colors whitespace-nowrap border border-transparent hover:border-green-100">
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
