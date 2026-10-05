// POST /api/razorpay/verify
// Verifies the Razorpay checkout signature (HMAC-SHA256) and marks the
// order as paid using the Supabase service-role key (never exposed to
// the client, bypasses RLS — appropriate here because the signature
// already proves the payment happened).
// Env: RAZORPAY_KEY_SECRET, SUPABASE_URL (VITE_SUPABASE_URL works too),
//      SUPABASE_SERVICE_ROLE_KEY
import { createClient } from '@supabase/supabase-js';
import crypto from 'node:crypto';

const verifySignature = (orderId, paymentId, signature) => {
  const expected = crypto
    .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
    .update(`${orderId}|${paymentId}`)
    .digest('hex');
  try {
    return crypto.timingSafeEqual(Buffer.from(expected), Buffer.from(String(signature)));
  } catch {
    return false;
  }
};

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { razorpay_order_id, razorpay_payment_id, razorpay_signature, appOrderId } = req.body || {};
  if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature || !appOrderId) {
    return res.status(400).json({ error: 'Missing payment verification payload' });
  }
  if (!process.env.RAZORPAY_KEY_SECRET) {
    return res.status(501).json({ error: 'Payments are not configured on this deployment.' });
  }
  if (!verifySignature(razorpay_order_id, razorpay_payment_id, razorpay_signature)) {
    return res.status(400).json({ error: 'Payment signature verification failed' });
  }

  const supabaseUrl = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!supabaseUrl || !serviceKey) {
    console.error('[razorpay/verify] Supabase service credentials missing');
    return res.status(501).json({ error: 'Order persistence is not configured.' });
  }

  try {
    const admin = createClient(supabaseUrl, serviceKey, {
      auth: { persistSession: false }
    });

    const { data: row, error: readError } = await admin
      .from('orders')
      .select('data')
      .eq('id', appOrderId)
      .maybeSingle();

    if (readError) throw readError;
    if (!row) return res.status(404).json({ error: 'Order not found' });

    const orderData = {
      ...row.data,
      status: 'Placed',
      paymentStatus: 'Paid',
      razorpay: {
        orderId: razorpay_order_id,
        paymentId: razorpay_payment_id
      }
    };

    const { error: updateError } = await admin
      .from('orders')
      .update({
        status: 'Placed',
        data: orderData
      })
      .eq('id', appOrderId);

    if (updateError) throw updateError;

    return res.status(200).json({ verified: true, orderId: appOrderId });
  } catch (err) {
    console.error('[razorpay/verify]', err);
    return res.status(500).json({ error: 'Could not confirm payment' });
  }
}
