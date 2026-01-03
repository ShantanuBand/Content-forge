import dotenv from "dotenv";
dotenv.config();

import Groq from "groq-sdk";

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY
});

export const generateAIContent = async (req, res) => {
  try {
    const { topic } = req.body;

    if (!topic || !topic.trim()) {
      return res.status(400).json({ message: "Topic is required" });
    }

    const completion = await groq.chat.completions.create({
      model: "llama-3.1-8b-instant",
      messages: [
        {
          role: "system",
          content: "You are a helpful content writer."
        },
        {
          role: "user",
          content: `Write a beginner-friendly article about "${topic}".`
        }
      ],
      temperature: 0.7
    });

    const text = completion.choices[0]?.message?.content;

    if (!text) {
      throw new Error("No text returned from Groq");
    }

    res.status(200).json({
      title: `The Future of ${topic}`,
      content: text
    });
  } catch (error) {
    console.error("Groq Error:", error);
    res.status(500).json({
      message: "AI generation failed",
      error: error.message
    });
  }
};
