export const dynamic = "force-dynamic";
import Link from "next/link";
export default function ThankYouPage() {
  return (
    <div className="max-w-xl mx-auto px-4 py-32 text-center">
      <div className="text-6xl mb-6">🐾</div>
      <h1 className="text-3xl font-bold text-gray-900 mb-4">Order confirmed!</h1>
      <p className="text-gray-600 mb-2">Thank you for your purchase. Your SipTail Trail Bottle is on its way.</p>
      <p className="text-sm text-gray-400 mb-10">You will receive a confirmation email with your order details.</p>
      <Link href="/products" className="bg-blue-600 text-white px-8 py-3 rounded-full font-semibold hover:bg-blue-700 transition-colors">Continue Shopping</Link>
    </div>
  );
}
