const fs=require('fs'),vm=require('vm'),assert=require('assert');
const nodes={};const node=key=>nodes[key]??={innerHTML:'',textContent:'',value:'',style:{},attributes:{},addEventListener(){},setAttribute(k,v){this.attributes[k]=v},showModal(){},close(){},focus(){},scrollIntoView(){},setSelectionRange(){},querySelectorAll(){return []},reportValidity(){return true},insertAdjacentHTML(){},prepend(){}};
let fields={};const context={console,document:{querySelector:node,querySelectorAll(){return []},getElementById:node,addEventListener(){}},localStorage:{getItem(){return null},setItem(){}},structuredClone,Date,Math,URL,Blob,setTimeout(){},confirm(){return true},location:{reload(){}},addEventListener(){},scrollTo(){},FormData:class{get(k){return fields[k]??null}getAll(k){return []}}};context.window=context;vm.createContext(context);const run=x=>vm.runInContext(x,context);
for(const file of ['app.js','views.js','reviews.js','revisions.js','tables.js','dashboard.js'])run(fs.readFileSync('performance/dist/'+file,'utf8'));
const shell=fs.readFileSync('performance/dist/shell.js','utf8');run(shell.slice(shell.indexOf('/* Structured goal creation')));run('render=()=>{};pmsAccessiblePages=()=>[];pmsSidebarQuery="";pmsChevron=()=>"";pmsSplitPageHeader=()=>{}');
for(const file of ['evaluations.js','cycle-workflow.js']){run(fs.readFileSync('performance/dist/'+file,'utf8').replace(/render\(\);\s*$/,''));run('render=()=>{};closeModal=()=>{}')}

// Exercise every original completed fixture plus additional historical records from all directory positions.
run(`viewRole='HR Administrator';var extra=urClone(urCycle('unified-midyear'));extra.id='demo-all-positions';extra.name='Historical team evaluation';extra.participants=data.employees.map(e=>e[0]);extra.periodStart='2025-01-01';extra.periodEnd='2025-06-30';extra.start='2025-07-01';extra.deadline='2025-07-31';UR.cycles.push(extra);for(const id of extra.participants){const a=urClone(UR.assignments.find(a=>a.cycle==='unified-midyear'&&a.type==='Manager'));a.id='historic-'+id;a.cycle=extra.id;a.subject=id;a.reviewer=urSupervisor(id);a.submitted='2025-07-25';UR.assignments.push(a)}`);
run(`var originalResponses=JSON.stringify(UR.assignments.map(a=>({id:a.id,answers:a.answers,feedback:a.feedback,submitted:a.submitted,state:a.state,template:a.template})));var activeGoals=JSON.stringify(data.goals);`);
run(fs.readFileSync('performance/dist/evaluation-results.js','utf8').replace(/render\(\);\s*$/,''));run('render=()=>{};closeModal=()=>{}');
assert.equal(run("JSON.stringify(UR.assignments.filter(a=>!a.demoData&&a.cycle!=='hr-completed-2026').map(a=>({id:a.id,answers:a.answers,feedback:a.feedback,submitted:a.submitted,state:a.state,template:a.template})))"),run('originalResponses'));
const evaluations=run('UR.completedGoalDemoMigration.evaluations');assert(evaluations.length>=12);
for(const {cycle,subject} of evaluations){
 run(`var c=urCycle('${cycle}');urResultCycle=c.id;urResultSubject='${subject}'`);
 const r=run(`hrResultData(c,'${subject}')`),html=run('urEmployeeResults()');
 assert.equal(r.goals.length,3);assert(r.hasGoals&&r.hasBehavior);assert(Number.isFinite(r.goalScore)&&Number.isFinite(r.behaviorScore));
 assert(!html.includes('Not available'));assert(!html.includes('was not configured'));assert(!html.includes('links were not recorded'));
 for(const row of r.goals){assert.equal(row.verification,'Verified');assert(row.verificationRecord.by);assert(row.verificationRecord.at);assert(row.milestones);assert.equal(row.goalScore,row.actual>=row.target?row.scoreMet:row.scoreBelow);assert(html.includes(row.name));}
 assert(Math.abs(r.overall-(r.goalScore*r.weights.goals+r.behaviorScore*r.weights.behavioral)/100)<1e-10);
 assert(run(`cwGoalTemplate(c,'${subject}').position===urPerson('${subject}').position`));
 assert(run(`cwLinks(c,'${subject}').every(l=>cwAssigned(cwGoal(l),'${subject}')&&cwGoal(l).due>=c.periodStart&&cwGoal(l).due<=c.periodEnd)`));
 assert.equal(run(`pdDimensionResults(c,'${subject}').goalScore`),r.goalScore);
 const a=run(`urCycleAssignments(c).find(a=>a.subject==='${subject}')`);assert.equal(run(`urMean(UR.assignments.find(a=>a.id==='${a.id}'))`),r.overall);
 if(cycle==='demo-all-positions')assert(run(`cwLinks(c,'${subject}').every(l=>cwGoal(l).demoData&&cwGoal(l).due==='2025-06-30')`));
}
run(`var fixedCycle=urCycle('unified-midyear'),fixedSubject='EMP-001';var frozenBefore=JSON.stringify(hrResultData(fixedCycle,fixedSubject));var currentGoal=cwGoal(cwLinks(fixedCycle,fixedSubject)[0]);currentGoal.progress=0;currentGoal.name='Later goal rename';currentGoal.evaluationActuals[fixedCycle.id].value=0;cwGoalTemplate(fixedCycle,fixedSubject).indicators[0].scoreMet=1;`);
assert.equal(run('JSON.stringify(hrResultData(fixedCycle,fixedSubject))'),run('frozenBefore'));
const count=run('data.goals.length');run('hrMigrateCompletedDemoGoals()');assert.equal(run('data.goals.length'),count);
run(`var future=cwNewCycle();future.id='future-behavior-only';future.name='Future behavioral-only evaluation';future.participants=['EMP-003'];future.components={goals:false,behavioral:true};future.behavioralTemplate='hr-core-behaviors-v2';future.scoring.behavioral='average';future.status='Completed';future.released=true;UR.cycles.push(future);cwGenerate(future);for(const a of urCycleAssignments(future)){a.state='Completed';a.answers=Object.fromEntries(a.template.questions.map(q=>[q.id,q.type==='Rating'?'4':'Future feedback']))}hrMigrateCompletedDemoGoals();urResultCycle=future.id;urResultSubject='EMP-003';`);
assert.equal(run('data.goals.length'),count);assert(!run('hrResultData(future,\'EMP-003\').hasGoals'));assert(run('urEmployeeResults()').includes('was not configured'));
console.log('PASS: '+evaluations.length+' completed demo evaluations opened; actual assigned goals, compatible published templates, verified historical snapshots, both performance scores, correct consolidated ratings, preserved assessment responses and feedback.');
console.log('PASS: historical period isolation; goal/template changes do not alter finalized results; summaries agree; migration is idempotent; future behavior-only cycles remain unpopulated.');
console.log(JSON.stringify(evaluations));
