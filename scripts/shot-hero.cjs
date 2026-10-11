const puppeteer = require('puppeteer-core');

(async () => {
  const browser = await puppeteer.launch({
    executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
    headless: 'new'
  });
  const page = await browser.newPage();
  await page.setViewport({ width: 390, height: 844, deviceScaleFactor: 2 });
  const dir = 'C:\\Users\\armaa\\AppData\\Local\\Temp\\opencode';

  await page.goto('http://localhost:4173/', { waitUntil: 'networkidle0', timeout: 30000 }).catch(() => {});
  await new Promise(r => setTimeout(r, 1500));
  await page.screenshot({ path: `${dir}\\v2_home_hero.png` });

  await page.goto('http://localhost:4173/shop', { waitUntil: 'networkidle0', timeout: 30000 }).catch(() => {});
  await new Promise(r => setTimeout(r, 1500));
  await page.screenshot({ path: `${dir}\\v2_shop.png` });

  await browser.close();
  console.log('done');
})();
