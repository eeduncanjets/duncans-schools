(function(){
 const $=s=>document.querySelector(s);

 // Stats
 const sites=Object.values(LIB).reduce((a,b)=>a+b.length,0);
 const lessons=Object.values(LESSONS).reduce((a,c)=>a+c.lessons.length,0);
 [['s1',sites],['s2',COURSES.length],['s3',PROGRAMMES.length],['s4',lessons]].forEach(([id,v])=>{const el=document.getElementById(id);if(el)el.dataset.count=v});

 const done=DTS.get('done',{});
 const prog=id=>{const L=LESSONS[id];if(!L)return null;const n=L.lessons.filter((_,i)=>done[id+':'+i]).length;return Math.round(n/L.lessons.length*100)};
 const href=c=>DTS.courseUrl(c.id);
 const ext=()=>'';

 // Courses
 let cat='All',lvl='All';
 const cats=['All',...Object.keys(CAT_COLORS)];
 cats.forEach(n=>{const b=document.createElement('button');b.className='chip';b.textContent=n;b.setAttribute('aria-pressed',n==='All');
  b.onclick=()=>{cat=n;$('#cChips').querySelectorAll('.chip').forEach(x=>x.setAttribute('aria-pressed',x===b));draw()};$('#cChips').appendChild(b)});
 function draw(){
  const q=$('#cSearch').value.trim().toLowerCase();
  const list=COURSES.filter(c=>(cat==='All'||c.cat===cat)&&(lvl==='All'||c.lvl===lvl)&&(!q||(c.t+c.d+c.cat).toLowerCase().includes(q)));
  $('#cCount').textContent=`${list.length} of ${COURSES.length} courses`;
  $('#courseGrid').innerHTML=list.map(c=>{
   const p=prog(c.id),live=!!LESSONS[c.id];
   return `<a class="card" style="--c:${CAT_COLORS[c.cat]}" href="${href(c)}"${ext(c)}>
    <div class="ico">${c.ico.replace('<','&lt;').replace('>','&gt;')}</div>
    <h3>${c.t}</h3><p>${c.d}</p>
    <div class="meta"><span class="lv ${c.lvl}">${c.lvl}</span><span>${c.h} hours</span><span>${live?'Interactive':'External'}</span></div>
    ${p!==null?`<div class="bar"><i style="width:${p}%"></i></div>`:''}</a>`}).join('')||'<p class="sub">No courses match. Clear the search or pick All.</p>';
 }
 $('#cSearch').addEventListener('input',draw);
 $('#cLevel').addEventListener('change',e=>{lvl=e.target.value;draw()});
 draw();

 // Programmes
 const byId=Object.fromEntries(COURSES.map(c=>[c.id,c]));
 $('#progGrid').innerHTML=PROGRAMMES.map(p=>{
  const hrs=p.cs.reduce((a,id)=>a+byId[id].h,0);
  return `<article class="prog reveal" style="--c:${p.c}"><div class="prog-top"><h3>${p.t}</h3><span class="months">${p.m} months</span></div>
   <p>${p.d}</p><ol>${p.cs.map(id=>`<li><a href="${href(byId[id])}"${ext(byId[id])}>${byId[id].t}</a></li>`).join('')}</ol>
   <p class="outcome"><b>Outcome:</b> ${p.o}</p><p class="hrs">${p.cs.length} courses, about ${hrs} hours</p></article>`}).join('');
 document.querySelectorAll('.prog.reveal').forEach(el=>{const o=new IntersectionObserver(es=>{if(es[0].isIntersecting){el.classList.add('in');o.disconnect()}},{threshold:.1});o.observe(el)});

 // FAQ
 $('#faqList').innerHTML=FAQ.map(([q,a])=>`<details><summary>${q}</summary><p>${a}</p></details>`).join('');

 // Newsletter (collected by Netlify Forms)
 $('#nl').addEventListener('submit',async e=>{
  e.preventDefault();
  const form=e.target,msg=$('#nlMsg'),btn=form.querySelector('button');
  btn.disabled=true;msg.textContent='Subscribing...';
  try{
   const r=await fetch('/',{method:'POST',headers:{'Content-Type':'application/x-www-form-urlencoded'},body:new URLSearchParams(new FormData(form)).toString()});
   if(!r.ok)throw new Error('bad response');
   msg.textContent='You are on the list. Thank you!';form.reset();
  }catch(err){msg.textContent='Could not subscribe right now. Please try again in a moment.'}
  btn.disabled=false;
 });
})();
(function(){
 const last=DTS.get('last',null),b=document.getElementById('continueBtn');
 if(last&&LESSONS[last.c]&&LESSONS[last.c].lessons[last.l]){
  b.hidden=false;b.href=DTS.lessonUrl(last.c,last.l);b.textContent='Continue: '+LESSONS[last.c].lessons[last.l].t;
 }
})();
