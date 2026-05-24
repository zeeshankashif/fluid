import { useState, useEffect, useRef } from "react";
import { Radar, Compass, Crosshair, Lock, Maximize2 } from "lucide-react";
import { ThemeType } from "../types";

interface TargetVector {
  id: string;
  name: string;
  angle: number;
  radius: number;
  speed: number;
  locked: boolean;
  size: number;
}

interface OrbitalSensorsProps {
  theme: ThemeType;
}

export function OrbitalSensors({ theme }: OrbitalSensorsProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [activeSensors, setActiveSensors] = useState<number>(4);
  const [lockedTargets, setLockedTargets] = useState<number>(1);
  const [scannerSweepSpeed, setScannerSweepSpeed] = useState<number>(0.02);
  const [targets, setTargets] = useState<TargetVector[]>([
    { id: "A-12", name: "AETH-SIG-ALPHA", angle: 0.4, radius: 45, speed: 0.007, locked: true, size: 4 },
    { id: "B-88", name: "COGN-SIG-BETA", angle: 1.8, radius: 75, speed: -0.004, locked: false, size: 3 },
    { id: "X-09", name: "NEUR-NODE-MU", angle: 3.2, radius: 100, speed: 0.009, locked: false, size: 5 },
    { id: "S-55", name: "SOLAR-RESI-4", angle: 4.9, radius: 110, speed: -0.006, locked: false, size: 3.5 },
  ]);

  const [sweepAngle, setSweepAngle] = useState(0);

  // Animate targets and scanner sweeps inside canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animId: number;
    let localSweepAngle = 0;

    // Adapt to parent sizing
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
      const radarLimit = Math.min(w, h) / 2.3;

      ctx.clearRect(0, 0, w, h);

      // Define Theme Colors based on user selection
      let hubColor = "rgba(189, 0, 255, 0.85)";
      let meshColor = "rgba(189, 0, 255, 0.08)";
      let sweepColor = "rgba(189, 0, 255, 0.15)";
      let gridColor = "rgba(255, 255, 255, 0.04)";

      if (theme === "cyan") {
        hubColor = "rgba(6, 182, 212, 0.85)";
        meshColor = "rgba(6, 182, 212, 0.08)";
        sweepColor = "rgba(6, 182, 212, 0.15)";
      } else if (theme === "solar") {
        hubColor = "rgba(245, 158, 11, 0.85)";
        meshColor = "rgba(245, 158, 11, 0.08)";
        sweepColor = "rgba(245, 158, 11, 0.15)";
      }

      // Draw Grid Circles
      ctx.strokeStyle = gridColor;
      ctx.lineWidth = 1;
      for (let r = 30; r <= radarLimit; r += 30) {
        ctx.beginPath();
        ctx.arc(cx, cy, r, 0, Math.PI * 2);
        ctx.stroke();
      }

      // Draw Cross Lines
      ctx.beginPath();
      ctx.moveTo(cx - radarLimit, cy);
      ctx.lineTo(cx + radarLimit, cy);
      ctx.moveTo(cx, cy - radarLimit);
      ctx.lineTo(cx, cy + radarLimit);
      ctx.stroke();

      // Scanner Sweep Radar Angle Tracker
      localSweepAngle += scannerSweepSpeed;
      if (localSweepAngle >= Math.PI * 2) localSweepAngle = 0;

      // Draw Sweeping Arc Cone
      ctx.fillStyle = sweepColor;
      ctx.beginPath();
      ctx.moveTo(cx, cy);
      ctx.arc(cx, cy, radarLimit, localSweepAngle, localSweepAngle - 0.4, true);
      ctx.closePath();
      ctx.fill();

      // Draw Scanning Sweep line
      ctx.strokeStyle = hubColor;
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.moveTo(cx, cy);
      ctx.lineTo(cx + Math.cos(localSweepAngle) * radarLimit, cy + Math.sin(localSweepAngle) * radarLimit);
      ctx.stroke();

      // Draw Active Center Core Node
      ctx.fillStyle = hubColor;
      ctx.beginPath();
      ctx.arc(cx, cy, 4, 0, Math.PI * 2);
      ctx.fill();

      // Update and Draw targets
      targets.forEach((tgt) => {
        // Increment target orbital angle
        tgt.angle += tgt.speed;
        
        const tx = cx + Math.cos(tgt.angle) * (tgt.radius * (radarLimit/125));
        const ty = cy + Math.sin(tgt.angle) * (tgt.radius * (radarLimit/125));

        // Connection link to center hub if locked
        if (tgt.locked) {
          ctx.strokeStyle = hubColor.replace("0.85", "0.2");
          ctx.setLineDash([2, 3]);
          ctx.beginPath();
          ctx.moveTo(cx, cy);
          ctx.lineTo(tx, ty);
          ctx.stroke();
          ctx.setLineDash([]);
        }

        // Target marker dot
        ctx.fillStyle = tgt.locked ? hubColor : "rgba(150, 150, 150, 0.6)";
        ctx.beginPath();
        ctx.arc(tx, ty, tgt.size, 0, Math.PI * 2);
        ctx.fill();

        // Locked Bracket overlay
        if (tgt.locked) {
          ctx.strokeStyle = hubColor;
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.arc(tx, ty, tgt.size + 4, 0, Math.PI * 2);
          ctx.stroke();

          // Target callout text
          ctx.fillStyle = "#ffffff";
          ctx.font = "bold 8px monospace";
          ctx.fillText(`LOCKED [${tgt.id}]`, tx + 8, ty - 3);
          ctx.fillStyle = "rgba(255, 255, 255, 0.45)";
          ctx.fillText(`R:${Math.round(tgt.radius)} T:${Math.round(tgt.angle * 50)}`, tx + 8, ty + 6);
        } else {
          // Unlocked target identifier text
          ctx.fillStyle = "rgba(255, 255, 255, 0.35)";
          ctx.font = "7px monospace";
          ctx.fillText(tgt.id, tx + 6, ty + 2);
        }
      });

      animId = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      cancelAnimationFrame(animId);
      resizeObserver.disconnect();
    };
  }, [targets, scannerSweepSpeed, theme]);

  const toggleLock = (index: number) => {
    const updated = [...targets];
    updated[index].locked = !updated[index].locked;
    setTargets(updated);
    
    // Recalculate locks count
    const locks = updated.filter(t => t.locked).length;
    setLockedTargets(locks);
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
      {/* Dynamic Title Header */}
      <div className="flex justify-between items-center pb-2 border-b border-white/5">
        <div className="flex items-center gap-2">
          <Radar className={`w-4 h-4 ${getThemeText()}`} />
          <h3 className="font-mono text-xs uppercase tracking-widest font-semibold text-zinc-200">
            Orbital Sensor Array
          </h3>
        </div>
        <span className="font-mono text-[9px] text-zinc-500">SWEEP_RATE: {(scannerSweepSpeed * 100).toFixed(0)}HZ</span>
      </div>

      {/* Grid Interactive Visual Radar */}
      <div className="relative flex-grow my-3 min-h-[140px] bg-zinc-950/40 rounded-xl overflow-hidden border border-white/5 group">
        <canvas ref={canvasRef} className="w-full h-full block absolute inset-0 cursor-crosshair z-0" />
        
        {/* Absolute radar target indicator UI overlay */}
        <div className="absolute top-2 left-2 z-10 pointer-events-none flex flex-col gap-1 font-mono text-[7.5px] text-zinc-500 bg-zinc-950/70 p-1.5 rounded border border-white/5 uppercase">
          <div>LAT: 47.9231° N</div>
          <div>LON: 111.0028° E</div>
          <div>BEACON: {lockedTargets > 0 ? "STABLE_LOCK" : "SEARCHING"}</div>
        </div>

        <div className="absolute bottom-2 right-2 z-10 font-mono text-[7.5px] text-zinc-400 bg-zinc-950/80 px-2 py-1 rounded border border-white/5 uppercase">
          NODE MATRIX LOCKS: {lockedTargets}/4
        </div>
      </div>

      {/* Control sliders & target selectors */}
      <div className="flex flex-col gap-2">
        <div className="flex items-center justify-between text-[11px] font-mono border-t border-white/5 pt-2">
          <span className="text-zinc-500 uppercase">ACTIVE LOCK TUNERS</span>
          <div className="flex gap-1.5 text-[9px]">
            {targets.map((tgt, i) => (
              <button
                key={tgt.id}
                onClick={() => toggleLock(i)}
                className={`px-1.5 py-0.5 rounded border font-mono transition-all duration-300 ${
                  tgt.locked 
                    ? "bg-[#bd00ff]/10 text-[#bd00ff] border-[#bd00ff]/30 shadow-[#bd00ff]/10 shadow-[0_0_8px]" 
                      : "bg-zinc-900 text-zinc-500 border-white/5 hover:border-white/10"
                }`}
                style={{
                  color: tgt.locked ? (theme === "cyan" ? "#0df" : theme === "solar" ? "#f59e0b" : "#bd00ff") : "",
                  borderColor: tgt.locked ? (theme === "cyan" ? "rgba(6,182,212,0.3)" : theme === "solar" ? "rgba(245,158,11,0.3)" : "rgba(189,0,255,0.3)") : "",
                  boxShadow: tgt.locked ? (theme === "cyan" ? "0 0 8px rgba(6,182,212,0.15)" : theme === "solar" ? "0 0 8px rgba(245,158,11,0.15)" : "0 0 8px rgba(189,0,255,0.15)") : ""
                }}
              >
                {tgt.id}
              </button>
            ))}
          </div>
        </div>

        {/* Adjust Slider Sweep Speed */}
        <div className="space-y-1">
          <div className="flex justify-between text-[9px] font-mono text-zinc-500">
            <span>RADAR FREQUENCY RANGE</span>
            <span className="text-zinc-400">{(scannerSweepSpeed * 200).toFixed(0)} MHZ</span>
          </div>
          <input
            type="range"
            min="0.005"
            max="0.05"
            step="0.001"
            value={scannerSweepSpeed}
            onChange={(e) => setScannerSweepSpeed(parseFloat(e.target.value))}
            className="w-full h-1 bg-zinc-900 rounded-lg appearance-none cursor-pointer accent-[#bd00ff]"
            style={{
              accentColor: theme === "cyan" ? "#0df" : theme === "solar" ? "#f59e0b" : "#bd00ff"
            }}
          />
        </div>
      </div>
    </div>
  );
}
