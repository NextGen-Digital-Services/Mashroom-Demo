import { siteConfig } from '../data/siteConfig';
import { initialProducts } from '../data/products';
import { initialCategories } from '../data/categories';
import { initialOrders } from '../data/orders';
import { initialCustomers } from '../data/customers';
import { initialCoupons } from '../data/coupons';
import { initialReviews } from '../data/reviews';
import { initialBlogs } from '../data/blogs';
import { initialBanners } from '../data/banners';
import { initialFaqs } from '../data/faqs';

const STORAGE_KEYS = {
  SITE_CONFIG: 'brand_site_config',
  PRODUCTS: 'brand_products',
  CATEGORIES: 'brand_categories',
  ORDERS: 'brand_orders',
  CUSTOMERS: 'brand_customers',
  COUPONS: 'brand_coupons',
  REVIEWS: 'brand_reviews',
  BLOGS: 'brand_blogs',
  BANNERS: 'brand_banners',
  FAQS: 'brand_faqs',
  CART: 'brand_cart',
  WISHLIST: 'brand_wishlist',
  AUTH: 'brand_auth',
  ADMIN_AUTH: 'brand_admin_auth',
  SHIPPING_TAX: 'brand_shipping_tax',
  MESSAGES: 'brand_messages',
  SUBSCRIBERS: 'brand_subscribers'
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
  if (!localStorage.getItem(STORAGE_KEYS.SITE_CONFIG)) {
    setStorageData(STORAGE_KEYS.SITE_CONFIG, siteConfig);
  }
  if (!localStorage.getItem(STORAGE_KEYS.PRODUCTS)) {
    setStorageData(STORAGE_KEYS.PRODUCTS, initialProducts);
  }
  if (!localStorage.getItem(STORAGE_KEYS.CATEGORIES)) {
    setStorageData(STORAGE_KEYS.CATEGORIES, initialCategories);
  }
  if (!localStorage.getItem(STORAGE_KEYS.ORDERS)) {
    setStorageData(STORAGE_KEYS.ORDERS, initialOrders);
  }
  if (!localStorage.getItem(STORAGE_KEYS.CUSTOMERS)) {
    setStorageData(STORAGE_KEYS.CUSTOMERS, initialCustomers);
  }
  if (!localStorage.getItem(STORAGE_KEYS.COUPONS)) {
    setStorageData(STORAGE_KEYS.COUPONS, initialCoupons);
  }
  if (!localStorage.getItem(STORAGE_KEYS.REVIEWS)) {
    setStorageData(STORAGE_KEYS.REVIEWS, initialReviews);
  }
  if (!localStorage.getItem(STORAGE_KEYS.BLOGS)) {
    setStorageData(STORAGE_KEYS.BLOGS, initialBlogs);
  }
  if (!localStorage.getItem(STORAGE_KEYS.BANNERS)) {
    setStorageData(STORAGE_KEYS.BANNERS, initialBanners);
  }
  if (!localStorage.getItem(STORAGE_KEYS.FAQS)) {
    setStorageData(STORAGE_KEYS.FAQS, initialFaqs);
  }
  if (!localStorage.getItem(STORAGE_KEYS.CART)) {
    setStorageData(STORAGE_KEYS.CART, []);
  }
  if (!localStorage.getItem(STORAGE_KEYS.WISHLIST)) {
    setStorageData(STORAGE_KEYS.WISHLIST, []);
  }
  if (!localStorage.getItem(STORAGE_KEYS.MESSAGES)) {
    setStorageData(STORAGE_KEYS.MESSAGES, [
      {
        id: "msg-1",
        name: "Devika Malhotra",
        email: "devika@example.com",
        phone: "+91 98765 11223",
        subject: "Bulk Organic Lion's Mane Inquiry",
        message: "Hello, we operate a wellness tea lounge in Bengaluru and would like to inquire about wholesale bulk pricing for 5kg Lion's Mane powder.",
        date: "2026-09-29T16:20:00.000Z",
        read: false
      }
    ]);
  }
  if (!localStorage.getItem(STORAGE_KEYS.SUBSCRIBERS)) {
    setStorageData(STORAGE_KEYS.SUBSCRIBERS, [
      { id: "sub-1", email: "gourmet.lover@example.com", date: "2026-09-15" },
      { id: "sub-2", email: "culinary.chef@example.com", date: "2026-09-22" }
    ]);
  }
  if (!localStorage.getItem(STORAGE_KEYS.SHIPPING_TAX)) {
    setStorageData(STORAGE_KEYS.SHIPPING_TAX, {
      gstPercentage: 5,
      freeShippingThreshold: 999,
      flatShippingFee: 99,
      pincodes: ["110001", "110003", "411001", "500033", "400001", "560001", "600001", "700001", "173212"]
    });
  }
};

export const resetDemoData = () => {
  localStorage.clear();
  initializeLocalStorage();
  window.location.reload();
};

export { STORAGE_KEYS };
