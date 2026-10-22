const fs=require('fs'),vm=require('vm'),assert=require('assert');
const nodes={};const node=key=>nodes[key]??={innerHTML:'',textContent:'',value:'',style:{},attributes:{},addEventListener(){},setAttribute(k,v){this.attributes[k]=v},showModal(){},close(){},focus(){},scrollIntoView(){},setSelectionRange(){},querySelectorAll(){return []},reportValidity(){return true},insertAdjacentHTML(){},prepend(){}};
let fields={};const context={console,document:{querySelector:node,querySelectorAll(){return []},getElementById:node,addEventListener(){}},localStorage:{getItem(){return null},setItem(){}},structuredClone,Date,Math,URL,Blob,setTimeout(){},confirm(){return true},location:{reload(){}},addEventListener(){},scrollTo(){},FormData:class{get(k){return fields[k]??null}getAll(k){return []}}};context.window=context;vm.createContext(context);const run=x=>vm.runInContext(x,context);
for(const file of ['app.js','views.js','reviews.js','revisions.js','tables.js','dashboard.js'])run(fs.readFileSync('performance/dist/'+file,'utf8'));
const shell=fs.readFileSync('performance/dist/shell.js','utf8');run(shell.slice(shell.indexOf('/* Structured goal creation')));run('render=()=>{};pmsAccessiblePages=()=>[];pmsSidebarQuery="";pmsChevron=()=>"";pmsSplitPageHeader=()=>{}');
for(const file of ['evaluations.js','cycle-workflow.js','evaluation-results.js']){run(fs.readFileSync('performance/dist/'+file,'utf8').replace(/render\(\);\s*$/,''));run('render=()=>{};closeModal=()=>{}')}
run("viewRole='HR Administrator';var annual=urCycle('hr-annual-2026');var finished=urCycle('hr-completed-2026')");

const before=run('JSON.stringify([UR.cycles,UR.goalTemplates,UR.templates,UR.assignments,data.goals])');
assert(!run('urCycleList()').includes('Connected workflow sample'));
assert(!run('urReviewList()').includes('Completed Employee Evaluations'));
for(const tab of ['All Cycles','Draft','Active','Completed'])assert(run('urCycleList()').includes('>'+tab+'</button>'));
run("pmsSetCycleTab('All Cycles');urCycleFilter.status='Cancelled';urDrawCycles()");
assert(run('urCycleList()').includes('Cancelled'));
for(const category of ['Goals','Behavioral']){
 run(`pdCategory='${category}';pmsSetTemplateTab('All Templates')`);
 let html=run('urTemplateList()');for(const tab of ['All Templates','Draft','Published'])assert(html.includes('>'+tab+'</button>'));
 assert(html.indexOf('role="tablist"')<html.indexOf('class="toolbar'));
 assert(html.includes('Archived'));
 for(const tab of ['Draft','Published']){
  run(`pmsTablePages['${category==='Goals'?'pd-templates':'templates'}']=9;pmsSetTemplateTab('${tab}')`);
  assert.equal(run(`pmsTablePages['${category==='Goals'?'pd-templates':'templates'}']`),1);
  html=run('urTemplateList()');assert(!html.includes('aria-label="Status"'));
  if(category==='Goals')assert(!html.includes(tab==='Draft'?"pdViewGoalTemplate('":"pdEditGoalTemplate('"));
  else {run('urDrawTemplates()');const rows=nodes['#urTemplateRows'].innerHTML;const ids=[...rows.matchAll(/data-pms-id="([^"]+)"/g)].map(m=>m[1]);for(const id of ids)assert.equal(run(`UR.templates.find(t=>t.id==='${id}').status`),tab)}
 }
 run(category==='Goals'?"pdQuery='No matching template at all'":"urTemplateFilter='No matching template at all';urDrawTemplates()");
 assert(category==='Goals'?run('urTemplateList()').includes('Showing 0–0 of 0'):nodes['#pmsTemplateCount'].textContent==='Showing 0–0 of 0 records');
 run("pdQuery='';urTemplateFilter=''");
}
assert.equal(run('JSON.stringify([UR.cycles,UR.goalTemplates,UR.templates,UR.assignments,data.goals])'),before);
run("var sample=UR.assignments.find(a=>a.cycle==='hr-completed-2026'&&a.subject==='EMP-002');urFilter.view='Completed';pmsOpenRecord('review',sample.id)");
assert.equal(run('urResultCycle'),'hr-completed-2026');assert.equal(run('urResultSubject'),'EMP-002');assert.equal(run('urScreen'),'result');
run("urFilter.view='All Reviews';pmsOpenRecord('review',sample.id)");assert.equal(run('urScreen'),'review');
console.log('PASS listing tabs, combined filters, pagination reset, shortcut removal, preserved data and result routing');

