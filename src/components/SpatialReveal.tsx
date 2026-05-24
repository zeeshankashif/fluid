/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useRef, useState } from "react";
import gsap from "gsap";
import { Sparkles, Eye } from "lucide-react";
import { ThemeType } from "../types";

interface SpatialRevealProps {
  theme: ThemeType;
}

export function SpatialReveal({ theme }: SpatialRevealProps) {
  const [revealActive, setRevealActive] = useState(false);
  const maskRef = useRef<HTMLDivElement>(null);
  const imgRef = useRef<HTMLImageElement>(null);

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

  // Mouse hover triggers GSAP mask translation
  const handleMouseEnter = () => {
    setRevealActive(true);
    if (maskRef.current && imgRef.current) {
      // Create sliding reveal vector
      gsap.to(maskRef.current, {
        clipPath: "polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)",
        duration: 0.65,
        ease: "power3.out",
        overwrite: "auto",
      });
      gsap.to(imgRef.current, {
        scale: 1.05,
        duration: 0.8,
        ease: "power2.out",
        overwrite: "auto",
      });
    }
  };

  const handleMouseLeave = () => {
    setRevealActive(false);
    if (maskRef.current && imgRef.current) {
      // Re-apply original diagonal mask
      gsap.to(maskRef.current, {
        clipPath: "polygon(0% 0%, 55% 0%, 45% 100%, 0% 100%)",
        duration: 0.8,
        ease: "power3.out",
        overwrite: "auto",
      });
      gsap.to(imgRef.current, {
        scale: 1.0,
        duration: 0.8,
        ease: "power2.out",
        overwrite: "auto",
      });
    }
  };

  const themeRGB = getThemeRGB(theme);

  return (
    <div 
      className="flex flex-col h-full justify-between gap-3 select-none group"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {/* Title */}
      <div className="flex items-center justify-between">
        <div className="flex flex-col text-left">
          <div className="flex items-center gap-1.5 mb-1">
            <Sparkles className={`w-4 h-4 ${getThemeText(theme)}`} />
            <span className="font-mono text-[10px] uppercase text-gray-400 tracking-wider">
              SPATIAL_AESTHETIC_REVEAL
            </span>
          </div>
          <span className="font-display font-light text-xl leading-none tracking-tight text-white block">
            Holographic Diagnostics
          </span>
        </div>
        
        {/* State Tag */}
        <div className="flex items-center gap-1 bg-white/5 px-2 py-0.5 rounded border border-white/5 font-mono text-[8px] text-gray-400">
          <Eye className="w-3 h-3 text-gray-500" />
          <span>{revealActive ? "MASK_UNLOCKED" : "HOVER_TO_REVEAL"}</span>
        </div>
      </div>

      {/* Frame holding the reveal logic */}
      <div className="flex-grow my-1 rounded-xl border border-white/5 bg-neutral-950 overflow-hidden relative min-h-[140px]">
        {/* Layer 1: Underneath metadata matrix (visible under mask shift) */}
        <div className="absolute inset-0 p-4 flex flex-col justify-between text-left font-mono text-[9px] text-zinc-500 bg-neutral-950">
          <div className="flex justify-between border-b border-white/5 pb-1">
            <span>[ STABILITY_VECTORS ]</span>
            <span className={`${getThemeText(theme)} font-semibold`}>PASS</span>
          </div>
          <div className="space-y-1.5 my-auto py-2">
            <div>NODE_X: 0x4FF89A88</div>
            <div>NODE_Y: 0x33CA1192</div>
            <div>DRIFT_INTEG: 1.0000e-12</div>
            <div>SYNTH_SCALE: STRETCH</div>
          </div>
          <div className="flex justify-between border-t border-white/5 pt-1 text-[8px]">
            <span>COGNITIVE MATRIX REVEALED</span>
            <span>Æ-V_4.2</span>
          </div>
        </div>

        {/* Layer 2: Masked Image containing custom generative content */}
        <div 
          ref={maskRef}
          className="absolute inset-0 h-full w-full pointer-events-none transition-all duration-300 overflow-hidden z-20"
          style={{ clipPath: "polygon(0% 0%, 55% 0%, 45% 100%, 0% 100%)" }}
        >
          <img 
            ref={imgRef}
            src="/src/assets/images/neural_spatial_mesh_1779547886110.png"
            alt="Futuristic Holographic Spatial Wireframe"
            className="w-full h-full object-cover select-none"
            referrerPolicy="no-referrer"
          />
          {/* Cover gradient shadow on imagery */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent pointer-events-none" />
        </div>

        {/* Floating geometric lines indicating splitting bound */}
        {!revealActive && (
          <div 
            className="absolute top-0 bottom-0 w-[1px] bg-white/20 shadow-[0_0_10px_white] pointer-events-none z-30 transition-all duration-300"
            style={{ left: "50%", transform: "translateX(-50%) rotate(-5deg)" }}
          />
        )}
      </div>

      {/* Footer statistics */}
      <div className="flex justify-between items-center text-xs border-t border-white/5 pt-2.5">
        <span className="text-gray-500 font-mono text-[9px] uppercase tracking-wider">AURA_REVEAL_VECTOR</span>
        <span className="font-mono text-gray-300">SPLIT // COMBINED</span>
      </div>
    </div>
  );
}
