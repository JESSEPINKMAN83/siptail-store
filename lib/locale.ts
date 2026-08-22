import { cookies } from "next/headers";
import { LOCALE_COOKIE, DEFAULT_LOCALE, Locale, isValidLocale } from "./translations";

export async function getLocale(): Promise<Locale> {
  const cookieStore = await cookies();
  const raw = cookieStore.get(LOCALE_COOKIE)?.value ?? "";
  return isValidLocale(raw) ? raw : DEFAULT_LOCALE;
}

export { ilsFromUsd } from "./config";
