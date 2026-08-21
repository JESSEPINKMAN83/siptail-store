import { createClient, OAuthStrategy } from "@wix/sdk";
import { products } from "@wix/stores";
import { currentCart } from "@wix/ecom";
import { cookies } from "next/headers";

const WIX_CLIENT_ID = process.env.NEXT_PUBLIC_WIX_CLIENT_ID || "placeholder-client-id";
const WIX_SESSION_COOKIE = "wix_session";

export async function getWixServerClient() {
  const cookieStore = await cookies();
  const sessionToken = cookieStore.get(WIX_SESSION_COOKIE)?.value;
  return createClient({
    modules: { products, currentCart },
    auth: OAuthStrategy({
      clientId: WIX_CLIENT_ID,
      tokens: sessionToken ? JSON.parse(sessionToken) : undefined,
    }),
  });
}

export { WIX_SESSION_COOKIE };
