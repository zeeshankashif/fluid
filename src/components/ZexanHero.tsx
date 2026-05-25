/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { CornerDownRight, Orbit } from "lucide-react";
import { ThemeType } from "../types";

interface HeroProps {
  theme: ThemeType;
}

export function ZexanHero({ theme }: HeroProps) {
  const getThemeText = (theme: ThemeType) => {
    switch (theme) {
      case "prime":
        return "text-purple-400/90";
      case "cyan":
        return "text-cyan-400/90";
      case "solar":
        return "text-amber-400/80";
    }
  };

  const getOverlayGradient = (theme: ThemeType) => {
    switch (theme) {
      case "prime":
        return "from-purple-500/20 via-transparent to-transparent";
      case "cyan":
        return "from-cyan-500/20 via-transparent to-transparent";
      case "solar":
        return "from-amber-500/20 via-transparent to-transparent";
    }
  };

  return (
    <section className="relative pt-12 pb-16 px-6 md:px-12 max-w-7xl mx-auto flex flex-col items-center text-center overflow-hidden">
      {/* Background radial soft light gradient */}
      <div className={`absolute top-0 left-12 w-[60%] h-[300px] bg-gradient-radial ${getOverlayGradient(theme)} blur-[120px] pointer-events-none -z-10`} />

      {/* Futuristic technical tracking tag */}
      <div className="flex items-center gap-2 mb-6 border border-white/10 px-3.5 py-1 rounded-full bg-neutral-900/40 backdrop-blur-sm animate-fade-in">
        <Orbit className={`w-3.5 h-3.5 animate-spin-slow ${theme === "prime" ? "text-purple-400" : theme === "cyan" ? "text-cyan-400" : "text-amber-400"}`} />
        <span className="font-mono text-[9px] uppercase tracking-[0.2em] text-gray-300">
          SPATIAL CORE REVELATION TIMELINE // INITIALIZED
        </span>
      </div>

      {/* Headline Title pairing Archivo Black and Cinzel font */}
      <h1 className="max-w-5xl text-4xl sm:text-6xl md:text-7xl font-archivo leading-[1.15] tracking-tight text-white uppercase">
        The future of <br />
        <span className={`font-cinzel tracking-wider font-bold ${getThemeText(theme)}`}>Quantum Synthesis</span> <br />
        in a single interface
      </h1>

      {/* Description Meta Section */}
      <div className="mt-8 max-w-2xl text-center md:flex md:items-start md:gap-4 md:text-left">
        <div className="hidden md:block pt-1.5">
          <CornerDownRight className="w-5 h-5 text-gray-600" />
        </div>
        <div>
          <p className="font-sans text-base md:text-lg font-light tracking-wide text-gray-400 leading-relaxed">
            ZEXAN coordinates highly parallel micro-models, generative neural grids, and ambient entropy fields into a bespoke physical bento configuration. Hover to interact, customize node factors, and trigger cognitive core prompts.
          </p>
          <div className="mt-4 flex flex-wrap items-center gap-x-5 gap-y-2">
            <span className="font-mono text-[10px] text-gray-500 tracking-wider">
              [ STABLE THROUGHPUT: 12.8 GB/s ]
            </span>
            <span className="hidden sm:inline text-white/10">•</span>
            <span className="font-mono text-[10px] text-gray-500 tracking-wider">
              [ ACTIVE NODE_COUNT: 4,096 CORES ]
            </span>
            <span className="hidden sm:inline text-white/10">•</span>
            <span className="font-mono text-[10px] text-gray-500 tracking-wider">
              [ COMPRESSION RATIO: 1:1,024 ]
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
