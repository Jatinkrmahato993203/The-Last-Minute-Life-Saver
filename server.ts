import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import rateLimit from "express-rate-limit";
import "dotenv/config";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10, // Limit each IP to 10 requests per window
  message: { error: "Too many requests, please try again later." }
});

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // AI Route: Generate Recovery Plan
  app.post("/api/generate-plan", limiter, async (req, res) => {
    try {
      const { commitment, addedHours, deficit, currentRisk } = req.body;
      
      const prompt = `You are Oracle, a direct, calm productivity assistant.
The user is at risk of missing a commitment.
Commitment details:
- Title: ${commitment.title}
- Category: ${commitment.category}
- Current Risk: ${currentRisk}%
- Deficit: ${deficit} hours
- They are committing to an extra: ${addedHours} hours/day.

Write a very brief (2-3 sentences max) plain-language recovery plan. Give 1 or 2 concrete actionable steps they can take today based on their added hours. Do NOT use fake calendar events like "Coffee with Rahul". Be extremely brief, realistic, and use a calm tone. Do not use asterisks or markdown.`;

      const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: prompt,
      });

      res.json({ plan: response.text });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Failed to generate plan" });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
