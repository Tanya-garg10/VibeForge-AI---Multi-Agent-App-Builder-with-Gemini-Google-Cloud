import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, Type } from "@google/genai";
import dotenv from "dotenv";
import fs from "fs";

dotenv.config();

const app = express();
const PORT = 3000;

// Set up body parsing with increased limit for base64 image data
app.use(express.json({ limit: "20mb" }));
app.use(express.urlencoded({ limit: "20mb", extended: true }));

// Lazily initialize/verify Gemini API
const getGeminiClient = () => {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error("GEMINI_API_KEY is not defined in the environment secrets.");
  }
  return new GoogleGenAI({
    apiKey: apiKey,
    httpOptions: {
      headers: {
        "User-Agent": "aistudio-build",
      },
    },
  });
};

// Robust prompt generator for VibeForge Agents
function buildSystemInstruction(userPrompt: string): string {
  return `
You are the lead architect and engine of VibeForge AI, a state-of-the-art hackathon multi-agent app builder.
Your task is to take a user prompt (and an optional visual mockup, layout sketch, or reference screenshot), break it down, simulate a workflow with 6 distinct agents (Requirement Agent, UI Agent, Backend Agent, Database Agent, Testing Agent, Deployment Agent), and produce beautiful, production-ready, highly specific full-stack code and configurations.

CRITICAL DISCIPLINE FOR RESPONSE LENGTH:
- Write clean, highly concise, and optimized code files to ensure the entire JSON response remains within the model's strict output token limits window and NEVER gets cut off or truncated!
- Avoid massive, repetitive mock data objects, redundant comments, or duplicate helper functions.
- For all generated strings in the response, prefer code containing high-density, smart logic. Use concise inline comments where essential.
- Ensure that every field is valid, complete, and contains well-formed, legal syntax, ending properly.
- Avoid placeholder text like "// Implement later". Instead, write short, fully functional code blocks.

CRITICAL JSON ESCAPE AND VALIDITY RULES:
- Because the generated code ('uiCode', 'backendCode', etc.) is returned inside a JSON string property, any unescaped double quote (") inside your code will break the JSON parser instantly!
- To prevent this, you MUST use single quotes (') for all JSX properties (use className='...' and NOT className="...") and for all Javascript/TypeScript string literals in both frontend and backend code blocks.
- Minimize the use of double quotes entirely inside your generated code strings, or strictly escape them as \\" if absolutely unavoidable.
- Ensure all control characters, backslashes, and quotes are strictly valid and compliant with the JSON standard. Do not include raw actual newlines inside quotes unless they are escaped as \\n.

All the code should be complete, working, and tailored to the requested application: "${userPrompt}".

Ensure the output is strictly structured as specified in the JSON response schema.
`;
}

// Function to clean markdown blocks and robustly rescue/parse JSON with raw multi-line strings or control characters
function cleanAndParseJson(raw: string): any {
  let cleaned = raw.trim();
  
  // Remove markdown code fences if outputted by fallback models
  if (cleaned.startsWith("```json")) {
    cleaned = cleaned.substring(7);
  } else if (cleaned.startsWith("```")) {
    cleaned = cleaned.substring(3);
  }
  if (cleaned.endsWith("```")) {
    cleaned = cleaned.substring(0, cleaned.length - 3);
  }
  cleaned = cleaned.trim();

  // Escape raw/unescaped control characters inside JSON strings (e.g., unescaped literal raw newlines, raw tabs)
  let escapedJson = "";
  let inString = false;
  let escape = false;

  for (let i = 0; i < cleaned.length; i++) {
    const char = cleaned[i];

    if (escape) {
      escapedJson += char;
      escape = false;
      continue;
    }

    if (char === "\\") {
      escapedJson += char;
      escape = true;
      continue;
    }

    if (char === '"') {
      inString = !inString;
      escapedJson += char;
      continue;
    }

    if (inString) {
      if (char === "\n") {
        escapedJson += "\\n";
      } else if (char === "\r") {
        escapedJson += "\\r";
      } else if (char === "\t") {
        escapedJson += "\\t";
      } else {
        escapedJson += char;
      }
    } else {
      escapedJson += char;
    }
  }

  return JSON.parse(escapedJson);
}

// Multi-agent applet generation API endpoint
async function generateWithRetry(ai: any, contentsParts: any[], prompt: string, responseSchema: any) {
  // Use stable, highly-available and fallback models for bulletproof availability
  const modelsToTry = ["gemini-3.5-flash", "gemini-2.5-flash", "gemini-2.0-flash", "gemini-1.5-flash"];
  let lastError = null;

  for (const modelName of modelsToTry) {
    let attempts = 3;
    for (let attempt = 1; attempt <= attempts; attempt++) {
      try {
        console.log(`[VibeForge API] Attempting generation with model "${modelName}" (Attempt ${attempt}/${attempts})`);
        const response = await ai.models.generateContent({
          model: modelName,
          contents: { parts: contentsParts },
          config: {
            systemInstruction: buildSystemInstruction(prompt),
            responseMimeType: "application/json",
            responseSchema: responseSchema,
            temperature: 0.2, // Keep deterministic/stable for quality applet generation
            maxOutputTokens: 8192,
          },
        });
        
        if (response && response.text) {
          // Double check that it is parseable before returning
          try {
            const parsed = cleanAndParseJson(response.text);
            console.log(`[VibeForge API] Generation & Parse successful with model "${modelName}"`);
            return { text: response.text, parsed };
          } catch (pe) {
            console.warn(`[VibeForge API Warning] Content was generated with ${modelName} but parsing failed:`, pe);
            throw pe; // trigger attempt-retry or model fallback
          }
        }
        throw new Error("Empty response received from the Gemini API");
      } catch (err: any) {
        lastError = err;
        const errMsg = err.message || JSON.stringify(err);
        console.warn(`[VibeForge API Warning] Attempt ${attempt} failed with model ${modelName}: ${errMsg.slice(0, 300)}`);
        
        // If it's a structural schema error or model unavailable error, retry or move to fallbacks
        if (errMsg.includes("400") || errMsg.includes("INVALID_ARGUMENT")) {
          break; // move to next model if schema or setup was rejected
        }
        
        // Backoff slightly before retrying the same model
        if (attempt < attempts) {
          const delay = Math.pow(2, attempt) * 1000;
          await new Promise((resolve) => setTimeout(resolve, delay));
        }
      }
    }
  }

  throw lastError || new Error("Failed after trying multiple models and retries");
}

app.post("/api/generate", async (req, res) => {
  try {
    const { prompt, screenshot, screenshotMime } = req.body;
    
    if (!prompt || typeof prompt !== "string") {
      return res.status(400).json({ error: "The application description is required." });
    }

    console.log(`[VibeForge Backend] Generating application for: "${prompt.slice(0, 50)}..."`);

    const ai = getGeminiClient();
    
    // Setup modern response schema
    const responseSchema = {
      type: Type.OBJECT,
      properties: {
        appName: { 
          type: Type.STRING, 
          description: "A professional, distinct, catchy name for the user's generated app" 
        },
        requirements: {
          type: Type.OBJECT,
          properties: {
            features: { type: Type.ARRAY, items: { type: Type.STRING }, description: "Key features of the application" },
            pages: { type: Type.ARRAY, items: { type: Type.STRING }, description: "Webpages / routes generated" },
            components: { type: Type.ARRAY, items: { type: Type.STRING }, description: "Main React layout component names" },
            apis: { type: Type.ARRAY, items: { type: Type.STRING }, description: "Backend REST endpoints simulated or written" },
            database: { type: Type.ARRAY, items: { type: Type.STRING }, description: "Firestore collections created" }
          },
          required: ["features", "pages", "components", "apis", "database"]
        },
        uiCode: { 
          type: Type.STRING, 
          description: "A beautiful, operational, but highly compact single-file React component representing the application's dashboard. Must use Lucide icons & standard Tailwind classes. Keep it under 200 lines by focusing strictly on layout design, avoiding large inline maps or repetitive mock tables." 
        },
        backendCode: { 
          type: Type.STRING, 
          description: "A super compact Express.js server router block showing 2-3 essential endpoint routes. Keep it under 35 lines of total code." 
        },
        dbSchema: { 
          type: Type.STRING, 
          description: "A super concise outline of the collections in JSON array format. Keep it under 10 lines." 
        },
        tests: { 
          type: Type.STRING, 
          description: "A very brief sample test block defining 1-2 tests. Keep it under 12 lines of code." 
        },
        deployment: { 
          type: Type.STRING, 
          description: "A streamlined Dockerfile or quick deploy instruction. Keep it under 8 lines of text." 
        },
        mockDataSchema: {
          type: Type.OBJECT,
          description: "Live interactive database configuration. Used to feed the frontend Live Preview sandbox so it is fully functional and interactive.",
          properties: {
            primaryEntitySingular: { type: Type.STRING, description: "Singular name of the primary model (e.g. 'Patient', 'Task', 'Device')" },
            primaryEntityPlural: { type: Type.STRING, description: "Plural name of the primary model (e.g. 'Patients', 'Tasks', 'Devices')" },
            headers: { 
              type: Type.ARRAY, 
              items: { type: Type.STRING }, 
              description: "JSON columns to display in preview table. Must be exactly ['id', 'title', 'status', 'category', 'meta']" 
            },
            items: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  id: { type: Type.STRING, description: "Unique identifier for this mock item, e.g. '101'" },
                  title: { type: Type.STRING, description: "Display name or title of the item, e.g. 'John Doe', 'Task #1'" },
                  status: { type: Type.STRING, description: "Status value, e.g. 'Completed', 'Admitted', 'In Stock'" },
                  category: { type: Type.STRING, description: "Category or classification, e.g. 'Orthopedics', 'High Priority', 'Beverages'" },
                  meta: { type: Type.STRING, description: "Extra context information, e.g. 'Room 304', 'Due tomorrow'" }
                },
                required: ["id", "title", "status", "category", "meta"]
              },
              description: "Realistic mock database records matching the headers array. Provide exactly 3 or 4 records."
            },
            metrics: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  label: { type: Type.STRING, description: "Metric card title, e.g. 'Total Patients' or 'Pending Approvals'" },
                  value: { type: Type.STRING, description: "Metric current value, e.g. '1,240' or '84%'" },
                  change: { type: Type.STRING, description: "Percentage or net change trend text, e.g. '+12.4% this week' or '-3 tasks'" },
                  isPositive: { type: Type.BOOLEAN, description: "True if the change trend is positive/good, false otherwise" }
                },
                required: ["label", "value", "change", "isPositive"]
              },
              description: "Array of exactly 4 critical metrics for top level statistics preview deck"
            }
          },
          required: ["primaryEntitySingular", "primaryEntityPlural", "headers", "items", "metrics"]
        }
      },
      required: ["appName", "requirements", "uiCode", "backendCode", "dbSchema", "tests", "deployment", "mockDataSchema"]
    };

    // Construct the contents payload for Gemini API
    const contentsParts: any[] = [];
    
    if (screenshot && screenshot.startsWith("data:image/")) {
      // Parse base64 and standard IANA types
      const mime = screenshotMime || "image/png";
      const base64Data = screenshot.split(",")[1];
      contentsParts.push({
        inlineData: {
          mimeType: mime,
          data: base64Data,
        }
      });
    }

    contentsParts.push({
      text: `Analyze and simulate the development workflow for the following requested app/idea:
"${prompt}"

If a sketch or screenshot is provided above, incorporate its interface design patterns, wireframe structure, forms, tables, and colors as the blueprint.
Generate high-fidelity, extremely concise, clean, and complete outputs that match a production build. Avoid verbose comments, redundant mock records, or boilerplate to ensure the response fits the output window cleanly.`
    });

    // Invoke Gemini Content generation with structured JSON Schema feedback
    const response = await generateWithRetry(ai, contentsParts, prompt, responseSchema);

    const appletData = response.parsed || {};

    return res.json(appletData);

  } catch (error: any) {
    console.error("[VibeForge API Error]:", error);
    return res.status(500).json({ 
      error: error.message || "An error occurred while generating the application specifications." 
    });
  }
});

// Configure Vite or Static Asset routers
async function startServer() {
  const distPath = path.join(process.cwd(), "dist");
  const useProd = process.env.NODE_ENV === "production" && fs.existsSync(path.join(distPath, "index.html"));

  if (!useProd) {
    console.log("[VibeForge Server] Starting server in DEVELOPMENT mode (Vite Middleware fallback)");
    // Development server leveraging Vite Node.JS runtime middleware
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);

    // Serve index.html fallback for development mode, transformed by Vite
    app.get("*", async (req, res, next) => {
      const url = req.originalUrl;
      try {
        let template = fs.readFileSync(path.resolve(process.cwd(), "index.html"), "utf-8");
        template = await vite.transformIndexHtml(url, template);
        res.status(200).set({ "Content-Type": "text/html" }).end(template);
      } catch (e) {
        vite.ssrFixStacktrace(e as Error);
        next(e);
      }
    });
  } else {
    console.log("[VibeForge Server] Starting server in PRODUCTION mode (Static distribution serving)");
    // Dist production build serving static files
    app.use(express.static(distPath));
    // Serve index.html fallback for client-side routing
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`[VibeForge Server] Running on http://localhost:${PORT} in ${process.env.NODE_ENV || "development"} mode`);
  });
}

startServer();
