(function(){
 const $=s=>document.querySelector(s);
 const done=DTS.get('done',{});
 const stats=Object.keys(LESSONS).map(id=>{
  const L=LESSONS[id].lessons,n=L.filter((_,i)=>done[id+':'+i]).length,next=L.findIndex((_,i)=>!done[id+':'+i]);
  return{id,title:LESSONS[id].title,n,total:L.length,pct:Math.round(n/L.length*100),next:next<0?0:next};
 });
 const tot=stats.reduce((a,c)=>a+c.total,0),dn=stats.reduce((a,c)=>a+c.n,0),pct=tot?Math.round(dn/tot*100):0;
 const complete=stats.filter(c=>c.pct===100),streak=DTS.streak();
 $('#ring').style.strokeDashoffset=339.3*(1-pct/100);$('#ringTxt').textContent=pct+'%';
 const T=DTS.get('tests',{}),tk=Object.keys(T),avg=tk.length?Math.round(tk.reduce((a,k)=>a+T[k].best,0)/tk.length):0,DBG=Object.keys(DTS.get('chal',{})).filter(k=>k.indexOf('dbg-')===0).length;
 $('#testList').innerHTML=tk.length?tk.map(k=>`<div class="row-card"><div><b>${T[k].title||k}</b><span>${T[k].attempts} attempt${T[k].attempts===1?'':'s'}</span></div><div class="bar"><i style="width:${T[k].best}%"></i></div><em>${T[k].best}%</em></div>`).join(''):'<p class="sub">No practice tests yet. <a href="/practice">Take your first one</a>.</p>';
 $('#kpis').innerHTML=[[dn+' / '+tot,'lessons complete'],[streak+(streak===1?' day':' days'),'learning streak'],[complete.length,'courses finished'],[DTS.get('days',[]).length,'active days'],[Object.keys(DTS.get('chal',{})).length,'challenges solved'],[tk.length?avg+'%':'0','practice average']].map(([a,b])=>`<div class="kpi"><b>${a}</b><span>${b}</span></div>`).join('');
 $('#courseList').innerHTML=stats.map(c=>`<a class="row-card" href="${DTS.lessonUrl(c.id,c.next)}"><div><b>${c.title}</b><span>${c.n} of ${c.total} lessons</span></div><div class="bar"><i style="width:${c.pct}%"></i></div><em>${c.pct===100?'Review':c.n?'Continue':'Start'}</em></a>`).join('');
 const has=id=>stats.find(c=>c.id===id).pct===100;
 const B=[['Test taker','Complete a practice test',tk.length>=1],['Exam ready','Score 80% or more on a test',tk.some(k=>T[k].best>=80)],['Bug hunter','Solve 3 debug challenges',DBG>=3],['First step','Complete 1 lesson',dn>=1],['Getting going','Complete 10 lessons',dn>=10],['Halfway there','Reach 50% overall',pct>=50],['On a roll','3-day streak',streak>=3],['Web trio','Finish HTML, CSS and JavaScript',has('html')&&has('css')&&has('js')],['Pythonista','Finish the Python course',has('python')],['Data wrangler','Finish the SQL course',has('sql')],['Version control','Finish Git',has('git')],['Problem solver','Solve 5 coding challenges',Object.keys(DTS.get('chal',{})).length>=5]];
 $('#badges').innerHTML=B.map(([t,d,on])=>`<div class="badge ${on?'on':''}"><i>${on?'&#9733;':'&#9734;'}</i><b>${t}</b><span>${d}</span></div>`).join('');
 const nameEl=$('#certName');nameEl.value=DTS.get('name','');nameEl.oninput=()=>DTS.set('name',nameEl.value);
 $('#certs').innerHTML=complete.length?complete.map(c=>`<div class="row-card"><div><b>${c.title.split(' (')[0]}</b><span>All ${c.total} lessons complete</span></div><span></span><button class="btn small" data-c="${c.id}">Download certificate</button></div>`).join(''):'<p class="sub">No certificates yet. Finish a course to unlock one.</p>';
 $('#certs').addEventListener('click',e=>{const b=e.target.closest('button[data-c]');if(b)cert(nameEl.value.trim(),LESSONS[b.dataset.c].title.split(' (')[0])});
 $('#resetAll').onclick=()=>{if(confirm('Reset all lessons, streaks and badges on this device?')){DTS.set('done',{});DTS.set('days',[]);DTS.set('last',null);DTS.set('chal',{});DTS.set('tests',{});location.reload()}};
 async function cert(name,course){
  if(!name){alert('Enter the student name before downloading the certificate.');nameEl.focus();return;}
  try{
   if(!window.jspdf||!window.jspdf.jsPDF) await loadPdfLibrary();
   if(!window.jspdf||!window.jspdf.jsPDF) throw new Error('The PDF library could not be loaded. Please check your internet connection and try again.');
   const id=courseIdForTitle(course),saved=(DTS.get('certs',{})||{})[id];
   const iso=saved?saved.date:new Date().toISOString().slice(0,10);
   const cname=name.trim().replace(/\s+/g,' ');
   const rec=saved&&DTSCert.norm(saved.name)===DTSCert.norm(cname)?saved:{name:cname,date:iso,code:DTSCert.make(id||'dts',iso,LESSONS[id]?LESSONS[id].lessons.length:0,cname),signed:false};
   if(document.fonts){await Promise.all(['700 40px Tinos','italic 700 40px Tinos','700 40px "Barlow Semi Condensed"','600 40px "Barlow Semi Condensed"'].map(f=>document.fonts.load(f).catch(()=>{})));}
   const img=await loadCertificateImage('/images/certificates/dts-certificate-bg.jpg');
   const canvas=document.createElement('canvas');canvas.width=1536;canvas.height=1024;
   const ctx=canvas.getContext('2d');ctx.drawImage(img,0,0,1536,1024);
   ctx.textAlign='center';ctx.textBaseline='middle';
   // Same sizes and positions as the certificate page (measured from the approved artwork).
   const line=(text,cx,cy,maxW,size,font,color)=>{let s=size;ctx.font=font(s);const w=ctx.measureText(text).width;if(w>maxW){s=size*maxW/w*0.98;ctx.font=font(s);}ctx.fillStyle=color;ctx.fillText(text,cx,cy);};
   const serif=(w,i)=>s=>`${i?'italic ':''}${w} ${s}px Tinos,"Times New Roman",Georgia,serif`;
   const sans=w=>s=>`${w} ${s}px "Barlow Semi Condensed","Arial Narrow",Arial,sans-serif`;
   line(rec.name.toUpperCase(),847.6,427.5,815,86.7,serif(700),'#071f49');
   line(DTSCert.title(course),857,593,755,68.3,serif(700),'#ffffff');
   line('Completed on '+DTSCert.fmt(rec.date),855,678.5,670,45.6,serif(700,true),'#09234c');
   line(rec.code,1360,832,300,25.4,sans(700),'#ffffff');
   if(rec.signed)line('Digitally signed by the school',1357,872,333,18.4,sans(600),'#0b2450');
   line('Verify at duncans-tech-schools.netlify.app/verify',1357,905,333,15.8,sans(600),'#0b2450');
   const {jsPDF}=window.jspdf;
   const pdf=new jsPDF({orientation:'landscape',unit:'mm',format:[297,198],compress:true});
   pdf.addImage(canvas.toDataURL('image/jpeg',0.96),'JPEG',0,0,297,198,undefined,'FAST');
   const safe=course.toLowerCase().replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'');
   pdf.save('duncan-tech-schools-'+safe+'-certificate.pdf');
  }catch(err){console.error('Certificate PDF error:',err);alert(err.message||'The certificate PDF could not be created. Please refresh and try again.');}
 }
 function courseIdForTitle(title){const key=Object.keys(LESSONS).find(id=>LESSONS[id].title.split(' (')[0]===title);return key||'';}
 function loadCertificateImage(src){return new Promise((resolve,reject)=>{const image=new Image();image.onload=()=>resolve(image);image.onerror=()=>reject(new Error('The certificate artwork could not be loaded. Please refresh the page and try again.'));image.src=src;});}
 function loadPdfLibrary(){return new Promise((resolve,reject)=>{const urls=['https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.2/jspdf.umd.min.js','https://cdn.jsdelivr.net/npm/jspdf@2.5.2/dist/jspdf.umd.min.js'];let i=0;const next=()=>{if(window.jspdf&&window.jspdf.jsPDF){resolve();return;}if(i>=urls.length){reject(new Error('The PDF service could not load. Check your internet connection and try again.'));return;}const script=document.createElement('script');script.src=urls[i++];script.onload=()=>window.jspdf&&window.jspdf.jsPDF?resolve():next();script.onerror=next;document.head.appendChild(script);};next();});}
})();
