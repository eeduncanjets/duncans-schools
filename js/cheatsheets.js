(function(){
 const $=s=>document.querySelector(s);
 const keys=Object.keys(CHEATS);let cur='All';
 ['All',...keys].forEach(k=>{const b=document.createElement('button');b.className='chip';b.textContent=k;b.setAttribute('aria-pressed',k==='All');
  b.onclick=()=>{cur=k;$('#chTabs').querySelectorAll('.chip').forEach(x=>x.setAttribute('aria-pressed',x===b));draw()};$('#chTabs').appendChild(b)});
 const esc=s=>s.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/"/g,'&quot;');
 function draw(){
  const q=$('#chSearch').value.trim().toLowerCase();
  $('#chGrid').innerHTML=keys.filter(k=>cur==='All'||k===cur).map(k=>{
   const rows=CHEATS[k].filter(([c,d])=>!q||(c+d+k).toLowerCase().includes(q));
   return rows.length?`<section class="sheet"><h3>${k}</h3>${rows.map(([c,d])=>`<button class="snip" data-c="${esc(c)}"><code>${esc(c)}</code><span>${d}</span></button>`).join('')}</section>`:'';
  }).join('')||'<p class="sub">No snippets match. Try another word.</p>';
 }
 $('#chSearch').addEventListener('input',draw);
 $('#chGrid').addEventListener('click',async e=>{
  const b=e.target.closest('.snip');if(!b)return;
  const txt=b.dataset.c,s=b.querySelector('span'),old=s.textContent;
  try{await navigator.clipboard.writeText(txt);s.textContent='Copied'}catch(err){s.textContent='Select the code to copy'}
  setTimeout(()=>s.textContent=old,1200);
 });
 draw();
})();
