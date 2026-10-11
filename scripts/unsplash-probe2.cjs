const sharp = require('sharp');
const fs = require('fs');

const IDS = [
  // dried mushrooms / fungus
  '1607690424560-35d967d6ad7c', '1615937691194-97dbd3f3dc29', '1591273747400-1e04f1c9e6a3',
  '1609501676725-7186f017a4b7', '1628777212010-4f1003e6e2e1', '1637277616175-8e33d40e6d6c',
  '1596797038530-2c107229654b', '1633358404858-0d4b6f4b58b5',
  // pickle / jar / preserve
  '1584556812952-905ffd0c611a', '1604187351574-c75ca79f5807', '1615486511484-92e172cc4fe0',
  '1615485500704-8e990f9900f7', '1584278858536-52532423b9ea', '1599599810694-b5ac4dd7d0b6',
  '1589308078059-be1415eab4c3', '1600628421055-4d30de868b8f',
  // mushroom farm / spawn / grow
  '1598514982901-ae62764ae75e', '1592982537447-7440770cbfc9', '1583258292688-d0213dc5a3a8',
  '1626200419199-391ae4be7a41', '1580201092675-a0a6a6cafbb1', '1608835291093-394b0c943a75',
  '1593179449458-e0d43d512551', '1631451095765-2c91616fc9e6', '1622206151226-18ca2c9ab4a1',
  // chutney / dip / sauce bowls
  '1601050690117-94f5f6fa8bd7', '1589302168068-964664d93dc0', '1596797038530-2c107229654b',
  '1590779033100-9f60a05a013d', '1626196340104-2ba4ee97c7e3', '1596040033229-a9821ebd058d',
  // extra mushroom photos
  '1552825896-33b3d4d4b5b5', '1518977676601-b53f82aba656', '1571167530149-c1105da4c2c7',
  '1594283255397-71b4e04a1e59', '1606923829579-0cb981a83e2e'
];

(async () => {
  const seen = new Set();
  const ok = [];
  for (const id of IDS) {
    if (seen.has(id)) continue; seen.add(id);
    try {
      const res = await fetch(`https://images.unsplash.com/photo-${id}?w=300&q=70&auto=format&fit=crop`, { method: 'HEAD' });
      if (res.status === 200) ok.push(id);
    } catch (e) {}
  }
  console.log('OK count:', ok.length);
  ok.forEach((id, i) => console.log(`${i}\t${id}`));

  const thumbs = [];
  for (let i = 0; i < ok.length; i++) {
    const buf = Buffer.from(await (await fetch(`https://images.unsplash.com/photo-${ok[i]}?w=280&h=200&q=70&auto=format&fit=crop`)).arrayBuffer());
    thumbs.push(await sharp(buf).resize(280, 200).composite([{
      input: Buffer.from(`<svg width="280" height="28"><rect width="280" height="28" fill="black"/><text x="6" y="19" fill="white" font-size="16" font-family="Arial">#${i}</text></svg>`),
      gravity: 'northwest'
    }]).png().toBuffer());
  }
  const cols = 5, tw = 280, th = 200;
  const rows = Math.ceil(thumbs.length / cols);
  await sharp({ create: { width: cols * tw, height: rows * th, channels: 3, background: '#222' } })
    .composite(thumbs.map((t, i) => ({ input: t, left: (i % cols) * tw, top: Math.floor(i / cols) * th })))
    .png().toFile('C:/Users/armaa/AppData/Local/Temp/opencode/unsplash-sheet2.png');
  fs.writeFileSync('C:/Users/armaa/AppData/Local/Temp/opencode/unsplash-ok2.txt', ok.join('\n'));
  console.log('sheet done');
})();
