"use client";
import { useState, FormEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function RegisterForm() {
  const [form, setForm] = useState({ firstName: "", lastName: "", email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const router = useRouter();

  function set(k: string) { return (e: React.ChangeEvent<HTMLInputElement>) => setForm(f => ({ ...f, [k]: e.target.value })); }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError(""); setSuccess(""); setLoading(true);
    try {
      const res = await fetch("/api/auth/register", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(form) });
      const data = await res.json();
      if (!res.ok) { setError(data.error || "Registration failed."); return; }
      if (data.requiresVerification) { setSuccess("Account created! Check your email to verify before signing in."); return; }
      router.push("/account"); router.refresh();
    } catch { setError("Something went wrong. Please try again."); }
    finally { setLoading(false); }
  }

  const inp = "w-full px-4 py-3 border text-sm focus:outline-none focus:border-[#1B4332] focus:ring-1 focus:ring-[#1B4332] transition-colors";
  const istyle = { background: "#FFFFFF", borderColor: "#D4E6D4", color: "#1A1A1A" };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wide mb-1.5" style={{ color: "#1A1A1A" }}>First name</label>
          <input type="text" value={form.firstName} onChange={set("firstName")} placeholder="Jane" className={inp} style={istyle} />
        </div>
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wide mb-1.5" style={{ color: "#1A1A1A" }}>Last name</label>
          <input type="text" value={form.lastName} onChange={set("lastName")} placeholder="Doe" className={inp} style={istyle} />
        </div>
      </div>
      <div>
        <label className="block text-xs font-semibold uppercase tracking-wide mb-1.5" style={{ color: "#1A1A1A" }}>Email</label>
        <input type="email" required value={form.email} onChange={set("email")} placeholder="you@example.com" className={inp} style={istyle} />
      </div>
      <div>
        <label className="block text-xs font-semibold uppercase tracking-wide mb-1.5" style={{ color: "#1A1A1A" }}>Password</label>
        <input type="password" required minLength={6} value={form.password} onChange={set("password")} placeholder="At least 6 characters" className={inp} style={istyle} />
      </div>
      {error && <p className="text-red-600 text-sm border px-4 py-3" style={{ background: "#FEF2F2", borderColor: "#FECACA" }}>{error}</p>}
      {success && <p className="text-sm border px-4 py-3" style={{ background: "#F0FDF4", borderColor: "#D4E6D4", color: "#1B4332" }}>{success}</p>}
      <button type="submit" disabled={loading}
        className="w-full py-4 text-sm font-semibold uppercase tracking-wide transition-all touch-manipulation min-h-[52px]"
        style={{ background: loading ? "#D4E6D4" : "#1B4332", color: loading ? "#1A1A1A" : "#FFFFFF", cursor: loading ? "not-allowed" : "pointer" }}>
        {loading ? "Creating account..." : "Create Account"}
      </button>
      <p className="text-center text-sm" style={{ color: "#6B7280" }}>
        Already have an account?{" "}
        <Link href="/login" className="font-semibold hover:opacity-70 transition-opacity" style={{ color: "#1B4332" }}>Sign in</Link>
      </p>
    </form>
  );
}
