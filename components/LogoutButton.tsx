"use client";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function LogoutButton({ isHe = false }: { isHe?: boolean }) {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function handleLogout() {
    setLoading(true);
    try {
      await fetch("/api/auth/logout", { method: "POST" });
      router.push("/");
      router.refresh();
    } catch { setLoading(false); }
  }

  return (
    <button onClick={handleLogout} disabled={loading}
      className="px-4 py-2 text-sm font-medium border transition-colors touch-manipulation min-h-[44px]"
      style={{ borderColor: "#D4E6D4", color: "#6B7280" }}>
      {loading ? (isHe ? "..." : "Logging out...") : (isHe ? "התנתקות" : "Log Out")}
    </button>
  );
}
