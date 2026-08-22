export const dynamic = "force-dynamic";

import Link from "next/link";
import type { Metadata } from "next";
import TrailScene from "@/components/TrailScene";
import { getLocale } from "@/lib/locale";
import { t } from "@/lib/translations";
import { WE_CONFIG, ilsFromUsd } from "@/lib/config";

export const metadata: Metadata = {
  title: "Walk Essentials — Walk further",
  description:
    "Gear built for the trail, the path, and the last hour of light. The SipTail Trail Bottle.",
};

const SPEC_ICONS = {
  volume: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.6} className="w-5 h-5">
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 3s5 5.5 5 9a5 5 0 01-10 0c0-3.5 5-9 5-9z" />
    </svg>
  ),
  weight: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.6} className="w-5 h-5">
      <path strokeLinecap="round" strokeLinejoin="round" d="M5 8h14l1.5 12H3.5L5 8z" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 8a3 3 0 116 0" />
    </svg>
  ),
  material: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.6} className="w-5 h-5">
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 3l8 4.5v9L12 21l-8-4.5v-9L12 3z" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 12l8-4.5M12 12v9M12 12L4 7.5" />
    </svg>
  ),
  seal: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.6} className="w-5 h-5">
      <rect x="5" y="10" width="14" height="10" rx="1.6" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M8 10V7a4 4 0 018 0v3" />
    </svg>
  ),
};

const TRUST_ICONS = {
  secure: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} className="w-5 h-5">
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4" />
    </svg>
  ),
  returns: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} className="w-5 h-5">
      <path strokeLinecap="round" strokeLinejoin="round" d="M3 10h10a8 8 0 018 8v2M3 10l4-4M3 10l4 4" />
    </svg>
  ),
  invoice: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} className="w-5 h-5">
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 14h6M9 10h6M17 21H7a2 2 0 01-2-2V5a2 2 0 012-2h7l5 5v11a2 2 0 01-2 2z" />
    </svg>
  ),
  support: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} className="w-5 h-5">
      <path strokeLinecap="round" strokeLinejoin="round" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
    </svg>
  ),
};

export default async function TrailPage() {
  const locale = await getLocale();
  const isHe = locale === "he";

  const serif = isHe
    ? "'Noto Serif Hebrew', Georgia, serif"
    : "Georgia, 'Times New Roman', serif";

  const priceIls = ilsFromUsd("$24.99");

  const specs = [
    { icon: SPEC_ICONS.volume, label: t(locale, "trail_spec_volume"), value: t(locale, "trail_spec_volume_v") },
    { icon: SPEC_ICONS.weight, label: t(locale, "trail_spec_weight"), value: t(locale, "trail_spec_weight_v") },
    { icon: SPEC_ICONS.material, label: t(locale, "trail_spec_material"), value: t(locale, "trail_spec_material_v") },
    { icon: SPEC_ICONS.seal, label: t(locale, "trail_spec_seal"), value: t(locale, "trail_spec_seal_v") },
  ];

  const trust = [
    { icon: TRUST_ICONS.secure, label: t(locale, "trust.securePayment") },
    { icon: TRUST_ICONS.returns, label: t(locale, "trust.returns") },
    { icon: TRUST_ICONS.invoice, label: t(locale, "trust.invoice") },
    { icon: TRUST_ICONS.support, label: t(locale, "trust.hebrewSupport") },
  ];

  return (
    <div style={{ background: "#F5F4F0" }}>
      {/* ── Cinematic hero ──────────────────────────────────────────── */}
      <section
        className="relative w-full overflow-hidden h-[calc(100svh-130px)] md:h-[calc(100svh-174px)]"
        style={{ minHeight: 520 }}
      >
        <div className="absolute inset-0">
          <TrailScene className="w-full h-full" />
        </div>

        {/* Top scrim — keeps the navbar legible over the bright sky */}
        <div
          className="absolute inset-x-0 top-0 pointer-events-none"
          style={{ height: "22%", background: "linear-gradient(to bottom, rgba(8,14,20,0.45), rgba(8,14,20,0))" }}
        />

        {/* Scrim — keeps the copy legible without flattening the scene */}
        <div
          className="absolute inset-x-0 bottom-0 pointer-events-none"
          style={{
            height: "72%",
            background:
              "linear-gradient(to bottom, rgba(10,20,14,0) 0%, rgba(10,20,14,0.35) 45%, rgba(10,20,14,0.82) 100%)",
          }}
        />

        <div className="absolute inset-x-0 bottom-0">
          <div className="max-w-7xl mx-auto px-6 pb-20 md:pb-24">
            <div className="max-w-2xl trail-rise">
              <p
                className="text-[11px] md:text-xs uppercase tracking-[0.22em] mb-4"
                style={{ color: "#EBCFA0", textShadow: "0 1px 14px rgba(10,16,24,0.5)" }}
              >
                {t(locale, "trail_eyebrow")}
              </p>
              <h1
                className={`font-bold mb-5 ${isHe ? "leading-[1.22]" : "leading-[1.02]"}`}
                style={{
                  fontFamily: serif,
                  color: "#FBF8F1",
                  fontSize: "clamp(2.75rem, 7vw, 5.25rem)",
                  letterSpacing: isHe ? undefined : "-0.02em",
                  textShadow: "0 2px 30px rgba(8,16,12,0.5), 0 1px 3px rgba(8,16,12,0.35)",
                }}
              >
                {t(locale, "trail_headline")}
              </h1>
              <p
                className="text-base md:text-lg leading-relaxed mb-8 max-w-md"
                style={{ color: "#E4E7D9", textShadow: "0 1px 16px rgba(8,16,12,0.45)" }}
              >
                {t(locale, "trail_sub")}
              </p>

              <div className="flex flex-col sm:flex-row gap-3 mb-8">
                <Link
                  href={`/products/siptail-trail-bottle?lang=${locale}`}
                  className="inline-block px-8 py-4 text-sm font-semibold uppercase tracking-wide text-center rounded-[3px] shadow-[0_12px_36px_rgba(8,20,12,0.4)] transition-all hover:-translate-y-0.5 hover:opacity-95 touch-manipulation"
                  style={{ background: "#F5F4F0", color: "#1B4332" }}
                >
                  {t(locale, "trail_cta")}
                </Link>
                <Link
                  href={`/products?lang=${locale}`}
                  className="inline-block px-8 py-4 text-sm font-semibold uppercase tracking-wide text-center rounded-[3px] border bg-white/10 backdrop-blur-md transition-colors hover:bg-white/20 touch-manipulation"
                  style={{ borderColor: "rgba(245,244,240,0.55)", color: "#F5F4F0" }}
                >
                  {t(locale, "trail_cta_alt")}
                </Link>
              </div>

              <div
                className="flex flex-wrap items-center gap-x-4 gap-y-1.5 text-xs"
                style={{ color: "#CBD5BE", textShadow: "0 1px 12px rgba(8,16,12,0.5)" }}
              >
                <span>{t(locale, "shipping.freeThreshold")}</span>
                <span aria-hidden="true" style={{ opacity: 0.45 }}>·</span>
                <span>{t(locale, "shipping.leadTime")}</span>
                <span aria-hidden="true" style={{ opacity: 0.45 }}>·</span>
                <span>{isHe ? `החל מ־${priceIls}` : `From ${priceIls}`}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Scroll cue — a thin thread of light */}
        <div className="absolute inset-x-0 bottom-5 hidden md:flex justify-center pointer-events-none">
          <div className="flex flex-col items-center gap-2.5">
            <span className="text-[10px] uppercase tracking-[0.24em]" style={{ color: "rgba(245,244,240,0.55)" }}>
              {t(locale, "trail_scroll")}
            </span>
            <span className="block w-px h-10" style={{ background: "rgba(245,244,240,0.18)" }}>
              <span className="trail-scroll-line block w-px h-full" style={{ background: "rgba(250,235,205,0.9)" }} />
            </span>
          </div>
        </div>
      </section>

      {/* ── Story + specs ───────────────────────────────────────────── */}
      <section className="px-6 py-20 md:py-28">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-14 lg:gap-20 items-center">
            <div>
              <h2
                className="font-bold leading-tight mb-5"
                style={{ fontFamily: serif, color: "#1B4332", fontSize: "clamp(1.75rem, 3.4vw, 2.6rem)" }}
              >
                {t(locale, "trail_story_title")}
              </h2>
              <p className="text-base leading-relaxed mb-9 max-w-lg" style={{ color: "#1A1A1A" }}>
                {t(locale, "trail_story_body")}
              </p>

              <dl className="grid grid-cols-2 gap-x-6 gap-y-7">
                {specs.map((s) => (
                  <div key={String(s.label)}>
                    <div className="flex items-center gap-2 mb-1.5">
                      <span style={{ color: "#4A7C59" }}>{s.icon}</span>
                      <dt className="text-[11px] uppercase tracking-[0.14em]" style={{ color: "#4A7C59" }}>
                        {s.label}
                      </dt>
                    </div>
                    <dd className="text-sm font-semibold" style={{ color: "#1A1A1A" }}>
                      {s.value}
                    </dd>
                  </div>
                ))}
              </dl>
            </div>

            <div className="relative">
              <div className="aspect-[4/5] overflow-hidden" style={{ background: "#FFFFFF" }}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={WE_CONFIG.PRODUCT_IMAGES[0]}
                  alt={isHe ? "בקבוק מים SipTail לכלבים על השביל" : "SipTail Trail Bottle on the trail"}
                  className="w-full h-full object-cover"
                />
              </div>
              <div
                className="absolute bottom-0 end-0 px-6 py-5"
                style={{ background: "#1B4332" }}
              >
                <p className="text-[10px] uppercase tracking-[0.18em] mb-1" style={{ color: "#A9C9B4" }}>
                  {isHe ? "בקבוק הטיול" : "The Trail Bottle"}
                </p>
                <p className="text-2xl font-bold" style={{ color: "#F5F4F0", fontFamily: serif }}>
                  {priceIls}
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Shipping contract ───────────────────────────────────────── */}
      <section className="px-6 py-14" style={{ background: "#FFFFFF" }}>
        <div className="max-w-7xl mx-auto">
          <h3 className="text-sm font-semibold uppercase tracking-[0.16em] mb-5" style={{ color: "#1B4332" }}>
            {t(locale, "shipping.homeDelivery")}
          </h3>
          <div className="flex flex-wrap gap-x-10 gap-y-2 text-sm" style={{ color: "#1A1A1A" }}>
            <span>{t(locale, "shipping.businessDays")}</span>
            <span>{t(locale, "shipping.belowThreshold")}</span>
            <span style={{ color: "#1B4332", fontWeight: 600 }}>{t(locale, "shipping.aboveThreshold")}</span>
          </div>
          <p className="text-xs mt-4" style={{ color: "#55584F" }}>
            {t(locale, "shipping.leadTime")}
          </p>
        </div>
      </section>

      {/* ── Trust strip ─────────────────────────────────────────────── */}
      <section className="px-6 py-12 border-t" style={{ background: "#F5F4F0", borderColor: "#D4E6D4" }}>
        <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-5 text-center">
          {trust.map((item) => (
            <div key={String(item.label)} className="flex flex-col items-center gap-2.5">
              <span
                className="flex items-center justify-center w-11 h-11 rounded-full"
                style={{ background: "#D4E6D4", color: "#1B4332" }}
              >
                {item.icon}
              </span>
              <span className="text-xs font-semibold" style={{ color: "#1A1A1A" }}>
                {item.label}
              </span>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
