#!/usr/bin/env node
/* Dependency-free release gate for Duncan's Tech Schools. */
const fs = require('node:fs');
const path = require('node:path');
const cp = require('node:child_process');
const root = path.resolve(__dirname, '..');
const fail = [];
const walk = (dir, ext) => fs.readdirSync(dir, {withFileTypes:true}).flatMap(e => e.isDirectory() ? walk(path.join(dir,e.name),ext) : (ext.includes(path.extname(e.name)) ? [path.join(dir,e.name)] : []));
const html = walk(root, ['.html']);
const js = [...walk(path.join(root,'js'), ['.js']), ...walk(path.join(root,'netlify'), ['.js'])];
for (const file of js) {
  const r = cp.spawnSync(process.execPath, ['--check', file], {encoding:'utf8'});
  if (r.status !== 0) fail.push(`JavaScript syntax: ${path.relative(root,file)}\n${r.stderr}`);
}
const routes = new Set(['/']);
for (const line of fs.readFileSync(path.join(root,'_redirects'),'utf8').split(/\r?\n/)) {
  const m = line.trim().match(/^(\/\S+)\s+\S+\s+\d+/); if (m) routes.add(m[1]);
}
for (const file of html) {
  const src = fs.readFileSync(file,'utf8');
  for (const m of src.matchAll(/\b(?:src|href)=["']([^"']+)["']/gi)) {
    const raw = m[1];
    if (/^(?:https?:|mailto:|tel:|data:|javascript:|#)/i.test(raw)) continue;
    const clean = raw.split(/[?#]/)[0]; if (!clean) continue;
    const target = clean.startsWith('/') ? path.join(root, clean.slice(1)) : path.resolve(path.dirname(file), clean);
    const candidates = [target, target+'.html', path.join(target,'index.html')];
    if (!candidates.some(p => fs.existsSync(p)) && !routes.has(clean)) fail.push(`Missing local link/asset: ${path.relative(root,file)} -> ${raw}`);
  }
}
const lessonCount = fs.readdirSync(path.join(root,'lessons')).filter(f=>/^.+-\d+\.html$/.test(f)).length;
const courseCount = fs.readdirSync(path.join(root,'courses')).filter(f=>f.endsWith('.html')).length;
if (lessonCount < 1000) fail.push(`Expected at least 1,000 lesson pages; found ${lessonCount}`);
if (courseCount !== 25) fail.push(`Expected 25 course pages; found ${courseCount}`);
if (!fs.existsSync(path.join(root,'dashboard.html'))) fail.push('Dashboard page is missing');
if (!fs.existsSync(path.join(root,'lc3.html'))) fail.push('LC-3 lab page is missing');
for (const file of ['project-lab.html','interview-studio.html','js/project-lab.js','js/interview-studio.js','js/gamification.js','js/rewards-dashboard.js','css/next-level.css','innovation-academy.html','js/innovation-academy.js','css/innovation-academy.css']) if (!fs.existsSync(path.join(root,file))) fail.push(`Next-level feature missing: ${file}`);
for (const route of ['/project-lab','/interview-studio','/innovation-academy']) if (!routes.has(route)) fail.push(`Missing route: ${route}`);
const projectLab = fs.readFileSync(path.join(root,'project-lab.html'),'utf8');
if (!projectLab.includes('projectPreview') || !projectLab.includes('exportProject')) fail.push('Project Lab editor/preview/export controls are missing');
const innovation = fs.readFileSync(path.join(root,'innovation-academy.html'),'utf8');
for (const control of ['stageList','ventureForm','downloadCanvas','copyPitch']) if (!innovation.includes(`id="${control}"`)) fail.push(`Innovation Academy control missing: ${control}`);
const innovationJs = fs.readFileSync(path.join(root,'js/innovation-academy.js'),'utf8');
for (const feature of ['localStorage','renderStages','downloadCanvas','updatePitch']) if (!innovationJs.includes(feature)) fail.push(`Innovation Academy behaviour missing: ${feature}`);
const interview = fs.readFileSync(path.join(root,'interview-studio.html'),'utf8');
if (!interview.includes('submitAnswer') || !interview.includes('rubric')) fail.push('Interview Studio practice/rubric controls are missing');

const vm = require('node:vm'); const lctx = vm.createContext({});
for (const f of ['js/lessons.js','js/lessons-extra.js']) vm.runInContext(fs.readFileSync(path.join(root,f),'utf8'), lctx);
const LES = vm.runInContext('LESSONS', lctx);
for (const id of Object.keys(LES)) {
  const seen = new Set(), pos = [0,0,0];
  LES[id].lessons.forEach((l,i) => {
    if (seen.has(l.q.q)) fail.push(`Repeated question in ${id}: lesson ${i+1}`);
    seen.add(l.q.q); pos[l.q.a]++;
    if (new Set(l.q.o).size !== l.q.o.length) fail.push(`Duplicate options in ${id} lesson ${i+1}`);
  });
  if (Math.max(...pos) > LES[id].lessons.length * 0.6) fail.push(`Correct answers cluster in one position in ${id}: ${pos}`);
}

try { const cj = JSON.parse(fs.readFileSync(path.join(root,'netlify/functions/courses.json'),'utf8'));
  for (const id of Object.keys(LES)) if (!cj[id] || cj[id].n !== LES[id].lessons.length) fail.push('netlify/functions/courses.json is out of date for '+id+' (run: node scripts/make-courses-json.js)');
} catch (e) { fail.push('netlify/functions/courses.json is missing (run: node scripts/make-courses-json.js)'); }

console.log(`HTML pages: ${html.length}`);
console.log(`JavaScript files syntax-checked: ${js.length}`);
console.log(`Lesson pages: ${lessonCount}; course pages: ${courseCount}`);
if (fail.length) { console.error(`\n${fail.length} release check(s) failed:\n- ${fail.join('\n- ')}`); process.exit(1); }
console.log('PASS: no missing local links/assets; all release checks passed.');
