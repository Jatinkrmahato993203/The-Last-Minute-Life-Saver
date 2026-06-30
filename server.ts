import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, Type } from "@google/genai";
import rateLimit from "express-rate-limit";
import "dotenv/config";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 50, // Limit each IP to 50 requests per window
  message: { error: "Too many requests, please try again later." }
});

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
    if (err instanceof SyntaxError && 'body' in err) {
      return res.status(400).json({ error: "Invalid JSON payload" });
    }
    next();
  });

  const requireAuth = async (req: express.Request, res: express.Response, next: express.NextFunction) => {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ error: "Unauthorized" });
    }
    const token = authHeader.split(" ")[1];
    
    try {
      const response = await fetch(`https://oauth2.googleapis.com/tokeninfo?access_token=${token}`);
      if (!response.ok) {
        return res.status(401).json({ error: "Invalid token" });
      }
      
      const data = await response.json();
      
      if (!process.env.GOOGLE_CLIENT_ID) {
        console.warn("WARNING: GOOGLE_CLIENT_ID is not set in environment variables. Token audience verification is skipped. This is a security risk in production.");
      } else if (data.aud !== process.env.GOOGLE_CLIENT_ID) {
        return res.status(401).json({ error: "Invalid token audience" });
      }

      next();
    } catch (e) {
      return res.status(401).json({ error: "Token verification failed" });
    }
  };

  // AI Route: Generate Recovery Plan
  app.post("/api/generate-plan", requireAuth, limiter, async (req, res) => {
    try {
      const { commitment, addedHours, deficit, currentRisk } = req.body;
      
      if (!commitment || typeof commitment.title !== "string" || commitment.title.length > 100 || typeof commitment.category !== "string") {
        return res.status(400).json({ error: "Invalid commitment details" });
      }
      
      if (typeof addedHours !== "number" || typeof deficit !== "number" || typeof currentRisk !== "number") {
        return res.status(400).json({ error: "Invalid metrics" });
      }
      
      const prompt = `You are Oracle, a direct, calm productivity assistant.
The user is at risk of missing a commitment.
Commitment details:
- Title: ${commitment.title}
- Category: ${commitment.category}
- Current Risk: ${currentRisk}%
- Deficit: ${deficit} hours
- They are committing to an extra: ${addedHours} hours/day.

Please review the user's upcoming calendar events using the get_upcoming_events tool.
Based on their schedule, reason about which existing commitments to protect, and propose a specific time block (create_event) to work on "${commitment.title}".
Return a short recovery plan explaining your reasoning, and if possible, use the propose_event tool to suggest adding a calendar event. Be extremely brief, realistic, and use a calm tone.`;

      const tools = [{
        functionDeclarations: [
          {
            name: "get_upcoming_events",
            description: "Get the user's upcoming calendar events for the next few days to check for conflicts.",
            parameters: {
              type: Type.OBJECT,
              properties: {
                days: {
                  type: Type.INTEGER,
                  description: "Number of days ahead to check (e.g. 3)"
                }
              },
              required: ["days"]
            }
          },
          {
            name: "propose_event",
            description: "Propose a new calendar event for the user to confirm.",
            parameters: {
              type: Type.OBJECT,
              properties: {
                title: { type: Type.STRING },
                startTime: { type: Type.STRING, description: "ISO string" },
                endTime: { type: Type.STRING, description: "ISO string" }
              },
              required: ["title", "startTime", "endTime"]
            }
          }
        ]
      }];

      const chat = ai.chats.create({
        model: "gemini-2.5-flash",
        config: { tools }
      });

      let response = await chat.sendMessage({ message: prompt });
      let proposedEvent = null;

      // Handle function calls in a loop
      while (response.functionCalls && response.functionCalls.length > 0) {
        const functionResponses = [];
        
        for (const call of response.functionCalls) {
          if (call.name === "get_upcoming_events") {
            const days = Number(call.args.days) || 3;
            const timeMin = new Date().toISOString();
            const timeMax = new Date(Date.now() + days * 24 * 60 * 60 * 1000).toISOString();
            
            let eventsText = "No events found.";
            try {
              const authHeader = req.headers.authorization;
              const token = authHeader?.split(" ")[1];
              const calRes = await fetch(`https://www.googleapis.com/calendar/v3/calendars/primary/events?timeMin=${timeMin}&timeMax=${timeMax}&singleEvents=true&orderBy=startTime`, {
                headers: { Authorization: `Bearer ${token}` }
              });
              if (calRes.ok) {
                const calData = await calRes.json();
                const events = (calData.items || []).map((e: any) => `- ${e.summary} from ${e.start?.dateTime} to ${e.end?.dateTime}`);
                if (events.length > 0) eventsText = events.join("\\n");
              }
            } catch (e) {
              eventsText = "Error fetching calendar.";
            }

            functionResponses.push({
              functionResponse: {
                name: "get_upcoming_events",
                response: { events: eventsText }
              }
            });
          } else if (call.name === "propose_event") {
            proposedEvent = call.args;
            functionResponses.push({
              functionResponse: {
                name: "propose_event",
                response: { status: "proposed to user" }
              }
            });
          }
        }
        
        if (functionResponses.length > 0) {
          response = await chat.sendMessage({ message: functionResponses });
        } else {
          break;
        }
      }

      res.json({ plan: response.text, proposedEvent });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Failed to generate plan" });
    }
  });

  app.post("/api/create-event", requireAuth, async (req, res) => {
    try {
      const { title, startTime, endTime } = req.body;
      const authHeader = req.headers.authorization;
      const token = authHeader?.split(" ")[1];

      const calRes = await fetch(`https://www.googleapis.com/calendar/v3/calendars/primary/events`, {
        method: "POST",
        headers: { 
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          summary: title,
          start: { dateTime: startTime },
          end: { dateTime: endTime }
        })
      });

      if (!calRes.ok) {
        return res.status(400).json({ error: "Failed to create event" });
      }

      res.json({ success: true });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Failed to create event" });
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
