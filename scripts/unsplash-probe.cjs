const sharp = require('sharp');
const fs = require('fs');

const IDS = [
  // mushrooms
  '1518977676601-b53f82aba655', '1607301405390-d831c242f59b', '1552825897-bb5efa86eab1',
  '1541344999736-83eca272f6fc', '1504545102780-26774c1bb073', '1589927986089-35812388d1f4',
  '1571680322279-a226e6a4cc2a', '1606923829579-0cb981a83e2e', '1611171711912-e3f6b536f532',
  '1608039755401-742074f0548d', '1594283255397-71b4e04a1e58', '1622206151226-18ca2c9ab4a1',
  '1603105037880-880cd4edfb0d', '1532336414038-cf19250c5757', '1512149177596-f817c7ef5d4c',
  '1518736114810-3f3bedfec66a', '1567306301408-9b74779a11af', '1602497534749-3f76a7a0f38c',
  '1596040033229-a9821ebd058d', '1599909533730-f9ba0fdcc69e', '1585441695325-2b2d1f4f4c45',
  // soup / food
  '1547592166-23ac45744acd', '1476718406336-bb5a9690ee2a', '1604909052743-94e838986d24',
  '1543826173-70651703c5a4', '1476124369491-e7addf5db371', '1547592180-85f173990554',
  '1497034825429-c343d7c6a68f',
  // pickle / jars / spices
  '1589621316382-008455b857cd', '1601050690597-df0568f70950', '1615485290382-441e4d049cb5',
  '1596040033137-4d8d3b2c3e3a', '1532336414038-cf19250c5757', '1509358271058-acd22cc93898',
  '1590779033100-9f60a05a013d', '1584949091598-c31daaaa4aa9',
  // gift / combo
  '1549465220-1a8b9238cd48', '1513885535751-8b9238bd345a', '1607344645866-009c320b63e0',
  // growing / soil
  '1416879595882-3373a0480b5b', '1466692476868-aef1dfb1e735', '1523348837708-15d4a09cfac2',
  '1466692476868-aef1dfb1e735'
];

(async () => {
  const ok = [];
  for (const id of IDS) {
    const url = `https://images.unsplash.com/photo-${id}?w=300&q=70&auto=format&fit=crop`;
    try {
      const res = await fetch(url, { method: 'HEAD' });
      if (res.status === 200) ok.push(id);
    } catch (e) {}
  }
  console.log('OK count:', ok.length);
  console.log(ok.join('\n'));
  fs.writeFileSync('C:/Users/armaa/AppData/Local/Temp/opencode/unsplash-ok.txt', ok.join('\n'));

  // download thumbnails + labeled contact sheet
  const thumbs = [];
  for (let i = 0; i < ok.length; i++) {
    const url = `https://images.unsplash.com/photo-${ok[i]}?w=280&h=200&q=70&auto=format&fit=crop`;
    const buf = Buffer.from(await (await fetch(url)).arrayBuffer());
    const tile = await sharp(buf).resize(280, 200).composite([{
      input: Buffer.from(`<svg width="280" height="28"><rect width="280" height="28" fill="black"/><text x="6" y="19" fill="white" font-size="16" font-family="Arial">#${i}</text></svg>`),
      gravity: 'northwest'
    }]).png().toBuffer();
    thumbs.push(tile);
  }
  // grid 5 cols
  const cols = 5, tw = 280, th = 200;
  const rows = Math.ceil(thumbs.length / cols);
  const composites = thumbs.map((t, i) => ({
    input: t,
    left: (i % cols) * tw,
    top: Math.floor(i / cols) * th
  }));
  await sharp({ create: { width: cols * tw, height: rows * th, channels: 3, background: '#222' } })
    .composite(composites).png().toFile('C:/Users/armaa/AppData/Local/Temp/opencode/unsplash-sheet.png');
  console.log('sheet done');
})();
