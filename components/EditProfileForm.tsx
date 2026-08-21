"use client";
import { useState, FormEvent } from "react";
import { useRouter } from "next/navigation";

interface Props { initialFirstName: string; initialLastName: string; email: string; }

export default function EditProfileForm({ initialFirstName, initialLastName, email }: Props) {
  const [firstName, setFirstName] = useState(initialFirstName);
  const [lastName, setLastName] = useState(initialLastName);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError(""); setSuccess(false); setLoading(true);
    try {
      const res = await fetch("/api/auth/update-profile", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ firstName, lastName }),
      });
      const data = await res.json();
      if (!res.ok) { setError(data.error || "Update failed."); return; }
      setSuccess(true);
      router.refresh();
    } catch { setError("Something went wrong. Please try again."); }
    finally { setLoading(false); }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">First name</label>
          <input type="text" value={firstName} onChange={e => setFirstName(e.target.value)}
            className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-[#1B4332] focus:ring-1 focus:ring-[#1B4332] transition-colors" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Last name</label>
          <input type="text" value={lastName} onChange={e => setLastName(e.target.value)}
            className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-[#1B4332] focus:ring-1 focus:ring-[#1B4332] transition-colors" />
        </div>
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
        <input type="email" value={email} disabled
          className="w-full px-4 py-3 border border-gray-100 rounded-xl text-sm bg-gray-50 text-gray-400 cursor-not-allowed" />
        <p className="text-xs text-gray-400 mt-1">Email cannot be changed here.</p>
      </div>
      {error && <p className="text-red-500 text-sm bg-red-50 border border-red-100 rounded-lg px-4 py-3">{error}</p>}
      {success && <p className="text-green-700 text-sm bg-green-50 border border-green-100 rounded-lg px-4 py-3">Profile updated successfully!</p>}
      <button type="submit" disabled={loading}
        className="w-full py-4 bg-[#1B4332] text-white rounded-xl font-bold text-base hover:bg-[#2d5a3d] transition-colors disabled:opacity-60 touch-manipulation min-h-[52px]">
        {loading ? "Saving..." : "Save Changes"}
      </button>
    </form>
  );
}
