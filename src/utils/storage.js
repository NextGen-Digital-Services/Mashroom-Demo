import { siteConfig } from '../data/siteConfig.js';
import { initialProducts } from '../data/products.js';
import { initialCategories } from '../data/categories.js';
import { initialOrders } from '../data/orders.js';
import { initialCustomers } from '../data/customers.js';
import { initialCoupons } from '../data/coupons.js';
import { initialReviews } from '../data/reviews.js';
import { initialBlogs } from '../data/blogs.js';
import { initialBanners } from '../data/banners.js';
import { initialFaqs } from '../data/faqs.js';

const STORAGE_KEYS = {
  // v2 keys: demo content reseeded after the brand/content refresh (Manasi)
  SITE_CONFIG: 'brand_site_config_v2',
  PRODUCTS: 'brand_products_v2',
  CATEGORIES: 'brand_categories_v2',
  ORDERS: 'brand_orders_v2',
  CUSTOMERS: 'brand_customers',
  COUPONS: 'brand_coupons',
  REVIEWS: 'brand_reviews_v2',
  BLOGS: 'brand_blogs_v2',
  BANNERS: 'brand_banners_v2',
  FAQS: 'brand_faqs_v2',
  CART: 'brand_cart_v2',
  WISHLIST: 'brand_wishlist_v2',
  APPLIED_COUPON: 'brand_applied_coupon_v2',
  AUTH: 'brand_auth',
  ADMIN_AUTH: 'brand_admin_auth',
  OTP: 'brand_otp',
  SHIPPING_TAX: 'brand_shipping_tax',
  MESSAGES: 'brand_messages',
  SUBSCRIBERS: 'brand_subscribers',
  ADDRESSES_PREFIX: 'brand_addresses_'
};

// Maps backend table name -> localStorage key (used by the storage adapter)
const TABLE_STORAGE_KEYS = {
  products: STORAGE_KEYS.PRODUCTS,
  categories: STORAGE_KEYS.CATEGORIES,
  orders: STORAGE_KEYS.ORDERS,
  customers: STORAGE_KEYS.CUSTOMERS,
  coupons: STORAGE_KEYS.COUPONS,
  reviews: STORAGE_KEYS.REVIEWS,
  blogs: STORAGE_KEYS.BLOGS,
  banners: STORAGE_KEYS.BANNERS,
  faqs: STORAGE_KEYS.FAQS,
  messages: STORAGE_KEYS.MESSAGES,
  subscribers: STORAGE_KEYS.SUBSCRIBERS
};

const SETTINGS_STORAGE_KEYS = {
  site_config: STORAGE_KEYS.SITE_CONFIG,
  shipping_tax: STORAGE_KEYS.SHIPPING_TAX
};

// Initial seed content — single source of truth for both the local demo
// fallback and the generated Supabase seed migration (scripts/generate-seed.mjs)
const seedData = {
  site_config: siteConfig,
  shipping_tax: {
    gstPercentage: 5,
    freeShippingThreshold: 999,
    flatShippingFee: 99,
    pincodes: ["110001", "110003", "411001", "500033", "400001", "560001", "600001", "700001", "173212"]
  },
  products: initialProducts,
  categories: initialCategories,
  orders: initialOrders,
  customers: initialCustomers,
  coupons: initialCoupons,
  reviews: initialReviews,
  blogs: initialBlogs,
  banners: initialBanners,
  faqs: initialFaqs,
  messages: [
    {
      id: "msg-1",
      name: "Devika Malhotra",
      email: "devika@example.com",
      phone: "+91 98765 11223",
      subject: "Bulk Mushroom Powder & Spawn Inquiry",
      message: "Hello, we operate a restaurant chain in Bengaluru and would like to enquire about wholesale pricing for mushroom powder and fresh mushrooms, plus spawn for our own growing unit.",
      date: "2026-09-29T16:20:00.000Z",
      read: false
    }
  ],
  subscribers: [
    { id: "sub-1", email: "gourmet.lover@example.com", date: "2026-09-15" },
    { id: "sub-2", email: "culinary.chef@example.com", date: "2026-09-22" }
  ]
};

export const getStorageData = (key, fallback) => {
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : fallback;
  } catch (e) {
    console.error(`Error reading ${key} from localStorage`, e);
    return fallback;
  }
};

export const setStorageData = (key, value) => {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (e) {
    console.error(`Error writing ${key} to localStorage`, e);
  }
};

export const initializeLocalStorage = () => {
  const seeding = [
    [STORAGE_KEYS.SITE_CONFIG, seedData.site_config],
    [STORAGE_KEYS.PRODUCTS, seedData.products],
    [STORAGE_KEYS.CATEGORIES, seedData.categories],
    [STORAGE_KEYS.ORDERS, seedData.orders],
    [STORAGE_KEYS.CUSTOMERS, seedData.customers],
    [STORAGE_KEYS.COUPONS, seedData.coupons],
    [STORAGE_KEYS.REVIEWS, seedData.reviews],
    [STORAGE_KEYS.BLOGS, seedData.blogs],
    [STORAGE_KEYS.BANNERS, seedData.banners],
    [STORAGE_KEYS.FAQS, seedData.faqs],
    [STORAGE_KEYS.CART, []],
    [STORAGE_KEYS.WISHLIST, []],
    [STORAGE_KEYS.MESSAGES, seedData.messages],
    [STORAGE_KEYS.SUBSCRIBERS, seedData.subscribers],
    [STORAGE_KEYS.SHIPPING_TAX, seedData.shipping_tax]
  ];
  for (const [key, value] of seeding) {
    if (!localStorage.getItem(key)) {
      setStorageData(key, value);
    }
  }
};

export const resetDemoData = () => {
  localStorage.clear();
  initializeLocalStorage();
  window.location.reload();
};

export { STORAGE_KEYS, TABLE_STORAGE_KEYS, SETTINGS_STORAGE_KEYS, seedData };
