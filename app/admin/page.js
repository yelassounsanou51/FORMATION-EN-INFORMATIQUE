"use client";

import { useEffect, useState } from "react";
import { ShieldCheck, Search, Trash2, BadgeCheck, Clock3, Phone } from "lucide-react";
import TopBar from "@/components/TopBar";
import Footer from "@/components/Footer";
import { formatFCFA } from "@/lib/config";

const SESSION_KEY = "admin_code_session";

export default function AdminPage() {
  const [code, setCode] = useState("");
  const [authed, setAuthed] = useState(false);
  const [checking, setChecking] = useState(true);
  const [loginError, setLoginError] = useState("");

  useEffect(() => {
    const saved = sessionStorage.getItem(SESSION_KEY);
    if (saved) {
      verifyCode(saved, { silent: true });
    } else {
      setChecking(false);
    }
  }, []);

  async function verifyCode(value, { silent } = {}) {
    setLoginError("");
    if (!silent) setChecking(true);
    try {
      const res = await fetch("/api/admin-login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code: value }),
      });
      if (res.ok) {
        sessionStorage.setItem(SESSION_KEY, value);
        setAuthed(true);
      } else {
        sessionStorage.removeItem(SESSION_KEY);
        if (!silent) setLoginError("Code incorrect.");
      }
    } catch (e) {
      if (!silent) setLoginError("Impossible de vérifier le code.");
    } finally {
      setChecking(false);
    }
  }

  if (checking) {
    return (
      <Shell>
        <p style={{ textAlign: "center", color: "var(--muted)" }}>Vérification...</p>
      </Shell>
    );
  }

  if (!authed) {
    return (
      <Shell>
        <LoginForm code={code} setCode={setCode} error={loginError} onSubmit={() => verifyCode(code)} />
      </Shell>
    );
  }

  return (
    <Shell>
      <Dashboard adminCode={sessionStorage.getItem(SESSION_KEY)} />
    </Shell>
  );
}

function Shell({ children }) {
  return (
    <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}>
      <TopBar />
      <main style={{ flex: 1, padding: "48px 24px 64px" }}>{children}</main>
      <Footer />
    </div>
  );
}

function LoginForm({ code, setCode, error, onSubmit }) {
  return (
    <div style={styles.loginWrap}>
      <div style={styles.loginIcon}>
        <ShieldCheck size={26} color="#fff" />
      </div>
      <h2 style={styles.loginTitle}>Espace organisateur</h2>
      <p style={styles.loginText}>Entrez le code d'accès pour voir la liste des inscrits.</p>
      <input
        type="password"
        value={code}
        onChange={(e) => setCode(e.target.value)}
        onKeyDown={(e) => e.key === "Enter" && onSubmit()}
        style={styles.loginInput}
        placeholder="Code d'accès"
        autoFocus
      />
      {error && <div style={styles.errorText}>{error}</div>}
      <button onClick={onSubmit} style={styles.loginBtn}>Entrer</button>
    </div>
  );
}

function Dashboard({ adminCode }) {
  const [registrations, setRegistrations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState("toutes");

  async function load() {
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/inscriptions", { headers: { "x-admin-code": adminCode } });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Erreur de chargement.");
      } else {
        setRegistrations(data.records);
      }
    } catch (e) {
      setError("Impossible de charger les inscriptions.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function updateStatus(id, statut) {
    setRegistrations((prev) => prev.map((r) => (r.id === id ? { ...r, statut } : r)));
    await fetch(`/api/inscriptions/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json", "x-admin-code": adminCode },
      body: JSON.stringify({ statut }),
    });
  }

  async function deleteRegistration(id) {
    setRegistrations((prev) => prev.filter((r) => r.id !== id));
    await fetch(`/api/inscriptions/${id}`, { method: "DELETE", headers: { "x-admin-code": adminCode } });
  }

  const filtered = registrations.filter((r) => {
    const matchesQuery = `${r.nom} ${r.prenom} ${r.telephone}`.toLowerCase().includes(query.toLowerCase());
    const matchesFilter = filter === "toutes" || r.statut === filter;
    return matchesQuery && matchesFilter;
  });

  const totalConfirme = registrations.filter((r) => r.statut === "confirmé").length;
  const totalAttente = registrations.filter((r) => r.statut === "à vérifier").length;
  const totalRevenu = registrations.filter((r) => r.statut === "confirmé").reduce((s, r) => s + r.montant, 0);

  return (
    <div style={styles.adminWrap}>
      <h2 style={styles.adminTitle}>Inscriptions reçues</h2>

      <div style={styles.statsRow}>
        <StatCard label="Total inscriptions" value={registrations.length} />
        <StatCard label="Confirmées" value={totalConfirme} accent="var(--success)" />
        <StatCard label="À vérifier" value={totalAttente} accent="var(--warning)" />
        <StatCard label="Revenu confirmé" value={formatFCFA(totalRevenu)} accent="var(--sahy-blue)" />
      </div>

      <div style={styles.toolbar}>
        <div style={styles.searchBox}>
          <Search size={16} style={{ color: "var(--muted)" }} />
          <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Rechercher un nom ou un numéro..." style={styles.searchInput} />
        </div>
        <div style={styles.filterRow}>
          {["toutes", "à vérifier", "confirmé"].map((f) => (
            <button key={f} onClick={() => setFilter(f)} style={filter === f ? styles.filterBtnActive : styles.filterBtn}>
              {f === "toutes" ? "Toutes" : f === "à vérifier" ? "À vérifier" : "Confirmées"}
            </button>
          ))}
        </div>
      </div>

      {loading && <p style={{ color: "var(--muted)" }}>Chargement...</p>}
      {error && <div style={styles.errorText}>{error}</div>}
      {!loading && !error && filtered.length === 0 && <div style={styles.emptyState}>Aucune inscription pour le moment.</div>}

      <div style={styles.tableWrap}>
        {filtered.map((r) => (
          <div key={r.id} style={styles.regRow}>
            <div style={styles.regMain}>
              <div style={styles.regName}>
                {r.nom} {r.prenom}
                <span style={{ ...styles.statusPill, background: r.statut === "confirmé" ? "var(--success-bg)" : "var(--warning-bg)", color: r.statut === "confirmé" ? "var(--success)" : "var(--warning)" }}>
                  {r.statut === "confirmé" ? <BadgeCheck size={12} /> : <Clock3 size={12} />}
                  {r.statut}
                </span>
              </div>
              <div style={styles.regMeta}>
                <span><Phone size={12} /> {r.telephone}</span>
                <span>{r.operateur}</span>
                <span>{r.transaction_ref ? `Réf. ${r.transaction_ref}` : "Sans référence"}</span>
                <span>{formatFCFA(r.montant)}</span>
                <span>{r.id}</span>
              </div>
            </div>
            <div style={styles.regActions}>
              {r.statut !== "confirmé" ? (
                <button onClick={() => updateStatus(r.id, "confirmé")} style={styles.confirmBtn}>Confirmer</button>
              ) : (
                <button onClick={() => updateStatus(r.id, "à vérifier")} style={styles.undoBtn}>Annuler</button>
              )}
              <button onClick={() => deleteRegistration(r.id)} style={styles.deleteBtn}><Trash2 size={14} /></button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function StatCard({ label, value, accent }) {
  return (
    <div style={styles.statCard}>
      <div style={styles.statLabel}>{label}</div>
      <div style={{ ...styles.statValue, color: accent || "var(--ink)" }}>{value}</div>
    </div>
  );
}

const styles = {
  loginWrap: {
    maxWidth: 360, margin: "60px auto", background: "#fff", border: "1px solid var(--line)", borderRadius: 20,
    padding: 30, display: "flex", flexDirection: "column", gap: 4, alignItems: "flex-start",
  },
  loginIcon: { width: 52, height: 52, borderRadius: "50%", background: "var(--sahy-blue)", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 8 },
  loginTitle: { margin: "6px 0 2px", fontSize: 18, fontWeight: 800, color: "var(--sahy-blue)", fontFamily: "var(--font-display)" },
  loginText: { fontSize: 13, color: "var(--muted)", marginBottom: 10 },
  loginInput: { width: "100%", border: "1px solid var(--line)", borderRadius: 10, padding: "11px 12px", fontSize: 14, marginBottom: 8 },
  loginBtn: { width: "100%", background: "var(--sahy-orange)", color: "#fff", border: "none", borderRadius: 12, padding: "13px 14px", fontWeight: 800, fontSize: 14, marginTop: 6 },
  errorText: { fontSize: 12, color: "#c0392b", fontWeight: 600 },
  adminWrap: { maxWidth: 1040, margin: "0 auto", display: "flex", flexDirection: "column", gap: 20 },
  adminTitle: { fontSize: 24, fontWeight: 800, color: "var(--sahy-blue)", margin: 0, fontFamily: "var(--font-display)" },
  statsRow: { display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 12 },
  statCard: { background: "#fff", border: "1px solid var(--line)", borderRadius: 16, padding: "16px 18px" },
  statLabel: { fontSize: 11.5, color: "var(--muted)", fontWeight: 600, marginBottom: 6 },
  statValue: { fontSize: 21, fontWeight: 800 },
  toolbar: { display: "flex", justifyContent: "space-between", gap: 12, flexWrap: "wrap" },
  searchBox: { display: "flex", alignItems: "center", gap: 8, background: "#fff", border: "1px solid var(--line)", borderRadius: 12, padding: "9px 14px", minWidth: 240 },
  searchInput: { border: "none", outline: "none", fontSize: 13.5, flex: 1, background: "transparent" },
  filterRow: { display: "flex", gap: 6 },
  filterBtn: { border: "1px solid var(--line)", background: "#fff", borderRadius: 10, padding: "8px 14px", fontSize: 12.5, fontWeight: 600, color: "var(--ink)" },
  filterBtnActive: { border: "1px solid var(--sahy-blue)", background: "var(--sahy-blue)", borderRadius: 10, padding: "8px 14px", fontSize: 12.5, fontWeight: 600, color: "#fff" },
  emptyState: { textAlign: "center", color: "var(--muted)", padding: "40px 0", fontSize: 14 },
  tableWrap: { display: "flex", flexDirection: "column", gap: 10 },
  regRow: { background: "#fff", border: "1px solid var(--line)", borderRadius: 14, padding: "16px 18px", display: "flex", justifyContent: "space-between", alignItems: "center", gap: 12, flexWrap: "wrap" },
  regMain: { display: "flex", flexDirection: "column", gap: 6 },
  regName: { fontWeight: 800, fontSize: 14.5, color: "var(--ink)", display: "flex", alignItems: "center", gap: 8 },
  statusPill: { display: "flex", alignItems: "center", gap: 4, fontSize: 11, fontWeight: 700, borderRadius: 100, padding: "3px 9px" },
  regMeta: { display: "flex", gap: 14, flexWrap: "wrap", fontSize: 12, color: "var(--muted)" },
  regActions: { display: "flex", gap: 8 },
  confirmBtn: { background: "var(--success)", color: "#fff", border: "none", borderRadius: 10, padding: "9px 15px", fontWeight: 700, fontSize: 12.5 },
  undoBtn: { background: "#fff", color: "var(--muted)", border: "1px solid var(--line)", borderRadius: 10, padding: "9px 15px", fontWeight: 700, fontSize: 12.5 },
  deleteBtn: { background: "#fff", color: "#c0392b", border: "1px solid var(--line)", borderRadius: 10, padding: "9px 11px" },
};
