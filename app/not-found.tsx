export const dynamic = "force-dynamic";
import Link from "next/link";
export default function NotFound() {
  return (
    <div className="max-w-xl mx-auto px-4 py-32 text-center">
      <div className="text-6xl mb-6">🐾</div>
      <h1 className="text-3xl font-bold text-gray-900 mb-3">Page not found</h1>
      <p className="text-gray-500 mb-8">The page you are looking for does not exist.</p>
      <Link href="/" className="bg-blue-600 text-white px-8 py-3 rounded-full font-semibold hover:bg-blue-700 transition-colors">Go home</Link>
    </div>
  );
}
