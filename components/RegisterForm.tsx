"use client";
import { useState, FormEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function RegisterForm({ isHe = false }: { isHe?: boolean }) {
  const [form, setForm] = useState({ firstName: "", lastName: "", email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const router = useRouter();
  const inp = "w-full px-4 py-3 border text-sm focus:outline-none focus:border-[#1B4332] focus:ring-1 focus:ring-[#1B4332] transition-colors";
  const istyle = { background: "#FFFFFF", borderColor: "#D4E6D4", color: "#1A1A1A" };
  const lbl = `block text-xs font-semibold uppercase tracking-wide mb-1.5 ${isHe ? "text-right" : ""}`;

  function set(k: string) { return (e: React.ChangeEvent<HTMLInputElement>) => setForm(f => ({ ...f, [k]: e.target.value })); }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault(); setError(""); setSuccess(""); setLoading(true);
    try {
      const res = await fetch("/api/auth/register", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(form) });
      const data = await res.json();
      if (!res.ok) { setError(data.error || (isHe ? "שגיאה בהרשמה" : "Registration failed.")); return; }
      if (data.requiresVerification) { setSuccess(isHe ? "החשבון נוצר! בדוק את האימייל שלך לפני ההתחברות." : "Account created! Check your email to verify."); return; }
      router.push("/account"); router.refresh();
    } catch { setError(isHe ? "שגיאה. נסה שנית." : "Something went wrong."); }
    finally { setLoading(false); }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4" dir={isHe ? "rtl" : "ltr"}>
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className={lbl} style={{ color: "#1A1A1A" }}>{isHe ? "שם פרטי" : "First name"}</label>
          <input type="text" value={form.firstName} onChange={set("firstName")} placeholder={isHe ? "ישראל" : "Jane"} dir={isHe ? "rtl" : "ltr"} className={inp} style={istyle} />
        </div>
        <div>
          <label className={lbl} style={{ color: "#1A1A1A" }}>{isHe ? "שם משפחה" : "Last name"}</label>
          <input type="text" value={form.lastName} onChange={set("lastName")} placeholder={isHe ? "ישראלי" : "Doe"} dir={isHe ? "rtl" : "ltr"} className={inp} style={istyle} />
        </div>
      </div>
      <div>
        <label className={lbl} style={{ color: "#1A1A1A" }}>{isHe ? "אימייל" : "Email"}</label>
        <input type="email" required value={form.email} onChange={set("email")} placeholder="you@example.com" dir="ltr" className={inp} style={istyle} />
      </div>
      <div>
        <label className={lbl} style={{ color: "#1A1A1A" }}>{isHe ? "סיסמה" : "Password"}</label>
        <input type="password" required minLength={6} value={form.password} onChange={set("password")} placeholder={isHe ? "לפחות 6 תווים" : "At least 6 characters"} dir="ltr" className={inp} style={istyle} />
      </div>
      {error && <p className={`text-red-600 text-sm border px-4 py-3 ${isHe ? "text-right" : ""}`} style={{ background: "#FEF2F2", borderColor: "#FECACA" }}>{error}</p>}
      {success && <p className={`text-sm border px-4 py-3 ${isHe ? "text-right" : ""}`} style={{ background: "#F0FAF4", borderColor: "#D4E6D4", color: "#1B4332" }}>{success}</p>}
      <button type="submit" disabled={loading}
        className="w-full py-4 text-sm font-semibold uppercase tracking-wide transition-all touch-manipulation min-h-[52px]"
        style={{ background: loading ? "#D4E6D4" : "#1B4332", color: loading ? "#1A1A1A" : "#FFFFFF", cursor: loading ? "not-allowed" : "pointer" }}>
        {loading ? (isHe ? "יוצר חשבון..." : "Creating account...") : (isHe ? "יצירת חשבון" : "Create Account")}
      </button>
      <p className={`text-sm ${isHe ? "text-right" : "text-center"}`} style={{ color: "#6B7280" }}>
        {isHe ? "כבר יש לך חשבון? " : "Already have an account? "}
        <Link href="/login" className="font-semibold hover:opacity-70 transition-opacity" style={{ color: "#1B4332" }}>
          {isHe ? "התחברות" : "Sign in"}
        </Link>
      </p>
    </form>
  );
}
