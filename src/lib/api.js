// Client-side Razorpay helpers. Secret keys stay on the server — see
// api/razorpay/*. Vercel serverless functions.
export const razorpayKeyId = import.meta.env.VITE_RAZORPAY_KEY_ID || '';

export const isPaymentsEnabled = () =>
  Boolean(razorpayKeyId) && !razorpayKeyId.startsWith('YOUR_');

const postJson = async (url, body) => {
  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body)
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error(data.error || `Request to ${url} failed (${res.status})`);
  }
  return data;
};

const loadRazorpayScript = () =>
  new Promise((resolve, reject) => {
    if (window.Razorpay) return resolve();
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.onload = () => resolve();
    script.onerror = () => reject(new Error('Could not load Razorpay checkout. Check your network.'));
    document.body.appendChild(script);
  });

export const createRazorpayOrder = (amount, receipt) =>
  postJson('/api/razorpay/create-order', { amount, receipt });

export const verifyRazorpayPayment = (payload) =>
  postJson('/api/razorpay/verify', payload);

// Opens the Razorpay modal and resolves with
// { razorpay_order_id, razorpay_payment_id, razorpay_signature }
export const openRazorpayCheckout = async ({ amount, razorpayOrderId, order, config }) => {
  await loadRazorpayScript();
  return new Promise((resolve, reject) => {
    const options = {
      key: razorpayKeyId,
      amount: Math.round(amount * 100),
      currency: 'INR',
      name: config?.name || 'MANASI Mushroom',
      description: `Order ${order.id}`,
      order_id: razorpayOrderId,
      prefill: {
        name: order.customer?.name || '',
        email: order.customer?.email || '',
        contact: order.customer?.phone || ''
      },
      theme: { color: '#4a5a34' },
      modal: {
        ondismiss: () => reject(new Error('Payment window closed. Your order is saved as pending.'))
      },
      handler: (response) => resolve(response)
    };
    // eslint-disable-next-line no-new
    new window.Razorpay(options, {
      failed: (response) =>
        reject(new Error(response.error?.description || 'Payment failed. Please try again.'))
    }).open();
  });
};
