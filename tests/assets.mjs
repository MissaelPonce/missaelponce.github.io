import { chromium } from 'playwright';
const slugs=['isometric-room','dark-forest','metaverse-hispanic-talent','skullcrusher','colorblind-test','cyberschijf-van-vijf','gamepoint-liveops'];
const b=await chromium.launch();
const p=await(await b.newContext()).newPage();
let bad=0,total=0;
for(const u of ['/'].concat(slugs.map(s=>`/projects/${s}/`))){
  await p.goto('http://localhost:4000'+u,{waitUntil:'domcontentloaded'});
  const srcs=await p.evaluate(()=>[...document.querySelectorAll('img[src],video[src],source[src],iframe[src]')].map(e=>e.getAttribute('src')));
  for(const s of srcs){
    if(!s||s.startsWith('http')&&!s.includes('localhost')) continue;
    const url=s.startsWith('http')?s:'http://localhost:4000'+s;
    const r=await p.request.get(url); total++;
    if(!r.ok()){bad++; console.log(`  BAD ${r.status()} ${u}  ->  ${s}`);}
  }
}
console.log(`Checked ${total} asset refs, ${bad} broken.`);
await b.close();
