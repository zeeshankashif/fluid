/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Sliders, HelpCircle } from "lucide-react";
import { ThemeType } from "../types";

interface ControlsConsoleProps {
  theme: ThemeType;
  speed: number;
  setSpeed: (s: number) => void;
  complexity: number;
  setComplexity: (c: number) => void;
}

export function ControlsConsole({ theme, speed, setSpeed, complexity, setComplexity }: ControlsConsoleProps) {
  
  const getThemeText = (t: ThemeType) => {
    switch (t) {
      case "prime": return "text-[#bd00ff]";
      case "cyan": return "text-cyan-400";
      case "solar": return "text-amber-400";
    }
  };

  const getThemeAccent = (t: ThemeType) => {
    switch (t) {
      case "prime": return "accent-purple-500 hover:accent-purple-400";
      case "cyan": return "accent-cyan-400 hover:accent-cyan-300";
      case "solar": return "accent-amber-500 hover:accent-amber-400";
    }
  };

  const getThemeBg = (t: ThemeType) => {
    switch (t) {
      case "prime": return "bg-purple-500/10 border-purple-500/15";
      case "cyan": return "bg-cyan-500/10 border-cyan-500/15";
      case "solar": return "bg-amber-500/10 border-amber-500/15";
    }
  };

  return (
    <div className="flex flex-col h-full justify-between gap-4">
      {/* Title */}
      <div className="flex items-start justify-between flex-col">
        <div className="flex items-center gap-1.5 mb-1">
          <Sliders className={`w-4 h-4 ${getThemeText(theme)}`} />
          <span className="font-mono text-[10px] uppercase text-gray-400 tracking-wider">
            SYSTEM_SLIDERS_CONTROL
          </span>
        </div>
        <span className="font-display font-light text-xl leading-none tracking-tight text-white block text-left">
          Core Parameters
        </span>
      </div>

      {/* Controller Inputs Area */}
      <div className="space-y-4 flex-grow flex flex-col justify-center my-1 z-10">
        {/* Slider 1: Speed Factor */}
        <div className="space-y-1.5 text-left">
          <div className="flex justify-between items-center text-xs">
            <span className="font-mono text-[9px] uppercase tracking-wider text-gray-400">
              SIMULATION_SPEED
            </span>
            <span className={`font-mono text-xs font-semibold ${getThemeText(theme)} bg-white/5 border border-white/5 px-1.5 py-0.5 rounded`}>
              {speed.toFixed(1)}x
            </span>
          </div>
          <input
            type="range"
            min="0.2"
            max="4.0"
            step="0.1"
            value={speed}
            onChange={(e) => setSpeed(parseFloat(e.target.value))}
            className={`w-full h-1 bg-neutral-800 rounded-lg cursor-pointer ${getThemeAccent(theme)}`}
          />
          <div className="flex justify-between text-[8px] font-mono text-gray-600 uppercase">
            <span>FLOAT_DRIFT</span>
            <span>HYPER_ROTATION</span>
          </div>
        </div>

        {/* Slider 2: Node Density Complexity */}
        <div className="space-y-1.5 text-left">
          <div className="flex justify-between items-center text-xs">
            <span className="font-mono text-[9px] uppercase tracking-wider text-gray-400">
              SYNAPSE_COMPLEXITY
            </span>
            <span className={`font-mono text-xs font-semibold ${getThemeText(theme)} bg-white/5 border border-white/5 px-1.5 py-0.5 rounded`}>
              {Math.floor(complexity * 100)}%
            </span>
          </div>
          <input
            type="range"
            min="0.1"
            max="1.0"
            step="0.05"
            value={complexity}
            onChange={(e) => setComplexity(parseFloat(e.target.value))}
            className={`w-full h-1 bg-neutral-800 rounded-lg cursor-pointer ${getThemeAccent(theme)}`}
          />
          <div className="flex justify-between text-[8px] font-mono text-gray-600 uppercase">
            <span>SPARSE</span>
            <span>HIGH_DENSITY</span>
          </div>
        </div>
      </div>

      {/* Floating interactive help note */}
      <div className={`p-2.5 rounded-lg border text-[9px] font-mono leading-relaxed text-gray-400 flex items-start gap-2 text-left ${getThemeBg(theme)}`}>
        <HelpCircle className={`w-4 h-4 shrink-0 ${getThemeText(theme)}`} />
        <span>Updating sliders immediately fluctuates orbital speeds inside the Quantum Core particles and adjusts mesh count inside synaptic branches in real-time.</span>
      </div>
    </div>
  );
}
