const puppeteer = require('puppeteer-core');
const path = require('path');

const OUT = 'C:\\Users\\armaa\\AppData\\Local\\Temp\\opencode';
const BASE = 'http://localhost:4173';

const MOBILE = [
  ['/', 'mp-home.png', true],
  ['/shop', 'mp-shop.png', true],
  ['/product/fresh-oyster-mushrooms', 'mp-pdp.png', true],
  ['/cart', 'mp-cart.png', false],
  ['/checkout', 'mp-checkout.png', false],
  ['/contact', 'mp-contact.png', false],
  ['/about', 'mp-about.png', true],
  ['/recipes', 'mp-recipes.png', true],
];
const DESKTOP = [
  ['/', 'dp-home.png', false],
  ['/shop', 'dp-shop.png', false],
  ['/product/fresh-oyster-mushrooms', 'dp-pdp.png', false],
  ['/checkout', 'dp-checkout.png', false],
];

async function shoot(page, route, file, fullPage) {
  await page.goto(BASE + route, { waitUntil: 'networkidle2', timeout: 60000 });
  await new Promise(r => setTimeout(r, 1600));
  await page.screenshot({ path: path.join(OUT, file), fullPage });
  console.log('shot ' + file);
}

(async () => {
  const browser = await puppeteer.launch({
    executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
    headless: 'new'
  });

  // ---- mobile pass ----
  const m = await browser.newPage();
  await m.setViewport({ width: 390, height: 844, isMobile: true, hasTouch: true, deviceScaleFactor: 2 });
  for (const [route, file, full] of MOBILE) await shoot(m, route, file, full);

  // PDP sticky bar / CTA area closeup
  await m.goto(BASE + '/product/fresh-oyster-mushrooms', { waitUntil: 'networkidle2', timeout: 60000 });
  await new Promise(r => setTimeout(r, 1600));
  const cta = await m.$('.pdp-actions');
  if (cta) { await cta.evaluate(e => e.scrollIntoView({ block: 'center' })); await new Promise(r => setTimeout(r, 600)); await m.screenshot({ path: path.join(OUT, 'mp-pdp-cta.png') }); console.log('shot mp-pdp-cta.png'); }

  // mobile menu open
  await m.goto(BASE + '/', { waitUntil: 'networkidle2', timeout: 60000 });
  await new Promise(r => setTimeout(r, 1400));
  const burger = await m.$('.mobile-hamburger');
  if (burger) { await burger.click(); await new Promise(r => setTimeout(r, 900)); await m.screenshot({ path: path.join(OUT, 'mp-menu.png') }); console.log('shot mp-menu.png'); }

  // lightbox open on PDP
  await m.goto(BASE + '/product/fresh-oyster-mushrooms', { waitUntil: 'networkidle2', timeout: 60000 });
  await new Promise(r => setTimeout(r, 1600));
  const stage = await m.$('[role="button"][aria-label], .pdp-stage, .gallery-stage');
  if (stage) { await stage.click().catch(() => {}); await new Promise(r => setTimeout(r, 700)); await m.screenshot({ path: path.join(OUT, 'mp-lightbox.png') }); console.log('shot mp-lightbox.png'); }
  else console.log('lightbox stage not found');

  // broken image sweep (mobile, key routes)
  const brokenAll = {};
  for (const route of ['/', '/shop', '/product/fresh-oyster-mushrooms', '/about', '/recipes']) {
    await m.goto(BASE + route, { waitUntil: 'networkidle2', timeout: 60000 });
    await new Promise(r => setTimeout(r, 1800));
    const bad = await m.evaluate(() =>
      [...document.images].filter(i => i.complete && i.naturalWidth === 0).map(i => i.src)
    );
    if (bad.length) brokenAll[route] = bad;
  }
  console.log('BROKEN:', JSON.stringify(brokenAll));

  // ---- desktop pass ----
  const d = await browser.newPage();
  await d.setViewport({ width: 1440, height: 900 });
  for (const [route, file, full] of DESKTOP) await shoot(d, route, file, full);

  await browser.close();
  console.log('done');
})().catch(e => { console.error(e); process.exit(1); });
