"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { Clock3, Copy, CheckCircle2 } from "lucide-react";
import { FORMATION } from "@/lib/config";

export default function PendingClient() {
  const searchParams = useSearchParams();
  const id = searchParams.get("id");
  const [copied, setCopied] = useState(false);

  if (!id) {
    return (
      <div style={styles.wrap}>
        <div style={styles.errorBox}>Aucune inscription à afficher.</div>
        <Link href="/" style={styles.ghostLink}>
          Retour au formulaire
        </Link>
      </div>
    );
  }

  return (
    <div style={styles.wrap}>
      <div style={styles.iconCircle}>
        <Clock3 size={28} color="#fff" />
      </div>
      <h1 style={styles.title}>Inscription enregistrée</h1>
      <p style={styles.text}>
        Merci ! Votre demande d'inscription à la formation <strong>{FORMATION.title}</strong> a bien
        été reçue. Elle est actuellement <strong>en attente de vérification</strong> par
        l'organisateur.
      </p>

      <div style={styles.idBox}>
        <div style={styles.idLabel}>Votre numéro de suivi</div>
        <div style={styles.idRow}>
          <span style={styles.idValue}>{id}</span>
          <button
            onClick={() => {
              navigator.clipboard?.writeText(id);
              setCopied(true);
              setTimeout(() => setCopied(false), 1500);
            }}
            style={styles.copyBtn}
          >
            {copied ? <CheckCircle2 size={15} /> : <Copy size={15} />}
            {copied ? "Copié" : "Copier"}
          </button>
        </div>
        <div style={styles.idHint}>Gardez ce numéro précieusement pour suivre votre inscription.</div>
      </div>

      <div style={styles.stepsBox}>
        <div style={styles.stepsTitle}>Et maintenant ?</div>
        <ol style={styles.stepsList}>
          <li>L'organisateur vérifie votre paiement Mobile Money.</li>
          <li>
            Une fois confirmé, vous recevrez automatiquement par <strong>email</strong> votre reçu
            officiel et le lien pour rejoindre le groupe WhatsApp.
          </li>
          <li>
            Vous pouvez aussi revenir ici à tout moment et utiliser votre numéro de suivi pour
            vérifier l'état de votre inscription.
          </li>
        </ol>
      </div>

      <div style={styles.actions}>
        <Link href={`/suivi?id=${id}`} style={styles.primaryLink}>
          Suivre mon inscription
        </Link>
        <Link href="/" style={styles.ghostLink}>
          Nouvelle inscription
        </Link>
      </div>
    </div>
  );
}

const styles = {
  wrap: {
    maxWidth: 520,
    margin: "0 auto",
    display: "flex",
    flexDirection: "column",
    gap: 16,
    textAlign: "center",
  },
  iconCircle: {
    width: 64,
    height: 64,
    borderRadius: "50%",
    background: "var(--amber)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    margin: "0 auto",
  },
  title: { fontSize: 22, fontWeight: 800, color: "var(--navy)", margin: 0 },
  text: { fontSize: 14, color: "#475569", lineHeight: 1.6, margin: 0 },
  idBox: {
    background: "#fff",
    border: "1px solid var(--line)",
    borderRadius: 16,
    padding: 22,
    textAlign: "left",
  },
  idLabel: { fontSize: 12, color: "#64748b", fontWeight: 600, marginBottom: 8 },
  idRow: { display: "flex", alignItems: "center", justifyContent: "space-between", gap: 10 },
  idValue: { fontSize: 18, fontWeight: 800, color: "var(--red)", letterSpacing: 0.5 },
  copyBtn: {
    display: "flex",
    alignItems: "center",
    gap: 5,
    border: "1px solid var(--line)",
    background: "#fff",
    borderRadius: 8,
    padding: "6px 10px",
    fontSize: 12,
    fontWeight: 700,
    color: "var(--navy)",
  },
  idHint: { fontSize: 11.5, color: "#94a3b8", marginTop: 10 },
  stepsBox: {
    background: "#eef2ff",
    border: "1px solid #c7d2fe",
    borderRadius: 16,
    padding: 20,
    textAlign: "left",
  },
  stepsTitle: { fontWeight: 800, fontSize: 13.5, color: "#3730a3", marginBottom: 10 },
  stepsList: { margin: 0, paddingLeft: 18, color: "#3730a3", fontSize: 13, lineHeight: 1.7 },
  actions: { display: "flex", gap: 10, marginTop: 6 },
  primaryLink: {
    flex: 1,
    background: "var(--red)",
    color: "#fff",
    textDecoration: "none",
    borderRadius: 12,
    padding: "12px 14px",
    fontWeight: 800,
    fontSize: 13.5,
    textAlign: "center",
  },
  ghostLink: {
    flex: 1,
    background: "#fff",
    color: "var(--navy)",
    border: "1px solid var(--line)",
    textDecoration: "none",
    borderRadius: 12,
    padding: "12px 14px",
    fontWeight: 700,
    fontSize: 13.5,
    textAlign: "center",
  },
  errorBox: {
    background: "#fdecee",
    color: "var(--red)",
    fontWeight: 700,
    borderRadius: 12,
    padding: "16px 18px",
  },
};
