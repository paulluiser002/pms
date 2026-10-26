const fs=require('fs'),vm=require('vm'),assert=require('assert');
const nodes={};const node=key=>nodes[key]??={innerHTML:'',textContent:'',value:'',style:{},attributes:{},addEventListener(){},setAttribute(k,v){this.attributes[k]=v},showModal(){},close(){},focus(){},scrollIntoView(){},setSelectionRange(){},querySelectorAll(){return []},reportValidity(){return true},insertAdjacentHTML(){},prepend(){}};
let fields={};const context={console,document:{querySelector:node,querySelectorAll(){return []},getElementById:node,addEventListener(){}},localStorage:{getItem(){return null},setItem(){}},structuredClone,Date,Math,URL,Blob,setTimeout(){},confirm(){return true},location:{reload(){}},addEventListener(){},scrollTo(){},FormData:class{get(k){return fields[k]??null}getAll(k){return []}}};context.window=context;vm.createContext(context);const run=x=>vm.runInContext(x,context);
for(const file of ['app.js','views.js','reviews.js','revisions.js','tables.js','dashboard.js'])run(fs.readFileSync('performance/dist/'+file,'utf8').replace("const employeeId='EMP-003', managerName=","const employeeId='EMP-003';let managerName="));
const shell=fs.readFileSync('performance/dist/shell.js','utf8');run(shell.slice(shell.indexOf('/* Structured goal creation')));run('render=()=>{};pmsAccessiblePages=()=>[];pmsSidebarQuery="";pmsChevron=()=>"";pmsSplitPageHeader=()=>{}');
for(const file of ['evaluations.js','cycle-workflow.js']){run(fs.readFileSync('performance/dist/'+file,'utf8').replace(/render\(\);\s*$/,''));run('render=()=>{};closeModal=()=>{}')}

for(const file of ['evaluation-results.js','position-goals.js']){run(fs.readFileSync('performance/dist/'+file,'utf8').replace("const employeeId='EMP-003', managerName=","const employeeId='EMP-003';let managerName="));run('render=()=>{};closeModal=()=>{}')}

let failures=0;
function test(name,fn){try{fn();console.log('PASS:',name)}catch(e){failures++;console.error('FAIL:',name,e.message)}}
run("viewRole='HR Administrator';var c=urClone(urCycle('position-accomplishments-2026'));c.id='gap-test';UR.cycles.push(c);cwGenerate(c);var rec=pgRecord(c,'EMP-003');var mgr=urCycleAssignments(c).find(a=>a.subject==='EMP-003'&&a.type==='Manager');mgr.state='In Progress';rec.state='Submitted';var originalUser=urUser");
test('current manager verifies after reassignment while started evaluator stays frozen',()=>{
 run("pmsAssignmentDraft={employees:['EMP-003'],manager:'EMP-004',effective:urToday};pmsSaveAssignment();viewRole='Manager';urUser=()=> 'EMP-004';managerName=urPerson('EMP-004').name;pgCycle=c.id;pgSubject='EMP-003'");
 assert.equal(run('mgr.reviewer'),'MGR-001');assert(run('pgCanVerify(c,rec)'));assert(run('pgGoalsPage()').includes('Verify Accomplishments'));run("pgVerification('Verified',true)");assert.equal(run('rec.state'),'Verified');assert.equal(run('cwManagerBlock(mgr).length'),0);run("rec.state='Submitted'");
 run("urUser=()=> 'MGR-001';managerName=urPerson('MGR-001').name");assert(!run('pgCanVerify(c,rec)'));run("viewRole='HR Administrator';urUser=originalUser");assert(!run('pgCanVerify(c,rec)'));
});
test('scheduled behavior uses frozen participant template after position changes',()=>{
 run("var frozen=urClone(c);frozen.id='frozen-gap';frozen.participants=['EMP-003'];frozen.status='Scheduled';cwFreezeBehavior(frozen);var expected=frozen.behaviorByEmployee['EMP-003'].questions[0].title;UR.cycles.push(frozen);data.employees.find(e=>e[0]==='EMP-003')[2]='Changed position';UR.templates.find(t=>t.id===frozen.behavioralTemplate).questions[0].title='Changed live question';cwGenerate(frozen)");
 assert.equal(run('urCycleAssignments(frozen)[0].template.questions[0].title'),run('expected'));
});
test('legacy scheduled snapshots resolve from frozen employee position and block missing evidence',()=>{
 run("var legacy=urClone(c);legacy.id='legacy-gap';legacy.participants=['EMP-003'];legacy.status='Scheduled';delete legacy.behaviorByEmployee;legacy.behaviorSnapshots={[legacy.performanceRecords['EMP-003'].employee.position]:{id:'legacy-frozen',questions:[],sections:[]}};UR.cycles.push(legacy);cwGenerate(legacy)");assert.equal(run('urCycleAssignments(legacy)[0].template.id'),'legacy-frozen');
 run("var missing=urClone(legacy);missing.id='missing-gap';delete missing.behaviorByEmployee;missing.behaviorSnapshots={};UR.cycles.push(missing);cwGenerate(missing)");assert.equal(run('urCycleAssignments(missing).length'),0);assert(run('missing.generationErrors.length>0'));
});
test('returned accomplishment submissions preserve immutable values and correction reasons',()=>{
 run("viewRole='Employee';pgCycle=c.id;c.periodEnd=urToday;rec.state='Draft';pgDraft={key:rec.id,values:urClone(rec.values)};rec.template.indicators.forEach(x=>pgDraft.values[x.id]={actual:111,remarks:'Original evidence'});pgSave(true,true);rec.state='Returned';rec.reason='Correct supporting evidence';pgDraft={key:rec.id,values:urClone(rec.values)};rec.template.indicators.forEach(x=>pgDraft.values[x.id]={actual:222,remarks:'Corrected evidence'});pgSave(true,true)");
 assert.equal(run('rec.submissions.length'),2);assert.equal(run('Object.values(rec.submissions[0].values)[0].actual'),111);assert.equal(run('rec.submissions[1].correctionReason'),'Correct supporting evidence');run("rec.values[rec.template.indicators[0].id].actual=999");assert.equal(run('Object.values(rec.submissions[1].values)[0].actual'),222);
 assert(run('pgGoalsPage()').includes('Original evidence'));run("viewRole='HR Administrator';c.released=true");assert(run('hrResultsGoals(c,hrResultData(c,rec.employee.id))').includes('Corrected evidence'));
});
test('legacy submission migration preserves only the known latest version and is idempotent',()=>{
 run("var old={...urClone(rec),submissions:undefined,submittedValues:{legacy:{actual:7,remarks:'Known latest'}},submittedAt:'2026-10-10T00:00:00Z'};pgMigrateSubmissions(old);pgMigrateSubmissions(old)");assert.equal(run('old.submissions.length'),1);assert.equal(run('old.submissions[0].values.legacy.actual'),7);assert(run('old.submissions[0].legacy'));
 run("viewRole='Employee';var alien=urClone(c);alien.participants=['EMP-006']");assert.equal(run('pgSubmissionHistory(alien,rec)'), '');
});
test('scheduling freezes the selected behavior for each employee through actual commit',()=>{
 run("viewRole='HR Administrator';data.employees.find(e=>e[0]==='EMP-003')[2]=rec.employee.position;urWizard=cwPrepareSetup(urClone(c));urWizard.id='schedule-commit-gap';urWizard.status='Draft';urWizard.participants=['EMP-003'];urWizard.start='2026-10-20';urWizard.periodEnd=urToday;urWizard.accomplishmentDeadline='2026-10-26';urWizard.verificationDeadline='2026-11-02';urWizard.stages.forEach((s,i)=>s.deadline=['2026-10-26','2026-11-02','2026-11-09'][i]);urCommitCycle('Scheduled')");
 assert.equal(run("urCycle('schedule-commit-gap')?.status"),'Scheduled');
 run("var scheduled=urCycle('schedule-commit-gap');var scheduledQuestion=scheduled.behaviorByEmployee['EMP-003'].questions[0].title;data.employees.find(e=>e[0]==='EMP-003')[2]='Another position';UR.templates.find(t=>t.id===scheduled.behavioralTemplate).questions[0].title='Live edits after scheduling';cwGenerate(scheduled)");
 assert.equal(run('urCycleAssignments(scheduled)[0].template.questions[0].title'),run('scheduledQuestion'));
});
test('retained evaluator reads only assigned cycle evidence after manager transfer',()=>{
 run("viewRole='Manager';urUser=()=> 'MGR-001';managerName=urPerson('MGR-001').name;c.released=false;mgr.state='In Progress';var employeeActual=JSON.stringify(rec.values);pgFromAssessment(c.id,'EMP-003',mgr.id)");
 assert.equal(run('pgCycle'),run('c.id'));assert.equal(run('pgSubject'),'EMP-003');assert(run('pgGoalsPage()').includes('Original evidence'));assert(run('pgGoalsPage()').includes('Corrected evidence'));assert(run('pgSubmissionHistory(c,rec)').includes('Original evidence'));assert(run('cwGoalsPanel(c,rec.employee.id)').includes('View Accomplishments'));
 assert(!run('pgCanVerify(c,rec)'));assert(!run('pgCanEdit(c,rec)'));assert(!run('urTeam(rec.employee.id)'));assert(!run('pdCanJournal(rec.employee.id)'));
 run("pgDraft={key:rec.id,values:urClone(rec.values)};pgDraft.values[rec.template.indicators[0].id].actual=444;pgSave(true,true)");assert.equal(run('JSON.stringify(rec.values)'),run('employeeActual'));
 run("var unrelated=urClone(c);unrelated.id='unrelated-evidence';UR.cycles.push(unrelated)");assert(!run('pgCanReadEvidence(unrelated,rec.employee.id)'));assert.equal(run('pgSubmissionHistory(unrelated,rec)'),'');
 run("var companyCheck=pmsGoalEmployeeInCompany;pmsGoalEmployeeInCompany=()=>false");assert(!run('pgCanReadEvidence(c,rec.employee.id)'));run("pmsGoalEmployeeInCompany=companyCheck;viewRole='HR Administrator';urUser=originalUser");
});
process.exitCode=failures?1:0;
