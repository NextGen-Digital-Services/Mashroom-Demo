const puppeteer = require('puppeteer-core');

(async () => {
  const browser = await puppeteer.launch({
    executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
    headless: 'new'
  });
  const page = await browser.newPage();
  await page.setViewport({ width: 390, height: 844, deviceScaleFactor: 2 });
  const routes = [['/', 'home'], ['/about', 'about'], ['/our-farm', 'farm']];
  for (const [route, name] of routes) {
    await page.goto('http://localhost:4173' + route, { waitUntil: 'networkidle0', timeout: 30000 }).catch(() => {});
    await new Promise(r => setTimeout(r, 1500));
    await page.screenshot({ path: `C:\\Users\\armaa\\AppData\\Local\\Temp\\opencode\\pm_${name}.png`, fullPage: true });
    console.log('shot', name);
  }
  await browser.close();
})();
