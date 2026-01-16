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
Write a premium diagnostic summary in SIMPLE, direct language (5th–7th grade).

Return ONLY valid JSON with EXACTLY these keys:
- core
- mechanism
- consequence
- closing

Rules:
- core: 2–4 sentences
- mechanism: 2–4 sentences
- consequence: 2–4 sentences
- closing: 2–3 sentences
- No bullet points
- No markdown
- No extra text

User answers:
q1: ${answers.q1 || ""}
q2: ${answers.q2 || ""}
q3: ${answers.q3 || ""}
q4: ${answers.q4 || ""}
q5: ${answers.q5 || ""}
`.trim();

    const r = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: "gpt-4.1-mini",
        messages: [
          { role: "system", content: "You output ONLY valid JSON. No explanations." },
          { role: "user", content: prompt }
        ],
        temperature: 0.4
      }),
    });

    const data = await r.json();

    if (!r.ok) {
      return res.status(r.status).json({
        error: "OpenAI request failed",
        openai: data
      });
    }

    const text = data?.choices?.[0]?.message?.content;
    if (!text) {
      return res.status(500).json({ error: "Empty model response" });
    }

    let parsed;
    try {
      parsed = JSON.parse(text);
    } catch {
      return res.status(500).json({
        error: "Model did not return valid JSON",
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
