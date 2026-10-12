const sharp = require('sharp');
const fs = require('fs');

// Previously delivered primaries (from session record) + sun-dried/pickle candidates
const SET = [
  ['fresh-prim', '1552825897-bb5efa86eab1'],
  ['fresh-alt', '1504545102780-26774c1bb073'],
  ['powder-prim', '1509358271058-acd22cc93898'],
  ['powder-alt', '1596040033229-a9821ebd058d'],
  ['soup-prim', '1476124369491-e7addf5db371'],
  ['soup-alt1', '1547592166-23ac45744acd'],
  ['soup-alt2', '1626200419199-391ae4be7a41'],
  ['kit-prim', '1523348837708-15d4a09cfac2'],
  ['kit-alt', '1466692476868-aef1dfb1e735'],
  ['chutney', '1601050690117-94f5f6fa8bd7'],
  ['spawn', '1416879595882-3373a0480b5b'],
  ['combo-prim', '1504545102780-26774c1bb073'],
  // sun-dried candidates (probe2)
  ['dried-1', '1607690424560-35d967d6ad7c'],
  ['dried-2', '1615937691194-97dbd3f3dc29'],
  ['dried-3', '1591273747400-1e04f1c9e6a3'],
  ['dried-4', '1609501676725-7186f017a4b7'],
  ['dried-5', '1628777212010-4f1003e6e2e1'],
  ['dried-6', '1637277616175-8e33d40e6d6c'],
  ['dried-7', '1596797038530-2c107229654b'],
  ['dried-8', '1633358404858-0d4b6f4b58b5'],
  // pickle candidates (probe2)
  ['pick-1', '1584556812952-905ffd0c611a'],
  ['pick-2', '1604187351574-c75ca79f5807'],
  ['pick-3', '1615486511484-92e172cc4fe0'],
  ['pick-4', '1615485500704-8e990f9900f7'],
  ['pick-5', '1584278858536-52532423b9ea'],
  ['pick-6', '1599599810694-b5ac4dd7d0b6'],
  ['pick-7', '1589308078059-be1415eab4c3'],
  ['pick-8', '1600628421055-4d30de868b8f']
];

(async () => {
  const ok = [];
  for (const [label, id] of SET) {
    try {
      const res = await fetch(`https://images.unsplash.com/photo-${id}?w=300&q=70&auto=format&fit=crop`, { method: 'HEAD' });
      if (res.status === 200) ok.push([label, id]);
      else console.log('DEAD', label, id, res.status);
    } catch (e) { console.log('ERR', label, id, e.message); }
  }
  console.log('OK count:', ok.length);
  ok.forEach(([l, id]) => console.log(`${l}\t${id}`));
  fs.writeFileSync('C:/Users/armaa/AppData/Local/Temp/opencode/cat-links.txt', ok.map(([l, id]) => `${l}\t${id}`).join('\n'));

  const thumbs = [];
  for (let i = 0; i < ok.length; i++) {
    const [, id] = ok[i];
    const buf = Buffer.from(await (await fetch(`https://images.unsplash.com/photo-${id}?w=280&h=200&q=70&auto=format&fit=crop`)).arrayBuffer());
    thumbs.push(await sharp(buf).resize(280, 200).composite([{
      input: Buffer.from(`<svg width="280" height="28"><rect width="280" height="28" fill="black"/><text x="6" y="19" fill="white" font-size="15" font-family="Arial">#${i} ${ok[i][0]}</text></svg>`),
      gravity: 'northwest'
    }]).png().toBuffer());
  }
  const cols = 5, tw = 280, th = 200;
  const rows = Math.ceil(thumbs.length / cols);
  await sharp({ create: { width: cols * tw, height: rows * th, channels: 3, background: '#222' } })
    .composite(thumbs.map((t, i) => ({ input: t, left: (i % cols) * tw, top: Math.floor(i / cols) * th })))
    .png().toFile('C:/Users/armaa/AppData/Local/Temp/opencode/cat-sheet.png');
  console.log('sheet done');
})();
