import dotenv from "dotenv";
dotenv.config();

import Groq from "groq-sdk";
import { GoogleGenerativeAI } from "@google/generative-ai";
import OpenAI from "openai";

// Dynamic topic-aware article generator fallback
function generateTopicArticle(topic) {
  const cleanTopic = topic.trim();
  const title = `Understanding ${cleanTopic}: The Basics`;

  const content = `## What is ${cleanTopic}?

**${cleanTopic}** is a fundamental concept, tool, or technology. Understanding the basic idea behind **${cleanTopic}** is the first step toward mastering it.

### Key Highlights & Features

- 🚀 **Purpose**: Solves specific problems and streamlines workflows.
- 🔒 **Flexibility**: Can be adapted to various use-cases and environments.
- ⚡ **Scalability**: Designed to handle growing workloads or complexity.

### Why it matters

Learning about **${cleanTopic}** gives you a solid foundation in this domain. Whether you are building applications, analyzing systems, or exploring new methodologies, grasping this concept provides significant value.

### Next Steps

To dive deeper, we recommend looking into official documentation, community tutorials, and practical examples specifically related to **${cleanTopic}**.

*(Note: This is a fallback article generated because the AI service is currently unavailable. Please check your API keys or connection.)*`;

  return { title, content };
}

export const generateAIContent = async (req, res) => {
  try {
    const { topic } = req.body;

    if (!topic || !topic.trim()) {
      return res.status(400).json({ message: "Topic is required" });
    }

    const cleanTopic = topic.trim();
    
    const systemPrompt = "You are an expert technical content writer. Provide well-structured markdown. Explain the basic idea of the topic clearly. If the topic is a programming language (like C++, Python, etc.), provide code examples in that specific language, NEVER default to JavaScript unless the topic is JavaScript.";
    const userPrompt = `Write a comprehensive technical article explaining the basic idea of: "${cleanTopic}". Include markdown subheadings and a relevant code example in the appropriate language.`;

    // 1. Try Groq API if key is present
    const groqKey = process.env.GROQ_API_KEY;
    if (groqKey && groqKey.startsWith("gsk_") && groqKey !== "dummy_key") {
      try {
        const groq = new Groq({ apiKey: groqKey });
        const models = ["qwen/qwen3.8-27b", "groq/compound", "openai/gpt-oss-20b", "allam-2-7b"];

        for (const model of models) {
          try {
            const completion = await groq.chat.completions.create({
              model,
              messages: [
                { role: "system", content: systemPrompt },
                { role: "user", content: userPrompt }
              ],
              temperature: 0.7
            });

            const text = completion?.choices?.[0]?.message?.content;
            if (text) {
              console.log(`[AI] Generated content via Groq (${model})`);
              return res.status(200).json({
                title: `The Future of ${cleanTopic}`,
                content: text,
                provider: `Groq (${model})`
              });
            }
          } catch (modelErr) {
            console.warn(`[AI] Groq model ${model} failed:`, modelErr.message);
            // Try next model if one fails
          }
        }
      } catch (groqErr) {
        console.warn("[AI] Groq provider failed:", groqErr.message);
      }
    }

    // 2. Try Google Gemini API if key is present
    const geminiKey = process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY;
    if (geminiKey && geminiKey.length > 10) {
      try {
        const genAI = new GoogleGenerativeAI(geminiKey);
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

        const prompt = `${systemPrompt}\n\n${userPrompt}`;
        const result = await model.generateContent(prompt);
        const response = await result.response;
        const text = response.text();

        if (text) {
          console.log("[AI] Generated content via Google Gemini");
          return res.status(200).json({
            title: `Guide to ${cleanTopic}`,
            content: text,
            provider: "Google Gemini"
          });
        }
      } catch (geminiErr) {
        console.warn("[AI] Gemini provider failed:", geminiErr.message);
      }
    }

    // 3. Try OpenAI API if key is present
    const openaiKey = process.env.OPENAI_API_KEY;
    if (openaiKey && openaiKey.startsWith("sk-")) {
      try {
        const openai = new OpenAI({ apiKey: openaiKey });
        const completion = await openai.chat.completions.create({
          model: "gpt-4o-mini",
          messages: [
            { role: "system", content: systemPrompt },
            { role: "user", content: userPrompt }
          ]
        });

        const text = completion?.choices?.[0]?.message?.content;
        if (text) {
          console.log("[AI] Generated content via OpenAI");
          return res.status(200).json({
            title: `Understanding ${cleanTopic}`,
            content: text,
            provider: "OpenAI"
          });
        }
      } catch (openaiErr) {
        console.warn("[AI] OpenAI provider failed:", openaiErr.message);
      }
    }

    // 4. Fallback Generator (Guarantees zero downtime & zero crash)
    console.log("[AI] Utilizing Topic-Aware Article Generator");
    const article = generateTopicArticle(cleanTopic);
    return res.status(200).json({
      ...article,
      provider: "Built-in Topic Generator (Fallback)"
    });

  } catch (error) {
    console.error("AI Controller Error:", error);
    const article = generateTopicArticle(req.body?.topic || "Technology");
    return res.status(200).json({
      ...article,
      provider: "Built-in Topic Generator (Error Fallback)"
    });
  }
};
