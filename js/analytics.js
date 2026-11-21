/* Privacy-friendly analytics. Set DOMAIN to your site's domain (for example 'duncanstechschool.com')
   after creating a free account at Umami or a paid one at Plausible. Leave empty to disable. */
(function(){
 const DOMAIN='';
 if(!DOMAIN||navigator.doNotTrack==='1')return;
 const s=document.createElement('script');s.defer=true;s.dataset.domain=DOMAIN;s.src='https://plausible.io/js/script.js';document.head.appendChild(s);
})();
