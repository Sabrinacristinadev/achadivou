"use client";
import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { Search, Star, Clock, TrendingUp, Lock, MessageCircle, Lightbulb, BellRing } from "lucide-react";
import { C, CATEGORIES, STORES } from "../lib/constants";
import Logo from "../components/Logo";
import StoreTag from "../components/StoreTag";
import OfferCard from "../components/OfferCard";

export default function HomePage() {
  const [offers, setOffers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState("Destaques");
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("Todas");

  useEffect(() => {
    fetch("/api/offers")
      .then((r) => r.json())
      .then((data) => setOffers(data))
      .finally(() => setLoading(false));
  }, []);

  const openOffer = async (offer) => {
    fetch(`/api/offers/${offer.id}/click`, { method: "POST" }).catch(() => {});
    window.open(offer.link, "_blank", "noopener,noreferrer");
  };

  const visible = useMemo(() => {
    let list = offers;
    if (category !== "Todas") list = list.filter((o) => o.category === category);
    if (query.trim()) {
      const q = query.toLowerCase();
      list = list.filter((o) => o.title.toLowerCase().includes(q) || o.store.toLowerCase().includes(q));
    }
    if (tab === "Destaques") list = list.filter((o) => o.featured);
    if (tab === "Recentes") list = [...list].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    if (tab === "Menor Preço") list = [...list].sort((a, b) => a.price - b.price);
    return list;
  }, [offers, tab, query, category]);

  return (
    <div style={{ minHeight: "100vh", background: C.bg }}>
      <div style={{ background: C.green, color: "#fff", textAlign: "center", padding: "8px 12px", fontSize: 13, fontWeight: 700 }}>
        🔥 Entre no nosso grupo e receba as promoções em primeira mão —{" "}
        <span style={{ textDecoration: "underline", cursor: "pointer" }}>WhatsApp</span>{" · "}
        <span style={{ textDecoration: "underline", cursor: "pointer" }}>Telegram</span>
      </div>

      <header style={{ background: "#fff", borderBottom: `1px solid ${C.line}`, position: "sticky", top: 0, zIndex: 20 }}>
        <div style={{ maxWidth: 1180, margin: "0 auto", padding: "14px 20px", display: "flex", alignItems: "center", gap: 18, flexWrap: "wrap" }}>
          <Logo size={38} />
          <div style={{ flex: 1, minWidth: 180, position: "relative" }}>
            <Search size={16} color={C.sub} style={{ position: "absolute", left: 12, top: 11 }} />
            <input
              value={query} onChange={(e) => setQuery(e.target.value)}
              placeholder="Buscar achadinhos..."
              style={{ width: "100%", padding: "9px 12px 9px 34px", borderRadius: 24, border: `1px solid ${C.line}`, background: C.bg, fontSize: 13.5, outline: "none" }}
            />
          </div>
          <select value={category} onChange={(e) => setCategory(e.target.value)} style={{ border: "none", background: "transparent", fontWeight: 600, fontSize: 13, color: C.ink, cursor: "pointer" }}>
            <option>Todas</option>
            {CATEGORIES.map((c) => <option key={c}>{c}</option>)}
          </select>
         
        </div>
      </header>

      <div style={{ background: "#fff", borderBottom: `1px solid ${C.line}` }}>
        <div style={{ maxWidth: 1180, margin: "0 auto", padding: "12px 20px", display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 10 }}>
          <div style={{ fontSize: 14, color: C.ink }}>
            👋 Bem-vindo(a)! Encontre os melhores <b style={{ color: C.red }}>achadinhos</b> das lojas parceiras.
          </div>
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
            {STORES.map((s) => <StoreTag key={s} store={s} />)}
          </div>
        </div>
      </div>

      <div style={{ maxWidth: 1180, margin: "0 auto", padding: "22px 20px", display: "grid", gridTemplateColumns: "1fr 220px", gap: 24 }}>
        <div>
          <div style={{ display: "flex", gap: 8, marginBottom: 18, flexWrap: "wrap" }}>
            {[
              { k: "Destaques", icon: Star },
              { k: "Recentes", icon: Clock },
              { k: "Menor Preço", icon: TrendingUp },
            ].map(({ k, icon: Icon }) => (
              <button key={k} onClick={() => setTab(k)}
                style={{
                  display: "flex", alignItems: "center", gap: 6, padding: "8px 16px", borderRadius: 24,
                  border: `1px solid ${tab === k ? C.red : C.line}`,
                  background: tab === k ? C.red : "#fff", color: tab === k ? "#fff" : C.ink,
                  fontWeight: 700, fontSize: 13, cursor: "pointer",
                }}>
                <Icon size={14} /> {k}
              </button>
            ))}
          </div>

          {loading ? (
            <div style={{ padding: 40, textAlign: "center", color: C.sub }}>Carregando promoções...</div>
          ) : visible.length === 0 ? (
            <div style={{ background: "#fff", border: `1px dashed ${C.line}`, borderRadius: 14, padding: 40, textAlign: "center", color: C.sub }}>
              Nenhuma promoção encontrada por aqui ainda. Tente outra aba, categoria ou busca.
            </div>
          ) : (
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))", gap: 16 }}>
              {visible.map((o) => <OfferCard key={o.id} offer={o} onOpen={openOffer} />)}
            </div>
          )}
        </div>

        <aside>
          <div style={{ background: "#fff", border: `1px solid ${C.line}`, borderRadius: 14, padding: 16 }}>
            <div style={{ fontSize: 12, fontWeight: 800, color: C.sub, textTransform: "uppercase", marginBottom: 12 }}>Atalhos</div>
            {[
              { label: "Grupo WhatsApp", icon: MessageCircle, color: "#25d366" },
              { label: "Dicas de Economia", icon: Lightbulb, color: "#e8b84b" },
              { label: "Alertas de Preço", icon: BellRing, color: C.red },
            ].map(({ label, icon: Icon, color }) => (
              <div key={label} style={{ display: "flex", alignItems: "center", gap: 10, padding: "10px 0", borderBottom: `1px solid ${C.line}`, cursor: "pointer" }}>
                <div style={{ width: 38, height: 38, borderRadius: "50%", background: color, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                  <Icon size={18} color="#fff" />
                </div>
                <span style={{ fontSize: 13, fontWeight: 600, color: C.ink }}>{label}</span>
              </div>
            ))}
          </div>
        </aside>
      </div>

      <footer style={{ textAlign: "center", padding: "24px 12px", color: C.sub, fontSize: 12 }}>
        Achadivou — A rede social das promoções. Links de afiliado: podemos ganhar uma comissão em compras qualificadas.
      </footer>
    </div>
  );
}
