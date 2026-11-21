/* Optional accounts with Supabase. Does nothing until supabaseUrl and supabaseAnonKey are set in js/config.js.
   Signed-in learners get their progress synced across devices; everyone else keeps using this device only. */
(function(){
 const C=window.DTS_CONFIG||{},ON=!!(C.supabaseUrl&&C.supabaseAnonKey);
 const KEYS=['done','days','last','chal','tests','name','focusLog','weeklyGoal','speaking','speakingJourney'];
 const subs=[];let sb=null,user=null,merging=false,timer=null,status='',syncedFor=null,booting=null,recovery=false;
 const emit=()=>subs.forEach(f=>{try{f()}catch(e){}});
 const stamp=()=>new Date().toLocaleTimeString([],{hour:'2-digit',minute:'2-digit'});
 const label=()=>{const a=document.getElementById('accountLink');if(a)a.textContent=user?'Account':'Sign in'};
 const hasSession=()=>{try{return Object.keys(localStorage).some(k=>/^sb-.+-auth-token$/.test(k))}catch(e){return false}};
 const loadLib=()=>window.supabase?Promise.resolve():new Promise((ok,bad)=>{const s=document.createElement('script');s.src='https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2.45.4/dist/umd/supabase.js';s.onload=ok;s.onerror=()=>bad(new Error('Could not load the sign-in library. Check your internet connection.'));document.head.appendChild(s)});
 const local=()=>{const o={};KEYS.forEach(k=>{const v=DTS.get(k,undefined);if(v!==undefined&&v!==null)o[k]=v});return o};
 function merge(a,b){
  const o={...b,...a};
  ['done','chal'].forEach(k=>{o[k]={...(b[k]||{}),...(a[k]||{})}});
  o.days=[...new Set([...(a.days||[]),...(b.days||[])])].sort();
  const t={...(b.tests||{})};
  Object.keys(a.tests||{}).forEach(k=>{const x=a.tests[k],y=t[k];t[k]=!y?x:{...((x.at||0)>(y.at||0)?x:y),best:Math.max(x.best||0,y.best||0),attempts:Math.max(x.attempts||0,y.attempts||0)}});
  o.tests=t;
  const focus={...(b.focusLog||{})};Object.keys(a.focusLog||{}).forEach(k=>{focus[k]=Math.max(Number(focus[k])||0,Number(a.focusLog[k])||0)});o.focusLog=focus;
  o.weeklyGoal=a.weeklyGoal||b.weeklyGoal||300;
  if(a.speakingJourney||b.speakingJourney){const x=a.speakingJourney||{},y=b.speakingJourney||{};o.speakingJourney={...y,...x,completed:[...new Set([...(y.completed||[]),...(x.completed||[])])],updatedAt:Math.max(x.updatedAt||0,y.updatedAt||0)}}
  if(a.speaking||b.speaking){const x=a.speaking||{},y=b.speaking||{};o.speaking={...y,...x,done:[...new Set([...(y.done||[]),...(x.done||[])])],challengeDays:[...new Set([...(y.challengeDays||[]),...(x.challengeDays||[])])],recordings:Math.max(x.recordings||0,y.recordings||0),finalPassed:!!(x.finalPassed||y.finalPassed),history:[...(x.history||[]),...(y.history||[])].sort((p,q)=>(q.at||'').localeCompare(p.at||'')).slice(0,30),updatedAt:Math.max(x.updatedAt||0,y.updatedAt||0)}}
  o.last=a.last||b.last;o.name=a.name||b.name;
  return o;
 }
 async function sync(){
  if(!user||!sb)return;status='Syncing...';emit();
  try{
   const r=await sb.from('progress').select('data').eq('user_id',user.id).maybeSingle();
   if(r.error)throw r.error;
   const m=merge(local(),(r.data&&r.data.data)||{});
   merging=true;KEYS.forEach(k=>{if(m[k]!==undefined)DTS.set(k,m[k])});merging=false;
   const w=await sb.from('progress').upsert({user_id:user.id,data:m,updated_at:new Date().toISOString()});
   if(w.error)throw w.error;
   status='Synced at '+stamp();
   try{dispatchEvent(new CustomEvent('dts:synced'))}catch(e){}
  }catch(e){merging=false;status='Sync problem: '+(e.message||e)}
  emit();
 }
 addEventListener('dts:change',e=>{
  if(merging||!user||!sb||!KEYS.includes(e.detail&&e.detail.key))return;
  clearTimeout(timer);
  timer=setTimeout(async()=>{
   try{const w=await sb.from('progress').upsert({user_id:user.id,data:local(),updated_at:new Date().toISOString()});if(w.error)throw w.error;status='Synced at '+stamp()}
   catch(err){status='Sync problem: '+(err.message||err)}
   emit();
  },2500);
 });
 function init(){
  if(!ON)return Promise.resolve(null);
  if(booting)return booting;
  booting=(async()=>{
   await loadLib();
   sb=window.supabase.createClient(C.supabaseUrl,C.supabaseAnonKey,{auth:{persistSession:true,autoRefreshToken:true,detectSessionInUrl:true}});
   sb.auth.onAuthStateChange((ev,sess)=>{
    user=sess?sess.user:null;if(ev==='PASSWORD_RECOVERY')recovery=true;
    label();emit();
    if(user&&syncedFor!==user.id){syncedFor=user.id;setTimeout(sync,0)}
    if(!user)syncedFor=null;
   });
   return sb;
  })();
  booting.catch(()=>{booting=null});
  return booting;
 }
 const need=async()=>{const c=await init();if(!c)throw new Error('Accounts are not switched on for this site yet.');return c};
 window.DTSAuth={
  configured:ON,init,
  get user(){return user},get status(){return status},get recovery(){return recovery},
  onChange(f){subs.push(f)},
  async signUp(email,password){const c=await need();const r=await c.auth.signUp({email,password,options:{emailRedirectTo:location.origin+'/account'}});if(r.error)throw r.error;return !!r.data.session},
  async signIn(email,password){const c=await need();const r=await c.auth.signInWithPassword({email,password});if(r.error)throw r.error},
  async signInWithGoogle(){const c=await need();const r=await c.auth.signInWithOAuth({provider:'google',options:{redirectTo:location.origin+'/account',queryParams:{prompt:'select_account'}}});if(r.error)throw r.error},
  async signOut(){const c=await need();await c.auth.signOut()},
  async reset(email){const c=await need();const r=await c.auth.resetPasswordForEmail(email,{redirectTo:location.origin+'/account'});if(r.error)throw r.error},
  async updatePassword(pw){const c=await need();const r=await c.auth.updateUser({password:pw});if(r.error)throw r.error;recovery=false;emit()},
  async syncNow(){await sync()},
  async getAccessToken(){const c=await need();const r=await c.auth.getSession();if(r.error)throw r.error;if(!r.data.session)throw new Error('Please sign in first.');return r.data.session.access_token},
  async deleteCloud(){const c=await need();if(!user)return;const r=await c.from('progress').delete().eq('user_id',user.id);if(r.error)throw r.error;status='Cloud copy deleted';emit()}
 };
 if(ON&&(hasSession()||location.pathname==='/account'||/access_token|type=recovery|[?&]code=/.test(location.hash+location.search)))init().catch(()=>{});
})();
