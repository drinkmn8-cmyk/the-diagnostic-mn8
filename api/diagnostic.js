export default async function handler(req, res) {
  // Allow only POST
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed. Use POST." });
  }

  try {
    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) {
      return res.status(500).json({ error: "Missing OPENAI_API_KEY in Vercel env vars." });
    }

    const { answers } = req.body || {};
    if (!answers || typeof answers !== "object") {
      return res.status(400).json({ error: "Missing or invalid answers object." });
    }

    // Keep input clean + predictable
    const payload = {
      q1: answers.q1 || "",
      q2: answers.q2 || "",
      q3: answers.q3 || "",
      q4: answers.q4 || "",
      q5: answers.q5 || "",
    };

    const system = `
You are MN8 Diagnostic Intelligence.
Write in simple, Apple-like language (5th-grade reading level).
No hype. No therapy language. No motivation talk.

Return ONLY valid JSON with EXACT keys:
core_diagnosis
hidden_mechanism
consequence
closing_insight

Rules:
- Each value: 2–4 short lines max.
- One idea per line.
- closing_insight must feel like a verdict (final, decisive).
`;

    const user = `User answers:\n${JSON.stringify(payload, null, 2)}`;

    const r = await fetch("https://api.openai.com/v1/responses", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: "gpt-4.1-mini",
        input: [
          { role: "system", content: system },
          { role: "user", content: user },
        ],
        response_format: { type: "json_object" },
        temperature: 0.4,
      }),
    });

    if (!r.ok) {
      const details = await r.text();
      return res.status(500).json({ error: "OpenAI request failed.", details });
    }

    const data = await r.json();
    const jsonText = data.output_text || "";

    let result;
    try {
      result = JSON.parse(jsonText);
    } catch {
      return res.status(500).json({
        error: "Model did not return valid JSON.",
        raw: jsonText,
      });
    }

    // Hard-shape the output so your UI never breaks
    return res.status(200).json({
      core_diagnosis: result.core_diagnosis || "",
      hidden_mechanism: result.hidden_mechanism || "",
      consequence: result.consequence || "",
      closing_insight: result.closing_insight || "",
    });
  } catch (e) {
    return res.status(500).json({ error: "Server error.", details: String(e) });
  }
}
