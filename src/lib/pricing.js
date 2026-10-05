// Single source of truth for basket maths. Cart, Cart Drawer and Checkout
// all resolve the same numbers here, so the admin Shipping & Tax page and
// applied coupons are guaranteed to affect what the customer pays.
//
// Config precedence: the dedicated `shipping_tax` settings block (written by
// AdminShippingTax) wins over the general site config fallbacks.

export const resolvePricingConfig = (config = {}, shippingTax = {}) => ({
  gstPercentage: Number(
    shippingTax.gstPercentage ?? config.gstPercentage ?? 5
  ),
  freeShippingThreshold: Number(
    shippingTax.freeShippingThreshold ?? config.freeShippingThreshold ?? 999
  ),
  shippingFee: Number(
    shippingTax.flatShippingFee ?? config.defaultShippingFee ?? 99
  ),
  pincodes: Array.isArray(shippingTax.pincodes) ? shippingTax.pincodes : []
});

// Returns null when the coupon cannot be used, otherwise { discount, reason }
export const validateCoupon = (coupon, subtotal, now = new Date()) => {
  if (!coupon) return { valid: false, reason: 'No coupon selected.' };
  if (coupon.active === false) {
    return { valid: false, reason: `Coupon ${coupon.code} is no longer active.` };
  }
  if (coupon.expiryDate) {
    const expiry = new Date(`${coupon.expiryDate}T23:59:59`);
    if (!Number.isNaN(expiry.getTime()) && expiry < now) {
      return { valid: false, reason: `Coupon ${coupon.code} expired on ${coupon.expiryDate}.` };
    }
  }
  if (coupon.usageLimit && coupon.usedCount >= coupon.usageLimit) {
    return { valid: false, reason: `Coupon ${coupon.code} has reached its usage limit.` };
  }
  const minOrder = Number(coupon.minOrderAmount || 0);
  if (subtotal < minOrder) {
    return {
      valid: false,
      reason: `Minimum order amount of ₹${minOrder} required for coupon ${coupon.code}.`
    };
  }
  return { valid: true, reason: '' };
};

export const computeDiscount = (coupon, subtotal) => {
  if (!coupon) return 0;
  if (coupon.discountType === 'percentage') {
    const raw = (subtotal * Number(coupon.discountValue || 0)) / 100;
    const cap = Number(coupon.maxDiscount);
    return Math.round(Number.isFinite(cap) && cap > 0 ? Math.min(raw, cap) : raw);
  }
  return Math.min(Number(coupon.discountValue || 0), subtotal);
};

// cart: [{ price, quantity }]
export const computeTotals = ({ cart = [], config = {}, shippingTax = {}, coupon = null } = {}) => {
  const pricing = resolvePricingConfig(config, shippingTax);
  const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const validation = validateCoupon(coupon, subtotal);
  const discount = validation.valid ? computeDiscount(coupon, subtotal) : 0;

  const taxable = Math.max(0, subtotal - discount);
  const shippingFee =
    subtotal === 0 || subtotal >= pricing.freeShippingThreshold ? 0 : pricing.shippingFee;
  const tax = Math.round(taxable * (pricing.gstPercentage / 100));
  const total = Math.max(0, taxable + shippingFee + tax);

  return {
    ...pricing,
    subtotal,
    discount,
    taxable,
    shippingFee,
    tax,
    total,
    coupon,
    couponValid: validation.valid,
    couponReason: validation.reason
  };
};
