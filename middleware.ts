import { NextRequest, NextResponse } from "next/server";
import { SESSION_COOKIE } from "@/lib/wix-auth-client";
import { LOCALE_COOKIE, isValidLocale, DEFAULT_LOCALE } from "@/lib/translations";

const PROTECTED = ["/account", "/account/edit"];

export function middleware(req: NextRequest) {
  const { pathname, searchParams } = req.nextUrl;

  // ── Language detection ─────────────────────────────────────────
  // Resolve locale from ?lang param > existing cookie > Accept-Language header
  let locale = DEFAULT_LOCALE;
  const langParam = searchParams.get("lang");
  if (langParam && isValidLocale(langParam)) {
    locale = langParam;
  } else {
    const cookieLocale = req.cookies.get(LOCALE_COOKIE)?.value ?? "";
    if (isValidLocale(cookieLocale)) {
      locale = cookieLocale;
    } else {
      // Detect from Accept-Language header
      const acceptLang = req.headers.get("accept-language") ?? "";
      const preferred = acceptLang.split(",")[0].trim().toLowerCase().split("-")[0];
      locale = preferred === "he" ? "he" : DEFAULT_LOCALE;
    }
  }

  // Forward the resolved locale as a request header so layout.tsx can read it
  // in the SAME request (response cookies aren't readable via cookies() until
  // the next request, causing a flash of wrong dir on first visit).
  const requestHeaders = new Headers(req.headers);
  requestHeaders.set("x-locale", locale);

  const res = NextResponse.next({ request: { headers: requestHeaders } });

  // Persist locale in a long-lived cookie so the next request also has it
  res.cookies.set(LOCALE_COOKIE, locale, { maxAge: 60 * 60 * 24 * 365, path: "/" });

  // ── Auth guard ─────────────────────────────────────────────────
  const isProtected = PROTECTED.some(p => pathname === p || pathname.startsWith(p + "/"));
  if (isProtected) {
    const session = req.cookies.get(SESSION_COOKIE)?.value;
    if (!session) {
      const loginUrl = new URL("/login", req.url);
      loginUrl.searchParams.set("from", pathname);
      return NextResponse.redirect(loginUrl, { headers: requestHeaders });
    }
  }

  return res;
}

export const config = { matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"] };
