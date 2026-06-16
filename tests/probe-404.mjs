import { chromium } from 'playwright';
const browser = await chromium.launch();
const page = await (await browser.newContext({viewport:{width:1280,height:900}})).newPage();
const failed = [];
page.on('requestfailed', r => failed.push(r.url() + '  [' + (r.failure()?.errorText||'') + ']'));
page.on('response', r => { if (r.status() >= 400) failed.push(r.status() + '  ' + r.url()); });
await page.goto('http://localhost:4000/', { waitUntil: 'networkidle' });
await page.waitForTimeout(1500);
const logo = await page.evaluate(() => {
  const l = document.querySelector('.nav-logo');
  return { src: l.src, currentSrc: l.currentSrc, naturalW: l.naturalWidth, complete: l.complete };
});
console.log('LOGO:', JSON.stringify(logo));
console.log('FAILED/4xx REQUESTS:');
failed.forEach(f => console.log('  ' + f));
await browser.close();
