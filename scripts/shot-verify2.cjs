const puppeteer = require('puppeteer-core');

(async () => {
  const browser = await puppeteer.launch({
    executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
    headless: 'new'
  });
  const page = await browser.newPage();
  await page.setViewport({ width: 1280, height: 900 });

  // Home journal section (blog cards)
  await page.goto('http://localhost:4173/', { waitUntil: 'networkidle0', timeout: 45000 }).catch((e) => console.log('goto:', e.message));
  await new Promise((r) => setTimeout(r, 1800));
  const journal = await page.evaluate(() => {
    const h = [...document.querySelectorAll('h2')].find((x) => x.textContent.includes('Culinary Journal'));
    if (h) { h.scrollIntoView({ block: 'start' }); return true; }
    return false;
  });
  console.log('journal section found:', journal);
  await new Promise((r) => setTimeout(r, 900));
  await page.screenshot({ path: 'C:\\Users\\armaa\\AppData\\Local\\Temp\\opencode\\fix-journal.png' });

  // Growing kit product page (card image + gallery)
  await page.goto('http://localhost:4173/product/oyster-home-growing-kit', { waitUntil: 'networkidle0', timeout: 45000 }).catch((e) => console.log('goto kit:', e.message));
  await new Promise((r) => setTimeout(r, 1500));
  const kitSrc = await page.evaluate(() => {
    const img = document.querySelector('.product-detail img, main img');
    return img ? (img.currentSrc || img.src) : null;
  });
  console.log('kit main img:', kitSrc && kitSrc.slice(0, 95));
  await page.screenshot({ path: 'C:\\Users\\armaa\\AppData\\Local\\Temp\\opencode\\fix-kit.png' });

  await browser.close();
})();
