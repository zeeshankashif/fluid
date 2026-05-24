import React, { useState, useEffect, useRef } from "react";
import { Layers, RotateCcw, Box, Compass, Sparkles } from "lucide-react";
import { ThemeType } from "../types";

interface Point3D {
  x: number;
  y: number;
  z: number;
}

interface HolographicProjectionProps {
  theme: ThemeType;
  simulationSpeed: number;
}

export function HolographicProjection({ theme, simulationSpeed }: HolographicProjectionProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [projectionMode, setProjectionMode] = useState<"tesseract" | "vortex" | "star">("tesseract");
  const [rotationAngle, setRotationAngle] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [clickCoordinates, setClickCoordinates] = useState<string>("WAITING_PROJ_ANCHOR_CLICK");

  // Geometry computation and rendering inside a canvas requestAnimationFrame
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animId: number;
    let angleX = 0;
    let angleY = 0;

    // Projection points for structures
    const points: Point3D[] = [];
    if (projectionMode === "tesseract") {
      // 3D Cube vertices
      for (let x = -1; x <= 1; x += 2) {
        for (let y = -1; y <= 1; y += 2) {
          for (let z = -1; z <= 1; z += 2) {
            points.push({ x, y, z });
          }
        }
      }
    } else if (projectionMode === "star") {
      // 3D Octahedron star vertices
      points.push({ x: 0, y: -1.5, z: 0 });
      points.push({ x: 0, y: 1.5, z: 0 });
      points.push({ x: -1, y: 0, z: -1 });
      points.push({ x: 1, y: 0, z: -1 });
      points.push({ x: 1, y: 0, z: 1 });
      points.push({ x: -1, y: 0, z: 1 });
      points.push({ x: 0, y: 0, z: 2 });
      points.push({ x: 0, y: 0, z: -2 });
    } else {
      // Vortex helix curve vertices
      for (let i = 0; i < 40; i++) {
        const theta = (i / 40) * Math.PI * 8;
        const r = 0.8 * (i / 40);
        points.push({
          x: Math.cos(theta) * r,
          y: (i / 20) - 1,
          z: Math.sin(theta) * r
        });
      }
    }

    const handleResize = () => {
      const rect = canvas.getBoundingClientRect();
      canvas.width = rect.width * window.devicePixelRatio;
      canvas.height = rect.height * window.devicePixelRatio;
      ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
    };

    handleResize();
    const resizeObserver = new ResizeObserver(() => handleResize());
    if (canvas.parentElement) {
      resizeObserver.observe(canvas.parentElement);
    }

    const draw = () => {
      const w = canvas.width / window.devicePixelRatio;
      const h = canvas.height / window.devicePixelRatio;
      const cx = w / 2;
      const cy = h / 2;
      const scale = Math.min(w, h) / 3.2;

      ctx.clearRect(0, 0, w, h);

      // Define Theme Colors based on user selection
      let strokeColor = "rgba(189, 0, 255, 0.75)";
      let nodeColor = "#bd00ff";
      let haloColor = "rgba(189, 0, 255, 0.05)";

      if (theme === "cyan") {
        strokeColor = "rgba(6, 182, 212, 0.75)";
        nodeColor = "#22d3ee";
        haloColor = "rgba(6, 182, 212, 0.05)";
      } else if (theme === "solar") {
        strokeColor = "rgba(245, 158, 11, 0.75)";
        nodeColor = "#fbbf24";
        haloColor = "rgba(245, 158, 11, 0.05)";
      }

      // Increment rotation angles linked to slider simulationSpeed state
      angleX += 0.005 * simulationSpeed;
      angleY += 0.008 * simulationSpeed;

      // Project and draw 3D structure vertices
      const projected: { x: number; y: number; z: number }[] = points.map((p) => {
        // Rotate in Y
        let x1 = p.x * Math.cos(angleY) - p.z * Math.sin(angleY);
        let z1 = p.x * Math.sin(angleY) + p.z * Math.cos(angleY);

        // Rotate in X
        let y2 = p.y * Math.cos(angleX) - z1 * Math.sin(angleX);
        let z2 = p.y * Math.sin(angleX) + z1 * Math.cos(angleX);

        // Perspective projection formula
        const distance = 3.5;
        const scaleFactor = distance / (distance + z2);
        
        return {
          x: cx + x1 * scale * scaleFactor,
          y: cy + y2 * scale * scaleFactor,
          z: z2
        };
      });

      // Draw Edges / Wireframe Lines
      ctx.strokeStyle = strokeColor;
      ctx.lineWidth = 1;

      if (projectionMode === "tesseract") {
        // Render 12 edges of simple wireframe cube
        for (let i = 0; i < 8; i++) {
          for (let j = i + 1; j < 8; j++) {
            // Check if points share 2 identical coordinates (are neighbors in grid space)
            let diffs = 0;
            if (points[i].x !== points[j].x) diffs++;
            if (points[i].y !== points[j].y) diffs++;
            if (points[i].z !== points[j].z) diffs++;
            if (diffs === 1) {
              ctx.beginPath();
              ctx.moveTo(projected[i].x, projected[i].y);
              ctx.lineTo(projected[j].x, projected[j].y);
              ctx.stroke();
            }
          }
        }
      } else if (projectionMode === "star") {
        // Octahedron wireframe connections
        for (let i = 2; i < 6; i++) {
          const next = i === 5 ? 2 : i + 1;
          // Connecting corners
          ctx.beginPath();
          ctx.moveTo(projected[i].x, projected[i].y);
          ctx.lineTo(projected[next].x, projected[next].y);
          ctx.stroke();
          
          // Connecting top peak
          ctx.beginPath();
          ctx.moveTo(projected[0].x, projected[0].y);
          ctx.lineTo(projected[i].x, projected[i].y);
          ctx.stroke();

          // Connecting bottom peak
          ctx.beginPath();
          ctx.moveTo(projected[1].x, projected[1].y);
          ctx.lineTo(projected[i].x, projected[i].y);
          ctx.stroke();
        }
      } else {
        // Helix consecutive wave connector line
        ctx.beginPath();
        for (let i = 0; i < projected.length; i++) {
          if (i === 0) ctx.moveTo(projected[i].x, projected[i].y);
          else ctx.lineTo(projected[i].x, projected[i].y);
        }
        ctx.stroke();
      }

      // Draw projected nodes
      projected.forEach((p, idx) => {
        ctx.fillStyle = nodeColor;
        ctx.beginPath();
        ctx.arc(p.x, p.y, 3, 0, Math.PI * 2);
        ctx.fill();

        // Aesthetic node aura tags
        if (idx === 0) {
          ctx.strokeStyle = nodeColor;
          ctx.beginPath();
          ctx.arc(p.x, p.y, 8, 0, Math.PI * 2);
          ctx.stroke();
        }
      });

      // Draw subtle orbital rings background
      ctx.strokeStyle = "rgba(255, 255, 255, 0.03)";
      ctx.beginPath();
      ctx.arc(cx, cy, scale * 1.1, 0, Math.PI * 2);
      ctx.stroke();

      animId = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      cancelAnimationFrame(animId);
      resizeObserver.disconnect();
    };
  }, [projectionMode, simulationSpeed, theme]);

  const handleCanvasClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const rect = canvasRef.current?.getBoundingClientRect();
    if (!rect) return;
    const clientX = e.clientX - rect.left;
    const clientY = e.clientY - rect.top;
    setClickCoordinates(`HOLO_LOCK [X:${clientX.toFixed(0)}, Y:${clientY.toFixed(0)}] SYSTEM NOMINAL`);
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

  return (
    <div className="flex flex-col h-full w-full justify-between p-1">
      {/* Title block */}
      <div className="flex justify-between items-center pb-2 border-b border-white/5">
        <div className="flex items-center gap-2">
          <Layers className={`w-4 h-4 ${getThemeText()}`} />
          <h3 className="font-mono text-xs uppercase tracking-widest font-semibold text-zinc-200">
            Holographic Projection Matrix
          </h3>
        </div>
        <div className="flex gap-1">
          <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full"></span>
          <span className="font-mono text-[9px] text-zinc-500">PROJ_STBLE</span>
        </div>
      </div>

      {/* Geometry Canvas Canvas Area */}
      <div className="relative flex-grow my-3 min-h-[140px] bg-zinc-950/45 rounded-xl border border-white/5 overflow-hidden group">
        <canvas
          ref={canvasRef}
          onClick={handleCanvasClick}
          className="w-full h-full block absolute inset-0 cursor-crosshair z-0"
        />

        {/* Floating coordinates dashboard */}
        <div className="absolute top-2 left-2 z-10 pointer-events-none p-2 bg-zinc-950/70 border border-white/5 rounded font-mono text-[8px] uppercase text-zinc-500">
          <div>PROJECTION: {projectionMode}</div>
          <div className="text-zinc-400">{clickCoordinates}</div>
        </div>

        {/* Ambient scan line pattern element */}
        <div className="absolute inset-0 bg-scanlines pointer-events-none opacity-20" />
      </div>

      {/* Modes selections chips segment */}
      <div className="flex items-center justify-between gap-3 text-[11px] font-mono border-t border-white/5 pt-2">
        <span className="text-zinc-500 uppercase">MATRIX FORMATS</span>
        <div className="flex gap-1.5 text-[9px]">
          {(["tesseract", "star", "vortex"] as const).map((mode) => (
            <button
              key={mode}
              onClick={() => setProjectionMode(mode)}
              className={`px-2 py-0.5 rounded border uppercase font-mono transition-all duration-300 ${
                projectionMode === mode
                  ? "bg-[#bd00ff]/10 text-[#bd00ff] border-[#bd00ff]/30 shadow-[#bd00ff]/10 shadow-[0_0_8px]"
                  : "bg-zinc-900 text-zinc-500 border-white/5 hover:border-white/10"
              }`}
              style={{
                color: projectionMode === mode ? (theme === "cyan" ? "#0df" : theme === "solar" ? "#f59e0b" : "#bd00ff") : "",
                borderColor: projectionMode === mode ? (theme === "cyan" ? "rgba(6,182,212,0.3)" : theme === "solar" ? "rgba(245,158,11,0.3)" : "rgba(189,0,255,0.3)") : "",
                boxShadow: projectionMode === mode ? (theme === "cyan" ? "0 0 8px rgba(6,182,212,0.15)" : theme === "solar" ? "0 0 8px rgba(245,158,11,0.15)" : "0 0 8px rgba(189,0,255,0.15)") : ""
              }}
            >
              {mode}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
