import { chromium } from 'playwright';
const B='http://localhost:4000';
const b=await chromium.launch();
// Homepage: filters, badges, hover summary, nav CV, favicon, og
{
  const p=await(await b.newContext({viewport:{width:1280,height:900}})).newPage();
  const errs=[]; p.on('console',m=>m.type()==='error'&&errs.push(m.text())); p.on('pageerror',e=>errs.push('PE:'+e.message));
  await p.goto(B+'/',{waitUntil:'networkidle'});
  const info=await p.evaluate(()=>({
    filterBtns:[...document.querySelectorAll('.filter-btn')].map(x=>x.textContent.trim()),
    badges:[...document.querySelectorAll('.project-badge')].map(x=>x.textContent.trim()),
    cards:document.querySelectorAll('.portfolio-item').length,
    navCV:document.querySelector('.nav-cv-btn')?.getAttribute('href'),
    favIco:document.querySelector('link[rel="icon"][type="image/x-icon"]')?.getAttribute('href'),
    ogImg:document.querySelector('meta[property="og:image"]')?.content,
    twitter:document.querySelector('meta[name="twitter:card"]')?.content,
    summaries:document.querySelectorAll('.project-card-summary').length,
  }));
  // test filter: click "Work"
  await p.click('.filter-btn[data-filter="work"]');
  await p.waitForTimeout(200);
  const workVisible=await p.evaluate(()=>[...document.querySelectorAll('.portfolio-item')].filter(i=>i.style.display!=='none').length);
  await p.click('.filter-btn[data-filter="blender"]');
  await p.waitForTimeout(200);
  const blenderVisible=await p.evaluate(()=>[...document.querySelectorAll('.portfolio-item')].filter(i=>i.style.display!=='none').length);
  // favicon decodes?
  const favOk=await p.evaluate(async()=>{const i=new Image();i.src='/favicon.ico';try{await i.decode();return i.naturalWidth>0;}catch(e){return 'decode-fail:'+e.message;}});
  // CV + og image resolve
  const cv=await p.request.get(B+info.navCV); const og=await p.request.get(info.ogImg.replace('https://missaelponce.github.io',B));
  console.log('HOME:',JSON.stringify({...info, workVisible, blenderVisible, favDecodes:favOk, cvStatus:cv.status(), ogStatus:og.status(), consoleErrors:errs},null,1));
  await p.close();
}
// Contact gitlab + 404
{
  const p=await(await b.newContext({viewport:{width:1280,height:900}})).newPage();
  await p.goto(B+'/',{waitUntil:'networkidle'});
  const contact=await p.evaluate(()=>({links:[...document.querySelectorAll('.contact-grid .contact-link')].length, gitlab:!!document.querySelector('.contact-icon-svg'), gitlabHref:[...document.querySelectorAll('.contact-link')].map(a=>a.href).find(h=>h.includes('gitlab'))}));
  console.log('CONTACT:',JSON.stringify(contact));
  const r=await p.goto(B+'/nothing-here-xyz/',{waitUntil:'domcontentloaded'}).catch(e=>null);
  // 404.html served? load it directly
  await p.goto(B+'/404.html',{waitUntil:'networkidle'});
  const e404=await p.evaluate(()=>({code:document.querySelector('.error-code')?.textContent,title:document.querySelector('.error-title')?.textContent,btn:!!document.querySelector('.error-home-btn')}));
  console.log('404:',JSON.stringify(e404));
  await p.close();
}
await b.close();
