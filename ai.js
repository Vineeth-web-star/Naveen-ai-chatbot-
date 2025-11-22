export async function handler(event) {
  if (event.httpMethod !== "POST") {
    return { statusCode: 405, body: "Method Not Allowed" };
  }
  try {
    const body = JSON.parse(event.body || "{}");
    const userMessage = (body.message || "").trim();
    if (!userMessage) {
      return { statusCode: 400, body: JSON.stringify({ error: "No message provided." }) };
    }
    const systemPrompt = `You are Naveen AI — calm, confident, helpful. Keep answers concise.`;

    const resp = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userMessage }
        ],
        max_tokens: 300
      })
    });

    const data = await resp.json();
    const reply = data.choices?.[0]?.message?.content || "Sorry, no reply.";
    return { statusCode: 200, body: JSON.stringify({ reply }) };
  } catch (err) {
    return { statusCode: 500, body: JSON.stringify({ error: "Server error", detail: String(err) }) };
  }
}