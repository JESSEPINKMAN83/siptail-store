"use client";
import { useState, FormEvent } from "react";
import type { Locale } from "@/lib/translations";
import { t } from "@/lib/translations";

export default function NewsletterSignup({ compact = false, locale = "en" as Locale }: { compact?: boolean; locale?: Locale }) {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState("");
  const isHe = locale === "he";

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError(""); setLoading(true);
    try {
      await fetch("/api/newsletter", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ email }) });
      setDone(true);
    } catch { setError(isHe ? "נסה שוב" : "Try again."); }
    finally { setLoading(false); }
  }

  if (done) return <p className="font-medium text-sm" style={{ color: "#D4E6D4" }}>{isHe ? "נרשמת! ברוך הבא." : "You're in. Welcome to the crew."}</p>;

  return (
    <form onSubmit={handleSubmit} className={`flex gap-2 ${isHe ? "flex-col sm:flex-row-reverse" : "flex-col sm:flex-row"}`} dir={isHe ? "rtl" : "ltr"}>
      <input type="email" required value={email} onChange={e => setEmail(e.target.value)}
        placeholder={t(locale, "newsletter_placeholder")}
        className="flex-1 px-4 py-3 text-sm border-0 focus:outline-none focus:ring-1 focus:ring-white min-h-[44px]"
        style={{ background: "rgba(255,255,255,0.15)", color: "#FFFFFF" }} />
      <button type="submit" disabled={loading}
        className="px-5 py-3 text-xs font-semibold uppercase tracking-wide transition-colors touch-manipulation min-h-[44px] whitespace-nowrap"
        style={{ background: "#FFFFFF", color: "#1B4332" }}>
        {loading ? "..." : t(locale, "newsletter_cta")}
      </button>
      {error && <p className="text-xs" style={{ color: "#D4E6D4" }}>{error}</p>}
    </form>
  );
}
