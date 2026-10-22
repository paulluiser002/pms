const fs=require('fs'),vm=require('vm'),assert=require('assert');
const nodes={};const node=key=>nodes[key]??={innerHTML:'',textContent:'',value:'',style:{},attributes:{},addEventListener(){},setAttribute(k,v){this.attributes[k]=v},showModal(){},close(){},focus(){},scrollIntoView(){},setSelectionRange(){},querySelectorAll(){return []},reportValidity(){return true},insertAdjacentHTML(){},prepend(){}};
let fields={};const context={console,document:{querySelector:node,querySelectorAll(){return []},getElementById:node,addEventListener(){}},localStorage:{getItem(){return null},setItem(){}},structuredClone,Date,Math,URL,Blob,setTimeout(){},confirm(){return true},location:{reload(){}},addEventListener(){},scrollTo(){},FormData:class{get(k){return fields[k]??null}getAll(k){return []}}};context.window=context;vm.createContext(context);const run=x=>vm.runInContext(x,context);
for(const file of ['app.js','views.js','reviews.js','revisions.js','tables.js','dashboard.js'])run(fs.readFileSync('performance/dist/'+file,'utf8'));
const shell=fs.readFileSync('performance/dist/shell.js','utf8');run(shell.slice(shell.indexOf('/* Structured goal creation')));run('render=()=>{};pmsAccessiblePages=()=>[];pmsSidebarQuery="";pmsChevron=()=>"";pmsSplitPageHeader=()=>{}');
for(const file of ['evaluations.js','cycle-workflow.js','evaluation-results.js']){run(fs.readFileSync('performance/dist/'+file,'utf8').replace(/render\(\);\s*$/,''));run('render=()=>{};closeModal=()=>{}')}
run("viewRole='HR Administrator';var annual=urCycle('hr-annual-2026');var finished=urCycle('hr-completed-2026')");

const historical=run("JSON.stringify(UR.cycles.filter(c=>c.status!=='Draft'))"),goals=run('JSON.stringify(data.goals)'),templates=run('JSON.stringify([UR.templates,UR.goalTemplates])'),assessments=run('JSON.stringify(UR.assignments)');
assert.deepEqual(JSON.parse(run('JSON.stringify(cwSteps)')),['Cycle Details','Select Participants','Evaluation Setup','Assessment Workflow','Review & Launch']);
for(const oldStep of [1,2,3,4,5,6]){
 run(`var draft=urClone(annual);draft.savedStep=${oldStep};draft.weights={goals:70,behavioral:30};draft.scoring.behavioral='HR';UR.draftCycle=draft;urStartWizard()`);
 assert.equal(run('urStep'),oldStep===6?5:oldStep===5?4:oldStep);
 assert.equal(run('urWizard.previousEvaluationSetup.savedStep'),oldStep);assert.equal(run('urWizard.previousEvaluationSetup.weights.goals'),70);
 assert.equal(run('urWizard.goalLinks["EMP-002"].length'),3);assert.equal(run('urWizard.scoring.behavioral'),'average');
 assert.equal(run('cwWeights(urWizard).goals'),50);assert.equal(run('cwWeights(urWizard).behavioral'),50);
 run('var once=JSON.stringify(urWizard);cwPrepareSetup(urWizard)');assert.equal(run('JSON.stringify(urWizard)'),run('once'));
}
run("UR.draftCycle=null;urStartWizard(null,true)");assert.equal(run('urWizard.setupVersion'),3);assert(run('urWizard.behavioralTemplate'));assert.equal(run('urStep'),1);
run('cwGoStep(2)');assert.equal(run('urStep'),1);assert(run('cwErrors.some(e=>e.field==="cw-name")'));
run("cwSet('name','Five-step QA');cwGoStep(2)");assert.equal(run('urStep'),2);
const participants=run('cwParticipants(urWizard)');assert(!participants.includes('Goal Readiness'));assert(!participants.includes('Goals Template'));assert(participants.includes('cw-participant-table'));
run('cwGoStep(3)');assert.equal(run('urStep'),2);assert(run('cwErrors.some(e=>e.field==="cw-participants")'));
for(const id of ['EMP-001','EMP-002','EMP-003'])run(`cwToggleParticipant('${id}',true)`);
run('cwGoStep(3)');assert.equal(run('urStep'),3);
run('var duplicate=urClone(urWizard.goalLinks["EMP-001"][0]);urWizard.goalLinks["EMP-001"].push(duplicate)');assert.equal(run('cwAvailableGoalLinks(urWizard,"EMP-001").length'),3);assert(!run('cwReady(urWizard,"EMP-001")'));run('urWizard.goalLinks["EMP-001"].pop()');
const setup=run('cwSetup(urWizard)');for(const text of ['3 of 3 participants ready.','3 assigned goals','Review Goals','Customize by Position','Preview Template'])assert(setup.includes(text),text);
for(const text of ['Evaluation Weighting','Scoring Policy','type="checkbox"','cw-components','cw-goalsPolicy','cw-behaviorPolicy'])assert(!setup.includes(text),text);
run('var preserved=JSON.stringify(urWizard);cwReviewGoals("EMP-002")');assert.equal(run('JSON.stringify(urWizard)'),run('preserved'));assert.equal(run('urStep'),3);
assert(nodes['#modalTitle']?.textContent||Object.values(nodes).some(n=>n.innerHTML.includes('Back to Evaluation Setup')));
run('cwGoStep(4)');assert.equal(run('urStep'),4);assert(run('cwWorkflow(urWizard)').includes('Manual release by HR Administrator.'));
run('cwGoStep(5)');assert.equal(run('urStep'),5);assert(run('urWizardPage()').includes('STEP 5 OF 5'));assert(!run('urWizardPage()').includes('Results &amp; Release'));
run('cwGoStep(6)');assert.equal(run('urStep'),5);
run('urSaveCycleDraft();var savedId=urWizard.id;urWizard=null;urStartWizard(savedId)');assert.equal(run('urStep'),5);assert.equal(run('urWizard.setupVersion'),3);assert.equal(run('urWizard.participants.length'),3);
run('cwGoStep(3);var good=urClone(urWizard);delete urWizard.goalLinks["EMP-003"];cwGoStep(4)');assert.equal(run('urStep'),3);assert(run('cwErrors.some(e=>e.step===3&&e.field==="cw-readiness-EMP-003")'));
assert(run('cwSetup(urWizard)').includes('No goals assigned'));assert(run('cwSetup(urWizard)').includes('Assign Goals'));
run('urWizard=urClone(good);urWizard.behavioralTemplate="";urWizard.behaviorByPosition={};cwGoStep(4)');assert.equal(run('urStep'),3);
run('urWizard=urClone(good);cwGoStep(4);urWizard.stages[1].deadline=urWizard.stages[0].deadline;cwGoStep(5)');assert.equal(run('urStep'),4);
run('urWizard=urClone(good);cwGoStep(5);var id=urWizard.id;var goalCount=data.goals.length;urCommitCycle("Active")');assert.equal(run('urCycle(id).status'),'Active');assert.equal(run('data.goals.length'),run('goalCount'));assert.equal(run('urCycleAssignments(urCycle(id)).length'),9);assert.equal(run('urCycleAssignments(urCycle(id)).filter(pdUnlocked).length'),3);assert.equal(run('urCycle(id).weights.goals'),50);assert(!run('urCycle(id).released'));
run(`var launched=urCycle(id);for(const subject of launched.participants){for(const link of cwLinks(launched,subject)){const g=cwGoal(link);g.evaluationActuals??={};g.evaluationActuals[id]={value:link.target};g.goalVerifications??={};g.goalVerifications[id]={state:'Verified',signature:cwGoalSignature(g,launched)}}}for(const a of urCycleAssignments(launched)){a.state='Submitted';a.submitted=urToday;a.answers=Object.fromEntries(a.template.questions.map(q=>[q.id,q.type==='Rating'?'4':'Observed evidence']))}urDoFinalize(id)`);
assert.equal(run('launched.status'),'Completed');assert.equal(run('launched.resultSnapshots["EMP-002"].weights.goals'),50);
assert.equal(run('hrResultData(launched,"EMP-002").overall'),4.5);
assert.equal(run('pdWeighted(4.5,3.5,cwWeights(urCycle(id)))'),4);
assert.equal(run('JSON.stringify(UR.cycles.filter(c=>c.status!=="Draft"&&c.id!==id))'),historical);
assert.equal(run('JSON.stringify([UR.templates,UR.goalTemplates])'),templates);
assert.equal(run('JSON.stringify(UR.assignments.filter(a=>a.cycle!==id))'),assessments);
run("viewRole='Employee';var oldWizard=urWizard;urStartWizard(null,true)");assert(run('urWizard===oldWizard'));
console.log('PASS five-step navigation; stage validation; actual goal counts; review modal context; defaults; idempotent old-step migration; saved draft resume; 50/50 launch; sequential locks; preserved history and scoped access');
