# [BRAND_NAME] — Italian Artisan Gourmet Mushroom E-Commerce & Admin Portal

An e-commerce storefront and admin panel for a high-end mushroom products brand inspired by Tuscan delicatessen aesthetics.

## How to Run

1. **Install Dependencies:**
   ```bash
   npm install
   ```

2. **Start Local Development Server:**
   ```bash
   npm run dev
   ```
   Open `http://localhost:3000` in your browser.

3. **Build for Production:**
   ```bash
   npm run build
   ```

---

## Backend (optional — demo runs without it)

The site runs fully client-side (localStorage) when no env keys are set.
To enable real backend (Supabase DB + auth + Razorpay test payments), create `.env` from `.env.example`:

```bash
cp .env.example .env
```

1. **Supabase** — create a project at https://supabase.com, then:
   - Copy Project URL → `VITE_SUPABASE_URL`, anon key → `VITE_SUPABASE_ANON_KEY`.
   - SQL Editor → run `supabase/migrations/0001_init.sql`, then `supabase/migrations/0002_seed.sql`.
   - Create your admin user in **Authentication → Users**, then run `supabase/promote_admin.sql` to grant admin role.
2. **Razorpay (test mode)** — https://dashboard.razorpay.com → Settings → API Keys:
   - Key ID → `VITE_RAZORPAY_KEY_ID`; Key Secret → `RAZORPAY_KEY_SECRET` (server only).
   - For local API testing: `npx vercel dev` (needs `SUPABASE_SERVICE_ROLE_KEY` too, server only).
3. Restart `npm run dev`. Payments show up on Checkout only when both Supabase and Razorpay keys are set; otherwise the original demo flow applies.

Courier integration is mocked in `src/lib/shipments.js` (Shiprocket-ready interface, no API key yet).

---

## Admin Portal Login

- **URL:** `/admin/login` (or `/admin`)
- **Demo Email:** `admin@brand.com`
- **Demo Password:** `Admin@123`

---

## Where to Replace Data & Images

- **Brand Configuration & Info:** Update `src/data/siteConfig.js` (`[BRAND_NAME]`, email, phone, address, GST %, free shipping threshold).
- **Products:** `src/data/products.js`
- **Categories:** `src/data/categories.js`
- **Images:** Centralized registry in `src/data/images.js`
- **Initial Orders, Customers & Reviews:** `src/data/orders.js`, `src/data/customers.js`, `src/data/reviews.js`
- **Coupons:** `src/data/coupons.js`
- **Journal/Recipes & Banners:** `src/data/blogs.js`, `src/data/banners.js`

---

## Reset Demo Data

Navigate to **Admin Portal → Settings** and click **Reset Demo Data Store** to reset all state to original seed data.
