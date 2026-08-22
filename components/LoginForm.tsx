"use client";
import { useState, FormEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError(""); setLoading(true);
    try {
      const res = await fetch("/api/auth/login", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ email, password }) });
      const data = await res.json();
      if (!res.ok) { setError(data.error || "Login failed."); return; }
      router.push("/account"); router.refresh();
    } catch { setError("Something went wrong. Please try again."); }
    finally { setLoading(false); }
  }

  const inp = "w-full px-4 py-3 border text-sm focus:outline-none focus:border-[#1B4332] focus:ring-1 focus:ring-[#1B4332] transition-colors";

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-xs font-semibold uppercase tracking-wide mb-1.5" style={{ color: "#1A1A1A" }}>Email</label>
        <input type="email" required value={email} onChange={e => setEmail(e.target.value)} placeholder="you@example.com"
          className={inp} style={{ background: "#FFFFFF", borderColor: "#D4E6D4", color: "#1A1A1A" }} />
      </div>
      <div>
        <label className="block text-xs font-semibold uppercase tracking-wide mb-1.5" style={{ color: "#1A1A1A" }}>Password</label>
        <input type="password" required value={password} onChange={e => setPassword(e.target.value)} placeholder="••••••••"
          className={inp} style={{ background: "#FFFFFF", borderColor: "#D4E6D4", color: "#1A1A1A" }} />
      </div>
      {error && <p className="text-red-600 text-sm border px-4 py-3" style={{ background: "#FEF2F2", borderColor: "#FECACA" }}>{error}</p>}
      <button type="submit" disabled={loading}
        className="w-full py-4 text-sm font-semibold uppercase tracking-wide transition-all touch-manipulation min-h-[52px]"
        style={{ background: loading ? "#D4E6D4" : "#1B4332", color: loading ? "#1A1A1A" : "#FFFFFF", cursor: loading ? "not-allowed" : "pointer" }}>
        {loading ? "Signing in..." : "Sign In"}
      </button>
      <p className="text-center text-sm" style={{ color: "#6B7280" }}>
        Don&apos;t have an account?{" "}
        <Link href="/register" className="font-semibold hover:opacity-70 transition-opacity" style={{ color: "#1B4332" }}>Sign up</Link>
      </p>
    </form>
  );
}
