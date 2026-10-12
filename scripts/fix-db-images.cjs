const K = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZkc2FjbGJzenJ4aXlya3RtYm5hIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc5MTE2OTI0MSwiZXhwIjoyMTA2NzQ1MjQxfQ.hKFS1FewiMGeZT4_xLtsD3etuL1E8zjWG9EgGJESIWI';
const BASE = 'https://vdsaclbszrxiyrktmbna.supabase.co/rest/v1';
const H = { apikey: K, Authorization: 'Bearer ' + K, 'Content-Type': 'application/json', Prefer: 'return=representation' };

const U = (id) => `https://images.unsplash.com/photo-${id}?q=80&w=800&auto=format&fit=crop`;
const PEX = (id) => `https://images.pexels.com/photos/${id}/pexels-photo-${id}.jpeg?auto=compress&cs=tinysrgb&w=800`;

const MUSHROOM = U('1552825897-bb5efa86eab1');
const BOWL = U('1504545102780-26774c1bb073');
const SOIL = U('1416879595882-3373a0480b5b');
const SOUP = U('1476124369491-e7addf5db371');
const SEED_POTS = U('1523348837708-15d4a09cfac2');
const SEED_TRAY = U('1466692476868-aef1dfb1e735');
const FIELD = U('1500382017468-9049fed747ef');
const DRIED1 = PEX(12809556);
const DRIED2 = PEX(12809571);

// slug -> { index -> replacement } for product galleries
const PRODUCT_FIX = {
  'fresh-oyster-mushrooms': { 1: MUSHROOM },
  'fresh-button-mushrooms': { 1: BOWL },
  'button-mushroom-spawn': { 2: SOIL },
  'oyster-mushroom-spawn': { 2: SOIL },
  'sun-dried-oyster-mushrooms': { 1: DRIED1, 2: DRIED2 },
  'sun-dried-shiitake-mushrooms': { 1: DRIED1, 2: DRIED2 },
  'mushroom-soup-mix': { 2: SOUP },
  'oyster-home-growing-kit': { 0: SEED_POTS, 1: SEED_TRAY },
  'farm-combo-pack': { 1: MUSHROOM }
};

const ROW_FIX = {
  blogs: { 'blog-2': FIELD, 'blog-3': SOUP },
  banners: { 'ban-1': MUSHROOM, 'ban-2': BOWL }
};

const get = async (t, q) => {
  const r = await fetch(`${BASE}/${t}?${q}`, { headers: H });
  const j = await r.json();
  if (!Array.isArray(j)) throw new Error(`${t}: ${JSON.stringify(j).slice(0, 150)}`);
  return j;
};

const patch = async (t, id, data) => {
  const r = await fetch(`${BASE}/${t}?id=eq.${encodeURIComponent(id)}`, {
    method: 'PATCH', headers: H, body: JSON.stringify({ data })
  });
  if (!r.ok) throw new Error(`patch ${t}/${id}: ${r.status} ${(await r.text()).slice(0, 150)}`);
};

(async () => {
  let changed = 0;

  const products = await get('products', 'select=id,data');
  for (const row of products) {
    const d = row.data;
    const fixes = PRODUCT_FIX[d.slug];
    if (!fixes || !Array.isArray(d.images)) continue;
    let dirty = false;
    for (const [idxStr, replacement] of Object.entries(fixes)) {
      const i = Number(idxStr);
      const cur = d.images[i];
      if (cur && (cur.includes('1541544741938') || cur.includes('1504674900247') || cur.includes('1518977676601'))) {
        console.log(`product ${d.slug} [${i}]: ${cur.match(/photo-([0-9a-f-]+)/)?.[1] || 'pexels'} -> ${replacement.slice(0, 70)}`);
        d.images[i] = replacement;
        dirty = true;
      }
    }
    if (dirty) { await patch('products', row.id, d); changed++; }
  }

  for (const [table, map] of Object.entries(ROW_FIX)) {
    const rows = await get(table, 'select=id,data');
    for (const row of rows) {
      const replacement = map[row.id];
      if (!replacement || !row.data.image) continue;
      const cur = row.data.image;
      if (cur.includes('1541544741938') || cur.includes('1504674900247') || cur.includes('1518977676601')) {
        console.log(`${table} ${row.id}: -> ${replacement.slice(0, 70)}`);
        row.data.image = replacement;
        await patch(table, row.id, row.data);
        changed++;
      }
    }
  }

  console.log(`done, rows updated: ${changed}`);
})();
