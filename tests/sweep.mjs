import { chromium } from 'playwright';
const slugs = ['isometric-room','dark-forest','metaverse-hispanic-talent','skullcrusher','colorblind-test','cyberschijf-van-vijf','gamepoint-liveops'];
const urls = ['/'].concat(slugs.map(s=>`/projects/${s}/`)).concat(['/terms/','/privacy/']);
const b = await chromium.launch();
for (const u of urls) {
  const p = await (await b.newContext({viewport:{width:1280,height:900}})).newPage();
  const errs=[]; const f=[];
  p.on('console',m=>m.type()==='error'&&errs.push(m.text()));
  p.on('pageerror',e=>errs.push('PE:'+e.message));
  p.on('response',r=>{ if(r.status()>=400) f.push(r.status()+' '+r.url().replace('http://localhost:4000','')); });
  await p.goto('http://localhost:4000'+u,{waitUntil:'networkidle'});
  await p.waitForTimeout(800);
  // metaverse link present?
  let extra='';
  if (u.includes('metaverse')) { const n=await p.evaluate(()=>document.querySelectorAll('.project-links a').length); extra=` links=${n}`; }
  console.log(`${u.padEnd(40)} errors=${errs.length} 4xx=${f.length}${extra}` + (errs.length?` :: ${errs.join(' | ')}`:'') + (f.length?` :: ${f.join(' | ')}`:''));
  await p.close();
}
await b.close();
