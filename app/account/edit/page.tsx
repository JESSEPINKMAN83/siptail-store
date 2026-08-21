export const dynamic = "force-dynamic";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { createWixAuthClient, parseSessionFromCookie } from "@/lib/wix-auth-client";
import EditProfileForm from "@/components/EditProfileForm";
import Link from "next/link";

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

export default async function EditProfilePage() {
  const member = await getMember();
  if (!member) redirect("/login");

  return (
    <div className="max-w-lg mx-auto px-4 sm:px-6 py-12">
      <div className="flex items-center gap-3 mb-8">
        <Link href="/account" className="text-gray-400 hover:text-gray-600 transition-colors">← Back</Link>
        <h1 className="text-xl font-bold text-gray-900">Edit Profile</h1>
      </div>
      <div className="bg-white border border-gray-100 rounded-2xl shadow-sm p-8">
        <EditProfileForm
          initialFirstName={(member.profile as any)?.firstName || ""}
          initialLastName={(member.profile as any)?.lastName || ""}
          email={member.loginEmail || ""}
        />
      </div>
    </div>
  );
}
