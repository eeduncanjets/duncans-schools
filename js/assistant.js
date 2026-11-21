/* Study helper. Uses the AI function when it is set up; otherwise a built-in helper that searches the site. */
(function(){
 const C=window.DTS_CONFIG||{};let aiOk=null,history=[],built=false,busy=false;
 const esc=s=>String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
 const strip=h=>String(h).replace(/<[^>]+>/g,' ').replace(/&lt;/g,'<').replace(/&gt;/g,'>').replace(/&amp;/g,'&').replace(/\s+/g,' ').trim();
 function fmt(t){return String(t).split(/(```[\s\S]*?```)/).map(p=>/^```/.test(p)?'<pre><code>'+esc(p.replace(/^```\w*\n?/,'').replace(/```$/,'').replace(/\n$/,''))+'</code></pre>':esc(p).replace(/`([^`\n]+)`/g,'<code>$1</code>').replace(/\*\*([^*]+)\*\*/g,'<b>$1</b>').replace(/\n/g,'<br>')).join('')}
 const fab=document.createElement('button');fab.className='ask-fab';fab.id='askFab';fab.setAttribute('aria-label','Open Study Pal');fab.setAttribute('aria-expanded','false');fab.innerHTML='<span aria-hidden="true">✦</span> Study Pal';
 const panel=document.createElement('section');panel.className='ask';panel.id='askPanel';panel.hidden=true;panel.setAttribute('role','dialog');panel.setAttribute('aria-label','Study Pal learning assistant');
 panel.innerHTML='<header><div><b>Study Pal</b><small id="askMode"></small></div><button id="askClose" aria-label="Close the study helper">&times;</button></header><div class="ask-log" id="askLog" aria-live="polite"></div><div class="ask-chips" id="askChips"></div><form id="askForm"><input id="askIn" placeholder="Ask a question..." autocomplete="off" maxlength="500" aria-label="Your question"><button class="btn small" type="submit">Send</button></form>';
 document.body.append(fab,panel);
 const log=panel.querySelector('#askLog'),inp=panel.querySelector('#askIn'),chips=panel.querySelector('#askChips');
 const ctx=()=>{try{return window.DTS_CTX?window.DTS_CTX():{page:document.title}}catch(e){return{page:document.title}}};
 const isLesson=()=>!!window.DTS_CTX;
 function add(who,html){const d=document.createElement('div');d.className='msg '+who;d.innerHTML=html;log.appendChild(d);log.scrollTop=log.scrollHeight;return d}
 function setMode(){panel.querySelector('#askMode').textContent=aiOk===true?' AI helper':aiOk===false?' Built-in helper':''}
 function suggest(){
  const l=isLesson();
  const list=l?['Explain this lesson simply','Give me a hint','Quiz me on this lesson','Create flashcards','Start a 25-minute focus session']:['Build me a study plan','Quiz me on JavaScript','Create flashcards for beginners','What should I learn first?','Start a 25-minute focus session'];
  chips.innerHTML=list.map(t=>`<button type="button">${esc(t)}</button>`).join('');
 }
 function open(){
  panel.hidden=false;fab.setAttribute('aria-expanded','true');
  if(!built){built=true;add('bot',fmt('Hi! I’m Study Pal, your learning companion. I can explain concepts, give hints without spoiling answers, quiz you, create revision flashcards, help debug code and build a study plan. What are we learning today?'));suggest()}
  setMode();inp.focus();
 }
 function close(){panel.hidden=true;fab.setAttribute('aria-expanded','false');fab.focus()}
 fab.onclick=()=>panel.hidden?open():close();
 panel.querySelector('#askClose').onclick=close;
 addEventListener('keydown',e=>{if(e.key==='Escape'&&!panel.hidden)close()});
 chips.addEventListener('click',e=>{const b=e.target.closest('button');if(b)send(b.textContent)});
 panel.querySelector('#askForm').onsubmit=e=>{e.preventDefault();const q=inp.value.trim();if(q){inp.value='';send(q)}};

 /* ----- built-in helper ----- */
 const idx=[];
 function build(){
  if(idx.length)return;
  if(typeof LESSONS!=='undefined')Object.keys(LESSONS).forEach(id=>LESSONS[id].lessons.forEach((l,i)=>idx.push({t:l.t+' ('+LESSONS[id].title.split(' (')[0]+')',u:'/lessons/'+id+'-'+(i+1),h:(l.t+' '+l.t+' '+l.t+' '+strip(l.body)).toLowerCase(),k:'Lesson'})));
  if(typeof COURSES!=='undefined')COURSES.forEach(c=>idx.push({t:c.t,u:'/courses/'+c.id,h:(c.t+' '+c.t+' '+c.d+' '+c.cat).toLowerCase(),k:'Course'}));
  if(typeof CHEATS!=='undefined')Object.keys(CHEATS).forEach(k=>CHEATS[k].forEach(([c,d])=>idx.push({t:k+': '+d,u:'/cheatsheets',h:(k+' '+c+' '+d).toLowerCase(),k:'Cheat sheet'})));
 }
 const STOP=new Set('a an the is are to of in on for and or i me my how do does what why can you it this that with be about when where which please help'.split(' '));
 const toks=s=>s.toLowerCase().replace(/[^a-z0-9+#.\s]/g,' ').split(/\s+/).filter(w=>w&&!STOP.has(w));
 const link=(u,t)=>`<a href="${u}">${esc(t)}</a>`;
 function local(q){
  const l=q.toLowerCase(),c=ctx(),code=c.code||'';
  if(/^(hi|hello|hey)\b/.test(l)&&l.length<20)return'Hello! I’m Study Pal. Tell me what you are studying and we’ll work through it together.';
  if(/flashcard/.test(l))return'Here is a starter revision set.\n\n**HTML** — What does HTML do?\nAnswer: It structures the content of a web page.\n\n**CSS** — What does CSS control?\nAnswer: The presentation and layout of a page.\n\n**JavaScript** — What is it used for?\nAnswer: Adding behaviour and interactivity.\n\n**Python** — How do you display text?\nAnswer: `print("Hello")`.\n\nTip: cover each answer, recall it, then check yourself. Ask me for flashcards on a specific topic to make a focused set.';
  if(/study plan|study schedule|roadmap/.test(l))return'Here is a practical 7-day starter plan (about 30–45 minutes a day):\n\n1. **Day 1:** Learn the core concepts and vocabulary.\n2. **Day 2:** Follow one worked example and type it yourself.\n3. **Day 3:** Complete two small exercises.\n4. **Day 4:** Review mistakes and make flashcards.\n5. **Day 5:** Build a mini-project using the topic.\n6. **Day 6:** Take a practice quiz and revisit weak areas.\n7. **Day 7:** Explain what you learned in your own words and improve your project.\n\nOpen the '+link('/dashboard','dashboard')+' to track your learning. Tell me your course and available study time for a more tailored plan.';
  if(/focus session|pomodoro|25.minute/.test(l))return'Your 25-minute focus session is ready. Choose one small goal, silence notifications and work on that task. When the timer ends, take a 5-minute break.';
  if(/certificate/.test(l))return'Finish every lesson in a course, then download your certificate from the '+link('/dashboard','dashboard')+'. It is self-issued by this site and is not an accredited qualification.';
  if(/(sign ?in|sign ?up|log ?in|account|register|password|sync)/.test(l))return(window.DTSAuth&&window.DTSAuth.configured)?'You can create a free account on the '+link('/account','account page')+' so your progress follows you between devices. Accounts are optional.':'Accounts are not switched on yet. Your progress is saved on this device. You can back it up from the '+link('/dashboard','dashboard')+'.';
  if(/(progress|streak|badge|reset)/.test(l))return'Your lessons, streak and badges are on the '+link('/dashboard','dashboard')+'. Progress is saved in your browser, and you can export a backup there.';
  if(/(offline|install)/.test(l))return'Once you have visited the site, many lessons work offline. On a phone, use your browser menu and choose "Add to Home screen" or "Install app".';
  if(/\b(free|cost|price|pay)\b/.test(l))return'Yes, the lessons, challenges, practice tests and tools are free.';
  if(/(quiz|test|exam|practice)/.test(l))return'Try the '+link('/practice','practice tests')+' (quick quizzes by topic and a timed mixed exam) or the '+link('/challenges','coding challenges')+', including debug-the-code ones.';
  if(/(where|how).*(start|begin)|first|roadmap|recommend|which course|what should i learn/.test(l))return'For websites, take '+link('/courses/html','HTML')+', then '+link('/courses/css','CSS')+', then '+link('/courses/js','JavaScript')+'. For general programming or data, start with '+link('/courses/python','Python')+'. Not sure? Answer three questions in the '+link('/#finder','path finder')+'.';
  if(/(debug|error|bug|fix|not working|broken|wrong|doesn.t work)/.test(l)){
   const lang=((c.course||'')+' '+code.slice(0,200)).toLowerCase();
   const tip=/python|def |print\(/.test(lang)?'In Python check indentation, colons after if/for/def, and that every variable is spelled the same everywhere.':/sql|select /.test(lang)?'In SQL check quotes around text values, commas between columns, and that GROUP BY and JOIN use the right columns.':'In JavaScript check brackets and quotes, spelling (it is case sensitive), and use console.log to print values.';
   return'Here is a calm way to debug:<br>1. Read the error message from the bottom up.<br>2. Find the smallest piece of code that fails.<br>3. Print the values you expect to see.<br>4. Change one thing at a time.<br><br>'+esc(tip)+'<br><br>Read more in '+link('/blog/debugging-for-beginners','debugging for beginners')+'.'+(window.DTS_CTX?'':'');
  }
  if(/hint/.test(l)&&c.lesson)return'Re-read the task for "'+esc(c.lesson)+'", change one small thing, run it, and compare what you see with what the lesson expects. Look at the example and ask yourself what is different.';
  if(/explain/.test(l)&&c.task)return'<b>'+esc(c.lesson||'This lesson')+'</b>: '+esc(c.task.slice(0,380))+(c.task.length>380?'...':'')+'<br><br>Run the example, then change one value and run it again to see what happens.';
  build();
  const t=toks(q);if(!t.length)return'Could you ask that with a few more words? For example "how does a SQL join work".';
  const scored=idx.map(i=>({i,s:t.reduce((a,w)=>a+(i.h.indexOf(w)>-1?1:0)+(i.t.toLowerCase().indexOf(w)>-1?2:0),0)})).filter(x=>x.s>0).sort((a,b)=>b.s-a.s).slice(0,3);
  if(!scored.length)return'I could not find that. Try the search (Ctrl+K), or ask using keywords like "flexbox", "SQL join" or "git branch".';
  return'These pages should help:<br>'+scored.map(x=>'&bull; '+link(x.i.u,x.i.t)+' <small>('+x.i.k+')</small>').join('<br>');
 }

 /* ----- sending ----- */
 async function ai(q){
  const c=ctx(),ac=new AbortController(),to=setTimeout(()=>ac.abort(),25000);
  try{
   const r=await fetch(C.assistantUrl,{method:'POST',headers:{'Content-Type':'application/json'},signal:ac.signal,body:JSON.stringify({messages:history.slice(-10),context:{page:c.page||document.title,course:c.course,lesson:c.lesson,task:(c.task||'').slice(0,1200),code:(c.code||'').slice(0,3500)}})});
   if(r.status===429){return{text:'You are asking quickly. Please wait a minute and try again.'}}
   if(!r.ok)return null;
   const j=await r.json();return j&&j.reply?{text:j.reply}:null;
  }catch(e){return null}finally{clearTimeout(to)}
 }
 function startFocus(node){node.textContent='Use the Focus Timer on your dashboard so the session is counted toward your weekly study goal. '+ 'Open the dashboard: ';const a=document.createElement('a');a.href='/dashboard';a.textContent='Start a focus session';node.appendChild(a)}
 async function send(q){
  if(busy)return;busy=true;add('me',esc(q));history.push({role:'user',content:q});
  const wait=add('bot','<span class="dots"><i></i><i></i><i></i></span>');
  if(/focus session|pomodoro|25.minute/i.test(q)){startFocus(wait);history.push({role:'assistant',content:'Started a 25-minute focus timer.'});busy=false;return}
  let out=null;
  if(aiOk!==false&&C.assistantUrl){out=await ai(q);aiOk=out?true:false}
  if(out){wait.innerHTML=fmt(out.text);history.push({role:'assistant',content:out.text})}
  else{const t=local(q);wait.innerHTML=t;history.push({role:'assistant',content:strip(t)})}
  setMode();log.scrollTop=log.scrollHeight;busy=false;
 }
})();
