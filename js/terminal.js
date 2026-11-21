(function(){
 var T=window.CMD_TRACKS,$=function(s){return document.getElementById(s)},tab=0,idx=0,tries=0;
 var log=$('tlLog'),inp=$('tlIn'),tabs=$('tlTabs');
 function done(){return DTS.get('cmdlab',{})}
 function key(t,i){return T[t].id+':'+i}
 function firstOpen(t){var d=done(),i=0;while(i<T[t].tasks.length&&d[key(t,i)])i++;return i}
 function line(txt,cls){var d=document.createElement('div');d.className=cls||'';d.textContent=txt;log.appendChild(d);$('tlTerm').scrollTop=1e6}
 function show(){
  var tr=T[tab],n=tr.tasks.length,d=done(),c=0;for(var i=0;i<n;i++)if(d[key(tab,i)])c++;
  $('tlPrompt').textContent=tr.host;$('tlProg').textContent=c+' of '+n+' done';
  if(idx>=n){$('tlTask').textContent=c===n?'All '+n+' tasks complete. Well done!':'You reached the end. Use Skip to revisit tasks you skipped.';inp.disabled=true;return}
  inp.disabled=false;$('tlTask').textContent='Task '+(idx+1)+' of '+n+': '+tr.tasks[idx].p;tries=0;inp.focus();
 }
 function pick(t){tab=t;idx=firstOpen(t);log.innerHTML='';
  Array.prototype.forEach.call(tabs.children,function(b,i){b.setAttribute('aria-selected',String(i===t))});show()}
 T.forEach(function(t,i){var b=document.createElement('button');b.type='button';b.setAttribute('role','tab');b.textContent=t.name;b.onclick=function(){pick(i)};tabs.appendChild(b)});
 inp.addEventListener('keydown',function(e){
  if(e.key!=='Enter')return;var raw=inp.value,cmd=raw.trim().replace(/\s+/g,' ');inp.value='';
  line(T[tab].host+' '+raw,'tl-cmd');if(!cmd||idx>=T[tab].tasks.length)return;
  var task=T[tab].tasks[idx];
  if(new RegExp(task.re).test(cmd)){
   if(task.o)line(task.o,'tl-out');line('Correct!','tl-ok');var d=done();d[key(tab,idx)]=true;DTS.set('cmdlab',d);idx++;show();
  }else{tries++;line('Not quite. '+(tries>=2?'Press "Show hint" for help.':'Check the command and try again.'),'tl-bad')}
 });
 $('tlHint').onclick=function(){if(idx<T[tab].tasks.length){line('Hint: '+T[tab].tasks[idx].ex,'tl-hint');inp.focus()}};
 $('tlSkip').onclick=function(){if(idx<T[tab].tasks.length){idx++;show()}};
 pick(0);
})();
