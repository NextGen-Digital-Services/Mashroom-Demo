// Data + auth adapter. The app talks to this module only, so the whole
// store can run either on plain localStorage (demo mode, no keys) or on
// Supabase (DB + auth + RLS) by just setting VITE_SUPABASE_* env vars.
//
//   mode = 'local'      -> original demo behaviour, zero configuration
//   mode = 'supabase'   -> real backend, see supabase/migrations/*.sql
import { supabase, isSupabaseConfigured } from './supabase';
import {
  getStorageData,
  setStorageData,
  initializeLocalStorage,
  resetDemoData as localResetDemoData,
  STORAGE_KEYS,
  TABLE_STORAGE_KEYS,
  SETTINGS_STORAGE_KEYS,
  seedData
} from '../utils/storage';

export const isSupabase = isSupabaseConfigured;

const CONTENT_LISTS = [
  'products',
  'categories',
  'orders',
  'coupons',
  'reviews',
  'blogs',
  'banners',
  'faqs',
  'customers',
  'messages',
  'subscribers'
];

const seedFallback = () => ({
  config: seedData.site_config,
  shippingTax: seedData.shipping_tax,
  products: seedData.products,
  categories: seedData.categories,
  orders: seedData.orders,
  customers: seedData.customers,
  coupons: seedData.coupons,
  reviews: seedData.reviews,
  blogs: seedData.blogs,
  banners: seedData.banners,
  faqs: seedData.faqs,
  messages: seedData.messages,
  subscribers: seedData.subscribers
});

const throwIfError = (res, label) => {
  if (res.error) {
    console.error(`[backend] ${label} failed:`, res.error.message);
    throw new Error(res.error.message);
  }
  return res.data;
};

// ---------------------------------------------------------------
// Content
// ---------------------------------------------------------------
async function loadContent() {
  if (!isSupabase) {
    initializeLocalStorage();
    const list = (table) => getStorageData(TABLE_STORAGE_KEYS[table], []);
    return {
      config: getStorageData(STORAGE_KEYS.SITE_CONFIG, seedData.site_config),
      shippingTax: getStorageData(STORAGE_KEYS.SHIPPING_TAX, seedData.shipping_tax),
      products: list('products'),
      categories: list('categories'),
      orders: list('orders'),
      customers: list('customers'),
      coupons: list('coupons'),
      reviews: list('reviews'),
      blogs: list('blogs'),
      banners: list('banners'),
      faqs: list('faqs'),
      messages: list('messages'),
      subscribers: list('subscribers')
    };
  }

  try {
    // Each list resolves independently: an RLS-filtered or temporarily
    // unavailable table degrades to [] instead of nuking the whole hydrate.
    const selectList = async (table) => {
      try {
        const { data, error } = await supabase.from(table).select('id, data');
        if (error) throw error;
        return (data || []).map((r) => r.data).filter(Boolean);
      } catch (e) {
        console.warn(`[backend] select ${table} failed, using []`, e.message);
        return [];
      }
    };

    const [settingsRes, ...listResults] = await Promise.all([
      supabase.from('settings').select('key, data'),
      ...CONTENT_LISTS.map(selectList)
    ]);

    const settings = {};
    if (settingsRes?.data) {
      for (const row of settingsRes.data) settings[row.key] = row.data;
    } else if (settingsRes?.error) {
      console.warn('[backend] select settings failed', settingsRes.error.message);
    }

    const byTable = {};
    CONTENT_LISTS.forEach((table, i) => {
      byTable[table] = listResults[i];
      // keep localStorage cache warm for instant next paint
      setStorageData(TABLE_STORAGE_KEYS[table], listResults[i]);
    });

    if (settings.site_config) setStorageData(STORAGE_KEYS.SITE_CONFIG, settings.site_config);
    if (settings.shipping_tax) setStorageData(STORAGE_KEYS.SHIPPING_TAX, settings.shipping_tax);

    return {
      config: settings.site_config || seedData.site_config,
      shippingTax: settings.shipping_tax || seedData.shipping_tax,
      ...byTable,
      orders: byTable.orders || []
    };
  } catch (e) {
    console.error('[backend] Supabase hydrate failed, falling back to cached/seed data', e);
    return seedFallback();
  }
}

const toRow = (table, item) => {
  if (table === 'orders') {
    return {
      id: item.id,
      user_id: item.userId || null,
      customer_email: item.customer?.email || null,
      status: item.status || 'Placed',
      total: item.total || 0,
      date: item.date || null,
      data: item
    };
  }
  return { id: item.id, data: item };
};

// Sync a list table. `next` is the full new array, `prev` the state it
// replaced — the diff is what actually hits the database, so anonymous
// visitors only ever INSERT (new reviews / messages / subscribers) and
// never issue UPDATE/DELETE statements they are not allowed to run.
async function saveList(table, next, prev, { canDelete = false } = {}) {
  if (!isSupabase) {
    setStorageData(TABLE_STORAGE_KEYS[table], next);
    return;
  }

  const prevArr = prev || [];
  const nextIds = new Set(next.map((i) => i.id));
  const prevById = new Map(prevArr.map((i) => [i.id, i]));

  const added = next.filter((n) => !prevById.has(n.id));
  const changed = next.filter((n) => {
    const p = prevById.get(n.id);
    return p && JSON.stringify(p) !== JSON.stringify(n);
  });
  const removed = prevArr.filter((p) => !nextIds.has(p.id));

  const upserts = [...added, ...changed].map((item) => toRow(table, item));
  if (upserts.length) {
    throwIfError(
      await supabase.from(table).upsert(upserts, { onConflict: 'id' }),
      `upsert ${table}`
    );
  }
  if (removed.length && canDelete) {
    throwIfError(
      await supabase.from(table).delete().in('id', removed.map((r) => r.id)),
      `delete from ${table}`
    );
  }

  // keep local cache aligned (also acts as offline fallback)
  setStorageData(TABLE_STORAGE_KEYS[table], next);
}

async function saveSettings(key, value) {
  if (!isSupabase) {
    setStorageData(SETTINGS_STORAGE_KEYS[key], value);
    return;
  }
  throwIfError(
    await supabase
      .from('settings')
      .upsert({ key, data: value, updated_at: new Date().toISOString() }, { onConflict: 'key' }),
    `save settings ${key}`
  );
  const cacheKey = key === 'site_config' ? STORAGE_KEYS.SITE_CONFIG : STORAGE_KEYS.SHIPPING_TAX;
  setStorageData(cacheKey, value);
}

// ---------------------------------------------------------------
// Orders
// ---------------------------------------------------------------
// Supabase: atomic RPC (insert + stock decrement). Local: same
// behaviour the demo always had (handled by the caller's state +
// saveList, see StoreContext).
async function createOrder(order) {
  if (!isSupabase) return { ok: true };
  throwIfError(
    await supabase.rpc('create_order', { p_data: order }),
    'create_order'
  );
  setStorageData(TABLE_STORAGE_KEYS.orders, [order, ...(getStorageData(TABLE_STORAGE_KEYS.orders, []))]);
  return { ok: true };
}

async function trackOrder(orderId, phone) {
  if (!isSupabase) {
    const idToFind = (orderId || '').trim().toUpperCase();
    return (
      getStorageData(STORAGE_KEYS.ORDERS, []).find(
        (o) =>
          o.id.toUpperCase() === idToFind ||
          (phone && o.customer?.phone?.includes(phone.trim()))
      ) || null
    );
  }
  const { data, error } = await supabase.rpc('track_order', {
    p_id: (orderId || '').trim(),
    p_phone: (phone || '').trim()
  });
  if (error) throw new Error(error.message);
  return data || null;
}

async function resetDemo() {
  if (!isSupabase) {
    localResetDemoData();
    return;
  }
  throwIfError(await supabase.rpc('reset_demo_data'), 'reset_demo_data');
  localStorage.removeItem('brand_cart');
  localStorage.removeItem('brand_wishlist');
  window.location.reload();
}

// ---------------------------------------------------------------
// Auth
// ---------------------------------------------------------------
const buildUser = (id, email, profile) => ({
  id,
  email,
  phone: profile?.phone || null,
  name: profile?.name || (email || '').split('@')[0],
  role: profile?.role || 'customer'
});

// Phone helpers — Indian numbers accepted with or without +91 / spaces.
const normalizePhone = (raw) => {
  const digits = String(raw || '').replace(/\D/g, '');
  if (!digits) return '';
  if (digits.length === 12 && digits.startsWith('91')) return '+' + digits;
  if (digits.length === 10) return '+91' + digits;
  return '+' + digits;
};

const OTP_TTL_MS = 5 * 60 * 1000;

const buildAdmin = (session, user) =>
  user.role === 'admin'
    ? { name: user.name, email: user.email, token: session?.access_token || '' }
    : null;

async function getProfile(userId) {
  const { data } = await supabase
    .from('user_profiles')
    .select('name, role, phone')
    .eq('id', userId)
    .maybeSingle();
  return data;
}

const auth = {
  async getSession() {
    if (!isSupabase) {
      return {
        userAuth: getStorageData(STORAGE_KEYS.AUTH, null),
        adminAuth: getStorageData(STORAGE_KEYS.ADMIN_AUTH, null)
      };
    }
    const { data: { session } } = await supabase.auth.getSession();
    if (!session?.user) return { userAuth: null, adminAuth: null };
    const profile = await getProfile(session.user.id);
    const user = buildUser(session.user.id, session.user.email, profile);
    return { userAuth: user, adminAuth: buildAdmin(session, user) };
  },

  async signIn(email, password) {
    if (!isSupabase) {
      const user = { id: 'cust-user-1', name: email.split('@')[0], email, role: 'customer' };
      setStorageData(STORAGE_KEYS.AUTH, user);
      return { success: true, user };
    }
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) return { success: false, error: error.message };
    const profile = await getProfile(data.user.id);
    return { success: true, user: buildUser(data.user.id, data.user.email, profile) };
  },

  async adminSignIn(email, password) {
    if (!isSupabase) {
      if (email === 'admin@brand.com' && password === 'Admin@123') {
        const admin = {
          name: 'Master Admin',
          email,
          token: 'demo-admin-token-' + Date.now()
        };
        setStorageData(STORAGE_KEYS.ADMIN_AUTH, admin);
        return {
          success: true,
          user: { id: 'admin-local', name: 'Master Admin', email, role: 'admin' },
          admin
        };
      }
      return {
        success: false,
        error: 'Invalid admin credentials. Use demo: admin@brand.com / Admin@123'
      };
    }
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) return { success: false, error: error.message };
    const profile = await getProfile(data.user.id);
    const user = buildUser(data.user.id, data.user.email, profile);
    if (user.role !== 'admin') {
      return { success: false, error: 'This account does not have admin privileges.' };
    }
    return { success: true, user, admin: buildAdmin(data.session, user) };
  },

  async signUp(email, password, name) {
    if (!isSupabase) {
      const user = { id: 'cust-user-1', name: name || email.split('@')[0], email, role: 'customer' };
      setStorageData(STORAGE_KEYS.AUTH, user);
      return { success: true, user };
    }
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { name: name || email.split('@')[0] } }
    });
    if (error) return { success: false, error: error.message };
    if (data.session?.user) {
      const profile = await getProfile(data.session.user.id);
      return { success: true, user: buildUser(data.session.user.id, email, profile) };
    }
    // Email confirmation is enabled on the project
    return { success: true, needsConfirm: true };
  },

  async signOut(role) {
    if (!isSupabase) {
      if (role === 'admin') localStorage.removeItem(STORAGE_KEYS.ADMIN_AUTH);
      else localStorage.removeItem(STORAGE_KEYS.AUTH);
      return;
    }
    await supabase.auth.signOut();
  },

  // Profile edits live in user_profiles (RLS lets a user update their own row).
  async updateProfile(patch) {
    if (!isSupabase) {
      const current = getStorageData(STORAGE_KEYS.AUTH, null) || {};
      const next = { ...current, ...patch };
      setStorageData(STORAGE_KEYS.AUTH, next);
      if (getStorageData(STORAGE_KEYS.ADMIN_AUTH, null)) {
        setStorageData(STORAGE_KEYS.ADMIN_AUTH, {
          ...getStorageData(STORAGE_KEYS.ADMIN_AUTH, null),
          name: patch.name || current.name
        });
      }
      return { success: true, user: next };
    }
    const { data: { session } } = await supabase.auth.getSession();
    if (!session?.user) return { success: false, error: 'Not signed in.' };

    const updates = {};
    if (patch.name !== undefined) updates.name = patch.name;
    if (patch.phone !== undefined) updates.phone = patch.phone;

    if (Object.keys(updates).length) {
      const { error } = await supabase.from('user_profiles').update(updates).eq('id', session.user.id);
      if (error) return { success: false, error: error.message };
    }
    if (patch.email && patch.email !== session.user.email) {
      const { error } = await supabase.auth.updateUser({ email: patch.email });
      if (error) return { success: false, error: error.message };
    }

    const profile = await getProfile(session.user.id);
    const freshEmail = patch.email || session.user.email;
    return { success: true, user: buildUser(session.user.id, freshEmail, profile) };
  },

  async changePassword(newPassword) {
    if (!isSupabase) return { success: true };
    const { error } = await supabase.auth.updateUser({ password: newPassword });
    if (error) return { success: false, error: error.message };
    return { success: true };
  },

  async resetPassword(email) {
    if (!isSupabase) {
      return { success: true, message: 'Demo mode: password reset emails are not sent. Use Admin@123 for the demo admin.' };
    }
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/account`
    });
    if (error) return { success: false, error: error.message };
    return { success: true, message: 'Password reset link sent — check your inbox.' };
  },

  // ---- Mobile OTP -------------------------------------------------------
  // local mode: code is generated & stored client-side, returned as
  // `demoCode` so the UI can show it (no SMS gateway). supabase mode:
  // built-in phone auth — requires the Phone provider + SMS gateway to be
  // enabled in the Supabase dashboard (Auth -> Providers -> Phone).
  async sendOtp(rawPhone) {
    const phone = normalizePhone(rawPhone);
    if (!phone || phone.replace(/\D/g, '').length < 10) {
      return { success: false, error: 'Enter a valid 10-digit mobile number.' };
    }

    if (!isSupabase) {
      const existing = getStorageData(STORAGE_KEYS.OTP, null);
      if (existing && existing.phone === phone && existing.sentAt &&
          Date.now() - existing.sentAt < 30 * 1000) {
        return { success: false, error: 'Please wait 30s before requesting another OTP.' };
      }
      const code = String(Math.floor(100000 + Math.random() * 900000));
      setStorageData(STORAGE_KEYS.OTP, {
        phone,
        code,
        sentAt: Date.now(),
        expiresAt: Date.now() + OTP_TTL_MS
      });
      return { success: true, phone, demoCode: code };
    }

    const { error } = await supabase.auth.signInWithOtp({
      phone,
      options: { data: { phone } }
    });
    if (error) {
      return {
        success: false,
        error: /provider|sms|phone/i.test(error.message)
          ? `SMS not configured on this project yet — enable the Phone provider in Supabase (Auth → Providers → Phone). (${error.message})`
          : error.message
      };
    }
    return { success: true, phone };
  },

  async verifyOtp(rawPhone, rawCode) {
    const phone = normalizePhone(rawPhone);
    const code = String(rawCode || '').trim();
    if (!phone) return { success: false, error: 'Enter a valid mobile number.' };
    if (!/^\d{6}$/.test(code)) return { success: false, error: 'Enter the 6-digit OTP.' };

    if (!isSupabase) {
      const pending = getStorageData(STORAGE_KEYS.OTP, null);
      if (!pending || pending.phone !== phone) {
        return { success: false, error: 'No OTP requested for this number. Send OTP again.' };
      }
      if (Date.now() > pending.expiresAt) {
        localStorage.removeItem(STORAGE_KEYS.OTP);
        return { success: false, error: 'OTP expired. Request a new one.' };
      }
      if (pending.code !== code) {
        return { success: false, error: 'Incorrect OTP. Please try again.' };
      }
      localStorage.removeItem(STORAGE_KEYS.OTP);
      const existing = getStorageData(STORAGE_KEYS.AUTH, null);
      const user = (existing && existing.phone === phone)
        ? existing
        : { id: 'cust-' + phone.replace(/\D/g, ''), name: phone, email: '', phone, role: 'customer' };
      setStorageData(STORAGE_KEYS.AUTH, user);
      return { success: true, user };
    }

    const { data, error } = await supabase.auth.verifyOtp({ phone, token: code, type: 'sms' });
    if (error) return { success: false, error: error.message };
    const sessionUser = data?.user || data?.session?.user;
    if (!sessionUser) return { success: false, error: 'Verification failed. Try again.' };

    let profile = await getProfile(sessionUser.id);
    if (!profile?.name) {
      // First OTP sign-in: default the display name to the phone number.
      await supabase.from('user_profiles').update({ name: phone, phone }).eq('id', sessionUser.id);
      profile = await getProfile(sessionUser.id);
    } else if (!profile.phone) {
      await supabase.from('user_profiles').update({ phone }).eq('id', sessionUser.id);
      profile = await getProfile(sessionUser.id);
    }
    return { success: true, user: buildUser(sessionUser.id, sessionUser.email, profile) };
  },

  onChange(cb) {
    if (!isSupabase) return () => {};
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event) => cb(event));
    return () => subscription.unsubscribe();
  }
};

export const backend = {
  isSupabase,
  loadContent,
  saveList,
  saveSettings,
  createOrder,
  trackOrder,
  resetDemo,
  auth
};
