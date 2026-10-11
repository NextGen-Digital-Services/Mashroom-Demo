const puppeteer = require('puppeteer-core');

(async () => {
  const browser = await puppeteer.launch({
    executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
    headless: 'new'
  });
  const dir = 'C:\\Users\\armaa\\AppData\\Local\\Temp\\opencode';

  // desktop header zoom
  const d = await browser.newPage();
  await d.setViewport({ width: 1440, height: 900, deviceScaleFactor: 2 });
  await d.goto('http://localhost:4173/', { waitUntil: 'networkidle0', timeout: 30000 }).catch(() => {});
  await new Promise(r => setTimeout(r, 1200));
  await d.screenshot({ path: `${dir}\\v3_desktop_header.png`, clip: { x: 0, y: 0, width: 1440, height: 120 } });

  // mobile header zoom
  const m = await browser.newPage();
  await m.setViewport({ width: 390, height: 844, deviceScaleFactor: 3 });
  await m.goto('http://localhost:4173/', { waitUntil: 'networkidle0', timeout: 30000 }).catch(() => {});
  await new Promise(r => setTimeout(r, 1200));
  await m.screenshot({ path: `${dir}\\v3_mobile_header.png`, clip: { x: 0, y: 100, width: 390, height: 80 } });

  // admin login
  await m.goto('http://localhost:4173/admin/login', { waitUntil: 'networkidle0', timeout: 30000 }).catch(() => {});
  await new Promise(r => setTimeout(r, 1200));
  await m.screenshot({ path: `${dir}\\v3_admin_login.png`, fullPage: false });

  await browser.close();
  console.log('done');
})();
