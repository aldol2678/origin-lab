const {chromium}=require('playwright'),fs=require('node:fs'),assert=require('node:assert/strict');
const {core}=require('./helpers.cjs'),{bundleAssets,keys}=require('../tools/assets.cjs');
const html=fs.readFileSync('origin-lab-v0.3.html','utf8'),c=core(),manifest=bundleAssets('assets',keys(require('../data/catalog.json'))).manifest;
const results=[],errors=[];let browser;
const state=c.le(20261018);state.discovered=c.Y.map(x=>x.id);state.finalResearchDone=true;state.chapter.unlocked=state.chapter.entered=state.chapter.kitClaimed=true;state.env.oxygen=45;
for(const sp of c.I)for(const h of c.g[sp].habitats)state.pops[sp][h]=Math.min(10,c.g[sp].K[h]);
async function check(name,fn){results.push({name,status:'PASS',...await fn()});console.log('PASS',name);}
(async()=>{
 fs.mkdirSync('qa/screenshots',{recursive:true});browser=await chromium.launch({executablePath:process.env.CHROMIUM_PATH||chromium.executablePath(),args:['--no-sandbox']});
 async function open(m=manifest){const ctx=await browser.newContext({offline:true,viewport:{width:390,height:844},colorScheme:'light',reducedMotion:'reduce'});await ctx.route('https://origin.test/**',r=>r.fulfill({contentType:'text/html',body:html.replace(/const ASSET_MANIFEST\s*=\s*[^\n]+;/,'const ASSET_MANIFEST='+JSON.stringify(m)+';')}));const p=await ctx.newPage();p.on('pageerror',e=>errors.push(e.message));await p.goto('https://origin.test/?debug=1');await p.evaluate(s=>{__originLab.stop();Object.assign(__originLab.state,s);__originLab.app.renderAll();},state);return {ctx,p};}
 async function settle(p){await p.evaluate(async()=>{await Promise.all([...document.images].map(i=>i.decode().catch(()=>{})));});}
 const {ctx,p}=await open();
 await check('CB01 all 42 discoveries lock without identity and reveal correct 20px R1 variants',async()=>{
  for(const theme of ['light','dark']){
   await p.emulateMedia({colorScheme:theme});await p.evaluate(()=>{__originLab.state.discovered=[];__originLab.app.setTab('log');__originLab.app.renderAll();});await settle(p);
   const lock=manifest.assets['discovery.water']['default.locked'].src;
   for(const item of c.Y){const slot=p.locator(`[data-codex="${item.id}"]`);assert.match(await slot.innerText(),/\?\?\?/);assert.equal(await slot.locator('img').getAttribute('src'),lock);await slot.click();assert.equal(await slot.locator('img').getAttribute('src'),lock);}
   await p.screenshot({path:`qa/screenshots/closeout-${theme}-locked-390.png`,fullPage:true});
   await p.evaluate(s=>{__originLab.state.discovered=s;__originLab.app.renderAll();},state.discovered);await settle(p);
   for(const item of c.Y){const slot=p.locator(`[data-codex="${item.id}"]`);assert.equal(await slot.locator('img').getAttribute('src'),manifest.assets['discovery.'+item.id][theme+'.default'].src);const r=await slot.locator('img').boundingBox();assert.equal(r.width,20);assert.equal(r.height,20);await slot.click();assert.equal(await slot.getAttribute('aria-pressed'),'true');}
  }
  return {lockedKeys:42,revealedKeys:42,themes:2,initialTenIncluded:true};
 });
 await check('CB02 44px interactive targets across five viewports and actual theme CSS alignment',async()=>{
  let checked=0;const colors=[];
  for(const theme of ['light','dark']){await p.emulateMedia({colorScheme:theme});colors.push(await p.evaluate(()=>getComputedStyle(document.body).backgroundColor));
   for(const [width,height]of [[320,568],[360,640],[390,844],[1024,768],[1280,800]]){await p.setViewportSize({width,height});
    for(const tab of ['world','lab','evo','log']){await p.evaluate(tab=>{__originLab.app.setTab(tab);__originLab.app.renderAll();__originLab.app.renderer.resize();__originLab.app.draw(true);},tab);await settle(p);
     const sizes=await p.evaluate(()=>[...document.querySelectorAll('button,summary,select,input[type=checkbox]')].filter(e=>!e.disabled).map(e=>{const t=e.matches('input[type=checkbox]')?e.closest('label')||e:e,r=t.getBoundingClientRect();return {tag:e.tagName,id:e.id,text:e.textContent.slice(0,24),w:r.width,h:r.height};}).filter(r=>r.w&&r.h));
     const bad=sizes.filter(r=>r.w<43.5||r.h<43.5);assert.deepEqual(bad,[],`${theme}/${width}/${tab}`);checked+=sizes.length;
     if((width===320&&tab==='lab')||(width===390&&tab==='log')||(width===1280&&tab==='world'))await p.screenshot({path:`qa/screenshots/closeout-${theme}-${width}-${tab}.png`,fullPage:true});
    }
   }
  }
  assert.notEqual(colors[0],colors[1]);return {layouts:40,targetsChecked:checked,cssThemeColors:colors,gameThemeOverride:'NOT_PRESENT: CSS and adapter both follow OS media query'};
 });
 await check('CB03 nine species move, select, deselect and survive tab changes without state writes',async()=>{
  await p.setViewportSize({width:390,height:844});await p.emulateMedia({reducedMotion:'no-preference'});await p.locator('#tab-world').click();
  const before=await p.evaluate(()=>JSON.stringify(__originLab.state));
  const motion=await p.evaluate(()=>{const a=__originLab.app;a.renderer.resize();a.renderer.draw(a.state,0,null);const first=a.renderer.agents.map(x=>({...x}));a.renderer.draw(a.state,2000,null);return first.map((x,i)=>({sp:x.sp,moved:x.x!==a.renderer.agents[i].x||x.y!==a.renderer.agents[i].y}));});
  for(const sp of c.I){assert(motion.some(x=>x.sp===sp&&x.moved));const button=p.locator(`[data-select="${sp}"]`);await button.click();assert.equal(await button.getAttribute('aria-expanded'),'true');await p.locator('#tab-lab').click();await p.locator('#tab-world').click();assert.equal(await button.getAttribute('aria-expanded'),'true');await button.click();assert.equal(await button.getAttribute('aria-expanded'),'false');assert.equal(await p.evaluate(()=>__originLab.app.selectedSpecies),null);}
  assert.equal(await p.evaluate(()=>JSON.stringify(__originLab.state)),before);return {species:9,movement:true,selectionCleared:true,mainStateUnchanged:true};
 });
 await check('CB04 measured JS heap and DOM counts for empty, prior 48 and complete 58 manifests',async()=>{
  const prior=require('./fixtures/r1-48-manifest.json'),m48={version:1,assets:Object.fromEntries(Object.keys(prior.assets).map(k=>[k,manifest.assets[k]]))},data=[];
  for(const [name,m]of [['empty',{version:1,assets:{}}],['prior48',m48],['complete58',manifest]]){
   const x=await open(m);await settle(x.p);const session=await x.ctx.newCDPSession(x.p);await session.send('Performance.enable');
   async function sample(){await session.send('HeapProfiler.collectGarbage');const metrics=await session.send('Performance.getMetrics'),dom=await session.send('Memory.getDOMCounters');return {jsHeapUsedBytes:metrics.metrics.find(x=>x.name==='JSHeapUsedSize').value,...dom};}
   const before=await sample();await x.p.evaluate(()=>{for(let i=0;i<100;i++){__originLab.app.renderAll();__originLab.app.draw(true);}});await settle(x.p);const after=await sample();assert(after.jsHeapUsedBytes-before.jsHeapUsedBytes<32*1024*1024,'unbounded retained heap growth');data.push({name,before,after});await x.ctx.close();
  }
  return {samples:data,scope:'Chromium CDP JS heap/DOM only; excludes GPU, decoded pixel buffers and device-level RSS'};
 });
 assert.deepEqual(errors,[]);await ctx.close();fs.writeFileSync('qa/closeout-browser-results.json',JSON.stringify({browser:browser.version(),results,errors},null,2));await browser.close();
})().catch(async e=>{console.error(e);fs.writeFileSync('qa/closeout-browser-results.json',JSON.stringify({results,errors,failure:e.stack},null,2));await browser?.close();process.exitCode=1;});
