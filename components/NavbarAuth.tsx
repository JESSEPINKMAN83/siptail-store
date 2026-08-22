"use client";
import { useEffect, useState, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

interface Member {
  profile?: { firstName?: string | null } | null;
  loginEmail?: string | null;
}

interface Props {
  signInLabel?: string;
  accountLabel?: string;
}

export default function NavbarAuth({ signInLabel = "Sign In", accountLabel = "My account" }: Props) {
  const [member, setMember] = useState<Member | null>(null);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const router = useRouter();

  useEffect(() => {
    fetch("/api/auth/me")
      .then(r => r.json())
      .then(d => setMember(d.member || null))
      .catch(() => setMember(null))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    function handler(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  async function handleLogout() {
    await fetch("/api/auth/logout", { method: "POST" });
    setMember(null);
    router.push("/");
    router.refresh();
  }

  if (loading) return <div className="w-8 h-8 rounded-full bg-gray-100 animate-pulse" />;

  if (!member) {
    return (
      <Link href="/login"
        className="hidden sm:flex items-center gap-1 px-3 py-2 text-sm font-medium text-[#1A1A1A] hover:text-[#1B4332] transition-colors touch-manipulation min-h-[44px]">
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
        </svg>
        <span className="hidden md:inline">{signInLabel}</span>
      </Link>
    );
  }

  const displayName = (member.profile as { firstName?: string | null } | null)?.firstName || member.loginEmail?.split("@")[0] || accountLabel;

  return (
    <div ref={ref} className="relative hidden sm:block">
      <button
        onClick={() => setOpen(o => !o)}
        className="flex items-center gap-1.5 px-3 py-2 text-sm font-medium text-[#1B4332] hover:bg-green-50 rounded transition-colors touch-manipulation min-h-[44px]"
      >
        <div className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold text-white flex-shrink-0" style={{ background: "#1B4332" }}>
          {displayName[0].toUpperCase()}
        </div>
        <span className="hidden md:inline max-w-[80px] truncate">{displayName}</span>
        <svg className={`w-3 h-3 text-gray-400 transition-transform ${open ? "rotate-180" : ""}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>
      {open && (
        <div className="absolute right-0 mt-1 w-48 bg-white border border-gray-100 rounded-xl shadow-lg py-2 z-50">
          <Link href="/account" onClick={() => setOpen(false)} className="flex items-center gap-2 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 hover:text-[#1B4332] transition-colors">
            <span>👤</span> {accountLabel}
          </Link>
          <div className="border-t border-gray-100 my-1" />
          <button onClick={() => { setOpen(false); handleLogout(); }}
            className="w-full flex items-center gap-2 px-4 py-2.5 text-sm text-red-500 hover:bg-red-50 transition-colors">
            <span>🚪</span> {document.documentElement.lang === "he" ? "התנתקות" : "Log Out"}
          </button>
        </div>
      )}
    </div>
  );
}
