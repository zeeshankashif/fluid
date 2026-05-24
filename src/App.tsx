/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from "react";
import gsap from "gsap";
import Lenis from "lenis";

// Import types
import { ThemeType } from "./types";

// Import custom high-fidelity bento widgets
import { AetherisHeader } from "./components/AetherisHeader";
import { AetherisHero } from "./components/AetherisHero";
import { BentoCard } from "./components/BentoCard";
import { InteractiveCore } from "./components/InteractiveCore";
import { InteractiveSynapse } from "./components/InteractiveSynapse";
import { ControlsConsole } from "./components/ControlsConsole";
import { AudioCore } from "./components/AudioCore";
import { PerformanceChart } from "./components/PerformanceChart";
import { EncryptionCluster } from "./components/EncryptionCluster";
import { LatencyMatrix } from "./components/LatencyMatrix";
import { SpatialReveal } from "./components/SpatialReveal";
import { SystemOracle } from "./components/SystemOracle";
import { OrbitalSensors } from "./components/OrbitalSensors";
import { NetworkIntegrity } from "./components/NetworkIntegrity";
import { HolographicProjection } from "./components/HolographicProjection";

export default function App() {
  const [theme, setTheme] = useState<ThemeType>("prime");
  
  // Custom slider values shared and passed down
  const [simulationSpeed, setSimulationSpeed] = useState(1.0);
  const [synapseComplexity, setSynapseComplexity] = useState(0.5);

  // 1. Initialize Lenis Smooth Scroll Engine
  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), 
      orientation: "vertical",
      gestureOrientation: "vertical",
      smoothWheel: true,
    });

    const raf = (time: number) => {
      lenis.raf(time);
      requestAnimationFrame(raf);
    };

    requestAnimationFrame(raf);

    return () => {
      lenis.destroy();
    };
  }, []);

  // 2. Buttery Smooth GSAP Staggered Entrance of Bento Cards
  useEffect(() => {
    const cards = document.querySelectorAll(".bento-item");
    const heroElements = document.querySelectorAll(".hero-item");

    // Create a unified master page load timeline
    const tl = gsap.timeline();

    tl.fromTo(
      heroElements,
      { opacity: 0, y: 30 },
      { opacity: 1, y: 0, duration: 1.1, stagger: 0.15, ease: "power4.out" }
    );

    tl.fromTo(
      cards,
      {
        opacity: 0,
        y: 60,
        scale: 0.95,
      },
      {
        opacity: 1,
        y: 0,
        scale: 1,
        duration: 0.9,
        stagger: 0.08,
        ease: "power3.out",
        clearProps: "transform,scale", // Crucial: releases properties so 3D mouse hover tilt works perfectly in real-time while keeping opacity: 1!
      },
      "-=0.7"
    );
  }, []);

  const getThemeAura = (t: ThemeType) => {
    switch (t) {
      case "prime":
        return "shadow-[0_0_80px_rgba(189,0,255,0.06)] border-[#bd00ff]/10";
      case "cyan":
        return "shadow-[0_0_80px_rgba(0,221,255,0.06)] border-cyan-500/10";
      case "solar":
        return "shadow-[0_0_80px_rgba(255,170,68,0.06)] border-amber-500/10";
    }
  };

  return (
    <div className={`min-h-screen bg-luxury-bg text-gray-100 flex flex-col font-sans transition-all duration-700 select-none glow-grid-ambient relative overflow-x-hidden`}>
      {/* Immersive UI Atmospheric ambient spheres */}
      <div className="absolute top-[-200px] right-[-100px] w-[500px] h-[500px] bg-cyan-500/10 rounded-full blur-[120px] pointer-events-none z-0"></div>
      <div className="absolute bottom-[-100px] left-[-100px] w-[400px] h-[400px] bg-purple-600/10 rounded-full blur-[100px] pointer-events-none z-0"></div>

      {/* 2D Cyber grid overlay on background */}
      <div className="fixed inset-0 bg-[radial-gradient(ellipse_at_top,_transparent_50%,_rgba(0,0,0,0.8)_100%)] pointer-events-none z-0" />

      {/* Header element */}
      <div className="hero-item opacity-0">
        <AetherisHeader activeTheme={theme} setTheme={setTheme} />
      </div>

      <main className="relative z-10 flex-grow py-6 pb-20">
        {/* Decorative background vectors representing premium scrollytelling feel */}
        <div className="absolute top-[280px] left-10 font-mono text-[9px] uppercase tracking-widest text-zinc-700 pointer-events-none hidden xl:block">
          COORD: [53.1118 // 8.2412] // ANGLE: 45°
        </div>
        <div className="absolute top-[280px] right-10 font-mono text-[9px] uppercase tracking-widest text-zinc-700 pointer-events-none hidden xl:block text-right">
          INTELLIGENCE_LINK: NOMINAL // MULTICAST_OK
        </div>

        {/* Hero Title & Subtext Section */}
        <div className="hero-item opacity-0">
          <AetherisHero theme={theme} />
        </div>

        {/* Dynamic Bento Box Grid Segment */}
        <div 
          className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 px-6 md:px-12 max-w-7xl mx-auto mt-6 transition-all duration-700 border rounded-3xl p-4 bg-black/10 border-white/5 ${getThemeAura(theme)}`}
        >
          {/* Bento Card 1: Core Processing Unit (Spans 2 rows, 2 columns on large screens) */}
          <BentoCard 
            theme={theme} 
            className="bento-item opacity-0 col-span-1 md:col-span-2 lg:col-span-2 lg:row-span-2 min-h-[360px]"
          >
            <InteractiveCore theme={theme} simulationSpeed={simulationSpeed} />
          </BentoCard>

          {/* Bento Card 2: Synaptic connection branches (Spans 2 rows, 1 col) */}
          <BentoCard 
            theme={theme} 
            className="bento-item opacity-0 col-span-1 lg:col-span-1 lg:row-span-2 min-h-[360px]"
          >
            <InteractiveSynapse theme={theme} complexity={synapseComplexity} />
          </BentoCard>

          {/* Bento Card 3: Controllers slider module */}
          <BentoCard 
            theme={theme} 
            className="bento-item opacity-0 col-span-1 min-h-[190px]"
          >
            <ControlsConsole 
              theme={theme} 
              speed={simulationSpeed} 
              setSpeed={setSimulationSpeed} 
              complexity={synapseComplexity} 
              setComplexity={setSynapseComplexity} 
            />
          </BentoCard>

          {/* Bento Card 4: Audio Wave spatializer */}
          <BentoCard 
            theme={theme} 
            className="bento-item opacity-0 col-span-1 min-h-[190px]"
          >
            <AudioCore theme={theme} />
          </BentoCard>

          {/* Bento Card 5: Real-time Metrics Line Chart Graph (Spans 2 columns) */}
          <BentoCard 
            theme={theme} 
            className="bento-item opacity-0 col-span-1 md:col-span-2 min-h-[200px]"
          >
            <PerformanceChart theme={theme} />
          </BentoCard>

          {/* Bento Card 6: Encrypt ROT code rotator */}
          <BentoCard 
            theme={theme} 
            className="bento-item opacity-0 col-span-1 min-h-[200px]"
          >
            <EncryptionCluster theme={theme} />
          </BentoCard>

          {/* Bento Card 7: Matrix map listings */}
          <BentoCard 
            theme={theme} 
            className="bento-item opacity-0 col-span-1 min-h-[200px]"
          >
            <LatencyMatrix theme={theme} />
          </BentoCard>

          {/* Bento Card 8: Diagonal slide split image mask reveal spacer (Spans 2 columns) */}
          <BentoCard 
            theme={theme} 
            className="bento-item opacity-0 col-span-1 md:col-span-2 min-h-[200px]"
          >
            <SpatialReveal theme={theme} />
          </BentoCard>

          {/* Bento Card 9: Orbital Sensor satellite array (Spans 1 column) */}
          <BentoCard 
            theme={theme} 
            className="bento-item opacity-0 col-span-1 min-h-[250px]"
          >
            <OrbitalSensors theme={theme} />
          </BentoCard>

          {/* Bento Card 10: Security Integrity monitor (Spans 1 column) */}
          <BentoCard 
            theme={theme} 
            className="bento-item opacity-0 col-span-1 min-h-[250px]"
          >
            <NetworkIntegrity theme={theme} />
          </BentoCard>

          {/* Bento Card 11: AI Cognitive Oracle Terminal (Spans 2 columns) */}
          <BentoCard 
            theme={theme} 
            className="bento-item opacity-0 col-span-1 md:col-span-2 min-h-[340px]"
          >
            <SystemOracle theme={theme} speed={simulationSpeed} complexity={synapseComplexity} />
          </BentoCard>

          {/* Bento Card 12: Holographic Projection Matrix (Spans 2 columns) */}
          <BentoCard 
            theme={theme} 
            className="bento-item opacity-0 col-span-1 md:col-span-2 min-h-[340px]"
          >
            <HolographicProjection theme={theme} simulationSpeed={simulationSpeed} />
          </BentoCard>
        </div>
      </main>

      {/* Footer minimal info logs */}
      <footer className="w-full border-t border-white/5 py-6 px-6 md:px-12 flex flex-col sm:flex-row items-center justify-between gap-3 text-gray-500 font-mono text-[9.5px]">
        <span>&copy; 2026 AETHERIS COGNITIVE SYSTEMS. ALL WORKSPACE SYNTHESIS RESERVED.</span>
        <div className="flex gap-4">
          <span className="hover:text-gray-300 transition cursor-pointer">[ COMPLIANCE_SECURE ]</span>
          <span className="hover:text-gray-300 transition cursor-pointer">[ PRIVACY_KEY_LOG ]</span>
          <span className="hover:text-gray-300 transition cursor-pointer">[ SYSTEM_VERIFIED ]</span>
        </div>
      </footer>
    </div>
  );
}
