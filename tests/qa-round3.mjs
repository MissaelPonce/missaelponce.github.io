// Round-3 QA: homepage changes, media viewer interactions, WebGL build load.
import { chromium } from 'playwright';
import { mkdirSync } from 'fs';
const BASE = 'http://localhost:4000';
const OUT = 'tests/screenshots';
mkdirSync(OUT, { recursive: true });

const browser = await chromium.launch();
const log = (o) => console.log(JSON.stringify(o, null, 2));

// ---------- 1. Homepage checks ----------
{
  const ctx = await browser.newContext({ viewport: { width: 1280, height: 900 } });
  const page = await ctx.newPage();
  const errs = [];
  page.on('console', (m) => m.type() === 'error' && errs.push(m.text()));
  await page.goto(BASE + '/', { waitUntil: 'networkidle' });
  await page.evaluate(async () => {
    for (let y = 0; y <= document.body.scrollHeight; y += innerHeight * 0.8) { scrollTo(0, y); await new Promise(r => setTimeout(r, 120)); }
    scrollTo(0, 0); await new Promise(r => setTimeout(r, 300));
  });
  const home = await page.evaluate(() => ({
    navLogoH: Math.round(document.querySelector('.nav-logo').getBoundingClientRect().height),
    navFont: getComputedStyle(document.querySelector('.navbar-nav a')).fontSize,
    heroButtons: document.querySelectorAll('header .btn').length,
    aboutButtons: document.querySelectorAll('#about .btn').length,
    experienceSection: !!document.getElementById('experience'),
    footerPhone: !!document.querySelector('.footer-phone'),
    footerLogoH: Math.round(document.querySelector('.footer-logo').getBoundingClientRect().height),
    cardTagFont: getComputedStyle(document.querySelector('.project-tags .tag')).fontSize,
  }));
  log({ HOMEPAGE: home, consoleErrors: errs });
  await page.screenshot({ path: `${OUT}/r3-home.png`, fullPage: true });
  await ctx.close();
}

// ---------- 2. Media viewer interactions (dark-forest: images + videos) ----------
{
  const ctx = await browser.newContext({ viewport: { width: 1280, height: 900 } });
  const page = await ctx.newPage();
  await page.goto(BASE + '/projects/dark-forest/', { waitUntil: 'networkidle' });
  await page.waitForTimeout(600);
  const before = await page.evaluate(() => ({
    slides: document.querySelectorAll('.media-slide').length,
    thumbs: document.querySelectorAll('.media-thumb').length,
    tagStripFont: getComputedStyle(document.querySelector('.project-tag-strip .tag')).fontSize,
    activeIdx: [...document.querySelectorAll('.media-slide')].findIndex(s => s.classList.contains('is-active')),
  }));
  // click next twice
  await page.click('.media-next');
  await page.click('.media-next');
  const afterNext = await page.evaluate(() => [...document.querySelectorAll('.media-slide')].findIndex(s => s.classList.contains('is-active')));
  // click a video thumbnail (last one) then open modal
  await page.click('.media-thumb:last-child');
  const activeAfterThumb = await page.evaluate(() => [...document.querySelectorAll('.media-slide')].findIndex(s => s.classList.contains('is-active')));
  await page.click('.media-slide.is-active');
  await page.waitForTimeout(600);
  const modal = await page.evaluate(() => {
    const m = document.querySelector('.media-modal');
    const el = m.querySelector('.media-modal-el');
    return { open: !m.hidden && m.classList.contains('is-open'), elTag: el ? el.tagName : null,
      videoPlaying: el && el.tagName === 'VIDEO' ? !el.paused : null };
  });
  await page.screenshot({ path: `${OUT}/r3-darkforest-modal.png` });
  // close via Escape
  await page.keyboard.press('Escape');
  await page.waitForTimeout(400);
  const closed = await page.evaluate(() => document.querySelector('.media-modal').hidden);
  log({ MEDIA_VIEWER: { before, afterNext, activeAfterThumb, modal, closedAfterEsc: closed } });
  await page.goto(BASE + '/projects/dark-forest/', { waitUntil: 'networkidle' });
  await page.waitForTimeout(400);
  await page.screenshot({ path: `${OUT}/r3-darkforest.png`, fullPage: true });
  await ctx.close();
}

// ---------- 3. CyberSchijf + GamePoint: card image removed ----------
for (const slug of ['cyberschijf-van-vijf', 'gamepoint-liveops']) {
  const ctx = await browser.newContext({ viewport: { width: 1280, height: 900 } });
  const page = await ctx.newPage();
  await page.goto(`${BASE}/projects/${slug}/`, { waitUntil: 'networkidle' });
  await page.waitForTimeout(400);
  const info = await page.evaluate(() => {
    const firstSlide = document.querySelector('.media-slide .media-el');
    return { slides: document.querySelectorAll('.media-slide').length,
      firstSrc: firstSlide ? firstSlide.getAttribute('src').split('/').pop() : null };
  });
  log({ [slug]: info });
  await ctx.close();
}

// ---------- 4. ColorBlind WebGL build actually loads ----------
{
  const ctx = await browser.newContext({ viewport: { width: 1280, height: 900 } });
  const page = await ctx.newPage();
  const errs = [];
  page.on('pageerror', (e) => errs.push('PAGEERROR: ' + e.message));
  page.on('dialog', (d) => { errs.push('DIALOG: ' + d.message()); d.dismiss(); });
  // load the build directly to observe Unity load
  await page.goto(BASE + '/games/colorblind-test/index.html', { waitUntil: 'load' });
  // wait for progress to reach 100% or timeout
  let progress = '0%';
  for (let i = 0; i < 40; i++) {
    progress = await page.evaluate(() => {
      const b = document.querySelector('#unity-progress-bar-full');
      const bar = document.querySelector('#unity-loading-bar');
      return { width: b ? b.style.width : 'n/a', barHidden: bar ? bar.style.display === 'none' : false };
    });
    if (progress.barHidden) break;
    await page.waitForTimeout(500);
  }
  await page.waitForTimeout(1500);
  await page.screenshot({ path: `${OUT}/r3-colorblind-build.png` });
  log({ COLORBLIND_BUILD: { progress, pageErrors: errs } });
  await ctx.close();
}

// ---------- 5. ColorBlind project page (iframe embed) ----------
{
  const ctx = await browser.newContext({ viewport: { width: 1280, height: 900 } });
  const page = await ctx.newPage();
  await page.goto(BASE + '/projects/colorblind-test/', { waitUntil: 'networkidle' });
  await page.waitForTimeout(3000);
  await page.screenshot({ path: `${OUT}/r3-colorblind-page.png`, fullPage: true });
  const hasGallery = await page.evaluate(() => !!document.querySelector('.media-viewer'));
  log({ COLORBLIND_PAGE: { hasMediaViewer: hasGallery, hasIframe: await page.evaluate(() => !!document.querySelector('.webgl-embed')) } });
  await ctx.close();
}

await browser.close();
