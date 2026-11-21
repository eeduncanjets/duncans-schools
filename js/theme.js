window.DTS={
 get(k,d){try{const v=localStorage.getItem('dts-'+k);return v?JSON.parse(v):d}catch(e){return d}},
 set(k,v){try{localStorage.setItem('dts-'+k,JSON.stringify(v))}catch(e){}try{dispatchEvent(new CustomEvent('dts:change',{detail:{key:k}}))}catch(e){}},
 today(){const d=new Date();return d.getFullYear()+'-'+String(d.getMonth()+1).padStart(2,'0')+'-'+String(d.getDate()).padStart(2,'0')},
 streak(){
  const days=new Set(this.get('days',[]));let n=0;const d=new Date();
  const f=x=>x.getFullYear()+'-'+String(x.getMonth()+1).padStart(2,'0')+'-'+String(x.getDate()).padStart(2,'0');
  if(!days.has(f(d)))d.setDate(d.getDate()-1);
  while(days.has(f(d))){n++;d.setDate(d.getDate()-1)}
  return n;
 },
 lessonUrl(c,i){return '/lessons/'+c+'-'+(i+1)},
 courseUrl(id){return '/courses/'+id}
};
document.documentElement.dataset.theme=DTS.get('theme','dark');
document.addEventListener('DOMContentLoaded',()=>{
 const b=document.getElementById('themeBtn');if(!b)return;
 b.onclick=()=>{const t=document.documentElement.dataset.theme==='dark'?'light':'dark';document.documentElement.dataset.theme=t;DTS.set('theme',t)};
});
