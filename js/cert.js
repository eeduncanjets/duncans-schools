window.DTSCert=(function(){
 function hash(s){var h=0x811c9dc5;for(var i=0;i<s.length;i++){h^=s.charCodeAt(i);h=Math.imul(h,16777619)>>>0}return h>>>0}
 function norm(n){return String(n).trim().replace(/\s+/g,' ').toUpperCase()}
 function chk(cid,ymd,n,name){var v=hash('dts-2026|'+cid+'|'+ymd+'|'+n+'|'+norm(name)).toString(36).toUpperCase();return ('0000000'+v).slice(-7)}
 function make(cid,iso,n,name){var y=iso.replace(/-/g,'').slice(2);return 'DTS-'+cid.toUpperCase()+'-'+y+'-'+n+'-'+chk(cid,y,n,name)}
 function parse(code){var m=/^DTS-([A-Z0-9]+)-(\d{6})-(\d+)-([A-Z0-9]{7})$/.exec(String(code).trim().toUpperCase());return m?{cid:m[1].toLowerCase(),ymd:m[2],n:+m[3],chk:m[4]}:null}
 function verify(code,name){var p=parse(code);return p?{ok:chk(p.cid,p.ymd,p.n,name)===p.chk,p:p}:null}
 function fmt(iso){return new Date(iso+'T12:00:00').toLocaleDateString('en-GB',{day:'numeric',month:'long',year:'numeric'})}
 var SMALL={and:1,of:1,the:1,in:1,to:1,for:1,a:1,an:1,on:1,at:1,or:1};
 /* Display a course title in Title Case ("CSS styling and layout" -> "CSS Styling and Layout"), leaving words like CSS, Node.js, C++ or CS50: alone. */
 function title(s){return String(s).split(' ').map(function(w,i){if(!w||/[A-Z0-9+.]/.test(w.slice(1))||/^[A-Z]/.test(w))return w;if(i&&SMALL[w])return w;return w.charAt(0).toUpperCase()+w.slice(1)}).join(' ')}
 return{make:make,parse:parse,verify:verify,fmt:fmt,norm:norm,title:title};
})();
