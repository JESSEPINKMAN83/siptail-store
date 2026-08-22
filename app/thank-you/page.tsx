export const dynamic = "force-dynamic";
import Link from "next/link";
import ThankYouPixel from "@/components/ThankYouPixel";

export default function ThankYouPage() {
  return (
    <div className="max-w-xl mx-auto px-4 py-32 text-center" style={{ background: "#F5F4F0" }}>
      <ThankYouPixel />
      <div className="text-5xl mb-6" style={{ color: "#1B4332" }}>✓</div>
      <h1 className="text-3xl font-bold mb-4" style={{ fontFamily: "Georgia, serif", color: "#1A1A1A" }}>Order confirmed.</h1>
      <p className="mb-2" style={{ color: "#1A1A1A" }}>Thank you for your order. Your Trail Bottle is on its way.</p>
      <p className="text-sm mb-10" style={{ color: "#6B7280" }}>A confirmation email is on its way with your order details.</p>
      <Link href="/products"
        className="inline-block px-8 py-4 text-sm font-semibold uppercase tracking-wide transition-colors"
        style={{ background: "#1B4332", color: "#FFFFFF" }}>
        Continue Shopping
      </Link>
    </div>
  );
}
