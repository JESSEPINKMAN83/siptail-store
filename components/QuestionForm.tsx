"use client";
import { useState, FormEvent } from "react";

export default function QuestionForm({ productSlug }: { productSlug: string }) {
  const [form, setForm] = useState({ name: "", email: "", question: "" });
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState("");

  function set(k: string) { return (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => setForm(f => ({ ...f, [k]: e.target.value })); }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError(""); setLoading(true);
    try {
      const res = await fetch("/api/question", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, productSlug }),
      });
      const data = await res.json();
      if (!res.ok) { setError(data.error || "Something went wrong."); return; }
      setDone(true);
    } catch { setError("Something went wrong. Please try again."); }
    finally { setLoading(false); }
  }

  if (done) return (
    <div className="text-center py-4">
      <p className="text-green-700 font-medium">Your question has been sent! We&apos;ll answer within 24 hours. 🐾</p>
    </div>
  );

  const inp = "w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-[#1B4332] focus:ring-1 focus:ring-[#1B4332] transition-colors";

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-xs font-medium text-gray-600 mb-1">Name</label>
          <input type="text" required value={form.name} onChange={set("name")} placeholder="Your name" className={inp} />
        </div>
        <div>
          <label className="block text-xs font-medium text-gray-600 mb-1">Email</label>
          <input type="email" required value={form.email} onChange={set("email")} placeholder="you@example.com" className={inp} />
        </div>
      </div>
      <div>
        <label className="block text-xs font-medium text-gray-600 mb-1">Your question</label>
        <textarea required value={form.question} onChange={set("question")} rows={3} placeholder="Ask anything about this product..."
          className={inp + " resize-none"} />
      </div>
      {error && <p className="text-red-500 text-xs">{error}</p>}
      <button type="submit" disabled={loading}
        className="w-full py-3 bg-[#1B4332] text-white rounded-lg text-sm font-bold hover:bg-[#2d5a3d] transition-colors disabled:opacity-60 touch-manipulation min-h-[44px]">
        {loading ? "Sending..." : "Send Question"}
      </button>
    </form>
  );
}
