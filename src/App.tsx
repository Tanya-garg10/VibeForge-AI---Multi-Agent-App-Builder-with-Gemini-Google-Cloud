import React, { useState, useEffect } from "react";
import {
  Activity,
  ArrowRight,
  ClipboardList,
  Sparkles,
  Play,
  Terminal,
  Code,
  Layers,
  Database,
  Image as ImageIcon,
  Cpu,
  RefreshCw,
  Heart,
  History,
  FileCode,
  Compass,
  FileMinus,
  Sun,
  Moon,
  Wand2,
  Globe,
  ExternalLink,
  Copy,
  Check
} from "lucide-react";
import ExamplePrompts from "./components/ExamplePrompts";
import AgentStatusTracker from "./components/AgentStatusTracker";
import CodeSection from "./components/CodeSection";
import InteractiveSandbox from "./components/InteractiveSandbox";
import { GeneratedApp } from "./types";

// Pre-seeded high quality initial MVP on mount to avoid blank state or tech-larping placeholders
const INITIAL_MVP: GeneratedApp = {
  appName: "CarePulse Clinic",
  requirements: {
    features: [
      "Patient triage logging with custom priority flags",
      "Dynamic clinic resource tracking and key ward room availability",
      "Interactive appointment scheduler with doctors assignments",
      "Real-time operational dashboard for administrators"
    ],
    pages: ["/dashboard (Primary Workspace)", "/patients (Triage Grid)", "/appointments (Logs)"],
    components: ["HeaderStatsDeck", "PatientTriageTable", "BookAppointmentForm", "DoctorRotaDrawer"],
    apis: [
      "POST /api/auth/login - Secure check-in",
      "GET /api/patients - Read current active queue",
      "POST /api/patients - Register immediate triage triage",
      "DELETE /api/patients/:id - Discharge patient"
    ],
    database: ["patients (Logs primary queue data)", "doctors (Main clinic specialist shifts)", "appointments (Calendared rosters)"]
  },
  uiCode: `import React, { useState } from 'react';
import { Activity, Users, Calendar, ShieldAlert } from 'lucide-react';

export default function ClinicDashboard() {
  const [patients, setPatients] = useState([
    { id: 1, name: "Aarav Sharma", age: 34, severity: "High", room: "Ward A", arrival: "10 mins ago" },
    { id: 2, name: "Sneha Patel", age: 29, severity: "Medium", room: "Room 102", arrival: "25 mins ago" }
  ]);

  return (
    <div className="flex h-screen bg-stone-50 text-stone-900 font-sans">
      <aside className="w-64 bg-stone-900 text-stone-200 p-6 flex flex-col justify-between">
        <div>
          <h2 className="text-xl font-bold tracking-tight text-white flex items-center gap-2">
            <Activity className="text-emerald-400" /> CarePulse
          </h2>
          <nav className="mt-8 space-y-3">
            <a href="#" className="flex items-center gap-2 p-2 bg-stone-800 rounded font-medium">Overview</a>
            <a href="#" className="flex items-center gap-2 p-2 text-stone-400 hover:text-white">Patients Queue</a>
            <a href="#" className="flex items-center gap-2 p-2 text-stone-400 hover:text-white">Staff Roster</a>
          </nav>
        </div>
        <div className="text-xs text-stone-500">VibeForge Generated App</div>
      </aside>
      <main className="flex-1 p-8 overflow-y-auto">
        <header className="flex justify-between items-center mb-8">
          <h1 className="text-2xl font-bold">Clinical Workspace</h1>
          <span className="bg-emerald-50 text-emerald-700 px-3 py-1 text-xs font-semibold rounded-full">Zone 1 Live</span>
        </header>
        <div className="grid grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-xl border border-stone-200">
            <p className="text-xs font-medium text-stone-500">Active Admitted</p>
            <p className="text-2xl font-bold mt-2">124 Patients</p>
          </div>
          <div className="bg-white p-6 rounded-xl border border-stone-200">
            <p className="text-xs font-medium text-stone-500">Available Cubicles</p>
            <p className="text-2xl font-bold mt-2">18/25 Rooms</p>
          </div>
          <div className="bg-white p-6 rounded-xl border border-stone-200">
            <p className="text-xs font-medium text-stone-500">On-Duty Doctors</p>
            <p className="text-2xl font-bold mt-2">8 Specialists</p>
          </div>
        </div>
      </main>
    </div>
  );
}`,
  backendCode: `// Standalone CarePulse Clinic Backend API Service
const express = require('express');
const cors = require('cors');
const jwt = require('jsonwebtoken');

const app = express();
app.use(cors());
app.use(express.json());

const JWT_SECRET = process.env.JWT_SECRET || "vibeforge-super-key";

// Simple middleware to authenticate incoming clinic personnel
function authorizeClinicStaff(req, res, next) {
  const token = req.headers['authorization']?.split(' ')[1];
  if (!token) return res.status(401).json({ error: "Access Denied. Unauthorized crew." });
  try {
    const verified = jwt.verify(token, JWT_SECRET);
    req.staff = verified;
    next();
  } catch (err) {
    res.status(400).json({ error: "Invalid staffing token" });
  }
}

// REST CRUD APIS
app.get('/api/patients', (req, res) => {
  res.json({
    success: true,
    data: [
      { id: 101, name: "Rajesh Kumar", symptom: "High Fever", Priority: "Medium" },
      { id: 102, name: "Priya Das", symptom: "Fractured wrist", Priority: "Low" }
    ]
  });
});

app.post('/api/patients', authorizeClinicStaff, (req, res) => {
  const { name, symptom, Priority } = req.body;
  if (!name || !symptom) {
    return res.status(400).json({ error: "Patient name & clinical symptoms are mandatory information" });
  }
  const newPatient = { id: Date.now(), name, symptom, Priority: Priority || "Low" };
  res.status(201).json({ success: true, message: "Logged into triage successfully", item: newPatient });
});`,
  dbSchema: `// Google Cloud Firestore Collection Schemas

// Collection: Patients
// Represents emergency triage registrations
{
  "id": "String (Auto Generated Document ID)",
  "name": "String (First & Last name)",
  "age": "Number (Patient biological age)",
  "severity": "String (Emergency indicator: 'High' | 'Medium' | 'Low')",
  "assignedRoom": "String (Care cubicle code or ward section)",
  "createdAt": "Timestamp (Time of clinic check-in)"
}

// Collection: StaffRoster
// Shifts schedule for assigned doctors
{
  "doctorName": "String",
  "specialty": "String (Pediatrics, Cardiology, ER, Ortho)",
  "shiftStart": "Timestamp",
  "isAvailable": "Boolean"
}`,
  tests: `// Jest integration tests for CarePulse Clinic Controller APIs
const request = require('supertest');
const { app } = require('./server');

describe("Emergency Ward Triage APIs Suite", () => {
  it("GET /api/patients -> should supply an array of patients logged in current shift", async () => {
    const response = await request(app)
      .get("/api/patients")
      .expect(200);
      
    expect(response.body.success).toBe(true);
    expect(Array.isArray(response.body.data)).toBe(true);
  });

  it("POST /api/patients without authorization should secure block", async () => {
    await request(app)
      .post("/api/patients")
      .send({ name: "Rohan Verma", symptom: "Acute Migraine" })
      .expect(401);
  });
});`,
  deployment: `# Multi-agent lightweight Dockerfile builder
FROM node:20-alpine

WORKDIR /usr/src/app

COPY package*.json ./
RUN npm ci --only=production

COPY . .

EXPOSE 8080
ENV PORT=8080
ENV NODE_ENV=production

CMD ["node", "server.js"]

# --- GOOGLE CLOUD RUN COMMANDS ---
# gcloud builds submit --tag gcr.io/vibeforge/carepulse-clinic
# gcloud run deploy carepulse-clinic --image gcr.io/vibeforge/carepulse-clinic --platform managed --region asia-southeast1 --allow-unauthenticated`,
  mockDataSchema: {
    primaryEntitySingular: "Patient",
    primaryEntityPlural: "Patients",
    headers: ["id", "name", "age", "severity", "assignedRoom"],
    items: [
      { id: 101, name: "Aarav Sharma", age: 34, severity: "High", assignedRoom: "Ward A" },
      { id: 102, name: "Sneha Patel", age: 29, severity: "Medium", assignedRoom: "Room 102" },
      { id: 103, name: "David Miller", age: 52, severity: "Low", assignedRoom: "Waiting Lounge" },
      { id: 104, name: "Anita Kapoor", age: 41, severity: "Medium", assignedRoom: "Room 108" }
    ],
    metrics: [
      { label: "Active Triage Queue", value: "4 Patients", change: "Immediate Action", isPositive: false },
      { label: "Average Wait Time", value: "14 mins", change: "-3 mins this hour", isPositive: true },
      { label: "Available Beds", value: "8 / 15", change: "Healthy Margin", isPositive: true },
      { label: "On-Duty ER Medics", value: "5 Doctors", change: "Full Shift Roster", isPositive: true }
    ]
  }
};

export default function App() {
  const [themeMode, setThemeMode] = useState<"light" | "dark">("light");
  const [promptInput, setPromptInput] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [currentStage, setCurrentStage] = useState(0);
  const [activeTab, setActiveTab] = useState<"live" | "frontend" | "backend" | "db" | "tests" | "deploy">("live");
  const [generatedApp, setGeneratedApp] = useState<GeneratedApp>(INITIAL_MVP);
  const [generationHistory, setGenerationHistory] = useState<GeneratedApp[]>([INITIAL_MVP]);
  const [errorText, setErrorText] = useState<string | null>(null);
  const [copiedProd, setCopiedProd] = useState(false);
  const [copiedDev, setCopiedDev] = useState(false);

  const handleCopy = (url: string, type: "prod" | "dev") => {
    navigator.clipboard.writeText(url);
    if (type === "prod") {
      setCopiedProd(true);
      setTimeout(() => setCopiedProd(false), 2000);
    } else {
      setCopiedDev(true);
      setTimeout(() => setCopiedDev(false), 2000);
    }
    setBuildNotification(`Copied ${type === "prod" ? "Production" : "Development"} URL to your clipboard!`);
    setTimeout(() => setBuildNotification(null), 3000);
  };

  const themeClasses = {
    bg: themeMode === "dark" ? "bg-[#11130F] text-[#E4E6E1]" : "bg-[#F5F5F0] text-[#141414]",
    panel: themeMode === "dark" ? "bg-[#1B1E1A] border-[#2A2E28] shadow-xs" : "bg-white border-stone-200 shadow-xs",
    border: themeMode === "dark" ? "border-[#2A2E28]" : "border-stone-200",
    header: themeMode === "dark" ? "bg-[#171A15] border-[#2A2E28]" : "bg-white border-stone-200",
    textPrimary: themeMode === "dark" ? "text-[#E4E6E1]" : "text-[#141414]",
    textSecondary: themeMode === "dark" ? "text-stone-400" : "text-stone-500",
    title: themeMode === "dark" ? "text-white font-bold" : "text-[#2D2D2D] font-bold",
    input: themeMode === "dark" ? "bg-[#131512] border-[#2A2E28] text-stone-100 placeholder-stone-600 focus:ring-[#5D6356] focus:border-[#5D6356]" : "bg-stone-50 border-stone-200 text-stone-900 placeholder-stone-500/70 focus:ring-[#5A5A40] focus:border-[#5A5A40]",
    buttonSecondary: themeMode === "dark" ? "bg-[#212420] hover:bg-[#2B2F2A] border-[#2A2E28] text-stone-200" : "bg-stone-100 hover:bg-stone-200 border-stone-200 text-stone-700",
    tagBg: themeMode === "dark" ? "bg-[#252923] text-stone-200" : "bg-stone-100 text-stone-700"
  };

  const optimizePrompt = () => {
    if (!promptInput.trim()) {
      setErrorText("Pleaee enter a prompt or Requirement draft first to optimize!");
      return;
    }
    const suffix = " Add live performance analytics, custom priority tag toggles, multi-filter query tabs, and immediate modal triggers with beautiful high contrast trends.";
    if (!promptInput.includes(suffix)) {
      setPromptInput(prev => prev.trim() + suffix);
      setBuildNotification("Prompt requirements successfully refined & enriched!");
    } else {
      setBuildNotification("Prompt is already VibeForge-optimized!");
    }
    setTimeout(() => setBuildNotification(null), 3000);
  };

  // Attachment references (Visual sketches / layout screenshots)
  const [screenshotUrl, setScreenshotUrl] = useState<string | null>(null);
  const [uploadName, setUploadName] = useState<string | null>(null);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setUploadName(file.name);
      const reader = new FileReader();
      reader.onloadend = () => {
        setScreenshotUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const clearAttachment = () => {
    setScreenshotUrl(null);
    setUploadName(null);
  };

  const [buildNotification, setBuildNotification] = useState<string | null>(null);

  const handleDeployClick = () => {
    setBuildNotification("Your synthesized multi-agent software build configuration is ready for Cloud Run natively!");
    setTimeout(() => setBuildNotification(null), 4000);
  };

  // Agent execution timeline simulation runner
  const executeGeneration = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!promptInput.trim()) {
      setErrorText("Kindly specify a concept, layout details, or upload a UI sketch.");
      return;
    }

    setErrorText(null);
    setIsGenerating(true);
    setCurrentStage(0);

    // Timeline tick handler simulating sequential multi-agent compilation
    const totalStages = 6;
    let localStage = 0;

    const pipelineInterval = setInterval(() => {
      localStage += 1;
      if (localStage < totalStages) {
        setCurrentStage(localStage);
      } else {
        clearInterval(pipelineInterval);
      }
    }, 3800); // Give plenty of reading time to check individual logs

    try {
      const response = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          prompt: promptInput,
          screenshot: screenshotUrl || "",
          screenshotMime: screenshotUrl?.substring(5, screenshotUrl.indexOf(";")) || "image/png"
        })
      });

      if (!response.ok) {
        let errorMsg = "Failed to process multi-agent synthesis. Please double-check your API configurations.";
        try {
          const errorJson = await response.json();
          if (errorJson && errorJson.error) {
            errorMsg = `Synthesis Error: ${errorJson.error}`;
          }
        } catch (_) {}
        throw new Error(errorMsg);
      }

      const outcomeData: GeneratedApp = await response.json();
      
      clearInterval(pipelineInterval);
      
      // Let compiler sequence complete with dynamic outputs
      setCurrentStage(6);
      
      setTimeout(() => {
        setGeneratedApp(outcomeData);
        setGenerationHistory(prev => [outcomeData, ...prev]);
        setIsGenerating(false);
        setActiveTab("live"); // Automatically switch to live preview on compile success!
      }, 1000);

    } catch (err: any) {
      clearInterval(pipelineInterval);
      setIsGenerating(false);
      setErrorText(err.message || "An unexpected compile-time error halted the builder pipeline.");
    }
  };

  const selectExampleIdea = (ideaPrompt: string) => {
    setPromptInput(ideaPrompt);
  };

  return (
    <div className={`min-h-screen ${themeClasses.bg} font-sans flex flex-col relative transition-colors duration-300`}>
      {/* Dynamic Build Notification Toast */}
      {buildNotification && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2.5 bg-stone-900 border border-stone-800 text-stone-100 font-bold px-4 py-3 rounded-xl shadow-xl text-xs max-w-sm animate-fadeIn">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse shrink-0"></span>
          <span>{buildNotification}</span>
        </div>
      )}

      {/* Visual Header */}
      <header className={`h-16 flex items-center justify-between px-6 sm:px-8 ${themeClasses.header} sticky top-0 z-40 transition-colors duration-300`}>
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 bg-[#5A5A40] rounded-xl flex items-center justify-center text-white shadow-md shadow-stone-800/10">
            <Cpu className="w-5 h-5 animate-pulse text-stone-100" />
          </div>
          <div>
            <span className={`font-display font-bold text-lg tracking-tight ${themeClasses.title}`}>
              VibeForge <span className="text-[#5A5A40] text-sm font-semibold tracking-wider px-1.5 py-0.5 rounded-md bg-[#5A5A40]/10 border border-[#5A5A40]/15">AI</span>
            </span>
            <p className={`text-[10px] ${themeClasses.textSecondary} font-semibold uppercase tracking-wider -mt-1 hidden sm:block`}>Multi-Agent Developer Engine</p>
          </div>
        </div>

        <div className="flex items-center gap-3.5">
          {/* Light / Dark Mode Toggle button */}
          <button
            onClick={() => setThemeMode(prev => prev === "light" ? "dark" : "light")}
            className={`p-2 rounded-xl border flex items-center justify-center transition cursor-pointer ${themeClasses.buttonSecondary}`}
            title="Switch Workspace Tone Palette"
          >
            {themeMode === "light" ? <Moon className="w-4 h-4 text-[#5A5A40]" /> : <Sun className="w-4 h-4 text-amber-400" />}
          </button>

          <div className={`flex items-center gap-2 px-3 py-1 ${themeMode === "dark" ? "bg-[#252923] text-stone-200 border-[#2A2E28]" : "bg-emerald-50 text-[#5A5A40] border-stone-200"} text-xs font-semibold rounded-full border`}>
            <span className="w-2 h-2 bg-emerald-600 rounded-full animate-ping"></span>
            <span>Live Workspace Ready</span>
          </div>
          <button
            onClick={handleDeployClick}
            className="hidden sm:inline-flex items-center gap-1.5 px-4 py-1.5 bg-[#5A5A40] text-white text-xs font-bold rounded-full hover:bg-[#484833] shadow-md shadow-stone-800/10 transition cursor-pointer"
          >
            Deploy Build
          </button>
        </div>
      </header>

      {/* Primary Grid Layout */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8 grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Left Side: Builder Ingestion Dashboard */}
        <section className="lg:col-span-5 space-y-6">
          
          {/* Main App Blueprint Request Form */}
          <div className={`rounded-2xl p-5 sm:p-6 border ${themeClasses.panel} space-y-4`}>
            <div className="flex justify-between items-center bg-transparent">
              <div>
                <h3 className="text-xs font-bold uppercase tracking-widest text-[#5A5A40] flex items-center gap-1.5">
                  <Layers className="w-3.5 h-3.5" /> Input Requirement
                </h3>
                <p className={`text-[11px] ${themeClasses.textSecondary} mt-0.5`}>Describe your application workflow or mock design</p>
              </div>
              <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md ${themeClasses.tagBg}`}>MVP Scope</span>
            </div>

            <form onSubmit={executeGeneration} className="space-y-4">
              <div className="relative">
                <textarea
                  value={promptInput}
                  onChange={(e) => setPromptInput(e.target.value)}
                  placeholder="e.g. Build an executive hospital task management system with urgent check-ins, medical staff shift charts..."
                  disabled={isGenerating}
                  className={`w-full h-32 p-4 border rounded-xl text-xs sm:text-sm focus:outline-none transition resize-none leading-relaxed ${themeClasses.input} pr-24`}
                />
                <button
                  type="button"
                  onClick={optimizePrompt}
                  disabled={isGenerating}
                  className={`absolute bottom-3 right-3 py-1 px-2 rounded-lg border flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider shadow-xs transition cursor-pointer ${themeClasses.buttonSecondary}`}
                  title="Refine Requirements with AI tokens"
                >
                  <Wand2 className="w-3 h-3 text-[#5A5A40]" />
                  <span>AI Refine</span>
                </button>
              </div>

              {/* Visual Asset Attacher (Screenshot / Sketches) */}
              <div className="flex flex-col sm:flex-row gap-2">
                <div className="flex-1 relative">
                  <label className={`w-full py-2.5 px-3 border rounded-lg text-xs font-semibold uppercase tracking-wider flex items-center justify-center gap-2 cursor-pointer transition ${themeClasses.buttonSecondary} ${isGenerating ? "opacity-50 pointer-events-none" : ""}`}>
                    <ImageIcon className="w-4 h-4 text-[#5A5A40]" />
                    <span>Upload Sketch</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      disabled={isGenerating}
                      className="hidden"
                    />
                  </label>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    if (isGenerating) return;
                    setPromptInput("SaaS Dashboard layout with top metric analytics, left dark collapsible navigational rail, high priority patient tables, status column tags, & add patient interaction popup.");
                    setBuildNotification("Scaffolded prototype mockup wireframe draft.");
                    setTimeout(() => setBuildNotification(null), 3500);
                  }}
                  disabled={isGenerating}
                  className={`py-2.5 px-4 border rounded-lg text-xs font-semibold uppercase tracking-wider flex items-center justify-center gap-1.5 transition ${themeClasses.buttonSecondary}`}
                >
                  <Activity className="w-4 h-4 text-[#5A5A40]" />
                  <span>Interactive Wireframe</span>
                </button>
              </div>

              {/* Attachment feedback */}
              {uploadName && (
                <div className="flex items-center justify-between p-2.5 bg-emerald-50 text-emerald-800 rounded-lg border border-emerald-100 text-[11px] font-medium animate-fadeIn">
                  <div className="flex items-center gap-2 truncate">
                    <img src={screenshotUrl!} alt="triage input" className="w-6 h-6 object-cover rounded border border-emerald-200/50" />
                    <span className="truncate">{uploadName}</span>
                  </div>
                  <button
                    type="button"
                    onClick={clearAttachment}
                    className="text-emerald-900/60 hover:text-emerald-900 font-bold px-1"
                  >
                    Clear ×
                  </button>
                </div>
              )}

              {errorText && (
                <div className="p-3 bg-red-50 border border-red-100 rounded-lg text-xs text-red-600 flex items-start gap-2">
                  <span className="font-bold">Error:</span>
                  <span>{errorText}</span>
                </div>
              )}

              {/* Submit trigger */}
              <button
                type="submit"
                disabled={isGenerating}
                className={`w-full py-3 px-4 rounded-xl font-bold uppercase tracking-wider text-xs flex items-center justify-center gap-2 shadow-lg transition duration-200 cursor-pointer ${
                  isGenerating
                    ? "bg-stone-200 text-stone-500 border border-stone-300 pointer-events-none"
                    : "bg-[#5A5A40] text-white hover:bg-[#484833] focus:ring-2 focus:ring-[#5A5A40]/50"
                }`}
              >
                {isGenerating ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin text-stone-500" />
                    <span>Engaging Agents ({currentStage + 1}/6)...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4" />
                    <span>Synthesise Hackathon MVP</span>
                  </>
                )}
              </button>
            </form>
          </div>

          {/* Quick Example Scaffolder Deck */}
          {!isGenerating && (
            <div className={`rounded-2xl p-6 border ${themeClasses.panel} space-y-2`}>
              <h4 className="text-xs font-bold uppercase tracking-widest text-[#5A5A40] flex items-center gap-1.5 mb-1">
                <Compass className="w-3.5 h-3.5" /> Ready Blueprints
              </h4>
              <p className={`text-[11px] ${themeClasses.textSecondary}`}>Not sure what to build? Select a ready specification blueprint:</p>
              <ExamplePrompts onSelect={selectExampleIdea} disabled={isGenerating} />
            </div>
          )}

          {/* Multi-Agent Console Flow Tracking */}
          {(isGenerating || currentStage > 0) && (
            <div className={`rounded-2xl p-6 border ${themeClasses.panel} space-y-4`}>
              <div className="flex justify-between items-center bg-transparent">
                <h4 className="text-xs font-bold uppercase tracking-widest text-[#5A5A40] flex items-center gap-1.5">
                  <Terminal className="w-3.5 h-3.5" /> Agent Roster Terminal
                </h4>
                {isGenerating && (
                  <span className="text-[10px] px-2 py-0.5 bg-[#5A5A40]/10 text-[#5A5A40] font-bold rounded-full animate-pulse">
                    Synthesizing
                  </span>
                )}
              </div>
              <AgentStatusTracker currentStage={currentStage} isGenerating={isGenerating} themeMode={themeMode} />
            </div>
          )}

          {/* Prompt Engineering Guide */}
          <div className={`p-4 border rounded-xl space-y-2 ${themeMode === "dark" ? "bg-[#181C17] border-[#2A2E28]" : "bg-stone-50 border-stone-200"}`}>
            <h5 className="text-[11px] font-bold uppercase tracking-widest text-[#5A5A40] flex items-center gap-1.5">
              💡 Hackathon Fast-Track Tip
            </h5>
            <p className={`text-xs leading-relaxed ${themeMode === "dark" ? "text-stone-300" : "text-stone-650"}`}>
              Judges value modular agents constructing robust backend schema. Generate your custom Express routers and watch them reflect interactively in the <strong>Live Sandbox Frame</strong>! Ensure your requirements detail any necessary database fields.
            </p>
          </div>

        </section>

        {/* Right Side: Generated Code Portfolio & Sandboxed Live Preview */}
        <section className={`lg:col-span-7 rounded-3xl border flex flex-col overflow-hidden min-h-[620px] ${themeClasses.panel}`}>
          
          {/* Navigation Tab Bars - Natural tones style */}
          <nav className={`flex flex-wrap border-b ${themeClasses.border} ${themeMode === "dark" ? "bg-[#191C18]" : "bg-stone-50"}`}>
            <button
              onClick={() => setActiveTab("live")}
              className={`px-5 py-4 text-xs font-bold uppercase tracking-wider border-b-2 transition-all cursor-pointer ${
                activeTab === "live"
                  ? "border-[#5A5A40] text-[#5A5A40] bg-transparent"
                  : `border-transparent ${themeMode === "dark" ? "text-stone-400 hover:text-stone-200" : "text-stone-400 hover:text-stone-700"}`
              }`}
            >
              Live MVP Sandbox
            </button>
            <button
              onClick={() => setActiveTab("frontend")}
              className={`px-5 py-4 text-xs font-bold uppercase tracking-wider border-b-2 transition-all cursor-pointer ${
                activeTab === "frontend"
                  ? "border-[#5A5A40] text-[#5A5A40] bg-transparent"
                  : `border-transparent ${themeMode === "dark" ? "text-stone-400 hover:text-stone-200" : "text-stone-400 hover:text-stone-700"}`
              }`}
            >
              Frontend React
            </button>
            <button
              onClick={() => setActiveTab("backend")}
              className={`px-5 py-4 text-xs font-bold uppercase tracking-wider border-b-2 transition-all cursor-pointer ${
                activeTab === "backend"
                  ? "border-[#5A5A40] text-[#5A5A40] bg-transparent"
                  : `border-transparent ${themeMode === "dark" ? "text-stone-400 hover:text-stone-200" : "text-stone-400 hover:text-stone-700"}`
              }`}
            >
              Backend API
            </button>
            <button
              onClick={() => setActiveTab("db")}
              className={`px-5 py-4 text-xs font-bold uppercase tracking-wider border-b-2 transition-all cursor-pointer ${
                activeTab === "db"
                  ? "border-[#5A5A40] text-[#5A5A40] bg-transparent"
                  : `border-transparent ${themeMode === "dark" ? "text-stone-400 hover:text-stone-200" : "text-stone-400 hover:text-stone-700"}`
              }`}
            >
              Firestore Schema
            </button>
             <button
              onClick={() => setActiveTab("tests")}
              className={`px-5 py-4 text-xs font-bold uppercase tracking-wider border-b-2 transition-all cursor-pointer ${
                activeTab === "tests"
                  ? "border-[#5A5A40] text-[#5A5A40] bg-transparent"
                  : `border-transparent ${themeMode === "dark" ? "text-stone-400 hover:text-stone-200" : "text-stone-400 hover:text-stone-700"}`
              }`}
            >
              QA Tests
            </button>
            <button
               onClick={() => setActiveTab("deploy")}
               className={`px-5 py-4 text-xs font-bold uppercase tracking-wider border-b-2 transition-all cursor-pointer ${
                 activeTab === "deploy"
                   ? "border-[#5A5A40] text-[#5A5A40] bg-transparent"
                   : `border-transparent ${themeMode === "dark" ? "text-stone-400 hover:text-stone-200" : "text-stone-400 hover:text-stone-700"}`
               }`}
             >
               Cloud Run
             </button>
           </nav>
 
           {/* Active Tab Frame Container */}
           <div className={`flex-1 p-6 overflow-hidden flex flex-col justify-between ${themeMode === "dark" ? "bg-[#1E221C]" : "bg-white"}`}>
             {isGenerating && activeTab !== "live" ? (
               <div className="py-24 text-center text-stone-400 space-y-4">
                 <RefreshCw className="w-12 h-12 text-[#5A5A40] animate-spin mx-auto opacity-75" />
                 <p className="text-sm font-semibold">Regenerating and recompiling package codebase...</p>
                 <p className="text-xs text-stone-500">Wait for your multi-agent architecture process to finish.</p>
               </div>
             ) : (
               <div className="space-y-6">
                 
                 {/* 1. Live Interactive Sandbox Frame */}
                 {activeTab === "live" && (
                   <div className="space-y-4 animate-fadeIn">
                     <div className="flex items-center justify-between text-xs">
                       <span className="font-semibold text-stone-400 select-none">ARCHITECTURE SUMMARY</span>
                       <span className={`font-mono ${themeMode === "dark" ? "text-stone-300" : "text-stone-500"}`}>App: {generatedApp.appName}</span>
                     </div>
 
                     {/* Brief Agent Requirement Readout */}
                     <div className={`p-4 border rounded-xl grid grid-cols-1 md:grid-cols-2 gap-4 ${themeMode === "dark" ? "bg-[#141613] border-[#2A2E28]" : "bg-stone-50 border-stone-200/60"}`}>
                       <div>
                         <h5 className="text-[10px] font-bold uppercase text-[#5A5A40] tracking-wider mb-1.5">
                           ✓ Identified App Features
                         </h5>
                         <ul className="space-y-1">
                           {generatedApp.requirements.features.slice(0, 3).map((f, i) => (
                             <li key={i} className="text-xs flex items-center gap-1">
                               <span className="inline-block w-1.5 h-1.5 rounded-full bg-stone-400"></span>
                               <span className={`truncate ${themeMode === "dark" ? "text-stone-300" : "text-stone-600"}`}>{f}</span>
                             </li>
                           ))}
                         </ul>
                       </div>
                       <div>
                         <h5 className="text-[10px] font-bold uppercase text-[#5A5A40] tracking-wider mb-1.5">
                           ✓ Scaffolded API Routes
                         </h5>
                         <ul className="space-y-1">
                           {generatedApp.requirements.apis.slice(0, 3).map((api, i) => (
                             <li key={i} className="text-xs flex items-center gap-1 font-mono">
                               <span className="text-stone-400 text-[10px]">→</span>
                               <span className={`truncate ${themeMode === "dark" ? "text-stone-300" : "text-stone-650"}`}>{api}</span>
                             </li>
                           ))}
                         </ul>
                       </div>
                     </div>

                    {/* Interactive functional widget mapping to current schema */}
                    <InteractiveSandbox appName={generatedApp.appName} schema={generatedApp.mockDataSchema} />
                  </div>
                )}

                {/* 2. Visual React Frontend Code tab */}
                {activeTab === "frontend" && (
                  <div className="animate-fadeIn">
                    <p className="text-xs text-stone-500 mb-3 leading-relaxed">
                      Generated declarative frontend dashboard utilizing high fidelity <strong>Tailwind utility tokens</strong> and responsive layout constructs.
                    </p>
                    <CodeSection code={generatedApp.uiCode} filename={`${generatedApp.appName.replace(/\s+/g, "")}Dashboard.tsx`} language="tsx" />
                  </div>
                )}

                {/* 3. Express Controller Backend Service API */}
                {activeTab === "backend" && (
                  <div className="animate-fadeIn">
                    <p className="text-xs text-stone-500 mb-3 leading-relaxed">
                      Generated Express.js app routing endpoints containing security token authorization headers, document integrity validation gates, and complete payload handling.
                    </p>
                    <CodeSection code={generatedApp.backendCode} filename="server.js" language="javascript" />
                  </div>
                )}

                {/* 4. Google Firestore Collection Schemas and Seeding */}
                {activeTab === "db" && (
                  <div className="animate-fadeIn">
                    <p className="text-xs text-stone-500 mb-3 leading-relaxed">
                      Declarative representation of document database records schema optimized for secure indexing rules.
                    </p>
                    <CodeSection code={generatedApp.dbSchema} filename="firestore-schema.json" language="json" />
                  </div>
                )}

                {/* 5. Jest QA Testing Module */}
                {activeTab === "tests" && (
                  <div className="animate-fadeIn">
                    <p className="text-xs text-stone-500 mb-3 leading-relaxed">
                      Standalone test scripts utilizing request mocking engines to audit routing errors & unauthorized payload request scenarios.
                    </p>
                    <CodeSection code={generatedApp.tests} filename="api.test.js" language="javascript" />
                  </div>
                )}

                {/* 6. Production Ready Docker Deployment profile */}
                {activeTab === "deploy" && (
                  <div className="animate-fadeIn space-y-6">
                    <div className={`p-5 rounded-2xl border ${themeMode === "dark" ? "bg-[#141613] border-[#2A2E28]" : "bg-stone-50 border-stone-200"} space-y-4`}>
                      <div className="flex items-center gap-2">
                        <Globe className="w-4 h-4 text-[#5A5A40]" />
                        <h4 className="text-xs font-bold uppercase tracking-widest text-[#5A5A40]">Deployed App Links</h4>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {/* Production Link Card */}
                        <div className={`p-4 rounded-xl border flex flex-col justify-between ${themeMode === "dark" ? "bg-[#1D211A] border-[#2A2E28]" : "bg-white border-stone-200/80"}`}>
                          <div>
                            <div className="flex items-center justify-between gap-1.5 mb-1">
                              <span className="text-[10px] font-bold uppercase text-[#5A5A40] tracking-wider">Production Deploy</span>
                              <span className="flex items-center gap-1 text-[10px] bg-emerald-50 text-emerald-700 px-1.5 py-0.5 rounded-full font-bold border border-emerald-100 dark:bg-emerald-950/40 dark:text-emerald-400 dark:border-emerald-900/40">
                                <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse"></span>
                                Live & Shared
                              </span>
                            </div>
                            <p className={`text-xs font-mono break-all line-clamp-2 select-all my-2 px-2 py-1.5 rounded bg-black/5 dark:bg-black/20 ${themeMode === "dark" ? "text-stone-300" : "text-stone-600"}`}>
                              https://ais-pre-2daabyzf6rdditfk4oruoq-545677529876.asia-southeast1.run.app
                            </p>
                          </div>
                          
                          <div className="flex items-center gap-2 mt-3 pt-3 border-t border-stone-200/50 dark:border-stone-800/50">
                            <a
                              href="https://ais-pre-2daabyzf6rdditfk4oruoq-545677529876.asia-southeast1.run.app"
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex-1 py-1.5 px-3 bg-[#5A5A40] hover:bg-[#484833] text-white rounded-lg text-[11px] font-bold flex items-center justify-center gap-1.5 transition text-center"
                            >
                              <ExternalLink className="w-3.5 h-3.5" />
                              <span>Open Live App</span>
                            </a>
                            <button
                              onClick={() => handleCopy("https://ais-pre-2daabyzf6rdditfk4oruoq-545677529876.asia-southeast1.run.app", "prod")}
                              className={`p-1.5 rounded-lg border transition duration-200 flex items-center justify-center cursor-pointer ${themeClasses.buttonSecondary}`}
                              title="Copy Production Link"
                            >
                              {copiedProd ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                            </button>
                          </div>
                        </div>

                        {/* Development Link Card */}
                        <div className={`p-4 rounded-xl border flex flex-col justify-between ${themeMode === "dark" ? "bg-[#1D211A] border-[#2A2E28]" : "bg-white border-stone-200/80"}`}>
                          <div>
                            <div className="flex items-center justify-between gap-1.5 mb-1">
                              <span className="text-[10px] font-bold uppercase text-stone-500 tracking-wider">Workspace Dev</span>
                              <span className="flex items-center gap-1 text-[10px] bg-amber-50 text-amber-700 px-1.5 py-0.5 rounded-full font-bold border border-amber-100 dark:bg-amber-950/40 dark:text-amber-400 dark:border-amber-900/40">
                                <span className="w-1.5 h-1.5 bg-amber-500 rounded-full animate-pulse"></span>
                                Dev Sandbox
                              </span>
                            </div>
                            <p className={`text-xs font-mono break-all line-clamp-2 select-all my-2 px-2 py-1.5 rounded bg-black/5 dark:bg-black/20 ${themeMode === "dark" ? "text-stone-300" : "text-stone-600"}`}>
                              https://ais-dev-2daabyzf6rdditfk4oruoq-545677529876.asia-southeast1.run.app
                            </p>
                          </div>
                          
                          <div className="flex items-center gap-2 mt-3 pt-3 border-t border-stone-200/50 dark:border-stone-800/50">
                            <a
                              href="https://ais-dev-2daabyzf6rdditfk4oruoq-545677529876.asia-southeast1.run.app"
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex-1 py-1.5 px-3 bg-stone-100 text-stone-700 hover:bg-stone-200 dark:bg-[#212420] dark:text-stone-200 dark:hover:bg-[#2B2F2A] rounded-lg text-[11px] font-bold flex items-center justify-center gap-1.5 transition text-center border border-stone-200 dark:border-stone-850"
                            >
                              <ExternalLink className="w-3.5 h-3.5 text-[#5A5A40]" />
                              <span>Open Dev App</span>
                            </a>
                            <button
                              onClick={() => handleCopy("https://ais-dev-2daabyzf6rdditfk4oruoq-545677529876.asia-southeast1.run.app", "dev")}
                              className={`p-1.5 rounded-lg border transition duration-200 flex items-center justify-center cursor-pointer ${themeClasses.buttonSecondary}`}
                              title="Copy Dev Link"
                            >
                              {copiedDev ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <p className="text-xs text-stone-500 mb-3 leading-relaxed">
                        Container optimization builds configurations engineered to bundle modules inside single-step Cloud Run containers.
                      </p>
                      <CodeSection code={generatedApp.deployment} filename="Dockerfile" language="dockerfile" />
                    </div>
                  </div>
                )}

              </div>
            )}

            {/* Prompt History Logger Panel */}
            <div className={`border-t pt-5 mt-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs ${themeMode === "dark" ? "border-[#2A2E28]" : "border-stone-100"}`}>
              <span className="text-stone-400 font-medium">History: {generationHistory.length} compilation models cached</span>
              {generationHistory.length > 1 && (
                <div className="flex flex-wrap gap-2">
                  {generationHistory.map((h, i) => (
                    <button
                      key={i}
                      onClick={() => {
                        setGeneratedApp(h);
                        setBuildNotification(`Restored sandbox framework: ${h.appName}`);
                        setTimeout(() => setBuildNotification(null), 3500);
                      }}
                      className={`px-2.5 py-1 border rounded text-[10px] font-semibold transition cursor-pointer ${themeClasses.buttonSecondary}`}
                    >
                      {h.appName}
                    </button>
                  ))}
                </div>
              )}
            </div>

          </div>
        </section>

      </main>

      {/* Earthy design theme details & platform badges */}
      <footer className={`border-t py-6 mt-12 text-center text-xs space-y-2 ${themeClasses.header} transition-colors duration-300`}>
        <div className="flex justify-center gap-1.5 items-center">
          <span className={`${themeClasses.textSecondary}`}>VibeForge AI is running on</span>
          <span className={`font-semibold ${themeClasses.textPrimary}`}>Cloud Run Serverless Sandbox</span>
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
        </div>
        <p className="text-[10px] text-stone-450 leading-relaxed font-medium">
          Multi-agent orchestration powered by Google Gemini 2.5 Flash | Structured Outputs Schema V2.0<br/>
          Crafted with love using elegant <strong>Natural Tones Style</strong> tokens.
        </p>
      </footer>
    </div>
  );
}
