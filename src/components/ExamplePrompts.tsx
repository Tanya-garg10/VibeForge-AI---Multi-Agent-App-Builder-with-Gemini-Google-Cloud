import React from "react";
import { Activity, Calendar, LayoutGrid, CreditCard } from "lucide-react";

export interface ExampleIdea {
  title: string;
  tagline: string;
  prompt: string;
  icon: React.ReactNode;
}

interface ExamplePromptsProps {
  onSelect: (prompt: string) => void;
  disabled: boolean;
}

export default function ExamplePrompts({ onSelect, disabled }: ExamplePromptsProps) {
  const ideas: ExampleIdea[] = [
    {
      title: "Hospital Management",
      tagline: "Track patients, doctor rotations & appointment statuses",
      prompt: "Hospital management app with patients log, doctor rotas, appointment booking schedule, and key statistics on critical ward occupation.",
      icon: <Activity className="w-5 h-5 text-[#5A5A40]" />
    },
    {
      title: "Task Management Board",
      tagline: "SaaS boards to organize columns & track daily developer milestones",
      prompt: "SaaS software task management app featuring agile sprint boards, status column boards (Backlog, In Progress, Review, Completed), and developer burn-down velocity logs.",
      icon: <LayoutGrid className="w-5 h-5 text-[#5A5A40]" />
    },
    {
      title: "Personal Fitness Log",
      tagline: "Log exercise routines, active calorie splits & metrics",
      prompt: "Personal fitness tracker focusing on daily exercise logging, hydration counts, target macronutrient targets, and streaks metrics.",
      icon: <Calendar className="w-5 h-5 text-[#5A5A40]" />
    },
    {
      title: "SaaS Billing Dashboard",
      tagline: "Consolidate active subscriptions, billing metrics & payouts",
      prompt: "SaaS financial system tracking premium subscriptions, plan categories (Hobby, Startup, Team, Enterprise), live billing history, and gross monthly recurring revenues (MRR).",
      icon: <CreditCard className="w-5 h-5 text-[#5A5A40]" />
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
      {ideas.map((idea, idx) => (
        <button
          key={idx}
          onClick={() => !disabled && onSelect(idea.prompt)}
          disabled={disabled}
          type="button"
          className={`flex items-start gap-3.5 p-4 text-left rounded-xl border transition-all duration-200 cursor-pointer ${
            disabled
              ? "border-stone-100 bg-stone-50 opacity-60"
              : "border-stone-200 bg-stone-50/60 hover:border-[#5A5A40]/40 hover:bg-stone-50 hover:shadow-sm"
          }`}
        >
          <div className="p-2 rounded-lg bg-[#5A5A40]/10 border border-[#5A5A40]/15 text-[#5A5A40]">
            {idea.icon}
          </div>
          <div>
            <h4 className="text-sm font-bold text-stone-900">{idea.title}</h4>
            <p className="text-xs text-stone-500 mt-1 line-clamp-2 leading-relaxed">{idea.tagline}</p>
          </div>
        </button>
      ))}
    </div>
  );
}
