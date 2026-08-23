"use client";
import { useState, FormEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function LoginForm({ isHe = false }: { isHe?: boolean }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();
  const inp = "w-full px-4 py-3 border text-sm focus:outline-none focus:border-[#1B4332] focus:ring-1 focus:ring-[#1B4332] transition-colors";
  const istyle = { background: "#FFFFFF", borderColor: "#D4E6D4", color: "#1A1A1A" };
  const lbl = `block text-xs font-semibold uppercase tracking-wide mb-1.5 ${isHe ? "text-right" : ""}`;

  async function handleSubmit(e: FormEvent) {
    e.preventDefault(); setError(""); setLoading(true);
    try {
      const res = await fetch("/api/auth/login", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ email, password }) });
      const data = await res.json();
      if (!res.ok) { setError(data.error || (isHe ? "שגיאה בהתחברות" : "Login failed.")); return; }
      router.push("/account"); router.refresh();
    } catch { setError(isHe ? "שגיאה. נסה שנית." : "Something went wrong."); }
    finally { setLoading(false); }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4" dir={isHe ? "rtl" : "ltr"}>
      <div>
        <label className={lbl} style={{ color: "#1A1A1A" }}>{isHe ? "אימייל" : "Email"}</label>
        <input type="email" required value={email} onChange={e => setEmail(e.target.value)} placeholder="you@example.com" dir="ltr" className={inp} style={istyle} />
      </div>
      <div>
        <label className={lbl} style={{ color: "#1A1A1A" }}>{isHe ? "סיסמה" : "Password"}</label>
        <input type="password" required value={password} onChange={e => setPassword(e.target.value)} placeholder="••••••••" dir="ltr" className={inp} style={istyle} />
      </div>
      {error && <p className={`text-red-600 text-sm border px-4 py-3 ${isHe ? "text-right" : ""}`} style={{ background: "#FEF2F2", borderColor: "#FECACA" }}>{error}</p>}
      <button type="submit" disabled={loading}
        className="w-full py-4 text-sm font-semibold uppercase tracking-wide transition-all touch-manipulation min-h-[52px]"
        style={{ background: loading ? "#D4E6D4" : "#1B4332", color: loading ? "#1A1A1A" : "#FFFFFF", cursor: loading ? "not-allowed" : "pointer" }}>
        {loading ? (isHe ? "מתחבר..." : "Signing in...") : (isHe ? "התחברות" : "Sign In")}
      </button>
      <p className={`text-sm ${isHe ? "text-right" : "text-center"}`} style={{ color: "#6B7280" }}>
        {isHe ? "אין לך חשבון? " : "Don't have an account? "}
        <Link href="/register" className="font-semibold hover:opacity-70 transition-opacity" style={{ color: "#1B4332" }}>
          {isHe ? "הרשמה" : "Sign up"}
        </Link>
      </p>
    </form>
  );
}
