"use client";
import { Star, Image as ImageIcon, Tag, ExternalLink } from "lucide-react";
import { C, brl } from "../lib/constants";
import StoreTag from "./StoreTag";

export default function OfferCard({ offer, onOpen }) {
  const discount = offer.originalPrice > offer.price
    ? Math.round(100 - (offer.price / offer.originalPrice) * 100) : 0;

  return (
    <div style={{
      background: C.card, borderRadius: 14, border: `1px solid ${C.line}`,
      overflow: "hidden", display: "flex", flexDirection: "column",
      boxShadow: "0 1px 2px rgba(20,20,30,0.04)",
    }}>
      <div style={{ position: "relative", aspectRatio: "1/1", background: "#f0f1f4", display: "flex", alignItems: "center", justifyContent: "center" }}>
        {offer.image
          ? <img src={offer.image} alt={offer.title} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
          : <ImageIcon size={40} color="#c3c5cc" />}
        <div style={{ position: "absolute", top: 8, left: 8 }}><StoreTag store={offer.store} /></div>
        {discount > 0 && (
          <div style={{ position: "absolute", top: 8, right: 8, background: C.red, color: "#fff", fontSize: 11, fontWeight: 800, padding: "3px 8px", borderRadius: 8 }}>
            -{discount}%
          </div>
        )}
        {offer.featured && (
          <div style={{ position: "absolute", bottom: 8, left: 8, background: "#e8b84b", color: "#3a2a00", fontSize: 10, fontWeight: 800, padding: "3px 8px", borderRadius: 8, display: "flex", alignItems: "center", gap: 4 }}>
            <Star size={11} fill="#3a2a00" /> DESTAQUE
          </div>
        )}
      </div>
      <div style={{ padding: "12px 14px 14px", display: "flex", flexDirection: "column", gap: 8, flex: 1 }}>
        <div style={{ fontSize: 13.5, fontWeight: 600, color: C.ink, lineHeight: 1.3, minHeight: 34 }}>
          {offer.title}
        </div>
        <div>
          {offer.originalPrice > offer.price && (
            <div style={{ fontSize: 12, color: C.sub, textDecoration: "line-through" }}>De {brl(offer.originalPrice)}</div>
          )}
          <div style={{ fontSize: 20, fontWeight: 900, color: C.red }}>{brl(offer.price)}</div>
        </div>
        {offer.coupon && (
          <div style={{ fontSize: 11.5, fontWeight: 700, color: C.greenDark, background: "#e6f8ec", border: `1px dashed ${C.green}`, borderRadius: 8, padding: "4px 8px", display: "inline-flex", gap: 6, alignItems: "center", width: "fit-content" }}>
            <Tag size={12} /> CUPOM: {offer.coupon}
          </div>
        )}
        <button
          onClick={() => onOpen(offer)}
          style={{
            marginTop: "auto", background: C.green, color: "#fff", border: "none",
            padding: "10px 12px", borderRadius: 10, fontWeight: 800, fontSize: 13,
            cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 6,
          }}
        >
          Pegar Promoção <ExternalLink size={14} />
        </button>
      </div>
    </div>
  );
}
