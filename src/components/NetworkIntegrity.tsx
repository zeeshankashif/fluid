import { useState, useEffect } from "react";
import { ShieldCheck, Cpu, Database, RefreshCw, AlertTriangle } from "lucide-react";
import { ThemeType } from "../types";

interface NodeState {
  label: string;
  load: number;
  stable: boolean;
}

interface NetworkIntegrityProps {
  theme: ThemeType;
}

export function NetworkIntegrity({ theme }: NetworkIntegrityProps) {
  const [integrity, setIntegrity] = useState<number>(98.7);
  const [pulseActive, setPulseActive] = useState<boolean>(true);
  const [isCalibrating, setIsCalibrating] = useState<boolean>(false);
  const [checkedCount, setCheckedCount] = useState<number>(241);
  const [nodes, setNodes] = useState<NodeState[]>([
    { label: "AETH_SYNAPSE_CORE", load: 42, stable: true },
    { label: "NEURAL_LINK_LAYER", load: 58, stable: true },
    { label: "COSMOS_GRID_ROUTER", load: 89, stable: false },
    { label: "QUANTUM_DECRYPT_V1", load: 21, stable: true },
  ]);

  // Rolling numbers to add life
  useEffect(() => {
    if (!pulseActive) return;

    const interval = setInterval(() => {
      // Small integrity shifts
      setIntegrity((prev) => {
        const change = (Math.random() - 0.5) * 0.4;
        const next = prev + change;
        return parseFloat(Math.max(92, Math.min(100, next)).toFixed(2));
      });

      // Update random node loads
      setNodes((prevNodes) =>
        prevNodes.map((n) => {
          const loadChange = Math.round((Math.random() - 0.5) * 10);
          const nextLoad = Math.max(10, Math.min(100, n.load + loadChange));
          return {
            ...n,
            load: nextLoad,
            stable: nextLoad < 85, // unstable if load > 85%
          };
        })
      );

      // Increment checks
      setCheckedCount((prev) => prev + Math.floor(Math.random() * 3));
    }, 1500);

    return () => clearInterval(interval);
  }, [pulseActive]);

  const runCalibration = () => {
    setIsCalibrating(true);
    setPulseActive(false);
    
    // Simulate multi-step futuristic calibration
    setTimeout(() => {
      setIntegrity(100.0);
      setNodes((prevNodes) =>
        prevNodes.map((n) => ({ ...n, load: 35, stable: true }))
      );
      setIsCalibrating(false);
      setPulseActive(true);
      setCheckedCount((prev) => prev + 50);
    }, 2000);
  };

  const getThemeText = () => {
    switch (theme) {
      case "cyan":
        return "text-cyan-400";
      case "solar":
        return "text-amber-400";
      case "prime":
      default:
        return "text-[#bd00ff]";
    }
  };

  const getThemeBar = (value: number) => {
    const p = `${value}%`;
    let colorClass = "bg-[#bd00ff]";
    if (theme === "cyan") colorClass = "bg-cyan-400";
    if (theme === "solar") colorClass = "bg-amber-400";
    return (
      <div className="w-full h-1 bg-zinc-900 rounded-full overflow-hidden mt-1">
        <div className={`h-full duration-500 transition-all ${colorClass}`} style={{ width: p }} />
      </div>
    );
  };

  return (
    <div className="flex flex-col h-full w-full justify-between p-1">
      {/* Title */}
      <div className="flex justify-between items-center pb-2 border-b border-white/5">
        <div className="flex items-center gap-2">
          <ShieldCheck className={`w-4 h-4 ${getThemeText()}`} />
          <h3 className="font-mono text-xs uppercase tracking-widest font-semibold text-zinc-200">
            Security Integrity
          </h3>
        </div>
        <span className="font-mono text-[9px] text-[#0df] animate-pulse">AETHER_OK</span>
      </div>

      {/* Dynamic Integrity Metric Gauge */}
      <div className="my-3 text-center py-2 bg-zinc-950/40 border border-white/5 rounded-xl p-2.5 relative overflow-hidden">
        <div className="text-[28px] font-mono font-bold tracking-tighter leading-none text-white select-all">
          {integrity}%
        </div>
        <div className="font-sans text-[8px] uppercase tracking-widest text-zinc-500 mt-1">
          COGNITIVE NET EFFICIENCY
        </div>
        
        {/* Glow backdrop indicator */}
        <div 
          className="absolute -bottom-6 left-1/2 -translate-x-1/2 w-16 h-8 rounded-full blur-[20px] pointer-events-none opacity-40 transition-all duration-700" 
          style={{
            backgroundColor: theme === "cyan" ? "#0df" : theme === "solar" ? "#f59e0b" : "#bd00ff"
          }}
        />
      </div>

      {/* Active Diagnostics Nodes status checks */}
      <div className="space-y-2 flex-grow">
        {nodes.map((n) => (
          <div key={n.label} className="flex flex-col text-[10px] font-mono">
            <div className="flex justify-between items-center text-zinc-400">
              <span className="truncate max-w-[120px] text-zinc-300 font-bold">{n.label}</span>
              <div className="flex items-center gap-1.5">
                <span>{n.load}%</span>
                {n.stable ? (
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                ) : (
                  <span className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-ping" />
                )}
              </div>
            </div>
            {getThemeBar(n.load)}
          </div>
        ))}
      </div>

      {/* Trigger Calibration Action */}
      <div className="mt-3 pt-2 border-t border-white/5 flex gap-2">
        <button
          onClick={runCalibration}
          disabled={isCalibrating}
          className={`flex-grow py-1.5 rounded-xl font-mono text-[10px] uppercase border transition duration-300 flex items-center justify-center gap-1.5 ${
            isCalibrating 
              ? "bg-zinc-900 border-white/5 text-zinc-600 cursor-not-allowed" 
              : "bg-zinc-900/60 border-white/5 hover:border-zinc-800 text-zinc-300 hover:text-white"
          }`}
        >
          <RefreshCw className={`w-3 h-3 ${isCalibrating ? "animate-spin text-zinc-600" : getThemeText()}`} />
          {isCalibrating ? "CALIBRATING..." : "RUN SECURE CHECK"}
        </button>
      </div>
    </div>
  );
}
