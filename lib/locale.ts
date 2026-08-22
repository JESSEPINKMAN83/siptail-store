import { cookies } from "next/headers";
import { LOCALE_COOKIE, DEFAULT_LOCALE, Locale, isValidLocale } from "./translations";

export async function getLocale(): Promise<Locale> {
  const cookieStore = await cookies();
  const raw = cookieStore.get(LOCALE_COOKIE)?.value ?? "";
  return isValidLocale(raw) ? raw : DEFAULT_LOCALE;
}

// USD → ILS conversion (static rate — good enough for display)
const USD_TO_ILS = 3.7;

export function formatPrice(priceStr: string | null | undefined, locale: Locale): string {
  if (!priceStr) return "";
  if (locale === "en") return priceStr;
  // Extract number from strings like "$24.99" or "From $24.99"
  const match = priceStr.match(/[\d.,]+/);
  if (!match) return priceStr;
  const usd = parseFloat(match[0].replace(",", ""));
  const ils = Math.round(usd * USD_TO_ILS);
  return priceStr.replace(/\$[\d.,]+/, `₪${ils}`);
}
