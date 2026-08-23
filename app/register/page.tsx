export const dynamic = "force-dynamic";
import Link from "next/link";
import RegisterForm from "@/components/RegisterForm";
import { LogoVertical } from "@/components/Logo";
import { getLocale } from "@/lib/locale";

export default async function RegisterPage() {
  const locale = await getLocale();
  const isHe = locale === "he";
  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12" style={{ background: "#F5F4F0" }}>
      <div className="w-full max-w-md">
        <div className={`text-center mb-8 ${isHe ? "text-right" : ""}`}>
          <Link href="/" className="inline-block mb-4"><LogoVertical /></Link>
          <h1 className="text-2xl font-bold mt-4 mb-1" style={{ fontFamily: "Georgia, serif", color: "#1A1A1A" }}>
            {isHe ? "יצירת חשבון" : "Create account"}
          </h1>
          <p className="text-sm" style={{ color: "#6B7280" }}>
            {isHe ? "הצטרף ל-Walk Essentials בחינם" : "Join Walk Essentials — free to sign up"}
          </p>
        </div>
        <div className="border p-8" style={{ background: "#FFFFFF", borderColor: "#D4E6D4" }}>
          <RegisterForm isHe={isHe} />
        </div>
      </div>
    </div>
  );
}
