const fs=require('fs'),vm=require('vm'),assert=require('assert');
const nodes={};const node=key=>nodes[key]??={innerHTML:'',textContent:'',value:'',style:{},attributes:{},addEventListener(){},setAttribute(k,v){this.attributes[k]=v},showModal(){},close(){},focus(){},scrollIntoView(){},setSelectionRange(){},querySelectorAll(){return []},reportValidity(){return true},insertAdjacentHTML(){},prepend(){}};
let fields={};const context={console,document:{querySelector:node,querySelectorAll(){return []},getElementById:node,addEventListener(){}},localStorage:{getItem(){return null},setItem(){}},structuredClone,Date,Math,URL,Blob,setTimeout(){},confirm(){return true},location:{reload(){}},addEventListener(){},scrollTo(){},FormData:class{get(k){return fields[k]??null}getAll(k){return []}}};context.window=context;vm.createContext(context);const run=x=>vm.runInContext(x,context);
for(const file of ['app.js','views.js','reviews.js','revisions.js','tables.js','dashboard.js'])run(fs.readFileSync('performance/dist/'+file,'utf8'));
const shell=fs.readFileSync('performance/dist/shell.js','utf8');run(shell.slice(shell.indexOf('/* Structured goal creation')));run('render=()=>{};pmsAccessiblePages=()=>[];pmsSidebarQuery="";pmsChevron=()=>"";pmsSplitPageHeader=()=>{}');
for(const file of ['evaluations.js','cycle-workflow.js','evaluation-results.js']){run(fs.readFileSync('performance/dist/'+file,'utf8').replace(/render\(\);\s*$/,''));run('render=()=>{};closeModal=()=>{}')}
run("viewRole='HR Administrator';var annual=urCycle('hr-annual-2026');var finished=urCycle('hr-completed-2026')");


run('urWizard=cwPrepareSetup(urClone(annual));urStep=4;UR.draftCycle=urClone(urWizard)');
const records=run('JSON.stringify([UR.cycles,UR.assignments,UR.goalTemplates,UR.templates,data.goals])');
let html=run('cwWorkflow(urWizard)');
for(const title of ['Stage 1 · Self-Assessment','Stage 2 · Managerial Assessment','Stage 3 · HR Assessment'])assert(html.includes(title));
assert(!html.includes('Stage Name'));assert(!html.includes('Assessment Type'));assert(!html.includes('cw-stage-actions'));assert(!html.includes('cwSetStage(0,\'type\''));
assert.equal((html.match(/class="cw-stage-content" type="text" disabled readonly/g)||[]).length,3);
assert.equal((html.match(/value="Goals Performance \+ Behavioral Performance"/g)||[]).length,3);
assert.equal((html.match(/3 employees · 3 assigned/g)||[]).length,3);
assert(!html.includes('class="cw-stage-assignments" open'));assert.equal((html.match(/>View Assignments/g)||[]).length,3);
run('urWizard.components.behavioral=false');assert(run('cwWorkflow(urWizard)').includes('value="Goals Performance"'));run('urWizard.components={goals:false,behavioral:true}');assert(run('cwWorkflow(urWizard)').includes('value="Behavioral Performance"'));run('urWizard.components={goals:true,behavioral:true}');
run('cwSetAssignmentsOpen(urWizard.stages[2].id,true)');assert(run('cwWorkflow(urWizard)').includes('class="cw-stage-assignments" open'));
const order=run('JSON.stringify(urWizard.stages)');run('cwMoveOptionalStage(0,1);cwRemoveOptionalStage(1)');assert.equal(run('JSON.stringify(urWizard.stages)'),order);
for(const category of ['Goals','Behavioral']){run(`pdCategory='${category}'`);const listing=run('urTemplateList()');assert(!listing.includes('urresumebar'));assert(!listing.includes('Resume cycle setup'));}
assert(!run('urCycleList()').includes('urresumebar'));assert(!run('urCycleList()').includes('saved setup in progress'));
assert.equal(run('JSON.stringify([UR.cycles,UR.assignments,UR.goalTemplates,UR.templates,data.goals])'),records);
run("urWizard.stages.push({id:'optional-feedback',name:'Peer Assessment',type:'Peer',deadline:'2026-11-20',reviewer:'',reviewers:{}});cwSetAssignmentsOpen('optional-feedback',true);cwSetStageReviewer('optional-feedback','EMP-001','EMP-003')");assert.equal(run("urWizard.stages.at(-1).reviewers['EMP-001']"),'EMP-003');assert(run("cwStageAssignmentsOpen.has('optional-feedback')"));
run("viewRole='Employee';cwSetStageReviewer('optional-feedback','EMP-001','EMP-002')");assert.equal(run("urWizard.stages.at(-1).reviewers['EMP-001']"),'EMP-003');run("viewRole='HR Administrator'");
run("for(let i=7;i<=31;i++){const e=[...data.employees[2]];e[0]='EMP-'+String(i).padStart(3,'0');e[1]='Employee '+i;data.employees.push(e)}urWizard.participants=data.employees.map(e=>e[0])");
html=run('cwStageAssignments(urWizard,urWizard.stages[0])');assert(html.includes('Showing 1–10 of 31 records'));assert(html.includes('Page 4'));
run("var key='cw-assignments-'+urWizard.stages[0].id;pmsTablePages[key]=2");html=run('cwStageAssignments(urWizard,urWizard.stages[0])');assert(html.includes('Showing 11–20 of 31 records'));assert(!html.includes('Select Maria Cruz'));
run('urSaveCycleDraft();var savedId=urWizard.id;urWizard=null;urStartWizard(savedId)');assert.equal(run('urStep'),4);assert.equal(run('urWizard.participants.length'),31);assert.equal(run("urWizard.stages.at(-1).reviewers['EMP-001']"),'EMP-003');assert.equal(run('cwStageAssignmentsOpen.size'),0);
run("UR.draftCycle={...urClone(urWizard),id:'orphan-saved-setup',name:'Preserved setup',savedStep:4};var count=UR.cycles.length;cwRestoreDraftListing();cwRestoreDraftListing()");assert.equal(run('UR.cycles.length'),run('count')+1);run("urStartWizard('orphan-saved-setup')");assert.equal(run('urStep'),4);
console.log('PASS compact stage cards; read-only shared components; collapsed paginated evaluator tables; protected core order; permitted manual assignment; draft recovery; banners removed without record deletion');
