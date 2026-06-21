import React, { useState } from "react";
import { Copy, Check, FileCode, Download } from "lucide-react";

interface CodeSectionProps {
  code: string;
  filename: string;
  language: string;
}

export default function CodeSection({ code, filename, language }: CodeSectionProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const blob = new Blob([code], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const lines = code.trim().split("\n");

  return (
    <div className="border border-stone-200 bg-[#1E1E1C] rounded-xl overflow-hidden shadow-sm">
      {/* Code Header Bar */}
      <div className="flex items-center justify-between px-4 py-3 bg-stone-50 border-b border-stone-200">
        <div className="flex items-center gap-2">
          <FileCode className="w-4 h-4 text-[#5A5A40]" />
          <span className="text-xs font-mono font-bold text-stone-800">{filename}</span>
          <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-stone-200/60 text-stone-700 uppercase">
            {language}
          </span>
        </div>
        <div className="flex items-center gap-2">
          {/* Copy Button */}
          <button
            onClick={handleCopy}
            className="flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-bold text-stone-600 hover:text-stone-900 hover:bg-stone-100 rounded-lg border border-stone-300 shadow-xs cursor-pointer transition bg-white"
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-600" />
                <span className="text-emerald-600">Copied!</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5" />
                <span>Copy</span>
              </>
            )}
          </button>
          
          {/* Download Button */}
          <button
            onClick={handleDownload}
            className="p-1.5 text-stone-600 hover:text-stone-900 hover:bg-stone-100 rounded-lg border border-stone-300 shadow-xs cursor-pointer bg-white transition"
            title="Download Code"
          >
            <Download className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Code Editor Body */}
      <div className="flex overflow-x-auto font-mono text-xs leading-relaxed max-h-[500px]">
        {/* Line Numbers column */}
        <div className="py-4 text-right bg-[#181816]/90 border-r border-stone-800 select-none text-stone-500 min-w-[40px] px-3 font-medium">
          {lines.map((_, i) => (
            <div key={i}>{i + 1}</div>
          ))}
        </div>

        {/* Text Area */}
        <pre className="p-4 text-stone-100 overflow-x-auto w-full select-text whitespace-pre bg-[#1E1E1C] font-normal">
          <code>{code}</code>
        </pre>
      </div>
    </div>
  );
}
