const assert=require('assert');
const {chromium}=require('playwright');
(async()=>{
 const browser=await chromium.launch({headless:true,channel:'chrome'});
 try{
  const page=await browser.newPage(),errors=[];page.on('pageerror',e=>errors.push(e.message));
  await page.goto(process.env.PMS_URL||'http://127.0.0.1:4180/');
  for(const width of [320,390,768,1440]){
   await page.setViewportSize({width,height:844});
   for(const role of ['Employee','Manager','HR Administrator']){
    await page.evaluate(role=>setRole(role),role);
    for(const destination of await page.evaluate(()=>roleNav().map(x=>x[0]))){
     await page.evaluate(name=>navigate(name),destination);
     const overflow=await page.locator('.shell').evaluate(el=>el.scrollWidth>el.clientWidth+2);
     assert(!overflow,`${role} ${destination}: shell overflow at ${width}px`);
    }
   }
  }
  await page.setViewportSize({width:390,height:844});
  await page.locator('#pmsMobileMenuButton').click();
  assert(await page.locator('#pmsMobileNavigation #nav').isVisible());
  await page.locator('#pmsMobileNavigation').getByRole('button',{name:'Dashboard',exact:true}).click();
  await page.locator('#pmsMobileNavigation').waitFor({state:'hidden'});
  await page.locator('aside #nav').waitFor({state:'attached'});
  await page.locator('#pmsMobileMenuButton').click();await page.keyboard.press('Escape');
  await page.locator('#pmsMobileNavigation').waitFor({state:'hidden'});
  await page.waitForFunction(()=>document.activeElement.id==='pmsMobileMenuButton');
  await page.locator('#pmsMobileMenuButton').click();
  await page.setViewportSize({width:1440,height:900});
  await page.locator('#pmsMobileNavigation').waitFor({state:'hidden'});
  await page.locator('aside #nav').waitFor({state:'visible'});
  await page.setViewportSize({width:390,height:844});
  for(const open of ['pdEditGoalTemplate()','pipUIEnroll()','urStartWizard(null,true)']){
   await page.evaluate(code=>{urDirty=false;eval(code)},open);
   assert(await page.locator('.shell').evaluate(el=>el.scrollWidth<=el.clientWidth+2),`${open}: form overflow`);
   assert(await page.locator('input:not([type=checkbox]):not([type=radio]),select,textarea').evaluateAll(elements=>elements.filter(e=>e.getBoundingClientRect().width>0).every(e=>parseFloat(getComputedStyle(e).fontSize)>=16)),'Mobile fields must avoid input zoom');
  }
  await page.evaluate(()=>{urDirty=false;closeModal();navigate('Reviews')});
  await page.waitForFunction(()=>[...document.querySelectorAll('.tablewrap')].some(el=>el.dataset.mobileScroll==='true'));
  const table=page.locator('.tablewrap[data-mobile-scroll=true]').first();
  assert.equal(await table.getAttribute('tabindex'),'0');
  await table.evaluate(el=>el.scrollLeft=120);assert(await table.evaluate(el=>el.scrollLeft>0));
  assert.equal(errors.length,0,errors.join('\n'));
  console.log('PASS: 4 viewport sizes, every role/page, drawer navigation and Escape, focus restoration, resize recovery, HR forms, input sizing and horizontal table scrolling');
 }finally{await browser.close()}
})().catch(error=>{console.error(error);process.exit(1)});
