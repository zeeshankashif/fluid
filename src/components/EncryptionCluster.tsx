/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from "react";
import { KeyRound, ShieldAlert, Lock, Unlock } from "lucide-react";
import { ThemeType } from "../types";

interface EncryptionClusterProps {
  theme: ThemeType;
}

export function EncryptionCluster({ theme }: EncryptionClusterProps) {
  const [locked, setLocked] = useState(true);
  const [keyCode, setKeyCode] = useState("0x8F99...A7B2");
  const [hashes, setHashes] = useState<string[]>([
    "ROT-256: 0x8a992e1f",
    "AES-GCM: 0x228fbbcc",
    "SHA-512: 0xf92a801b",
  ]);

  useEffect(() => {
    // Dynamically roll hash lists mimicking dynamic decryption sequences
    const timer = setInterval(() => {
      const hex = "0123456789ABCDEF";
      let randomVal = "0x";
      for (let i = 0; i < 8; i++) {
        randomVal += hex[Math.floor(Math.random() * 16)];
      }

      const types = ["ROT-256", "AES-GCM", "SHA-512", "CHACHA20"];
      const chosenType = types[Math.floor(Math.random() * types.length)];
      const line = `${chosenType}: ${randomVal.toLowerCase()}`;

      setHashes((prev) => [line, ...prev.slice(0, 2)]);
      
      if (!locked) {
        // Roll core code if unlocked
        let rolledCode = "0x";
        for (let i = 0; i < 4; i++) rolledCode += hex[Math.floor(Math.random() * 16)];
        rolledCode += "...";
        for (let i = 0; i < 4; i++) rolledCode += hex[Math.floor(Math.random() * 16)];
        setKeyCode(rolledCode);
      }
    }, 1500);

    return () => clearInterval(timer);
  }, [locked]);

  const handleToggleLock = () => {
    setLocked((prev) => !prev);
    if (locked) {
      setKeyCode("0x2BEA...109C");
    } else {
      setKeyCode("LOCKED_SHIELD");
    }
  };

  const getThemeText = (t: ThemeType) => {
    switch (t) {
      case "prime": return "text-[#bd00ff]";
      case "cyan": return "text-cyan-400";
      case "solar": return "text-amber-400";
    }
  };

  return (
    <div className="flex flex-col h-full justify-between gap-3">
      {/* Title */}
      <div className="flex items-start justify-between flex-col">
        <div className="flex items-center gap-1.5 mb-1">
          <KeyRound className={`w-4 h-4 ${getThemeText(theme)}`} />
          <span className="font-mono text-[10px] uppercase text-gray-400 tracking-wider">
            QUANTUM_SECURITY_CRYPT
          </span>
        </div>
        <span className="font-display font-light text-xl leading-none tracking-tight text-white block">
          Key Rotation
        </span>
      </div>

      {/* Cyber Security visual box */}
      <div className="flex-grow my-1 rounded-xl border border-white/5 bg-black/50 p-3 flex flex-col justify-between overflow-hidden relative min-h-[90px]">
        {/* Toggle Lock Button Interface */}
        <div className="flex items-center justify-between mb-2 z-10">
          <button
            onClick={handleToggleLock}
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded text-[10px] font-mono tracking-wider border transition ${
              locked
                ? "bg-purple-950/30 border-purple-500/20 text-purple-300 hover:bg-purple-900/40"
                : "bg-emerald-950/30 border-emerald-500/20 text-emerald-300 hover:bg-emerald-900/40"
            }`}
          >
            {locked ? (
              <>
                <Lock className="w-3 h-3 text-purple-400" />
                SYSTEM_SECURED
              </>
            ) : (
              <>
                <Unlock className="w-3 h-3 text-emerald-400 animate-pulse" />
                KEY_DECRYPTED
              </>
            )}
          </button>
          
          <span className="font-mono text-[9px] text-gray-500 uppercase">{keyCode}</span>
        </div>

        {/* Rolling Monospace Hash Stream */}
        <div className="space-y-1 mt-1 z-10 text-left font-mono text-[9px] text-slate-500">
          {hashes.map((h, hIdx) => (
            <div key={hIdx} className="flex justify-between border-l border-white/5 pl-1.5 py-0.5">
              <span>{h}</span>
              <span className="text-gray-600 font-normal">OK</span>
            </div>
          ))}
        </div>
      </div>

      {/* Footer System Integrity Status */}
      <div className="flex justify-between items-center text-xs border-t border-white/5 pt-2.5">
        <span className="text-gray-500 font-mono text-[9px] uppercase tracking-wider">ENCRYPTION_RIGIDITY</span>
        <span className="font-mono text-[10px] text-gray-300 uppercase">SHA_256_ACTIVE</span>
      </div>
    </div>
  );
}
