const puppeteer = require('puppeteer-core');

(async () => {
  const browser = await puppeteer.launch({
    executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
    headless: 'new'
  });
  const page = await browser.newPage();
  await page.setViewport({ width: 1280, height: 900 });

  // Home hero
  await page.goto('http://localhost:4173/', { waitUntil: 'networkidle0', timeout: 45000 }).catch((e) => console.log('goto:', e.message));
  await new Promise((r) => setTimeout(r, 1500));
  await page.screenshot({ path: 'C:\\Users\\armaa\\AppData\\Local\\Temp\\opencode\\fix-hero.png' });
  const heroSrc = await page.evaluate(() => document.querySelector('.hero-arch')?.currentSrc || document.querySelector('.hero-arch')?.src || null);
  console.log('home hero src:', heroSrc && heroSrc.slice(0, 90));

  // About founder + cultivation
  await page.goto('http://localhost:4173/about', { waitUntil: 'networkidle0', timeout: 45000 }).catch((e) => console.log('goto about:', e.message));
  await new Promise((r) => setTimeout(r, 1500));
  const imgs = await page.$$('.about-split img, .about-split picture img');
  const altImg = await page.evaluate(() => {
    const el = [...document.querySelectorAll('img')].find((i) => i.alt.includes('Founder'));
    return el ? (el.currentSrc || el.src) : null;
  });
  console.log('founder src:', altImg && altImg.slice(0, 90));
  const founderEl = await page.evaluateHandle(() => [...document.querySelectorAll('img')].find((i) => i.alt.includes('Founder')));
  await founderEl.asElement().scrollIntoViewIfNeeded?.().catch(() => {});
  await new Promise((r) => setTimeout(r, 700));
  await founderEl.asElement().screenshot({ path: 'C:\\Users\\armaa\\AppData\\Local\\Temp\\opencode\\fix-founder.png' }).catch((e) => console.log('founder shot:', e.message));

  const cultSrc = await page.evaluate(() => {
    const el = [...document.querySelectorAll('img')].find((i) => i.alt.includes('Cultivation'));
    return el ? (el.currentSrc || el.src) : null;
  });
  console.log('cultivation src:', cultSrc && cultSrc.slice(0, 90));
  await browser.close();
})();
