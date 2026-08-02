"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { C } from "../../../../lib/constants";
import Logo from "../../../../components/Logo";
import OfferForm from "../../../../components/OfferForm";

export default function NewOfferPage() {
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [err, setErr] = useState("");

  const save = async (data) => {
    setSaving(true);
    setErr("");
    const res = await fetch("/api/offers", {
      method: "POST",
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
        <h2 style={{ fontSize: 18, fontWeight: 800, color: C.ink, marginBottom: 14 }}>Nova Oferta</h2>
        {err && <div style={{ color: C.red, fontSize: 13, marginBottom: 12 }}>{err}</div>}
        <OfferForm onSave={save} onCancel={() => router.push("/admin")} saving={saving} />
      </div>
    </div>
  );
}
