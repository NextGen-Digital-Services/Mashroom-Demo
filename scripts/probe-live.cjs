const puppeteer = require('puppeteer-core');

(async () => {
  const browser = await puppeteer.launch({
    executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
    headless: 'new'
  });
  const page = await browser.newPage();
  const requests = [];
  page.on('request', (r) => requests.push(r.url()));

  await page.setViewport({ width: 1280, height: 900 });
  await page.goto('https://mashroom-demo.vercel.app/', { waitUntil: 'networkidle0', timeout: 45000 }).catch((e) => console.log('goto:', e.message));
  await new Promise((r) => setTimeout(r, 2500));

  const hosts = {};
  for (const u of requests) {
    try { const h = new URL(u).host; hosts[h] = (hosts[h] || 0) + 1; } catch {}
  }
  console.log('--- hosts ---');
  Object.entries(hosts).sort().forEach(([h, n]) => console.log(`  ${n}\t${h}`));

  const supa = requests.filter((u) => u.includes('supabase.co'));
  console.log(`\nsupabase requests: ${supa.length}`);
  supa.slice(0, 10).forEach((u) => console.log('  ' + u.slice(0, 160)));

  const info = await page.evaluate(async () => {
    const keys = Object.keys(localStorage);
    const prodKey = keys.find((k) => k.includes('product'));
    let prodCount = null;
    if (prodKey) { try { prodCount = JSON.parse(localStorage.getItem(prodKey)).length; } catch {} }
    const sw = await navigator.serviceWorker.getRegistrations().then((r) => r.length).catch(() => -1);
    const bestsellers = document.querySelectorAll('.product-card').length;
    const bodyText = document.body.innerText.slice(0, 0);
    return { keys, prodKey, prodCount, sw, bestsellers };
  });
  console.log('\n--- page state ---');
  console.log('localStorage keys:', info.keys.join(', '));
  console.log('product cache key:', info.prodKey, 'count:', info.prodCount);
  console.log('service workers:', info.sw);
  console.log('product cards rendered:', info.bestsellers);

  await browser.close();
})();
