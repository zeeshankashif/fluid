/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useRef, useEffect } from "react";
import gsap from "gsap";

interface BentoCardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  className?: string;
  theme?: "prime" | "cyan" | "solar";
}

export function BentoCard({ children, className = "", theme = "prime", ...props }: BentoCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const spotlightRef = useRef<HTMLDivElement>(null);

  // Map theme values to radial glow colors
  const glowColors = {
    prime: "rgba(189, 0, 255, 0.08)",
    cyan: "rgba(0, 221, 255, 0.08)",
    solar: "rgba(255, 170, 68, 0.08)",
  };

  useEffect(() => {
    const card = cardRef.current;
    const spotlight = spotlightRef.current;
    if (!card || !spotlight) return;

    const handleMouseMove = (e: MouseEvent) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      const centerX = rect.width / 2;
      const centerY = rect.height / 2;

      // Subtle 3D tilt calculations (max 7 degrees)
      const rotateX = ((y - centerY) / centerY) * -7;
      const rotateY = ((x - centerX) / centerX) * 7;

      // Spotlight coordinates in percentages
      const spotlightX = (x / rect.width) * 100;
      const spotlightY = (y / rect.height) * 100;

      // BUTTERY SMOOTH GSAP MOUSE PARALLAX & TILT
      gsap.to(card, {
        rotateX: rotateX,
        rotateY: rotateY,
        transformPerspective: 1000,
        boxShadow: "0 20px 40px -15px rgba(0, 0, 0, 0.7), 0 0 15px rgba(255, 255, 255, 0.02)",
        borderColor: "rgba(255, 255, 255, 0.12)",
        duration: 0.35,
        ease: "power2.out",
        overwrite: "auto",
      });

      // Move ambient spotlight glare
      gsap.to(spotlight, {
        background: `radial-gradient(350px circle at ${spotlightX}% ${spotlightY}%, ${glowColors[theme]}, transparent 80%)`,
        opacity: 1,
        duration: 0.3,
        ease: "power2.out",
        overwrite: "auto",
      });
    };

    const handleMouseLeave = () => {
      // RESET POSITION GENTLY
      gsap.to(card, {
        rotateX: 0,
        rotateY: 0,
        transformPerspective: 1000,
        boxShadow: "0 20px 50px rgba(0, 0, 0, 0.5)",
        borderColor: "rgba(255, 255, 255, 0.05)",
        duration: 0.6,
        ease: "power3.out",
        overwrite: "auto",
      });

      gsap.to(spotlight, {
        background: `radial-gradient(350px circle at 50% 50%, rgba(255, 255, 255, 0.01), transparent 80%)`,
        opacity: 0.3,
        duration: 0.6,
        ease: "power3.out",
        overwrite: "auto",
      });
    };

    card.addEventListener("mousemove", handleMouseMove);
    card.addEventListener("mouseleave", handleMouseLeave);

    return () => {
      card.removeEventListener("mousemove", handleMouseMove);
      card.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, [theme]);

  return (
    <div
      ref={cardRef}
      className={`relative overflow-hidden rounded-2xl border border-luxury-border bg-luxury-card p-5 md:p-6 transition-colors duration-500 transform-gpu perspective-1000 select-none ${className}`}
      {...props}
    >
      {/* Background glow spotlight */}
      <div 
        ref={spotlightRef}
        className="spotlight absolute inset-0 pointer-events-none z-0" 
        style={{ 
          background: "radial-gradient(350px circle at 50% 50%, rgba(255, 255, 255, 0.01), transparent 80%)",
          opacity: 0.3
        }} 
      />
      
      {/* Structural Luxury Noise Overlay */}
      <div className="lux-noise" />

      {/* Grid Pattern overlay for tech aesthetics */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:16px_16px] pointer-events-none opacity-40 mix-blend-overlay" />

      {/* Content slot */}
      <div className="relative z-10 h-full w-full flex flex-col justify-between">
        {children}
      </div>
    </div>
  );
}
