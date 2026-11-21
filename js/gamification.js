/* Shared learner rewards. Stored locally; no account or network required. */
(function(){
 const KEY='dtsLearnerRewardsV1';
 const safe=()=>{try{return JSON.parse(localStorage.getItem(KEY))||{xp:0,events:[],badges:[]}}catch(e){return{xp:0,events:[],badges:[]}}};
 const save=s=>localStorage.setItem(KEY,JSON.stringify(s));
 const levels=[['Starter',0],['Curious',100],['Builder',300],['Problem Solver',650],['Creator',1100],['Innovator',1800],['Trailblazer',2800]];
 function level(xp){let current=levels[0],next=null;for(let i=0;i<levels.length;i++){if(xp>=levels[i][1])current=levels[i];else{next=levels[i];break}}return{name:current[0],min:current[1],next:next};}
 function award(amount,reason,id){const s=safe();if(id&&s.events.some(e=>e.id===id))return s;const n=Math.max(0,Math.min(100,Number(amount)||0));s.xp+=n;s.events.push({id:id||('evt-'+Date.now()+'-'+Math.random().toString(36).slice(2,7)),amount:n,reason:String(reason||'Learning activity').slice(0,90),at:new Date().toISOString()});s.events=s.events.slice(-250);save(s);window.dispatchEvent(new CustomEvent('dts:xp',{detail:s}));return s;}
 window.DTSRewards={get:safe,award,level};
})();
