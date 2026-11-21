/* Learner focus timer, weekly study target and portable progress backup. */
(function(){
 const $=id=>document.getElementById(id);if(!$('focusClock'))return;
 const pad=n=>String(n).padStart(2,'0');
 const dateKey=d=>d.getFullYear()+'-'+pad(d.getMonth()+1)+'-'+pad(d.getDate());
 const weekKeys=()=>{const out=[],d=new Date();d.setHours(12,0,0,0);for(let i=0;i<7;i++){out.push(dateKey(d));d.setDate(d.getDate()-1)}return out};
 const readGoal=()=>Math.max(60,Math.min(3000,Number(DTS.get('weeklyGoal',300))||300));
 let duration=25*60,remaining=duration,tick=null,running=false,endsAt=0;
 const clock=()=>{ $('focusClock').textContent=pad(Math.floor(remaining/60))+':'+pad(remaining%60); };
 function renderGoal(){
  const log=DTS.get('focusLog',{}),minutes=weekKeys().reduce((n,k)=>n+(Number(log[k])||0),0),goal=readGoal(),pct=Math.min(100,Math.round(minutes/goal*100));
  $('weekMinutes').textContent=minutes;$('goalMinutes').textContent=goal;$('weeklyGoal').value=goal;$('goalFill').style.width=pct+'%';$('goalProgress').setAttribute('aria-valuenow',String(pct));
  $('goalMessage').textContent=pct>=100?'Weekly target reached. Excellent consistency.':`${goal-minutes} minutes to reach your weekly target. Keep going.`;
 }
 function stop(){if(tick){clearInterval(tick);tick=null}running=false;endsAt=0;$('focusPause').disabled=true;$('focusStart').disabled=false;$('focusStart').textContent=remaining===0?'Start another session':'Resume';}
 function reset(){stop();duration=Number($('focusLength').value)*60;remaining=duration;clock();$('focusStart').textContent='Start focus';$('focusStatus').textContent='Timer reset. Choose one task and begin.';}
 function complete(){stop();remaining=0;clock();const today=dateKey(new Date()),log=DTS.get('focusLog',{});log[today]=(Number(log[today])||0)+Math.round(duration/60);DTS.set('focusLog',log);const days=DTS.get('days',[]);if(!days.includes(today)){days.push(today);DTS.set('days',days)}$('focusStatus').textContent=`Session complete: ${Math.round(duration/60)} focused minutes added to your weekly target.`;$('focusStart').textContent='Start another session';renderGoal();}
 $('focusLength').addEventListener('change',reset);
 function updateTimer(){if(!running)return;remaining=Math.max(0,Math.ceil((endsAt-Date.now())/1000));clock();if(remaining===0)complete()}
 $('focusStart').addEventListener('click',()=>{if(running)return;if(remaining<=0){duration=Number($('focusLength').value)*60;remaining=duration;clock()}running=true;endsAt=Date.now()+remaining*1000;$('focusPause').disabled=false;$('focusStart').disabled=true;$('focusStatus').textContent='Focus mode is on. Stay with one task until the timer ends.';tick=setInterval(updateTimer,250);updateTimer()});
 $('focusPause').addEventListener('click',()=>{if(!running)return;updateTimer();if(running){remaining=Math.max(0,Math.ceil((endsAt-Date.now())/1000));stop();clock();$('focusStatus').textContent='Paused. Resume when you are ready.'}});
 document.addEventListener('visibilitychange',()=>{if(!document.hidden)updateTimer()});
 $('focusReset').addEventListener('click',reset);
 $('saveGoal').addEventListener('click',()=>{const n=Number($('weeklyGoal').value);if(!Number.isInteger(n)||n<60||n>3000){$('goalMessage').textContent='Choose a whole number between 60 and 3,000 minutes.';return}DTS.set('weeklyGoal',n);renderGoal()});
 renderGoal();clock();

 const BACKUP_KEYS=['done','days','last','chal','tests','name','focusLog','weeklyGoal'];
 const status=t=>{$('backupStatus').textContent=t};
 const snapshot=()=>{const data={};BACKUP_KEYS.forEach(k=>{const v=DTS.get(k,undefined);if(v!==undefined)data[k]=v});return{format:'dts-progress-backup',version:1,exportedAt:new Date().toISOString(),data}};
 $('exportProgress').addEventListener('click',()=>{try{const blob=new Blob([JSON.stringify(snapshot(),null,2)],{type:'application/json'}),url=URL.createObjectURL(blob),a=document.createElement('a');a.href=url;a.download='duncans-tech-schools-progress-'+dateKey(new Date())+'.json';document.body.appendChild(a);a.click();a.remove();URL.revokeObjectURL(url);status('Your progress backup has been downloaded. Keep it somewhere safe.')}catch(e){status('Could not create the backup. Please try again.')}});
 $('importProgress').addEventListener('change',async e=>{
  const file=e.target.files&&e.target.files[0];if(!file)return;
  try{
   if(file.size>5*1024*1024)throw new Error('That backup is too large to import.');
   const parsed=JSON.parse(await file.text());if(parsed.format!=='dts-progress-backup'||parsed.version!==1||!parsed.data||typeof parsed.data!=='object')throw new Error('This is not a recognised Duncan’s Tech Schools backup.');
   if(!confirm('Restore this backup by merging it with the progress on this device? Existing progress will be kept.'))return;
   const d=parsed.data;
   if(d.done&&typeof d.done==='object')DTS.set('done',{...DTS.get('done',{}),...d.done});
   if(d.chal&&typeof d.chal==='object')DTS.set('chal',{...DTS.get('chal',{}),...d.chal});
   if(Array.isArray(d.days))DTS.set('days',[...new Set([...DTS.get('days',[]),...d.days.filter(x=>/^\d{4}-\d{2}-\d{2}$/.test(x))])].sort());
   if(d.tests&&typeof d.tests==='object'){const current=DTS.get('tests',{}),merged={...current};Object.entries(d.tests).forEach(([k,v])=>{if(!v||typeof v!=='object')return;const old=merged[k];merged[k]=old?{...((v.at||0)>(old.at||0)?v:old),best:Math.max(v.best||0,old.best||0),attempts:Math.max(v.attempts||0,old.attempts||0)}:v});DTS.set('tests',merged)}
   if(d.focusLog&&typeof d.focusLog==='object'){const current=DTS.get('focusLog',{}),merged={...current};Object.entries(d.focusLog).forEach(([k,v])=>{if(/^\d{4}-\d{2}-\d{2}$/.test(k)&&Number.isFinite(Number(v)))merged[k]=Math.max(Number(merged[k])||0,Number(v))});DTS.set('focusLog',merged)}
   if(!DTS.get('last',null)&&d.last)DTS.set('last',d.last);if(!DTS.get('name','')&&typeof d.name==='string')DTS.set('name',d.name);
   if(Number.isInteger(d.weeklyGoal)&&d.weeklyGoal>=60&&d.weeklyGoal<=3000)DTS.set('weeklyGoal',d.weeklyGoal);
   status('Backup restored. Your existing progress was preserved. Refreshing your dashboard…');setTimeout(()=>location.reload(),900);
  }catch(err){status(err.message||'Could not read that backup.')}finally{e.target.value=''}
 });
})();
