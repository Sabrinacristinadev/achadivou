"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { C } from "../../../lib/constants";
import Logo from "../../../components/Logo";

export default function AdminLoginPage() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    setErr("");
    setLoading(true);
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        setErr(data.error || "Não foi possível entrar.");
        setLoading(false);
        return;
      }
      router.push("/admin");
      router.refresh();
    } catch {
      setErr("Erro de conexão. Tente novamente.");
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: "100vh", background: C.bg, display: "flex", alignItems: "center", justifyContent: "center" }}>
      <form onSubmit={submit} style={{ background: "#fff", padding: 32, borderRadius: 16, width: 340, boxShadow: "0 8px 30px rgba(20,20,30,0.08)", border: `1px solid ${C.line}` }}>
        <div style={{ display: "flex", justifyContent: "center", marginBottom: 18 }}><Logo size={44} /></div>
        <div style={{ textAlign: "center", color: C.sub, fontSize: 13, marginBottom: 20 }}>Painel Administrativo</div>

        <label style={{ fontSize: 12, fontWeight: 700, color: C.ink }}>Usuário</label>
        <input value={username} onChange={(e) => setUsername(e.target.value)} autoFocus
          style={{ width: "100%", padding: "10px 12px", borderRadius: 10, border: `1px solid ${C.line}`, marginTop: 6, marginBottom: 12, fontSize: 14, outline: "none", boxSizing: "border-box" }} />

        <label style={{ fontSize: 12, fontWeight: 700, color: C.ink }}>Senha</label>
        <input type="password" value={password} onChange={(e) => setPassword(e.target.value)}
          style={{ width: "100%", padding: "10px 12px", borderRadius: 10, border: `1px solid ${C.line}`, marginTop: 6, marginBottom: 6, fontSize: 14, outline: "none", boxSizing: "border-box" }} />

        {err && <div style={{ color: C.red, fontSize: 12, marginBottom: 8 }}>{err}</div>}

        <button type="submit" disabled={loading} style={{ width: "100%", background: C.red, color: "#fff", border: "none", padding: "11px 12px", borderRadius: 10, fontWeight: 800, fontSize: 14, cursor: "pointer", marginTop: 10, opacity: loading ? 0.7 : 1 }}>
          {loading ? "Entrando..." : "Entrar"}
        </button>
        <Link href="/" style={{ display: "block", textAlign: "center", color: C.sub, fontSize: 12.5, marginTop: 12 }}>
          ← Voltar para o site
        </Link>
      </form>
    </div>
  );
}
