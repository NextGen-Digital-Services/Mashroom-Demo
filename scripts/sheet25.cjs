const sharp = require('sharp');
const fs = require('fs');

const IDS = ['1552825897-bb5efa86eab1','1416879595882-3373a0480b5b','1510812431401-41d2bd2722f3','1518977676601-b53f82aba655','1608686207856-001b95cf60ca','1590080875515-8a3a8dc5735e','1534483509719-3feaee7c30da','1504544750208-dc0358e63f7f','1547592166-23ac45744acd','1589301760014-d929f3979dbc','1541544741938-0af808871cc0','1615485290382-441e4d049cb5','1514733670139-4d87a1941d55','1563865436874-9aef32095fad','1540420773420-3366772f4999','1512621776951-a57141f2eefd','1546069901-ba9599a7e63c','1563729784474-d77dbb933a9e','1505253716362-afaea1d3d1af','1504545102780-26774c1bb073','1504674900247-0877df9cc836','1547592180-85f173990554','1500937386664-56d1dfef3854','1500382017468-9049fed747ef','1523741543316-beb7fc7023d8'];

(async () => {
  const thumbs = [];
  for (let i = 0; i < IDS.length; i++) {
    try {
      const buf = Buffer.from(await (await fetch(`https://images.unsplash.com/photo-${IDS[i]}?w=280&h=200&q=70&auto=format&fit=crop`)).arrayBuffer());
      thumbs.push(await sharp(buf).resize(280, 200).composite([{
        input: Buffer.from(`<svg width="280" height="28"><rect width="280" height="28" fill="black"/><text x="6" y="19" fill="white" font-size="14" font-family="Arial">#${i} ${IDS[i].slice(0, 10)}</text></svg>`),
        gravity: 'northwest'
      }]).png().toBuffer());
    } catch (e) { console.log('fail', i, e.message); thumbs.push(null); }
  }
  const valid = thumbs.map((t, i) => ({ t, i })).filter((x) => x.t);
  await sharp({ create: { width: 5 * 280, height: Math.ceil(valid.length / 5) * 200, channels: 3, background: '#222' } })
    .composite(valid.map(({ t, i }) => ({ input: t, left: (i % 5) * 280, top: Math.floor(i / 5) * 200 })))
    .png().toFile('C:/Users/armaa/AppData/Local/Temp/opencode/all25.png');
  console.log('sheet done', valid.length);
})();
