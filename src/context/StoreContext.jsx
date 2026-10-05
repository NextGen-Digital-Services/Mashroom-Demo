import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import { getStorageData, setStorageData, STORAGE_KEYS, seedData } from '../utils/storage';
import { backend } from '../lib/backend';
import { validateCoupon, computeDiscount } from '../lib/pricing';

const StoreContext = createContext();

export const StoreProvider = ({ children }) => {
  // ---- Persistent content state ---------------------------------
  // Initial paint uses localStorage cache (or seed data), then hydrates
  // from the backend (Supabase when configured, localStorage otherwise).
  const [config, setConfig] = useState(() => getStorageData(STORAGE_KEYS.SITE_CONFIG, seedData.site_config));
  const [products, setProducts] = useState(() => getStorageData(STORAGE_KEYS.PRODUCTS, seedData.products));
  const [categories, setCategories] = useState(() => getStorageData(STORAGE_KEYS.CATEGORIES, seedData.categories));
  const [orders, setOrders] = useState(() => getStorageData(STORAGE_KEYS.ORDERS, seedData.orders));
  const [customers, setCustomers] = useState(() => getStorageData(STORAGE_KEYS.CUSTOMERS, seedData.customers));
  const [coupons, setCoupons] = useState(() => getStorageData(STORAGE_KEYS.COUPONS, seedData.coupons));
  const [reviews, setReviews] = useState(() => getStorageData(STORAGE_KEYS.REVIEWS, seedData.reviews));
  const [blogs, setBlogs] = useState(() => getStorageData(STORAGE_KEYS.BLOGS, seedData.blogs));
  const [banners, setBanners] = useState(() => getStorageData(STORAGE_KEYS.BANNERS, seedData.banners));
  const [faqs, setFaqs] = useState(() => getStorageData(STORAGE_KEYS.FAQS, seedData.faqs));
  const [messages, setMessages] = useState(() => getStorageData(STORAGE_KEYS.MESSAGES, seedData.messages));
  const [subscribers, setSubscribers] = useState(() => getStorageData(STORAGE_KEYS.SUBSCRIBERS, seedData.subscribers));
  const [shippingTax, setShippingTax] = useState(() => getStorageData(STORAGE_KEYS.SHIPPING_TAX, seedData.shipping_tax));

  // ---- User & Cart (device-local) --------------------------------
  const [cart, setCart] = useState(() => getStorageData(STORAGE_KEYS.CART, []));
  const [wishlist, setWishlist] = useState(() => getStorageData(STORAGE_KEYS.WISHLIST, []));
  // Shared across drawer / cart page / checkout so a discount applied in
  // one place survives navigation and lands on the persisted order.
  const [appliedCoupon, setAppliedCouponState] = useState(() =>
    getStorageData(STORAGE_KEYS.APPLIED_COUPON, null)
  );
  const [userAuth, setUserAuth] = useState(null);
  const [adminAuth, setAdminAuth] = useState(null);
  const [authReady, setAuthReady] = useState(false);

  // ---- UI States -------------------------------------------------
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [toasts, setToasts] = useState([]);

  // Fresh mirror of list state for computing save diffs at call time
  const contentRef = useRef({});
  contentRef.current = {
    config,
    products,
    categories,
    orders,
    customers,
    coupons,
    reviews,
    blogs,
    banners,
    faqs,
    messages,
    subscribers,
    shippingTax
  };

  // ---- Hydration + auth bootstrap --------------------------------
  // Content is applied from a snapshot object; every list defaults to []
  // so a partial/failed hydrate can never push `undefined` into state
  // (which used to white-screen the admin shell in Supabase mode).
  const applyContent = (content) => {
    if (!content) return;
    setConfig(content.config || seedData.site_config);
    setShippingTax(content.shippingTax || seedData.shipping_tax);
    setProducts(content.products || []);
    setCategories(content.categories || []);
    setOrders(content.orders || []);
    setCustomers(content.customers || []);
    setCoupons(content.coupons || []);
    setReviews(content.reviews || []);
    setBlogs(content.blogs || []);
    setBanners(content.banners || []);
    setFaqs(content.faqs || []);
    setMessages(content.messages || []);
    setSubscribers(content.subscribers || []);
  };

  useEffect(() => {
    let cancelled = false;

    (async () => {
      try {
        const content = await backend.loadContent();
        if (!cancelled) applyContent(content);
      } catch (e) {
        console.error('[store] content hydration failed', e);
      }

      try {
        const session = await backend.auth.getSession();
        if (!cancelled) {
          setUserAuth(session.userAuth);
          setAdminAuth(session.adminAuth);
        }
      } catch (e) {
        console.error('[store] session restore failed', e);
      } finally {
        if (!cancelled) setAuthReady(true);
      }
    })();

    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Keep auth state in sync with the backend session. Signing in also
  // re-hydrates content: tables like customers/messages/subscribers and
  // orders are RLS-gated, so the anonymous boot fetch returned [] for them.
  useEffect(() => {
    const unsubscribe = backend.auth.onChange(async (event) => {
      if (event === 'SIGNED_OUT') {
        setUserAuth(null);
        setAdminAuth(null);
        return;
      }
      try {
        if (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED' || event === 'USER_UPDATED') {
          const content = await backend.loadContent();
          applyContent(content);
        }
        const session = await backend.auth.getSession();
        setUserAuth(session.userAuth);
        setAdminAuth(session.adminAuth);
      } catch (e) {
        console.error('[store] auth change sync failed', e);
      }
    });
    return unsubscribe;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ---- Toast Helper ----------------------------------------------
  const addToast = (message, type = 'success') => {
    const id = Date.now();
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4000);
  };

  const removeToast = (id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  // ---- Generic list / settings sync -------------------------------
  // Each setter updates memory immediately (optimistic) and pushes the
  // diff to the backend. Failures surface as toasts; the UI keeps the
  // optimistic state so the demo never hard-breaks.
  const syncList = (table, setter) => (newItems) => {
    const prev = contentRef.current[table];
    setter(newItems);
    backend.saveList(table, newItems, prev, { canDelete: Boolean(adminAuth) }).catch((e) => {
      addToast(`Sync failed: ${e.message}`, 'error');
    });
  };

  const updateProducts = syncList('products', setProducts);
  const updateCategories = syncList('categories', setCategories);
  const updateOrders = syncList('orders', setOrders);
  const updateCustomers = syncList('customers', setCustomers);
  const updateCoupons = syncList('coupons', setCoupons);
  const updateReviews = syncList('reviews', setReviews);
  const updateBlogs = syncList('blogs', setBlogs);
  const updateBanners = syncList('banners', setBanners);
  const updateFaqs = syncList('faqs', setFaqs);
  const updateMessages = syncList('messages', setMessages);
  const updateSubscribers = syncList('subscribers', setSubscribers);

  const updateConfig = (newConfig) => {
    setConfig(newConfig);
    backend
      .saveSettings('site_config', newConfig)
      .then(() => addToast('Site configuration updated successfully'))
      .catch((e) => addToast(`Sync failed: ${e.message}`, 'error'));
  };

  const updateShippingTax = (newST) => {
    setShippingTax(newST);
    backend
      .saveSettings('shipping_tax', newST)
      .then(() => addToast('Shipping & Tax settings saved — live on cart and checkout'))
      .catch((e) => addToast(`Sync failed: ${e.message}`, 'error'));
  };

  // ---- Cart Operations ---------------------------------------------
  const addToCart = (product, selectedVariant = null, quantity = 1) => {
    const variantObj = selectedVariant || (product.variants && product.variants[0]) || { name: 'Standard', price: product.price };
    const cartItemId = `${product.id}-${variantObj.name}`;

    setCart((prevCart) => {
      const existingIndex = prevCart.findIndex((item) => item.cartItemId === cartItemId);
      let updatedCart;
      if (existingIndex > -1) {
        updatedCart = [...prevCart];
        updatedCart[existingIndex].quantity += quantity;
      } else {
        updatedCart = [
          ...prevCart,
          {
            cartItemId,
            id: product.id,
            name: product.name,
            price: variantObj.price || product.price,
            variant: variantObj.name,
            image: (product.images && product.images[0]) || '',
            quantity,
            stock: variantObj.stock || product.stock || 10
          }
        ];
      }
      setStorageData(STORAGE_KEYS.CART, updatedCart);
      return updatedCart;
    });
    addToast(`Added "${product.name}" to your cart`);
  };

  const updateCartQuantity = (cartItemId, delta) => {
    setCart((prevCart) => {
      const updatedCart = prevCart
        .map((item) => {
          if (item.cartItemId === cartItemId) {
            const newQty = item.quantity + delta;
            return newQty > 0 ? { ...item, quantity: newQty } : null;
          }
          return item;
        })
        .filter(Boolean);
      setStorageData(STORAGE_KEYS.CART, updatedCart);
      return updatedCart;
    });
  };

  const removeFromCart = (cartItemId) => {
    setCart((prevCart) => {
      const updatedCart = prevCart.filter((item) => item.cartItemId !== cartItemId);
      setStorageData(STORAGE_KEYS.CART, updatedCart);
      return updatedCart;
    });
    addToast('Item removed from cart', 'info');
  };

  const clearCart = () => {
    setCart([]);
    setStorageData(STORAGE_KEYS.CART, []);
  };

  // ---- Wishlist Operations ------------------------------------------
  const toggleWishlist = (product) => {
    setWishlist((prevWishlist) => {
      const exists = prevWishlist.some((item) => item.id === product.id);
      let updated;
      if (exists) {
        updated = prevWishlist.filter((item) => item.id !== product.id);
        addToast(`Removed "${product.name}" from wishlist`, 'info');
      } else {
        updated = [...prevWishlist, product];
        addToast(`Added "${product.name}" to wishlist`);
      }
      setStorageData(STORAGE_KEYS.WISHLIST, updated);
      return updated;
    });
  };

  const isWishlisted = (productId) => {
    return wishlist.some((item) => item.id === productId);
  };

  // ---- Coupons -------------------------------------------------------
  const persistCoupon = (coupon) => {
    setAppliedCouponState(coupon);
    setStorageData(STORAGE_KEYS.APPLIED_COUPON, coupon);
  };

  const applyCoupon = (rawCode) => {
    const code = String(rawCode || '').trim().toUpperCase();
    if (!code) return { ok: false, message: 'Enter a coupon code.' };
    const coupon = coupons.find((c) => c.code === code);
    const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
    if (!coupon) return { ok: false, message: `Coupon "${code}" is not valid.` };
    const check = validateCoupon(coupon, subtotal);
    if (!check.valid) return { ok: false, message: check.reason };
    persistCoupon(coupon);
    return { ok: true, message: `Coupon "${code}" applied!` };
  };

  const removeCoupon = () => persistCoupon(null);

  const clearCouponIfInvalid = () => {
    if (!appliedCoupon) return;
    const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
    if (!validateCoupon(appliedCoupon, subtotal).valid) persistCoupon(null);
  };

  // ---- Auth Operations ------------------------------------------------
  const loginUser = async (email, password) => {
    const res = await backend.auth.signIn(email, password);
    if (res.success) {
      setUserAuth(res.user);
      addToast(`Welcome back, ${res.user.name}!`);
    } else {
      addToast(res.error || 'Sign in failed', 'error');
    }
    return res;
  };

  const registerUser = async (email, password, name) => {
    const res = await backend.auth.signUp(email, password, name);
    if (res.success) {
      if (res.needsConfirm) {
        addToast('Almost there — check your inbox to confirm your email, then sign in.', 'info');
      } else if (res.user) {
        setUserAuth(res.user);
        addToast(`Welcome, ${res.user.name}! Your account is ready.`);
      }
    } else {
      addToast(res.error || 'Registration failed', 'error');
    }
    return res;
  };

  const logoutUser = async () => {
    await backend.auth.signOut('user');
    setUserAuth(null);
    if (backend.isSupabase) setAdminAuth(null);
    addToast('Logged out of storefront session', 'info');
  };

  // Mobile OTP login — demo mode shows the code on screen, Supabase mode
  // sends a real SMS once the Phone provider is enabled on the project.
  const sendOtp = async (phone) => {
    try {
      const res = await backend.auth.sendOtp(phone);
      if (res.success) {
        if (res.demoCode) {
          addToast(`Demo OTP for ${res.phone}: ${res.demoCode}`, 'info');
        } else {
          addToast(`OTP sent to ${res.phone}`, 'success');
        }
      } else {
        addToast(res.error || 'Could not send OTP', 'error');
      }
      return res;
    } catch (e) {
      addToast(e.message || 'Could not send OTP', 'error');
      return { success: false, error: e.message };
    }
  };

  const verifyOtp = async (phone, code) => {
    try {
      const res = await backend.auth.verifyOtp(phone, code);
      if (res.success) {
        setUserAuth(res.user);
        addToast(`Welcome, ${res.user.name}!`);
      } else {
        addToast(res.error || 'OTP verification failed', 'error');
      }
      return res;
    } catch (e) {
      addToast(e.message || 'OTP verification failed', 'error');
      return { success: false, error: e.message };
    }
  };

  const updateProfile = async (patch) => {
    try {
      const res = await backend.auth.updateProfile(patch);
      if (res.success) {
        setUserAuth(res.user);
        if (adminAuth && res.user?.name) {
          setAdminAuth({ ...adminAuth, name: res.user.name, email: res.user.email || adminAuth.email });
        }
        addToast('Profile updated successfully');
      } else {
        addToast(res.error || 'Profile update failed', 'error');
      }
      return res;
    } catch (e) {
      addToast(e.message || 'Profile update failed', 'error');
      return { success: false, error: e.message };
    }
  };

  const changePassword = async (newPassword) => {
    try {
      const res = await backend.auth.changePassword(newPassword);
      if (res.success) addToast('Password changed successfully');
      else addToast(res.error || 'Password change failed', 'error');
      return res;
    } catch (e) {
      addToast(e.message || 'Password change failed', 'error');
      return { success: false, error: e.message };
    }
  };

  const resetPassword = async (email) => {
    try {
      const res = await backend.auth.resetPassword(email);
      addToast(res.message || res.error || 'Reset link sent', res.success ? 'success' : 'error');
      return res;
    } catch (e) {
      addToast(e.message || 'Could not send reset link', 'error');
      return { success: false, error: e.message };
    }
  };

  const loginAdmin = async (email, password) => {
    const res = await backend.auth.adminSignIn(email, password);
    if (res.success) {
      setAdminAuth(res.admin);
      addToast('Authenticated as Brand Administrator');
      return { success: true };
    }
    return { success: false, error: res.error };
  };

  const logoutAdmin = async () => {
    await backend.auth.signOut('admin');
    setAdminAuth(null);
    if (backend.isSupabase) setUserAuth(null);
    addToast('Logged out of Admin Portal', 'info');
  };

  // ---- Orders ----------------------------------------------------------
  // Places an order end-to-end: persists it (Supabase RPC does insert +
  // stock decrement atomically; local mode mirrors the original demo),
  // updates in-memory state and clears the cart.
  const createOrder = async (orderData) => {
    const finalOrder = { ...orderData, userId: userAuth ? userAuth.id : null };

    // Attach the shared coupon economics if the caller didn't already.
    const itemsSubtotal = (finalOrder.items || []).reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    );
    const couponCheck = appliedCoupon ? validateCoupon(appliedCoupon, itemsSubtotal) : null;
    const couponDiscount = couponCheck?.valid ? computeDiscount(appliedCoupon, itemsSubtotal) : 0;
    if (finalOrder.discount === undefined || finalOrder.discount === null) {
      finalOrder.discount = couponDiscount;
    }
    if (couponDiscount > 0 && !finalOrder.couponCode) {
      finalOrder.couponCode = appliedCoupon.code;
    }

    const decrementStock = (list) =>
      list.map((prod) => {
        const orderedItem = finalOrder.items.find((item) => item.id === prod.id);
        if (orderedItem) {
          return { ...prod, stock: Math.max(0, (prod.stock || 0) - orderedItem.quantity) };
        }
        return prod;
      });

    if (backend.isSupabase) {
      await backend.createOrder(finalOrder); // throws on failure
      setOrders((prev) => [finalOrder, ...prev]);
      setProducts(decrementStock); // DB stock already updated by the RPC
    } else {
      updateOrders([finalOrder, ...contentRef.current.orders]);
      updateProducts(decrementStock(contentRef.current.products));
    }

    // Count the redemption. Anonymous clients can't UPDATE coupons under
    // RLS, so in Supabase mode only admins record usage (demo/local always).
    if (finalOrder.discount > 0 && appliedCoupon && (!backend.isSupabase || adminAuth)) {
      updateCoupons(
        contentRef.current.coupons.map((c) =>
          c.id === appliedCoupon.id ? { ...c, usedCount: (c.usedCount || 0) + 1 } : c
        )
      );
    }

    persistCoupon(null);
    clearCart();
    return finalOrder;
  };

  // Local-state-only order patch (used after the server has already
  // persisted the change, e.g. Razorpay verification).
  const patchOrderLocal = (orderId, patch) => {
    setOrders((prev) => prev.map((o) => (o.id === orderId ? { ...o, ...patch } : o)));
  };

  // Guest-safe tracking lookup (RPC in Supabase mode).
  const trackOrder = async (orderId, phone) => {
    try {
      return await backend.trackOrder(orderId, phone);
    } catch (e) {
      addToast(`Tracking lookup failed: ${e.message}`, 'error');
      return null;
    }
  };

  const resetDemoData = async () => {
    try {
      await backend.resetDemo(); // reloads the page on completion
    } catch (e) {
      addToast(`Reset failed: ${e.message}`, 'error');
    }
  };

  return (
    <StoreContext.Provider
      value={{
        config,
        updateConfig,
        products,
        setProducts: updateProducts,
        categories,
        setCategories: updateCategories,
        orders,
        setOrders: updateOrders,
        customers,
        setCustomers: updateCustomers,
        coupons,
        setCoupons: updateCoupons,
        reviews,
        setReviews: updateReviews,
        blogs,
        setBlogs: updateBlogs,
        banners,
        setBanners: updateBanners,
        faqs,
        setFaqs: updateFaqs,
        messages,
        setMessages: updateMessages,
        subscribers,
        setSubscribers: updateSubscribers,
        shippingTax,
        setShippingTax: updateShippingTax,
        cart,
        addToCart,
        updateCartQuantity,
        removeFromCart,
        clearCart,
        isCartOpen,
        setIsCartOpen,
      wishlist,
      toggleWishlist,
      isWishlisted,
      appliedCoupon,
      applyCoupon,
      removeCoupon,
      clearCouponIfInvalid,
      userAuth,
      loginUser,
      registerUser,
      sendOtp,
      verifyOtp,
      logoutUser,
      updateProfile,
      changePassword,
      resetPassword,
        adminAuth,
        loginAdmin,
        logoutAdmin,
        authReady,
        createOrder,
        patchOrderLocal,
        trackOrder,
        toasts,
        addToast,
        removeToast,
        resetDemoData
      }}
    >
      {children}
    </StoreContext.Provider>
  );
};

export const useStore = () => {
  const context = useContext(StoreContext);
  if (!context) {
    throw new Error('useStore must be used within a StoreProvider');
  }
  return context;
};
