const puppeteer = require('puppeteer-core');

(async () => {
  const browser = await puppeteer.launch({
    executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
    headless: 'new'
  });
  const page = await browser.newPage();
  await page.setViewport({ width: 390, height: 844, deviceScaleFactor: 2 });
  const dir = 'C:\\Users\\armaa\\AppData\\Local\\Temp\\opencode';

  // Shop: edge tab + drawer
  await page.goto('http://localhost:4173/shop', { waitUntil: 'networkidle0', timeout: 30000 }).catch(() => {});
  await new Promise(r => setTimeout(r, 1200));
  await page.screenshot({ path: `${dir}\\v_shop.png` });
  const edge = await page.$('.shop-filter-edge');
  console.log('edge tab visible:', !!edge);
  if (edge) { await edge.click(); await new Promise(r => setTimeout(r, 600)); await page.screenshot({ path: `${dir}\\v_drawer.png` }); }

  // Header: mobile menu
  await page.goto('http://localhost:4173/', { waitUntil: 'networkidle0', timeout: 30000 }).catch(() => {});
  await new Promise(r => setTimeout(r, 1000));
  await page.click('.mobile-hamburger');
  await new Promise(r => setTimeout(r, 500));
  await page.screenshot({ path: `${dir}\\v_menu.png` });

  // Header: search sheet (close menu via backdrop first — backdrop covers header)
  await page.click('.mobile-menu-backdrop');
  await new Promise(r => setTimeout(r, 400));
  await page.click('button[aria-label="Search"]');
  await new Promise(r => setTimeout(r, 500));
  await page.type('.search-pop input', 'oyster');
  await new Promise(r => setTimeout(r, 600));
  await page.screenshot({ path: `${dir}\\v_search.png` });

  // Account menu (no admin)
  await page.goto('http://localhost:4173/', { waitUntil: 'networkidle0', timeout: 30000 }).catch(() => {});
  await new Promise(r => setTimeout(r, 800));
  await page.click('button[aria-label="Account menu"]');
  await new Promise(r => setTimeout(r, 400));
  const html = await page.content();
  console.log('admin link in DOM:', html.includes('Admin Portal'));
  await page.screenshot({ path: `${dir}\\v_account.png` });

  // About hero bg mobile
  await page.goto('http://localhost:4173/about', { waitUntil: 'networkidle0', timeout: 30000 }).catch(() => {});
  await new Promise(r => setTimeout(r, 1000));
  await page.screenshot({ path: `${dir}\\v_about_hero.png` });

  await browser.close();
})();
