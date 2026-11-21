(function(){
 const $=s=>document.querySelector(s);
 const MODE={js:'javascript',py:'python',sql:'text/x-sql',java:'text/plain',cpp:'text/plain',php:'text/plain',html:'htmlmixed',bootstrap:'htmlmixed',node:'javascript',ts:'text/plain',aws:'text/plain',css:'css',react:'javascript',git:'text/plain',linux:'text/plain',docker:'dockerfile',security:'text/plain',network:'text/plain',lc3:'text/plain'},NAME={js:'JavaScript',py:'Python',sql:'SQL',java:'Java',cpp:'C++',php:'PHP',html:'HTML',bootstrap:'Bootstrap',node:'Node.js',ts:'TypeScript',aws:'AWS',css:'CSS',react:'React',git:'Git',linux:'Linux',docker:'Docker',security:'Cybersecurity',network:'Networking',lc3:'LC-3 Assembly',sysdesign:'System Design'};
 let activeFilter='All', activeLevel='All', activeKind='All', searchText='';
 const solved=()=>DTS.get('chal',{});
 const ed=Editor.make($('#chCode'),'javascript');
 const daily=CHALLENGES[Math.floor(Date.now()/864e5)%CHALLENGES.length];
 let cur=CHALLENGES.find(c=>c.id===location.hash.slice(1))||daily;

 const SEARCH_ALIASES={
  js:'javascript js ecmascript frontend scripting',py:'python python3',sql:'sql database mysql query relational',
  html:'html markup web structure',css:'css styling stylesheet responsive design',react:'react jsx components frontend',
  node:'node nodejs node.js backend express',ts:'typescript types',java:'java oop jvm',cpp:'c++ cpp programming',
  linux:'linux bash shell command line terminal',network:'network networking dns tcp ip subnet',security:'cybersecurity security secure hacking',
  git:'git github version control',docker:'docker container containerisation',sysdesign:'system design architecture scalability',
  php:'php backend web',bootstrap:'bootstrap css framework',aws:'aws cloud amazon web services',lc3:'lc-3 lc3 assembly computer architecture'
 };
 const normalise=v=>String(v??'').normalize('NFKD').replace(/[\u0300-\u036f]/g,'').toLowerCase();
 const searchIndex=c=>normalise([
  c.id,c.t,c.d,c.lang,NAME[c.lang],SEARCH_ALIASES[c.lang],c.level,c.fn,c.starter,c.solution,c.rubric,
  c.debug?'debug debugging bug fix': '',c.manual?'guided review manual task': 'automated tests'
 ].filter(Boolean).join(' '));
 const searchTermMatches=(hay,term)=>{const variants=[term];if(term.length>4&&term.endsWith('ies'))variants.push(term.slice(0,-3)+'y');else if(term.length>3&&term.endsWith('s')&&!term.endsWith('ss'))variants.push(term.slice(0,-1));return variants.some(v=>hay.includes(v));};
 const matchesSearch=(c)=>{if(!searchText)return true;const hay=searchIndex(c);return searchText.split(/\s+/).filter(Boolean).every(term=>searchTermMatches(hay,term));};
 function filteredChallenges(){
  return CHALLENGES.filter(c=>matchesSearch(c)
   &&(activeFilter==='All'||c.lang===activeFilter)
   &&(activeLevel==='All'||normalise(c.level)===normalise(activeLevel))
   &&(activeKind==='All'||(activeKind==='Debugging'?!!c.debug:!!c.manual)));
 }
 function list(){
  const visible=filteredChallenges();
  $('#chList').innerHTML=visible.map(c=>{const i=CHALLENGES.indexOf(c);return `<li><button data-i="${i}" ${c===cur?'aria-current="true"':''}><span class="lang">${(NAME[c.lang]||c.lang).toUpperCase()}</span>${c.debug?'<span class="lang dbg">FIX</span>':''}${c.manual?'<span class="lang guided">GUIDED</span>':''}<span class="challenge-item-title">${RUN.esc(c.t)}</span>${solved()[c.id]?'<span class="tick" aria-label="solved">✓</span>':''}</button></li>`}).join('')||'<li class="challenge-empty"><strong>No matching challenges found.</strong><span>Try a broader keyword, choose “All technologies”, or clear the filters.</span><button type="button" data-clear-challenges>Show all challenges</button></li>';
  $('#chCount').textContent=`${CHALLENGES.filter(c=>solved()[c.id]).length} of ${CHALLENGES.length} solved`;
  const meta=$('#challengeResultsMeta');if(meta)meta.textContent=`Showing ${visible.length.toLocaleString()} of ${CHALLENGES.length.toLocaleString()} challenges${searchText?` for “${searchText}”`:''}${activeFilter!=='All'?` · ${(NAME[activeFilter]||activeFilter)}`:''}${activeLevel!=='All'?` · ${activeLevel}`:''}`;
 }
 function filters(){
  const tech=$('#challengeTechnology'),level=$('#challengeLevel');
  const langs=['All',...Array.from(new Set(CHALLENGES.map(c=>c.lang))).sort((a,b)=>(NAME[a]||a).localeCompare(NAME[b]||b))];
  tech.innerHTML=langs.map(k=>`<option value="${k}">${k==='All'?'All technologies':NAME[k]||k} (${k==='All'?CHALLENGES.length:CHALLENGES.filter(c=>c.lang===k).length})</option>`).join('');
  level.innerHTML=['All',...Array.from(new Set(CHALLENGES.map(c=>c.level))).sort()].map(k=>`<option value="${k}">${k==='All'?'All levels':k}</option>`).join('');
  tech.value=activeFilter;level.value=activeLevel;
 }
 $('#challengeTechnology').addEventListener('change',e=>{activeFilter=e.target.value;list()});
 $('#challengeLevel').addEventListener('change',e=>{activeLevel=e.target.value;list()});
 $('#challengeAll').onclick=()=>setKind('All');$('#challengeDebug').onclick=()=>setKind('Debugging');$('#challengeGuided').onclick=()=>setKind('Guided');
 function setKind(kind){activeKind=kind;['challengeAll','challengeDebug','challengeGuided'].forEach((id,i)=>{const b=$('#'+id),on=['All','Debugging','Guided'][i]===kind;b.classList.toggle('active',on);b.setAttribute('aria-pressed',String(on))});list()}
 $('#challengeClear').onclick=()=>{searchText='';activeFilter='All';activeLevel='All';setKind('All');$('#challengeSearch').value='';filters();list();$('#challengeSearch').focus()};
 $('#chList').addEventListener('click',e=>{if(e.target.closest('[data-clear-challenges]')){$('#challengeClear').click();return}});
 $('#challengeSearch').addEventListener('input',e=>{searchText=normalise(e.target.value).trim();if(searchText&&activeFilter!=='All'){activeFilter='All';$('#challengeTechnology').value='All'}list()});

 function open(c){
  cur=c;$('#chTitle').textContent=c.t;$('#chDesc').textContent=c.d;$('#chLevel').textContent=`${c.level} · ${NAME[c.lang]||c.lang}${c.debug?' · Debug the code':c.manual?' · Guided self-review':''}`;
  ed.mode(MODE[c.lang]||'text/plain');ed.value=c.starter;$('#chOut').innerHTML=c.manual?'<p class="rows">This technology needs its own runtime or cloud environment. Draft your solution, then use the guided checklist and reference solution to review it.</p>':'<p class="rows">Press Run tests to check your answer.</p>';
  $('#chRun').textContent=c.manual?'Show review checklist':'Run tests';$('#chReveal').hidden=!c.manual;$('#chComplete').hidden=!c.manual;$('#chHint').textContent=c.manual?'Self-review task · Reference guidance is optional':'Ctrl+Enter also runs the tests.';
  $('#chReveal').textContent='Show reference guidance';try{history.replaceState(null,'','#'+c.id)}catch(e){}list();
 }
 $('#chList').addEventListener('click',e=>{const b=e.target.closest('button[data-i]');if(b)open(CHALLENGES[+b.dataset.i])});

 function runJs(code,fn,cases){return new Promise(res=>{
  const src=`${code}\n;const __r=[];for(const [a,e] of ${JSON.stringify(cases)}){try{const v=${fn}(...a);__r.push({ok:JSON.stringify(v)===JSON.stringify(e),got:JSON.stringify(v)})}catch(err){__r.push({ok:false,got:String(err)})}}postMessage(__r)`;
  const url=URL.createObjectURL(new Blob([src],{type:'text/javascript'})),w=new Worker(url);
  const t=setTimeout(()=>{w.terminate();res({err:'Time limit exceeded (3 seconds). Check for an infinite loop.'})},3000);
  w.onmessage=e=>{clearTimeout(t);w.terminate();res({rows:e.data})};
  w.onerror=e=>{clearTimeout(t);w.terminate();res({err:e.message||'Your code has an error.'})};
 })}
 async function runPy(code,fn,cases){
  const h=`${code}\n\nimport json\n__cases=json.loads(r'''${JSON.stringify(cases)}''')\n__r=[]\nfor a,e in __cases:\n    try:\n        v=${fn}(*a)\n        __r.append({"ok":v==e,"got":repr(v)})\n    except Exception as ex:\n        __r.append({"ok":False,"got":str(ex)})\nprint("__RESULT__"+json.dumps(__r))`;
  const r=await RUN.py(h),m=(r.out||'').match(/__RESULT__(.*)/);
  if(m)return{rows:JSON.parse(m[1])};
  return{err:r.err||r.out||'No result. Make sure your function is defined.'};
 }
 async function runSql(code,c){
  const a=await RUN.sql(code,SQLDB);if(a.err)return{err:a.err};
  const b=await RUN.sql(c.ref,SQLDB),A=(a.tables[0]||{values:[]}).values,Bv=b.tables[0].values;
  const n=v=>(c.unordered?v.map(r=>JSON.stringify(r)).sort():v.map(r=>JSON.stringify(r)));
  return{sql:true,ok:JSON.stringify(n(A))===JSON.stringify(n(Bv)),got:a.tables[0],want:Bv.length};
 }
 function pass(){
  const d=solved();if(!d[cur.id]){d[cur.id]=true;DTS.set('chal',d)}
  const days=DTS.get('days',[]),t=DTS.today();if(!days.includes(t)){days.push(t);DTS.set('days',days)}
  list();if(window.FX)FX.confetti();
 }
 $('#chRun').onclick=async()=>{
  const btn=$('#chRun'),out=$('#chOut'),c=cur;btn.disabled=true;
  out.innerHTML=`<p class="rows">${c.lang==='py'?'Running Python. The first run downloads the engine (about 10 MB, once)...':'Running tests...'}</p>`;
  const code=ed.value;
  if(c.manual){out.innerHTML=`<h3>Self-review checklist</h3><p>${RUN.esc(c.rubric)}</p><p class="rows">Compare your draft with the requirements. For AWS and infrastructure tasks, validate in a safe sandbox account and never paste credentials.</p>`;btn.disabled=false;return}
  const res=c.lang==='js'?await runJs(code,c.fn,c.cases):c.lang==='py'?await runPy(code,c.fn,c.cases):await runSql(code,c);
  btn.disabled=false;
  if(res.err){out.innerHTML=`<pre class="err">${RUN.esc(res.err)}</pre>`;return}
  if(res.sql){
   out.innerHTML=(res.got?RUN.table(res.got):'<p class="rows">Your query returned no rows.</p>')+(res.ok?'<p class="rows"><b>Pass.</b> Your query returns the expected rows.</p>':`<p class="rows"><b>Not yet.</b> The expected answer has ${res.want} rows. Check your columns and conditions.</p>`);
   if(res.ok)pass();return;
  }
  const rows=res.rows,ok=rows.every(r=>r.ok);
  out.innerHTML=rows.map((r,i)=>`<div class="test ${r.ok?'ok':'no'}"><b>${r.ok?'Pass':'Fail'}</b><span>Test ${i+1}: <code>${RUN.esc(c.fn)}(${RUN.esc(c.cases[i][0].map(a=>JSON.stringify(a)).join(', '))})</code> should give <code>${RUN.esc(JSON.stringify(c.cases[i][1]))}</code>${r.ok?'':` but gave <code>${RUN.esc(r.got)}</code>`}</span></div>`).join('')+`<p class="rows">${rows.filter(r=>r.ok).length} of ${rows.length} tests passed.${ok?' Challenge solved!':''}</p>`;
  if(ok)pass();
 };
 $('#chReveal').onclick=()=>{if(!cur.manual)return;const out=$('#chOut');const existing=out.querySelector('.reference-solution');if(existing){existing.remove();$('#chReveal').textContent='Show reference guidance';return}const pre=document.createElement('pre');pre.className='reference-solution';pre.textContent=cur.solution;out.appendChild(pre);$('#chReveal').textContent='Hide reference guidance'};
 $('#chComplete').onclick=()=>{if(!cur.manual)return;pass();$('#chOut').insertAdjacentHTML('beforeend','<p class="rows"><b>Marked complete.</b> Keep practising and review the reference when needed.</p>')};
 ed.run(()=>$('#chRun').click());
 $('#chReset').onclick=()=>open(cur);
 addEventListener('hashchange',()=>{const c=CHALLENGES.find(x=>x.id===location.hash.slice(1));if(c&&c!==cur)open(c)});
 window.DTS_CTX=()=>({page:'challenge',course:'Coding challenges',lesson:cur.t,task:cur.d,code:ed.value});
 filters();list();open(cur);
})();
