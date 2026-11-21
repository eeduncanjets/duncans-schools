(function(){
 var box=document.getElementById('reviewList');
 function esc(s){return String(s).replace(/[&<>"]/g,function(c){return{'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]})}
 function render(){
  var m=DTS.get('missed',{}),d=DTS.get('done',{}),keys=Object.keys(m).filter(function(k){var p=k.split(':');return LESSONS[p[0]]&&LESSONS[p[0]].lessons[+p[1]]}).sort(function(a,b){return m[b]-m[a]});
  if(!keys.length){box.innerHTML='<div class="st-result">Nothing to review. Questions you miss in lessons will appear here.</div>';return}
  box.innerHTML='<p>'+keys.length+' question'+(keys.length>1?'s':'')+' to review.</p>';
  keys.forEach(function(k){
   var p=k.split(':'),L=LESSONS[p[0]].lessons[+p[1]],q=L.q,card=document.createElement('div');card.className='rv-card';
   card.innerHTML='<p class="rv-meta">'+esc(LESSONS[p[0]].title)+' - <a href="/lessons/'+p[0]+'-'+(+p[1]+1)+'">'+esc(L.t)+'</a></p><p class="rv-q">'+esc(q.q)+'</p><div class="rv-opts"></div><p class="rv-msg" aria-live="polite"></p>';
   var opts=card.querySelector('.rv-opts'),msg=card.querySelector('.rv-msg');
   q.o.forEach(function(o,i){var b=document.createElement('button');b.type='button';b.textContent=o;b.onclick=function(){
    if(i===q.a){var mm=DTS.get('missed',{});delete mm[k];DTS.set('missed',mm);b.classList.add('ok');msg.textContent='Correct. Removed from your review list.';Array.prototype.forEach.call(opts.children,function(x){x.disabled=true});setTimeout(render,1400)}
    else{b.classList.add('bad');msg.textContent='Not quite. Try another answer.'}};opts.appendChild(b)});
   box.appendChild(card);
  });
 }
 render();
})();
