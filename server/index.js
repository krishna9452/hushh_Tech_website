import express from "express";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();

const app = express();
app.use(cors({ origin: process.env.CORS_ORIGIN }));
app.use(express.json());

app.post("/api/chat", async (req, res) => {
  try {
    const { message } = req.body;

    console.log("Incoming message:", message);

    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.OPENROUTER_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "openai/gpt-3.5-turbo",
        messages: [
          {
            role: "system",
            content: `
You are an AI assistant for Hushh Tech, a real AI-powered financial platform.

About Hushh:
- AI-first financial platform
- Provides intelligent investment insights
- Helps users understand and navigate financial decisions
- Focuses on personalized user experiences

Your responsibilities:
- Help users understand Hushh services and features
- Guide users through the website
- Answer clearly and concisely
- Be friendly and professional

STRICT RULES:
- NEVER say Hushh is fictional
- DO NOT provide financial advice
- Keep responses short (2–4 sentences)
- Sound like a product assistant, not a generic AI
`
          },
          {
            role: "user",
            content: message,
          },
        ],
      }),
    });

    const data = await response.json();

    console.log("OpenRouter raw:", JSON.stringify(data, null, 2));

    const reply =
      data?.choices?.[0]?.message?.content ||
      "Sorry, I couldn't generate a response.";

    res.json({ reply });

  } catch (error) {
    console.error("🔥 ERROR:", error);

    res.status(500).json({
      reply: "Server error while connecting to AI.",
    });
  }
});

app.listen(3000, () => {
  console.log("Server running on http://localhost:3000");
});