/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from "react";
import { Cpu, Globe, KeyRound, ShieldAlert } from "lucide-react";
import { ThemeType } from "../types";

interface HeaderProps {
  activeTheme: ThemeType;
  setTheme: (t: ThemeType) => void;
}

export function AetherisHeader({ activeTheme, setTheme }: HeaderProps) {
  const [time, setTime] = useState("");

  useEffect(() => {
    // Tick current clock in format HH:MM:SS UTC or AM/PM
    const updateTime = () => {
      const now = new Date();
      const stringTime = now.toLocaleTimeString("en-US", {
        hour12: false,
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
      });
      setTime(stringTime);
    };

    updateTime();
    const timerId = setInterval(updateTime, 1000);
    return () => clearInterval(timerId);
  }, []);

  const getThemeColor = (theme: ThemeType) => {
    switch (theme) {
      case "prime":
        return "text-neon-purple border-neon-purple/20 bg-neon-purple/5";
      case "cyan":
        return "text-neon-cyan border-neon-cyan/20 bg-neon-cyan/5";
      case "solar":
        return "text-neon-gold border-neon-gold/20 bg-neon-gold/5";
    }
  };

  return (
    <header className="w-full border-b border-white/5 py-4 px-6 md:px-12 backdrop-blur-md bg-black/40 sticky top-0 z-50 flex flex-col md:flex-row items-center justify-between gap-4">
      {/* Brand Logo and Versioning */}
      <div className="flex items-center gap-4">
        <div className="relative group">
          <div className={`absolute -inset-1 rounded-lg blur opacity-75 group-hover:opacity-100 transition duration-1000 group-hover:duration-200 ${
            activeTheme === "prime" 
              ? "bg-gradient-to-r from-[#bd00ff] to-[#7a00ff]" 
              : activeTheme === "cyan" 
              ? "bg-gradient-to-r from-cyan-400 to-blue-500" 
              : "bg-gradient-to-r from-amber-400 to-orange-500"
          }`} />
          <div className="relative px-4 py-1.5 bg-black rounded-lg leading-none border border-white/10 flex items-center justify-center">
            <span className="font-display font-semibold tracking-wider text-white text-lg">ÆTHERIS</span>
          </div>
        </div>
        <div className="hidden lg:flex flex-col text-left">
          <span className="font-mono text-[9px] text-gray-500 tracking-widest uppercase">SYS_LOG VERSION 4.2.0-C</span>
          <span className="font-mono text-[9px] text-emerald-400/80 tracking-widest uppercase">COGNITIVE_NODE_ONLINE</span>
        </div>
      </div>

      {/* Mid Status Controls - AI Model Selection */}
      <div className="flex items-center gap-2 bg-neutral-900/60 p-1 border border-white/5 rounded-xl">
        <button
          onClick={() => setTheme("prime")}
          className={`px-3 py-1.5 text-xs font-display tracking-wide rounded-lg transition-all duration-300 ${
            activeTheme === "prime"
              ? "bg-purple-950/40 text-purple-300 border border-purple-500/30 shadow-[0_0_10px_rgba(189,0,255,0.15)]"
              : "text-gray-400 hover:text-white border border-transparent"
          }`}
        >
          Prime_Core
        </button>
        <button
          onClick={() => setTheme("cyan")}
          className={`px-3 py-1.5 text-xs font-display tracking-wide rounded-lg transition-all duration-300 ${
            activeTheme === "cyan"
              ? "bg-cyan-950/40 text-cyan-300 border border-cyan-500/30 shadow-[0_0_10px_rgba(0,221,255,0.15)]"
              : "text-gray-400 hover:text-white border border-transparent"
          }`}
        >
          Cyan_Synthesizer
        </button>
        <button
          onClick={() => setTheme("solar")}
          className={`px-3 py-1.5 text-xs font-display tracking-wide rounded-lg transition-all duration-300 ${
            activeTheme === "solar"
              ? "bg-orange-950/40 text-amber-300 border border-amber-500/30 shadow-[0_0_10px_rgba(255,170,68,0.15)]"
              : "text-gray-400 hover:text-white border border-transparent"
          }`}
        >
          Solar_Amber
        </button>
      </div>

      {/* System Status Indicators & Clock */}
      <div className="flex items-center gap-5">
        {/* Real-time pulse clock */}
        <div className="flex items-center gap-3">
          <div className="flex flex-col text-right">
            <span className="font-mono text-[10px] text-gray-500 uppercase tracking-widest">CLOCK_MEMBER // SYSTEM_TIME</span>
            <span className="font-mono text-sm tracking-widest text-[#f3f4f6] font-medium">{time || "14:46:17"}</span>
          </div>
          <span className="relative flex h-2 w-2">
            <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${
              activeTheme === "prime" ? "bg-purple-400" : activeTheme === "cyan" ? "bg-cyan-400" : "bg-amber-400"
            }`}></span>
            <span className={`relative inline-flex rounded-full h-2 w-2 ${
              activeTheme === "prime" ? "bg-purple-500" : activeTheme === "cyan" ? "bg-cyan-500" : "bg-amber-500"
            }`}></span>
          </span>
        </div>

        {/* Global Connection node indicator */}
        <div className={`hidden md:flex items-center gap-2 px-3 py-1 border rounded-lg ${getThemeColor(activeTheme)}`}>
          <Cpu className="w-3.5 h-3.5" />
          <span className="font-mono text-[10px] tracking-wider font-medium">99.8% NODAL</span>
        </div>
      </div>
    </header>
  );
}
