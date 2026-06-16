import { chromium } from 'playwright';
const b=await chromium.launch();
const p=await(await b.newContext({viewport:{width:1280,height:900}})).newPage();
const errs=[]; p.on('console',m=>m.type()==='error'&&errs.push(m.text())); p.on('pageerror',e=>errs.push('PE:'+e.message));
await p.goto('http://localhost:4000/projects/gamepoint-liveops/',{waitUntil:'networkidle'});
const d=await p.evaluate(()=>({
  category:document.querySelector('.project-category-label')?.textContent.trim(),
  period:document.querySelector('.project-period')?.textContent.trim(),
  tags:[...document.querySelectorAll('.project-tag-strip .tag')].map(t=>t.textContent.trim()),
  introHasTrainee:document.querySelector('.project-content').textContent.includes('Trainee System Engineer'),
  introDate: /October 2025 to May 2026/.test(document.querySelector('.project-content').textContent),
  emdash: document.querySelector('.project-content').textContent.includes('—'),
}));
console.log('errors='+errs.length, JSON.stringify(d,null,2));
await b.close();
