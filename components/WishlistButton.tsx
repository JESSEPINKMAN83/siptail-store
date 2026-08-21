"use client";
export default function WishlistButton() {
  return (
    <button
      onClick={(e) => e.preventDefault()}
      className="absolute top-2 right-2 w-8 h-8 rounded-full bg-white/80 backdrop-blur-sm flex items-center justify-center text-gray-400 hover:text-red-400 transition-colors shadow-sm"
      aria-label="Add to wishlist"
    >
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
      </svg>
    </button>
  );
}
