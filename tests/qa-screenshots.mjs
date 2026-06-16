// Visual QA: screenshots at 3 breakpoints + DOM probes for logo, hero video, alignment.
// Run with: node tests/qa-screenshots.mjs
import { chromium } from 'playwright';
import { mkdirSync } from 'fs';

const BASE = 'http://localhost:4000';
const OUT = 'tests/screenshots';
mkdirSync(OUT, { recursive: true });

const breakpoints = [
  { name: 'mobile', width: 375, height: 812 },
  { name: 'tablet', width: 768, height: 1024 },
  { name: 'desktop', width: 1280, height: 900 },
];

const pages = [
  { name: 'home', url: '/' },
  { name: 'project-isometric', url: '/projects/isometric-room/' },
  { name: 'project-metaverse', url: '/projects/metaverse-hispanic-talent/' },
];

const browser = await chromium.launch();
const report = [];

for (const bp of breakpoints) {
  for (const pg of pages) {
    const context = await browser.newContext({
      viewport: { width: bp.width, height: bp.height },
      deviceScaleFactor: 1,
    });
    const page = await context.newPage();
    const consoleErrors = [];
    page.on('console', (m) => { if (m.type() === 'error') consoleErrors.push(m.text()); });
    page.on('pageerror', (e) => consoleErrors.push('PAGEERROR: ' + e.message));

    await page.goto(BASE + pg.url, { waitUntil: 'networkidle' });
    await page.waitForTimeout(1200); // let video attempt play

    // Scroll through to trigger IntersectionObserver reveal-on-scroll content,
    // then return to top so the full-page capture shows everything revealed.
    await page.evaluate(async () => {
      const step = window.innerHeight * 0.8;
      for (let y = 0; y <= document.body.scrollHeight; y += step) {
        window.scrollTo(0, y);
        await new Promise((r) => setTimeout(r, 150));
      }
      window.scrollTo(0, 0);
      await new Promise((r) => setTimeout(r, 300));
    });

    // ---- Probes ----
    const probe = await page.evaluate(() => {
      const out = {};
      // Logo
      const logo = document.querySelector('.nav-logo');
      if (logo) {
        const r = logo.getBoundingClientRect();
        out.logo = { found: true, w: Math.round(r.width), h: Math.round(r.height),
          visible: r.width > 0 && r.height > 0 && getComputedStyle(logo).display !== 'none',
          naturalW: logo.naturalWidth, naturalH: logo.naturalHeight,
          complete: logo.complete };
      } else out.logo = { found: false };

      // Hero video
      const v = document.getElementById('hero-video');
      if (v) {
        const r = v.getBoundingClientRect();
        out.video = { found: true, w: Math.round(r.width), h: Math.round(r.height),
          hasSrc: !!v.currentSrc, currentSrc: v.currentSrc,
          paused: v.paused, readyState: v.readyState,
          videoW: v.videoWidth, videoH: v.videoHeight,
          objectFit: getComputedStyle(v).objectFit };
      } else out.video = { found: false };

      // Gallery images on detail pages
      const imgs = [...document.querySelectorAll('.project-gallery .project-img')];
      out.gallery = imgs.map((i) => ({ src: i.getAttribute('src'),
        w: Math.round(i.getBoundingClientRect().width),
        h: Math.round(i.getBoundingClientRect().height),
        fit: getComputedStyle(i).objectFit }));

      // Portfolio grid cards (homepage)
      const cards = [...document.querySelectorAll('.portfolio-box img')];
      out.cards = cards.map((i) => ({ src: i.getAttribute('src'),
        w: Math.round(i.getBoundingClientRect().width),
        h: Math.round(i.getBoundingClientRect().height),
        fit: getComputedStyle(i).objectFit }));

      // Horizontal-centering check for key elements: compares left gap vs right gap.
      // Flags anything whose center is >12px off the viewport center.
      const vw = window.innerWidth;
      const sel = ['.section-heading', '.header-content-inner', 'footer .container',
        '.project-title', '.contact-link', 'hr.primary', '.section-heading + hr'];
      out.centering = [];
      for (const s of sel) {
        document.querySelectorAll(s).forEach((el) => {
          const r = el.getBoundingClientRect();
          if (r.width === 0) return;
          const center = r.left + r.width / 2;
          const offset = Math.round(center - vw / 2);
          out.centering.push({ sel: s, offset, leftGap: Math.round(r.left),
            rightGap: Math.round(vw - r.right), offCenter: Math.abs(offset) > 12 });
        });
      }

      return out;
    });

    const file = `${OUT}/${pg.name}-${bp.name}.png`;
    await page.screenshot({ path: file, fullPage: true });
    report.push({ page: pg.name, bp: bp.name, file, consoleErrors, ...probe });
    await context.close();
  }
}

await browser.close();
console.log(JSON.stringify(report, null, 2));
