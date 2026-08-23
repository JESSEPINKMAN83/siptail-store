export const dynamic = "force-dynamic";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { createWixAuthClient, parseSessionFromCookie } from "@/lib/wix-auth-client";
import Link from "next/link";
import LogoutButton from "@/components/LogoutButton";
import { getLocale } from "@/lib/locale";

async function getMember() {
  try {
    const cookieStore = await cookies();
    const cookieHeader = cookieStore.getAll().map(c => `${c.name}=${c.value}`).join("; ");
    const tokens = parseSessionFromCookie(cookieHeader);
    if (!tokens) return null;
    const client = createWixAuthClient(tokens);
    if (!(client.auth as any).loggedIn()) return null;
    const result = await (client.members as any).getCurrentMember({ fieldsets: ["FULL"] });
    const member = result?.member as any;
    return member ?? null;
  } catch { return null; }
}

export default async function AccountPage() {
  const locale = await getLocale();
  const isHe = locale === "he";
  const member = await getMember();
  if (!member) redirect("/login");

  const firstName = member.profile?.firstName || member.loginEmail?.split("@")[0] || (isHe ? "שלום" : "there");
  const memberSince = member._createdDate
    ? new Date(member._createdDate).toLocaleDateString(isHe ? "he-IL" : "en-IE", { year: "numeric", month: "long" })
    : null;

  return (
    <div style={{ background: "#F5F4F0" }} dir={isHe ? "rtl" : "ltr"}>
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="flex items-center justify-between mb-10">
          <div className={isHe ? "text-right" : ""}>
            <h1 className="text-2xl font-bold" style={{ fontFamily: "Georgia, serif", color: "#1A1A1A" }}>
              {isHe ? `שלום ${firstName} 👋` : `Hi ${firstName} 👋`}
            </h1>
            {memberSince && <p className="text-sm mt-0.5" style={{ color: "#6B7280" }}>
              {isHe ? `חבר מאז ${memberSince}` : `Member since ${memberSince}`}
            </p>}
          </div>
          <LogoutButton isHe={isHe} />
        </div>

        {/* Quick links */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-10">
          {[
            { label: isHe ? "עריכת פרופיל" : "Edit Profile", href: "/account/edit", icon: "✏️" },
            { label: isHe ? "חנות" : "Shop", href: "/products", icon: "🛍️" },
            { label: isHe ? "צור קשר" : "Contact Us", href: "/contact", icon: "📬" },
          ].map(l => (
            <Link key={l.label} href={l.href}
              className={`flex flex-col items-center gap-2 p-5 bg-white border border-gray-100 hover:shadow-md active:scale-[0.98] transition-all touch-manipulation ${isHe ? "text-right" : ""}`}>
              <span className="text-2xl">{l.icon}</span>
              <span className="text-sm font-medium" style={{ color: "#1A1A1A" }}>{l.label}</span>
            </Link>
          ))}
        </div>

        {/* Order history */}
        <div className="bg-white border border-gray-100 p-6">
          <h2 className={`text-lg font-bold mb-4 ${isHe ? "text-right" : ""}`} style={{ fontFamily: "Georgia, serif", color: "#1A1A1A" }}>
            {isHe ? "היסטוריית הזמנות" : "Order History"}
          </h2>
          <div className="text-center py-10">
            <div className="text-4xl mb-3">📦</div>
            <p className="text-sm mb-4" style={{ color: "#6B7280" }}>{isHe ? "אין הזמנות עדיין." : "No orders yet."}</p>
            <Link href="/products" className="inline-block px-6 py-3 text-sm font-semibold uppercase tracking-wide" style={{ background: "#1B4332", color: "#FFFFFF" }}>
              {isHe ? "לקנייה" : "Start Shopping"}
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
