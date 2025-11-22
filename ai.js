import OpenAI from "openai";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const client = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
  });

  try {
    const { message } = req.body;

    const response = await client.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content: "You are a personal AI version of Vineeth.",
        },
        { role: "user", content: message },
      ],
    });

    res.status(200).json({
      reply: response.choices[0].message.content,
    });

  } catch (error) {
    console.error("API Error:", error);
    res.status(500).json({ error: "Server error" });
  }
}
