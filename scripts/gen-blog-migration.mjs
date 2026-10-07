// Generates supabase/migrations/000X_journal_content.sql from src/data/blogs.js
// so the live DB (and fresh installs) carry the full journal articles.
// Run: node scripts/gen-blog-migration.mjs
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { initialBlogs } from '../src/data/blogs.js';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const outDir = path.join(root, 'supabase', 'migrations');
const args = process.argv.slice(2);
const name = args[0] || '0003_journal_content.sql';

let sql = `-- Full journal articles (Our Story / Farm & Field / Kitchen Notes)
-- Generated from src/data/blogs.js — do not edit by hand.
`;

for (const blog of initialBlogs) {
  const json = JSON.stringify(blog);
  if (json.includes('$json$')) throw new Error(`unsafe delimiter in ${blog.id}`);
  sql += `
insert into public.blogs (id, data)
values ('${blog.id}', $json$${json}$json$::jsonb)
on conflict (id) do update set data = excluded.data;
`;
}

const out = path.join(outDir, name);
fs.writeFileSync(out, sql);
console.log(`wrote ${out} (${sql.length} bytes, ${initialBlogs.length} articles)`);
