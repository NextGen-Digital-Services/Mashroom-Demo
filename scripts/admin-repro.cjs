const puppeteer = require('puppeteer-core');

(async () => {
  const browser = await puppeteer.launch({
    executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
    headless: 'new'
  });
  const page = await browser.newPage();
  const dir = 'C:\\Users\\armaa\\AppData\\Local\\Temp\\opencode';

  await page.setViewport({ width: 1200, height: 800 });
  await page.goto('http://localhost:4173/admin/login', { waitUntil: 'networkidle0', timeout: 30000 }).catch(() => {});
  await new Promise(r => setTimeout(r, 1000));
  await page.type('input[type="email"]', 'admin@brand.com');
  await page.type('input[type="password"]', 'Admin@123');
  await page.click('button[type="submit"]');
  await new Promise(r => setTimeout(r, 2500));

  // simulate: user collapsed sidebar on desktop, then shrank to tablet
  await page.click('button[title="Collapse sidebar"]');
  await new Promise(r => setTimeout(r, 400));

  await page.setViewport({ width: 900, height: 1000, deviceScaleFactor: 1.5 });
  await new Promise(r => setTimeout(r, 800));
  let m = await page.evaluate(() => ({
    scrollW: document.documentElement.scrollWidth,
    clientW: document.documentElement.clientWidth,
    sidebarX: Math.round(document.querySelector('.admin-sidebar').getBoundingClientRect().x),
    sidebarW: Math.round(document.querySelector('.admin-sidebar').getBoundingClientRect().width),
    bodyW: Math.round(document.querySelector('.admin-body').getBoundingClientRect().width),
    hamburger: getComputedStyle(document.querySelector('.admin-hamburger')).display
  }));
  console.log('tablet900 (was collapsed):', JSON.stringify(m));
  await page.screenshot({ path: `${dir}\\admin_fix_tablet.png` });

  // open drawer
  await page.click('.admin-hamburger');
  await new Promise(r => setTimeout(r, 600));
  m = await page.evaluate(() => ({
    sidebarX: Math.round(document.querySelector('.admin-sidebar').getBoundingClientRect().x),
    sidebarW: Math.round(document.querySelector('.admin-sidebar').getBoundingClientRect().width),
    backdrop: !!document.querySelector('.admin-sidebar-backdrop')
  }));
  console.log('drawer open:', JSON.stringify(m));
  await page.screenshot({ path: `${dir}\\admin_fix_drawer.png` });

  await browser.close();
  console.log('done');
})();
