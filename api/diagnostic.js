export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { answers } = req.body || {};
    if (!answers) {
      return res.status(400).json({ error: "Missing answers" });
    }

    const prompt = `
You are MN8.

Write a premium diagnostic summary in SIMPLE, direct language (5th–7th grade level).

Return ONLY valid JSON with exactly these keys:
core, mechanism, consequence, closing

Rules:
- core: 2–4 sentences
- mechanism: 2–4 sentences
- consequence: 2–4 sentences
- closing: 2–3 sentences, lands like a decision (not a thought)
- No bullet points
- No markdown
- No extra keys

User answers:
q1: ${answers.q1}
q2: ${answers.q2}
q3: ${answers.q3}
q4: ${answers.q4}
q5: ${answers.q5}
`.trim();

    const r = await fetch("https://api.openai.com/v1/responses", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: "gpt-4.1-mini",
        input: [
          {
            role: "user",
            content: [{ type: "text", text: prompt }]
          }
        ],
        text: {
          format: "json"
        }
      }),
    });

    const data = await r.json();

    if (!r.ok) {
      return res.status(500).json({
        error: "OpenAI request failed",
        details: data
      });
    }

    const text =
      data.output_text ||
      data.output?.[0]?.content?.[0]?.text;

    if (!text) {
      return res.status(500).json({
        error: "No text returned from model",
        raw: data
      });
    }

    let parsed;
    try {
      parsed = JSON.parse(text);
    } catch {
      return res.status(500).json({
        error: "Invalid JSON from model",
        raw: text
      });
    }

    const { core, mechanism, consequence, closing } = parsed;

    if (!core || !mechanism || !consequence || !closing) {
      return res.status(500).json({
        error: "Missing required fields",
        parsed
      });
    }

    return res.status(200).json({ core, mechanism, consequence, closing });

  } catch (err) {
    return res.status(500).json({
      error: "Server error",
      details: String(err)
    });
  }
}
