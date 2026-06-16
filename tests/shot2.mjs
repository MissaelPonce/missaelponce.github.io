import { chromium } from 'playwright';
const b = await chromium.launch();
const p = await (await b.newContext({viewport:{width:1280,height:900}})).newPage();
await p.goto('http://localhost:4000/', {waitUntil:'networkidle'});
await p.waitForTimeout(500);
await p.screenshot({path:'tests/screenshots/r4-navbar.png', clip:{x:0,y:0,width:1280,height:90}});
// scroll to contact + footer
await p.evaluate(async()=>{for(let y=0;y<=document.body.scrollHeight;y+=innerHeight*0.8){scrollTo(0,y);await new Promise(r=>setTimeout(r,100));}});
await p.waitForTimeout(400);
const contactBg = await p.evaluate(()=>getComputedStyle(document.getElementById('contact')).backgroundColor);
const aboutBg = await p.evaluate(()=>getComputedStyle(document.getElementById('about')).backgroundColor);
const footerLogoH = await p.evaluate(()=>Math.round(document.querySelector('.footer-logo').getBoundingClientRect().height));
console.log(JSON.stringify({contactBg, aboutBg, match: contactBg===aboutBg, footerLogoH}));
const c = await p.$('#contact'); await c.scrollIntoViewIfNeeded(); await p.waitForTimeout(300);
await p.screenshot({path:'tests/screenshots/r4-contact-footer.png'});
await b.close();
