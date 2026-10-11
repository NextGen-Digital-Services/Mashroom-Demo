const puppeteer = require('puppeteer-core');

(async () => {
  const browser = await puppeteer.launch({
    executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
    headless: 'new'
  });
  const page = await browser.newPage();
  await page.setViewport({ width: 390, height: 844, deviceScaleFactor: 2 });
  page.on('console', m => console.log('BROWSER:', m.text()));
  await page.goto('http://localhost:4173/', { waitUntil: 'networkidle0', timeout: 30000 }).catch(() => {});
  await new Promise(r => setTimeout(r, 1200));

  const btns = await page.$$eval('button[aria-label]', els => els.map(e => e.getAttribute('aria-label')));
  console.log('aria buttons:', JSON.stringify(btns));

  const box = await page.$eval('button[aria-label="Search"]', e => {
    const r = e.getBoundingClientRect();
    return { x: r.x, y: r.y, w: r.width, h: r.height, visible: r.width > 0 };
  }).catch(err => ({ err: String(err) }));
  console.log('search btn box:', JSON.stringify(box));

  await page.click('button[aria-label="Search"]');
  await new Promise(r => setTimeout(r, 600));
  console.log('pop exists:', !!(await page.$('.search-pop')));
  console.log('expanded:', await page.$eval('button[aria-label="Search"]', e => e.getAttribute('aria-expanded')));

  await browser.close();
})();
