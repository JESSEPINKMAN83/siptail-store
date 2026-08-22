export const dynamic = "force-dynamic";
import ContactForm from "@/components/ContactForm";

export default function ContactPage() {
  return (
    <div style={{ background: "#F5F4F0" }}>
      <div className="max-w-2xl mx-auto px-4 sm:px-6 py-12">
        <div className="text-center mb-10">
          <h1 className="text-3xl font-bold mb-2" style={{ fontFamily: "Georgia, serif", color: "#1A1A1A" }}>Get in touch</h1>
          <p className="text-sm" style={{ color: "#6B7280" }}>We reply within 24 hours.</p>
        </div>
        <div className="border p-8" style={{ background: "#FFFFFF", borderColor: "#D4E6D4" }}>
          <ContactForm />
        </div>
        <div className="mt-8 grid grid-cols-2 gap-4 text-center">
          <div className="border p-6" style={{ background: "#FFFFFF", borderColor: "#D4E6D4" }}>
            <p className="text-sm font-semibold mb-0.5" style={{ fontFamily: "Georgia, serif", color: "#1A1A1A" }}>Email</p>
            <p className="text-xs" style={{ color: "#6B7280" }}>hello@walkessentials.com</p>
          </div>
          <div className="border p-6" style={{ background: "#FFFFFF", borderColor: "#D4E6D4" }}>
            <p className="text-sm font-semibold mb-0.5" style={{ fontFamily: "Georgia, serif", color: "#1A1A1A" }}>Response time</p>
            <p className="text-xs" style={{ color: "#6B7280" }}>Within 24 hours</p>
          </div>
        </div>
      </div>
    </div>
  );
}
