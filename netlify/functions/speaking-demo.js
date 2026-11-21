// Generates a short, beginner-friendly speaking demonstration storyboard with AI.
const json=(statusCode,obj)=>({statusCode,headers:{'Content-Type':'application/json; charset=utf-8','Cache-Control':'no-store','X-Content-Type-Options':'nosniff'},body:JSON.stringify(obj)});
exports.handler=async event=>{
 if(event.httpMethod!=='POST')return json(405,{error:'method_not_allowed'});
 const key=process.env.ANTHROPIC_API_KEY;if(!key)return json(503,{error:'not_configured'});
 if(Buffer.byteLength(event.body||'','utf8')>3000)return json(413,{error:'request_too_large'});
 let b;try{b=JSON.parse(event.body||'{}')}catch(_){return json(400,{error:'bad_json'})}
 const technique=String(b.technique||'speaking clearly').slice(0,100),style=b.style==='bad'?'ineffective':'effective';
 const prompt=`Create a short educational ${style} public-speaking demonstration about: ${technique}. Return ONLY valid JSON with this exact shape: {"title":"...","summary":"...","scenes":[{"caption":"short on-screen sentence, max 12 words","action":"one concise visual direction for a simple animated presenter","narration":"one sentence, max 24 words"}]} Include exactly 4 scenes. For ineffective demonstrations, show a common mistake respectfully, then make the learning point clear in the summary. Avoid stereotyping accents, bodies, disabilities or cultures.`;
 try{const r=await fetch('https://api.anthropic.com/v1/messages',{method:'POST',headers:{'content-type':'application/json','x-api-key':key,'anthropic-version':'2023-06-01'},body:JSON.stringify({model:process.env.ANTHROPIC_MODEL||'claude-haiku-4-5-20251001',max_tokens:650,messages:[{role:'user',content:prompt}]})});const d=await r.json();if(!r.ok)return json(502,{error:'ai_service_error'});const raw=(d.content||[]).filter(x=>x.type==='text').map(x=>x.text).join('').replace(/^```(?:json)?|```$/g,'').trim();const data=JSON.parse(raw);if(!Array.isArray(data.scenes)||data.scenes.length!==4)throw Error('bad storyboard');return json(200,{title:String(data.title||technique).slice(0,100),summary:String(data.summary||'').slice(0,400),scenes:data.scenes.map(s=>({caption:String(s.caption||'').slice(0,120),action:String(s.action||'').slice(0,180),narration:String(s.narration||'').slice(0,220)}))});}
 catch(_){return json(502,{error:'demo_generation_failed'})}
};
