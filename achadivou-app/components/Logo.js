"use client";
import { C } from "../lib/constants";

export default function Logo({ size = 40 }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
      <svg width={size} height={size} viewBox="0 0 100 100" style={{ flexShrink: 0 }}>
        <defs>
          <linearGradient id="bagGrad" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor={C.red} />
            <stop offset="100%" stopColor={C.redDark} />
          </linearGradient>
        </defs>
        <path d="M28 34 L72 34 L78 90 Q78 96 72 96 L28 96 Q22 96 22 90 Z" fill="url(#bagGrad)" />
        <path d="M36 34 C36 20 64 20 64 34" stroke={C.redDark} strokeWidth="6" fill="none" strokeLinecap="round" />
        <circle cx="36" cy="40" r="3.5" fill={C.redDark} />
        <circle cx="64" cy="40" r="3.5" fill={C.redDark} />
        <text x="50" y="76" textAnchor="middle" fontSize="34" fontWeight="800" fill="#e8b84b" fontFamily="Georgia, serif">$</text>
      </svg>
      <div style={{ fontWeight: 900, fontSize: size * 0.5, color: C.ink, letterSpacing: -0.5, lineHeight: 1 }}>
        Achadivou
      </div>
    </div>
  );
}
