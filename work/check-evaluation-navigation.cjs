const fs=require('fs'),vm=require('vm'),assert=require('assert');
const nodes={};const node=key=>nodes[key]??={innerHTML:'',textContent:'',value:'',style:{},attributes:{},addEventListener(){},setAttribute(k,v){this.attributes[k]=v},showModal(){},close(){},focus(){},scrollIntoView(){},setSelectionRange(){},querySelectorAll(){return []},reportValidity(){return true},insertAdjacentHTML(){},prepend(){}};
let fields={};const context={console,document:{querySelector:node,querySelectorAll(){return []},getElementById:node,addEventListener(){}},localStorage:{getItem(){return null},setItem(){}},structuredClone,Date,Math,URL,Blob,setTimeout(){},confirm(){return true},location:{reload(){}},addEventListener(){},scrollTo(){},FormData:class{get(k){return fields[k]??null}getAll(k){return []}}};context.window=context;vm.createContext(context);const run=x=>vm.runInContext(x,context);
for(const file of ['app.js','views.js','reviews.js','revisions.js','tables.js','dashboard.js'])run(fs.readFileSync('performance/dist/'+file,'utf8'));
const shell=fs.readFileSync('performance/dist/shell.js','utf8');run(shell.slice(shell.indexOf('/* Structured goal creation')));run('render=()=>{};pmsAccessiblePages=()=>[];pmsSidebarQuery="";pmsChevron=()=>"";pmsSplitPageHeader=()=>{}');
for(const file of ['evaluations.js','cycle-workflow.js','evaluation-results.js']){run(fs.readFileSync('performance/dist/'+file,'utf8').replace(/render\(\);\s*$/,''));run('render=()=>{};closeModal=()=>{}')}

run("viewRole='HR Administrator';var resultCycle=urCycle('hr-completed-2026');var mainNode=document.querySelector('main')");
function openResult(id,cycle='hr-completed-2026'){run(`urDirty=false;urOpenResult('${cycle}','${id}');mainNode.scrollTop=825;urFilter.q='kept filter'`)}
for(const subject of ['EMP-001','EMP-002']){
 openResult(subject);run(`hrOpenEvaluationJournal('${subject}')`);
 assert.equal(run('page'),'202 Files');assert.equal(run('pdEmployee'),subject);assert(run('pdJournalPage()').includes('Back to Evaluation Results'));assert.equal(run('hrEvaluationReturn.evaluationRecordId'),'hr-completed-2026|'+subject);
 run('hrReturnToEvaluation();hrRestoreEvaluationScroll()');assert.equal(run('page'),'Reviews');assert.equal(run('urScreen'),'result');assert.equal(run('urResultSubject'),subject);assert.equal(run('urResultCycle'),'hr-completed-2026');assert.equal(run('mainNode.scrollTop'),825);assert.equal(run('urFilter.q'),'kept filter');assert.equal(run('hrEvaluationReturn'),null);
}
for(const cycle of ['hr-completed-2026','unified-midyear']){
 for(const type of cycle==='hr-completed-2026'?['Self','Manager','HR']:['Self','Manager']){
  openResult('EMP-001',cycle);run(`var assessment=urCycleAssignments(urCycle('${cycle}')).find(a=>a.subject==='EMP-001'&&a.type==='${type}');hrOpenEvaluationAssessment(assessment.id)`);
  assert.equal(run('urDetail'),run('assessment.id'));assert(run('urReviewDetail()').includes('Back to Evaluation Results'));assert(run('urReviewDetail()').includes('hrReturnToEvaluation()'));
  run('hrReturnToEvaluation();hrRestoreEvaluationScroll()');assert.equal(run('urResultCycle'),cycle);assert.equal(run('urResultSubject'),'EMP-001');assert.equal(run('mainNode.scrollTop'),825);
 }
}
run("navigate('202 Files');pdOpenJournal('EMP-001')");assert(!run('pdJournalPage()').includes('Back to Evaluation Results'));assert(run('pdJournalPage()').includes('Back to 202 Files'));run("pdView='';pdQuery='';render()");assert.equal(run('page'),'202 Files');assert.equal(run('pdView'),'');
run("urGoTab('Reviews');urOpenReview(assessment.id)");assert(run('urReviewDetail()').includes('Back to Reviews'));assert(!run('urReviewDetail()').includes('Back to Evaluation Results'));
openResult('EMP-001');run("hrOpenEvaluationJournal('EMP-001');pdView='entry'");assert(run('pdJournalPage()').includes('Back to 202 File'));assert(!run('pdJournalPage()').includes('Back to Evaluation Results'));run("pdView='journal'");assert(run('pdJournalPage()').includes('Back to Evaluation Results'));
run("urDirty=true;hrReturnToEvaluation()");assert.equal(run('page'),'202 Files');assert(run('hrEvaluationReturn'));assert(run('urPending'));run('urDirty=false;urPending();hrRestoreEvaluationScroll()');assert.equal(run('urScreen'),'result');
openResult('EMP-001');run("hrOpenEvaluationJournal('EMP-001');setRole('Employee')");assert.equal(run('hrEvaluationReturn'),null);assert(!run('hrRelatedEvaluationActive()'));
run("viewRole='HR Administrator'");openResult('EMP-001');run("hrOpenEvaluationJournal('EMP-001');resultCycle.released=false;hrReturnToEvaluation()");assert.equal(run('page'),'202 Files');assert.equal(run('hrEvaluationReturn'),null);run('resultCycle.released=true');
openResult('EMP-001');run("hrOpenEvaluationJournal('EMP-002')");assert.equal(run('urScreen'),'result');assert.equal(run('hrEvaluationReturn'),null);
openResult('EMP-001');run("hrOpenEvaluationJournal('EMP-001');navigate('Dashboard');navigate('202 Files');pdOpenJournal('EMP-001')");assert(!run('pdJournalPage()').includes('Back to Evaluation Results'));
openResult('EMP-002');run("hrOpenEvaluationJournal('EMP-002');hrReturnToEvaluation();urGoTab('Reviews')");assert.equal(run('urScreen'),'list');assert.equal(run('urTab'),'Reviews');assert.equal(run('hrEvaluationReturn'),null);
console.log('PASS: A–E evaluation → journal/assessment → exact evaluation returns; Maria and James; legacy and sequential assessments; scroll and filters restored; direct module Back behavior preserved.');
console.log('PASS: nested journal entry retains parent context; unsaved changes guard; role/release restrictions; cross-employee rejection; unrelated navigation clears stale context.');
