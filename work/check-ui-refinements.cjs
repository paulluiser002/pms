const fs=require('fs'),vm=require('vm'),assert=require('assert');
const elements={};
function element(key){return elements[key]??={innerHTML:'',textContent:'',value:'',style:{},attributes:{},addEventListener(){},setAttribute(k,v){this.attributes[k]=v},showModal(){},close(){},focus(){},setSelectionRange(){},querySelectorAll(){return []},reportValidity(){return true}}}
let fields={};
const context={console,document:{querySelector:element,addEventListener(){}},localStorage:{getItem(){return null},setItem(){}},structuredClone,Date,Math,URL,Blob,setTimeout(){},confirm(){return true},location:{reload(){}},addEventListener(){},scrollTo(){},FormData:class{get(key){return fields[key]??null}getAll(key){return Array.isArray(fields[key])?fields[key]:[]}}};context.window=context;vm.createContext(context);const run=code=>vm.runInContext(code,context);
for(const file of ['app.js','views.js','reviews.js','revisions.js','tables.js','dashboard.js'])run(fs.readFileSync('performance/dist/'+file,'utf8'));

run("render=()=>{};viewRole='HR Administrator';urEditTemplate()");
const templatesBefore=run('UR.templates.length');
run("urEditor.name='Unsaved preview fixture';urEditor.questions[0].title='Communicates clearly';urDirty=true");
const snapshot=run('JSON.stringify(urEditor)');
assert(run('urBuilder()').includes('Publish Template'));assert(!run('urBuilder()').includes('urstickyfooter'));assert(!run('urBuilder()').includes('>Cancel<'));
run('urPreviewBuilder()');assert(run('urBuilder()').includes('<h1>Template Preview</h1>'));assert(run('urBuilder()').includes('Back to Builder'));assert(!run('urBuilder()').includes('Publish Template'));assert(!run('urBuilder()').includes('Save as Draft'));
run('urPreviewBuilder()');assert.equal(run('JSON.stringify(urEditor)'),snapshot);
run("urGoTab('Templates')");assert.equal(run('urScreen'),'builder');assert(element('#modal').innerHTML.includes('Leave without saving'));
run('urDirty=false;urPending()');assert.equal(run('urScreen'),'list');assert.equal(run('UR.templates.length'),templatesBefore);
run("pmsTablePage('qa',24,'same');pmsTablePages.qa=3");assert.equal(run("pmsTablePage('qa',4,'same')"),1);
run('pmsTablePages.qa=2');assert.equal(run("pmsTablePage('qa',24,'changed-filter')"),1);
assert(run("pmsGoalFoot('admin',[{}],1)").includes('Showing 1–1 of 1 records'));
assert(run("pmsPager('qa',1,'render')").includes('aria-current="page"'));assert(run("pmsPager('qa',1,'render')").includes('disabled'));
assert(run("pmsPager('qa',24,'render')").includes('Next page'));
assert(!run('goalsView()').includes('<th>ACTIONS</th>'));assert(run('goalsView()').includes('data-pms-record="goal"'));assert.equal(run('pmsPageSize'),10);run('pmsSetPageSize(20,()=>{})');assert.equal(run('pmsPageSize'),20);assert.equal(run('pmsTablePages.qa'),1);run('pmsSetPageSize(10,()=>{})');
run("viewRole='Employee';data.goals.push({id:999,employee:'Sofia Garcia',source:'self',createdBy:employeeId,progress:100})");assert(!run('pmsGoalActions(data.goals.at(-1))').includes('More actions'));
console.log('PASS: fixed builder actions; preview/back data preservation; unsaved-exit guard; no saved preview response; single/multiple-page footers; filter and invalid-page resets; authorized contextual actions.');

run("viewRole='HR Administrator';urDirty=false;urScreen='list'");
for(const fn of ['goalsView()','urTemplateList()','urCycleList()','urReviewList()','pmsEmployeesPage()'])assert(!run(fn).includes('<th>ACTIONS</th>'),fn);
run('urDrawTemplates()');assert(element('#urTemplateRows').innerHTML.includes('data-pms-record="template"'));assert(!element('#urTemplateRows').innerHTML.includes('More actions'));
run('urDrawCycles()');assert(element('#urCycleRows').innerHTML.includes('data-pms-record="cycle"'));
run('urDrawReviews()');assert(element('#urReviewRows').innerHTML.includes('data-pms-record="review"'));
run('pmsDrawEmployeeRows()');assert(element('#pmsEmployeeRows').innerHTML.includes('data-pms-record="employee"'));
run("viewProfile('EMP-001')");assert(element('#modal').innerHTML.includes('Reassign Manager'));
run("urViewTemplate(UR.templates[0].id)");const detail=run('urBuilder()');for(const label of ['Template Details','Edit','Preview','Duplicate','Archive'])assert(detail.includes(label));
console.log('PASS: all main listings omit action columns; record rows carry details targets; template and employee details retain authorized actions.');

run("viewRole='HR Administrator';pmsPageSize=10;pmsTablePages.qa=1");
assert.equal(run('JSON.stringify(pmsPageNumbers(1,4))'),'[1,2,3,4]');
assert.equal(run('JSON.stringify(pmsPageNumbers(50,100))'),'[1,"…",49,50,51,"…",100]');
assert.equal(run('JSON.stringify(pmsPageNumbers(100,100))'),'[1,"…",97,98,99,100]');
assert(!run("pmsPager('qa',40,'render')").includes('Page 1 of'));
assert(run("pmsPager('qa',40,'render')").includes("pmsTablePages['qa']=4;render()"));
const single=run("pmsPager('qa',1,'render')");assert(single.includes('aria-label="Page 1"'));assert.equal((single.match(/disabled/g)||[]).length,2);
element('#modal .modalhead>div').insertAdjacentHTML=()=>{};
run('pmsViewGoal(scopedGoals()[0].id)');const goalDetail=element('#modal').innerHTML;assert(!goalDetail.includes('>Add Milestone</button>'));assert(goalDetail.includes('>Edit Goal</button>'));assert(goalDetail.includes('>Close</button>'));
console.log('PASS: numbered pages and direct targets; large-page ellipses; single-page disabled navigation; Goal Details footer contains only Close and authorized Edit Goal.');
