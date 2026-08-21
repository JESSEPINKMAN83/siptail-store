import Link from "next/link";
import CartIcon from "./CartIcon";

export default function Navbar() {
  return (
    <nav className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="text-xl font-bold text-gray-900 hover:text-blue-600 transition-colors">
            Walk Essentials 🐾
          </Link>
          <div className="flex items-center gap-6">
            <Link href="/products" className="text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors">
              Shop
            </Link>
            <CartIcon />
          </div>
        </div>
      </div>
    </nav>
  );
}
