"use client";
import { useState, FormEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

interface Field { name: string; label: string; type: string; placeholder: string; required?: boolean; }

interface Props {
  mode: "login" | "register";
  fields: Field[];
  onSubmit: (data: Record<string, string>) => Promise<{ error?: string; requiresVerification?: boolean }>;
}

export default function AuthForm({ mode, fields, onSubmit }: Props) {
  const [values, setValues] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const router = useRouter();

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError(""); setSuccess(""); setLoading(true);
    try {
      const result = await onSubmit(values);
      if (result.error) { setError(result.error); return; }
      if (result.requiresVerification) {
        setSuccess("Account created! Check your email to verify before logging in.");
        return;
      }
      router.push("/account");
      router.refresh();
    } catch { setError("Something went wrong. Please try again."); }
    finally { setLoading(false); }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {fields.map(f => (
        <div key={f.name}>
          <label className="block text-sm font-medium text-gray-700 mb-1">{f.label}</label>
          <input
            type={f.type}
            placeholder={f.placeholder}
            required={f.required !== false}
            value={values[f.name] || ""}
            onChange={e => setValues(v => ({ ...v, [f.name]: e.target.value }))}
            className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-[#1B4332] focus:ring-1 focus:ring-[#1B4332] transition-colors"
          />
        </div>
      ))}

      {error && <p className="text-red-500 text-sm bg-red-50 border border-red-100 rounded-lg px-4 py-3">{error}</p>}
      {success && <p className="text-green-700 text-sm bg-green-50 border border-green-100 rounded-lg px-4 py-3">{success}</p>}

      <button type="submit" disabled={loading}
        className="w-full py-4 bg-[#1B4332] text-white rounded-xl font-bold text-base hover:bg-[#2d5a3d] active:bg-[#143326] transition-colors disabled:opacity-60 touch-manipulation min-h-[52px]">
        {loading ? "Please wait..." : mode === "login" ? "Sign In" : "Create Account"}
      </button>

      <p className="text-center text-sm text-gray-500">
        {mode === "login" ? (
          <>Don&apos;t have an account?{" "}<Link href="/register" className="text-[#1B4332] font-semibold hover:underline">Sign up</Link></>
        ) : (
          <>Already have an account?{" "}<Link href="/login" className="text-[#1B4332] font-semibold hover:underline">Sign in</Link></>
        )}
      </p>
    </form>
  );
}
