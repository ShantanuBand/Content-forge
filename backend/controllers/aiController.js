import dotenv from "dotenv";
dotenv.config();

import Groq from "groq-sdk";
import { GoogleGenerativeAI } from "@google/generative-ai";
import OpenAI from "openai";

// Dynamic topic-aware article generator fallback
function generateTopicArticle(topic) {
  const cleanTopic = topic.trim();
  const title = `Mastering ${cleanTopic}: A Comprehensive Guide`;

  const content = `## Overview of ${cleanTopic}

**${cleanTopic}** is a powerful concept in modern software development and technology. Building applications with **${cleanTopic}** enables developers to create scalable, robust, and efficient solutions.

### Key Highlights & Features

- 🚀 **High Efficiency**: Optimized workflows and modern architecture.
- 🔒 **Security & Integrity**: Best practices built-in for safe deployment.
- ⚡ **Scalability**: Designed to handle growing workloads effortlessly.
- 🛠️ **Developer Friendly**: Clean abstractions and intuitive API design.

### Code Demonstration

Here is a practical code example illustrating **${cleanTopic}** in action:

\`\`\`javascript
// Practical Example: ${cleanTopic} Integration
class ${cleanTopic.replace(/[^a-zA-Z0-9]/g, "") || "Content"}Service {
  constructor(options = {}) {
    this.name = "${cleanTopic}";
    this.status = "ready";
  }

  async processRequest(payload) {
    console.log(\`[${cleanTopic}] Processing request:\`, payload);
    return {
      success: true,
      data: payload,
      timestamp: new Date().toISOString()
    };
  }
}

// Usage
const service = new ${cleanTopic.replace(/[^a-zA-Z0-9]/g, "") || "Content"}Service();
service.processRequest({ topic: "${cleanTopic}" }).then(res => console.log(res));
\`\`\`

### Architectural Best Practices

1. **Modular Architecture**: Keep logic decoupled for easier maintenance and testing.
2. **Error Resilience**: Implement fallback mechanisms and clear error handling.
3. **Continuous Monitoring**: Track key performance metrics in production.

### Conclusion

Integrating **${cleanTopic}** into your workflow helps unlock greater productivity and code quality. Start small, build prototypes, and iterate!`;

  return { title, content };
}

export const generateAIContent = async (req, res) => {
  try {
    const { topic } = req.body;

    if (!topic || !topic.trim()) {
      return res.status(400).json({ message: "Topic is required" });
    }

    const cleanTopic = topic.trim();

    // 1. Try Groq API if key is present
    const groqKey = process.env.GROQ_API_KEY;
    if (groqKey && groqKey.startsWith("gsk_") && groqKey !== "dummy_key") {
      try {
        const groq = new Groq({ apiKey: groqKey });
        const models = ["llama-3.3-70b-versatile", "llama-3.1-8b-instant", "mixtral-8x7b-32768"];

        for (const model of models) {
          try {
            const completion = await groq.chat.completions.create({
              model,
              messages: [
                { role: "system", content: "You are an expert technical content writer. Provide well-structured markdown with code blocks." },
                { role: "user", content: `Write a comprehensive technical article with markdown subheadings and a code example about: "${cleanTopic}".` }
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

        const prompt = `Write a comprehensive, beginner-friendly technical markdown article with subheadings and a code snippet about "${cleanTopic}".`;
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
            { role: "system", content: "You are a professional content creator." },
            { role: "user", content: `Write an informative markdown article with code snippets about "${cleanTopic}".` }
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
