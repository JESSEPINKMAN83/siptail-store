# SipTail Store

Next.js 14 headless storefront for the SipTail Trail Bottle. Wix handles the backend (products, inventory, cart, checkout, orders). Next.js + Tailwind CSS handles the frontend.

---

## Run locally

```bash
npm install
cp .env.local.example .env.local
# Fill in NEXT_PUBLIC_WIX_CLIENT_ID (see .env.local.example for instructions)
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). The store works in preview mode without a real Client ID — it shows placeholder product data.

---

## Pages and where to edit them

| Page | File | What it does |
|---|---|---|
| Homepage | `app/page.tsx` | Hero, features, featured product card |
| Product listing | `app/products/page.tsx` | Fetches all products from Wix |
| Product detail | `app/products/[slug]/page.tsx` | Images, description, variant picker, add to cart |
| Cart | `app/cart/page.tsx` + `components/CartContents.tsx` | Line items, quantities, checkout button |
| Checkout | `app/checkout/page.tsx` | Redirects to Wix hosted checkout |
| Thank you | `app/thank-you/page.tsx` | Post-purchase confirmation |

### Editing with Tailwind

Tailwind uses utility classes directly in JSX. Examples:

```tsx
// Blue button
<button className="bg-blue-600 text-white px-6 py-3 rounded-full">Buy</button>

// Responsive grid: 1 col mobile, 3 col desktop
<div className="grid grid-cols-1 md:grid-cols-3 gap-8">

// Card with hover shadow
<div className="bg-white rounded-2xl border border-gray-100 hover:shadow-md transition-shadow">
```

Full reference: [tailwindcss.com/docs](https://tailwindcss.com/docs)

---

## Connect the real Wix backend

The Client ID is already set in `.env.local.example` and in Vercel. After deploying:

### Add your Vercel URL as an allowed redirect URI

1. Go to [manage.wix.com](https://manage.wix.com)
2. Open the **SipTail** site
3. Settings → Headless Settings → OAuth Apps → **SipTail Store Frontend**
4. Under **Allowed Redirect Domains**, add your Vercel URL (e.g. `siptail-store.vercel.app`)
5. Save

This is the one manual step required to enable cart and checkout on the live site.

---

## Deploy to Vercel

### First deploy

1. Go to [vercel.com](https://vercel.com) and sign in with GitHub (`jessepinkman83`)
2. Click **Add New Project** → import `siptail-store`
3. Under **Environment Variables**, add:
   - `NEXT_PUBLIC_WIX_CLIENT_ID` = `1d47ce62-8390-4782-86d3-c706cde04ec3`
4. Click **Deploy**

Vercel assigns a URL like `siptail-store-xxx.vercel.app`. Add that URL to the Wix OAuth app's Allowed Redirect Domains (see above).

### Subsequent deploys

Every push to `main` triggers a new Vercel deployment automatically.

---

## Project structure

```
siptail-store/
├── app/
│   ├── layout.tsx           # Root layout (navbar, footer)
│   ├── page.tsx             # Homepage
│   ├── globals.css          # Global styles + Tailwind
│   ├── products/
│   │   ├── page.tsx         # Product listing
│   │   └── [slug]/page.tsx  # Product detail
│   ├── cart/page.tsx        # Cart
│   ├── checkout/page.tsx    # Checkout redirect
│   └── thank-you/page.tsx   # Post-purchase page
├── components/
│   ├── Navbar.tsx           # Nav with cart icon
│   ├── CartIcon.tsx         # Live item count
│   ├── CartContents.tsx     # Interactive cart
│   ├── AddToCartButton.tsx  # Variant picker + add to cart
│   └── CheckoutClient.tsx   # Checkout redirect logic
├── hooks/useCart.ts         # Cart item count hook
├── lib/
│   ├── wix-client.ts        # Server-side Wix client
│   └── wix-client-browser.ts # Browser-side Wix client
├── pages/
│   ├── _document.tsx        # Custom Next.js document
│   └── _error.tsx           # Custom error page
├── .env.local.example       # Environment variable template
└── README.md
```

---

## Wix site details

- **Site ID (msid)**: `c9466f44-badc-4481-af3e-2b00fa6472c8`
- **OAuth App Client ID**: `1d47ce62-8390-4782-86d3-c706cde04ec3`
- **Products**: SipTail Trail Bottle, 3 size variants (Small $24.99 / Medium $29.99 / Large $34.99)
