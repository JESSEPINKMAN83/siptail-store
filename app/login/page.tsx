export const dynamic = "force-dynamic";
import Link from "next/link";
import LoginForm from "@/components/LoginForm";

export default function LoginPage() {
  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link href="/" className="text-2xl font-bold text-[#1B4332]">Walk Essentials 🐾</Link>
          <h1 className="text-2xl font-bold text-gray-900 mt-4 mb-1">Sign in</h1>
          <p className="text-gray-500 text-sm">Welcome back — sign in to your account</p>
        </div>
        <div className="bg-white border border-gray-100 rounded-2xl shadow-sm p-8">
          <LoginForm />
        </div>
      </div>
    </div>
  );
}
