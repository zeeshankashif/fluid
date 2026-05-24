/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from "react";
import { Globe, RefreshCw } from "lucide-react";
import { ThemeType, ClusterStatus } from "../types";

interface LatencyMatrixProps {
  theme: ThemeType;
}

export function LatencyMatrix({ theme }: LatencyMatrixProps) {
  const [clusters, setClusters] = useState<ClusterStatus[]>([
    { name: "Zurich Core", region: "Europe-West", latency: 12, load: 42, status: "nominal" },
    { name: "Tokyo Nexus", region: "Asia-East", latency: 45, load: 68, status: "active" },
    { name: "Lunar Array", region: "Orbital-Echo", latency: 1240, load: 8, status: "standby" },
  ]);
  const [refreshing, setRefreshing] = useState(false);

  // Fluctuating latency values to represent live tracking
  useEffect(() => {
    const timer = setInterval(() => {
      setClusters((prev) =>
        prev.map((cluster) => {
          // Zurich fluctuations
          if (cluster.name === "Zurich Core") {
            const lDelta = Math.floor(Math.random() * 5) - 2;
            const newL = Math.max(8, Math.min(22, cluster.latency + lDelta));
            const newLd = Math.max(10, Math.min(95, cluster.load + Math.floor(Math.random() * 5) - 2));
            return { ...cluster, latency: newL, load: newLd };
          }
          // Tokyo fluctuations
          if (cluster.name === "Tokyo Nexus") {
            const lDelta = Math.floor(Math.random() * 9) - 4;
            const newL = Math.max(38, Math.min(59, cluster.latency + lDelta));
            const newLd = Math.max(10, Math.min(95, cluster.load + Math.floor(Math.random() * 7) - 3));
            return { ...cluster, latency: newL, load: newLd };
          }
          // Lunar array fluctuations (ping times to space have higher volatility)
          const lDelta = Math.floor(Math.random() * 50) - 25;
          const newL = Math.max(1180, Math.min(1310, cluster.latency + lDelta));
          const newLd = Math.max(2, Math.min(25, cluster.load + Math.floor(Math.random() * 3) - 1));
          return { ...cluster, latency: newL, load: newLd };
        })
      );
    }, 1300);

    return () => clearInterval(timer);
  }, []);

  const triggerManualDiagnostics = () => {
    if (refreshing) return;
    setRefreshing(true);
    setTimeout(() => {
      setRefreshing(false);
    }, 800);
  };

  const getThemeText = (t: ThemeType) => {
    switch (t) {
      case "prime": return "text-[#bd00ff]";
      case "cyan": return "text-cyan-400";
      case "solar": return "text-amber-400";
    }
  };

  const getPulseColor = (status: "nominal" | "active" | "standby") => {
    switch (status) {
      case "nominal": return "bg-emerald-400";
      case "active": return "bg-sky-400";
      case "standby": return "bg-purple-400 animate-pulse";
    }
  };

  return (
    <div className="flex flex-col h-full justify-between gap-3">
      {/* Title */}
      <div className="flex items-start justify-between flex-col">
        <div className="flex items-center gap-1.5 mb-1">
          <Globe className={`w-4 h-4 ${getThemeText(theme)}`} />
          <span className="font-mono text-[10px] uppercase text-gray-400 tracking-wider">
            GLOBAL_LATENCY_MATRIX
          </span>
        </div>
        <span className="font-display font-light text-xl leading-none tracking-tight text-white block">
          Cluster Nodes
        </span>
      </div>

      {/* Connection matrix block */}
      <div className="flex-grow my-1 rounded-xl border border-white/5 bg-black/50 p-3.5 space-y-3 flex flex-col justify-center min-h-[140px]">
        {clusters.map((cluster, idx) => (
          <div key={idx} className="flex justify-between items-center group/item hover:bg-white/2">
            {/* Left label & pulse */}
            <div className="flex items-center gap-2 text-left">
              <span className={`h-2 w-2 rounded-full ${getPulseColor(cluster.status)}`} />
              <div className="flex flex-col">
                <span className="font-sans text-[11.5px] font-medium text-white leading-tight">
                  {cluster.name}
                </span>
                <span className="font-mono text-[8px] text-gray-500 uppercase tracking-widest">
                  {cluster.region}
                </span>
              </div>
            </div>

            {/* Right latency and load figures */}
            <div className="text-right flex flex-col justify-center items-end">
              <span className="font-mono text-xs font-semibold text-gray-200">
                {cluster.latency >= 1000 ? `${(cluster.latency / 1000).toFixed(2)}s` : `${cluster.latency}ms`}
              </span>
              <div className="w-16 bg-neutral-900 border border-white/5 h-1.5 rounded-full overflow-hidden mt-1">
                <div 
                  className={`h-full rounded-full transition-all duration-1000 ${
                    cluster.load > 70 ? "bg-red-500" : cluster.load > 40 ? "bg-amber-400" : "bg-emerald-400"
                  }`}
                  style={{ width: `${cluster.load}%` }}
                />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Manual refresh action */}
      <div className="flex justify-between items-center text-xs border-t border-white/5 pt-2.5">
        <span className="text-gray-500 font-mono text-[9px] uppercase tracking-wider">NODAL_CALCULATOR</span>
        <button 
          onClick={triggerManualDiagnostics}
          className="flex items-center gap-1 font-mono text-[9px] text-gray-400 hover:text-white uppercase tracking-wider transition"
        >
          <RefreshCw className={`w-2.5 h-2.5 ${refreshing ? "animate-spin" : ""}`} />
          Run diagnostic
        </button>
      </div>
    </div>
  );
}
