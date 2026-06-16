import { chromium } from 'playwright';
const BASE='https://missaelponce.github.io';
const b=await chromium.launch();
// identify broken asset on homepage
{
  const p=await(await b.newContext({viewport:{width:1280,height:900}})).newPage();
  await p.goto(BASE+'/',{waitUntil:'networkidle'});
  const srcs=await p.evaluate(()=>[...document.querySelectorAll('img[src],video[src],source[src],iframe[src],link[href]')].map(e=>e.getAttribute('src')||e.getAttribute('href')));
  for(const s of srcs){ if(!s||(s.startsWith('http')&&!s.includes('missaelponce.github.io')))continue; const url=s.startsWith('http')?s:BASE+s; const r=await p.request.get(url); if(!r.ok())console.log('  BROKEN ASSET:',r.status(),s); }
  // hero video
  await p.waitForTimeout(2500);
  const v=await p.evaluate(()=>{const e=document.getElementById('hero-video');return e?{src:(e.currentSrc||'').split('/').pop(),paused:e.paused,readyState:e.readyState}:null;});
  console.log('  HERO VIDEO:',JSON.stringify(v));
  await p.close();
}
// dark-forest media viewer + modal
{
  const p=await(await b.newContext({viewport:{width:1280,height:900}})).newPage();
  await p.goto(BASE+'/projects/dark-forest/',{waitUntil:'networkidle'});
  await p.waitForTimeout(500);
  await p.click('.media-slide.is-active');
  await p.waitForTimeout(600);
  const modal=await p.evaluate(()=>{const m=document.querySelector('.media-modal');return{open:!m.hidden&&m.classList.contains('is-open'),el:m.querySelector('.media-modal-el')?.tagName};});
  console.log('  DARK-FOREST MODAL:',JSON.stringify(modal));
  await p.close();
}
// colorblind webgl build
{
  const p=await(await b.newContext({viewport:{width:1280,height:900}})).newPage();
  const perr=[];p.on('pageerror',e=>perr.push(e.message));p.on('dialog',d=>{perr.push('DIALOG:'+d.message());d.dismiss();});
  await p.goto(BASE+'/games/colorblind-test/index.html',{waitUntil:'load'});
  let st={};
  for(let i=0;i<40;i++){st=await p.evaluate(()=>({w:document.querySelector('#unity-progress-bar-full')?.style.width,hidden:document.querySelector('#unity-loading-bar')?.style.display==='none'}));if(st.hidden)break;await p.waitForTimeout(500);}
  console.log('  COLORBLIND BUILD: progress='+JSON.stringify(st),'pageErrors='+perr.length);
  await p.close();
}
await b.close();
