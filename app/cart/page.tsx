export const dynamic = "force-dynamic";
import { getWixServerClient } from "@/lib/wix-client";
import CartContents from "@/components/CartContents";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
async function fetchCart(): Promise<any | null> {
  try { const c = await getWixServerClient(); return (await c.currentCart.getCurrentCart()) ?? null; }
  catch { return null; }
}

export default async function CartPage({ searchParams }: { searchParams: Promise<{ preview?: string }> }) {
  const { preview } = await searchParams;
  const isPreview = preview === "1";
  const cart = isPreview ? null : await fetchCart();
  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <h1 className="text-3xl font-bold text-gray-900 mb-10">Your Cart</h1>
      <CartContents initialCart={cart} isPreview={isPreview} />
    </div>
  );
}
