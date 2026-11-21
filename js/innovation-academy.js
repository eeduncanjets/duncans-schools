(()=>{'use strict';
const KEY='dts.innovation.v1';
const stages=[
 ['Discover','Find a real problem','Observe a community, workflow or task. Write down who struggles, when it happens and why it matters.'],
 ['Research','Understand the people','Interview at least three potential users. Capture patterns, not just opinions about your idea.'],
 ['Define','Choose a focused problem','Write a clear problem statement and identify the first user group you can realistically reach.'],
 ['Design','Explore possible solutions','Sketch at least two approaches. Choose the simplest one that could test your main assumption.'],
 ['Prototype','Build the smallest useful version','Use Project Lab or your preferred tools to create a clickable mock-up or working prototype.'],
 ['Test','Measure real behaviour','Ask users to try a task. Observe where they get stuck and record evidence against your success metric.'],
 ['Improve','Iterate with evidence','Prioritise the most important feedback. Fix the biggest obstacle and test again.'],
 ['Present','Tell the product story','Prepare a demo, explain the problem, show evidence and describe what you learned.'],
 ['Launch responsibly','Plan the next release','Document privacy, accessibility, security, support and maintenance before inviting more users.']
];
const $=id=>document.getElementById(id);let state={done:[],canvas:{}};
try{const saved=JSON.parse(localStorage.getItem(KEY)||'{}');state={...state,...saved};}catch(e){}
function persist(){try{localStorage.setItem(KEY,JSON.stringify(state));}catch(e){$('ventureStatus').textContent='Could not save: browser storage may be full or disabled.';}}
function renderStages(){const root=$('stageList');root.innerHTML='';stages.forEach((s,i)=>{const card=document.createElement('article');card.className='ia-stage'+(state.done.includes(i)?' done':'');const head=document.createElement('div');head.className='ia-stage-head';const num=document.createElement('small');num.textContent=`STAGE ${String(i+1).padStart(2,'0')}`;const tick=document.createElement('small');tick.textContent=state.done.includes(i)?'COMPLETED':'IN PROGRESS';head.append(num,tick);const h=document.createElement('h3');h.textContent=s[0]+' · '+s[1];const p=document.createElement('p');p.textContent=s[2];const label=document.createElement('label');const cb=document.createElement('input');cb.type='checkbox';cb.checked=state.done.includes(i);cb.addEventListener('change',()=>{state.done=cb.checked?[...new Set([...state.done,i])]:state.done.filter(x=>x!==i);persist();renderStages();});label.append(cb,document.createTextNode(' Mark this milestone complete'));card.append(head,h,p,label);root.append(card);});const pct=Math.round(state.done.length/stages.length*100);$('stagePct').textContent=pct+'%';$('stageBar').style.width=pct+'%';}
const fields=['vName','vUser','vProblem','vCurrent','vSolution','vEdge','vMetric','vExperiment'];
function readForm(){const c={};fields.forEach(id=>c[id]=$(id).value.trim());return c;}
function writeForm(){fields.forEach(id=>$(id).value=state.canvas[id]||'');updatePitch();}
function updatePitch(){const c=state.canvas||{};const name=c.vName||'our product';const user=c.vUser||'a clearly defined group of people';const problem=c.vProblem||'a meaningful problem';const solution=c.vSolution||'a focused, practical solution';const metric=c.vMetric||'feedback and measurable user outcomes';$('pitchText').textContent=`We are creating ${name} for ${user}, who experience ${problem}. Our solution is ${solution}. We will test whether it works by measuring ${metric}. We are starting small, learning from real users and improving the product based on evidence.`;}
$('ventureForm').addEventListener('submit',e=>{e.preventDefault();state.canvas=readForm();persist();updatePitch();$('ventureStatus').textContent='Venture canvas saved in this browser.';});
$('downloadCanvas').addEventListener('click',()=>{state.canvas=readForm();persist();const c=state.canvas;const text=`# ${c.vName||'Innovation venture brief'}\n\n## Target user\n${c.vUser||'Not yet defined'}\n\n## Problem\n${c.vProblem||'Not yet defined'}\n\n## Current alternatives\n${c.vCurrent||'Not yet researched'}\n\n## Proposed solution\n${c.vSolution||'Not yet defined'}\n\n## Differentiator\n${c.vEdge||'To be explored'}\n\n## Success metric\n${c.vMetric||'To be defined'}\n\n## First experiment\n${c.vExperiment||'To be planned'}\n\n## Playbook progress\n${state.done.length}/${stages.length} milestones complete\n`;download(text,(c.vName||'innovation-venture').toLowerCase().replace(/[^a-z0-9]+/g,'-')+'.md','text/markdown');$('ventureStatus').textContent='Your venture brief has been exported.';});
$('clearCanvas').addEventListener('click',()=>{if(!confirm('Clear the saved venture canvas? This cannot be undone.'))return;state.canvas={};persist();writeForm();$('ventureStatus').textContent='Venture canvas cleared.';});
$('copyPitch').addEventListener('click',async()=>{try{await navigator.clipboard.writeText($('pitchText').textContent);$('copyPitch').textContent='Copied!';setTimeout(()=>$('copyPitch').textContent='Copy pitch',1800);}catch(e){$('ventureStatus').textContent='Clipboard access is unavailable. Select and copy the pitch text manually.';}});
function download(content,name,type){const blob=new Blob([content],{type}),url=URL.createObjectURL(blob),a=document.createElement('a');a.href=url;a.download=name;a.click();setTimeout(()=>URL.revokeObjectURL(url),1000);}
writeForm();renderStages();
})();
