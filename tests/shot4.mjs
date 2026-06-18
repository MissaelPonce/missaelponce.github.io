import { chromium } from 'playwright';
const B='http://localhost:4000';
const b=await chromium.launch();
const p=await(await b.newContext({viewport:{width:1280,height:900}})).newPage();
await p.goto(B+'/#portfolio',{waitUntil:'networkidle'});
await p.waitForTimeout(700);
await p.locator('#portfolio').screenshot({path:'tests/screenshots/r4-portfolio.png'});
// hover a card to show summary
await p.locator('.portfolio-item').first().hover();
await p.waitForTimeout(400);
await p.locator('#portfolio').screenshot({path:'tests/screenshots/r4-portfolio-hover.png'});
// nav
await p.goto(B+'/',{waitUntil:'networkidle'});
await p.screenshot({path:'tests/screenshots/r4-nav.png',clip:{x:0,y:0,width:1280,height:80}});
// project detail prominent links
await p.goto(B+'/projects/skullcrusher/',{waitUntil:'networkidle'});
await p.waitForTimeout(400);
await p.screenshot({path:'tests/screenshots/r4-skull-links.png',clip:{x:0,y:60,width:1280,height:360}});
await b.close();
console.log('shots done');
