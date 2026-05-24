/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from "react";
import { Activity, Flame, ZoomIn } from "lucide-react";
import { ThemeType } from "../types";

interface PerformanceChartProps {
  theme: ThemeType;
}

export function PerformanceChart({ theme }: PerformanceChartProps) {
  // Real-time tracking data points
  const [data, setData] = useState<number[]>([42, 58, 48, 64, 52, 70, 60, 78, 65, 84, 76, 92]);
  const [hoverIndex, setHoverIndex] = useState<number | null>(null);

  // Dynamic system fluctuate update loop
  useEffect(() => {
    const timer = setInterval(() => {
      setData((prev) => {
        const nextPoints = [...prev.slice(1)];
        // Fluctuating values bounded on standard ranges
        const lastVal = prev[prev.length - 1];
        const delta = Math.floor(Math.random() * 25) - 12;
        const newVal = Math.min(98, Math.max(20, lastVal + delta));
        nextPoints.push(newVal);
        return nextPoints;
      });
    }, 1200);

    return () => clearInterval(timer);
  }, []);

  const getThemeText = (t: ThemeType) => {
    switch (t) {
      case "prime": return "text-[#bd00ff]";
      case "cyan": return "text-[#0df]";
      case "solar": return "text-[#ffaa44]";
    }
  };

  const getThemeRGB = (t: ThemeType) => {
    switch (t) {
      case "prime": return "189, 0, 255";
      case "cyan": return "0, 221, 255";
      case "solar": return "255, 170, 68";
    }
  };

  // Generate SVG path coordinates based on state data and box dimensions
  const width = 500;
  const height = 120;
  const paddingX = 15;
  const paddingY = 15;

  const getCoordinates = () => {
    const numPoints = data.length;
    const innerW = width - paddingX * 2;
    const innerH = height - paddingY * 2;
    
    return data.map((val, idx) => {
      const x = paddingX + (idx / (numPoints - 1)) * innerW;
      // Invert Y coordinate since 0 is top
      const y = height - paddingY - (val / 100) * innerH;
      return { x, y, value: val };
    });
  };

  const coords = getCoordinates();

  // Create smooth cubic or straight SVG d attribute path line
  const dPath = coords.reduce((acc, point, idx) => {
    if (idx === 0) return `M ${point.x} ${point.y}`;
    return `${acc} L ${point.x} ${point.y}`;
  }, "");

  // Area under path path for glowing background block gradient fill
  const dArea = `${dPath} L ${coords[coords.length - 1].x} ${height - paddingY} L ${coords[0].x} ${height - paddingY} Z`;

  const themeRGB = getThemeRGB(theme);

  return (
    <div className="flex flex-col h-full justify-between gap-4">
      {/* Chart Headers and Status */}
      <div className="flex items-center justify-between">
        <div className="flex flex-col text-left">
          <div className="flex items-center gap-1.5 mb-1 animate-pulse">
            <Activity className={`w-4 h-4 ${getThemeText(theme)}`} />
            <span className="font-mono text-[10px] uppercase text-gray-400 tracking-wider">
              REALTIME_SYSTEM_LATENCY_STREAM
            </span>
          </div>
          <span className="font-display font-light text-xl leading-none tracking-tight text-white block">
            Nodal Latency (ms)
          </span>
        </div>

        {/* Floating peak latency stats */}
        <div className="flex items-center gap-4 bg-white/5 border border-white/5 px-2.5 py-1 rounded-lg">
          <div className="flex flex-col text-right">
            <span className="font-mono text-[8px] text-gray-500 uppercase tracking-widest leading-none mb-1">
              PEAK STATE
            </span>
            <span className={`font-mono text-xs font-semibold ${getThemeText(theme)} flex items-center gap-1`}>
              <Flame className="w-3 h-3 text-orange-500" />
              {Math.max(...data)} ms
            </span>
          </div>
        </div>
      </div>

      {/* SVG Canvas Chart Drawing Block */}
      <div className="flex-grow my-1 rounded-xl border border-white/5 bg-black/60 overflow-hidden relative flex items-center justify-center py-2">
        <svg 
          viewBox={`0 0 ${width} ${height}`} 
          className="w-full h-full select-none"
          onMouseLeave={() => setHoverIndex(null)}
        >
          {/* Subtle Grid Lines backgrounds */}
          {[20, 50, 80].map((gridVal, gIdx) => {
            const hLineY = height - paddingY - (gridVal / 100) * (height - paddingY * 2);
            return (
              <line
                key={gIdx}
                x1={paddingX}
                y1={hLineY}
                x2={width - paddingX}
                y2={hLineY}
                stroke="rgba(255, 255, 255, 0.03)"
                strokeDasharray="4 4"
                strokeWidth={1}
              />
            );
          })}

          {/* Glowing Area Fill */}
          <path d={dArea} fill={`url(#chart-glow-gradient-${theme})`} opacity={0.12} />

          {/* Stroke Line */}
          <path
            d={dPath}
            fill="none"
            stroke={`rgb(${themeRGB})`}
            strokeWidth={1.8}
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {/* Points circles */}
          {coords.map((point, idx) => {
            const isHovered = hoverIndex === idx;
            return (
              <g key={idx}>
                {/* Micro interactivity trigger area */}
                <rect
                  x={point.x - (width / data.length) / 2}
                  y={0}
                  width={width / data.length}
                  height={height}
                  fill="transparent"
                  className="cursor-crosshair"
                  onMouseEnter={() => setHoverIndex(idx)}
                />
                
                {/* Glowing highlighted pulse */}
                {isHovered && (
                  <>
                    <line
                      x1={point.x}
                      y1={paddingY}
                      x2={point.x}
                      y2={height - paddingY}
                      stroke={`rgba(${themeRGB}, 0.2)`}
                      strokeWidth={1}
                    />
                    <circle
                      cx={point.x}
                      cy={point.y}
                      r={6}
                      fill={`rgba(${themeRGB}, 0.2)`}
                      className="animate-ping"
                    />
                  </>
                )}
                
                {/* Core dot point */}
                <circle
                  cx={point.x}
                  cy={point.y}
                  r={isHovered ? 4.5 : 2}
                  fill={isHovered ? `rgb(${themeRGB})` : "rgba(255, 255, 255, 0.3)"}
                  stroke={isHovered ? "#fff" : "none"}
                  strokeWidth={isHovered ? 1 : 0}
                  className="transition-all duration-300 pointer-events-none"
                />
              </g>
            );
          })}

          {/* Gradient Definitions */}
          <defs>
            <linearGradient id={`chart-glow-gradient-${theme}`} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={`rgb(${themeRGB})`} />
              <stop offset="100%" stopColor={`rgb(${themeRGB})`} stopOpacity="0" />
            </linearGradient>
          </defs>
        </svg>

        {/* Live floating HUD coordinate readout info */}
        {hoverIndex !== null && coords[hoverIndex] && (
          <div className="absolute top-2 left-3 bg-black/80 border border-white/5 rounded px-2 py-1 pointer-events-none z-20 flex gap-2">
            <span className="font-mono text-[8px] text-gray-500 uppercase">SYS_INDEX: {hoverIndex}</span>
            <span className={`font-mono text-[8px] ${getThemeText(theme)} font-semibold uppercase`}>LATENCY: {coords[hoverIndex].value}ms</span>
          </div>
        )}
      </div>

      {/* Numerical logs footer */}
      <div className="flex justify-between items-center text-xs border-t border-white/5 pt-2.5">
        <span className="text-gray-500 font-mono text-[9px] uppercase tracking-wider">THROUGHPUT_EFFICIENCY</span>
        <span className="font-mono font-medium text-emerald-400">99.987% UPTIME</span>
      </div>
    </div>
  );
}
