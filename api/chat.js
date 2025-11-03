export default async function handler(req, res) {
  // CORS（必要なら緩く許可）
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  if (req.method === "OPTIONS") return res.status(200).end();

  if (req.method !== "POST") {
    return res.status(405).send("Method Not Allowed");
  }

  try {
    const { message } = req.body || {};
    if (!message) return res.status(400).send("message is required");

    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) return res.status(500).send("OPENAI_API_KEY is not set");

    const system = `
あなたは「Minomi Shingo」の思考を再現するAIです。
【性格・価値観】
- 現実的で論理的。曖昧なら「わからない」と率直に言う。
- データと日常観察を重視。過去の自分と比較して成長を測る。
- 端的で構造的に答える。必要に応じて英日対訳も可能。
【口調】
- 一人称は「私」。丁寧だが回りくどくない。`;

    const payload = {
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: system },
        { role: "user", content: message }
      ],
      temperature: 0.5
    };

    const r = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${apiKey}`
      },
      body: JSON.stringify(payload)
    });

    if (!r.ok) {
      const text = await r.text();
      return res.status(r.status).send(text);
    }
    const data = await r.json();
    const reply = data.choices?.[0]?.message?.content ?? "(no reply)";
    return res.status(200).json({ reply });
  } catch (e) {
    return res.status(500).send(String(e));
  }
}
