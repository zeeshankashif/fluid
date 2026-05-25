import express from "express";
import path from "path";
import dotenv from "dotenv";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";

dotenv.config();

const app = express();
const PORT = 3000;

// Body parser
app.use(express.json());

// Initialize GoogleGenAI client lazily to avoid startup crashes if key is missing
let aiClient: GoogleGenAI | null = null;
function getAiClient() {
  if (!aiClient) {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      console.warn("⚠️ GEMINI_API_KEY is not defined. AI features will fallback to simulation mode.");
      return null;
    }
    aiClient = new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          "User-Agent": "aistudio-build",
        }
      }
    });
  }
  return aiClient;
}

// REST API for Zexan Cognitive Oracle
app.post("/api/oracle", async (req, res) => {
  try {
    const { prompt, currentTheme, speed, complexity } = req.body;
    
    const client = getAiClient();
    if (!client) {
      // High-fidelity local simulation fallback if key is missing
      setTimeout(() => {
        const fallbackAnswers = [
          `💡 [Simulation Engine Active] Synaptic networks are operating at nominal capacity. Recalibrating flux harmonics inside the "${currentTheme || 'prime'}" stream at rate ${speed || '1.0'}x. Current cognitive density: ${complexity || '0.5'}.`,
          `✨ [Simulated Oracle] Realigned neural pathways. Recommended system correction: upgrade quantum core bandwidth to prevent latency variance.`,
          `🌌 [Temporal Prediction] Holographic diagnostics indicate zero-vulnerability across aether interfaces. Synapses are successfully routing complex mesh protocols.`,
          `💡 [Holographic Core] System parameters approved. ZEXAN suggests adjusting simulation complexity to stimulate higher synaptic refraction lines.`
        ];
        const randomAnswer = fallbackAnswers[Math.floor(Math.random() * fallbackAnswers.length)];
        return res.json({ text: randomAnswer, isSimulation: true });
      }, 1000);
      return;
    }

    const systemPrompt = `You are the ZEXAN Intellectual Cognitive Engine, a premium, dark-themed cybernetic cosmic intelligence powering an ultra-luxury landing page. 
    The user is querying you through the Zexan Bento Grid terminal. 
    Current state values of the landing page:
    - active-theme: ${currentTheme || 'prime'}
    - simulation-speed: ${speed || '1.0'}x
    - synaptic-complexity: ${complexity || '0.5'}
    
    Structure your answer in a poetic, cyber-monastic, highly technical tone. 
    Acknowledge the current system state creatively if the user prompt mentions diagnostics or parameters.
    Format your response with small bullet points or tiny sections when appropriate. Keep it concise, high-end (max 120 words), and extremely polished. Do not use generic chatbot intro/outro text.`;

    const response = await client.models.generateContent({
      model: "gemini-3.5-flash",
      contents: prompt || "Synthesize system status",
      config: {
        systemInstruction: systemPrompt,
        temperature: 0.85,
      },
    });

    const resultText = response.text || "No cognitive signal detected. Re-evaluating mesh connectivity.";
    res.json({ text: resultText, isSimulation: false });
  } catch (error: any) {
    console.error("API error in oracle route:", error);
    res.status(500).json({ 
      error: "Cognitive feedback loop failed.", 
      details: error.message,
      text: "❌ Error: Cognitive connection loop degraded. System reverting to localized secondary matrix." 
    });
  }
});

// Launch custom server with Vite middleware support
async function startup() {
  if (process.env.NODE_ENV !== "production") {
    // Vite middleware for real-time asset compiling and frontend pipeline in develop mode
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    // Production serving static files compiled in dist/
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`🚀 Zexan full-stack server running on http://0.0.0.0:${PORT}`);
  });
}

startup();
