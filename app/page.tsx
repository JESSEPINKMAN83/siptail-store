export const dynamic = "force-dynamic";
import Link from "next/link";

export default function HomePage() {
  return (
    <div>
      <section className="bg-gradient-to-br from-blue-50 to-sky-100 py-24 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <p className="text-blue-600 font-semibold text-sm uppercase tracking-widest mb-4">Hydration for active dogs</p>
          <h1 className="text-5xl font-bold text-gray-900 mb-6 leading-tight">Hydrate your dog<br />on every walk</h1>
          <p className="text-xl text-gray-600 mb-10 max-w-2xl mx-auto">The SipTail Trail Bottle keeps your pup refreshed on trails, beaches, and parks. Leak-proof, one-handed, built for adventure.</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/products" className="bg-blue-600 text-white px-8 py-4 rounded-full font-semibold text-lg hover:bg-blue-700 transition-colors">Shop Now</Link>
            <Link href="/products/siptail-trail-bottle" className="bg-white text-blue-600 border-2 border-blue-600 px-8 py-4 rounded-full font-semibold text-lg hover:bg-blue-50 transition-colors">See the Bottle</Link>
          </div>
        </div>
      </section>

      <section className="py-20 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-16">Why dogs love it</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            {[
              { icon: "💧", title: "One-squeeze design", desc: "Squeeze and the tray fills automatically. Release and unused water flows back in — zero waste." },
              { icon: "🔒", title: "Leak-proof lock", desc: "One-click lock keeps your bag dry on the way out. No soggy backpacks." },
              { icon: "🐾", title: "BPA-free and safe", desc: "Food-grade materials. Safe for daily use, easy to clean." },
            ].map((f) => (
              <div key={f.title} className="text-center">
                <div className="text-4xl mb-4">{f.icon}</div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{f.title}</h3>
                <p className="text-gray-600">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 px-4 bg-gray-50">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">The Trail Bottle</h2>
          <div className="bg-white rounded-2xl shadow-sm overflow-hidden flex flex-col md:flex-row">
            <div className="md:w-1/2 bg-blue-100 flex items-center justify-center py-20 px-10">
              <div className="text-center"><div className="text-8xl mb-4">🐾</div><p className="text-blue-400 text-sm">Product photo coming soon</p></div>
            </div>
            <div className="md:w-1/2 p-10 flex flex-col justify-center">
              <h3 className="text-2xl font-bold text-gray-900 mb-3">SipTail Trail Bottle</h3>
              <p className="text-gray-600 mb-6">Built for dogs who keep up. Three sizes for every breed.</p>
              <ul className="space-y-2 mb-8">
                {["Small 350ml — from $24.99","Medium 550ml — from $29.99","Large 750ml — from $34.99"].map(s => (
                  <li key={s} className="flex items-center gap-2 text-gray-700"><span className="text-green-500">✓</span>{s}</li>
                ))}
              </ul>
              <Link href="/products" className="bg-blue-600 text-white px-6 py-3 rounded-full font-semibold text-center hover:bg-blue-700 transition-colors">Shop the Trail Bottle</Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
