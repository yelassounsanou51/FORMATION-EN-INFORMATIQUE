"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { CheckCircle2, Copy, ArrowRight, ArrowLeft, Lock, Smartphone } from "lucide-react";
import Link from "next/link";
import { OPTIONS_INSCRIPTION, PAYMENT_NUMBERS, formatFCFA } from "@/lib/config";

export default function InscriptionClient() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const optionId = searchParams.get("option") || "complet";
  const option = OPTIONS_INSCRIPTION.find((o) => o.id === optionId) || OPTIONS_INSCRIPTION[1];

  const [form, setForm] = useState({
    nom: "",
    prenom: "",
    telephone: "",
    email: "",
    sexe: "",
    profession: "",
    operateur: "",
    transactionRef: "",
    declaration: false,
  });
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [serverError, setServerError] = useState("");

  function set(field, value) {
    setForm((f) => ({ ...f, [field]: value }));
  }

  function validate() {
    const e = {};
    if (!form.nom.trim()) e.nom = "Le nom est requis.";
    if (!form.prenom.trim()) e.prenom = "Le prenom est requis.";
    if (!/^[\d+ ]{8,}$/.test(form.telephone.trim())) e.telephone = "Numero de telephone invalide.";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim())) {
      e.email = "Adresse email invalide.";
    }
    if (!form.sexe) e.sexe = "Selectionnez une option.";
    if (!form.operateur) e.operateur = "Selectionnez l'operateur.";
    if (!form.declaration) e.declaration = "Vous devez confirmer avoir effectue le paiement.";
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  async function handleSubmit(ev) {
    ev.preventDefault();
    setServerError("");
    if (!validate()) return;

    setSubmitting(true);
    try {
      const res = await fetch("/api/inscriptions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, optionId: option.id, montant: option.prix }),
      });
      const data = await res.json();

      if (!res.ok) {
        setServerError(data.error || "Une erreur est survenue. Reessayez.");
        setSubmitting(false);
        return;
      }

      router.push(`/en-attente?id=${data.record.id}`);
    } catch (err) {
      setServerError("Impossible de contacter le serveur. Verifiez votre connexion.");
      setSubmitting(false);
    }
  }

  const isFeatured = option.id === "complet";

  return (
    <div style={styles.wrap}>
      {/* En-tête avec résumé de l'option choisie */}
      <div style={{ ...styles.optionHeader, background: isFeatured ? "var(--sahy-blue)" : "var(--paper)", border: isFeatured ? "2px solid var(--sahy-blue)" : "2px solid var(--line)" }}>
        <Link href="/" style={styles.backLink}>
          <ArrowLeft size={16} /> Changer de formule
        </Link>
        <div style={styles.optionHeaderContent}>
          <div style={{ ...styles.optionHeaderLabel, color: isFeatured ? "#cdd7ee" : "var(--muted)" }}>
            Formule choisie
          </div>
          <div style={{ ...styles.optionHeaderTitle, color: isFeatured ? "#fff" : "var(--sahy-blue)" }}>
            {option.label}
          </div>
          <div style={styles.optionHeaderPrix}>{formatFCFA(option.prix)}</div>
        </div>
      </div>

      {/* Formulaire */}
      <form onSubmit={handleSubmit} style={styles.formCard} noValidate>
        <h2 style={styles.formTitle}>Vos informations</h2>

        <div style={styles.formGrid2}>
          <Field label="Nom" error={errors.nom}>
            <input style={inputStyle(errors.nom)} value={form.nom} onChange={(e) => set("nom", e.target.value)} placeholder="SANOU" />
          </Field>
          <Field label="Prenom" error={errors.prenom}>
            <input style={inputStyle(errors.prenom)} value={form.prenom} onChange={(e) => set("prenom", e.target.value)} placeholder="Aicha" />
          </Field>
        </div>

        <Field label="Numero de telephone" error={errors.telephone}>
          <input style={inputStyle(errors.telephone)} value={form.telephone} onChange={(e) => set("telephone", e.target.value)} placeholder="+226 70 00 00 00" />
        </Field>

        <Field label="Adresse email" error={errors.email}>
          <input type="email" style={inputStyle(errors.email)} value={form.email} onChange={(e) => set("email", e.target.value)} placeholder="vous@exemple.com" />
        </Field>
        <div style={styles.hint}>Votre recu sera envoye a cette adresse apres confirmation.</div>

        <div style={styles.formGrid2}>
          <Field label="Sexe" error={errors.sexe}>
            <select style={inputStyle(errors.sexe)} value={form.sexe} onChange={(e) => set("sexe", e.target.value)}>
              <option value="">Choisir</option>
              <option value="Femme">Femme</option>
              <option value="Homme">Homme</option>
            </select>
          </Field>
          <Field label="Profession (optionnel)">
            <input style={inputStyle()} value={form.profession} onChange={(e) => set("profession", e.target.value)} placeholder="Etudiant(e)..." />
          </Field>
        </div>

        <div style={styles.divider} />

        <div style={styles.paySection}>
          <div style={styles.payHeader}>
            <Smartphone size={18} style={{ color: "var(--sahy-orange)" }} />
            <h3 style={styles.payTitle}>Paiement Mobile Money</h3>
          </div>
          <div style={styles.payAmountBox}>
            Envoyez exactement <strong>{formatFCFA(option.prix)}</strong> sur l'un des numeros ci-dessous.
          </div>
          <div style={styles.payNumbers}>
            {PAYMENT_NUMBERS.map((p) => (
              <PaymentRow key={p.number} operator={p.operator} number={p.number} />
            ))}
          </div>

          <Field label="Operateur utilise" error={errors.operateur}>
            <select style={inputStyle(errors.operateur)} value={form.operateur} onChange={(e) => set("operateur", e.target.value)}>
              <option value="">Choisir</option>
              <option value="Orange Money">Orange Money</option>
              <option value="Moov Money">Moov Money</option>
              <option value="Wave">Wave</option>
            </select>
          </Field>

          <Field label="Reference de la transaction (optionnel)">
            <input style={inputStyle()} value={form.transactionRef} onChange={(e) => set("transactionRef", e.target.value)} placeholder="ID ou reference SMS recu de l'operateur" />
          </Field>

          <label style={styles.checkboxRow}>
            <input type="checkbox" checked={form.declaration} onChange={(e) => set("declaration", e.target.checked)} style={{ marginTop: 3 }} />
            <span style={{ color: errors.declaration ? "#c0392b" : "var(--ink)" }}>
              Je confirme avoir effectue le paiement de {formatFCFA(option.prix)}. Mon inscription sera validee apres verification par l'organisateur.
            </span>
          </label>
          {errors.declaration && <div style={styles.errorText}>{errors.declaration}</div>}
        </div>

        {serverError && <div style={styles.serverError}>{serverError}</div>}

        <button type="submit" disabled={submitting} style={styles.submitBtn}>
          {submitting ? "Enregistrement..." : `Valider mon inscription — ${formatFCFA(option.prix)}`}
          {!submitting && <ArrowRight size={18} />}
        </button>
        <div style={styles.lockNote}>
          <Lock size={12} /> Vos informations restent confidentielles.
        </div>
      </form>
    </div>
  );
}

function Field({ label, error, children }) {
  return (
    <div style={styles.field}>
      <label style={styles.label}>{label}</label>
      {children}
      {error && <div style={styles.errorText}>{error}</div>}
    </div>
  );
}

function PaymentRow({ operator, number }) {
  const [copied, setCopied] = useState(false);
  return (
    <div style={styles.payRow}>
      <div>
        <div style={styles.payOperator}>{operator}</div>
        <div style={styles.payNumber}>{number}</div>
      </div>
      <button
        type="button"
        onClick={() => {
          navigator.clipboard?.writeText(number.replace(/\s/g, ""));
          setCopied(true);
          setTimeout(() => setCopied(false), 1500);
        }}
        style={styles.copyBtn}
      >
        {copied ? <CheckCircle2 size={15} /> : <Copy size={15} />}
        {copied ? "Copie" : "Copier"}
      </button>
    </div>
  );
}

function inputStyle(error) {
  return { ...styles.input, borderColor: error ? "#c0392b" : "var(--line)" };
}

const styles = {
  wrap: { maxWidth: 580, margin: "0 auto", display: "flex", flexDirection: "column", gap: 20 },
  optionHeader: { borderRadius: 20, padding: "20px 24px" },
  backLink: {
    display: "inline-flex", alignItems: "center", gap: 6, textDecoration: "none",
    fontSize: 13, fontWeight: 600, color: "var(--muted)", marginBottom: 12,
  },
  optionHeaderContent: { display: "flex", flexDirection: "column", gap: 4 },
  optionHeaderLabel: { fontSize: 12, fontWeight: 600, textTransform: "uppercase", letterSpacing: 0.8 },
  optionHeaderTitle: { fontFamily: "var(--font-display)", fontSize: 20, fontWeight: 800 },
  optionHeaderPrix: { fontSize: 32, fontWeight: 800, color: "var(--sahy-orange)", fontFamily: "var(--font-display)" },
  formCard: {
    background: "#fff", border: "1px solid var(--line)", borderRadius: 22, padding: 28,
    display: "flex", flexDirection: "column", gap: 14,
    boxShadow: "0 24px 48px -24px rgba(13,59,140,0.12)",
  },
  formTitle: { fontFamily: "var(--font-display)", fontSize: 18, fontWeight: 700, color: "var(--sahy-blue)", margin: 0 },
  formGrid2: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 },
  field: { display: "flex", flexDirection: "column", gap: 5 },
  label: { fontSize: 12.5, fontWeight: 600, color: "var(--ink)" },
  input: { border: "1px solid var(--line)", borderRadius: 10, padding: "11px 12px", fontSize: 14, color: "var(--ink)", background: "var(--paper)" },
  hint: { fontSize: 11.5, color: "var(--muted)", marginTop: -8 },
  errorText: { fontSize: 12, color: "#c0392b", fontWeight: 600 },
  serverError: { fontSize: 13, color: "#c0392b", fontWeight: 600, background: "#fdecea", borderRadius: 10, padding: "10px 12px" },
  divider: { height: 1, background: "var(--line)", margin: "4px 0" },
  paySection: { display: "flex", flexDirection: "column", gap: 12 },
  payHeader: { display: "flex", alignItems: "center", gap: 8 },
  payTitle: { fontFamily: "var(--font-display)", fontSize: 16, fontWeight: 700, color: "var(--sahy-blue)", margin: 0 },
  payAmountBox: {
    background: "#fff8f0", border: "1px solid #fde2c0", borderRadius: 10,
    padding: "10px 14px", fontSize: 13.5, color: "#7c3d0a", lineHeight: 1.5,
  },
  payNumbers: { display: "flex", flexDirection: "column", gap: 8 },
  payRow: { display: "flex", alignItems: "center", justifyContent: "space-between", background: "var(--paper)", border: "1px solid var(--line)", borderRadius: 10, padding: "10px 12px" },
  payOperator: { fontSize: 12, color: "var(--muted)", fontWeight: 600 },
  payNumber: { fontSize: 14.5, fontWeight: 800, color: "var(--ink)" },
  copyBtn: { display: "flex", alignItems: "center", gap: 5, border: "1px solid var(--line)", background: "#fff", borderRadius: 8, padding: "6px 10px", fontSize: 12, fontWeight: 700, color: "var(--sahy-blue)" },
  checkboxRow: { display: "flex", gap: 8, fontSize: 12.5, lineHeight: 1.5, alignItems: "flex-start" },
  submitBtn: {
    background: "var(--sahy-orange)", color: "#fff", border: "none", borderRadius: 14, padding: "15px 18px",
    fontWeight: 800, fontSize: 15, display: "flex", alignItems: "center", justifyContent: "center", gap: 8, marginTop: 4,
  },
  lockNote: { display: "flex", alignItems: "center", gap: 6, fontSize: 11.5, color: "var(--muted)", justifyContent: "center" },
};
