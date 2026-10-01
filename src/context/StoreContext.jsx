import React, { createContext, useContext, useState, useEffect } from 'react';
import { getStorageData, setStorageData, initializeLocalStorage, STORAGE_KEYS, resetDemoData } from '../utils/storage';

const StoreContext = createContext();

export const StoreProvider = ({ children }) => {
  // Initialize default localStorage data on first run
  useEffect(() => {
    initializeLocalStorage();
  }, []);

  // Main persistent states
  const [config, setConfig] = useState(() => getStorageData(STORAGE_KEYS.SITE_CONFIG, {}));
  const [products, setProducts] = useState(() => getStorageData(STORAGE_KEYS.PRODUCTS, []));
  const [categories, setCategories] = useState(() => getStorageData(STORAGE_KEYS.CATEGORIES, []));
  const [orders, setOrders] = useState(() => getStorageData(STORAGE_KEYS.ORDERS, []));
  const [customers, setCustomers] = useState(() => getStorageData(STORAGE_KEYS.CUSTOMERS, []));
  const [coupons, setCoupons] = useState(() => getStorageData(STORAGE_KEYS.COUPONS, []));
  const [reviews, setReviews] = useState(() => getStorageData(STORAGE_KEYS.REVIEWS, []));
  const [blogs, setBlogs] = useState(() => getStorageData(STORAGE_KEYS.BLOGS, []));
  const [banners, setBanners] = useState(() => getStorageData(STORAGE_KEYS.BANNERS, []));
  const [faqs, setFaqs] = useState(() => getStorageData(STORAGE_KEYS.FAQS, []));
  const [messages, setMessages] = useState(() => getStorageData(STORAGE_KEYS.MESSAGES, []));
  const [subscribers, setSubscribers] = useState(() => getStorageData(STORAGE_KEYS.SUBSCRIBERS, []));
  const [shippingTax, setShippingTax] = useState(() => getStorageData(STORAGE_KEYS.SHIPPING_TAX, {}));

  // User & Cart states
  const [cart, setCart] = useState(() => getStorageData(STORAGE_KEYS.CART, []));
  const [wishlist, setWishlist] = useState(() => getStorageData(STORAGE_KEYS.WISHLIST, []));
  const [userAuth, setUserAuth] = useState(() => getStorageData(STORAGE_KEYS.AUTH, null));
  const [adminAuth, setAdminAuth] = useState(() => getStorageData(STORAGE_KEYS.ADMIN_AUTH, null));
  
  // UI States
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [toasts, setToasts] = useState([]);

  // Toast Helper
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

  // Sync state helpers to localStorage
  const updateConfig = (newConfig) => {
    setConfig(newConfig);
    setStorageData(STORAGE_KEYS.SITE_CONFIG, newConfig);
    addToast('Site configuration updated successfully');
  };

  const updateProducts = (newProducts) => {
    setProducts(newProducts);
    setStorageData(STORAGE_KEYS.PRODUCTS, newProducts);
  };

  const updateCategories = (newCategories) => {
    setCategories(newCategories);
    setStorageData(STORAGE_KEYS.CATEGORIES, newCategories);
  };

  const updateOrders = (newOrders) => {
    setOrders(newOrders);
    setStorageData(STORAGE_KEYS.ORDERS, newOrders);
  };

  const updateCustomers = (newCustomers) => {
    setCustomers(newCustomers);
    setStorageData(STORAGE_KEYS.CUSTOMERS, newCustomers);
  };

  const updateCoupons = (newCoupons) => {
    setCoupons(newCoupons);
    setStorageData(STORAGE_KEYS.COUPONS, newCoupons);
  };

  const updateReviews = (newReviews) => {
    setReviews(newReviews);
    setStorageData(STORAGE_KEYS.REVIEWS, newReviews);
  };

  const updateBlogs = (newBlogs) => {
    setBlogs(newBlogs);
    setStorageData(STORAGE_KEYS.BLOGS, newBlogs);
  };

  const updateBanners = (newBanners) => {
    setBanners(newBanners);
    setStorageData(STORAGE_KEYS.BANNERS, newBanners);
  };

  const updateFaqs = (newFaqs) => {
    setFaqs(newFaqs);
    setStorageData(STORAGE_KEYS.FAQS, newFaqs);
  };

  const updateMessages = (newMsgs) => {
    setMessages(newMsgs);
    setStorageData(STORAGE_KEYS.MESSAGES, newMsgs);
  };

  const updateSubscribers = (newSubs) => {
    setSubscribers(newSubs);
    setStorageData(STORAGE_KEYS.SUBSCRIBERS, newSubs);
  };

  const updateShippingTax = (newST) => {
    setShippingTax(newST);
    setStorageData(STORAGE_KEYS.SHIPPING_TAX, newST);
  };

  // Cart Operations
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

  // Wishlist Operations
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

  // User Auth Operations
  const loginUser = (email, password) => {
    const user = {
      id: "cust-user-1",
      name: email.split('@')[0],
      email: email
    };
    setUserAuth(user);
    setStorageData(STORAGE_KEYS.AUTH, user);
    addToast(`Welcome back, ${user.name}!`);
    return true;
  };

  const logoutUser = () => {
    setUserAuth(null);
    localStorage.removeItem(STORAGE_KEYS.AUTH);
    addToast('Logged out of storefront session', 'info');
  };

  // Admin Auth Operations
  const loginAdmin = (email, password) => {
    if (email === 'admin@brand.com' && password === 'Admin@123') {
      const adminSession = {
        name: 'Master Admin',
        email: email,
        token: 'demo-admin-token-' + Date.now()
      };
      setAdminAuth(adminSession);
      setStorageData(STORAGE_KEYS.ADMIN_AUTH, adminSession);
      addToast('Authenticated as Brand Administrator');
      return { success: true };
    }
    return { success: false, error: 'Invalid admin credentials. Use demo: admin@brand.com / Admin@123' };
  };

  const logoutAdmin = () => {
    setAdminAuth(null);
    localStorage.removeItem(STORAGE_KEYS.ADMIN_AUTH);
    addToast('Logged out of Admin Portal', 'info');
  };

  // Place Order Action
  const createOrder = (orderData) => {
    const newOrders = [orderData, ...orders];
    updateOrders(newOrders);

    // Update product stock
    const updatedProducts = products.map((prod) => {
      const orderedItem = orderData.items.find((item) => item.id === prod.id);
      if (orderedItem) {
        return {
          ...prod,
          stock: Math.max(0, prod.stock - orderedItem.quantity)
        };
      }
      return prod;
    });
    updateProducts(updatedProducts);

    clearCart();
    return orderData;
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
        userAuth,
        loginUser,
        logoutUser,
        adminAuth,
        loginAdmin,
        logoutAdmin,
        createOrder,
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
