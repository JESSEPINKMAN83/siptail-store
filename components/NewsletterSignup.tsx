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
      await fetch("/api/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      setDone(true);
    } catch { setError("Try again."); }
    finally { setLoading(false); }
  }

  if (done) return (
    <p className={`text-green-600 font-medium ${compact ? "text-sm" : "text-base"}`}>
      You&apos;re in! 🐾
    </p>
  );

  return (
    <form onSubmit={handleSubmit} className={`flex gap-2 ${compact ? "flex-col sm:flex-row" : "flex-col sm:flex-row"}`}>
      <input type="email" required value={email} onChange={e => setEmail(e.target.value)}
        placeholder="Your email address"
        className="flex-1 px-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-[#1B4332] focus:ring-1 focus:ring-[#1B4332] transition-colors min-h-[44px]" />
      <button type="submit" disabled={loading}
        className="px-5 py-3 bg-[#1B4332] text-white rounded-xl text-sm font-bold hover:bg-[#2d5a3d] active:bg-[#143326] transition-colors disabled:opacity-60 touch-manipulation min-h-[44px] whitespace-nowrap">
        {loading ? "..." : "Join the Walk"}
      </button>
      {error && <p className="text-red-500 text-xs col-span-2">{error}</p>}
    </form>
  );
}
