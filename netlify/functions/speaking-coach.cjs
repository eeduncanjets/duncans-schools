// netlify/functions/speaking-coach.cjs
// AI speaking mentor + voice coach powered by Google Gemini (free tier).
// Needs the Netlify environment variable GEMINI_API_KEY (scope: Functions).
// Optional: GEMINI_MODEL (defaults to gemini-3.8-flash).
// If the main model is busy, rate-limited or retired, a backup model is tried automatically.

const MODEL = process.env.GEMINI_MODEL || "gemini-3.8-flash";
const FALLBACK_MODELS = ["gemini-2.5-flash-lite"].filter((m) => m !== MODEL);
const TOTAL_MS = 9500; // Netlify functions time out at about 10 seconds by default

const headers = { "Content-Type": "application/json" };
const send = (statusCode, body) => ({ statusCode, headers, body: JSON.stringify(body) });

function buildSystemPrompt(data) {
  let prompt =
    "You are a warm, encouraging public speaking coach for learners at Duncan's Tech Schools in Ghana. " +
    "Give practical, specific advice and small exercises. Never claim to judge pronunciation, accent, " +
    "personality, intelligence or real confidence. Use plain, simple English.";

  if (data.mode === "voice-conversation") {
    prompt +=
      " This is a spoken conversation practice, so reply in 1 to 3 short sentences, with no lists, " +
      "no markdown and no emojis, and end with one simple question or prompt for the learner.";
    if (data.scenario) prompt += " Scenario: " + String(data.scenario).slice(0, 100) + ".";
    if (data.difficulty) prompt += " Difficulty: " + String(data.difficulty).slice(0, 50) + ".";
  } else if (data.mode === "speech-review") {
    prompt += " Give a clear, structured review in under 300 words, in plain text without markdown symbols.";
  } else {
    prompt += " Keep answers under 150 words unless the learner asks for more.";
  }
  return prompt;
}

function buildContents(messages) {
  const contents = [];
  for (const m of messages.slice(-20)) {
    if (!m || typeof m.content !== "string" || !m.content.trim()) continue;
    const role = m.role === "assistant" ? "model" : "user";
    const text = m.content.slice(0, 4500);
    const last = contents[contents.length - 1];
    if (last && last.role === role) last.parts[0].text += "\n" + text; // merge same-role neighbours
    else contents.push({ role, parts: [{ text }] });
  }
  while (contents.length && contents[0].role !== "user") contents.shift();
  return contents;
}

function configFor(model) {
  // Thinking tokens count toward maxOutputTokens, so keep thinking low and the cap generous.
  const cfg = { maxOutputTokens: 1500 };
  if (model.includes("2.5")) cfg.thinkingConfig = { thinkingBudget: 0 };
  else if (model.startsWith("gemini-3")) cfg.thinkingConfig = { thinkingLevel: "low" };
  return cfg;
}

function errorCodeFor(status, bodyText) {
  const t = (bodyText || "").toLowerCase();
  if (status === 401 || status === 403 || (status === 400 && t.includes("api key"))) return "ai_key_rejected";
  if (status === 404) return "ai_model_unavailable";
  if (status === 429) return "ai_rate_limited";
  if (status === 500 || status === 503) return "ai_provider_busy";
  return "ai_service_error";
}

// Temporary diagnostic page: open .../speaking-coach?debug=1 in a browser.
async function runDebug(apiKey) {
  const out = { primaryModel: MODEL, backupModels: FALLBACK_MODELS };
  try {
    const r = await fetch("https://generativelanguage.googleapis.com/v1beta/models?pageSize=200", {
      headers: { "x-goog-api-key": apiKey },
    });
    out.listStatus = r.status;
    const t = await r.text();
    try {
      const j = JSON.parse(t);
      out.modelsYourKeyCanUse = (j.models || [])
        .filter((m) => (m.supportedGenerationMethods || []).includes("generateContent"))
        .map((m) => m.name.replace("models/", ""));
      if (j.error) out.listError = j.error;
    } catch (e) {
      out.listBody = t.slice(0, 500);
    }
  } catch (e) {
    out.listFailed = String(e && e.message);
  }

  out.tests = [];
  for (const model of [MODEL, ...FALLBACK_MODELS]) {
    const test = { model };
    try {
      const r = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent`, {
        method: "POST",
        headers: { "Content-Type": "application/json", "x-goog-api-key": apiKey },
        body: JSON.stringify({
          contents: [{ role: "user", parts: [{ text: "Say hello in three words." }] }],
          generationConfig: configFor(model),
        }),
      });
      test.status = r.status;
      const t = await r.text();
      try {
        const j = JSON.parse(t);
        if (j.error) test.googleError = j.error;
        else test.reply = (((j.candidates || [])[0] || {}).content || {}).parts;
      } catch (e) {
        test.body = t.slice(0, 500);
      }
    } catch (e) {
      test.failed = String(e && e.message);
    }
    out.tests.push(test);
  }
  return { statusCode: 200, headers, body: JSON.stringify(out, null, 2) };
}

exports.handler = async (event) => {
  const apiKey = process.env.GEMINI_API_KEY;
  if (event.httpMethod === "GET" && event.queryStringParameters && event.queryStringParameters.debug === "1") {
    if (!apiKey) return send(200, { problem: "GEMINI_API_KEY is not visible to the function. Check its name and that Functions is ticked in its scopes, then redeploy." });
    return runDebug(apiKey);
  }
  if (event.httpMethod !== "POST") return send(405, { error: "method_not_allowed" });

  if (!apiKey) {
    console.error("GEMINI_API_KEY is missing. Add it in Netlify > Environment variables (scope: Functions).");
    return send(500, { error: "not_configured" });
  }

  let data = {};
  try {
    data = JSON.parse(event.body || "{}");
  } catch (e) {
    return send(400, { error: "bad_request" });
  }

  const contents = buildContents(Array.isArray(data.messages) ? data.messages : []);
  if (!contents.length) return send(400, { error: "bad_request" });

  const systemInstruction = { parts: [{ text: buildSystemPrompt(data) }] };
  const models = [MODEL, ...FALLBACK_MODELS];
  const startedAt = Date.now();
  let lastCode = "ai_service_error";

  for (let i = 0; i < models.length; i++) {
    const model = models[i];
    const remaining = TOTAL_MS - (Date.now() - startedAt);
    if (remaining < 1500) break;
    const attemptMs = i < models.length - 1 ? Math.min(6000, remaining) : remaining;

    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), attemptMs);

    try {
      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json", "x-goog-api-key": apiKey },
          body: JSON.stringify({ systemInstruction, contents, generationConfig: configFor(model) }),
          signal: controller.signal,
        }
      );

      if (!response.ok) {
        const errText = await response.text();
        console.error(`Gemini error (${model}):`, response.status, errText.slice(0, 600));
        lastCode = errorCodeFor(response.status, errText);
        if (lastCode === "ai_key_rejected") break; // another model will not fix a bad key
        continue; // busy, rate-limited or unavailable: try the backup model
      }

      const result = await response.json();
      const parts =
        result.candidates && result.candidates[0] && result.candidates[0].content
          ? result.candidates[0].content.parts || []
          : [];
      const text = parts.map((p) => p.text || "").join("").trim();

      if (!text) {
        console.error(`Gemini returned no text (${model}):`, JSON.stringify(result).slice(0, 500));
        lastCode = "ai_service_error";
        continue;
      }
      return send(200, { reply: text });
    } catch (err) {
      console.error(`Function error (${model}):`, err && err.name, err && err.message);
      lastCode = err && err.name === "AbortError" ? "ai_timeout" : "ai_network_error";
    } finally {
      clearTimeout(timer);
    }
  }

  const status = lastCode === "ai_rate_limited" ? 429 : lastCode === "ai_timeout" ? 504 : 502;
  return send(status, { error: lastCode });
};
