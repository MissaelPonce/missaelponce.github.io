import { chromium } from 'playwright';
const b = await chromium.launch();
const p = await (await b.newContext({viewport:{width:1280,height:900}})).newPage();
await p.goto('http://localhost:4000/', {waitUntil:'networkidle'});
const m = await p.evaluate(()=>{
  const nav=document.getElementById('mainNav');
  const brand=document.querySelector('.navbar-brand');
  const logo=document.querySelector('.nav-logo');
  const link=document.querySelector('.navbar-nav a');
  const r=e=>{const b=e.getBoundingClientRect();return {top:Math.round(b.top),bottom:Math.round(b.bottom),h:Math.round(b.height)};};
  const cs=getComputedStyle(nav);
  return {nav:r(nav), navBorderBottom:cs.borderBottomWidth, navMinH:cs.minHeight, brand:r(brand), logo:r(logo), link:link?r(link):null,
    brandPad:getComputedStyle(brand).padding, linkPad:getComputedStyle(link).padding};
});
console.log(JSON.stringify(m,null,2));
await b.close();
