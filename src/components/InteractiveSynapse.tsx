/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useEffect, useRef, useState } from "react";
import { Link2, Activity, ShieldCheck } from "lucide-react";
import { ThemeType, Node2D } from "../types";

interface InteractiveSynapseProps {
  theme: ThemeType;
  complexity: number; // Controlled by custom sliders in ControlsConsole
}

export function InteractiveSynapse({ theme, complexity }: InteractiveSynapseProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [activeSynapses, setActiveSynapses] = useState(134);
  const [synapseStrength, setSynapseStrength] = useState("0.985");

  // Determine theme visual markers
  const getThemeRGB = (t: ThemeType) => {
    switch (t) {
      case "prime": return "189, 0, 255";
      case "cyan": return "0, 221, 255";
      case "solar": return "255, 170, 68";
    }
  };

  useEffect(() => {
    // Generate static fluctuating metric numbers
    const id = setInterval(() => {
      setActiveSynapses((prev) => Math.min(250, Math.max(80, prev + Math.floor(Math.random() * 9) - 4)));
      setSynapseStrength((0.980 + Math.random() * 0.015).toFixed(4));
    }, 1500);
    return () => clearInterval(id);
  }, []);

  // 3D Magnetic Gravitational Particle Synaptic Tree
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let width = (canvas.width = canvas.parentElement?.clientWidth || 200);
    let height = (canvas.height = canvas.parentElement?.clientHeight || 400);

    const handleResize = () => {
      if (canvas && canvas.parentElement) {
        width = canvas.width = canvas.parentElement.clientWidth;
        height = canvas.height = canvas.parentElement.clientHeight;
      }
    };
    window.addEventListener("resize", handleResize);

    // Grid nodes based on active slider limits
    const numNodes = Math.floor(18 + complexity * 12);
    const nodes: Node2D[] = [];

    // Initialize nodes scattered on canvas
    for (let i = 0; i < numNodes; i++) {
      nodes.push({
        x: Math.random() * (width - 40) + 20,
        y: Math.random() * (height - 80) + 40,
        vx: Math.random() * 0.4 - 0.2,
        vy: Math.random() * 0.4 - 0.2,
        radius: Math.random() * 2.5 + 1.5,
        color: "white",
        connections: [],
      });
    }

    // Set up standard linked nodes (indices)
    for (let i = 0; i < numNodes; i++) {
      const connectionsCount = Math.floor(Math.random() * 2) + 1;
      for (let j = 0; j < connectionsCount; j++) {
        const potentialTarget = Math.floor(Math.random() * numNodes);
        if (potentialTarget !== i && !nodes[i].connections.includes(potentialTarget)) {
          nodes[i].connections.push(potentialTarget);
        }
      }
    }

    let mouseX = -1000;
    let mouseY = -1000;
    let isHovered = false;

    const handleMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      mouseX = e.clientX - rect.left;
      mouseY = e.clientY - rect.top;
      isHovered = true;
    };

    const handleMouseLeave = () => {
      isHovered = false;
    };

    canvas.addEventListener("mousemove", handleMouseMove);
    canvas.addEventListener("mouseleave", handleMouseLeave);

    let animationID: number;
    let clock = 0;

    const render = () => {
      clock++;
      ctx.clearRect(0, 0, width, height);

      const themeRGB = getThemeRGB(theme);

      // Animate and render links
      ctx.lineWidth = 1;
      nodes.forEach((node, idx) => {
        // Slow float drifting physics
        node.x += node.vx;
        node.y += node.vy;

        // Bounce off canvas margins
        if (node.x < 15 || node.x > width - 15) node.vx *= -1;
        if (node.y < 35 || node.y > height - 15) node.vy *= -1;

        // Gravitational magnetic pull toward cursor is calculated!
        if (isHovered) {
          const dx = mouseX - node.x;
          const dy = mouseY - node.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          
          if (dist < 130) {
            // Apply physical magnetic gravity pulling vectors closer
            const force = (130 - dist) / 130;
            node.x += (dx / dist) * force * 1.6;
            node.y += (dy / dist) * force * 1.6;
          }
        }

        // Connections physics rendering
        node.connections.forEach((connIdx) => {
          const target = nodes[connIdx];
          if (!target) return;

          const dx = target.x - node.x;
          const dy = target.y - node.y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          // Only draw lines if they remain in standard bounding thresholds
          if (dist < 140) {
            const alpha = (140 - dist) / 140 * 0.16;
            ctx.strokeStyle = `rgba(${themeRGB}, ${alpha})`;
            ctx.beginPath();
            ctx.moveTo(node.x, node.y);
            ctx.lineTo(target.x, target.y);
            ctx.stroke();
          }
        });

        // Draw node points
        const pulseSize = node.radius + Math.sin(clock * 0.05 + idx) * 0.8;
        const nodeAlpha = 0.35 + Math.sin(clock * 0.08 + idx) * 0.15;
        
        ctx.fillStyle = `rgba(${themeRGB}, ${nodeAlpha})`;
        ctx.beginPath();
        ctx.arc(node.x, node.y, pulseSize + 2, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = `rgba(255, 255, 255, 0.85)`;
        ctx.beginPath();
        ctx.arc(node.x, node.y, node.radius, 0, Math.PI * 2);
        ctx.fill();
      });

      // Hover aura highlight glow
      if (isHovered) {
        const ringRad = 45 + Math.sin(clock * 0.06) * 6;
        ctx.strokeStyle = `rgba(${themeRGB}, 0.1)`;
        ctx.beginPath();
        ctx.arc(mouseX, mouseY, ringRad, 0, Math.PI * 2);
        ctx.stroke();

        ctx.fillStyle = `rgba(${themeRGB}, 0.015)`;
        ctx.beginPath();
        ctx.arc(mouseX, mouseY, ringRad - 10, 0, Math.PI * 2);
        ctx.fill();
      }

      animationID = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationID);
      window.removeEventListener("resize", handleResize);
      if (canvas) {
        canvas.removeEventListener("mousemove", handleMouseMove);
        canvas.removeEventListener("mouseleave", handleMouseLeave);
      }
    };
  }, [theme, complexity]);

  return (
    <div className="flex flex-col h-full justify-between gap-4">
      {/* Visual Header */}
      <div className="flex items-start justify-between flex-col">
        <div className="flex items-center gap-1.5 mb-1">
          <Link2 className={`w-4 h-4 ${theme === "prime" ? "text-purple-400" : theme === "cyan" ? "text-cyan-400" : "text-amber-400"}`} />
          <span className="font-mono text-[10px] uppercase text-gray-400 tracking-wider">
            SYNAPTIC_GRID_MATRIX
          </span>
        </div>
        <span className="font-display font-light text-xl leading-snug tracking-tight text-white block text-left">
          Synapse Mesh
        </span>
      </div>

      {/* Embedded interactive drawing box */}
      <div className="flex-grow my-1 rounded-xl border border-white/5 bg-black/50 overflow-hidden relative min-h-[160px] flex items-center justify-center">
        <canvas ref={canvasRef} className="absolute inset-0 w-full h-full cursor-pointer z-10" />
        
        {/* Floating coordinate log overlay */}
        <div className="absolute bottom-2 left-2 z-20 pointer-events-none bg-black/70 border border-white/10 px-2 py-1 rounded text-[8px] font-mono text-left leading-none tracking-widest text-emerald-400">
          ● MAG_PULL: GRAVITY_ACTIVE
        </div>
      </div>

      {/* Numeric Fluctuations and Specs */}
      <div className="space-y-2 border-t border-white/5 pt-3">
        <div className="flex justify-between items-center text-xs">
          <span className="text-gray-500 font-mono text-[9px] uppercase tracking-wider">ACTIVE_SYNAPSES</span>
          <span className="font-mono font-medium text-gray-200">{activeSynapses} links</span>
        </div>
        <div className="flex justify-between items-center text-xs">
          <span className="text-gray-500 font-mono text-[9px] uppercase tracking-wider">INTEGRATION_STRENGTH</span>
          <span className="font-mono font-medium text-gray-200">{synapseStrength}</span>
        </div>
        <div className="flex justify-between items-center text-xs">
          <span className="text-gray-500 font-mono text-[9px] uppercase tracking-wider">REGIONAL_INTEGRITY</span>
          <div className="flex items-center gap-1">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            <span className="font-mono text-[9px] text-emerald-400 uppercase">AETHERIS_NOMINAL</span>
          </div>
        </div>
      </div>
    </div>
  );
}
