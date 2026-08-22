"use client";
import { useState, FormEvent } from "react";

export default function NewsletterSignup({ compact = false }: { compact?: boolean }) {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError(""); setLoading(true);
    try {
      await fetch("/api/newsletter", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ email }) });
      setDone(true);
    } catch { setError("Try again."); }
    finally { setLoading(false); }
  }

  if (done) return <p className="font-medium text-sm" style={{ color: "#D4E6D4" }}>You&apos;re in. Welcome to the crew.</p>;

  return (
    <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-2">
      <input type="email" required value={email} onChange={e => setEmail(e.target.value)}
        placeholder="Your email address"
        className="flex-1 px-4 py-3 text-sm border-0 focus:outline-none focus:ring-1 focus:ring-white min-h-[44px]"
        style={{ background: "rgba(255,255,255,0.15)", color: "#FFFFFF" }} />
      <button type="submit" disabled={loading}
        className="px-5 py-3 text-xs font-semibold uppercase tracking-wide transition-colors touch-manipulation min-h-[44px] whitespace-nowrap"
        style={{ background: "#FFFFFF", color: "#1B4332" }}>
        {loading ? "..." : "Join the Walk"}
      </button>
      {error && <p className="text-xs" style={{ color: "#D4E6D4" }}>{error}</p>}
    </form>
  );
}
