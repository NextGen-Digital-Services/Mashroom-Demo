const puppeteer = require('puppeteer-core');

(async () => {
  const browser = await puppeteer.launch({
    executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
    headless: 'new'
  });
  const page = await browser.newPage();
  await page.setViewport({ width: 390, height: 844 });
  const routes = ['/', '/about', '/our-farm', '/shop', '/cart', '/checkout', '/recipes', '/contact'];
  for (const route of routes) {
    await page.goto('http://localhost:4173' + route, { waitUntil: 'networkidle0', timeout: 30000 }).catch(e => console.log(route, 'NAV FAIL', e.message));
    await new Promise(r => setTimeout(r, 1200));
    const result = await page.evaluate(() => {
      const vw = document.documentElement.clientWidth;
      const sw = document.documentElement.scrollWidth;
      const bad = [];
      if (sw > vw) {
        document.querySelectorAll('*').forEach(el => {
          const r = el.getBoundingClientRect();
          if (r.right > vw + 1 && r.width > 2 && getComputedStyle(el).visibility !== 'hidden') {
            const tag = el.tagName.toLowerCase();
            const cls = (el.className && typeof el.className === 'string') ? '.' + el.className.split(/\s+/).slice(0, 3).join('.') : '';
            const txt = (el.textContent || '').trim().slice(0, 40).replace(/\s+/g, ' ');
            bad.push({ sel: tag + cls, right: Math.round(r.right), w: Math.round(r.width), txt });
          }
        });
      }
      // only outermost offenders: keep items whose parent is not also flagged
      return { vw, sw, bad: bad.slice(0, 40) };
    });
    console.log(`\n=== ${route} : scrollWidth=${result.sw} vs ${result.vw} ${result.sw > result.vw ? 'OVERFLOW ✓' : 'ok'}`);
    for (const b of result.bad) console.log(`  ${b.sel} right=${b.right} w=${b.w} "${b.txt}"`);
  }
  await browser.close();
})();
