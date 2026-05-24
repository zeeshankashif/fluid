/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect, useRef } from "react";
import { Play, RotateCcw, Terminal, Radio } from "lucide-react";
import { ThemeType } from "../types";

interface InteractiveCoreProps {
  theme: ThemeType;
  simulationSpeed: number; // Linked from Sliders console!
}

export function InteractiveCore({ theme, simulationSpeed }: InteractiveCoreProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [consoleLogs, setConsoleLogs] = useState<string[]>([
    "SYS_INIT: Bootstrapping Aetheris neural core...",
    "SYS_INIT: Binding spatial mesh index keys...",
    "CORE_STABLE // Node network: Standby.",
  ]);
  const [isSynthesizing, setIsSynthesizing] = useState(false);
  const logContainerRef = useRef<HTMLDivElement>(null);

  // Core Theme Color mapping
  const getThemeColors = (theme: ThemeType) => {
    switch (theme) {
      case "prime":
        return { primary: "#bd00ff", secondary: "#7a00ff", rgb: "189, 0, 255" };
      case "cyan":
        return { primary: "#0df", secondary: "#0066ff", rgb: "0, 221, 255" };
      case "solar":
        return { primary: "#ffaa44", secondary: "#ff5500", rgb: "255, 170, 68" };
    }
  };

  // 1. Interactive Core Vector Canvas Draw (Subtle Gravity Particle System)
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = canvas.parentElement?.clientWidth || 300);
    let height = (canvas.height = canvas.parentElement?.clientHeight || 200);

    const handleResize = () => {
      if (canvas && canvas.parentElement) {
        width = canvas.width = canvas.parentElement.clientWidth;
        height = canvas.height = canvas.parentElement.clientHeight;
      }
    };
    window.addEventListener("resize", handleResize);

    // Particle pool setup
    const numParticles = 60;
    const particles: Array<{
      x: number;
      y: number;
      radius: number;
      angle: number;
      distance: number;
      speed: number;
      pulseRate: number;
      alpha: number;
    }> = [];

    // Initialize revolving quantum entities
    for (let i = 0; i < numParticles; i++) {
      particles.push({
        x: width / 2,
        y: height / 2,
        radius: Math.random() * 2 + 1,
        angle: Math.random() * Math.PI * 2,
        distance: Math.random() * (Math.min(width, height) * 0.38) + 15,
        speed: (Math.random() * 0.015 + 0.005) * simulationSpeed,
        pulseRate: Math.random() * 0.05 + 0.02,
        alpha: Math.random() * 0.6 + 0.2,
      });
    }

    let mouseX = width / 2;
    let mouseY = height / 2;

    const handleMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      mouseX = e.clientX - rect.left;
      mouseY = e.clientY - rect.top;
    };

    canvas.addEventListener("mousemove", handleMouseMove);

    let tick = 0;
    const render = () => {
      tick++;
      ctx.clearRect(0, 0, width, height);

      // Current active color mappings
      const { primary, secondary, rgb } = getThemeColors(theme);

      // Centroid is the center of canvas gravitating slightly toward the mouse
      const targetCenterX = width / 2 + (mouseX - width / 2) * 0.25;
      const targetCenterY = height / 2 + (mouseY - height / 2) * 0.25;

      // Draw background orbits / electric meshes pathing
      ctx.strokeStyle = `rgba(${rgb}, 0.05)`;
      ctx.lineWidth = 1;
      
      ctx.beginPath();
      ctx.arc(targetCenterX, targetCenterY, Math.min(width, height) * 0.15, 0, Math.PI * 2);
      ctx.stroke();

      ctx.beginPath();
      ctx.arc(targetCenterX, targetCenterY, Math.min(width, height) * 0.3, 0, Math.PI * 2);
      ctx.stroke();

      // Core electric fluid sphere drawing
      const corePulse = Math.sin(tick * 0.04) * 12 + 45;
      const radialGradient = ctx.createRadialGradient(
        targetCenterX, targetCenterY, 1,
        targetCenterX, targetCenterY, corePulse
      );
      radialGradient.addColorStop(0, `rgba(${rgb}, 0.55)`);
      radialGradient.addColorStop(0.3, `rgba(${rgb}, 0.18)`);
      radialGradient.addColorStop(1, "rgba(0, 0, 0, 0)");
      ctx.fillStyle = radialGradient;
      ctx.beginPath();
      ctx.arc(targetCenterX, targetCenterY, corePulse, 0, Math.PI * 2);
      ctx.fill();

      // Animate and render orbiting atoms
      particles.forEach((p) => {
        // Revolving particle speeds adjusted inside Sliders configuration
        p.angle += p.speed * simulationSpeed;
        
        // Dynamic path calculations gravitating around centroid
        const cos = Math.cos(p.angle);
        const sin = Math.sin(p.angle);
        
        // Add subtle radial contraction/expansion (noise drift)
        const currentDist = p.distance + Math.sin(tick * p.pulseRate) * 5;
        
        const px = targetCenterX + cos * currentDist;
        const py = targetCenterY + sin * currentDist;

        // Draw orbital particle points
        ctx.fillStyle = `rgba(${rgb}, ${p.alpha * (0.6 + Math.sin(tick * 0.1) * 0.3)})`;
        ctx.beginPath();
        ctx.arc(px, py, p.radius, 0, Math.PI * 2);
        ctx.fill();

        // Connect orbiting nodes to the core slightly if close
        if (p.distance < 70) {
          ctx.strokeStyle = `rgba(${rgb}, 0.08)`;
          ctx.beginPath();
          ctx.moveTo(targetCenterX, targetCenterY);
          ctx.lineTo(px, py);
          ctx.stroke();
        }
      });

      // Ambient outer border pulse circle
      ctx.strokeStyle = `rgba(${rgb}, 0.15)`;
      ctx.beginPath();
      ctx.arc(targetCenterX, targetCenterY, Math.sin(tick * 0.02) * 8 + 140, 0, Math.PI * 2);
      ctx.stroke();

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener("resize", handleResize);
      if (canvas) {
        canvas.removeEventListener("mousemove", handleMouseMove);
      }
    };
  }, [theme, simulationSpeed]);

  // Scroll to bottom on console logs update
  useEffect(() => {
    if (logContainerRef.current) {
      logContainerRef.current.scrollTop = logContainerRef.current.scrollHeight;
    }
  }, [consoleLogs]);

  // Procedural futuristic prompt runner
  const triggerProceduralSynthesis = (promptKey: string) => {
    if (isSynthesizing) return;
    setIsSynthesizing(true);

    const presetPrompts: Record<string, string[]> = {
      spatial: [
        `SPATIAL: Initializing /synthesize_spatial_mesh sequence [${theme.toUpperCase()}_ENGINE]`,
        "SPATIAL: Constructing high-density 12-dimensional vector nodes...",
        "SPATIAL: Mapping spatial coordinates around mouse epicenter...",
        "SPATIAL: Superposition stabilization: verified at (99.982% index accuracy).",
        "SPATIAL: SUCCESS // Synthesized spatial matrix mesh exported payload."
      ],
      neural: [
        `NEURAL: Initializing /simulate_neural_drift calculation using active sliders`,
        `NEURAL: Adjusting neural node vectors - factor of drift applied: ${(simulationSpeed * 1.5).toFixed(2)}x`,
        "NEURAL: Stabilizing synaptic weights across Zurich & Lunar base arrays...",
        "NEURAL: Calculated cognitive drift delta = (0.00318 PPM).",
        "NEURAL: SUCCESS // Entropy distribution optimized."
      ],
      crypt: [
        "ENCRYPT: Initiating /generate_encryption_seed rotating rotation key...",
        "ENCRYPT: Entropy pools synchronized with atmospheric fluctuations...",
        "ENCRYPT: Computed secure seed: [0x4f889c22ee8a90100fe32bc87a192ba]",
        "ENCRYPT: Global cluster states: active, regional integrity nodes confirmed.",
        "ENCRYPT: SUCCESS // Dynamic ROT-256 system locked and active."
      ]
    };

    const targetLogs = presetPrompts[promptKey] || presetPrompts.spatial;
    let currentIndex = 0;

    // Simulate typing staggered logs on screen
    const interval = setInterval(() => {
      setConsoleLogs((prev) => [...prev, targetLogs[currentIndex]]);
      currentIndex++;
      if (currentIndex >= targetLogs.length) {
        clearInterval(interval);
        setIsSynthesizing(false);
      }
    }, 700);
  };

  const clearLogs = () => {
    setConsoleLogs(["SYSTEM_RESET: Consolidated console caches.", "Ready to synthesize core prompts."]);
  };

  const { primary } = getThemeColors(theme);

  return (
    <div className="flex flex-col h-full justify-between gap-4">
      {/* Upper info row */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Radio className="w-4 h-4 text-emerald-400 animate-pulse" />
          <span className="font-mono text-[10px] uppercase text-gray-400 tracking-wider">
            QUANTUM_CORE // MULTI_ENTROPY_POOL
          </span>
        </div>
        <div className="flex items-center gap-2">
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
          <span className="font-mono text-[9px] text-gray-500 uppercase tracking-widest leading-none">
            THROUGHPUT STABLE
          </span>
        </div>
      </div>

      {/* Main Core View Area with Left Canvas, Right Console logs */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-4 my-2 flex-grow min-h-[240px]">
        {/* Canvas Visualizer Area */}
        <div className="lg:col-span-3 relative rounded-xl border border-white/5 bg-black/60 overflow-hidden flex items-center justify-center min-h-[200px]">
          <canvas ref={canvasRef} className="absolute inset-0 w-full h-full cursor-crosshair z-10" />
          {/* Centered vector text */}
          <div className="absolute flex flex-col items-center justify-center pointer-events-none text-center select-none z-0">
            <span className="font-display text-[9px] tracking-[0.3em] text-gray-500 uppercase">AETHERIS ACTIVE</span>
            <span className="font-mono text-[16px] tracking-widest text-white/10 mt-1 font-semibold">Æ-CORE</span>
          </div>
        </div>

        {/* Console Logs Area */}
        <div className="lg:col-span-2 flex flex-col justify-between rounded-xl border border-white/5 bg-black/80 p-3 relative overflow-hidden">
          <div className="flex items-center border-b border-white/5 pb-2 mb-2 justify-between">
            <div className="flex items-center gap-1.5">
              <Terminal className="w-3.5 h-3.5 text-gray-500" />
              <span className="font-mono text-[9px] uppercase tracking-wider text-gray-400">TERM_OUTPUT logs</span>
            </div>
            <button 
              onClick={clearLogs}
              className="text-gray-500 hover:text-white transition"
              title="Clear Terminal"
            >
              <RotateCcw className="w-3 h-3" />
            </button>
          </div>

          {/* Terminal stream layout */}
          <div 
            ref={logContainerRef}
            className="flex-grow overflow-y-auto max-h-[160px] pr-1 space-y-1 font-mono text-[10px] text-left leading-relaxed text-gray-400 scroll-smooth"
          >
            {consoleLogs.map((log, index) => {
              const isSuccess = log.includes("SUCCESS");
              const isError = log.includes("RESET") || log.includes("SYSTEM");
              let logColor = "text-gray-400";
              if (isSuccess) logColor = "text-emerald-400 font-medium";
              if (isError) logColor = "text-purple-400";
              return (
                <div key={index} className={`border-l-2 pl-1.5 border-transparent ${logColor}`}>
                  {log}
                </div>
              );
            })}
          </div>

          {/* Indicator typing block */}
          {isSynthesizing && (
            <div className="mt-1 flex items-center gap-2">
              <span className="w-1.5 h-3 bg-cyan-400 animate-ping" />
              <span className="font-mono text-[9px] text-cyan-400 animate-pulse uppercase tracking-widest">Compiling nodal delta...</span>
            </div>
          )}
        </div>
      </div>

      {/* Prompts interactive dashboard panel */}
      <div className="border-t border-white/5 pt-3 mt-1">
        <span className="font-display text-[9px] uppercase text-gray-500 tracking-wider mb-2 block text-left">
          Trigger Quantum Prompts
        </span>
        <div className="flex flex-wrap gap-2 justify-start">
          <button
            onClick={() => triggerProceduralSynthesis("spatial")}
            disabled={isSynthesizing}
            className="group flex items-center gap-1.5 px-3 py-1.5 border border-white/5 rounded-lg text-xs font-mono text-gray-300 bg-neutral-900/60 hover:border-white/10 hover:bg-neutral-800/80 transition duration-300 disabled:opacity-40"
          >
            <Play className="w-3 h-3 text-purple-400 group-hover:scale-110 transition shrink-0" />
            /synthesize_spatial_mesh
          </button>
          <button
            onClick={() => triggerProceduralSynthesis("neural")}
            disabled={isSynthesizing}
            className="group flex items-center gap-1.5 px-3 py-1.5 border border-white/5 rounded-lg text-xs font-mono text-gray-300 bg-neutral-900/60 hover:border-white/10 hover:bg-neutral-800/80 transition duration-300 disabled:opacity-40"
          >
            <Play className="w-3 h-3 text-cyan-400 group-hover:scale-110 transition shrink-0" />
            /simulate_neural_drift
          </button>
          <button
            onClick={() => triggerProceduralSynthesis("crypt")}
            disabled={isSynthesizing}
            className="group flex items-center gap-1.5 px-3 py-1.5 border border-white/5 rounded-lg text-xs font-mono text-gray-300 bg-neutral-900/60 hover:border-white/10 hover:bg-neutral-800/80 transition duration-300 disabled:opacity-40"
          >
            <Play className="w-3 h-3 text-amber-400 group-hover:scale-110 transition shrink-0" />
            /generate_encryption_seed
          </button>
        </div>
      </div>
    </div>
  );
}
