import { NextRequest, NextResponse } from "next/server";
import { SESSION_COOKIE } from "@/lib/wix-auth-client";
import { LOCALE_COOKIE, isValidLocale, DEFAULT_LOCALE } from "@/lib/translations";

const PROTECTED = ["/account", "/account/edit"];

export function middleware(req: NextRequest) {
  const { pathname, searchParams } = req.nextUrl;
  const res = NextResponse.next();

  // ── Language detection ─────────────────────────────────────────
  // 1. Explicit ?lang=he/en param takes priority
  const langParam = searchParams.get("lang");
  if (langParam && isValidLocale(langParam)) {
    res.cookies.set(LOCALE_COOKIE, langParam, { maxAge: 60 * 60 * 24 * 365, path: "/" });
  } else if (!req.cookies.get(LOCALE_COOKIE)) {
    // 2. No cookie yet — detect from Accept-Language header
    const acceptLang = req.headers.get("accept-language") ?? "";
    const preferred = acceptLang.split(",")[0].trim().toLowerCase().split("-")[0];
    const detected = preferred === "he" ? "he" : DEFAULT_LOCALE;
    res.cookies.set(LOCALE_COOKIE, detected, { maxAge: 60 * 60 * 24 * 365, path: "/" });
  }

  // ── Auth guard ─────────────────────────────────────────────────
  const isProtected = PROTECTED.some(p => pathname === p || pathname.startsWith(p + "/"));
  if (isProtected) {
    const session = req.cookies.get(SESSION_COOKIE)?.value;
    if (!session) {
      const loginUrl = new URL("/login", req.url);
      loginUrl.searchParams.set("from", pathname);
      return NextResponse.redirect(loginUrl);
    }
  }

  return res;
}

export const config = { matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"] };
