"use client";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { Suspense } from "react";

function LangToggleInner({ currentLocale }: { currentLocale: string }) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  function toggle() {
    const next = currentLocale === "he" ? "en" : "he";
    const params = new URLSearchParams(searchParams?.toString() ?? "");
    params.set("lang", next);
    router.push(`${pathname}?${params.toString()}`);
    router.refresh();
  }

  const isHe = currentLocale === "he";

  return (
    <button
      onClick={toggle}
      className="flex items-center gap-1 text-xs font-medium transition-opacity hover:opacity-80 touch-manipulation min-h-[44px] px-2"
      style={{ color: "#D4E6D4" }}
      aria-label={isHe ? "Switch to English" : "עברית"}
    >
      <span>{isHe ? "🇺🇸" : "🇮🇱"}</span>
      <span className="hidden sm:inline">{isHe ? "English" : "עברית"}</span>
    </button>
  );
}

export default function LangToggle({ currentLocale }: { currentLocale: string }) {
  return (
    <Suspense fallback={null}>
      <LangToggleInner currentLocale={currentLocale} />
    </Suspense>
  );
}
