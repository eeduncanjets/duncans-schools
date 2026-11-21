(function(){
 const $=s=>document.querySelector(s);
 const B=document.body.dataset,params=new URLSearchParams(location.search);
 const c0=B.course||params.get('c');
 let cid=LESSONS[c0]?c0:'html';
 let li=B.lesson?+B.lesson:Math.max(0,+params.get('l')||0);
 const done=()=>DTS.get('done',{});
 const kind=L=>L.code?'web':L.py!=null?'py':L.sql!=null?'sql':'read';
 const E={html:Editor.make($('#ed-html'),'htmlmixed'),css:Editor.make($('#ed-css'),'css'),js:Editor.make($('#ed-js'),'javascript'),code:Editor.make($('#ed-code'),'python')};
 E.css.hidden=true;E.js.hidden=true;
 const sel=$('#courseSel');sel.innerHTML='';
 Object.keys(LESSONS).forEach(k=>sel.add(new Option(LESSONS[k].title,k)));
 sel.value=cid;sel.onchange=()=>{cid=sel.value;li=0;show()};
 let timer;

 function mark(i){
  const d=done();d[cid+':'+i]=true;DTS.set('done',d);
  const days=DTS.get('days',[]),t=DTS.today();if(!days.includes(t)){days.push(t);DTS.set('days',days)}
  side();
 }
 function side(){
  const C=LESSONS[cid],d=done(),n=C.lessons.filter((_,i)=>d[cid+':'+i]).length;
  $('#courseBar').style.width=(n/C.lessons.length*100)+'%';
  $('#courseCount').textContent=`${n} of ${C.lessons.length} lessons complete`;
  $('#lessonList').innerHTML='';
  C.lessons.forEach((l,i)=>{
   const item=document.createElement('li'),b=document.createElement('button');
   b.innerHTML=`<span>${i+1}.</span><span>${l.t}</span>${d[cid+':'+i]?'<span class="tick" aria-label="complete">&#10003;</span>':''}`;
   if(i===li)b.setAttribute('aria-current','true');
   b.onclick=()=>{li=i;show();scrollTo({top:0})};item.appendChild(b);$('#lessonList').appendChild(item);
  });
 }
 function runWeb(){
  const L=LESSONS[cid].lessons[li],err="<pre style=\"color:#c00;white-space:pre-wrap\">";
  const libs=L.react?'<script src="https://cdn.jsdelivr.net/npm/react@18.3.1/umd/react.development.js"><\/script><script src="https://cdn.jsdelivr.net/npm/react-dom@18.3.1/umd/react-dom.development.js"><\/script><script src="https://cdn.jsdelivr.net/npm/@babel/standalone@7.24.7/babel.min.js"><\/script>':'';
  const code=L.react
   ?`<script>window.onerror=function(m){document.body.insertAdjacentHTML('beforeend','${err}'+m+'</pre>')}<\/script>${libs}<script type="text/babel">${E.js.value}<\/script>`
   :`<script>try{${E.js.value}}catch(e){document.body.insertAdjacentHTML('beforeend','${err}'+e+'</pre>')}<\/script>`;
  $('#preview').srcdoc=`<!doctype html><meta charset="utf-8"><style>body{font-family:system-ui,sans-serif;padding:1rem;color:#111}</style><style>${E.css.value}</style>${E.html.value}${code}`;
 }
 function setTab(t){
  document.querySelectorAll('.tabs [data-t]').forEach(b=>b.setAttribute('aria-selected',b.dataset.t===t));
  ['html','css','js'].forEach(k=>E[k].hidden=k!==t);
 }
 document.querySelectorAll('.tabs [data-t]').forEach(b=>b.onclick=()=>setTab(b.dataset.t));
 ['html','css','js'].forEach(k=>{E[k].on(()=>{clearTimeout(timer);timer=setTimeout(runWeb,350)});E[k].run(runWeb)});
 E.code.run(runCode);
 $('#run').onclick=runWeb;$('#run2').onclick=runCode;
 $('#reset').onclick=$('#reset2').onclick=()=>load(LESSONS[cid].lessons[li]);
 $('#copy').onclick=async()=>{try{await navigator.clipboard.writeText($('#sample').textContent);$('#copy').textContent='Copied'}catch(e){$('#copy').textContent='Select and copy'}setTimeout(()=>$('#copy').textContent='Copy',1500)};

 async function runCode(){
  const L=LESSONS[cid].lessons[li],k=kind(L),out=$('#out'),btn=$('#run2');
  btn.disabled=true;out.innerHTML=`<p class="rows">${k==='py'?'Running Python. The first run downloads the engine (about 10 MB, once), so it can take a few seconds...':'Running query...'}</p>`;
  const code=E.code.value;
  const res=k==='py'?await RUN.py(code):await RUN.sql(code,LESSONS[cid].db);
  RUN.render(res,out);btn.disabled=false;
 }
 function load(L){
  const k=kind(L);
  $('#work').hidden=k!=='web';$('#work2').hidden=!(k==='py'||k==='sql');$('#sampleBox').hidden=k!=='read';
  if(k==='web'){E.html.value=L.code.html;E.css.value=L.code.css;E.js.value=L.code.js;setTab('html');runWeb()}
  else if(k==='py'||k==='sql'){
   E.code.mode(k==='py'?'python':'text/x-sql');E.code.value=k==='py'?L.py:L.sql;E.code.hidden=false;
   $('#langName').textContent=k==='py'?'Python':'SQL (SQLite)';$('#out').innerHTML='<p class="rows">Press Run to see the result.</p>';
  }else $('#sample').textContent=L.sample;
 }
 function quiz(L){
  $('#qText').textContent=L.q.q;$('#qMsg').textContent='';$('#qOpts').innerHTML='';
  L.q.o.forEach((o,i)=>{
   const b=document.createElement('button');b.textContent=o;
   b.onclick=()=>{
    if(i===L.q.a){b.classList.add('ok');$('#qMsg').textContent='Correct: '+L.q.o[L.q.a]+'. '+(L.q.why?L.q.why+' ':'')+'Lesson complete.';mark(li);document.querySelectorAll('#qOpts button').forEach(x=>x.disabled=true);if(window.FX)FX.confetti()}
    else{b.classList.add('bad');$('#qMsg').textContent='Not quite. Re-read the lesson and try another answer.';try{const m=DTS.get('missed',{});m[cid+':'+li]=Date.now();DTS.set('missed',m)}catch(e){}}
   };
   $('#qOpts').appendChild(b);
  });
  if(done()[cid+':'+li]){$('#qOpts').children[L.q.a].classList.add('ok');$('#qMsg').textContent='You already completed this lesson.'}
 }
 function show(){
  const C=LESSONS[cid];if(li>=C.lessons.length)li=0;
  const L=C.lessons[li];
  $('#lTitle').textContent=L.t;$('#lBody').innerHTML=L.body;
  load(L);quiz(L);side();
  $('#prev').disabled=li===0;
  $('#next').textContent=li===C.lessons.length-1?'Back to course':'Next lesson';
  document.title=`${L.t} | ${C.title.split(' (')[0]} | Duncan's Tech Schools`;
  try{history.replaceState(null,'',DTS.lessonUrl(cid,li))}catch(e){}
  window.DTS_CTX=()=>{const k=kind(L);return{page:'lesson',course:C.title.split(' (')[0],lesson:L.t,task:L.body.replace(/<[^>]+>/g,' ').replace(/&lt;/g,'<').replace(/&gt;/g,'>').replace(/\s+/g,' ').trim(),code:k==='web'?'HTML:\n'+E.html.value+'\nCSS:\n'+E.css.value+'\nJS:\n'+E.js.value:(k==='py'||k==='sql')?E.code.value:(L.sample||'')}};
  DTS.set('last',{c:cid,l:li});
 }
 $('#prev').onclick=()=>{li--;show();scrollTo({top:0})};
 $('#next').onclick=()=>{
  if(li===LESSONS[cid].lessons.length-1){location.href=DTS.courseUrl(cid);return}
  li++;show();scrollTo({top:0});
 };
 addEventListener('scroll',()=>{const h=document.documentElement;$('#progress').style.width=(scrollY/(h.scrollHeight-innerHeight)*100)+'%'},{passive:true});
 show();
})();
