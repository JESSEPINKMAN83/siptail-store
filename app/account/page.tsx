export const dynamic = "force-dynamic";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { createWixAuthClient, parseSessionFromCookie } from "@/lib/wix-auth-client";
import Link from "next/link";
import LogoutButton from "@/components/LogoutButton";

async function getMember() {
  try {
    const cookieStore = await cookies();
    const cookieHeader = cookieStore.getAll().map(c => `${c.name}=${c.value}`).join("; ");
    const tokens = parseSessionFromCookie(cookieHeader);
    if (!tokens) return null;
    const client = createWixAuthClient(tokens);
    if (!(client.auth as any).loggedIn()) return null;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const result = await (client.members as any).getCurrentMember({ fieldsets: ["FULL"] });
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const member = result?.member as any;
    return member ?? null; // already any
  } catch { return null; }
}

async function getOrders(tokens: object) {
  try {
    const res = await fetch("https://www.wixapis.com/ecom/v1/orders/search", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${(tokens as { accessToken?: { value?: string } }).accessToken?.value || ""}`,
        "wix-site-id": "c9466f44-badc-4481-af3e-2b00fa6472c8",
      },
      body: JSON.stringify({ search: { cursorPaging: { limit: 10 } } }),
    });
    if (!res.ok) return [];
    const data = await res.json();
    return data.orders ?? [];
  } catch { return []; }
}

export default async function AccountPage() {
  const member = await getMember();
  if (!member) redirect("/login");

  const firstName = (member.profile as any)?.firstName || member.loginEmail?.split("@")[0] || "there";
  const memberSince = member._createdDate
    ? new Date(member._createdDate).toLocaleDateString("en-IE", { year: "numeric", month: "long" })
    : null;

  const cookieStore = await cookies();
  const cookieHeader = cookieStore.getAll().map(c => `${c.name}=${c.value}`).join("; ");
  const tokens = parseSessionFromCookie(cookieHeader);
  const orders = tokens ? await getOrders(tokens) : [];

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Header */}
      <div className="flex items-center justify-between mb-10">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Hi {firstName} 👋</h1>
          {memberSince && <p className="text-sm text-gray-400 mt-0.5">Member since {memberSince}</p>}
        </div>
        <LogoutButton />
      </div>

      {/* Quick links */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-10">
        {[
          { label: "Edit Profile", href: "/account/edit", icon: "✏️" },
          { label: "Shop", href: "/products", icon: "🛍️" },
          { label: "Contact Us", href: "/contact", icon: "📬" },
        ].map(l => (
          <Link key={l.label} href={l.href}
            className="flex flex-col items-center gap-2 p-5 bg-white border border-gray-100 rounded-2xl hover:shadow-md hover:border-[#1B4332] active:scale-[0.98] transition-all touch-manipulation">
            <span className="text-2xl">{l.icon}</span>
            <span className="text-sm font-medium text-gray-700">{l.label}</span>
          </Link>
        ))}
      </div>

      {/* Order history */}
      <div className="bg-white border border-gray-100 rounded-2xl p-6">
        <h2 className="text-lg font-bold text-gray-900 mb-4">Order History</h2>
        {orders.length === 0 ? (
          <div className="text-center py-10">
            <div className="text-4xl mb-3">📦</div>
            <p className="text-gray-500 text-sm mb-4">No orders yet.</p>
            <Link href="/products" className="inline-block bg-[#1B4332] text-white px-6 py-3 rounded-full text-sm font-semibold hover:bg-[#2d5a3d] transition-colors">
              Start Shopping
            </Link>
          </div>
        ) : (
          <div className="space-y-3">
            {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
            {orders.map((order: any) => (
              <div key={order.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                <div>
                  <p className="text-sm font-semibold text-gray-900">Order #{order.number}</p>
                  <p className="text-xs text-gray-400">{new Date(order._createdDate).toLocaleDateString("en-IE")}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-bold text-[#1B4332]">{order.priceSummary?.total?.formattedAmount}</p>
                  <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                    order.fulfillmentStatus === "FULFILLED" ? "bg-green-100 text-green-700" : "bg-amber-100 text-amber-700"
                  }`}>{order.fulfillmentStatus || "Processing"}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
