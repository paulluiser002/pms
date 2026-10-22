const fs=require('fs'),vm=require('vm'),assert=require('assert');
const nodes={};const node=key=>nodes[key]??={innerHTML:'',textContent:'',value:'',style:{},attributes:{},addEventListener(){},setAttribute(k,v){this.attributes[k]=v},showModal(){},close(){},focus(){},scrollIntoView(){},setSelectionRange(){},querySelectorAll(){return []},reportValidity(){return true},insertAdjacentHTML(){},prepend(){}};
let fields={};const context={console,document:{querySelector:node,querySelectorAll(){return []},getElementById:node,addEventListener(){}},localStorage:{getItem(){return null},setItem(){}},structuredClone,Date,Math,URL,Blob,setTimeout(){},confirm(){return true},location:{reload(){}},addEventListener(){},scrollTo(){},FormData:class{get(k){return fields[k]??null}getAll(k){return []}}};context.window=context;vm.createContext(context);const run=x=>vm.runInContext(x,context);
for(const file of ['app.js','views.js','reviews.js','revisions.js','tables.js','dashboard.js'])run(fs.readFileSync('performance/dist/'+file,'utf8'));
const shell=fs.readFileSync('performance/dist/shell.js','utf8');run(shell.slice(shell.indexOf('/* Structured goal creation')));run('render=()=>{};pmsAccessiblePages=()=>[];pmsSidebarQuery="";pmsChevron=()=>"";pmsSplitPageHeader=()=>{}');
for(const file of ['evaluations.js','cycle-workflow.js','evaluation-results.js']){run(fs.readFileSync('performance/dist/'+file,'utf8').replace(/render\(\);\s*$/,''));run('render=()=>{};closeModal=()=>{}')}
run("viewRole='HR Administrator';var annual=urCycle('hr-annual-2026');var finished=urCycle('hr-completed-2026')");
assert.equal(run('cwLaunchErrors(annual).length'),0);
run("annual.type='360° Feedback'");assert.equal(run('cwLaunchErrors(annual).length'),0);run("annual.type='Standard Performance Review'");
const scores=[];
for(const id of ['EMP-001','EMP-002','EMP-003']){
 assert.equal(run(`cwLinks(annual,'${id}').length`),3);assert.equal(run(`cwLinks(finished,'${id}').length`),3);
 assert(run(`cwLinks(annual,'${id}').every(l=>cwLinks(finished,'${id}').some(r=>r.goalId===l.goalId))`));
 assert(run(`cwLinks(annual,'${id}').every(l=>cwAssigned(cwGoal(l),'${id}'))`));
 assert(run(`cwEligibleGoalsTemplates('${id}').every(t=>t.position===cwPosition('${id}'))`));
 run(`urResultCycle=finished.id;urResultSubject='${id}'`);const html=run('urEmployeeResults()');
 let last=-1;for(const title of ['Employee & Evaluation Overview','Performance Overview','Goals Performance</h2>','Behavioral Performance</h2>','Assessment Summary','Overall Performance Summary','Written Feedback</h2>']){const index=html.indexOf(title);assert(index>last,title);last=index}
 assert(!html.includes('Aggregated 360'));assert(!html.includes('<th scope="col">Peer'));assert(html.includes('Verified'));assert(html.includes('Strengths'));
 const result=run(`hrResultData(finished,'${id}')`);assert.equal(result.goals.length,3);assert(result.groups.every(g=>g.rows.length===1));assert(result.goals.every(g=>g.verification==='Verified'));
 assert(Math.abs(result.overall-(result.goalScore*.6+result.behaviorScore*.4))<1e-10);scores.push(result.overall);
 assert(run(`cwLinks(finished,'${id}').every(l=>!cwGoal(l).milestones.length||Math.round(pmsGoalMilestones(cwGoal(l)).filter(m=>m.done).length/pmsGoalMilestones(cwGoal(l)).length*100)===cwGoal(l).progress)`));
}
assert.equal(new Set(scores).size,3);
const goalsBefore=run('data.goals.length');run("urWizard=cwNewCycle();urWizard.name='Three employee launch';urWizard.behavioralTemplate='hr-core-behaviors-v2';urWizard.scoring={goals:'manager-verified',behavioral:'average'}");
for(const id of ['EMP-001','EMP-002','EMP-003'])run(`cwToggleParticipant('${id}',true)`);
assert.equal(run('cwLaunchErrors(urWizard).length'),0);
for(const id of ['EMP-001','EMP-002','EMP-003']){run(`cwAssignGoals('${id}')`);assert(run("cwAssignment.rows.every(r=>r.goalId!=='new')"));run('cwSaveAssignment()')}
assert.equal(run('data.goals.length'),goalsBefore);
run("var launchId=urWizard.id;urCommitCycle('Active')");assert.equal(run('UR.assignments.filter(a=>a.cycle===launchId).length'),9);assert.equal(run('UR.assignments.filter(a=>a.cycle===launchId&&pdUnlocked(a)).length'),3);assert.equal(run('data.goals.length'),goalsBefore);
run("viewRole='Employee';urResultCycle=finished.id;urResultSubject='EMP-001'");assert(run('urEmployeeResults()').includes('Results unavailable'));run("urResultSubject='EMP-003'");assert(run('urEmployeeResults()').includes('Employee Evaluation Results'));assert(!run('urEmployeeResults()').includes('View 202 File'));
run("viewRole='HR Administrator';urResultCycle='unified-midyear';urResultSubject='EMP-001'");assert(run('urEmployeeResults()').includes('Employee Evaluation Results'));
const count=run('data.goals.length');run('hrSampleData()');assert.equal(run('data.goals.length'),count);
console.log('PASS: three position-compatible published templates; nine shared assigned goals; milestones/progress preserved; verified finalized results; distinct calculated overall ratings; exact results section order; confidential access; legacy results; idempotent sample migration.');
console.log('PASS: all three employees selected, existing goals reused during assignment, full launch creates nine assessments with only three initially unlocked and no goal duplicates.');

assert.equal(run('urRating(4.505)'), '4.51 / 5');run("viewRole='HR Administrator';urResultCycle='pd-completed';urResultSubject='EMP-001'");assert(run('urEmployeeResults()').includes(run("hrScore(hrResultData(urCycle('pd-completed'),'EMP-001').overall)")));
