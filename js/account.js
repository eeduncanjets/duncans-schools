/* Account page: sign in, create account, reset password, sync status. */
(function(){
 const box=document.getElementById('authBox');if(!box)return;
 const A=window.DTSAuth;let mode='in',msg='',busy=false;
 const esc=s=>String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
 const say=(t,bad)=>{msg=t;const m=box.querySelector('#authMsg');if(m){m.textContent=t;m.className='auth-msg'+(bad?' bad':'')}};
 function render(){
  if(!A||!A.configured){
   box.innerHTML='<h2>Accounts are coming soon</h2><p class="sub">Your progress is saved on this device. You can back it up or move it from the <a href="/dashboard">dashboard</a>.</p><p class="hint">Site owner: add your Supabase details in <code>js/config.js</code> to switch on sign in. See the README.</p>';return;
  }
  if(A.recovery){
   box.innerHTML='<h2>Choose a new password</h2><form id="pwForm"><label>New password<input type="password" id="np" minlength="8" required autocomplete="new-password"></label><button class="btn" type="submit">Save password</button></form><p class="auth-msg" id="authMsg" aria-live="polite"></p>';
   box.querySelector('#pwForm').onsubmit=async e=>{e.preventDefault();try{await A.updatePassword(box.querySelector('#np').value);say('Password updated.')}catch(x){say(x.message,1)}};return;
  }
  if(A.user){
   box.innerHTML=`<h2>You are signed in</h2><p class="sub">${esc(A.user.email||'')}</p><p class="rows" id="syncState">${esc(A.status||'Ready')}</p>
   <p><button class="btn small" id="syncNow">Sync now</button> <button class="btn ghost small" id="out">Sign out</button></p>
   <p class="hint">Your lessons, challenges, tests, streak, focus sessions, weekly target and certificate name sync across your devices.</p>
   <details><summary>Delete my cloud copy</summary><p class="hint">This removes your synced progress from our server. Your progress on this device stays. To delete the account itself, use the <a href="/contact">contact page</a>.</p><button class="btn ghost small" id="del">Delete cloud copy</button></details>
   <p class="auth-msg" id="authMsg" aria-live="polite"></p>`;
   box.querySelector('#syncNow').onclick=async()=>{await A.syncNow()};
   box.querySelector('#out').onclick=async()=>{try{await A.signOut()}catch(x){say(x.message,1)}};
   box.querySelector('#del').onclick=async()=>{if(confirm('Delete your synced progress from the server?')){try{await A.deleteCloud()}catch(x){say(x.message,1)}}};
   return;
  }
  box.innerHTML=`<div class="modes" role="tablist"><button role="tab" data-m="in" aria-selected="${mode==='in'}">Sign in</button><button role="tab" data-m="up" aria-selected="${mode==='up'}">Create account</button></div>
  <button class="google-signin" type="button" id="googleSignIn"><span class="google-g" aria-hidden="true">G</span> Continue with Google</button><div class="auth-divider"><span>or use email</span></div>
  <form id="authForm"><label>Email<input type="email" id="em" required autocomplete="email"></label>
  <label>Password<input type="password" id="pw" minlength="8" required autocomplete="${mode==='in'?'current-password':'new-password'}"></label>
  <button class="btn" type="submit">${mode==='in'?'Sign in':'Create my account'}</button>
  ${mode==='in'?'<button class="linklike" type="button" id="forgot">Forgot your password?</button>':'<p class="hint">Use at least 8 characters.</p>'}</form>
  <p class="auth-msg" id="authMsg" aria-live="polite">${esc(msg)}</p>
  <p class="hint">Accounts are optional. Signing in saves your progress to our server so it follows you between devices. See the <a href="/privacy">privacy page</a>.</p>`;
  box.querySelectorAll('[data-m]').forEach(b=>b.onclick=()=>{mode=b.dataset.m;msg='';render()});
  box.querySelector('#googleSignIn').onclick=async()=>{if(busy)return;busy=true;say('Connecting securely to Google...');try{await A.signInWithGoogle()}catch(x){say(x.message||'Google sign-in is not available yet. Check the Supabase Google provider setup.',1);busy=false}};
  box.querySelector('#authForm').onsubmit=async e=>{
   e.preventDefault();if(busy)return;busy=true;say('One moment...');
   const em=box.querySelector('#em').value.trim(),pw=box.querySelector('#pw').value;
   try{
    if(mode==='in')await A.signIn(em,pw);
    else{const has=await A.signUp(em,pw);if(!has)say('Check your email and click the link to confirm your account, then sign in.')}
   }catch(x){say(x.message||'Something went wrong.',1)}
   busy=false;
  };
  const f=box.querySelector('#forgot');
  if(f)f.onclick=async()=>{const em=box.querySelector('#em').value.trim();if(!em){say('Type your email first, then press the link again.',1);return}try{await A.reset(em);say('If that email has an account, a reset link is on its way.')}catch(x){say(x.message,1)}};
 }
 render();
 if(A&&A.configured){A.onChange(render);box.insertAdjacentHTML('afterbegin','<p class="rows" id="authLoad">Loading...</p>');A.init().then(()=>{const l=document.getElementById('authLoad');if(l)l.remove()}).catch(x=>say(x.message,1))}
})();
