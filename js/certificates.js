(function(){
 var app=document.getElementById('certApp'),P=new URLSearchParams(location.search),cid=P.get('c');
 function esc(s){return String(s).replace(/[&<>"]/g,function(c){return{'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]})}
 function course(id){return COURSES.filter(function(c){return c.id===id})[0]}
 function prog(id){var n=LESSONS[id].lessons.length,d=DTS.get('done',{}),k=0;for(var i=0;i<n;i++)if(d[id+':'+i])k++;return[k,n]}
 function certs(){return DTS.get('certs',{})}
 function hub(){
  app.innerHTML='<div class="ct-grid">'+COURSES.filter(function(c){return LESSONS[c.id]}).map(function(c){var p=prog(c.id),full=p[0]===p[1],has=certs()[c.id];
   return '<div class="ct-card"><b>'+esc(c.t)+'</b><div class="ct-bar"><i style="width:'+Math.round(100*p[0]/p[1])+'%"></i></div><span>'+p[0]+' of '+p[1]+' lessons</span>'+
   (full||has?'<a class="btn small" href="/certificates?c='+c.id+'">'+(has?'View certificate':'Get certificate')+'</a>':'<a class="btn small ghost" href="/lessons/'+c.id+'-'+(p[0]+1>p[1]?1:p[0]+1)+'">Continue course</a>')+'</div>'}).join('')+'</div>';
 }
 /* Shrink a line only when it is wider than its box (long names, long course titles, longer IDs). */
 function fitText(){
  function run(){var f=document.querySelectorAll('#certSheet .cert-f');for(var i=0;i<f.length;i++){var p=f[i],s=p.firstChild;p.style.removeProperty('--k');var w=s.getBoundingClientRect().width,max=p.clientWidth;if(w>max)p.style.setProperty('--k',(max/w*0.98).toFixed(4))}}
  run();if(document.fonts&&document.fonts.ready)document.fonts.ready.then(run);
 }
 function render(id,rec){
  var c=course(id);
  var when=DTSCert.fmt(rec.date),ctitle=DTSCert.title(c.t);
  app.innerHTML='<article class="cert" id="certSheet"><div class="cert-in">'+
   '<p class="cert-sr">Certificate of Completion from Duncan\'s Tech Schools. '+esc(rec.name)+' has successfully completed the course '+esc(ctitle)+'. Completed on '+esc(when)+'. Certificate ID '+esc(rec.code)+'.</p>'+
   '<p class="cert-f cert-name" aria-hidden="true"><span>'+esc(rec.name)+'</span></p>'+
   '<p class="cert-f cert-course" aria-hidden="true"><span>'+esc(ctitle)+'</span></p>'+
   '<p class="cert-f cert-date" aria-hidden="true"><span>Completed on '+esc(when)+'</span></p>'+
   '<p class="cert-f cert-code" aria-hidden="true"><span>'+esc(rec.code)+'</span></p>'+
   (rec.signed?'<p class="cert-f cert-signed" aria-hidden="true"><span>Digitally signed by the school</span></p>':'')+
   '<p class="cert-f cert-verify" aria-hidden="true"><span>Verify at duncans-tech-schools.netlify.app/verify</span></p>'+
   '</div></article><div class="st-actions"><button class="btn" id="ctPrint" type="button">Print or save as PDF</button><button class="btn ghost" id="ctChange" type="button">Change name</button>'+(rec.signed?'':'<button class="btn ghost" id="ctSign" type="button">Get a signed ID</button>')+'<a class="btn ghost" href="/certificates">All certificates</a></div>';
  fitText();
  document.getElementById('ctPrint').onclick=function(){window.print()};
  document.getElementById('ctChange').onclick=function(){form(id,rec.name)};var sg=document.getElementById('ctSign');if(sg)sg.onclick=function(){issue(id,rec.name)};
 }
 function issue(id,name){
  var p=prog(id),old=certs()[id],all=certs(),nm=name.trim().replace(/\s+/g,' ');
  function store(rec){all[id]=rec;DTS.set('certs',all);DTS.set('certname',rec.name);render(id,rec)}
  fetch('/.netlify/functions/certificate',{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify({cid:id,name:nm})})
   .then(function(r){return r.ok?r.json():Promise.reject()})
   .then(function(j){store({name:j.name,date:j.date,n:j.n,code:j.code,signed:true})})
   .catch(function(){var iso=old?old.date:new Date().toISOString().slice(0,10);store({name:nm,date:iso,n:p[1],code:DTSCert.make(id,iso,p[1],nm),signed:false})});
 }
 function form(id,prefill){
  app.innerHTML='<form class="vf-form" id="ctForm"><p>Great work! Enter your full name exactly as you want it to appear.</p><label>Full name<input id="ctName" maxlength="60" required value="'+esc(prefill||DTS.get('certname','')||'')+'"></label><button class="btn" type="submit">Create certificate</button></form>';
  document.getElementById('ctForm').onsubmit=function(e){e.preventDefault();var n=document.getElementById('ctName').value.trim();if(n)issue(id,n)};
 }
 if(!cid||!LESSONS[cid]||!course(cid)){hub();return}
 var p=prog(cid);
 if(certs()[cid])render(cid,certs()[cid]);
 else if(p[0]===p[1])form(cid);
 else app.innerHTML='<div class="st-result"><b>'+esc(course(cid).t)+'</b><p>You have completed '+p[0]+' of '+p[1]+' lessons. Finish the rest to earn this certificate.</p><a class="btn" href="/lessons/'+cid+'-'+(p[0]+1)+'">Continue the course</a> <a class="btn ghost" href="/certificates">All certificates</a></div>';
})();
