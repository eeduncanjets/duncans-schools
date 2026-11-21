(function(){
 const dlg=document.getElementById('quizDlg'),btn=document.getElementById('quizBtn');if(!dlg||!btn)return;
 const Q=[
  {q:'What do you want to do?',k:'goal',o:[['Build websites and web apps','web'],['Work with data and AI','data'],['Build strong computer science foundations','cs'],['Learn cybersecurity','sec'],['Deploy and run software (cloud)','cloud']]},
  {q:'How much programming have you done?',k:'exp',o:[['None yet','none'],['A little','some']]},
  {q:'How many hours can you study each week?',k:'hrs',o:[['About 3 hours',3],['About 6 hours',6],['About 10 hours',10]]}];
 const PG={web:0,data:1,cs:2,sec:3,cloud:4},FIRST={web:'html',data:'python',cs:'cs50',sec:'linux',cloud:'linux'};
 const body=dlg.querySelector('#qStep');let a={},i=0;
 function step(){
  if(i>=Q.length)return result();
  const q=Q[i];body.innerHTML=`<p class="qn">Question ${i+1} of ${Q.length}</p><h3>${q.q}</h3><div class="qopts">${q.o.map((o,n)=>`<button type="button" class="chip" data-n="${n}">${o[0]}</button>`).join('')}</div>`;
 }
 body.addEventListener('click',e=>{const b=e.target.closest('[data-n]');if(!b)return;a[Q[i].k]=Q[i].o[+b.dataset.n][1];i++;step()});
 function result(){
  const p=PROGRAMMES[PG[a.goal]],by=Object.fromEntries(COURSES.map(c=>[c.id,c]));
  const hrs=p.cs.reduce((s,id)=>s+by[id].h,0),months=Math.max(1,Math.round(hrs/a.hrs/4.3));
  const first=a.exp==='none'?FIRST[a.goal]:p.cs[Math.min(1,p.cs.length-1)];
  DTS.set('goal',{programme:p.t,at:DTS.today()});
  body.innerHTML=`<p class="qn">Your recommended path</p><h3>${p.t}</h3><p>${p.d}</p><p>At ${a.hrs} hours a week, plan for about <b>${months} months</b> (${hrs} hours of study).</p><p>Start with <b>${by[first].t}</b>.</p><div class="cta-row"><a class="btn" href="${DTS.courseUrl(first)}">Start this course</a><button type="button" class="btn ghost" id="qAgain">Try again</button></div>`;
  body.querySelector('#qAgain').onclick=()=>{a={};i=0;step()};
 }
 btn.onclick=()=>{a={};i=0;step();dlg.showModal()};
 dlg.querySelector('[data-close]').onclick=()=>dlg.close();
 dlg.addEventListener('click',e=>{if(e.target===dlg)dlg.close()});
})();
