export const dynamic = "force-dynamic";
import { cookies } from "next/headers";
import { createClient, OAuthStrategy, Tokens } from "@wix/sdk";
import { currentCart } from "@wix/ecom";
import { products } from "@wix/stores";
import CartContents from "@/components/CartContents";
import { getLocale } from "@/lib/locale";
import { t } from "@/lib/translations";

const WIX_CLIENT_ID = process.env.NEXT_PUBLIC_WIX_CLIENT_ID || "placeholder-client-id";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
async function fetchCart(): Promise<any | null> {
  try {
    const cookieStore = await cookies();

    // Only accept tokens with real non-empty values
    let tokens: Tokens | undefined;
    for (const name of ["wix_session", "wix_visitor"]) {
      const raw = cookieStore.get(name)?.value;
      if (!raw) continue;
      try {
        const parsed = JSON.parse(raw);
        if (parsed?.accessToken?.value && parsed?.refreshToken?.value) {
          tokens = parsed as Tokens;
          console.log("[cart] Using tokens from cookie:", name, "accessToken starts:", parsed.accessToken.value.slice(0, 20));
          break;
        }
      } catch {}
    }

    if (!tokens) {
      console.log("[cart] No valid tokens found — empty cart");
      return null;
    }

    const client = createClient({
      modules: { products, currentCart },
      auth: OAuthStrategy({ clientId: WIX_CLIENT_ID, tokens }),
    });

    const cart = await client.currentCart.getCurrentCart();
    console.log("[cart] Fetched cart, line items:", cart?.lineItems?.length ?? 0);
    return cart ?? null;
  } catch (e) {
    console.error("[cart] fetchCart error:", e);
    return null;
  }
}

interface CartPageProps {
  searchParams: Promise<{ preview?: string }>;
}

export default async function CartPage({ searchParams }: CartPageProps) {
  const { preview } = await searchParams;
  const isPreview = preview === "1";
  const locale = await getLocale();
  const cart = isPreview ? null : await fetchCart();

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <h1 className="text-3xl font-bold mb-10" style={{ fontFamily: "Georgia, serif", color: "#1A1A1A" }}>
        {t(locale, "your_cart")}
      </h1>
      <CartContents initialCart={cart} isPreview={isPreview} locale={locale} />
    </div>
  );
}
