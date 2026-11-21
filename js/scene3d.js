/* 3D hero background. Loads Three.js lazily, only on the home page, and backs off on slow devices. */
(function(){
 const canvas=document.getElementById('bg');if(!canvas)return;
 const lite=(navigator.connection&&navigator.connection.saveData)||matchMedia('(prefers-reduced-motion: reduce)').matches||!document.body.dataset.three;
 if(lite){canvas.remove();return}
 const start=()=>{const s=document.createElement('script');s.src='https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js';s.onload=init;s.onerror=()=>canvas.remove();document.head.appendChild(s)};
 'requestIdleCallback' in window?requestIdleCallback(start,{timeout:2500}):setTimeout(start,1200);

 function init(){
  const small=innerWidth<700;
  const renderer=new THREE.WebGLRenderer({canvas,antialias:!small,alpha:true,powerPreference:'low-power'});
  renderer.setPixelRatio(Math.min(devicePixelRatio,small?1.5:2));
  const scene=new THREE.Scene(),camera=new THREE.PerspectiveCamera(60,1,.1,200);camera.position.z=9;
  const group=new THREE.Group();scene.add(group);
  const core=new THREE.Mesh(new THREE.IcosahedronGeometry(2.2,1),new THREE.MeshBasicMaterial({color:0x2DE2E6,wireframe:true,transparent:true,opacity:.5}));
  const inner=new THREE.Mesh(new THREE.IcosahedronGeometry(1.3,0),new THREE.MeshBasicMaterial({color:0x7C5CFF,transparent:true,opacity:.3}));
  group.add(core,inner);
  const rings=[3.2,3.8,4.4].map((r,i)=>{const m=new THREE.Mesh(new THREE.TorusGeometry(r,.014,8,small?90:160),new THREE.MeshBasicMaterial({color:i==1?0xFFB547:0x7C5CFF,transparent:true,opacity:.7}));m.rotation.set(Math.random()*3,Math.random()*3,0);group.add(m);return m});
  const cubes=[];
  for(let i=0;i<(small?8:16);i++){const m=new THREE.Mesh(new THREE.BoxGeometry(.28,.28,.28),new THREE.MeshBasicMaterial({color:i%2?0xFFB547:0x2DE2E6,wireframe:true}));m.userData={a:Math.random()*6.28,r:3+Math.random()*2.5,s:.15+Math.random()*.4,y:(Math.random()-.5)*4};cubes.push(m);group.add(m)}
  const N=small?500:1400,pos=new Float32Array(N*3);
  for(let i=0;i<N;i++){const r=8+Math.random()*30,t=Math.random()*6.28,p=Math.acos(2*Math.random()-1);pos[i*3]=r*Math.sin(p)*Math.cos(t);pos[i*3+1]=r*Math.sin(p)*Math.sin(t);pos[i*3+2]=r*Math.cos(p)}
  const geo=new THREE.BufferGeometry();geo.setAttribute('position',new THREE.BufferAttribute(pos,3));
  const stars=new THREE.Points(geo,new THREE.PointsMaterial({color:0x9AA5D6,size:.06,transparent:true,opacity:.8}));scene.add(stars);
  let mx=0,my=0,sy=0,frames=0,last=performance.now(),slow=0,running=true;
  addEventListener('pointermove',e=>{mx=e.clientX/innerWidth-.5;my=e.clientY/innerHeight-.5},{passive:true});
  addEventListener('scroll',()=>{sy=scrollY},{passive:true});
  function resize(){renderer.setSize(innerWidth,innerHeight,false);camera.aspect=innerWidth/innerHeight;camera.updateProjectionMatrix();group.position.x=innerWidth>900?3.2:0;group.scale.setScalar(innerWidth>900?1:.7)}
  addEventListener('resize',resize);resize();
  const clock=new THREE.Clock();
  function frame(){
   if(!running)return;
   const now=performance.now(),dt=now-last;last=now;
   if(++frames>30&&frames<=150){slow+=dt;if(frames===150&&slow/120>34){renderer.setPixelRatio(1);stars.visible=false;cubes.forEach((c,i)=>{c.visible=i<6})}}
   const t=clock.getElapsedTime();
   core.rotation.x=t*.15;core.rotation.y=t*.22;inner.rotation.y=-t*.3;inner.rotation.x=t*.2;inner.scale.setScalar(1+Math.sin(t*1.5)*.08);
   rings.forEach((r,i)=>{r.rotation.x+=.003*(i+1);r.rotation.y+=.002*(3-i)});
   cubes.forEach(c=>{const d=c.userData,a=d.a+t*d.s;c.position.set(Math.cos(a)*d.r,d.y+Math.sin(t+d.a)*.4,Math.sin(a)*d.r);c.rotation.x=t;c.rotation.y=t*.7});
   stars.rotation.y=t*.01;
   group.position.y+=(-sy*.0016-group.position.y)*.06;
   group.rotation.y+=((mx*.8)-group.rotation.y)*.05;group.rotation.x+=((my*.5)-group.rotation.x)*.05;
   camera.position.z=9+Math.min(sy/500,4);
   core.material.color.setHSL((.5+sy/4000)%1,.85,.6);
   renderer.render(scene,camera);requestAnimationFrame(frame);
  }
  document.addEventListener('visibilitychange',()=>{running=!document.hidden;if(running){last=performance.now();requestAnimationFrame(frame)}});
  canvas.classList.add('on');frame();
 }
})();
