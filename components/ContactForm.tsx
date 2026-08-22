"use client";
import { useState, FormEvent } from "react";

const SUBJECTS = ["Order Question", "Product Question", "General", "Returns & Refunds"];

export default function ContactForm() {
  const [form, setForm] = useState({ name: "", email: "", subject: SUBJECTS[0], message: "" });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  function set(k: string) { return (e: React.ChangeEvent<HTMLInputElement|HTMLSelectElement|HTMLTextAreaElement>) => setForm(f => ({ ...f, [k]: e.target.value })); }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError(""); setLoading(true);
    try {
      const res = await fetch("/api/contact", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(form) });
      if (!res.ok) { const d = await res.json(); setError(d.error || "Something went wrong."); return; }
      setSuccess(true);
    } catch { setError("Something went wrong. Please try again."); }
    finally { setLoading(false); }
  }

  if (success) return (
    <div className="text-center py-10">
      <div className="text-3xl mb-4" style={{ color: "#1B4332" }}>✓</div>
      <h3 className="text-xl font-bold mb-2" style={{ fontFamily: "Georgia, serif", color: "#1A1A1A" }}>Message sent.</h3>
      <p className="text-sm" style={{ color: "#6B7280" }}>We&apos;ll get back to you within 24 hours.</p>
    </div>
  );

  const inp = "w-full px-4 py-3 border text-sm focus:outline-none focus:border-[#1B4332] focus:ring-1 focus:ring-[#1B4332] transition-colors";
  const istyle = { background: "#FFFFFF", borderColor: "#D4E6D4", color: "#1A1A1A" };
  const lbl = "block text-xs font-semibold uppercase tracking-wide mb-1.5";

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div><label className={lbl} style={{ color: "#1A1A1A" }}>Name</label><input type="text" required value={form.name} onChange={set("name")} placeholder="Jane Doe" className={inp} style={istyle} /></div>
        <div><label className={lbl} style={{ color: "#1A1A1A" }}>Email</label><input type="email" required value={form.email} onChange={set("email")} placeholder="you@example.com" className={inp} style={istyle} /></div>
      </div>
      <div><label className={lbl} style={{ color: "#1A1A1A" }}>Subject</label><select value={form.subject} onChange={set("subject")} className={inp} style={istyle}>{SUBJECTS.map(s => <option key={s}>{s}</option>)}</select></div>
      <div><label className={lbl} style={{ color: "#1A1A1A" }}>Message</label><textarea required value={form.message} onChange={set("message")} rows={5} placeholder="How can we help?" className={inp + " resize-none"} style={istyle} /></div>
      {error && <p className="text-red-600 text-sm">{error}</p>}
      <button type="submit" disabled={loading}
        className="w-full py-4 text-sm font-semibold uppercase tracking-wide transition-all touch-manipulation min-h-[52px]"
        style={{ background: loading ? "#D4E6D4" : "#1B4332", color: loading ? "#1A1A1A" : "#FFFFFF", cursor: loading ? "not-allowed" : "pointer" }}>
        {loading ? "Sending..." : "Send Message"}
      </button>
    </form>
  );
}
