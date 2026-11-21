(function(){
 const $=s=>document.querySelector(s);

 const pg=$('#pathGrid');
 if(pg) PATHS.forEach(p=>{
  const el=document.createElement('article');el.className='card reveal';el.style.setProperty('--c',p.c);
  el.innerHTML=`<div class="ico">${p.ico.replace('<','&lt;').replace('>','&gt;')}</div><h3>${p.t}</h3><p>${p.d}</p><ul>${p.s.map(s=>`<li>${s}</li>`).join('')}</ul>`;
  pg.appendChild(el);
 });
 document.addEventListener('pointermove',e=>{
  document.querySelectorAll('.card:hover').forEach(c=>{
   const r=c.getBoundingClientRect(),x=(e.clientX-r.left)/r.width-.5,y=(e.clientY-r.top)/r.height-.5;
   c.style.transform=`rotateY(${x*14}deg) rotateX(${-y*14}deg) translateZ(10px)`;
  });
 });
 document.addEventListener('pointerout',e=>{const c=e.target.closest&&e.target.closest('.card');if(c)c.style.transform=''});

 const cats=Object.keys(LIB),all=[];
 cats.forEach((cat,i)=>LIB[cat].forEach(([n,u,d])=>all.push({n,u,d,cat,c:COLORS[i%COLORS.length]})));
 let active='All';
 const chips=$('#chips'),grid=$('#resGrid'),search=$('#search'),count=$('#count');
 if(chips&&grid&&search&&count){
  ['All',...cats].forEach(name=>{
   const b=document.createElement('button');b.className='chip';b.textContent=name;b.setAttribute('aria-pressed',name==='All');
   b.onclick=()=>{active=name;chips.querySelectorAll('.chip').forEach(x=>x.setAttribute('aria-pressed',x===b));render()};chips.appendChild(b);
  });
  function render(){const q=search.value.trim().toLowerCase();const list=all.filter(r=>(active==='All'||r.cat===active)&&(!q||(r.n+r.d+r.cat).toLowerCase().includes(q)));count.textContent=`${list.length} of ${all.length} sites`;grid.innerHTML=list.length?list.map(r=>`<a class="card" style="--c:${r.c}" href="${r.u}" target="_blank" rel="noopener noreferrer"><span class="tag">${r.cat}</span><h3>${r.n}</h3><p>${r.d}</p></a>`).join(''):'<p class="sub">No sites match. Try a shorter word, like "sql" or "react".</p>';}
  search.addEventListener('input',render);render();
 }

 const timeline=$('#timeline');if(timeline)timeline.innerHTML=STEPS.map(([a,b])=>`<li class="reveal"><b>${a}</b><p>${b}</p></li>`).join('');

 const out=$('#typed'),lines=CODE.map(l=>l[0]);
 if(out && matchMedia('(prefers-reduced-motion: reduce)').matches){out.innerHTML=lines.join('\n')}
 else if(out){
  let i=0,html='';
  (function next(){
   if(i>=lines.length){setTimeout(()=>{i=0;html='';out.innerHTML='';next()},4000);return}
   html+=lines[i++]+'\n';out.innerHTML=html;setTimeout(next,420);
  })();
 }

 const io=new IntersectionObserver(es=>es.forEach(e=>{
  if(!e.isIntersecting)return;io.unobserve(e.target);
  const el=e.target,end=+el.dataset.count;let n=0;
  const step=()=>{n+=Math.ceil(end/40);el.textContent=Math.min(n,end)+(end===60?'+':'');if(n<end)requestAnimationFrame(step)};step();
 }),{threshold:.6});
 document.querySelectorAll('[data-count]').forEach(el=>io.observe(el));

 const rv=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting){e.target.classList.add('in');rv.unobserve(e.target)}}),{threshold:.15});
 document.querySelectorAll('.reveal').forEach(el=>rv.observe(el));

 addEventListener('scroll',()=>{const bar=$('#progress');if(bar){const h=document.documentElement;bar.style.width=(scrollY/(h.scrollHeight-innerHeight)*100)+'%'}},{passive:true});
})();
