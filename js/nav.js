/* Shared, accessible navigation for every page. */
(function(){
 const main=document.querySelector('main');
 if(main&&!main.id)main.id='main';
 const h=document.getElementById('nav');
 if(h){
  const btn=h.querySelector('#menuBtn'),menu=h.querySelector('#menu');
  if(menu&&!menu.dataset.compact){
   const all=[...menu.querySelectorAll(':scope > li')];
   const byHref={};
   all.forEach(li=>{const a=li.querySelector('a[href]');if(a)byHref[a.getAttribute('href')]=li});
   const labels={'/start':'Start here','/#courses':'Courses','/challenges':'Challenges','/public-speaking':'Speaking Academy','/practice':'Practice','/dashboard':'Dashboard'};
   const ensure=(href)=>{
    if(byHref[href])return byHref[href];
    const li=document.createElement('li'),a=document.createElement('a');a.href=href;a.textContent=labels[href]||href;li.appendChild(a);byHref[href]=li;return li;
   };
   const primary=['/start','/#courses','/challenges','/public-speaking','/practice','/dashboard'];
   const used=new Set(primary);
   const explore=all.filter(li=>{const a=li.querySelector('a[href]');if(!a)return false;const href=a.getAttribute('href');return !used.has(href)&&href!=='/account'&&href!=='/lessons/html-1'});
   const utilities=all.filter(li=>!li.querySelector('a[href]')).map(li=>li.outerHTML).join('');
   const account=byHref['/account']?.outerHTML||'<li><a class="acct" id="accountLink" href="/account">Sign in</a></li>';
   const start=byHref['/lessons/html-1']?.outerHTML||'<li><a class="btn small" href="/lessons/html-1">Start learning</a></li>';
   menu.innerHTML=primary.map(href=>ensure(href).outerHTML).join('')+
    (explore.length?'<li class="nav-explore"><details><summary>Explore</summary><div class="nav-dropdown">'+explore.map(li=>li.outerHTML).join('')+'</div></details></li>':'')+
    utilities+account+start;
   menu.dataset.compact='true';
  }
  if(btn&&menu){
   btn.onclick=()=>{const open=menu.classList.toggle('open');btn.setAttribute('aria-expanded',String(open));btn.textContent=open?'Close':'Menu'};
   menu.addEventListener('click',e=>{if(e.target.closest('a')){menu.classList.remove('open');btn.setAttribute('aria-expanded','false');btn.textContent='Menu'}});
  }
  const clean=u=>u.split('#')[0].replace(/\.html$/,'').replace(/\/$/,'')||'/';
  const path=clean(location.pathname);
  h.querySelectorAll('#menu a[href]').forEach(a=>{const u=clean(a.getAttribute('href'));if(u!=='/'&&(path===u||path.startsWith(u+'/')))a.setAttribute('aria-current','page')});
 }
 if(!document.getElementById('whatsappContact')){
  const wa=document.createElement('a');wa.id='whatsappContact';wa.className='whatsapp-fab';
  wa.href='https://wa.me/233552759148?text='+encodeURIComponent('Hello Duncan Tech Schools, I would like to make an enquiry.');
  wa.target='_blank';wa.rel='noopener noreferrer';wa.setAttribute('aria-label','Contact Duncan Tech Schools on WhatsApp');
  wa.innerHTML='<span aria-hidden="true">☏</span><span>WhatsApp us</span>';document.body.appendChild(wa);
 }
 if('serviceWorker' in navigator&&location.protocol.startsWith('http'))addEventListener('load',()=>navigator.serviceWorker.register('/sw.js').catch(()=>{}));
})();
