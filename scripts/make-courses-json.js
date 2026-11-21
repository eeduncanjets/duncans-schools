// Writes netlify/functions/courses.json (course titles and lesson counts) for the certificate function.
// Run again whenever lessons are added or removed: node scripts/make-courses-json.js
const fs=require('fs'),vm=require('vm'),path=require('path'),root=path.join(__dirname,'..');
const ctx=vm.createContext({});
for(const f of ['js/data.js','js/lessons.js','js/lessons-extra.js'])vm.runInContext(fs.readFileSync(path.join(root,f),'utf8'),ctx);
const out={};
for(const c of vm.runInContext('COURSES',ctx)){const L=vm.runInContext('LESSONS',ctx)[c.id];if(L)out[c.id]={t:c.t,n:L.lessons.length}}
fs.writeFileSync(path.join(root,'netlify/functions/courses.json'),JSON.stringify(out,null,1));
console.log('courses.json written for',Object.keys(out).length,'courses');
