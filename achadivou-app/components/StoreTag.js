"use client";
import { STORE_COLORS } from "../lib/constants";

export default function StoreTag({ store }) {
  const color = STORE_COLORS[store] || "#555";
  const light = color === "#ffe600";
  return (
    <span style={{
      background: color, color: light ? "#232f3e" : "#fff",
      fontSize: 11, fontWeight: 700, padding: "3px 9px", borderRadius: 20,
      textTransform: "uppercase", letterSpacing: 0.3,
    }}>{store}</span>
  );
}
