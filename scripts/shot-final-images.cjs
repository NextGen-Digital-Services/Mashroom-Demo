const puppeteer = require('puppeteer-core');
const path = require('path');

const OUT = 'C:\\Users\\armaa\\AppData\\Local\\Temp\\opencode';
const BASE = 'http://localhost:4173';

async function shoot(page, sel, file, scrollFirst = true) {
  const el = await page.$(sel);
  if (!el) { console.log('MISSING ' + sel); return; }
  if (scrollFirst) await el.evaluate(e => e.scrollIntoView({ block: 'center' }));
  await new Promise(r => setTimeout(r, 1200));
  await el.screenshot({ path: path.join(OUT, file) });
  console.log('shot ' + file);
}

(async () => {
  const browser = await puppeteer.launch({
    executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
    headless: 'new',
    args: ['--window-size=1440,900']
  });
  const page = await browser.newPage();
  await page.setViewport({ width: 1440, height: 900 });

  // Home: hero + instagram strip
  await page.goto(BASE + '/', { waitUntil: 'networkidle2', timeout: 60000 });
  await new Promise(r => setTimeout(r, 1500));
  const heroImg = await page.$('.hero-arch img');
  if (heroImg) { await heroImg.screenshot({ path: path.join(OUT, 'fin-hero.png') }); console.log('shot fin-hero.png'); }
  else console.log('MISSING hero');
  // instagram strip container
  const ig = await page.$$('img');
  let igShot = false;
  for (const img of ig) {
    const src = await img.evaluate(e => e.currentSrc || e.src);
    if (src && src.includes('1563865436874')) { // dark flatlay = new ig[1]
      await img.evaluate(e => e.scrollIntoView({ block: 'center' }));
      await new Promise(r => setTimeout(r, 1500));
      await img.screenshot({ path: path.join(OUT, 'fin-ig.png') });
      console.log('shot fin-ig.png'); igShot = true; break;
    }
  }
  if (!igShot) console.log('ig image not found');

  // About: category grid (first card = fresh mushrooms, third = sun-dried pexels)
  await page.goto(BASE + '/about', { waitUntil: 'networkidle2', timeout: 60000 });
  await new Promise(r => setTimeout(r, 1500));
  await shoot(page, 'main', 'fin-about.png');

  // check for broken images everywhere
  await page.goto(BASE + '/', { waitUntil: 'networkidle2', timeout: 60000 });
  await new Promise(r => setTimeout(r, 2000));
  const broken = await page.evaluate(() =>
    [...document.images].filter(i => i.complete && i.naturalWidth === 0).map(i => i.src)
  );
  console.log('broken home imgs:', JSON.stringify(broken));
  await page.goto(BASE + '/about', { waitUntil: 'networkidle2', timeout: 60000 });
  await new Promise(r => setTimeout(r, 2000));
  const broken2 = await page.evaluate(() =>
    [...document.images].filter(i => i.complete && i.naturalWidth === 0).map(i => i.src)
  );
  console.log('broken about imgs:', JSON.stringify(broken2));

  await browser.close();
  console.log('done');
})().catch(e => { console.error(e); process.exit(1); });
