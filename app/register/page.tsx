export const dynamic = "force-dynamic";
import Link from "next/link";
import RegisterForm from "@/components/RegisterForm";
import Logo from "@/components/Logo";

export default function RegisterPage() {
  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12" style={{ background: "#F5F4F0" }}>
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link href="/" className="inline-block mb-4"><Logo /></Link>
          <h1 className="text-2xl font-bold mt-4 mb-1" style={{ fontFamily: "Georgia, serif", color: "#1A1A1A" }}>Create account</h1>
          <p className="text-sm" style={{ color: "#6B7280" }}>Join Walk Essentials — free to sign up</p>
        </div>
        <div className="border p-8" style={{ background: "#FFFFFF", borderColor: "#D4E6D4" }}>
          <RegisterForm />
        </div>
      </div>
    </div>
  );
}
