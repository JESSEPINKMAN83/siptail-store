export const dynamic = "force-dynamic";
import Link from "next/link";
import ThankYouPixel from "@/components/ThankYouPixel";

export default function ThankYouPage() {
  return (
    <div className="max-w-xl mx-auto px-4 py-32 text-center">
      {/* Fire Meta Pixel Purchase event client-side */}
      <ThankYouPixel />
      <div className="text-6xl mb-6">🐾</div>
      <h1 className="text-3xl font-bold text-gray-900 mb-4">Order confirmed!</h1>
      <p className="text-gray-600 mb-2">
        Thank you for your order. Your SipTail Trail Bottle is on its way.
      </p>
      <p className="text-sm text-gray-400 mb-10">
        A confirmation email is on its way with your order details.
      </p>
      <Link
        href="/products"
        className="inline-block bg-[#1B4332] text-white px-8 py-4 rounded-full font-semibold hover:bg-[#2d5a3d] active:bg-[#143326] transition-colors touch-manipulation"
      >
        Continue Shopping
      </Link>
    </div>
  );
}
