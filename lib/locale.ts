import { cookies, headers } from "next/headers";
import { LOCALE_COOKIE, DEFAULT_LOCALE, Locale, isValidLocale } from "./translations";

export async function getLocale(): Promise<Locale> {
  // Read the x-locale header injected by middleware first — this is set on the
  // same request, so it works correctly even on the very first visit with
  // ?lang=he before the cookie has been sent back by the browser.
  const headerStore = await headers();
  const headerLocale = headerStore.get("x-locale") ?? "";
  if (isValidLocale(headerLocale)) return headerLocale;

  // Fall back to cookie (subsequent requests where middleware may not re-set header)
  const cookieStore = await cookies();
  const raw = cookieStore.get(LOCALE_COOKIE)?.value ?? "";
  return isValidLocale(raw) ? raw : DEFAULT_LOCALE;
}

export { ilsFromUsd } from "./config";
