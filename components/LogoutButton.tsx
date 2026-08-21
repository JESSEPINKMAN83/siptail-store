"use client";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function LogoutButton() {
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
      className="px-4 py-2 text-sm font-medium text-gray-500 border border-gray-200 rounded-xl hover:text-red-500 hover:border-red-200 active:bg-red-50 transition-colors touch-manipulation min-h-[44px]">
      {loading ? "Logging out..." : "Log Out"}
    </button>
  );
}
