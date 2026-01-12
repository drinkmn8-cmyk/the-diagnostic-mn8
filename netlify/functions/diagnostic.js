// netlify/functions/diagnostic.js
// Secure serverless endpoint that calls OpenAI and returns JSON for the results page.

function json(statusCode, body, extraHeaders = {}) {
  return {
    statusCode,
    headers: {
      "Content-Type": "application/json; charset=utf-8",
      "Cache-Control": "no-store",
      ...extraHeaders,
    },
    body: JSON.stringify(body),
  };
}

// Extract model text from Responses API payload (defensive).
function extractOutputText(apiJson) {
  // Newer SDKs expose output_text helper, but raw REST returns structured output.
  // We'll walk the response for "output_text" chunks.
  if (!apiJson) return "";

  // Some responses include a convenience field:
  if (typeof apiJson.output_text === "string" && apiJson.output_text.trim()) {
    return apiJson.output_text.trim();
  }

  const out = apiJson.output;
  if (!Array.isArray(out)) return "";

  let text = "";
  for (const item of out) {
    if (!item) continue;

    // Typical shape: { type: "message", content: [{ type: "output_text", text: "..." }] }
    if (Array.isArray(item.content)) {
      for (const c of item.content) {
        if (c?.type === "output_text" && typeof c.text === "string") {
          text += c.text;
        }
      }
    }

    // Fallback: sometimes message content is in item?.message?.content
    if (item.message && Array.isArray(item.message.content)) {
      for (const c of item.message.content) {
        if (c?.type === "output_text" && typeof c.text === "string") {
          text += c.text;
        }
      }
    }
  }

  return (text || "").trim();
}

function safeParseJson(text) {
  if (!text) return null;

  // Best case: pure JSON
  try {
    return JSON.parse(text);
  } catch (_) {}

  // Fallback: extract first JSON object block
  const match = text.match(/\{[\s\S]*\}/);
  if (!match) return null;

  try {
    return JSON.parse(match[0]);
  } catch (_) {
    return null;
  }
}

function buildPrompt(payload) {
  const lang = payload?.lang === "fr" ? "fr" : "en";
  const name = `${payload?.identity?.firstName || ""} ${payload?.identity?.lastName || ""}`.trim();

  const answers = Array.isArray(payload?.answers) ? payload.answers : [];
  const formatted = answers
    .map((a) => `- ${a.id}: ${String(a.value || "").trim()}`)
    .join("\n");

  const system = lang === "fr"
    ? `Tu es "The Diagnostic" (propulsé par MN8). Tu produis une synthèse premium, clinique, directe.
RÈGLES STRICTES:
- Tu ne donnes PAS de solution, PAS d’étapes, PAS de conseils.
- Tu n’utilises JAMAIS: "tu devrais", "essaie", "je recommande", "plan", "étape".
- Tu ne mentionnes PAS l’IA, ni "modèle", ni "prompt".
- Tu écris comme un rapport court et tranchant.
- Longueur: 1 paragraphe (3–4 lignes max) + 3 à 6 puces + 1 phrase "core readout" (impact).
- Sortie en JSON uniquement, sans texte autour.

FORMAT JSON EXACT:
{
  "summary": "string",
  "indicators": ["string", "..."],
  "core": "string",
  "emailed": false
}`
    : `You are "The Diagnostic" (powered by MN8). You produce a premium, clinical, direct synthesis.
STRICT RULES:
- You do NOT give solutions, steps, or advice.
- Never use: "you should", "try", "I recommend", "plan", "step".
- Do not mention AI, model, or prompt.
- Write like a short professional readout.
- Length: 1 paragraph (max 3–4 lines) + 3 to 6 bullets + 1 "core readout" sentence (impact).
- Output JSON only, with no extra text.

EXACT JSON FORMAT:
{
  "summary": "string",
  "indicators": ["string", "..."],
  "core": "string",
  "emailed": false
}`;

  const user = lang === "fr"
    ? `Nom: ${name || "N/A"}
Réponses:
${formatted}

Tâche: Déduis le pattern principal et écris une lecture qui fait adhérer le problème sans donner de solution.
Rappelle-toi: JSON uniquement.`
    : `Name: ${name || "N/A"}
Answers:
${formatted}

Task: Infer the main pattern and write a readout that makes the problem undeniable without giving a solution.
Remember: JSON only.`;

  return { system, user, lang };
}

exports.handler = async (event) => {
  try {
    if (event.httpMethod !== "POST") {
      return json(405, { error: "method_not_allowed" });
    }

    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) {
      return json(500, { error: "missing_openai_key" });
    }

    const payload = JSON.parse(event.body || "{}");

    // Minimal validation
    if (!payload?.identity?.email || !Array.isArray(payload?.answers) || payload.answers.length < 7) {
      return json(400, { error: "invalid_payload" });
    }

    const { system, user } = buildPrompt(payload);

    // Call OpenAI Responses API
    const resp = await fetch("https://api.openai.com/v1/responses", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: "gpt-5",
        instructions: system,
        input: [
          { role: "user", content: user }
        ],
        // Broadly compatible JSON mode for Responses API:
        text: { format: { type: "json_object" } },
        max_output_tokens: 450,
      }),
    });

    const apiJson = await resp.json().catch(() => null);

    if (!resp.ok) {
      return json(resp.status, {
        error: "openai_error",
        details: apiJson?.error?.message || "unknown_error",
      });
    }

    const outText = extractOutputText(apiJson);
    const parsed = safeParseJson(outText);

    if (!parsed || typeof parsed !== "object") {
      return json(502, { error: "bad_model_output" });
    }

    // Hard normalize / safety guardrails
    const summary = String(parsed.summary || "").trim();
    const core = String(parsed.core || "").trim();
    const indicatorsRaw = Array.isArray(parsed.indicators) ? parsed.indicators : [];
    const indicators = indicatorsRaw
      .map((x) => String(x || "").trim())
      .filter(Boolean)
      .slice(0, 6);

    if (!summary || !core || indicators.length < 3) {
      return json(502, { error: "incomplete_model_output" });
    }

    // emailed will be wired later (SendGrid/Resend). Keep false for now.
    return json(200, {
      summary,
      indicators,
      core,
      emailed: false,
    });
  } catch (e) {
    return json(500, { error: "server_error" });
  }
};
