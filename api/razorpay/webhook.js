// POST /api/razorpay/webhook — placeholder for production hardening.
//
// Razorpay can push payment.captured / payment.failed events here. The
// signature check below is already implemented; wire the event handling
// (idempotent order updates) when going live:
//   1. Razorpay Dashboard -> Settings -> Webhooks -> add this URL
//   2. Set env RAZORPAY_WEBHOOK_SECRET
// Env: RAZORPAY_WEBHOOK_SECRET (optional until enabled)
import crypto from 'node:crypto';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const secret = process.env.RAZORPAY_WEBHOOK_SECRET;
  if (!secret) {
    // Not configured yet — acknowledge so Razorpay does not retry-storm.
    return res.status(200).json({ received: true, configured: false });
  }

  const signature = req.headers['x-razorpay-signature'];
  const rawBody = typeof req.body === 'string' ? req.body : JSON.stringify(req.body || {});
  const expected = crypto.createHmac('sha256', secret).update(rawBody).digest('hex');

  let valid = false;
  try {
    valid = crypto.timingSafeEqual(Buffer.from(expected), Buffer.from(String(signature || '')));
  } catch {
    valid = false;
  }
  if (!valid) return res.status(400).json({ error: 'Invalid webhook signature' });

  const event = req.body?.event;
  // TODO(production): handle payment.captured -> mark order paid
  console.log('[razorpay/webhook] received:', event);
  return res.status(200).json({ received: true });
}
