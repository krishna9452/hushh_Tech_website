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

    if (!message || typeof message !== "string" || !message.trim()) {
      return res.status(400).json({ reply: "Message is required and must be a non-empty string." });
    }

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
          // ...
        ],
      }),
    });

    if (!response.ok) {
      const errorDetails = await response.text();
      console.error("OpenRouter API error:", response.status, errorDetails);
      throw new Error("Failed to communicate with AI service.");
    }

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