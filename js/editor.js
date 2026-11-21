/* Code editor wrapper: CodeMirror when available, plain textarea as a fallback. */
window.Editor={make(ta,mode){
 if(!window.CodeMirror){
  return{get value(){return ta.value},set value(v){ta.value=v},set hidden(h){ta.hidden=h},
   on(fn){ta.addEventListener('input',fn)},mode(){},refresh(){},
   run(fn){ta.addEventListener('keydown',e=>{if(e.key==='Enter'&&(e.ctrlKey||e.metaKey)){e.preventDefault();fn()}if(e.key==='Tab'){e.preventDefault();ta.setRangeText('  ',ta.selectionStart,ta.selectionEnd,'end')}})}};
 }
 const cm=CodeMirror.fromTextArea(ta,{mode,theme:'dracula',lineNumbers:true,indentUnit:2,tabSize:2,lineWrapping:true,autoCloseBrackets:false,
  extraKeys:{Tab:c=>c.somethingSelected()?c.indentSelection('add'):c.replaceSelection('  ','end')}});
 const w=cm.getWrapperElement();
 return{cm,get value(){return cm.getValue()},set value(v){cm.setValue(v)},
  set hidden(h){w.style.display=h?'none':'';if(!h)setTimeout(()=>cm.refresh(),0)},
  on(fn){cm.on('change',fn)},mode(m){cm.setOption('mode',m)},refresh(){cm.refresh()},
  run(fn){cm.addKeyMap({'Ctrl-Enter':fn,'Cmd-Enter':fn})}};
}};
