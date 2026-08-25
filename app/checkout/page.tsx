export const dynamic = "force-dynamic";
import CheckoutClient from "@/components/CheckoutClient";
import { getLocale } from "@/lib/locale";

export default async function CheckoutPage() {
  const locale = await getLocale();
  return <CheckoutClient locale={locale} />;
}
