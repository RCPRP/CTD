const MAX_UPDATE_LENGTH = 520;

function sendJson(response, status, body) {
  response.status(status).setHeader("Content-Type", "application/json").send(JSON.stringify(body));
}

function extractText(result) {
  return result?.candidates?.[0]?.content?.parts?.map((part) => part.text || "").join("").trim() || "";
}

function parseCoaching(text) {
  const parsed = JSON.parse(text.replace(/^```json\s*|\s*```$/g, "").trim());
  if (!parsed.title || !parsed.coaching || !parsed.nextRep || !parsed.boundary) throw new Error("Incomplete coaching response");
  return {
    title: String(parsed.title).slice(0, 80),
    coaching: String(parsed.coaching).slice(0, 700),
    nextRep: String(parsed.nextRep).slice(0, 280),
    boundary: String(parsed.boundary).slice(0, 260)
  };
}

export default async function handler(request, response) {
  if (request.method !== "POST") return sendJson(response, 405, { error: "Method not allowed" });
  if (!process.env.GEMINI_API_KEY) return sendJson(response, 503, { error: "AI coaching is not configured" });
  const body = request.body || {};
  const evidenceChoice = ["a", "b", "c"].includes(body.evidenceChoice) ? body.evidenceChoice : null;
  const hypothesisChoice = ["a", "b", "c"].includes(body.hypothesisChoice) ? body.hypothesisChoice : null;
  const stakeholderUpdate = typeof body.stakeholderUpdate === "string" ? body.stakeholderUpdate.trim().slice(0, MAX_UPDATE_LENGTH) : "";
  if (!evidenceChoice || !hypothesisChoice) return sendJson(response, 400, { error: "A complete simulation response is required" });

  const prompt = `You are a responsible engineering coach for a third-year computer science student. Give concise, practical feedback on one simulated production incident. Do not infer personality, mental health, aptitude, or employability. Do not score the student. Do not claim this feedback is suitable for hiring. Focus only on observable choices and the written update.

Simulation facts: A college quiz platform began returning intermittent 500 errors shortly after a deployment. The safest evidence-first option was to request read-only correlation of logs, deploy diff, endpoints, and database saturation. The safest hypothesis/action was to revert a likely retry-wrapper regression and monitor recovery. The stakeholder update should state impact, current action, and a time for the next update without blame or false certainty.

Student choices: evidence=${evidenceChoice}; hypothesis=${hypothesisChoice}; stakeholder update=${JSON.stringify(stakeholderUpdate || "No update was provided")}.

Return ONLY valid JSON in this exact shape:
{"title":"short coaching heading","coaching":"2-4 sentences, concrete and kind","nextRep":"one actionable 10-minute practice","boundary":"This is learning feedback about this simulation, not a personality or hiring assessment."}`;

  try {
    const model = process.env.GEMINI_MODEL || "gemini-3.7-flash";
    const geminiResponse = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${encodeURIComponent(model)}:generateContent`, {
      method: "POST",
      headers: { "Content-Type": "application/json", "x-goog-api-key": process.env.GEMINI_API_KEY },
      body: JSON.stringify({
        contents: [{ role: "user", parts: [{ text: prompt }] }],
        generationConfig: { temperature: 0.35, maxOutputTokens: 500, responseMimeType: "application/json" },
        safetySettings: [
          { category: "HARM_CATEGORY_HARASSMENT", threshold: "BLOCK_MEDIUM_AND_ABOVE" },
          { category: "HARM_CATEGORY_HATE_SPEECH", threshold: "BLOCK_MEDIUM_AND_ABOVE" },
          { category: "HARM_CATEGORY_SEXUALLY_EXPLICIT", threshold: "BLOCK_MEDIUM_AND_ABOVE" },
          { category: "HARM_CATEGORY_DANGEROUS_CONTENT", threshold: "BLOCK_MEDIUM_AND_ABOVE" }
        ]
      })
    });
    if (!geminiResponse.ok) return sendJson(response, 502, { error: "AI coaching is temporarily unavailable" });
    return sendJson(response, 200, { feedback: parseCoaching(extractText(await geminiResponse.json())) });
  } catch (error) {
    console.error("Gemini endpoint error", error instanceof Error ? error.message : "unknown error");
    return sendJson(response, 502, { error: "AI coaching is temporarily unavailable" });
  }
}
