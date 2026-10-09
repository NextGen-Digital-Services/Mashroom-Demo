const puppeteer = require('puppeteer-core');

(async () => {
  const browser = await puppeteer.launch({
    executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
    headless: 'new'
  });
  const page = await browser.newPage();
  await page.setViewport({ width: 390, height: 844, deviceScaleFactor: 2 });
  const jobs = [
    ['/about', 'about', [0, 844, 1700, 2600, 3500, 4400, 5300]],
    ['/our-farm', 'farm', [0, 844, 1700, 2600, 3500, 4400, 5300]]
  ];
  for (const [route, name, offsets] of jobs) {
    await page.goto('http://localhost:4173' + route, { waitUntil: 'networkidle0', timeout: 30000 }).catch(() => {});
    await new Promise(r => setTimeout(r, 1500));
    const h = await page.evaluate(() => document.documentElement.scrollHeight);
    console.log(route, 'height', h);
    for (const y of offsets) {
      if (y + 844 > h) continue;
      await page.evaluate(v => window.scrollTo(0, v), y);
      await new Promise(r => setTimeout(r, 700));
      await page.screenshot({ path: `C:\\Users\\armaa\\AppData\\Local\\Temp\\opencode\\seg_${name}_${y}.png` });
    }
  }
  await browser.close();
})();
