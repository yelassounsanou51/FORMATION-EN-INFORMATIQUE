"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { CheckCircle2, Download, Users } from "lucide-react";
import { FORMATION, WHATSAPP_INVITE_LINK, formatFCFA } from "@/lib/config";

export default function ReceiptClient() {
  const searchParams = useSearchParams();
  const id = searchParams.get("id");
  const [record, setRecord] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!id) {
      setError("Aucun reçu à afficher.");
      setLoading(false);
      return;
    }
    (async () => {
      try {
        const res = await fetch(`/api/inscriptions/${id}`);
        const data = await res.json();
        if (!res.ok) {
          setError(data.error || "Reçu introuvable.");
        } else {
          setRecord(data.record);
        }
      } catch (e) {
        setError("Impossible de charger le reçu.");
      } finally {
        setLoading(false);
      }
    })();
  }, [id]);

  async function downloadReceipt() {
    const { jsPDF } = await import("jspdf");
    const doc = new jsPDF({ unit: "pt", format: "a4" });

    const navy = "#0f1b3d";
    const red = "#c8102e";
    let y = 60;

    doc.setFillColor(red);
    doc.roundedRect(40, y, 60, 60, 12, 12, "F");
    doc.setTextColor("#ffffff");
    doc.setFont("helvetica", "bold");
    doc.setFontSize(20);
    doc.text("IB", 70, y + 38, { align: "center" });

    doc.setTextColor(navy);
    doc.setFontSize(16);
    doc.text("Reçu d'inscription", 115, y + 22);
    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    doc.setTextColor("#64748b");
    doc.text(`${FORMATION.subtitle} — ${FORMATION.title}`, 115, y + 38);

    y += 90;
    doc.setFillColor("#fdecee");
    doc.roundedRect(40, y, 515, 32, 8, 8, "F");
    doc.setTextColor(red);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(12);
    doc.text(`N° de reçu : ${record.id}`, 52, y + 21);

    y += 55;
    const lines = [
      ["Nom et prénom", `${record.nom} ${record.prenom}`],
      ["Téléphone", record.telephone],
      ["Sexe", record.sexe],
      ["Profession", record.profession || "—"],
      ["Opérateur", record.operateur],
      ["Référence transaction", record.transaction_ref || "Non fournie"],
      [
        "Date d'inscription",
        new Date(record.date_inscription).toLocaleString("fr-FR", { dateStyle: "long", timeStyle: "short" }),
      ],
      ["Statut", "À vérifier par l'organisateur"],
    ];

    doc.setFont("helvetica", "normal");
    doc.setFontSize(11);
    lines.forEach(([label, value]) => {
      doc.setTextColor("#64748b");
      doc.text(label, 40, y);
      doc.setTextColor(navy);
      doc.setFont("helvetica", "bold");
      doc.text(String(value), 555, y, { align: "right" });
      doc.setFont("helvetica", "normal");
      doc.setDrawColor("#f1f1f4");
      doc.line(40, y + 8, 555, y + 8);
      y += 26;
    });

    y += 10;
    doc.setFillColor(navy);
    doc.roundedRect(40, y, 515, 38, 8, 8, "F");
    doc.setTextColor("#ffffff");
    doc.setFont("helvetica", "bold");
    doc.setFontSize(12);
    doc.text("Montant déclaré", 52, y + 24);
    doc.text(formatFCFA(record.montant), 555, y + 24, { align: "right" });

    y += 60;
    doc.setTextColor("#94a3b8");
    doc.setFont("helvetica", "normal");
    doc.setFontSize(9);
    const footnote = doc.splitTextToSize(
      `Ce reçu confirme l'enregistrement de la demande d'inscription à la formation ${FORMATION.title} (${FORMATION.debut}, ${FORMATION.lieu}). Le paiement déclaré sera vérifié par l'organisateur avant confirmation définitive de la place.`,
      515
    );
    doc.text(footnote, 40, y);

    doc.save(`recu_${record.id}.pdf`);
  }

  if (loading) return <p style={{ textAlign: "center", color: "#64748b" }}>Chargement du reçu...</p>;

  if (error || !record) {
    return (
      <div style={styles.wrap}>
        <div style={styles.errorBox}>{error || "Reçu introuvable."}</div>
        <Link href="/" style={styles.ghostLink}>
          Retour au formulaire
        </Link>
      </div>
    );
  }

  return (
    <div style={styles.wrap}>
      <div style={styles.successBanner}>
        <CheckCircle2 size={22} />
        Inscription enregistrée — votre reçu est prêt
      </div>

      <div style={styles.receiptCard}>
        <div style={styles.receiptHead}>
          <div style={styles.brandMarkSm}>IB</div>
          <div>
            <div style={styles.receiptHeadTitle}>Reçu d'inscription</div>
            <div style={styles.receiptHeadSub}>
              {FORMATION.subtitle} — {FORMATION.title}
            </div>
          </div>
        </div>

        <div style={styles.receiptNumberRow}>
          <span>N° de reçu</span>
          <strong>{record.id}</strong>
        </div>

        <div>
          <ReceiptLine label="Nom et prénom" value={`${record.nom} ${record.prenom}`} />
          <ReceiptLine label="Téléphone" value={record.telephone} />
          <ReceiptLine label="Sexe" value={record.sexe} />
          <ReceiptLine label="Profession" value={record.profession || "—"} />
          <ReceiptLine label="Opérateur" value={record.operateur} />
          <ReceiptLine label="Référence transaction" value={record.transaction_ref || "Non fournie"} />
          <ReceiptLine
            label="Date d'inscription"
            value={new Date(record.date_inscription).toLocaleString("fr-FR", {
              dateStyle: "long",
              timeStyle: "short",
            })}
          />
          <ReceiptLine label="Statut" value="À vérifier par l'organisateur" highlight />
        </div>

        <div style={styles.receiptTotalRow}>
          <span>Montant déclaré</span>
          <strong>{formatFCFA(record.montant)}</strong>
        </div>

        <p style={styles.receiptFootnote}>
          Ce reçu confirme l'enregistrement de votre demande d'inscription à la formation{" "}
          {FORMATION.title} ({FORMATION.debut}, {FORMATION.lieu}). Le paiement déclaré sera vérifié par
          l'organisateur avant confirmation définitive de votre place.
        </p>
      </div>

      <div style={styles.whatsappCard}>
        <div style={styles.whatsappHead}>
          <Users size={20} />
          <div>
            <div style={styles.whatsappTitle}>Rejoignez le groupe WhatsApp</div>
            <div style={styles.whatsappSub}>Toutes les informations pratiques y seront partagées</div>
          </div>
        </div>
        <a href={WHATSAPP_INVITE_LINK} target="_blank" rel="noreferrer" style={styles.whatsappBtn}>
          Rejoindre le groupe
        </a>
      </div>

      <div style={styles.receiptActions}>
        <button onClick={downloadReceipt} style={styles.secondaryBtn}>
          <Download size={16} /> Télécharger le reçu (PDF)
        </button>
        <Link href="/" style={styles.ghostBtn}>
          Nouvelle inscription
        </Link>
      </div>
    </div>
  );
}

function ReceiptLine({ label, value, highlight }) {
  return (
    <div style={styles.receiptLine}>
      <span style={styles.receiptLineLabel}>{label}</span>
      <span style={{ ...styles.receiptLineValue, color: highlight ? "var(--amber)" : "var(--navy)" }}>
        {value}
      </span>
    </div>
  );
}

const styles = {
  wrap: { maxWidth: 560, margin: "0 auto", display: "flex", flexDirection: "column", gap: 16 },
  errorBox: {
    background: "#fdecee",
    color: "var(--red)",
    fontWeight: 700,
    borderRadius: 12,
    padding: "16px 18px",
    textAlign: "center",
  },
  ghostLink: {
    textAlign: "center",
    textDecoration: "none",
    border: "1px solid var(--line)",
    borderRadius: 12,
    padding: "12px 14px",
    fontWeight: 700,
    fontSize: 13.5,
    color: "var(--navy)",
    background: "#fff",
  },
  successBanner: {
    background: "#e7f7ec",
    color: "var(--green)",
    fontWeight: 700,
    fontSize: 14,
    borderRadius: 12,
    padding: "12px 16px",
    display: "flex",
    alignItems: "center",
    gap: 8,
  },
  receiptCard: { background: "#fff", border: "1px solid var(--line)", borderRadius: 18, padding: 26 },
  receiptHead: { display: "flex", alignItems: "center", gap: 12, marginBottom: 16 },
  brandMarkSm: {
    width: 44,
    height: 44,
    borderRadius: 12,
    background: "var(--red)",
    color: "#fff",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontWeight: 800,
    fontSize: 16,
  },
  receiptHeadTitle: { fontWeight: 800, fontSize: 17, color: "var(--navy)" },
  receiptHeadSub: { fontSize: 12.5, color: "#64748b" },
  receiptNumberRow: {
    display: "flex",
    justifyContent: "space-between",
    background: "#fdecee",
    color: "var(--red)",
    fontWeight: 800,
    borderRadius: 10,
    padding: "10px 14px",
    fontSize: 13.5,
    marginBottom: 14,
  },
  receiptLine: {
    display: "flex",
    justifyContent: "space-between",
    padding: "9px 0",
    borderBottom: "1px solid #f1f1f4",
    fontSize: 13.5,
  },
  receiptLineLabel: { color: "#64748b" },
  receiptLineValue: { fontWeight: 700 },
  receiptTotalRow: {
    display: "flex",
    justifyContent: "space-between",
    background: "var(--navy)",
    color: "#fff",
    borderRadius: 10,
    padding: "12px 14px",
    fontWeight: 800,
    marginTop: 14,
  },
  receiptFootnote: { fontSize: 11.5, color: "#94a3b8", lineHeight: 1.6, marginTop: 14, marginBottom: 0 },
  whatsappCard: {
    background: "#fff",
    border: "1px solid var(--line)",
    borderRadius: 18,
    padding: 22,
    display: "flex",
    flexDirection: "column",
    gap: 14,
  },
  whatsappHead: { display: "flex", alignItems: "center", gap: 10, color: "var(--navy)" },
  whatsappTitle: { fontWeight: 800, fontSize: 14.5 },
  whatsappSub: { fontSize: 12, color: "#64748b" },
  whatsappBtn: {
    background: "#25D366",
    color: "#fff",
    textAlign: "center",
    borderRadius: 12,
    padding: "12px 16px",
    fontWeight: 800,
    fontSize: 14,
    textDecoration: "none",
  },
  receiptActions: { display: "flex", gap: 10 },
  secondaryBtn: {
    flex: 1,
    background: "var(--navy)",
    color: "#fff",
    border: "none",
    borderRadius: 12,
    padding: "12px 14px",
    fontWeight: 700,
    fontSize: 13.5,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
  },
  ghostBtn: {
    flex: 1,
    background: "#fff",
    color: "var(--navy)",
    border: "1px solid var(--line)",
    borderRadius: 12,
    padding: "12px 14px",
    fontWeight: 700,
    fontSize: 13.5,
    textAlign: "center",
    textDecoration: "none",
  },
};
