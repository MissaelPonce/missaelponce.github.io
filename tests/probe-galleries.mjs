import { chromium } from 'playwright';
import { mkdirSync } from 'fs';
mkdirSync('tests/screenshots', { recursive: true });
const browser = await chromium.launch();
const ctx = await browser.newContext({ viewport: { width: 1280, height: 900 } });
const page = await ctx.newPage();
// homepage portfolio grid
await page.goto('http://localhost:4000/#portfolio', { waitUntil: 'networkidle' });
await page.waitForTimeout(800);
await page.locator('#portfolio').screenshot({ path: 'tests/screenshots/_verify-portfolio-grid.png' });
// isometric detail
await page.goto('http://localhost:4000/projects/isometric-room/', { waitUntil: 'networkidle' });
await page.waitForTimeout(600);
await page.screenshot({ path: 'tests/screenshots/_verify-isometric.png', fullPage: true });
await browser.close();
console.log('done');
