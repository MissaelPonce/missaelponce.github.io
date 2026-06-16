import { chromium } from 'playwright';
const b=await chromium.launch();
const p=await(await b.newContext({viewport:{width:1280,height:900}})).newPage();
const bad=[]; p.on('response',r=>{if(r.status()>=400)bad.push(r.status()+' '+r.url().replace('http://localhost:4000',''))});
await p.goto('http://localhost:4000/',{waitUntil:'networkidle'});
// check every asset (incl favicon link tags) resolves
const srcs=await p.evaluate(()=>[...document.querySelectorAll('img[src],video[src],source[src],iframe[src],link[href]')].map(e=>e.getAttribute('src')||e.getAttribute('href')));
let assetBad=0, faviconRefs=[];
for(const s of srcs){ if(!s)continue; if(s.includes('favicon')||s.includes('apple-touch'))faviconRefs.push(s); if(s.startsWith('http')&&!s.includes('localhost'))continue; const url=s.startsWith('http')?s:'http://localhost:4000'+s; const r=await p.request.get(url); if(!r.ok()){assetBad++;console.log('  BROKEN:',r.status(),s);} }
const title=await p.title();
console.log('title='+JSON.stringify(title), 'brokenAssets='+assetBad, '4xx='+bad.length);
console.log('favicon refs in head:', JSON.stringify(faviconRefs));
await b.close();
