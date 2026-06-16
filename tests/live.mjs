import { chromium } from 'playwright';
const BASE='https://missaelponce.github.io';
const slugs=['isometric-room','dark-forest','metaverse-hispanic-talent','skullcrusher','colorblind-test','cyberschijf-van-vijf','gamepoint-liveops'];
const urls=['/'].concat(slugs.map(s=>`/projects/${s}/`)).concat(['/terms/','/privacy/']);
const b=await chromium.launch();
for(const u of urls){
  const p=await(await b.newContext({viewport:{width:1280,height:900}})).newPage();
  const errs=[],bad=[];
  p.on('console',m=>m.type()==='error'&&errs.push(m.text()));
  p.on('pageerror',e=>errs.push('PE:'+e.message));
  p.on('response',r=>{if(r.status()>=400)bad.push(r.status()+' '+r.url().replace(BASE,''));});
  let status=0;
  try{const resp=await p.goto(BASE+u,{waitUntil:'networkidle',timeout:30000});status=resp.status();}catch(e){errs.push('NAV:'+e.message);}
  await p.waitForTimeout(600);
  // verify every asset ref resolves
  const srcs=await p.evaluate(()=>[...document.querySelectorAll('img[src],video[src],source[src],iframe[src],link[href]')].map(e=>e.getAttribute('src')||e.getAttribute('href')));
  let assetBad=0;
  for(const s of srcs){ if(!s||(s.startsWith('http')&&!s.includes('missaelponce.github.io')))continue; const url=s.startsWith('http')?s:BASE+s; const r=await p.request.get(url); if(!r.ok())assetBad++; }
  console.log(`${u.padEnd(40)} http=${status} consoleErr=${errs.length} 4xx=${bad.length} brokenAssets=${assetBad}`+(errs.length?` :: ${errs.slice(0,2).join(' | ')}`:'')+(bad.length?` :: ${bad.slice(0,3).join(' | ')}`:''));
  await p.close();
}
await b.close();
