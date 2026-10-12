const puppeteer = require('puppeteer-core');

(async () => {
  const browser = await puppeteer.launch({
    executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
    headless: 'new'
  });
  const page = await browser.newPage();
  await page.setViewport({ width: 1280, height: 900 });
  await page.goto('http://localhost:4173/', { waitUntil: 'networkidle0', timeout: 45000 }).catch((e) => console.log('goto:', e.message));
  await new Promise((r) => setTimeout(r, 1500));

  const imgEl = await page.$('img[alt="Farm Combo Pack"]');
  if (!imgEl) { console.log('combo img not found'); await browser.close(); return; }
  await imgEl.scrollIntoView();
  await new Promise((r) => setTimeout(r, 800));
  await imgEl.screenshot({ path: 'C:\\Users\\armaa\\AppData\\Local\\Temp\\opencode\\combo-el.png' });
  console.log('element screenshot saved');

  const section = await imgEl.evaluateHandle((el) => el.closest('div').parentElement);
  await section.asElement().screenshot({ path: 'C:\\Users\\armaa\\AppData\\Local\\Temp\\opencode\\combo-section.png' }).catch((e) => console.log('section shot:', e.message));
  await browser.close();
})();
