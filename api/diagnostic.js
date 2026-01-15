export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { answers } = req.body || {};
    if (!answers || typeof answers !== "object") {
      return res.status(400).json({ error: "Missing answers" });
    }

    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) {
      return res.status(500).json({ error: "Missing OPENAI_API_KEY in Vercel env vars" });
    }

    // Keep it deterministic and "Apple clean"
    const system = `
You are MN8 Diagnostic.
Write at a 5th grade reading level.
No fluff. No motivation talk.
Give clarity + a decision.
Output JSON ONLY with:
{
  "core": "2–3 short sentences",
  "mechanism": "2–3 short sentences",
  "consequence": "2–3 short sentences",
  "closing": "1–2 short sentences that land like a decision"
}
    `.trim();

    const user = `
Answers:
q1: ${answers.q1 || ""}
q2: ${answers.q2 || ""}
q3: ${answers.q3 || ""}
q4: ${answers.q4 || ""}
q5: ${answers.q5 || ""}
    `.trim();

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
        temperature: 0.4,
      }),
    });

    const data = await r.json();

    if (!r.ok) {
      return res.status(500).json({
        error: "OpenAI request failed",
        details: data,
      });
    }

    // Responses API returns text in output; safest is to read it like this:
    const text =
      data.output_text ||
      (Array.isArray(data.output)
        ? data.output
            .flatMap((o) => o.content || [])
            .map((c) => c.text || "")
            .join("")
        : "");

    // Expecting JSON output
    let json;
    try {
      json = JSON.parse(text);
    } catch (e) {
      return res.status(500).json({
        error: "Model did not return valid JSON",
        raw: text,
      });
    }

    return res.status(200).json({ summary: json });
  } catch (err) {
    return res.status(500).json({ error: "Server crash", details: String(err) });
  }
}
