// POST /api/razorpay/create-order
// Creates a Razorpay order using the secret key (server-side only).
// Env: RAZORPAY_KEY_ID, RAZORPAY_KEY_SECRET
export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const keyId = process.env.RAZORPAY_KEY_ID;
  const keySecret = process.env.RAZORPAY_KEY_SECRET;
  if (!keyId || !keySecret) {
    return res.status(501).json({ error: 'Payments are not configured on this deployment.' });
  }

  const { amount, receipt } = req.body || {};
  const amountNum = Number(amount);
  if (!Number.isFinite(amountNum) || amountNum <= 0) {
    return res.status(400).json({ error: 'Invalid amount' });
  }
  if (amountNum > 1_000_000) {
    return res.status(400).json({ error: 'Amount too large' });
  }

  try {
    const response = await fetch('https://api.razorpay.com/v1/orders', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Basic ${Buffer.from(`${keyId}:${keySecret}`).toString('base64')}`
      },
      body: JSON.stringify({
        amount: Math.round(amountNum * 100), // rupees -> paise
        currency: 'INR',
        receipt: String(receipt || `rcpt_${Date.now()}`).slice(0, 40)
      })
    });

    const data = await response.json();
    if (!response.ok) {
      const message = data?.error?.description || 'Could not create Razorpay order';
      return res.status(502).json({ error: message });
    }

    return res.status(200).json({
      razorpayOrderId: data.id,
      amount: data.amount,
      currency: data.currency
    });
  } catch (err) {
    console.error('[razorpay/create-order]', err);
    return res.status(500).json({ error: 'Unexpected server error' });
  }
}
