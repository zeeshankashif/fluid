import React, { useState, useEffect, useRef } from "react";
import { Sparkles, Send, Terminal, Cpu, Activity, Info, RefreshCw } from "lucide-react";
import { ThemeType } from "../types";

interface SystemOracleProps {
  theme: ThemeType;
  speed: number;
  complexity: number;
}

const PRESET_COMMANDS = [
  {
    id: "diagnose",
    label: "SYS_DIAGNOSE",
    description: "Scan active flux harmonics and network parameters",
    prompt: "Diagnose overall system latency harmonics. Suggest a corrective micro-tuning configuration.",
    icon: Activity
  },
  {
    id: "predict",
    label: "FORECAST_MESH",
    description: "Calculate synaptic transmission trajectories",
    prompt: "Predict system connectivity vector paths and identify potential security or throughput bottlenecks in the next 12 cycles.",
    icon: Cpu
  },
  {
    id: "motto",
    label: "COGNITIVE_MOTTO",
    description: "Synthesize high-fidelity system design manifesto",
    prompt: "Generate a micro-manifesto (a short, high-end, elegant system motto or design theme) inspired by the current parameter configuration.",
    icon: Sparkles
  }
];

export function SystemOracle({ theme, speed, complexity }: SystemOracleProps) {
  const [query, setQuery] = useState("");
  const [output, setOutput] = useState("AETHERIS COGNITIVE ARRAY STANDBY. SUBMIT QUERY TO ACTIVATE COGNITION LINK.");
  const [displayedOutput, setDisplayedOutput] = useState("");
  const [loading, setLoading] = useState(false);
  const [selectedPreset, setSelectedPreset] = useState<string | null>(null);
  const [isSimulated, setIsSimulated] = useState(false);
  const terminalScrollRef = useRef<HTMLDivElement>(null);

  // Typewriter effect variables
  useEffect(() => {
    let index = 0;
    setDisplayedOutput("");
    
    if (!output) return;

    const timer = setInterval(() => {
      setDisplayedOutput((prev) => prev + output.charAt(index));
      index++;
      if (index >= output.length) {
        clearInterval(timer);
      }
    }, 12); // speedy elegant typewriter feel

    return () => clearInterval(timer);
  }, [output]);

  // Scroll to bottom of terminal content on response update (local scrolling only to prevent screen auto-scroll)
  useEffect(() => {
    if (terminalScrollRef.current) {
      terminalScrollRef.current.scrollTop = terminalScrollRef.current.scrollHeight;
    }
  }, [displayedOutput]);

  const handlePresetSelect = (presetId: string, prompt: string) => {
    setSelectedPreset(presetId);
    setQuery(prompt);
  };

  const handleQuerySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim() || loading) return;

    setLoading(true);
    setOutput("");
    setDisplayedOutput("");
    setSelectedPreset(null);

    try {
      const response = await fetch("/api/oracle", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          prompt: query,
          currentTheme: theme,
          speed,
          complexity,
        }),
      });

      if (!response.ok) {
        throw new Error("Cognitive transmission dropped.");
      }

      const data = await response.json();
      setIsSimulated(data.isSimulation || false);
      setOutput(data.text);
    } catch (err: any) {
      console.error(err);
      setOutput("⚠️ DIRECT_TRANSMISSION_ERROR: Network loop decoupled. Default simulator fallback initialized. [Aetheris offline]");
    } finally {
      setLoading(false);
    }
  };

  const getThemeColor = () => {
    switch (theme) {
      case "cyan":
        return {
          glow: "shadow-[0_0_15px_rgba(6,182,212,0.15)]",
          text: "text-cyan-400",
          border: "border-cyan-500/30",
          bg: "bg-cyan-950/20",
          badge: "bg-cyan-500/10 text-cyan-400 border-cyan-500/20",
          accent: "text-cyan-300",
          inputBg: "focus:border-cyan-500/50 focus:ring-cyan-500/20"
        };
      case "solar":
        return {
          glow: "shadow-[0_0_15px_rgba(245,158,11,0.15)]",
          text: "text-amber-400",
          border: "border-amber-500/30",
          bg: "bg-amber-950/20",
          badge: "bg-amber-500/10 text-amber-400 border-amber-500/20",
          accent: "text-amber-300",
          inputBg: "focus:border-amber-500/50 focus:ring-amber-500/20"
        };
      case "prime":
      default:
        return {
          glow: "shadow-[0_0_15px_rgba(189,0,255,0.15)]",
          text: "text-[#bd00ff]",
          border: "border-[#bd00ff]/30",
          bg: "bg-[#bd00ff]/5",
          badge: "bg-[#bd00ff]/10 text-purple-400 border-[#bd00ff]/20",
          accent: "text-purple-300",
          inputBg: "focus:border-[#bd00ff]/50 focus:ring-[#bd00ff]/20"
        };
    }
  };

  const c = getThemeColor();

  return (
    <div className="flex flex-col h-full w-full justify-between p-1 select-text">
      {/* Module Title */}
      <div className="flex justify-between items-center pb-2 border-b border-white/5">
        <div className="flex items-center gap-2">
          <Terminal className={`w-4 h-4 ${c.text}`} />
          <h3 className="font-mono text-xs uppercase tracking-widest font-semibold text-zinc-200">
            Aetheris Oracle Terminal
          </h3>
        </div>
        <div className="flex items-center gap-1.5 font-mono text-[9px]">
          <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse"></span>
          <span className="text-zinc-500 uppercase">COGNITION_LINK_ONLINE</span>
        </div>
      </div>

      {/* Preset Selectors */}
      <div className="grid grid-cols-3 gap-2 mt-3">
        {PRESET_COMMANDS.map((cmd) => {
          const CmdIcon = cmd.icon;
          const isSelected = selectedPreset === cmd.id;
          return (
            <button
              key={cmd.id}
              onClick={() => handlePresetSelect(cmd.id, cmd.prompt)}
              className={`flex flex-col p-2 text-left bg-zinc-950/40 rounded-xl border transition-all text-[10px] sm:text-xs duration-300 group hover:bg-zinc-900/60 ${
                isSelected 
                  ? `${c.border} bg-zinc-900/50 ${c.glow}` 
                  : "border-white/5 hover:border-white/10"
              }`}
            >
              <div className="flex items-center gap-1 mb-1">
                <CmdIcon className={`w-3.5 h-3.5 transition ${isSelected ? c.text : "text-zinc-400 group-hover:text-zinc-200"}`} />
                <span className="font-mono font-bold tracking-tight text-zinc-300 group-hover:text-zinc-100">{cmd.label}</span>
              </div>
              <p className="font-sans text-[9px] text-zinc-500 leading-tight group-hover:text-zinc-400">
                {cmd.description}
              </p>
            </button>
          );
        })}
      </div>

      {/* Display Terminal Output */}
      <div className={`my-3 flex-grow min-h-[140px] md:min-h-[150px] bg-zinc-950/50 border border-white/5 rounded-xl p-3 flex flex-col font-mono text-[11px] leading-relaxed relative overflow-hidden transition-all duration-300 ${c.glow}`}>
        <div className="absolute inset-0 bg-scanlines pointer-events-none opacity-25"></div>
        <div ref={terminalScrollRef} className="flex-grow overflow-y-auto pr-1 flex flex-col max-h-[180px]">
          <div className="flex items-center gap-2 mb-2 text-zinc-600 border-b border-white/5 pb-1 select-none text-[9px]">
            <span>[SOURCE: AETHERIS.COGNITIVE.LAYER]</span>
            {isSimulated ? (
              <span className="text-amber-500/80">[SIMULATION ENGINE TYPE]</span>
            ) : (
              <span className={`${c.text} animate-pulse`}>[LIVE GEMINI MODEL - ONLINE]</span>
            )}
          </div>
          
          <div className="text-zinc-300 whitespace-pre-wrap break-words font-mono min-h-[50px]">
            {displayedOutput}
            {loading && (
              <span className="inline-block ml-1 w-2 h-4 bg-zinc-400 animate-pulse"></span>
            )}
          </div>
        </div>

        {/* Loading overlay */}
        {loading && (
          <div className="absolute inset-0 bg-zinc-950/80 flex flex-col items-center justify-center gap-2 select-none">
            <RefreshCw className={`w-5 h-5 animate-spin ${c.text}`} />
            <span className="font-sans text-[10px] uppercase tracking-widest text-zinc-400">
              Querying Cognitive Matrix...
            </span>
          </div>
        )}
      </div>

      {/* Prompt Form Input Box */}
      <form onSubmit={handleQuerySubmit} className="flex gap-2">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Command Aetheris Intellectual Core..."
          className={`flex-grow bg-zinc-950/70 border border-white/10 rounded-xl px-3 py-2 text-[11px] font-mono text-zinc-100 placeholder-zinc-600 outline-none transition duration-300 ${c.inputBg}`}
        />
        <button
          type="submit"
          disabled={loading || !query.trim()}
          className={`px-3 py-2 bg-zinc-900 border border-white/10 text-zinc-300 hover:text-white rounded-xl transition-all duration-300 flex items-center justify-center gap-1.5 group ${
            query.trim() && !loading ? `hover:border-zinc-700 hover:bg-zinc-800 ${c.text}` : "opacity-40 cursor-not-allowed"
          }`}
        >
          <Send className="w-3.5 h-3.5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition" />
        </button>
      </form>
    </div>
  );
}
