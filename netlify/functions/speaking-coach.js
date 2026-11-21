// netlify/functions/speaking-coach.js
// AI speaking mentor powered by Google Gemini (free tier).
// Requires the environment variable GEMINI_API_KEY (scope: Functions).

const MODEL = process.env.GEMINI_MODEL || "gemini-2.5-flash";

const SYSTEM_PROMPT =
  "You are a friendly speaking mentor for students at Duncan's Tech Schools. " +
  "Help them practise introductions, short speeches and presentations. " +
  "Give small, practical exercises. Keep replies clear, encouraging and under 150 words.";

const headers = {
  "Content-Type": "application/json",
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "Content-Type",
};

function reply(statusCode, body) {
  return { statusCode, headers, body: JSON.stringify(body) };
}

exports.handler = async (event) => {
  if (event.httpMethod === "OPTIONS") return reply(200, {});
  if (event.httpMethod !== "POST") return reply(405, { error: "Use POST." });

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    console.error("GEMINI_API_KEY is missing in Netlify environment variables.");
    return reply(500, { error: "The AI service is not configured yet." });
  }

  // Accept several request shapes so the existing frontend keeps working.
  let data = {};
  try {
    data = JSON.parse(event.body || "{}");
  } catch (e) {
    return reply(400, { error: "Invalid request." });
  }

  let userText =
    data.message || data.prompt || data.text || data.input || data.question || "";

  if (!userText && Array.isArray(data.messages) && data.messages.length) {
    const last = data.messages[data.messages.length - 1];
    userText = typeof last === "string" ? last : last.content || last.text || "";
  }

  userText = String(userText).trim().slice(0, 2000);
  if (!userText) return reply(400, { error: "Please type something first." });

  try {
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/${MODEL}:generateContent`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-goog-api-key": apiKey,
        },
        body: JSON.stringify({
          systemInstruction: { parts: [{ text: SYSTEM_PROMPT }] },
          contents: [{ role: "user", parts: [{ text: userText }] }],
          generationConfig: { maxOutputTokens: 500, temperature: 0.7 },
        }),
      }
    );

    if (!response.ok) {
      const errText = await response.text();
      console.error("Gemini error:", response.status, errText);
      return reply(502, {
        error: "The AI service rejected the request. Check the function logs.",
      });
    }

    const result = await response.json();
    const text =
      (result.candidates &&
        result.candidates[0] &&
        result.candidates[0].content &&
        result.candidates[0].content.parts &&
        result.candidates[0].content.parts.map((p) => p.text || "").join("")) ||
      "Sorry, I could not think of a reply. Please try again.";

    // Several field names so whichever one the frontend reads will exist.
    return reply(200, { reply: text, text, message: text, output: text });
  } catch (err) {
    console.error("Function error:", err);
    return reply(500, { error: "Something went wrong. Please try again." });
  }
};
