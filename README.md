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
