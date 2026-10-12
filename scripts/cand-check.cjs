const sharp = require('sharp');
const fs = require('fs');

const CANDS = [
  ['pex-pickle-8599631', 'https://images.pexels.com/photos/8599631/pexels-photo-8599631.jpeg?auto=compress&cs=tinysrgb&w=800'],
  ['pex-dried-12809556', 'https://images.pexels.com/photos/12809556/pexels-photo-12809556.jpeg?auto=compress&cs=tinysrgb&w=800'],
  ['pex-dried-12809571', 'https://images.pexels.com/photos/12809571/pexels-photo-12809571.jpeg?auto=compress&cs=tinysrgb&w=800'],
  ['pex-herbs-39268177', 'https://images.pexels.com/photos/39268177/pexels-photo-39268177.jpeg?auto=compress&cs=tinysrgb&w=800']
];

(async () => {
  // Resolve Unsplash short-id -> CDN photo URL (free dried-mushrooms photo)
  try {
    const r = await fetch('https://unsplash.com/photos/BDp9uNaeYmY/download?force=true', { redirect: 'manual' });
    const loc = r.headers.get('location') || '';
    console.log('unsplash download redirect:', r.status, loc.slice(0, 200));
    const m = loc.match(/photo-[0-9a-f-]+/);
    if (m) CANDS.push(['uns-dried-paperbag', `https://images.unsplash.com/${m[0]}?auto=format&fit=crop&w=800&q=80`]);
  } catch (e) { console.log('unsplash resolve err:', e.message); }

  const ok = [];
  for (const [label, url] of CANDS) {
    try {
      const res = await fetch(url, { method: 'HEAD' });
      console.log(res.status, label);
      if (res.status === 200) ok.push([label, url]);
    } catch (e) { console.log('ERR', label, e.message); }
  }

  const thumbs = [];
  for (let i = 0; i < ok.length; i++) {
    const url = ok[i][1].replace('w=800', 'w=280').replace('h=800', 'h=200');
    const buf = Buffer.from(await (await fetch(url)).arrayBuffer());
    thumbs.push(await sharp(buf).resize(280, 200).composite([{
      input: Buffer.from(`<svg width="280" height="28"><rect width="280" height="28" fill="black"/><text x="6" y="19" fill="white" font-size="15" font-family="Arial">#${i} ${ok[i][0]}</text></svg>`),
      gravity: 'northwest'
    }]).png().toBuffer());
  }
  const cols = Math.min(ok.length, 5), tw = 280, th = 200;
  const rows = Math.ceil(thumbs.length / 5);
  await sharp({ create: { width: 5 * tw, height: Math.max(rows, 1) * th, channels: 3, background: '#222' } })
    .composite(thumbs.map((t, i) => ({ input: t, left: (i % 5) * tw, top: Math.floor(i / 5) * th })))
    .png().toFile('C:/Users/armaa/AppData/Local/Temp/opencode/cand-sheet.png');
  fs.writeFileSync('C:/Users/armaa/AppData/Local/Temp/opencode/cand-urls.txt', ok.map(([l, u]) => `${l}\t${u}`).join('\n'));
  console.log('ok:', ok.length, 'sheet done');
})();
