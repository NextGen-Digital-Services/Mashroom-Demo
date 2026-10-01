import React, { lazy, Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { StoreProvider } from './context/StoreContext';
import { StoreLayout } from './components/layout/StoreLayout';
import { ScrollToTop } from './components/common/ScrollToTop';
import { Skeleton } from './components/common/Skeleton';

// Storefront pages code-split
const Home = lazy(() => import('./pages/store/Home').then(m => ({ default: m.Home })));
const Shop = lazy(() => import('./pages/store/Shop').then(m => ({ default: m.Shop })));
const CategoryPage = lazy(() => import('./pages/store/CategoryPage').then(m => ({ default: m.CategoryPage })));
const ProductDetail = lazy(() => import('./pages/store/ProductDetail').then(m => ({ default: m.ProductDetail })));
const CartPage = lazy(() => import('./pages/store/CartPage').then(m => ({ default: m.CartPage })));
const CheckoutPage = lazy(() => import('./pages/store/CheckoutPage').then(m => ({ default: m.CheckoutPage })));
const OrderSuccess = lazy(() => import('./pages/store/OrderSuccess').then(m => ({ default: m.OrderSuccess })));
const OrderTracking = lazy(() => import('./pages/store/OrderTracking').then(m => ({ default: m.OrderTracking })));
const WishlistPage = lazy(() => import('./pages/store/WishlistPage').then(m => ({ default: m.WishlistPage })));
const SearchResults = lazy(() => import('./pages/store/SearchResults').then(m => ({ default: m.SearchResults })));
const AccountDashboard = lazy(() => import('./pages/store/AccountDashboard').then(m => ({ default: m.AccountDashboard })));
const AboutUs = lazy(() => import('./pages/store/AboutUs').then(m => ({ default: m.AboutUs })));
const OurFarm = lazy(() => import('./pages/store/OurFarm').then(m => ({ default: m.OurFarm })));
const Recipes = lazy(() => import('./pages/store/Recipes').then(m => ({ default: m.Recipes })));
const RecipeDetail = lazy(() => import('./pages/store/RecipeDetail').then(m => ({ default: m.RecipeDetail })));
const Contact = lazy(() => import('./pages/store/Contact').then(m => ({ default: m.Contact })));
const FAQ = lazy(() => import('./pages/store/FAQ').then(m => ({ default: m.FAQ })));
const PolicyPage = lazy(() => import('./pages/store/Policies').then(m => ({ default: m.PolicyPage })));
const NotFoundPage = lazy(() => import('./pages/store/NotFoundPage').then(m => ({ default: m.NotFoundPage })));

// Admin pages code-split
const AdminLogin = lazy(() => import('./pages/admin/AdminLogin').then(m => ({ default: m.AdminLogin })));
const AdminLayout = lazy(() => import('./components/admin/AdminLayout').then(m => ({ default: m.AdminLayout })));
const AdminDashboard = lazy(() => import('./pages/admin/AdminDashboard').then(m => ({ default: m.AdminDashboard })));
const AdminProducts = lazy(() => import('./pages/admin/AdminProducts').then(m => ({ default: m.AdminProducts })));
const AdminCategories = lazy(() => import('./pages/admin/AdminCategories').then(m => ({ default: m.AdminCategories })));
const AdminOrders = lazy(() => import('./pages/admin/AdminOrders').then(m => ({ default: m.AdminOrders })));
const AdminOrderDetail = lazy(() => import('./pages/admin/AdminOrderDetail').then(m => ({ default: m.AdminOrderDetail })));
const AdminCustomers = lazy(() => import('./pages/admin/AdminCustomers').then(m => ({ default: m.AdminCustomers })));
const AdminInventory = lazy(() => import('./pages/admin/AdminInventory').then(m => ({ default: m.AdminInventory })));
const AdminCoupons = lazy(() => import('./pages/admin/AdminCoupons').then(m => ({ default: m.AdminCoupons })));
const AdminReviews = lazy(() => import('./pages/admin/AdminReviews').then(m => ({ default: m.AdminReviews })));
const AdminContent = lazy(() => import('./pages/admin/AdminContent').then(m => ({ default: m.AdminContent })));
const AdminMessages = lazy(() => import('./pages/admin/AdminMessages').then(m => ({ default: m.AdminMessages })));
const AdminShippingTax = lazy(() => import('./pages/admin/AdminShippingTax').then(m => ({ default: m.AdminShippingTax })));
const AdminReports = lazy(() => import('./pages/admin/AdminReports').then(m => ({ default: m.AdminReports })));
const AdminSettings = lazy(() => import('./pages/admin/AdminSettings').then(m => ({ default: m.AdminSettings })));

const LoadingFallback = () => (
  <div style={{ padding: '60px 20px', maxWidth: '1280px', margin: '0 auto' }}>
    <Skeleton height="300px" borderRadius="12px" className="mb-4" />
    <Skeleton height="40px" width="40%" className="mb-2" />
    <Skeleton height="20px" width="80%" />
  </div>
);

export default function App() {
  return (
    <StoreProvider>
      <Router>
        <ScrollToTop />
        <Suspense fallback={<LoadingFallback />}>
          <Routes>
            
            {/* Admin Login Route */}
            <Route path="/admin/login" element={<AdminLogin />} />

            {/* Protected Admin Routes */}
            <Route path="/admin" element={<AdminLayout />}>
              <Route index element={<AdminDashboard />} />
              <Route path="products" element={<AdminProducts />} />
              <Route path="categories" element={<AdminCategories />} />
              <Route path="orders" element={<AdminOrders />} />
              <Route path="orders/:id" element={<AdminOrderDetail />} />
              <Route path="customers" element={<AdminCustomers />} />
              <Route path="inventory" element={<AdminInventory />} />
              <Route path="coupons" element={<AdminCoupons />} />
              <Route path="reviews" element={<AdminReviews />} />
              <Route path="content" element={<AdminContent />} />
              <Route path="messages" element={<AdminMessages />} />
              <Route path="shipping-tax" element={<AdminShippingTax />} />
              <Route path="reports" element={<AdminReports />} />
              <Route path="settings" element={<AdminSettings />} />
            </Route>

            {/* Public Storefront Routes */}
            <Route
              path="*"
              element={
                <StoreLayout>
                  <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/shop" element={<Shop />} />
                    <Route path="/category/:slug" element={<CategoryPage />} />
                    <Route path="/product/:slug" element={<ProductDetail />} />
                    <Route path="/cart" element={<CartPage />} />
                    <Route path="/checkout" element={<CheckoutPage />} />
                    <Route path="/order-success/:id" element={<OrderSuccess />} />
                    <Route path="/track-order" element={<OrderTracking />} />
                    <Route path="/wishlist" element={<WishlistPage />} />
                    <Route path="/search" element={<SearchResults />} />
                    <Route path="/account" element={<AccountDashboard />} />
                    <Route path="/about" element={<AboutUs />} />
                    <Route path="/our-farm" element={<OurFarm />} />
                    <Route path="/recipes" element={<Recipes />} />
                    <Route path="/recipes/:slug" element={<RecipeDetail />} />
                    <Route path="/contact" element={<Contact />} />
                    <Route path="/faq" element={<FAQ />} />
                    <Route path="/shipping-policy" element={<PolicyPage type="shipping" />} />
                    <Route path="/returns-policy" element={<PolicyPage type="returns" />} />
                    <Route path="/privacy-policy" element={<PolicyPage type="privacy" />} />
                    <Route path="/terms" element={<PolicyPage type="terms" />} />
                    <Route path="*" element={<NotFoundPage />} />
                  </Routes>
                </StoreLayout>
              }
            />
          </Routes>
        </Suspense>
      </Router>
    </StoreProvider>
  );
}
