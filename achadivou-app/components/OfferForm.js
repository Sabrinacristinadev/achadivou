"use client";
import { useRef, useState } from "react";
import { C, CATEGORIES, STORES } from "../lib/constants";

const lbl = { display: "block", fontSize: 12, fontWeight: 700, color: C.ink, marginBottom: 6 };
const inp = { width: "100%", padding: "9px 11px", borderRadius: 9, border: `1px solid ${C.line}`, fontSize: 13.5, outline: "none", boxSizing: "border-box" };
const btnGhost = { padding: "9px 16px", borderRadius: 9, border: `1px solid ${C.line}`, background: "#fff", fontWeight: 700, fontSize: 13, cursor: "pointer" };

export default function OfferForm({ initial, onSave, onCancel, saving }) {
  const blank = { title: "", link: "", image: "", price: "", originalPrice: "", store: STORES[0], category: CATEGORIES[0], coupon: "", featured: false, active: true };
  const [f, setF] = useState(initial ? { ...blank, ...initial } : blank);
  const [uploading, setUploading] = useState(false);
  const [err, setErr] = useState("");
  const fileRef = useRef();
  const set = (k, v) => setF((s) => ({ ...s, [k]: v }));

  const handleFile = async (file) => {
    if (!file) return;
    setUploading(true);
    setErr("");
    try {
      const body = new FormData();
      body.append("file", file);
      const res = await fetch("/api/upload", { method: "POST", body });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Falha no upload.");
      set("image", data.url);
    } catch (e) {
      setErr(e.message || "Falha ao enviar imagem.");
    } finally {
      setUploading(false);
    }
  };

  const submit = (e) => {
    e.preventDefault();
    if (!f.title.trim() || !f.link.trim() || !f.price) return;
    onSave({ ...f, price: parseFloat(f.price), originalPrice: f.originalPrice ? parseFloat(f.originalPrice) : 0 });
  };

  return (
    <form onSubmit={submit} style={{ background: "#fff", border: `1px solid ${C.line}`, borderRadius: 14, padding: 22, display: "grid", gap: 14 }}>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
        <div style={{ gridColumn: "1 / -1" }}>
          <label style={lbl}>Título do Produto</label>
          <input value={f.title} onChange={(e) => set("title", e.target.value)} placeholder="Ex: Tênis Feminino Adizero" style={inp} required />
        </div>

        <div style={{ gridColumn: "1 / -1" }}>
          <label style={lbl}>Link de Afiliado</label>
          <input value={f.link} onChange={(e) => set("link", e.target.value)} placeholder="https://..." style={inp} required />
        </div>

        <div style={{ gridColumn: "1 / -1" }}>
          <label style={lbl}>Imagem do Produto</label>
          <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
            <input value={f.image} onChange={(e) => set("image", e.target.value)} placeholder="Cole a URL da imagem (ou envie um arquivo)" style={{ ...inp, flex: 1 }} />
            <button type="button" onClick={() => fileRef.current.click()} style={btnGhost} disabled={uploading}>
              {uploading ? "Enviando..." : "Enviar arquivo"}
            </button>
            <input ref={fileRef} type="file" accept="image/*" hidden onChange={(e) => handleFile(e.target.files[0])} />
          </div>
          {err && <div style={{ color: C.red, fontSize: 12, marginTop: 6 }}>{err}</div>}
          {f.image && <img src={f.image} alt="" style={{ width: 72, height: 72, objectFit: "cover", borderRadius: 8, marginTop: 8, border: `1px solid ${C.line}` }} />}
        </div>

        <div>
          <label style={lbl}>Preço Promocional (R$)</label>
          <input type="number" step="0.01" value={f.price} onChange={(e) => set("price", e.target.value)} placeholder="89.90" style={inp} required />
        </div>
        <div>
          <label style={lbl}>Preço Original (opcional)</label>
          <input type="number" step="0.01" value={f.originalPrice} onChange={(e) => set("originalPrice", e.target.value)} placeholder="120.00" style={inp} />
        </div>

        <div>
          <label style={lbl}>Loja / Origem</label>
          <select value={f.store} onChange={(e) => set("store", e.target.value)} style={inp}>
            {STORES.map((s) => <option key={s}>{s}</option>)}
          </select>
        </div>
        <div>
          <label style={lbl}>Categoria</label>
          <select value={f.category} onChange={(e) => set("category", e.target.value)} style={inp}>
            {CATEGORIES.map((c) => <option key={c}>{c}</option>)}
          </select>
        </div>

        <div>
          <label style={lbl}>Cupom de Desconto (opcional)</label>
          <input value={f.coupon} onChange={(e) => set("coupon", e.target.value)} placeholder="EX: PROMO10" style={inp} />
        </div>
        <div style={{ display: "flex", alignItems: "flex-end", gap: 18, paddingBottom: 8 }}>
          <label style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 13.5, fontWeight: 600, cursor: "pointer" }}>
            <input type="checkbox" checked={f.featured} onChange={(e) => set("featured", e.target.checked)} /> Destaque na Home
          </label>
          <label style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 13.5, fontWeight: 600, cursor: "pointer" }}>
            <input type="checkbox" checked={f.active} onChange={(e) => set("active", e.target.checked)} /> Ativo
          </label>
        </div>
      </div>

      <div style={{ display: "flex", gap: 10, justifyContent: "flex-end", borderTop: `1px solid ${C.line}`, paddingTop: 14 }}>
        <button type="button" onClick={onCancel} style={btnGhost}>Cancelar</button>
        <button type="submit" disabled={saving} style={{ ...btnGhost, background: C.green, color: "#fff", border: "none", opacity: saving ? 0.7 : 1 }}>
          {saving ? "Salvando..." : "Salvar Oferta"}
        </button>
      </div>
    </form>
  );
}
