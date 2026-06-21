import React, { useEffect, useState, useRef } from "react";
import { ClipboardList, Palette, Server, Database, CheckSquare, Cloud, Command, Loader2 } from "lucide-react";

interface AgentStatus {
  id: string;
  name: string;
  role: string;
  icon: React.ReactNode;
  durationSec: number;
}

interface AgentStatusTrackerProps {
  currentStage: number; // 0 to 6
  isGenerating: boolean;
  themeMode?: "light" | "dark";
}

export default function AgentStatusTracker({ currentStage, isGenerating, themeMode = "light" }: AgentStatusTrackerProps) {
  const agents: AgentStatus[] = [
    {
      id: "requirements",
      name: "Requirement Agent",
      role: "User Stories & API Definitions",
      icon: <ClipboardList className="w-5 h-5" />,
      durationSec: 3
    },
    {
      id: "ui",
      name: "UI Agent",
      role: "React & Tailwind Dashboards",
      icon: <Palette className="w-5 h-5" />,
      durationSec: 4
    },
    {
      id: "backend",
      name: "Backend Agent",
      role: "Express CRUD & Node APIs",
      icon: <Server className="w-5 h-5" />,
      durationSec: 4
    },
    {
      id: "database",
      name: "Database Agent",
      role: "Firestore Schemas & Seed data",
      icon: <Database className="w-5 h-5" />,
      durationSec: 3
    },
    {
      id: "testing",
      name: "Testing Agent",
      role: "Jest Test Suites & QA Suites",
      icon: <CheckSquare className="w-5 h-5" />,
      durationSec: 3
    },
    {
      id: "deployment",
      name: "Deployment Agent",
      role: "Cloud Run Profile & Dockerfile",
      icon: <Cloud className="w-5 h-5" />,
      durationSec: 2
    }
  ];

  // Animated running logs
  const [logs, setLogs] = useState<string[]>([]);
  const consoleEndRef = useRef<HTMLDivElement | null>(null);

  const getStatus = (index: number) => {
    if (!isGenerating) return "idle";
    if (currentStage > index) return "completed";
    if (currentStage === index) return "running";
    return "idle";
  };

  const getStageLogs = (stage: number): string[] => {
    switch (stage) {
      case 0:
        return [
          "[Requirements] Initializing user prompt ingestion...",
          "[Requirements] Parsing screen blueprint instructions...",
          "[Requirements] Structuring features, pages, components, & api routes...",
          "[Requirements] COMPLETED: Found 5 Core Features, 4 Component Assemblies."
        ];
      case 1:
        return [
          "[UI Agent] Reading design requirements & token constraints...",
          "[UI Agent] Compiling parent view layout in React...",
          "[UI Agent] Embedding responsive sidebar with Tailwind CSS classes...",
          "[UI Agent] COMPLETED: Custom dashboard assembly successfully generated."
        ];
      case 2:
        return [
          "[Backend Agent] Constructing standalone Express server router...",
          "[Backend Agent] Registering auth check middleware...",
          "[Backend Agent] Synthesizing CRUD endpoints for primary entities...",
          "[Backend Agent] COMPLETED: Secure Node.js server module generated."
        ];
      case 3:
        return [
          "[Database Agent] Analyzing collection hierarchies...",
          "[Database Agent] Declaring document properties, nested models, and rules...",
          "[Database Agent] Creating realistic seeding documents...",
          "[Database Agent] COMPLETED: Seeding collection data ready."
        ];
      case 4:
        return [
          "[Testing Agent] Importing Jest assert libraries...",
          "[Testing Agent] Spawning mock requests for GET/POST/PUT/DELETE APIs...",
          "[Testing Agent] Auditing route state validation gates...",
          "[Testing Agent] COMPLETED: Unit & Integration suite active and passed."
        ];
      case 5:
        return [
          "[Deployment Agent] Writing multi-step container builder profile...",
          "[Deployment Agent] Resolving caching layers & node_modules locks...",
          "[Deployment Agent] Rendering deployment variables...",
          "[Deployment Agent] COMPLETED: Standalone target Dockerfile compiled."
        ];
      case 6:
        return [
          "[VibeForge Orchestrator] Assembling generated packages...",
          "[VibeForge Orchestrator] Injecting mock state databases...",
          "[VibeForge Orchestrator] Compilation successfully complete!",
          "VibeForge AI successfully created your MVP applet!"
        ];
      default:
        return [];
    }
  };

  useEffect(() => {
    if (!isGenerating) {
      setLogs([]);
      return;
    }

    const stageLogs = getStageLogs(currentStage);
    let logIndex = 0;

    const interval = setInterval(() => {
      if (logIndex < stageLogs.length) {
        setLogs((prev) => [...prev, `${new Date().toLocaleTimeString()} ${stageLogs[logIndex]}`]);
        logIndex++;
      } else {
        clearInterval(interval);
      }
    }, 700);

    return () => clearInterval(interval);
  }, [currentStage, isGenerating]);

  useEffect(() => {
    if (consoleEndRef.current) {
      consoleEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [logs]);

  return (
    <div className="space-y-6">
      {/* 6-Agent Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {agents.map((agent, index) => {
          const status = getStatus(index);
          let borderClass = themeMode === "dark" ? "border-[#2A2E28]" : "border-stone-200";
          let bgClass = themeMode === "dark" ? "bg-[#1B1E1A]/40" : "bg-white/60";
          let textClass = "text-stone-500";
          let iconBg = themeMode === "dark" ? "bg-[#141613] text-stone-500" : "bg-stone-50 text-stone-400";

          if (status === "completed") {
            borderClass = themeMode === "dark" ? "border-[#5A5A40]/40" : "border-stone-300";
            bgClass = themeMode === "dark" ? "bg-[#5A5A40]/10" : "bg-[#5A5A40]/5";
            textClass = "text-[#5A5A40]";
            iconBg = "bg-[#5A5A40]/15 text-[#5A5A40]";
          } else if (status === "running") {
            borderClass = "border-[#5A5A40]/55 shadow-sm";
            bgClass = themeMode === "dark" ? "bg-[#212420] animate-pulse" : "bg-stone-50 animate-pulse";
            textClass = "text-[#5A5A40]";
            iconBg = "bg-[#5A5A40]/25 text-[#5A5A40]";
          }

          return (
            <div
              key={agent.id}
              className={`flex items-center gap-3.5 p-4 rounded-xl border transition-all duration-350 ${borderClass} ${bgClass}`}
            >
              <div className={`p-2.5 rounded-lg border ${status === "completed" ? "border-[#5A5A40]/20" : status === "running" ? "border-[#5A5A40]/25" : (themeMode === "dark" ? "border-[#2A2E28]" : "border-stone-200/60")} ${iconBg}`}>
                {agent.icon}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-2">
                  <h4 className={`text-sm font-bold truncate ${status !== "idle" ? (themeMode === "dark" ? "text-stone-100" : "text-stone-900") : "text-stone-400"}`}>
                    {agent.name}
                  </h4>
                  {status === "running" && (
                    <Loader2 className="w-3.5 h-3.5 animate-spin text-[#5A5A40]" />
                  )}
                  {status === "completed" && (
                    <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-[#5A5A40]/10 text-[#5A5A40]">DONE</span>
                  )}
                </div>
                <p className={`text-xs truncate mt-0.5 ${themeMode === "dark" ? "text-stone-400" : "text-stone-500"}`}>{agent.role}</p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Terminal Output Console */}
      <div className={`border ${themeMode === "dark" ? "border-[#2A2E28]" : "border-stone-200"} bg-stone-950 rounded-xl overflow-hidden shadow-sm`}>
        <div className="flex items-center justify-between px-4 py-2.5 bg-stone-900 border-b border-stone-800">
          <div className="flex items-center gap-2">
            <Command className="w-3.5 h-3.5 text-stone-400" />
            <span className="text-xs font-mono font-bold text-stone-300">orchestration_engine.log</span>
          </div>
          <div className="flex gap-1.5">
            <span className="w-2 h-2 rounded-full bg-stone-700"></span>
            <span className="w-2 h-2 rounded-full bg-stone-700"></span>
            <span className="w-2 h-2 rounded-full bg-stone-700"></span>
          </div>
        </div>
        <div className="p-4 h-56 overflow-y-auto font-mono text-xs text-stone-200 space-y-2.5 leading-relaxed bg-stone-950">
          {logs.length === 0 ? (
            <div className="flex h-full items-center justify-center text-stone-500">
              <span>Waiting to build and deploy...</span>
            </div>
          ) : (
            <>
              {logs.map((log, idx) => (
                <div key={idx} className="flex gap-2">
                   <span className="text-stone-600 select-none">{"$"}</span>
                  <span className={log.includes("COMPLETED") || log.includes("complete!") ? "text-emerald-400 font-medium" : "text-stone-350"}>
                    {log}
                  </span>
                </div>
              ))}
              <div ref={consoleEndRef} />
            </>
          )}
        </div>
      </div>
    </div>
  );
}
