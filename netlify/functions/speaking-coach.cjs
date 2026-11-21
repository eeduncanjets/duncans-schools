// netlify/functions/speaking-coach.js
// AI speaking mentor + voice coach powered by Google Gemini (free tier).
// Needs the Netlify environment variable GEMINI_API_KEY (scope: Functions).
// Optional: GEMINI_MODEL (defaults to gemini-3.8-flash).

const MODEL = process.env.GEMINI_MODEL || "gemini-3.8-flash";

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

function errorCodeFor(status, bodyText) {
  const t = (bodyText || "").toLowerCase();
  if (status === 401 || status === 403 || (status === 400 && t.includes("api key"))) return "ai_key_rejected";
  if (status === 404) return "ai_model_unavailable";
  if (status === 429) return "ai_rate_limited";
  if (status === 500 || status === 503) return "ai_provider_busy";
  return "ai_service_error";
}

exports.handler = async (event) => {
  if (event.httpMethod !== "POST") return send(405, { error: "method_not_allowed" });

  const apiKey = process.env.GEMINI_API_KEY;
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

  // Thinking tokens count toward maxOutputTokens, so keep thinking low and the cap generous.
  const generationConfig = { maxOutputTokens: 1500 };
  if (MODEL.includes("2.5")) generationConfig.thinkingConfig = { thinkingBudget: 0 };
  else if (MODEL.startsWith("gemini-3")) generationConfig.thinkingConfig = { thinkingLevel: "low" };

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 9000);

  try {
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/${MODEL}:generateContent`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json", "x-goog-api-key": apiKey },
        body: JSON.stringify({
          systemInstruction: { parts: [{ text: buildSystemPrompt(data) }] },
          contents,
          generationConfig,
        }),
        signal: controller.signal,
      }
    );

    if (!response.ok) {
      const errText = await response.text();
      console.error("Gemini error:", response.status, errText);
      const code = errorCodeFor(response.status, errText);
      return send(code === "ai_rate_limited" ? 429 : 502, { error: code });
    }

    const result = await response.json();
    const parts =
      result.candidates && result.candidates[0] && result.candidates[0].content
        ? result.candidates[0].content.parts || []
        : [];
    const text = parts.map((p) => p.text || "").join("").trim();

    if (!text) console.error("Gemini returned no text:", JSON.stringify(result).slice(0, 500));
    return send(200, { reply: text || "Let us try one small exercise. Tell me about your day in three sentences." });
  } catch (err) {
    console.error("Function error:", err && err.name, err && err.message);
    return send(504, { error: err && err.name === "AbortError" ? "ai_timeout" : "ai_network_error" });
  } finally {
    clearTimeout(timer);
  }
};
