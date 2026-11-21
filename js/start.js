(function(){
 var G={
  begin:{t:'I am a complete beginner',s:[['HTML','/lessons/html-1','Build your first web page'],['CSS','/lessons/css-1','Make it look good'],['JavaScript','/lessons/js-1','Make it interactive']]},
  job:{t:'I want a tech job',s:[['Python','/lessons/python-1','An easy, in-demand first language'],['JavaScript','/lessons/js-1','The language of the web'],['Git','/lessons/git-1','Work with a team'],['Project Lab','/project-lab','Build projects for your portfolio']]},
  web:{t:'I want to build websites',s:[['HTML','/lessons/html-1','Page structure'],['CSS','/lessons/css-1','Design and layout'],['JavaScript','/lessons/js-1','Behaviour'],['React','/lessons/react-1','Modern interfaces']]},
  data:{t:'I like data and AI',s:[['Python','/lessons/python-1','Your starting language'],['SQL','/lessons/sql-1','Ask questions of data'],['Data Science','/lessons/data-1','Analyse and chart data'],['Machine Learning','/lessons/ml-1','Teach computers from examples']]},
  sec:{t:'I am curious about security',s:[['Cybersecurity','/lessons/thm-1','Stay safe and understand threats'],['Networking','/lessons/net-1','How the internet works'],['Linux','/lessons/linux-1','The terminal skills security uses'],['Ethical Security Labs','/lessons/htb-1','Learn how defenders think']]},
  cs:{t:'I study computer science',s:[['CS50','/lessons/cs50-1','Big ideas of computing'],['Data Structures','/lessons/dsa-1','The building blocks'],['Operating Systems','/lessons/os-1','How computers run programs'],['Interview practice','/lessons/leet-1','Solve problems for interviews']]}
 };
 var chips=document.getElementById('goalChips'),out=document.getElementById('goalResult');
 function esc(s){return String(s).replace(/[&<>"]/g,function(c){return{'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]})}
 function pick(k){
  Array.prototype.forEach.call(chips.children,function(b){b.setAttribute('aria-pressed',String(b.dataset.k===k))});
  out.innerHTML='<b>Your path:</b><ol>'+G[k].s.map(function(x){return '<li><a href="'+x[1]+'">'+esc(x[0])+'</a> - '+esc(x[2])+'</li>'}).join('')+'</ol>';
 }
 Object.keys(G).forEach(function(k){var b=document.createElement('button');b.type='button';b.dataset.k=k;b.textContent=G[k].t;b.setAttribute('aria-pressed','false');b.onclick=function(){pick(k)};chips.appendChild(b)});
})();
