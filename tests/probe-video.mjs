import { chromium } from 'playwright';
import { mkdirSync } from 'fs';
mkdirSync('tests/screenshots', { recursive: true });
const browser = await chromium.launch();
const page = await (await browser.newContext({viewport:{width:1280,height:900}})).newPage();
await page.goto('http://localhost:4000/', { waitUntil: 'networkidle' });
await page.waitForTimeout(2500);
const v = await page.evaluate(() => {
  const el = document.getElementById('hero-video');
  return { currentSrc: el.currentSrc, paused: el.paused, readyState: el.readyState,
    currentTime: +el.currentTime.toFixed(2), videoW: el.videoWidth, videoH: el.videoHeight,
    objectFit: getComputedStyle(el).objectFit };
});
console.log('VIDEO:', JSON.stringify(v, null, 2));
await page.screenshot({ path: 'tests/screenshots/_verify-home-desktop.png' });
await browser.close();
