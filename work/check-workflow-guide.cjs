const fs=require('fs'),vm=require('vm'),assert=require('assert');
const context=vm.createContext({document:{addEventListener(){}}});
vm.runInContext(fs.readFileSync('performance/dist/workflow-guide.js','utf8'),context);
const flows=vm.runInContext('pmsWorkflowProcesses',context);
assert.equal(new Set(flows.map(p=>p.id)).size,flows.length,'Process IDs must be unique');
for(const p of flows){
 const ids=new Set(p.nodes.map(n=>n[0]));
 assert.equal(ids.size,p.nodes.length,`${p.id}: duplicate step`);
 assert(p.nodes.every(n=>n[1]&&n[2]&&n[4]&&n[5]),`${p.id}: incomplete step guidance`);
 for(const n of p.nodes)assert(vm.runInContext('pmsWorkflowIcon',context)(n).includes('aria-hidden="true"'),`${p.id}: missing decorative step icon`);
 const positions=p.nodes.map(n=>`${n[3]}:${n[6]==='branch'}`);
 assert.equal(new Set(positions).size,positions.length,`${p.id}: overlapping steps`);
 for(const [from,to] of p.edges)assert(ids.has(from)&&ids.has(to),`${p.id}: dangling connector`);
 assert(p.tour.every(id=>ids.has(id)),`${p.id}: walkthrough references missing steps`);
 assert.equal(new Set(p.tour).size,ids.size,`${p.id}: walkthrough must include exception paths`);
 const reached=new Set([p.nodes[0][0]]);
 for(let i=0;i<ids.size;i++)for(const [from,to] of p.edges)if(reached.has(from))reached.add(to);
 assert.equal(reached.size,ids.size,`${p.id}: unreachable step`);
}
const index=fs.readFileSync('performance/dist/index.html','utf8');
assert(index.indexOf('id="pmsWorkflowButton"')<index.indexOf('id="pmsNotificationsButton"'),'Guide trigger must precede Notifications');
assert(index.includes('src="workflow-guide.js"')&&index.includes('href="workflow-guide.css"'),'Guide assets must be included');
assert.equal(fs.readFileSync('outputs/index.html','utf8'),index,'Local preview index must match source');
for(const file of ['workflow-guide.js','workflow-guide.css'])assert.equal(fs.readFileSync('outputs/'+file,'utf8'),fs.readFileSync('performance/dist/'+file,'utf8'),'Local assets must match source');
console.log(`PASS: ${flows.length} connected workflows, complete walkthroughs, trigger placement and preview asset parity`);
