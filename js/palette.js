(function(){
 let items=null,sel=0,shown=[];
 const build=()=>{
  items=[['Home','Page','/'],['Coding challenges','Page','/challenges'],['Practice tests','Page','/practice'],['Sign in or create account','Page','/account'],['Playground','Page','/playground'],['Cheat sheets','Page','/cheatsheets'],['My dashboard','Page','/dashboard'],['Blog','Page','/blog/'],['About Duncan','Page','/about'],['Contact','Page','/contact']];
  if(typeof COURSES!=='undefined')COURSES.forEach(c=>items.push([c.t,'Course',DTS.courseUrl(c.id)]));
  if(typeof LESSONS!=='undefined')Object.keys(LESSONS).forEach(k=>LESSONS[k].lessons.forEach((l,i)=>items.push([l.t+' ('+LESSONS[k].title.split(' (')[0]+')','Lesson',DTS.lessonUrl(k,i)])));
  if(typeof LIB!=='undefined')Object.keys(LIB).forEach(cat=>LIB[cat].forEach(([n,u,d])=>items.push([n+': '+d,'Site',u,true])));
 };
 const ov=document.createElement('div');ov.className='pal';ov.hidden=true;
 ov.innerHTML='<div class="pal-box" role="dialog" aria-label="Search"><input id="palIn" placeholder="Search courses, lessons, sites, pages..." aria-label="Search"><ul id="palList"></ul><p class="pal-hint">Enter to open. Esc to close.</p></div>';
 document.body.appendChild(ov);
 const inp=ov.querySelector('#palIn'),list=ov.querySelector('#palList');
 function draw(){
  const q=inp.value.trim().toLowerCase();
  shown=(q?items.filter(i=>(i[0]+i[1]).toLowerCase().includes(q)):items.filter(i=>i[1]==='Page'||i[1]==='Course')).slice(0,40);
  sel=0;list.innerHTML=shown.map((i,n)=>`<li data-n="${n}" ${n===0?'aria-selected="true"':''}><span>${i[0].replace(/</g,'&lt;')}</span><em>${i[1]}</em></li>`).join('')||'<li class="none">Nothing found. Try another word.</li>';
 }
 function go(n){const i=shown[n];if(!i)return;close();i[3]?window.open(i[2],'_blank','noopener'):location.href=i[2]}
 function open(){if(!items)build();ov.hidden=false;inp.value='';draw();inp.focus()}
 function close(){ov.hidden=true}
 function move(d){const lis=[...list.querySelectorAll('li[data-n]')];if(!lis.length)return;lis[sel].removeAttribute('aria-selected');sel=(sel+d+lis.length)%lis.length;lis[sel].setAttribute('aria-selected','true');lis[sel].scrollIntoView({block:'nearest'})}
 inp.addEventListener('input',draw);
 inp.addEventListener('keydown',e=>{if(e.key==='ArrowDown'){e.preventDefault();move(1)}else if(e.key==='ArrowUp'){e.preventDefault();move(-1)}else if(e.key==='Enter')go(sel)});
 list.addEventListener('click',e=>{const l=e.target.closest('li[data-n]');if(l)go(+l.dataset.n)});
 ov.addEventListener('click',e=>{if(e.target===ov)close()});
 addEventListener('keydown',e=>{
  if((e.ctrlKey||e.metaKey)&&e.key.toLowerCase()==='k'){e.preventDefault();ov.hidden?open():close()}
  else if(e.key==='Escape'&&!ov.hidden)close();
 });
 document.addEventListener('click',e=>{if(e.target.closest('#searchBtn'))open()});
})();
