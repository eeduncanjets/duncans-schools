/* Practice tests: topic quizzes (10 questions) and a timed mixed exam (20 questions, 15 minutes). */
(function(){
 const root=document.getElementById('practice');if(!root||typeof QBANK==='undefined')return;
 const esc=s=>String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
 const shuffle=a=>{a=a.slice();for(let i=a.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[a[i],a[j]]=[a[j],a[i]]}return a};
 const results=()=>DTS.get('tests',{});
 let timer=null;
 function pool(t){
  const out=QBANK[t].q.map(x=>({q:x.q,o:x.o,c:x.o[x.a],e:x.e,t}));
  const L=typeof LESSONS!=='undefined'&&LESSONS[t];
  if(L)L.lessons.forEach(l=>{if(l.q)out.push({q:l.q.q,o:l.q.o,c:l.q.o[l.q.a],e:'Covered in the lesson "'+l.t+'".',t})});
  return out;
 }
 function home(){
  clearInterval(timer);const R=results();
  const card=(k,title,sub)=>`<button class="card p-card" data-t="${k}"><h3>${esc(title)}</h3><p>${sub}</p>${R[k]?`<span class="best">Best ${R[k].best}% &middot; ${R[k].attempts} tries</span>`:'<span class="best none">Not tried yet</span>'}</button>`;
  root.innerHTML=`<div class="grid p-grid">${card('mixed','Mixed exam','20 questions from every topic in 15 minutes.')}${Object.keys(QBANK).map(k=>card(k,QBANK[k].title,pool(k).length+' questions, 10 per test')).join('')}</div>`;
  root.querySelectorAll('[data-t]').forEach(b=>b.onclick=()=>start(b.dataset.t));
 }
 function start(key){
  const exam=key==='mixed';
  let qs=exam?shuffle(Object.keys(QBANK).flatMap(pool)).slice(0,20):shuffle(pool(key)).slice(0,10);
  qs=qs.map(x=>({...x,o:shuffle(x.o)}));
  run(key,exam?'Mixed exam':QBANK[key].title,qs,exam);
 }
 function run(key,title,qs,exam){
  let i=0,score=0,answered=false,left=15*60;const wrong=[];
  function finish(){
   clearInterval(timer);
   const pct=Math.round(score/qs.length*100),R=results(),p=R[key]||{best:0,attempts:0};
   R[key]={title,best:Math.max(p.best,pct),attempts:p.attempts+1,last:pct,at:Date.now()};DTS.set('tests',R);
   const days=DTS.get('days',[]),t=DTS.today();if(!days.includes(t)){days.push(t);DTS.set('days',days)}
   if(pct>=80&&window.FX)FX.confetti();
   const msg=pct>=80?'Excellent work!':pct>=60?'Good effort. Review the answers below.':'Keep going. Every attempt teaches you something.';
   const weak=[...new Set(wrong.map(w=>w.t))].filter(t=>typeof COURSES!=='undefined'&&COURSES.some(c=>c.id===t));
   root.innerHTML=`<div class="p-res"><h2>${esc(title)}: ${score} / ${qs.length} (${pct}%)</h2><p class="sub">${msg}</p>
   ${wrong.length?'<h3>Review</h3>'+wrong.map(w=>`<div class="p-wrong"><b>${esc(w.q)}</b><p>Correct answer: <code>${esc(w.c)}</code></p><p class="hint">${esc(w.e)}</p></div>`).join(''):'<p>You answered everything correctly.</p>'}
   ${weak.length?'<p>Study more: '+weak.map(t=>`<a href="/courses/${t}">${esc(QBANK[t]?QBANK[t].title:t)}</a>`).join(', ')+'</p>':''}
   <p class="bar-row"><button class="btn small" id="again">Try again</button><button class="btn ghost small" id="back">All topics</button></p></div>`;
   root.querySelector('#again').onclick=()=>start(key);root.querySelector('#back').onclick=home;
  }
  function show(){
   answered=false;const x=qs[i];
   root.innerHTML=`<div class="pq"><div class="pq-top"><span>${esc(title)}</span><span>Question ${i+1} of ${qs.length}</span>${exam?'<span id="pTime"></span>':''}</div><div class="bar"><i style="width:${i/qs.length*100}%"></i></div><h2>${esc(x.q)}</h2><div class="p-opts">${x.o.map((o,k)=>`<button data-k="${k}">${esc(o)}</button>`).join('')}</div><div class="p-fb" aria-live="polite"></div><p class="bar-row"><button class="btn small" id="pNext" hidden>${i===qs.length-1?'See results':'Next question'}</button><button class="btn ghost small" id="pQuit">Quit</button></p></div>`;
   const btns=[...root.querySelectorAll('.p-opts button')];
   btns.forEach(b=>b.onclick=()=>{
    if(answered)return;answered=true;
    const ok=x.o[+b.dataset.k]===x.c;
    if(ok)score++;else wrong.push(x);
    btns.forEach(z=>{z.disabled=true;if(x.o[+z.dataset.k]===x.c)z.classList.add('ok')});
    if(!ok)b.classList.add('bad');
    root.querySelector('.p-fb').innerHTML=(ok?'<b>Correct.</b> ':'<b>Not quite.</b> ')+esc(x.e);
    root.querySelector('#pNext').hidden=false;root.querySelector('#pNext').focus();
   });
   root.querySelector('#pNext').onclick=()=>{i++;i<qs.length?show():finish()};
   root.querySelector('#pQuit').onclick=()=>{clearInterval(timer);home()};
   if(exam)tick();
  }
  function tick(){const t=root.querySelector('#pTime');if(t){const m=Math.floor(left/60),s=left%60;t.textContent='Time '+m+':'+String(s).padStart(2,'0')}}
  if(exam)timer=setInterval(()=>{left--;tick();if(left<=0)finish()},1000);
  show();
 }
 home();
})();
