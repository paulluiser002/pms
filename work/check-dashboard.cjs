const fs=require('fs'),vm=require('vm'),assert=require('assert');
const els={};function element(s){return els[s]??={innerHTML:'',textContent:'',value:'',style:{},attributes:{},querySelectorAll(){return []},setAttribute(k,v){this.attributes[k]=v},showModal(){},close(){},focus(){},setSelectionRange(){},scrollIntoView(){}}}
const context={console,document:{querySelector:element},localStorage:{getItem(){return null},setItem(){}},structuredClone,Date,Math,URL,Blob,setTimeout(){},confirm(){return true},location:{reload(){}},addEventListener(){},scrollTo(){}};context.window=context;vm.createContext(context);const run=code=>vm.runInContext(code,context);
for(const file of ['app.js','views.js','reviews.js','revisions.js','tables.js','dashboard.js'])run(fs.readFileSync('performance/dist/'+file,'utf8'));
for(const [role,labels,panels] of [
  ['HR Administrator',['Total Review Assignments','Review Completion Rate','Pending Reviews','Average Goal Progress'],['Review Status','Goal Progress by Department','Review Completion by Department','Next Actions and Upcoming Deadlines']],
  ['Manager',['Team Members','Pending Evaluations','Average Team Goal Progress','Overdue Goals'],['Team Goal Progress','Team Review Status','Pending Evaluations','Next Actions']],
  ['Employee',['My Goals','Average Goal Progress','Pending Reviews','Completed Reviews'],['My Goal Progress','My Pending Reviews','Upcoming Goal Deadlines','Next Actions']]
]){
  run(`pmsSelectRole('${role}');pmsDashboardCycle='all';render()`);
  assert.equal(run('page'),'Dashboard');
  assert.equal(run('pmsDashboardFilters.period'),'This Quarter');
  assert(!element('#content').innerHTML.includes('pms-dash-scope'));
  assert(!element('#content').innerHTML.includes('pms-dash-definition'));
  assert.equal(element('#content').innerHTML.includes('Dashboard review cycle'),role!=='Employee');
  assert.equal(element('#content').innerHTML.includes('aria-label="Department"'),role==='HR Administrator');
  const config=run('pmsDashboardConfig(pmsDashboardData())');
  assert.deepEqual(Array.from(config.metrics,m=>m[0]),labels);assert.deepEqual(Array.from(config.panels,p=>p[0]),panels);
  const d=run('pmsDashboardData()');
  assert(d.pending.every(a=>['Not Started','In Progress'].includes(a.state)));assert(d.completed.every(a=>a.state==='Completed'));
  assert(!element('#content').innerHTML.includes('Live sample data'));
  if(role==='Employee'){
    assert(d.reviews.every(a=>a.reviewer==='EMP-003'));assert(d.goals.every(g=>g.employee==='Sofia Garcia'));
    assert(!element('#content').innerHTML.includes('Department'));assert(!element('#content').innerHTML.includes('Average Performance Rating'));
  }
  if(role==='Manager'){assert(d.employees.every(e=>run(`pmsManagerName('${e[0]}')`)==='Angela Reyes'));assert(d.mine.every(a=>a.reviewer==='MGR-001'))}
  run("pmsDashboardFilters.period='This Year';render()");const goals=run('pmsDashboardData().goals.length');run("pmsDashboardCycle='unified-midyear';render()");assert.equal(run('pmsDashboardData().goals.length'),goals);if(role!=='Employee'){assert.equal(run('pmsDashboardData().pending.length'),0);assert(run("pmsDashboardData().reviews.every(a=>a.cycle==='unified-midyear')"));}
}
run("pmsSelectRole('Employee');pmsDashboardFilters.period='This Year';pmsDashboardCycle='all';const submittedTest=UR.assignments.find(a=>a.reviewer==='EMP-003'&&urCycle(a.cycle).status==='Active');submittedTest.state='In Progress'");const before=run('pmsDashboardData().mine.length');const completed=run('pmsDashboardData().completed.length');run("submittedTest.state='Submitted'");assert.equal(run('pmsDashboardData().mine.length'),before-1);assert.equal(run('pmsDashboardData().completed.length'),completed);
run("pmsDashboardOpenReviews('mine','Completed')");assert.equal(run('page'),'Reviews');assert.equal(run('urFilter.view'),'My Reviews');assert.equal(run('urFilter.status'),'Completed');assert(!element('#content').innerHTML.includes('pms-dash-stat'));
run("navigate('Dashboard');pmsDashboardLoading=true;render()");assert(element('#content').innerHTML.includes('aria-busy="true"'));run('pmsDashboardLoading=false');
run("pmsSelectRole('HR Administrator');pmsDashboardFilters.period='This Quarter';render()");
assert.equal(run('pmsDashboardRange().start'),'2026-10-01');assert.equal(run('pmsDashboardRange().end'),'2026-12-31');
assert(run("pmsDashboardData().reviews.every(a=>pmsDashboardCycleMatches(urCycle(a.cycle)))"));assert(!run("pmsDashboardData().reviews.some(a=>a.cycle==='unified-q4')"),'Q4-named cycle evaluates Q3 and must follow evaluation dates, not submission dates');
const quarterGoals=run('pmsDashboardData().goals.length');run("pmsDashboardCycle='unified-q4';render()");assert.equal(run('pmsDashboardData().reviews.length'),0);assert.equal(run('pmsDashboardData().goals.length'),quarterGoals);
run("pmsDashboardFilters.period='This Year';pmsDashboardFilters.department='Marketing';pmsDashboardCycle='all';render()");assert(run("pmsDashboardData().employees.every(e=>e[3]==='Marketing')"));assert(run("pmsDashboardData().goals.every(g=>urPerson(pmsGoalOwner(g)).department==='Marketing')"));assert(run("pmsDashboardData().reviews.every(a=>urPerson(a.subject).department==='Marketing')"));
run("pmsDashboardCycle='unified-q4';render()");assert.equal(run('pmsDashboardData().reviews.length'),4);assert.equal(run('pmsDashboardData().goals.length'),3);
run("pmsDashboardSetFilter('period','Custom Date Range');pmsDashboardFilters.start='2026-10-01';pmsDashboardFilters.end='2026-10-31';pmsDashboardCycle='all';render()");assert(element('#content').innerHTML.includes('Dashboard start date'));assert(run("pmsDashboardGoalMatches({startDate:'2026-09-01',due:'2026-11-01'})"));assert(!run("pmsDashboardGoalMatches({startDate:'2026-09-01',due:'2026-09-30'})"));
run("pmsDashboardFilters.end='2026-09-30';render()");assert(element('#content').innerHTML.includes('role="alert"'));assert(!element('#content').innerHTML.includes('pms-dash-stats'));
run("pmsSelectRole('Manager')");assert.equal(run('pmsDashboardFilters.period'),'This Quarter');assert.equal(run('pmsDashboardFilters.department'),'All Departments');assert.equal(run('pmsDashboardCycle'),'all');
run("pmsDashboardFilters.department='Marketing';pmsSelectRole('Employee')");assert.equal(run('pmsDashboardFilters.department'),'All Departments');assert(!element('#content').innerHTML.includes('Dashboard review cycle'));
const shell=fs.readFileSync('performance/dist/index.html','utf8');assert(!shell.includes('<footer>'));assert(!shell.includes('browser-local demo'));
run("data.goals=[];UR.assignments=[];render()");assert(element('#content').innerHTML.includes('No goal data available.'));assert(element('#content').innerHTML.includes('no reviews awaiting your response'));assert.equal(run('pmsDashboardData().average'),null);
console.log('PASS: role dashboards; period and combined department/cycle filters; evaluation vs submission dates; goal interval boundaries; role reset; custom date validation; pending/finalized states; footer cleanup; loading and empty states.');
