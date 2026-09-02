"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { Search, Clock3, CheckCircle2, Download, Users } from "lucide-react";
import { FORMATION, WHATSAPP_INVITE_LINK, formatFCFA } from "@/lib/config";

export default function TrackingClient() {
  const searchParams = useSearchParams();
  const initialId = searchParams.get("id") || "";
  const [idInput, setIdInput] = useState(initialId);
  const [telInput, setTelInput] = useState("");
  const [records, setRecords] = useState(null);
  const [selected, setSelected] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [searched, setSearched] = useState(false);

  async function lookup(id, telephone) {
    if (!telephone.trim()) {
      setError("Entrez le numéro de téléphone utilisé à l'inscription.");
      setSearched(true);
      return;
    }
    setLoading(true);
    setError("");
    setRecords(null);
    setSelected(null);
    setSearched(true);
    try {
      const res = await fetch("/api/suivi", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: id.trim() || undefined, telephone: telephone.trim() }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Inscription introuvable.");
      } else {
        setRecords(data.records);
        // Une seule inscription trouvée : on l'affiche directement, pas
        // besoin de faire choisir la personne dans une liste.
        if (data.records.length === 1) setSelected(data.records[0]);
      }
    } catch (e) {
      setError("Impossible de vérifier le statut. Réessayez.");
    } finally {
      setLoading(false);
    }
  }

  const record = selected;

  useEffect(() => {
    // On ne relance pas automatiquement la recherche au chargement : le
    // téléphone est désormais nécessaire et n'est jamais mis dans l'URL.
  }, []);

  async function downloadReceipt() {
    const { jsPDF } = await import("jspdf");
    const doc = new jsPDF({ unit: "pt", format: "a4" });
    const navy = "#0d3b8c";
    const orange = "#ff7a1a";
    let y = 60;

    doc.setFillColor(navy);
    doc.roundedRect(40, y, 60, 60, 12, 12, "F");
    doc.setTextColor("#ffffff");
    doc.setFont("helvetica", "bold");
    doc.setFontSize(13);
    doc.text("SAHY", 70, y + 35, { align: "center" });

    doc.setTextColor(navy);
    doc.setFontSize(16);
    doc.text("Reçu d'inscription", 115, y + 22);
    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    doc.setTextColor("#5b6072");
    doc.text(`${FORMATION.subtitle} — ${FORMATION.title}`, 115, y + 38);

    y += 90;
    doc.setFillColor(255, 237, 217);
    doc.roundedRect(40, y, 515, 32, 8, 8, "F");
    doc.setTextColor(orange);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(12);
    doc.text(`N° de reçu : ${record.id}`, 52, y + 21);

    y += 55;
    const lines = [
      ["Nom et prénom", `${record.nom} ${record.prenom}`],
      ["Téléphone", record.telephone],
      ["Email", record.email || "—"],
      ["Sexe", record.sexe],
      ["Profession", record.profession || "—"],
      ["Opérateur", record.operateur],
      ["Référence transaction", record.transaction_ref || "Non fournie"],
      ["Date d'inscription", new Date(record.date_inscription).toLocaleString("fr-FR", { dateStyle: "long", timeStyle: "short" })],
      ["Statut", "Confirmé par l'organisateur"],
    ];

    doc.setFont("helvetica", "normal");
    doc.setFontSize(11);
    lines.forEach(([label, value]) => {
      doc.setTextColor("#5b6072");
      doc.text(label, 40, y);
      doc.setTextColor(navy);
      doc.setFont("helvetica", "bold");
      doc.text(String(value), 555, y, { align: "right" });
      doc.setFont("helvetica", "normal");
      doc.setDrawColor("#eeeeee");
      doc.line(40, y + 8, 555, y + 8);
      y += 26;
    });

    y += 10;
    doc.setFillColor(navy);
    doc.roundedRect(40, y, 515, 38, 8, 8, "F");
    doc.setTextColor("#ffffff");
    doc.setFont("helvetica", "bold");
    doc.setFontSize(12);
    doc.text("Montant payé", 52, y + 24);
    doc.text(formatFCFA(record.montant), 555, y + 24, { align: "right" });

    y += 60;
    doc.setTextColor("#94a3b8");
    doc.setFont("helvetica", "normal");
    doc.setFontSize(9);
    const footnote = doc.splitTextToSize(
      `Ce reçu confirme l'inscription validée à la formation ${FORMATION.title} (du ${FORMATION.debut} au ${FORMATION.fin}, ${FORMATION.lieu}). Émis par ${FORMATION.organisateur}.`,
      515
    );
    doc.text(footnote, 40, y);

    doc.save(`recu_${record.id}.pdf`);
  }

  return (
    <div style={styles.wrap}>
      <h1 style={styles.title}>Suivre mon inscription</h1>
      <p style={styles.subtitle}>
        Entrez le numéro de téléphone utilisé à l'inscription pour connaître l'état de votre
        dossier.
      </p>

      <div style={styles.searchBox}>
        <Search size={16} style={{ color: "var(--muted)" }} />
        <input
          value={telInput}
          onChange={(e) => setTelInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && lookup(idInput, telInput)}
          placeholder="Téléphone utilisé à l'inscription"
          style={styles.searchInput}
        />
        <button onClick={() => lookup(idInput, telInput)} style={styles.searchBtn}>Vérifier</button>
      </div>
      <details style={styles.optionalDetails}>
        <summary style={styles.optionalSummary}>
          Vous connaissez votre numéro de suivi ? (optionnel, utile si plusieurs
          personnes ont été inscrites avec ce téléphone)
        </summary>
        <input
          value={idInput}
          onChange={(e) => setIdInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && lookup(idInput, telInput)}
          placeholder="Numéro de suivi (IB-...)"
          style={styles.optionalInput}
        />
      </details>

      {loading && <p style={{ textAlign: "center", color: "var(--muted)" }}>Recherche en cours...</p>}
      {!loading && searched && error && <div style={styles.errorBox}>{error}</div>}

      {!loading && records && records.length > 1 && !selected && (
        <div style={styles.multiList}>
          <p style={styles.multiHint}>
            {records.length} inscriptions trouvées avec ce numéro. Sélectionnez la vôtre :
          </p>
          {records.map((r) => (
            <button key={r.id} onClick={() => setSelected(r)} style={styles.multiItem}>
              <span style={styles.multiItemName}>{r.nom} {r.prenom}</span>
              <span style={styles.multiItemMeta}>{r.id} · {r.statut}</span>
            </button>
          ))}
        </div>
      )}

      {!loading && record && record.statut === "à vérifier" && (
        <div style={styles.pendingCard}>
          <Clock3 size={22} style={{ color: "var(--warning)" }} />
          <div style={styles.pendingTitle}>En attente de vérification</div>
          <p style={styles.pendingText}>
            Votre paiement n'a pas encore été confirmé. Revenez vérifier plus tard, ou attendez
            l'email automatique envoyé dès la confirmation.
          </p>
        </div>
      )}

      {!loading && record && record.statut === "confirmé" && (
        <div style={styles.confirmedWrap}>
          <div style={styles.successBanner}>
            <CheckCircle2 size={20} /> Inscription confirmée
          </div>

          <div style={styles.receiptCard}>
            <ReceiptLine label="Nom et prénom" value={`${record.nom} ${record.prenom}`} />
            <ReceiptLine label="Téléphone" value={record.telephone} />
            <ReceiptLine label="Statut" value="Confirmé" highlight />
            <div style={styles.totalRow}>
              <span>Montant payé</span>
              <strong>{formatFCFA(record.montant)}</strong>
            </div>
          </div>

          <div style={styles.whatsappCard}>
            <div style={styles.whatsappHead}>
              <Users size={18} />
              <div style={styles.whatsappTitle}>Rejoignez le groupe WhatsApp</div>
            </div>
            <a href={WHATSAPP_INVITE_LINK} target="_blank" rel="noreferrer" style={styles.whatsappBtn}>
              Rejoindre le groupe
            </a>
          </div>

          <button onClick={downloadReceipt} style={styles.downloadBtn}>
            <Download size={16} /> Télécharger le reçu (PDF)
          </button>
        </div>
      )}
    </div>
  );
}

function ReceiptLine({ label, value, highlight }) {
  return (
    <div style={styles.receiptLine}>
      <span style={styles.receiptLineLabel}>{label}</span>
      <span style={{ ...styles.receiptLineValue, color: highlight ? "var(--success)" : "var(--ink)" }}>{value}</span>
    </div>
  );
}

const styles = {
  wrap: { maxWidth: 540, margin: "0 auto", display: "flex", flexDirection: "column", gap: 18 },
  title: { fontFamily: "var(--font-display)", fontSize: 24, fontWeight: 800, color: "var(--sahy-blue)", margin: 0, textAlign: "center" },
  subtitle: { fontSize: 14, color: "var(--muted)", textAlign: "center", margin: 0, lineHeight: 1.55 },
  searchBox: {
    display: "flex", alignItems: "center", gap: 8, background: "#fff", border: "1px solid var(--line)",
    borderRadius: 14, padding: "8px 8px 8px 16px",
  },
  searchInput: { border: "none", outline: "none", fontSize: 14, flex: 1, background: "transparent" },
  searchBtn: { background: "var(--sahy-orange)", color: "#fff", border: "none", borderRadius: 10, padding: "11px 18px", fontWeight: 700, fontSize: 13 },
  errorBox: { background: "#fdecea", color: "#c0392b", fontWeight: 600, borderRadius: 14, padding: "14px 16px", fontSize: 13.5, textAlign: "center" },
  optionalDetails: { fontSize: 12.5, color: "var(--muted)" },
  optionalSummary: { cursor: "pointer", padding: "4px 2px" },
  optionalInput: { width: "100%", border: "1px solid var(--line)", borderRadius: 10, padding: "10px 12px", fontSize: 13, marginTop: 8, boxSizing: "border-box" },
  multiList: { background: "#fff", border: "1px solid var(--line)", borderRadius: 16, padding: 14, display: "flex", flexDirection: "column", gap: 8 },
  multiHint: { fontSize: 12.5, color: "var(--muted)", margin: "0 0 4px" },
  multiItem: { display: "flex", justifyContent: "space-between", alignItems: "center", background: "var(--bg)", border: "1px solid var(--line)", borderRadius: 10, padding: "10px 14px", fontSize: 13, textAlign: "left" },
  multiItemName: { fontWeight: 700, color: "var(--ink)" },
  multiItemMeta: { fontSize: 11.5, color: "var(--muted)" },
  pendingCard: { background: "var(--warning-bg)", border: "1px solid #fde2b8", borderRadius: 18, padding: 24, textAlign: "center" },
  pendingTitle: { fontWeight: 800, fontSize: 15, color: "var(--warning)", marginTop: 8, fontFamily: "var(--font-display)" },
  pendingText: { fontSize: 13, color: "var(--warning)", lineHeight: 1.6, marginTop: 6 },
  confirmedWrap: { display: "flex", flexDirection: "column", gap: 14 },
  successBanner: {
    background: "var(--success-bg)", color: "var(--success)", fontWeight: 700, fontSize: 14, borderRadius: 14,
    padding: "13px 16px", display: "flex", alignItems: "center", gap: 8, justifyContent: "center",
  },
  receiptCard: { background: "#fff", border: "1px solid var(--line)", borderRadius: 18, padding: 22 },
  receiptLine: { display: "flex", justifyContent: "space-between", padding: "10px 0", borderBottom: "1px solid #f1f1f4", fontSize: 13.5 },
  receiptLineLabel: { color: "var(--muted)" },
  receiptLineValue: { fontWeight: 700 },
  totalRow: { display: "flex", justifyContent: "space-between", background: "var(--sahy-blue)", color: "#fff", borderRadius: 10, padding: "13px 15px", fontWeight: 800, marginTop: 12 },
  whatsappCard: { background: "#fff", border: "1px solid var(--line)", borderRadius: 18, padding: 20, display: "flex", flexDirection: "column", gap: 12 },
  whatsappHead: { display: "flex", alignItems: "center", gap: 8, color: "var(--ink)" },
  whatsappTitle: { fontWeight: 800, fontSize: 14 },
  whatsappBtn: { background: "#25D366", color: "#fff", textAlign: "center", borderRadius: 10, padding: "12px 14px", fontWeight: 800, fontSize: 13.5, textDecoration: "none" },
  downloadBtn: {
    background: "var(--sahy-blue)", color: "#fff", border: "none", borderRadius: 14, padding: "13px 14px",
    fontWeight: 700, fontSize: 13.5, display: "flex", alignItems: "center", justifyContent: "center", gap: 6,
  },
};
