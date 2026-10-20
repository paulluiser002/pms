const vm=require('vm'),fs=require('fs'),assert=require('assert');
const els={};const el=s=>els[s]??=( {innerHTML:'',value:'',style:{},showModal(){},close(){},focus(){},setSelectionRange(){}} );
const context={document:{querySelector:el},localStorage:{getItem(){return null},setItem(){}},structuredClone,console,setTimeout(){},Date,FormData:class {constructor(form){this.v=form.values}get(k){return this.v[k]}},URL,Blob,confirm(){return true}};
vm.createContext(context);vm.runInContext(fs.readFileSync('performance/dist/app.js','utf8'),context);
const run=s=>vm.runInContext(s,context);
for(const p of ['Overview','Employees','Goals & KPIs','Performance reviews','Review cycles','Reports']){run(`navigate('${p}')`);assert(el('#content').innerHTML.includes('<h1>'));}
run('openEmployee()');el('#employeeForm').onsubmit({preventDefault(){},target:{values:{name:'Test Employee',role:'Analyst',department:'Operations',manager:'Angela Reyes'}}});
assert.equal(run('data.employees.length'),7);
run('openGoal()');el('#goalForm').onsubmit({preventDefault(){},target:{values:{name:'Resolve 95% of tickets on time',employee:'Test Employee',category:'Quality',due:'2026-10-30',progress:'50'}}});assert.equal(run("employeeProgress('Test Employee')"),50);
run("openReview('EMP-007')");el('#reviewForm').onsubmit({preventDefault(){},target:{values:{reflection:'Achieved the first milestone.'}}});assert.equal(run('data.employees[6][6]'),'Manager review');
run("openReview('EMP-007')");el('#reviewForm').onsubmit({preventDefault(){},target:{values:{reflection:'Achieved the first milestone.',score0:'3',score1:'4',score2:'5',feedback:'Continue the ticket quality initiative.'}}});assert.equal(run('data.employees[6][6]'),'Completed');
run("acknowledge('EMP-007')");assert.equal(run("data.reviews['EMP-007'].acknowledged"),true);
console.log('PASS: six screen renders, employee creation, goal creation and progress, self-assessment, manager completion, employee acknowledgment. DOM-stub logic check; browser layout not tested.');
