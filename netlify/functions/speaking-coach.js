const json=(statusCode,obj)=>({statusCode,headers:{'Content-Type':'application/json; charset=utf-8','Cache-Control':'no-store','X-Content-Type-Options':'nosniff'},body:JSON.stringify(obj)});
const BASE=`You are the patient, encouraging speaking and confidence mentor for Duncan's Tech Schools. Help absolute beginners practise public speaking, everyday communication, voice delivery, presentations, interviews and social confidence. Never shame, diagnose or claim to measure a person's actual confidence, personality or intelligence. Give manageable steps, concrete examples and one small exercise at a time. Be warm and practical. If a learner is anxious, validate the feeling and start with a tiny private exercise. Keep replies under 180 words unless asked for detail.`;
exports.handler=async(event)=>{
 if(event.httpMethod!=='POST')return json(405,{error:'method_not_allowed'});
 const key=process.env.ANTHROPIC_API_KEY;if(!key)return json(503,{error:'not_configured'});
 if(Buffer.byteLength(event.body||'','utf8')>12000)return json(413,{error:'request_too_large'});
 let body;try{body=JSON.parse(event.body||'{}')}catch(_){return json(400,{error:'bad_json'})}
 const messages=(Array.isArray(body.messages)?body.messages:[]).slice(-10).map(m=>({role:m.role==='assistant'?'assistant':'user',content:String(m.content||'').slice(0,body.mode==='speech-review'?5000:1500)})).filter(m=>m.content);
 while(messages.length&&messages[0].role!=='user')messages.shift();
 if(!messages.length||messages[messages.length-1].role!=='user')return json(400,{error:'no_question'});
 const scenario=String(body.scenario||'general speaking practice').slice(0,100),difficulty=String(body.difficulty||'Beginner').slice(0,30),mode=body.mode==='voice-conversation',review=body.mode==='speech-review';
 const system=BASE+(review?` You are reviewing a learner's public-speaking transcript. Provide a structured, supportive coaching report: one observed strength, clarity and organization observations, sentence-structure observations, filler expressions only when present in the supplied text, two specific improvements and one short repeatable exercise. Be precise about what is and is not measurable. Never infer actual confidence, personality, intelligence, accent quality or pronunciation accuracy from text. Do not invent acoustic facts. Keep the feedback actionable and kind.`:mode?` You are currently conducting a live, turn-by-turn voice role-play. Scenario: ${scenario}. Learner level: ${difficulty}. Stay in character as the conversation partner or audience member, ask only one natural question at a time, respond to what the learner actually said, and keep each spoken turn concise (usually 1–3 sentences). Do not give a long lecture. After several turns, offer one specific kind observation and one small improvement.`:` The learner may be asking about ${scenario}. Their level is ${difficulty}.`);
 const controller=new AbortController(),timer=setTimeout(()=>controller.abort(),18000);
 try{
  const response=await fetch('https://api.anthropic.com/v1/messages',{method:'POST',signal:controller.signal,headers:{'content-type':'application/json','x-api-key':key,'anthropic-version':'2023-06-01'},body:JSON.stringify({model:process.env.ANTHROPIC_MODEL||'claude-haiku-4-5-20251001',max_tokens:450,system,messages})});
  const raw=await response.text();let data={};try{data=JSON.parse(raw)}catch(_){}
  if(!response.ok){
   if(response.status===401||response.status===403)return json(502,{error:'ai_key_rejected'});
   if(response.status===404)return json(502,{error:'ai_model_unavailable'});
   if(response.status===429)return json(429,{error:'ai_rate_limited'});
   if(response.status===529||response.status>=500)return json(502,{error:'ai_provider_busy'});
   return json(502,{error:'ai_service_error'});
  }
  const reply=(data.content||[]).filter(x=>x.type==='text').map(x=>x.text).join('\n').trim();
  return json(200,{reply:reply||'Let us try one small exercise. Tell me what you would like to practise.'});
 }catch(e){return json(502,{error:e&&e.name==='AbortError'?'ai_timeout':'ai_network_error'})}
 finally{clearTimeout(timer)}
};
