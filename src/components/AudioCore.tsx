/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useEffect, useRef, useState } from "react";
import { Mic, MicOff, Volume2 } from "lucide-react";
import { ThemeType } from "../types";

interface AudioCoreProps {
  theme: ThemeType;
}

export function AudioCore({ theme }: AudioCoreProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isListening, setIsListening] = useState(false);
  const [hzFeedback, setHzFeedback] = useState("Idle");

  const getThemeText = (t: ThemeType) => {
    switch (t) {
      case "prime": return "text-purple-400";
      case "cyan": return "text-cyan-400";
      case "solar": return "text-amber-400";
    }
  };

  const getThemeRGB = (t: ThemeType) => {
    switch (t) {
      case "prime": return "189, 0, 255";
      case "cyan": return "0, 221, 255";
      case "solar": return "255, 170, 68";
    }
  };

  // Live oscillating sine-wave sound canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let width = (canvas.width = canvas.parentElement?.clientWidth || 250);
    let height = (canvas.height = canvas.parentElement?.clientHeight || 90);

    const handleResize = () => {
      if (canvas && canvas.parentElement) {
        width = canvas.width = canvas.parentElement.clientWidth;
        height = canvas.height = canvas.parentElement.clientHeight;
      }
    };
    window.addEventListener("resize", handleResize);

    let animationID: number;
    let time = 0;

    const render = () => {
      time += 0.12;
      ctx.clearRect(0, 0, width, height);

      const colorRGB = getThemeRGB(theme);
      ctx.lineWidth = 1.5;

      // Draw 3 layers of overlapping phase-shifted sine waves
      for (let layer = 0; layer < 3; layer++) {
        ctx.beginPath();
        
        const phase = layer * Math.PI * 0.4;
        const amplitude = isListening ? (30 + Math.sin(time * 0.4) * 15) : (8 + Math.sin(time * 0.1) * 3);
        const frequency = isListening ? 0.08 : 0.04;

        // Gradient line colors
        const alpha = 0.8 - layer * 0.25;
        ctx.strokeStyle = `rgba(${colorRGB}, ${alpha})`;

        for (let x = 0; x < width; x++) {
          // Flatten out towards the borders (clamp envelope)
          const envelope = Math.sin((x / width) * Math.PI);
          const y = (height / 2) + Math.sin(x * frequency + time + phase) * amplitude * envelope;
          
          if (x === 0) {
            ctx.moveTo(x, y);
          } else {
            ctx.lineTo(x, y);
          }
        }
        ctx.stroke();
      }

      animationID = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationID);
      window.removeEventListener("resize", handleResize);
    };
  }, [theme, isListening]);

  // Handle Voice listen trigger
  const toggleListening = () => {
    if (!isListening) {
      setIsListening(true);
      setHzFeedback("44.1 kHz - ACTIVE");
    } else {
      setIsListening(false);
      setHzFeedback("SYS_IDLE");
    }
  };

  return (
    <div className="flex flex-col h-full justify-between gap-3">
      {/* Visual Indicator Title */}
      <div className="flex items-start justify-between">
        <div className="flex flex-col text-left">
          <div className="flex items-center gap-1.5 mb-1">
            <Volume2 className={`w-4 h-4 ${getThemeText(theme)}`} />
            <span className="font-mono text-[10px] uppercase text-gray-400 tracking-wider">
              SPATIAL_VOICE_CORE
            </span>
          </div>
          <span className="font-display font-light text-xl leading-none tracking-tight text-white block">
            Audio Spatializer
          </span>
        </div>

        {/* Audio mic toggle buttons */}
        <button
          onClick={toggleListening}
          className={`flex items-center justify-center p-2 rounded-lg border transition-all duration-300 ${
            isListening 
              ? "bg-emerald-950/40 border-emerald-500/30 text-emerald-300 shadow-[0_0_10px_rgba(16,185,129,0.15)]"
              : "bg-neutral-900/40 border-white/5 text-gray-400 hover:text-white hover:border-white/10"
          }`}
          title={isListening ? "Mute Microphone Simulator" : "Listen / Voice Activation"}
        >
          {isListening ? <Mic className="w-3.5 h-3.5" /> : <MicOff className="w-3.5 h-3.5" />}
        </button>
      </div>

      {/* Embedded Waveform Canvas */}
      <div className="flex-grow my-1 rounded-xl border border-white/5 bg-black/50 overflow-hidden relative min-h-[70px] flex items-center justify-center">
        <canvas ref={canvasRef} className="absolute inset-0 w-full h-full cursor-pointer z-10" onClick={toggleListening} />
        
        {/* Spatializer sound target */}
        <div className="absolute top-1 right-2 pointer-events-none z-20">
          <span className="font-mono text-[8px] text-gray-500 tracking-wider uppercase font-medium">ENVELOPE_LOCK</span>
        </div>
      </div>

      {/* Interactive Logs */}
      <div className="flex justify-between items-center text-xs border-t border-white/5 pt-2.5">
        <span className="text-gray-500 font-mono text-[9px] uppercase tracking-wider">SYS_MODULATOR</span>
        <span className={`font-mono font-medium ${isListening ? "text-emerald-400 animate-pulse" : "text-gray-300"}`}>
          {hzFeedback}
        </span>
      </div>
    </div>
  );
}
