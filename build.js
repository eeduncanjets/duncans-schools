#!/usr/bin/env node
/* Duncan's Tech Schools build script. Run with:  node build.js
   It pre-renders content into real HTML (for search engines), creates a page for every course,
   lesson and blog post, and writes sitemap.xml, robots.txt, _headers, manifest and the offline worker.
   Set a custom domain with:  SITE_URL=https://yourdomain.com node build.js */
const fs=require('fs'),path=require('path'),vm=require('vm'),crypto=require('crypto');
const SITE=(process.env.SITE_URL||'https://duncans-tech-schools.netlify.app').replace(/\/$/,'');
const ROOT=__dirname;
const read=p=>fs.readFileSync(path.join(ROOT,p),'utf8');
const write=(p,s)=>{const f=path.join(ROOT,p);fs.mkdirSync(path.dirname(f),{recursive:true});fs.writeFileSync(f,s)};
const esc=s=>String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
const plain=h=>h.replace(/<[^>]+>/g,'').replace(/&lt;/g,'<').replace(/&gt;/g,'>').replace(/&amp;/g,'&').replace(/\s+/g,' ').trim();
const TODAY=new Date().toISOString().slice(0,10),YEAR=new Date().getFullYear();

const ctx=vm.createContext({});
['js/data.js','js/lessons.js','js/lessons-extra.js','js/cheats.js','js/challenges.js','content/posts.js'].forEach(f=>vm.runInContext(read(f),ctx,{filename:f}));
const D=vm.runInContext('({COURSES,PROGRAMMES,PATHS,LIB,FAQ,STEPS,CAT_COLORS,COLORS,LESSONS,CHEATS,POSTS})',ctx);
const {COURSES,PROGRAMMES,PATHS,LIB,FAQ,STEPS,CAT_COLORS,COLORS,LESSONS,CHEATS,POSTS}=D;
const byId=Object.fromEntries(COURSES.map(c=>[c.id,c]));
const N_LESSONS=Object.values(LESSONS).reduce((a,c)=>a+c.lessons.length,0);
const N_SITES=Object.values(LIB).reduce((a,b)=>a+b.length,0);
const cTitle=id=>LESSONS[id]?LESSONS[id].title.split(' (')[0]:byId[id].t;

/* ---------- shared chrome ---------- */
const NAV=`<a class="brand" href="/"><img src="/images/logo.svg" alt="" width="34" height="34"><span>Duncan's Tech Schools</span></a>
  <nav aria-label="Main"><button class="menu-btn" id="menuBtn" aria-label="Toggle menu" aria-expanded="false">Menu</button>
  <ul id="menu"><li><a href="/start">Start here</a></li><li><a href="/#courses">Courses</a></li><li><a href="/challenges">Challenges</a></li><li><a href="/practice">Practice</a></li><li><a href="/playground">Playground</a></li><li><a href="/cheatsheets">Cheat sheets</a></li><li><a href="/blog/">Blog</a></li><li><a href="/dashboard">Dashboard</a></li><li><a href="/career-studio">Career Studio</a></li><li><a href="/project-lab">Project Lab</a></li><li><a href="/interview-studio">Interview Studio</a></li><li><a href="/innovation-academy">Innovation Academy</a></li>
  <li><button class="search-btn" id="searchBtn" aria-label="Search the school">Search <kbd>Ctrl K</kbd></button></li>
  <li><button class="theme-btn" id="themeBtn" aria-label="Switch between light and dark theme">&#9680;</button></li>
  <li><a class="acct" id="accountLink" href="/account">Sign in</a></li>
  <li><a class="btn small" href="/lessons/html-1">Start learning</a></li></ul></nav>`;
const FOOT=`<div class="f-grid"><div><b>Duncan's Tech Schools</b><p>Free interactive lessons and a hand-picked library of the best places to learn programming and computer science.</p></div>
<div><b>Learn</b><a href="/start">Start here</a><a href="/terminal">Command Lab</a><a href="/review">Review mistakes</a><a href="/certificates">Certificates</a><a href="/verify">Verify a certificate</a><a href="/#courses">Courses</a><a href="/#programmes">Programmes</a><a href="/challenges">Challenges</a><a href="/practice">Practice tests</a><a href="/playground">Playground</a><a href="/cheatsheets">Cheat sheets</a></div>
<div><b>Explore</b><a href="/#library">Resource library</a><a href="/blog/">Blog</a><a href="/dashboard">Dashboard</a><a href="/career-studio">Career Studio</a><a href="/project-lab">Project Lab</a><a href="/interview-studio">Interview Studio</a><a href="/innovation-academy">Innovation Academy</a></div>
<div><b>School</b><a href="/about">About Duncan</a><a href="/contact">Contact</a><a href="/privacy">Privacy</a><a href="/account">Sign in</a></div></div>
<div class="f-copy"><span>&copy; ${YEAR} Duncan's Tech Schools</span><a href="#top" onclick="scrollTo({top:0})">Back to top</a></div>`;

const FONTS='<link rel="preconnect" href="https://fonts.googleapis.com">\n<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>\n<link href="https://fonts.googleapis.com/css2?family=Sora:wght@400;600;800&family=Fira+Code:wght@400;500&display=swap" rel="stylesheet">';
const CMV='5.65.16',CM=`https://cdnjs.cloudflare.com/ajax/libs/codemirror/${CMV}/`;
const CM_CSS=`<link rel="stylesheet" href="${CM}codemirror.min.css">\n<link rel="stylesheet" href="${CM}theme/dracula.min.css">\n`;
const CM_JS=['codemirror.min.js','mode/xml/xml.min.js','mode/javascript/javascript.min.js','mode/css/css.min.js','mode/htmlmixed/htmlmixed.min.js','mode/python/python.min.js','mode/sql/sql.min.js'].map(p=>`<script src="${CM}${p}"></script>`).join('\n')+'\n<script src="/js/editor.js"></script>\n';
const S=l=>l.map(s=>`<script src="${s}"></script>`).join('\n')+'\n';
const BASE=['/js/data.js','/js/lessons.js','/js/lessons-extra.js','/js/nav.js','/js/palette.js'];

function shell({title,desc,body,scripts=S(BASE),extraHead='',bodyAttr=''}){
 return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${esc(title)}</title>
<meta name="description" content="${esc(desc)}">
<!--seo--><!--/seo-->
<link rel="icon" href="/images/logo.svg" type="image/svg+xml">
${FONTS}
${extraHead}<link rel="stylesheet" href="/css/style.css">
<link rel="stylesheet" href="/css/pages.css">
<script src="/js/theme.js"></script>
</head>
<body class="sub-page"${bodyAttr?' '+bodyAttr:''}>
<header class="nav" id="nav"></header>
<main class="wrap" id="main">
${body}
</main>
<footer id="siteFooter"></footer>
${scripts}</body>
</html>
`;
}

/* ---------- SSR fragments ---------- */
const ico=s=>esc(s);
const SSR={
 pathGrid:PATHS.map(p=>`<article class="card reveal" style="--c:${p.c}"><div class="ico">${ico(p.ico)}</div><h3>${p.t}</h3><p>${p.d}</p><ul>${p.s.map(s=>`<li>${s}</li>`).join('')}</ul></article>`).join(''),
 courseGrid:COURSES.map(c=>`<a class="card" style="--c:${CAT_COLORS[c.cat]}" href="/courses/${c.id}"><div class="ico">${ico(c.ico)}</div><h3>${c.t}</h3><p>${c.d}</p><div class="meta"><span class="lv ${c.lvl}">${c.lvl}</span><span>${c.h} hours</span><span>${LESSONS[c.id]?'Interactive':'External'}</span></div></a>`).join(''),
 progGrid:PROGRAMMES.map(p=>{const hrs=p.cs.reduce((a,id)=>a+byId[id].h,0);return `<article class="prog reveal" style="--c:${p.c}"><div class="prog-top"><h3>${p.t}</h3><span class="months">${p.m} months</span></div><p>${p.d}</p><ol>${p.cs.map(id=>`<li><a href="/courses/${id}">${byId[id].t}</a></li>`).join('')}</ol><p class="outcome"><b>Outcome:</b> ${p.o}</p><p class="hrs">${p.cs.length} courses, about ${hrs} hours</p></article>`}).join(''),
 resGrid:Object.keys(LIB).map((cat,i)=>LIB[cat].map(([n,u,d])=>`<a class="card" style="--c:${COLORS[i%COLORS.length]}" href="${u}" target="_blank" rel="noopener noreferrer"><span class="tag">${cat}</span><h3>${esc(n)}</h3><p>${esc(d)}</p></a>`).join('')).join(''),
 faqList:FAQ.map(([q,a])=>`<details><summary>${q}</summary><p>${a}</p></details>`).join(''),
 timeline:STEPS.map(([a,b])=>`<li class="reveal"><b>${a}</b><p>${b}</p></li>`).join(''),
 blogGrid:POSTS.map(p=>`<a class="card" style="--c:#2DE2E6" href="/blog/${p.slug}"><span class="tag">${p.read} min read</span><h3>${p.title}</h3><p>${p.desc}</p></a>`).join(''),
 chGrid:Object.keys(CHEATS).map(k=>`<section class="sheet"><h3>${k}</h3>${CHEATS[k].map(([c,d])=>`<button class="snip" data-c="${esc(c)}"><code>${esc(c)}</code><span>${d}</span></button>`).join('')}</section>`).join('')
};
const fillMarked=(h,id,c)=>h.replace(new RegExp(`(id="${id}"[^>]*>)<!--ssr-->[\\s\\S]*?<!--\\/ssr-->`),(m,a)=>`${a}<!--ssr-->${c}<!--/ssr-->`);
const fill=(h,id,c)=>h.replace(new RegExp(`(<(\\w+)[^>]*\\bid="${id}"[^>]*>)[\\s\\S]*?(</\\2>)`),(m,a,t,b)=>a+c+b);

/* ---------- SEO ---------- */
const pageUrl=f=>f==='index.html'?'/':f.endsWith('/index.html')?'/'+f.slice(0,-10):'/'+f.replace(/\.html$/,'');
const CANON={'/learn':'/lessons/html-1'};
const ORG={'@type':'Organization',name:"Duncan's Tech Schools",url:SITE};
function post(h){
 let id='main';
 h=h.replace(/<main\b([^>]*)>/,(m,a)=>{const x=a.match(/\sid="([^"]+)"/);if(x){id=x[1];return m}return `<main${a} id="main">`});
 if(!/class="skip"/.test(h))h=h.replace(/<body([^>]*)>/,(m,a)=>`<body${a}>\n<a class="skip" href="#${id}">Skip to content</a>`);
 return h;
}
const unesc=t=>t.replace(/&quot;/g,'"').replace(/&lt;/g,'<').replace(/&gt;/g,'>').replace(/&amp;/g,'&');
function seo(h,url,ld,type='website'){
 const title=(h.match(/<title>([\s\S]*?)<\/title>/)||[,''])[1],desc=(h.match(/<meta name="description" content="([^"]*)"/)||[,''])[1];
 const canon=SITE+(CANON[url]||url),img=SITE+'/images/og-image.png';
 const noindex=url==='/learn'||url==='/404'||url==='/account'?'<meta name="robots" content="noindex">\n':'';
 const b=`<!--seo-->
${noindex}<link rel="canonical" href="${canon}">
<meta name="theme-color" content="#070B1F">
<link rel="manifest" href="/manifest.webmanifest">
<link rel="apple-touch-icon" href="/images/icons/apple-touch-icon.png">
<meta property="og:type" content="${type}"><meta property="og:site_name" content="Duncan's Tech Schools">
<meta property="og:title" content="${title}"><meta property="og:description" content="${desc}">
<meta property="og:url" content="${canon}"><meta property="og:image" content="${img}">
<meta name="twitter:card" content="summary_large_image"><meta name="twitter:title" content="${title}"><meta name="twitter:description" content="${desc}"><meta name="twitter:image" content="${img}">
${(ld||(url==='/404'?null:{'@context':'https://schema.org','@type':'WebPage',name:unesc(title),url:canon,description:unesc(desc),isPartOf:{'@type':'WebSite',name:"Duncan's Tech Schools",url:SITE}}))?`<script type="application/ld+json">${JSON.stringify(ld||{'@context':'https://schema.org','@type':'WebPage',name:unesc(title),url:canon,description:unesc(desc),isPartOf:{'@type':'WebSite',name:"Duncan's Tech Schools",url:SITE}}).replace(/</g,'\\u003c')}</script>\n`:''}<!--/seo-->`;
 return post(h.replace(/<!--seo-->[\s\S]*?<!--\/seo-->/,()=>b));
}
const crumbLd=items=>({'@type':'BreadcrumbList',itemListElement:items.map(([n,u],i)=>({'@type':'ListItem',position:i+1,name:n,item:SITE+u}))});

function finalize(h,url,opts={}){
 if(url==='/'){
  for(const id of ['pathGrid','courseGrid','progGrid','resGrid','faqList','timeline','blogGrid'])h=fillMarked(h,id,SSR[id]);
  [['s1',N_SITES],['s2',COURSES.length],['s3',PROGRAMMES.length],['s4',N_LESSONS]].forEach(([id,v])=>{h=h.replace(new RegExp(`(id="${id}" data-count=")\\d*(">)\\d*`),`$1${v}$2${v}`)});
 }
 if(url==='/cheatsheets')h=fillMarked(h,'chGrid',SSR.chGrid);
 h=h.split('{{N_LESSONS}}').join(N_LESSONS);
 h=seo(h,url,opts.ld,opts.type);
 h=h.replace(/(<header class="nav" id="nav">)[\s\S]*?(<\/header>)/,(m,a,b)=>a+NAV+b);
 h=h.replace(/(<footer id="siteFooter">)[\s\S]*?(<\/footer>)/,(m,a,b)=>a+FOOT+b);
 for(const s of ['/js/config.js','/js/fx.js','/js/analytics.js','/js/auth.js','/js/assistant.js'])if(!h.includes(`src="${s}"`))h=h.replace('</body>',`<script src="${s}" defer></script>\n</body>`);
 return h;
}

const pages={};   // file -> {html, ld, type}
const add=(file,html,ld,type)=>{pages[file]={html,ld,type}};

/* ---------- index and other hand-written pages ---------- */
const siteLd={'@context':'https://schema.org','@graph':[{'@type':'EducationalOrganization',name:"Duncan's Tech Schools",url:SITE,logo:SITE+'/images/logo.svg',description:'Free interactive lessons and a curated library for learning programming and computer science.',founder:{'@type':'Person',name:'Duncan'}},{'@type':'WebSite',name:"Duncan's Tech Schools",url:SITE}]};
add('index.html',read('index.html'),siteLd);
for(const f of ['learn.html','playground.html','dashboard.html','cheatsheets.html'])add(f,read(f));
add('career-studio.html',read('career-studio.html'),{'@type':'WebPage',name:'Career Studio',description:'Build a learning roadmap, review flashcards and plan portfolio projects.'});
add('project-lab.html',read('project-lab.html'),{'@type':'WebPage',name:'Project Lab',description:'Build portfolio-ready web projects in a safe live preview workspace.'});
add('interview-studio.html',read('interview-studio.html'),{'@type':'WebPage',name:'Interview Studio',description:'Practise technical and behavioural interviews and track your preparation.'});
add('speaking-arena.html',read('speaking-arena.html'),{'@type':'WebPage',name:'Virtual Speaking Arena',description:'Practise public speaking in a simulated auditorium with live delivery cues and audience questions.'});
add('innovation-academy.html',read('innovation-academy.html'),{'@type':'WebPage',name:'Innovation Academy',description:'Find real problems, validate ideas, prototype solutions and present technology ventures.'});
add('start.html',read('start.html'),{'@type':'WebPage',name:'Start here',description:'A one-minute video tour, a goal picker and a map of Duncan\'s Tech Schools for new learners.'});
add('review.html',read('review.html'),{'@type':'WebPage',name:'Review mistakes',description:'Answer again the lesson questions you missed.'});
add('terminal.html',read('terminal.html'),{'@type':'WebPage',name:'Command Lab',description:'Practise Linux, Git and Docker commands in a simulated terminal.'});
add('certificates.html',read('certificates.html'),{'@type':'WebPage',name:'Certificates',description:'Earn and print a certificate when you complete a course.'});
add('verify.html',read('verify.html'),{'@type':'WebPage',name:'Verify a certificate',description:'Check a Duncan\'s Tech Schools certificate ID.'});

/* ---------- courses ---------- */
COURSES.forEach(c=>{
 const live=!!LESSONS[c.id],L=live?LESSONS[c.id].lessons:[];
 const progs=PROGRAMMES.filter(p=>p.cs.includes(c.id));
 const rel=COURSES.filter(x=>x.cat===c.cat&&x.id!==c.id).slice(0,4);
 const start=live?`<a class="btn" href="/lessons/${c.id}-1">Start lesson 1</a>`:`<a class="btn" href="${c.u}" target="_blank" rel="noopener noreferrer">Open the course</a>`;
 const main=live?`<div class="panel"><h2>What you will learn</h2><ol class="steps">${L.map((l,i)=>`<li><a href="/lessons/${c.id}-${i+1}"><b>${i+1}</b><span>${l.t}</span></a></li>`).join('')}</ol></div>`
  :`<div class="panel"><h2>Where to study</h2><p>${c.t} is covered by an excellent free resource. Open it in a new tab, study at your own pace, and come back here to plan your next step.</p><p><a class="btn" href="${c.u}" target="_blank" rel="noopener noreferrer">Open the course</a></p></div>`;
 const body=`<nav class="crumbs" aria-label="Breadcrumb"><a href="/">Home</a> / <a href="/#courses">Courses</a> / ${c.t}</nav>
<h1>${c.t}</h1>
<div class="pills"><span>${c.lvl}</span><span>${c.h} hours</span><span>${c.cat}</span><span>${live?'Interactive in your browser':'Free external resource'}</span></div>
<p class="sub">${c.d}</p>
<div class="two"><div>${main}${progs.length?`<div class="panel" style="margin-top:1.2rem"><h2>Part of these programmes</h2><ul class="steps">${progs.map(p=>`<li><a href="/#programmes"><b>${p.m}mo</b><span>${p.t}</span></a></li>`).join('')}</ul></div>`:''}</div>
<aside><div class="panel"><h3>Start now</h3><p>Free, no sign-up needed.</p>${start}</div>
${rel.length?`<div class="panel" style="margin-top:1.2rem"><h3>Related courses</h3><ul class="steps">${rel.map(r=>`<li><a href="/courses/${r.id}"><b>${r.lvl.slice(0,3)}</b><span>${r.t}</span></a></li>`).join('')}</ul></div>`:''}</aside></div>
<div class="share"></div>`;
 add(`courses/${c.id}.html`,shell({title:`${c.t}: free course | Duncan's Tech Schools`,desc:`${c.d} ${c.lvl} level, about ${c.h} hours. Free to start.`,body}),
  {'@context':'https://schema.org','@graph':[{'@type':'Course',name:c.t,description:c.d,provider:ORG,isAccessibleForFree:true,educationalLevel:c.lvl,timeRequired:`PT${c.h}H`,inLanguage:'en'},crumbLd([['Home','/'],['Courses','/#courses'],[c.t,'/courses/'+c.id]])]});
});

/* ---------- lessons (from learn.html template) ---------- */
const tpl=read('learn.html');
Object.keys(LESSONS).forEach(cid=>LESSONS[cid].lessons.forEach((L,i)=>{
 const cn=cTitle(cid),title=`${L.t} | ${cn} | Duncan's Tech Schools`;
 let desc=plain(L.body);if(desc.length>130)desc=desc.slice(0,127).replace(/\s\S*$/,'')+'...';desc+=` Free interactive ${cn} lesson.`;
 let h=tpl.replace(/<title>[\s\S]*?<\/title>/,()=>`<title>${esc(title)}</title>`).replace(/(<meta name="description" content=")[^"]*(")/,(m,a,b)=>a+esc(desc)+b)
  .replace('<body class="learn-page">',`<body class="learn-page" data-course="${cid}" data-lesson="${i}">`);
 h=fill(h,'lTitle',esc(L.t));h=fill(h,'lBody',L.body);
 h=fill(h,'lessonList',LESSONS[cid].lessons.map((l,n)=>`<li><a href="/lessons/${cid}-${n+1}"${n===i?' aria-current="page"':''}>${n+1}. ${esc(l.t)}</a></li>`).join(''));
 if(L.code){h=fill(h,'ed-html',esc(L.code.html));h=fill(h,'ed-css',esc(L.code.css));h=fill(h,'ed-js',esc(L.code.js))}
 else if(L.py!=null||L.sql!=null)h=fill(h,'ed-code',esc(L.py!=null?L.py:L.sql));
 else h=fill(h,'sample',esc(L.sample));
 h=fill(h,'qText',esc(L.q.q));h=fill(h,'qOpts',L.q.o.map(o=>`<button type="button">${esc(o)}</button>`).join(''));
 const cl=byId[cid];
 add(`lessons/${cid}-${i+1}.html`,h,{'@context':'https://schema.org','@graph':[{'@type':'LearningResource',name:L.t,description:plain(L.body),learningResourceType:'Lesson',educationalLevel:cl.lvl,inLanguage:'en',isAccessibleForFree:true,isPartOf:{'@type':'Course',name:cl.t,url:`${SITE}/courses/${cid}`,provider:ORG}},crumbLd([['Home','/'],['Courses','/#courses'],[cl.t,'/courses/'+cid],[L.t,`/lessons/${cid}-${i+1}`]])]});
}));

/* ---------- blog ---------- */
add('blog/index.html',shell({title:"Blog: guides for people learning to code | Duncan's Tech Schools",desc:'Practical guides, study plans and explainers for people learning programming and computer science.',
 body:`<h1>Blog</h1><p class="sub">Practical guides for people learning to code.</p><div class="grid">${SSR.blogGrid}</div>`}),{'@context':'https://schema.org','@type':'Blog',name:"Duncan's Tech Schools Blog",url:SITE+'/blog/'});
POSTS.forEach(p=>add(`blog/${p.slug}.html`,shell({title:`${p.title} | Duncan's Tech Schools`,desc:p.desc,
 body:`<nav class="crumbs" aria-label="Breadcrumb"><a href="/">Home</a> / <a href="/blog/">Blog</a> / ${p.title}</nav>
<article class="prose"><h1>${p.title}</h1><p class="sub">By Duncan &middot; ${new Date(p.date).toLocaleDateString('en-GB',{day:'numeric',month:'long',year:'numeric'})} &middot; ${p.read} min read</p>${p.body}</article>
<div class="share"></div>
<div class="panel" style="max-width:70ch"><h3>Keep learning</h3><p>Try a free interactive lesson or test yourself with a coding challenge.</p><p><a class="btn small" href="/lessons/html-1">Start a lesson</a> <a class="btn ghost small" href="/challenges">Try a challenge</a></p></div>`}),
 {'@context':'https://schema.org','@type':'Article',headline:p.title,description:p.desc,datePublished:p.date,dateModified:p.date,image:SITE+'/images/og-image.png',author:{'@type':'Person',name:'Duncan'},publisher:ORG,mainEntityOfPage:`${SITE}/blog/${p.slug}`},'article'));

/* ---------- static pages ---------- */
add('about.html',shell({title:"About Duncan | Duncan's Tech Schools",desc:"Meet Kobina Duncan, founder and CEO of Duncan Tech Schools, a Computer Science student and developer in Ghana.",
 body:`<div class="about"><picture><source srcset="/images/duncan-portrait.webp" type="image/webp"><img src="/images/duncan-portrait.jpg" alt="Duncan, founder of Duncan's Tech Schools, smiling with arms crossed in front of tall green plants" width="800" height="1067" decoding="async"></picture>
<div class="prose"><h1>Hi, I'm Kobina Duncan</h1><p class="sub">Founder &amp; CEO of Duncan Tech Schools · Computer Science student · Developer</p>
<p>I study Computer Science at the University of Cape Coast and I'm based in Takoradi, Ghana. I have hands-on IT support experience, and I build with Python, JavaScript, Node.js, React and SQL, as well as tools that automate documents and reports.</p>
<p>I started Duncan's Tech Schools to gather the best free learning sites on the web and turn them into short, practical lessons that run right in your browser. Anyone, anywhere, should be able to start learning technology without expensive tools.</p>
<h2>Professional development</h2><p>I have just earned the Google AI Professional Certificate from Coursera, issued on 15 November 2026. It is an eight-course programme covering AI fundamentals, brainstorming and planning, research and insights, writing and communicating, content creation, data analysis, app building and app deployment.</p><figure class=\"cert-fig\"><a href=\"/images/google-ai-professional-certificate.png\"><picture><source srcset=\"/images/google-ai-professional-certificate.webp\" type=\"image/webp\"><img src=\"/images/google-ai-professional-certificate.png\" alt=\"Google AI Professional Certificate from Coursera, awarded to Kobina Duncan on 15 November 2026\" width=\"1210\" height=\"796\" loading=\"lazy\" decoding=\"async\"></picture></a><figcaption>Google AI Professional Certificate, Coursera, 15 November 2026</figcaption></figure><p>I also earned a certificate in AWS Cloud Computing, strengthening my knowledge of cloud concepts and the technologies used to build and operate modern applications.</p><div class="skills"><span>Google AI Professional Certificate</span><span>AWS Cloud Computing</span><span>Python</span><span>JavaScript</span><span>Node.js</span><span>React</span><span>SQL</span><span>Automation</span></div>
<h2>What you will find here</h2><ul><li>Interactive lessons and coding challenges that check your answers</li><li>A hand-picked library of the best places to learn</li><li>Career programmes that put courses in a sensible order</li></ul>
<p>I also take on freelance web and automation projects. If you would like to work together, <a href="/contact">get in touch</a>.</p>
<div class="cta-row"><a class="btn" href="/lessons/html-1">Start learning</a><a class="btn ghost" href="/contact">Contact me</a></div></div></div>
<div class="gallery"><picture><source srcset="/images/duncan-campus-1.webp" type="image/webp"><img src="/images/duncan-campus-1.jpg" alt="Duncan standing on a campus lawn in front of large cream-coloured buildings" width="720" height="960" loading="lazy" decoding="async"></picture>
<picture><source srcset="/images/duncan-campus-2.webp" type="image/webp"><img src="/images/duncan-campus-2.jpg" alt="Duncan posing near a curved campus path with buildings and colourful umbrellas behind him" width="720" height="960" loading="lazy" decoding="async"></picture></div>`}),
 {'@context':'https://schema.org','@type':'ProfilePage',mainEntity:{'@type':'Person',name:'Kobina Duncan',jobTitle:'Founder and CEO of Duncan Tech Schools; Computer Science student and developer',address:{'@type':'PostalAddress',addressLocality:'Takoradi',addressCountry:'GH'},image:SITE+'/images/duncan-portrait.jpg'}},'profile');

add('contact.html',shell({title:"Contact | Duncan's Tech Schools",desc:'Send a message to Duncan about lessons, feedback, partnerships or freelance work.',
 body:`<h1>Contact</h1><p class="sub">Questions, feedback or a project idea? Send a message.</p>
<section class="card" style="margin:1.25rem 0;padding:1.25rem;max-width:760px;--c:#25D366"><span class="tag">Fastest response</span><h2>Chat with us on WhatsApp</h2><p>Message Duncan Tech Schools directly. We’ll be happy to help with courses, accounts, certificates, partnerships and technical support.</p><a class="btn" style="background:#168b50;color:#fff" href="https://wa.me/233552759148?text=Hello%20Duncan%20Tech%20Schools%2C%20I%20need%20some%20help." target="_blank" rel="noopener noreferrer">Chat on WhatsApp · 055 275 9148</a></section>
<div><form class="form ajax-form" name="contact" method="POST" action="/" data-netlify="true" netlify-honeypot="bot-field"><input type="hidden" name="form-name" value="contact"><p hidden><label>Leave this empty <input name="bot-field"></label></p>
<label>Your name<input name="name" required autocomplete="name"></label><label>Email<input type="email" name="email" required autocomplete="email"></label><label>Message<textarea name="message" rows="6" required></textarea></label><button class="btn" type="submit">Send message</button></form><p class="form-msg" aria-live="polite"></p></div>`,
 scripts:S(BASE)+S(['/js/forms.js'])}));

add('privacy.html',shell({title:"Privacy | Duncan's Tech Schools",desc:'How Duncan\'s Tech School handles your data: what stays on your device, what is collected, and your choices.',
 body:`<article class="prose"><h1>Privacy</h1><p class="sub">Last updated ${new Date().toLocaleDateString('en-GB',{month:'long',year:'numeric'})}</p>
<h2>What stays on your device</h2><p>Your lesson progress, streaks, challenge results, focus sessions, weekly study target, theme choice, playground code, certificate name, Project Lab drafts, Interview Studio practice history, Innovation Academy venture canvas and milestones, and learner XP are saved in your browser's local storage. These new tools do not automatically sync to your account. To remove their locally stored data, clear this site's browser storage in your browser settings.</p>
<h2>What we collect</h2><p>If you subscribe to the newsletter or send a message through the contact form, we receive the details you type (such as your name and email address) through Netlify Forms. We use them only to reply to you or to send the digest you asked for. To be removed, <a href="/contact">contact us</a> and we will delete your details.</p>
<h2>Accounts (optional)</h2><p>If you create an account, your email address and your learning progress are stored with our account provider, Supabase, so they can sync across your devices. Passwords are handled by the provider and are never visible to us. You can delete your synced progress on the account page, or ask for full deletion on the contact page.</p><h2>The study helper</h2><p>When the AI helper is switched on, the question you type, plus the lesson text and code on your screen, are sent to our server and then to Anthropic to write an answer. Please do not type personal information into the chat. When it is switched off, the built-in helper runs entirely in your browser.</p><h2>Third-party services</h2><p>To work, pages load fonts from Google Fonts and code libraries from cdnjs and jsDelivr (including the Python and SQL engines). These providers may see your IP address, as with any website. This site is hosted on Netlify.</p>
<h2>Analytics and cookies</h2><p>This site does not set tracking cookies. If privacy-friendly analytics are switched on in future, this page will say so.</p>
<h2>Offline use</h2><p>The site installs a service worker so lessons can work offline. It stores copies of pages and libraries in your browser cache.</p>
<h2>Contact</h2><p>Questions about privacy? Use the <a href="/contact">contact page</a>.</p></article>`}));

add('challenges.html',shell({title:"Coding challenges with instant feedback | Duncan's Tech Schools",desc:'Practice JavaScript, Python and SQL with coding challenges that check your answer instantly in the browser.',
 extraHead:CM_CSS,scripts:CM_JS.replace('<script src="/js/editor.js"></script>\n','')+S(['/js/runner.js','/js/editor.js'])+S(BASE)+S(['/js/challenges.js','/js/challenge-page.js']),
 body:`<section class="challenge-hero"><p class="eyebrow">PRACTISE · DEBUG · BUILD</p><h1>Your Challenge Hub</h1><p class="sub">Choose from 1,210 coding, debugging and guided practice challenges across 20 technologies. Search, filter by level, and track your progress as you solve them.</p><div class="challenge-stats"><strong id="chCount">Loading your progress…</strong><span id="challengeResultsMeta" aria-live="polite"></span></div></section>
<section class="challenge-controls" aria-label="Find a challenge"><label class="challenge-search-label" for="challengeSearch">Search challenges</label><input id="challengeSearch" type="search" placeholder="Try JavaScript, arrays, SQL joins, debugging…" autocomplete="off"><div class="challenge-filter-row"><label>Technology<select id="challengeTechnology"></select></label><label>Difficulty<select id="challengeLevel"></select></label></div><div class="challenge-kind-row" role="group" aria-label="Challenge type"><button class="btn small active" id="challengeAll" aria-pressed="true">All challenges</button><button class="btn ghost small" id="challengeDebug" aria-pressed="false">Debugging labs</button><button class="btn ghost small" id="challengeGuided" aria-pressed="false">Guided challenges</button><button class="btn ghost small" id="challengeClear">Clear filters</button></div></section>
<div class="chal"><aside class="challenge-library"><div class="challenge-library-head"><h2>Challenge library</h2><p class="rows">Select a challenge to begin.</p></div><ul id="chList"></ul></aside><section class="ch-main"><div class="challenge-task-head"><p class="eyebrow">YOUR WORKSPACE</p><h2 id="chTitle"></h2><p class="lang" id="chLevel"></p><p class="sub" id="chDesc"></p></div><textarea id="chCode" spellcheck="false" aria-label="Your solution"></textarea><div class="bar-row"><button class="btn small" id="chRun">Run tests</button><button class="btn ghost small" id="chReset">Reset</button><button class="btn ghost small" id="chReveal" hidden>Show reference guidance</button><button class="btn ghost small" id="chComplete" hidden>Mark guided task complete</button><span class="hint" id="chHint">Ctrl+Enter also runs the tests.</span></div><div class="out" id="chOut" aria-live="polite"></div></section></div><noscript><p>This page needs JavaScript to run challenges.</p></noscript>`}));

add('practice.html',shell({title:"Practice tests: JavaScript, Python, SQL and more | Duncan's Tech Schools",desc:'Free multiple-choice practice tests for HTML, CSS, JavaScript, Python, SQL, Git, Linux, networking, React, Node.js, data structures and security, plus a timed mixed exam.',
 scripts:S(BASE)+S(['/js/questions.js','/js/practice.js']),
 body:'<h1>Practice tests</h1><p class="sub">Pick a topic for a 10-question quiz, or take the timed mixed exam. You get an explanation after every answer.</p><div id="practice"><noscript>This page needs JavaScript.</noscript></div>'}));

add('account.html',shell({title:"Sign in or create an account | Duncan's Tech Schools",desc:'Sign in to save your learning progress and sync it across your devices. Accounts are optional.',
 scripts:S(BASE)+S(['/js/config.js','/js/auth.js','/js/account.js']),
 body:'<h1>Your account</h1><p class="sub">Save your progress and pick up on any device. Accounts are optional.</p><div class="auth-box" id="authBox"><noscript>This page needs JavaScript.</noscript></div>'}));

add('404.html',shell({title:"Page not found | Duncan's Tech Schools",desc:"The page you were looking for could not be found. Go back to the Duncan's Tech Schools home page, browse the courses, or search the school.",
 body:`<div class="center"><h1>404</h1><p class="sub" style="margin-inline:auto">That page does not exist, or it moved.</p><p><a class="btn" href="/">Go home</a> <a class="btn ghost" href="/#courses">Browse courses</a></p><p class="hint">Tip: press Ctrl+K to search the whole school.</p></div>`}));

/* ---------- write pages ---------- */
Object.entries(pages).forEach(([f,p])=>write(f,finalize(p.html,pageUrl(f),{ld:p.ld,type:p.type})));

/* ---------- sitemap, robots, headers, manifest ---------- */
const urls=Object.keys(pages).map(pageUrl).filter(u=>u!=='/404'&&u!=='/learn'&&u!=='/account');
write('sitemap.xml',`<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls.map(u=>`<url><loc>${SITE}${u}</loc><lastmod>${TODAY}</lastmod></url>`).join('\n')}\n</urlset>\n`);
write('robots.txt',`User-agent: *\nAllow: /\n\nSitemap: ${SITE}/sitemap.xml\n`);
write('_headers',`/*
  X-Content-Type-Options: nosniff
  X-Frame-Options: SAMEORIGIN
  Referrer-Policy: strict-origin-when-cross-origin
  Permissions-Policy: camera=(), microphone=(self), geolocation=(), payment=()
  Content-Security-Policy: frame-ancestors 'self'; base-uri 'self'; object-src 'none'; form-action 'self'

/images/*
  Cache-Control: public, max-age=604800

/sw.js
  Cache-Control: no-cache
`);
write('manifest.webmanifest',JSON.stringify({name:"Duncan's Tech Schools",short_name:'Tech School',description:'Free interactive lessons for programming and computer science.',start_url:'/',scope:'/',display:'standalone',background_color:'#070B1F',theme_color:'#7C5CFF',
 icons:[{src:'/images/icons/icon-192.png',sizes:'192x192',type:'image/png'},{src:'/images/icons/icon-512.png',sizes:'512x512',type:'image/png'},{src:'/images/icons/maskable-512.png',sizes:'512x512',type:'image/png',purpose:'maskable'}],
 shortcuts:[{name:'Continue learning',url:'/lessons/html-1'},{name:'Coding challenges',url:'/challenges'},{name:'Playground',url:'/playground'},{name:'Career Studio',url:'/career-studio'},{name:'Project Lab',url:'/project-lab'},{name:'Interview Studio',url:'/interview-studio'}]},null,2));

/* ---------- service worker ---------- */
const walk=d=>fs.readdirSync(path.join(ROOT,d),{withFileTypes:true}).flatMap(e=>e.isDirectory()?walk(path.join(d,e.name)):[path.join(d,e.name)]);
const assets=[...walk('css'),...walk('js')].map(f=>'/'+f.replace(/\\/g,'/')).filter(f=>f!=='/js/analytics.js'||true);
const core=['/','/playground','/challenges','/cheatsheets','/dashboard','/career-studio','/project-lab','/interview-studio','/innovation-academy','/speaking-arena','/about','/lessons/html-1','/images/logo.svg','/images/icons/icon-192.png','/manifest.webmanifest',...assets];
const hash=crypto.createHash('sha1');[...Object.keys(pages).sort()].forEach(f=>hash.update(read(f)));assets.forEach(a=>hash.update(read(a.slice(1))));
const VER=hash.digest('hex').slice(0,10);
write('sw.js',`/* Generated by build.js. Offline support: pages are network-first, assets stale-while-revalidate, CDN libraries cache-first. */
const V='dts-${VER}',CORE=${JSON.stringify(core)};
self.addEventListener('install',e=>{e.waitUntil(caches.open(V).then(c=>Promise.all(CORE.map(u=>c.add(u).catch(()=>{})))).then(()=>self.skipWaiting()))});
self.addEventListener('activate',e=>{e.waitUntil(caches.keys().then(k=>Promise.all(k.filter(x=>x!==V).map(x=>caches.delete(x)))).then(()=>self.clients.claim()))});
self.addEventListener('fetch',e=>{
 const r=e.request;if(r.method!=='GET')return;
 const u=new URL(r.url);
 if(u.origin===location.origin){
  if(r.mode==='navigate'){
   e.respondWith(fetch(r).then(res=>{if(res.ok){const c=res.clone();caches.open(V).then(x=>x.put(r,c))}return res}).catch(()=>caches.match(r).then(m=>m||caches.match('/'))));
   return;
  }
  e.respondWith(caches.match(r).then(m=>{const n=fetch(r).then(res=>{if(res.ok){const c=res.clone();caches.open(V).then(x=>x.put(r,c))}return res}).catch(()=>m);return m||n}));
  return;
 }
 if(/cdnjs\\.cloudflare\\.com|cdn\\.jsdelivr\\.net|fonts\\.(googleapis|gstatic)\\.com/.test(u.host)){
  e.respondWith(caches.match(r).then(m=>m||fetch(r).then(res=>{if(res.ok||res.type==='opaque'){const c=res.clone();caches.open(V).then(x=>x.put(r,c))}return res}).catch(()=>m)));
 }
});
`);
console.log(`Built ${Object.keys(pages).length} pages, ${urls.length} in sitemap, ${N_LESSONS} lessons, ${COURSES.length} courses. Version ${VER}. Site: ${SITE}`);
