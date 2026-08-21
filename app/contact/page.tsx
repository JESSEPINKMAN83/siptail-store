export const dynamic = "force-dynamic";
import ContactForm from "@/components/ContactForm";

export default function ContactPage() {
  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 py-12">
      <div className="text-center mb-10">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Get in touch</h1>
        <p className="text-gray-500">We reply within 24 hours. Got a question about an order? Include your order number.</p>
      </div>
      <div className="bg-white border border-gray-100 rounded-2xl shadow-sm p-8">
        <ContactForm />
      </div>
      <div className="mt-8 grid grid-cols-2 gap-4 text-center">
        <div className="bg-gray-50 rounded-2xl p-6">
          <div className="text-2xl mb-2">📧</div>
          <p className="text-sm font-semibold text-gray-900">Email</p>
          <p className="text-sm text-gray-500 mt-0.5">hello@walkessentials.com</p>
        </div>
        <div className="bg-gray-50 rounded-2xl p-6">
          <div className="text-2xl mb-2">⏱️</div>
          <p className="text-sm font-semibold text-gray-900">Response time</p>
          <p className="text-sm text-gray-500 mt-0.5">Within 24 hours</p>
        </div>
      </div>
    </div>
  );
}
