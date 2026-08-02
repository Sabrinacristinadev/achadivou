"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Plus, Edit3, Eye, EyeOff, Trash2, LogOut, ShoppingBag, Check, BarChart3 } from "lucide-react";
import { C, brl } from "../../lib/constants";
import Logo from "../../components/Logo";
import StoreTag from "../../components/StoreTag";

const btnGhost = { padding: "9px 16px", borderRadius: 9, border: `1px solid ${C.line}`, background: "#fff", fontWeight: 700, fontSize: 13, cursor: "pointer" };

function StatCard({ label, value, icon: Icon, color }) {
  return (
    <div style={{ background: "#fff", border: `1px solid ${C.line}`, borderRadius: 14, padding: "14px 18px", display: "flex", alignItems: "center", gap: 12, flex: "1 1 180px" }}>
      <div style={{ width: 40, height: 40, borderRadius: 10, background: color + "22", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <Icon size={19} color={color} />
      </div>
      <div>
        <div style={{ fontSize: 20, fontWeight: 900, color: C.ink }}>{value}</div>
        <div style={{ fontSize: 12, color: C.sub, fontWeight: 600 }}>{label}</div>
      </div>
    </div>
  );
}

function IconBtn({ children, onClick, title, danger }) {
  return (
    <button onClick={onClick} title={title} style={{
      width: 30, height: 30, borderRadius: 8, border: `1px solid ${C.line}`, background: "#fff",
      display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer",
      color: danger ? C.red : C.ink,
    }}>{children}</button>
  );
}

export default function AdminDashboard() {
  const router = useRouter();
  const [offers, setOffers] = useState([]);
  const [loading, setLoading] = useState(true);

  const load = () => {
    setLoading(true);
    fetch("/api/offers?all=1")
      .then((r) => {
        if (r.status === 401) { router.push("/admin/login"); return []; }
        return r.json();
      })
      .then((data) => setOffers(data || []))
      .finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, []); // eslint-disable-line

  const logout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/admin/login");
  };

  const toggleActive = async (offer) => {
    await fetch(`/api/offers/${offer.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ active: !offer.active }),
    });
    load();
  };

  const remove = async (id) => {
    if (!confirm("Excluir esta oferta?")) return;
    await fetch(`/api/offers/${id}`, { method: "DELETE" });
    load();
  };

  const totalClicks = offers.reduce((s, o) => s + (o.clicks || 0), 0);

  return (
    <div style={{ minHeight: "100vh", background: C.bg }}>
      <header style={{ background: "#fff", borderBottom: `1px solid ${C.line}`, padding: "14px 24px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <Logo size={34} />
        <button onClick={logout} style={{ ...btnGhost, display: "flex", alignItems: "center", gap: 6 }}>
          <LogOut size={14} /> Sair
        </button>
      </header>

      <div style={{ maxWidth: 1080, margin: "0 auto", padding: "24px 20px" }}>
        <div style={{ display: "flex", gap: 14, marginBottom: 20, flexWrap: "wrap" }}>
          <StatCard label="Ofertas cadastradas" value={offers.length} icon={ShoppingBag} color={C.red} />
          <StatCard label="Ofertas ativas" value={offers.filter((o) => o.active).length} icon={Check} color={C.green} />
          <StatCard label="Cliques totais" value={totalClicks} icon={BarChart3} color="#e8b84b" />
        </div>

        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
          <h2 style={{ fontSize: 18, fontWeight: 800, color: C.ink, margin: 0 }}>Promoções</h2>
          <Link href="/admin/offers/new" style={{ background: C.red, color: "#fff", border: "none", padding: "10px 16px", borderRadius: 10, fontWeight: 800, fontSize: 13, cursor: "pointer", display: "flex", alignItems: "center", gap: 6 }}>
            <Plus size={16} /> Nova Oferta
          </Link>
        </div>

        <div style={{ background: "#fff", border: `1px solid ${C.line}`, borderRadius: 14, overflow: "hidden" }}>
          <table style={{ borderCollapse: "collapse", fontSize: 13 }}>
            <thead>
              <tr style={{ background: C.bg, textAlign: "left" }}>
                {["Título", "Loja", "Preço", "Status", "Cliques", "Ações"].map((h) => (
                  <th key={h} style={{ padding: "10px 14px", fontSize: 11.5, fontWeight: 800, color: C.sub, textTransform: "uppercase" }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {loading && (
                <tr><td colSpan={6} style={{ padding: 30, textAlign: "center", color: C.sub }}>Carregando...</td></tr>
              )}
              {!loading && offers.length === 0 && (
                <tr><td colSpan={6} style={{ padding: 30, textAlign: "center", color: C.sub }}>Nenhuma oferta cadastrada ainda.</td></tr>
              )}
              {offers.map((o) => (
                <tr key={o.id} style={{ borderTop: `1px solid ${C.line}` }}>
                  <td style={{ padding: "10px 14px", fontWeight: 600, color: C.ink, maxWidth: 260 }}>{o.title}</td>
                  <td style={{ padding: "10px 14px" }}><StoreTag store={o.store} /></td>
                  <td style={{ padding: "10px 14px", fontWeight: 700, color: C.red }}>{brl(o.price)}</td>
                  <td style={{ padding: "10px 14px" }}>
                    <span style={{ fontSize: 11, fontWeight: 800, padding: "3px 9px", borderRadius: 20, background: o.active ? "#e6f8ec" : "#fdeaea", color: o.active ? C.greenDark : C.red }}>
                      {o.active ? "Ativo" : "Oculto"}
                    </span>
                  </td>
                  <td style={{ padding: "10px 14px" }}>{o.clicks || 0}</td>
                  <td style={{ padding: "10px 14px" }}>
                    <div style={{ display: "flex", gap: 6 }}>
                      <Link href={`/admin/offers/${o.id}/edit`} title="Editar" style={{
                        width: 30, height: 30, borderRadius: 8, border: `1px solid ${C.line}`, background: "#fff",
                        display: "flex", alignItems: "center", justifyContent: "center", color: C.ink,
                      }}><Edit3 size={15} /></Link>
                      <IconBtn onClick={() => toggleActive(o)} title={o.active ? "Ocultar" : "Ativar"}>
                        {o.active ? <EyeOff size={15} /> : <Eye size={15} />}
                      </IconBtn>
                      <IconBtn onClick={() => remove(o.id)} title="Excluir" danger><Trash2 size={15} /></IconBtn>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
