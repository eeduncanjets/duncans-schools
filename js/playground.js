(function(){
 const $=s=>document.querySelector(s);
 const S=DTS.get('pg',{}),save=()=>DTS.set('pg',S);
 const D={
  'w-html':'<h1 id="t">Hello playground</h1>\n<button id="b">Change me</button>',
  'w-css':'body{font-family:system-ui;padding:1rem}\nh1{color:#7C5CFF}',
  'w-js':'document.getElementById("b").onclick = () => {\n  document.getElementById("t").textContent = "You clicked!";\n};',
  'py-code':'def fib(n):\n    a, b = 0, 1\n    for _ in range(n):\n        yield a\n        a, b = b, a + b\n\nprint(list(fib(12)))',
  'sql-code':'SELECT country, ROUND(AVG(score), 1) AS average\nFROM students\nGROUP BY country\nORDER BY average DESC;'
 };
 const M={'w-html':'htmlmixed','w-css':'css','w-js':'javascript','py-code':'python','sql-code':'text/x-sql'};
 const E={};let t;
 Object.keys(D).forEach(id=>{
  const el=document.getElementById(id);E[id]=Editor.make(el,M[id]);E[id].value=S[id]??D[id];
  E[id].on(()=>{S[id]=E[id].value;save();if(id.startsWith('w-')){clearTimeout(t);t=setTimeout(web,350)}});
 });
 E['w-css'].hidden=true;E['w-js'].hidden=true;E['py-code'].hidden=true;E['sql-code'].hidden=true;
 function web(){
  $('#w-prev').srcdoc=`<!doctype html><meta charset="utf-8"><style>${E['w-css'].value}</style>${E['w-html'].value}<script>try{${E['w-js'].value}}catch(e){document.body.insertAdjacentHTML('beforeend','<pre style="color:#c00">'+e+'</pre>')}<\/script>`;
 }
 async function runPy(){const b=$('#py-run');b.disabled=true;$('#py-out').innerHTML='<p class="rows">Running Python. The first run downloads the engine (about 10 MB, once)...</p>';RUN.render(await RUN.py(E['py-code'].value),$('#py-out'));b.disabled=false}
 async function runSql(){const b=$('#sql-run');b.disabled=true;$('#sql-out').innerHTML='<p class="rows">Running query...</p>';RUN.render(await RUN.sql(E['sql-code'].value,$('#sql-db').checked?SQLDB:''),$('#sql-out'));b.disabled=false}
 ['w-html','w-css','w-js'].forEach(id=>E[id].run(web));E['py-code'].run(runPy);E['sql-code'].run(runSql);
 $('#py-run').onclick=runPy;$('#sql-run').onclick=runSql;
 document.querySelectorAll('.tabs [data-t]').forEach(b=>b.onclick=()=>{document.querySelectorAll('.tabs [data-t]').forEach(x=>x.setAttribute('aria-selected',x===b));['html','css','js'].forEach(k=>E['w-'+k].hidden=k!==b.dataset.t)});
 document.querySelectorAll('.modes [data-m]').forEach(b=>b.onclick=()=>{
  document.querySelectorAll('.modes [data-m]').forEach(x=>x.setAttribute('aria-selected',x===b));
  ['web','py','sql'].forEach(m=>$('#p-'+m).hidden=m!==b.dataset.m);
  const m=b.dataset.m;if(m==='py')E['py-code'].hidden=false;if(m==='sql')E['sql-code'].hidden=false;
  if(m==='web'){const act=document.querySelector('.tabs [aria-selected=true]').dataset.t;E['w-'+act].hidden=false}
 });
 web();
})();
