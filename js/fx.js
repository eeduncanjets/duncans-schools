window.FX={confetti(){
 if(matchMedia('(prefers-reduced-motion: reduce)').matches)return;
 const c=document.createElement('canvas');c.style.cssText='position:fixed;inset:0;width:100%;height:100%;pointer-events:none;z-index:60';
 c.width=innerWidth;c.height=innerHeight;document.body.appendChild(c);const x=c.getContext('2d');if(!x){c.remove();return}
 const cols=['#2DE2E6','#7C5CFF','#FFB547','#FF6B9A','#4ADE80'];
 const ps=Array.from({length:120},()=>({x:innerWidth/2+(Math.random()-.5)*200,y:innerHeight*.6,vx:(Math.random()-.5)*14,vy:-Math.random()*16-4,s:4+Math.random()*6,c:cols[Math.random()*5|0],r:Math.random()*6,vr:(Math.random()-.5)*.4}));
 let f=0;(function tick(){x.clearRect(0,0,c.width,c.height);ps.forEach(p=>{p.vy+=.5;p.x+=p.vx;p.y+=p.vy;p.r+=p.vr;x.save();x.translate(p.x,p.y);x.rotate(p.r);x.fillStyle=p.c;x.fillRect(-p.s/2,-p.s/2,p.s,p.s*.6);x.restore()});if(++f<110)requestAnimationFrame(tick);else c.remove()})();
}};
/* Card spotlight follows the pointer */
document.addEventListener('pointermove',e=>{const c=e.target.closest&&e.target.closest('.card');if(c){const r=c.getBoundingClientRect();c.style.setProperty('--mx',(e.clientX-r.left)+'px');c.style.setProperty('--my',(e.clientY-r.top)+'px')}},{passive:true});
/* Share buttons */
document.addEventListener('DOMContentLoaded',()=>document.querySelectorAll('.share').forEach(el=>{
 const u=location.href,t=document.title,e=encodeURIComponent;
 el.innerHTML=`<span>Share</span>${navigator.share?'<button type="button" data-a="n">Share</button>':''}<a href="https://wa.me/?text=${e(t+' '+u)}" target="_blank" rel="noopener noreferrer">WhatsApp</a><a href="https://twitter.com/intent/tweet?text=${e(t)}&url=${e(u)}" target="_blank" rel="noopener noreferrer">X</a><button type="button" data-a="c">Copy link</button>`;
 el.addEventListener('click',async ev=>{const b=ev.target.closest('button');if(!b)return;
  if(b.dataset.a==='n'){try{await navigator.share({title:t,url:u})}catch(x){}}
  else{try{await navigator.clipboard.writeText(u);b.textContent='Copied'}catch(x){b.textContent='Copy failed'}setTimeout(()=>b.textContent='Copy link',1500)}});
}));
