const puppeteer = require('puppeteer-core');

(async () => {
  const browser = await puppeteer.launch({
    executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
    headless: 'new'
  });
  for (const vp of [{ width: 1440, height: 900, name: 'desktop' }, { width: 390, height: 844, name: 'mobile' }]) {
    const page = await browser.newPage();
    await page.setViewport({ width: vp.width, height: vp.height, deviceScaleFactor: 2 });
    await page.goto('http://localhost:4173/', { waitUntil: 'networkidle0', timeout: 30000 }).catch(() => {});
    await new Promise(r => setTimeout(r, 1000));
    const info = await page.evaluate(() => {
      const btns = [...document.querySelectorAll('.header-actions > *')];
      return btns.map(b => {
        const r = b.getBoundingClientRect();
        const svg = b.querySelector('svg');
        const sr = svg ? svg.getBoundingClientRect() : null;
        return {
          label: b.getAttribute('aria-label') || b.getAttribute('href') || b.tagName,
          btn: { y: Math.round(r.y * 10) / 10, h: Math.round(r.height * 10) / 10 },
          svg: sr ? { y: Math.round(sr.y * 10) / 10, h: Math.round(sr.height * 10) / 10 } : null
        };
      });
    });
    console.log(vp.name, JSON.stringify(info, null, 1));
    await page.close();
  }
  await browser.close();
})();
