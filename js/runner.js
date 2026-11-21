/* In-browser runners: Python (Pyodide) and SQL (sql.js). Both load on first use. */
window.RUN=(function(){
 const esc=s=>String(s).replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
 const loadScript=src=>new Promise((ok,bad)=>{const s=document.createElement('script');s.src=src;s.onload=ok;s.onerror=()=>bad(new Error('Could not load '+src+'. Check your internet connection.'));document.head.appendChild(s)});
 let pyP,sqlP;
 const getPy=()=>pyP||(pyP=(async()=>{await loadScript('https://cdn.jsdelivr.net/pyodide/v0.26.4/full/pyodide.js');return loadPyodide()})().catch(e=>{pyP=null;throw e}));
 const getSql=()=>sqlP||(sqlP=(async()=>{await loadScript('https://cdn.jsdelivr.net/npm/sql.js@1.10.3/dist/sql-wasm.js');return initSqlJs({locateFile:f=>'https://cdn.jsdelivr.net/npm/sql.js@1.10.3/dist/'+f})})().catch(e=>{sqlP=null;throw e}));
 return{
  esc,
  async py(code){
   let out='';
   try{
    const py=await getPy();
    py.setStdout({batched:s=>out+=s+'\n'});py.setStderr({batched:s=>out+=s+'\n'});
    try{await py.runPythonAsync(code,{globals:py.toPy({})});return{out}}
    catch(e){return{out,err:String(e.message||e).trim().split('\n').slice(-4).join('\n')}}
   }catch(e){return{out,err:e.message}}
  },
  async sql(code,setup){
   try{
    const S=await getSql(),db=new S.Database();
    try{if(setup)db.run(setup);return{tables:db.exec(code)}}
    catch(e){return{err:e.message}}
    finally{db.close()}
   }catch(e){return{err:e.message}}
  },
  table(t){
   return `<div class="tbl"><table><thead><tr>${t.columns.map(c=>`<th>${esc(c)}</th>`).join('')}</tr></thead><tbody>${t.values.map(r=>`<tr>${r.map(v=>`<td>${v===null?'<i>NULL</i>':esc(v)}</td>`).join('')}</tr>`).join('')}</tbody></table></div>`;
  },
  render(res,el,empty){
   if(res.err){el.innerHTML=`<pre class="err">${esc(res.err)}</pre>`;return}
   if(res.tables){el.innerHTML=res.tables.length?res.tables.map(t=>RUN.table(t)).join('')+`<p class="rows">${res.tables.map(t=>t.values.length+' rows').join(', ')}</p>`:`<p class="rows">${empty||'Query ran. No rows returned.'}</p>`;return}
   el.innerHTML=`<pre>${esc(res.out||'(no output)')}</pre>`;
  }
 };
})();
