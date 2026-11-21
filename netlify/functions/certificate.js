// Issues and verifies digitally signed certificate IDs.
// Needs one environment variable in Netlify: CERT_SECRET (a long random string, kept private).
const crypto = require('crypto');
const COURSES = { ...require('./courses.json'), speaking: { t: 'Public Speaking & Confidence Academy', n: 12 } };
const J = (s, o) => ({ statusCode: s, headers: { 'content-type': 'application/json', 'cache-control': 'no-store' }, body: JSON.stringify(o) });
const norm = n => String(n || '').trim().replace(/\s+/g, ' ').toUpperCase();
const sig = (cid, ymd, n, name) => crypto.createHmac('sha256', process.env.CERT_SECRET)
  .update(['dts', cid, ymd, n, norm(name)].join('|')).digest('base64').replace(/[^A-Za-z0-9]/g, '').toUpperCase().slice(0, 10);
const same = (a, b) => a.length === b.length && crypto.timingSafeEqual(Buffer.from(a), Buffer.from(b));

exports.handler = async (e) => {
  if (!process.env.CERT_SECRET) return J(503, { error: 'Certificate signing is not set up yet.' });
  if (e.httpMethod === 'POST') {
    let b; try { b = JSON.parse(e.body || '{}'); } catch (x) { return J(400, { error: 'Bad request.' }); }
    const cid = String(b.cid || ''), c = COURSES[cid], name = String(b.name || '').trim().replace(/\s+/g, ' ');
    if (!c) return J(400, { error: 'Unknown course.' });
    if (cid === 'speaking') {
      const token = String((e.headers || {}).authorization || (e.headers || {}).Authorization || '').replace(/^Bearer\s+/i, '');
      const url = process.env.SUPABASE_URL, anon = process.env.SUPABASE_ANON_KEY, service = process.env.SUPABASE_SERVICE_ROLE_KEY;
      if (!token || !url || !anon || !service) return J(503, { error: 'Speaking certificate verification is not configured. Set SUPABASE_URL, SUPABASE_ANON_KEY and SUPABASE_SERVICE_ROLE_KEY.' });
      try {
        const who = await fetch(url.replace(/\/$/, '') + '/auth/v1/user', { headers: { apikey: anon, authorization: 'Bearer ' + token } });
        if (!who.ok) return J(401, { error: 'Please sign in again to verify your account.' });
        const account = await who.json();
        const rows = await fetch(url.replace(/\/$/, '') + '/rest/v1/progress?user_id=eq.' + encodeURIComponent(account.id) + '&select=data', { headers: { apikey: service, authorization: 'Bearer ' + service } });
        if (!rows.ok) return J(503, { error: 'Could not verify saved learning progress.' });
        const records = await rows.json(), speaking = records[0] && records[0].data && records[0].data.speaking;
        const expected = require('../../content/speaking-curriculum.json').flatMap((m, i) => m.lessons.map((_, j) => i + '-' + j));
        const completed = new Set((speaking && speaking.done) || []);
        const words = String((speaking && speaking.finalTranscript) || '').trim().split(/\s+/).filter(Boolean).length;
        if (!speaking || !expected.every(k => completed.has(k)) || !speaking.finalPassed || Number(speaking.finalQuizScore || 0) < 4 || words < 500) return J(403, { error: 'Complete every academy lesson and pass the final speech assessment before requesting your certificate.' });
      } catch (err) { return J(503, { error: 'Certificate verification service is temporarily unavailable.' }); }
    }
    if (name.length < 2 || name.length > 60 || /[<>"{}\\]/.test(name)) return J(400, { error: 'Please enter a valid name (2 to 60 characters).' });
    const date = new Date().toISOString().slice(0, 10), ymd = date.replace(/-/g, '').slice(2);
    return J(200, { code: `DTS-${cid.toUpperCase()}-${ymd}-${c.n}-${sig(cid, ymd, c.n, name)}`, date, name, n: c.n });
  }
  if (e.httpMethod === 'GET') {
    const q = e.queryStringParameters || {};
    const m = /^DTS-([A-Z0-9]+)-(\d{6})-(\d+)-([A-Z0-9]{10})$/.exec(String(q.id || '').trim().toUpperCase());
    if (!m) return J(200, { valid: false, reason: 'format' });
    const cid = m[1].toLowerCase(), c = COURSES[cid];
    if (!c || !q.name) return J(200, { valid: false, reason: 'nomatch' });
    const ok = same(sig(cid, m[2], +m[3], q.name), m[4]);
    return J(200, ok ? { valid: true, cid, title: c.t, n: +m[3], date: `20${m[2].slice(0, 2)}-${m[2].slice(2, 4)}-${m[2].slice(4, 6)}` } : { valid: false, reason: 'nomatch' });
  }
  return J(405, { error: 'Method not allowed.' });
};
