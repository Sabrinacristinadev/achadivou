"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { C } from "../../../../../lib/constants";
import Logo from "../../../../../components/Logo";
import OfferForm from "../../../../../components/OfferForm";

export default function EditOfferPage({ params }) {
  const router = useRouter();
  const [offer, setOffer] = useState(null);
  const [saving, setSaving] = useState(false);
  const [err, setErr] = useState("");

  useEffect(() => {
    fetch("/api/offers?all=1")
      .then((r) => r.json())
      .then((list) => setOffer(list.find((o) => o.id === params.id)));
  }, [params.id]);

  const save = async (data) => {
    setSaving(true);
    setErr("");
    const res = await fetch(`/api/offers/${params.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    setSaving(false);
    if (!res.ok) {
      const j = await res.json().catch(() => ({}));
      setErr(j.error || "Não foi possível salvar.");
      return;
    }
    router.push("/admin");
  };

  return (
    <div style={{ minHeight: "100vh", background: C.bg }}>
      <header style={{ background: "#fff", borderBottom: `1px solid ${C.line}`, padding: "14px 24px" }}>
        <Logo size={34} />
      </header>
      <div style={{ maxWidth: 1080, margin: "0 auto", padding: "24px 20px" }}>
        <h2 style={{ fontSize: 18, fontWeight: 800, color: C.ink, marginBottom: 14 }}>Editar Oferta</h2>
        {err && <div style={{ color: C.red, fontSize: 13, marginBottom: 12 }}>{err}</div>}
        {!offer ? (
          <div style={{ color: C.sub }}>Carregando...</div>
        ) : (
          <OfferForm initial={offer} onSave={save} onCancel={() => router.push("/admin")} saving={saving} />
        )}
      </div>
    </div>
  );
}
