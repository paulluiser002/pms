const assert=require('assert');
const {chromium}=require('playwright');
(async()=>{
 const browser=await chromium.launch({headless:true,channel:'chrome'});
 try{
  const page=await browser.newPage({viewport:{width:1440,height:1000}}),errors=[];page.on('pageerror',e=>errors.push(e.message));
  await page.goto(process.env.PMS_URL||'http://127.0.0.1:4180/');
  const fields=()=>page.evaluate(()=>[...document.querySelectorAll('#content input,#content select,#content textarea,#pmsPageHeader input,#pmsPageHeader select')].map(e=>({name:e.name,id:e.id,type:e.type,value:e.value,required:e.required,disabled:e.disabled,readOnly:e.readOnly,options:e.tagName==='SELECT'?[...e.options].map(o=>[o.value,o.text]):null})));
  const content=()=>page.evaluate(()=>{const text=[];for(const root of [document.getElementById('pmsPageHeader'),document.getElementById('content')]){const walker=document.createTreeWalker(root,NodeFilter.SHOW_TEXT);let node;while(node=walker.nextNode())if(!node.parentElement.closest('[aria-hidden=true]'))text.push(node.textContent.trim())}return text.filter(Boolean).sort()});
  async function toggle(){await page.locator('#pmsProfileButton').click();await page.locator('#pmsThemeButton').click()}
  await page.locator('#pmsProfileButton').click();
  assert(await page.locator('#pmsThemeButton').evaluate(el=>el.previousElementSibling.classList.contains('pms-preview-host')),'Switch must follow role preview');
  await page.locator('#pmsThemeButton').click();
  assert.equal(await page.evaluate(()=>pmsThemeName()),'workspace');
  await page.evaluate(()=>document.fonts.ready);assert(await page.evaluate(()=>document.fonts.check('500 14px Poppins')));
  await page.reload();assert.equal(await page.evaluate(()=>pmsThemeName()),'workspace','Preference survives reload');
  await page.locator('#pmsThemeRole').selectOption('Manager');assert.equal(await page.evaluate(()=>viewRole),'Manager');
  await page.locator('#pmsSidebarSearch').fill('PIP');await page.locator('#nav button').filter({hasText:/^PIP/}).click();assert.equal(await page.evaluate(()=>page),'PIP');assert.equal(await page.locator('#pmsSidebarSearch').inputValue(),'');
  for(const role of ['Employee','Manager','HR Administrator']){
   await page.evaluate(r=>setRole(r),role);
   for(const destination of await page.evaluate(()=>roleNav().map(x=>x[0]))){
    await page.evaluate(n=>navigate(n),destination);
    const before=await fields(),text=await content();
    await toggle();assert.deepStrictEqual(await fields(),before);assert.deepStrictEqual(await content(),text);
    await toggle();assert.deepStrictEqual(await fields(),before);assert.deepStrictEqual(await content(),text);
   }
  }
  await page.evaluate(()=>pdEditGoalTemplate());
  const input=page.locator('#content input').first();await input.fill('Unsaved KPI template');
  const formBefore=await fields(),stored=await page.evaluate(()=>Object.fromEntries(Object.entries(localStorage).filter(([key])=>key!=='hrdotnet-performance-theme')));
  await toggle();await toggle();assert.deepStrictEqual(await fields(),formBefore,'Unsaved form values must survive');
  assert.deepStrictEqual(await page.evaluate(()=>Object.fromEntries(Object.entries(localStorage).filter(([key])=>key!=='hrdotnet-performance-theme'))),stored,'Theme must not write performance data');
  for(const width of [320,375,425,768,1024,1440]){
   await page.setViewportSize({width,height:844});
   await page.evaluate(()=>{urDirty=false;navigate('Dashboard')});
   const geometry=await page.locator('#pmsWorkspaceFrame').evaluate(el=>({width:el.clientWidth,scroll:el.scrollWidth,right:el.getBoundingClientRect().right}));
   assert(geometry.right<=width+1&&geometry.scroll<=geometry.width+2,`Workspace overflows at ${width}px`);
   const heading=await page.locator('#pmsPageHeader').boundingBox();
   await page.locator('main').evaluate(el=>el.scrollTop=el.scrollHeight);
   const after=await page.locator('#pmsPageHeader').boundingBox();assert.equal(Math.round(after.y),Math.round(heading.y),'Heading remains visible during content scrolling');
   assert(await page.locator('main').evaluate(el=>el.scrollTop+el.clientHeight>=el.scrollHeight-2),'Last content remains reachable');
  }
  assert.equal(errors.length,0,errors.join('\n'));
  console.log('PASS: menu placement, theme persistence, local font loading, all role/page field and content parity, unsaved form/data preservation, 6 widths and independent content scrolling');
 }finally{await browser.close()}
})().catch(error=>{console.error(error);process.exit(1)});
