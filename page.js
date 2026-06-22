"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  CheckCircle2,
  Copy,
  ChevronRight,
  ClipboardList,
  Smartphone,
  MapPin,
  Clock3,
  Lock,
} from "lucide-react";
import TopBar from "@/components/TopBar";
import Footer from "@/components/Footer";
import {
  FORMATION,
  PAYMENT_NUMBERS,
  PRICE_INSCRIPTION,
  PRICE_PARTICIPATION,
  TOTAL,
  formatFCFA,
} from "@/lib/config";

export default function HomePage() {
  const router = useRouter();
  const [form, setForm] = useState({
    nom: "",
    prenom: "",
    telephone: "",
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
    if (!form.prenom.trim()) e.prenom = "Le prénom est requis.";
    if (!/^[\d+ ]{8,}$/.test(form.telephone.trim())) e.telephone = "Numéro de téléphone invalide.";
    if (!form.sexe) e.sexe = "Sélectionnez une option.";
    if (!form.operateur) e.operateur = "Sélectionnez l'opérateur utilisé pour le paiement.";
    if (!form.declaration) e.declaration = "Vous devez confirmer avoir effectué le paiement.";
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
        body: JSON.stringify(form),
      });
      const data = await res.json();

      if (!res.ok) {
        setServerError(data.error || "Une erreur est survenue. Réessayez.");
        setSubmitting(false);
        return;
      }

      router.push(`/merci?id=${data.record.id}`);
    } catch (err) {
      setServerError("Impossible de contacter le serveur. Vérifiez votre connexion.");
      setSubmitting(false);
    }
  }

  return (
    <div style={styles.page}>
      <TopBar />
      <main style={styles.main}>
        <section style={styles.hero}>
          <div style={styles.heroLeft}>
            <span style={styles.eyebrow}>FORMATION PROFESSIONNELLE</span>
            <h1 style={styles.h1}>
              Maîtrisez l'outil
              <br />
              <span style={{ color: "var(--red)" }}>informatique</span>
            </h1>
            <p style={styles.heroText}>
              Word, Excel, PowerPoint, Internet et Intelligence Artificielle — une semaine pour
              prendre en main la suite bureautique, à Bobo-Dioulasso.
            </p>
            <div style={styles.infoChips}>
              <span style={styles.chip}>
                <MapPin size={15} /> {FORMATION.lieu}
              </span>
              <span style={styles.chip}>
                <Clock3 size={15} /> Début le {FORMATION.debut} · {FORMATION.duree}
              </span>
            </div>
            <div style={styles.moduleBox}>
              <div style={styles.moduleBoxTitle}>Modules au programme</div>
              <ul style={styles.moduleList}>
                {FORMATION.modules.map((m) => (
                  <li key={m} style={styles.moduleItem}>
                    <ChevronRight size={14} style={{ color: "var(--red)", flexShrink: 0 }} />
                    {m}
                  </li>
                ))}
              </ul>
            </div>
            <div style={styles.priceRow}>
              <div style={styles.priceCard}>
                <div style={styles.priceLabel}>Inscription</div>
                <div style={styles.priceValue}>{formatFCFA(PRICE_INSCRIPTION)}</div>
              </div>
              <div style={styles.priceCard}>
                <div style={styles.priceLabel}>Participation</div>
                <div style={styles.priceValue}>{formatFCFA(PRICE_PARTICIPATION)}</div>
              </div>
              <div style={{ ...styles.priceCard, background: "var(--navy)", color: "#fff" }}>
                <div style={{ ...styles.priceLabel, color: "#cbd5e1" }}>Total à payer</div>
                <div style={{ ...styles.priceValue, color: "#fff" }}>{formatFCFA(TOTAL)}</div>
              </div>
            </div>
          </div>

          <div style={styles.heroRight}>
            <form onSubmit={handleSubmit} style={styles.formCard} noValidate>
              <div style={styles.formCardHeader}>
                <ClipboardList size={20} style={{ color: "var(--red)" }} />
                <h2 style={styles.formCardTitle}>Formulaire d'inscription</h2>
              </div>

              <div style={styles.formGrid2}>
                <Field label="Nom" error={errors.nom}>
                  <input
                    style={inputStyle(errors.nom)}
                    value={form.nom}
                    onChange={(e) => set("nom", e.target.value)}
                    placeholder="SANOU"
                  />
                </Field>
                <Field label="Prénom" error={errors.prenom}>
                  <input
                    style={inputStyle(errors.prenom)}
                    value={form.prenom}
                    onChange={(e) => set("prenom", e.target.value)}
                    placeholder="Aïcha"
                  />
                </Field>
              </div>

              <Field label="Numéro de téléphone" error={errors.telephone}>
                <input
                  style={inputStyle(errors.telephone)}
                  value={form.telephone}
                  onChange={(e) => set("telephone", e.target.value)}
                  placeholder="+226 70 00 00 00"
                />
              </Field>

              <div style={styles.formGrid2}>
                <Field label="Sexe" error={errors.sexe}>
                  <select
                    style={inputStyle(errors.sexe)}
                    value={form.sexe}
                    onChange={(e) => set("sexe", e.target.value)}
                  >
                    <option value="">Choisir</option>
                    <option value="Femme">Femme</option>
                    <option value="Homme">Homme</option>
                  </select>
                </Field>
                <Field label="Profession (optionnel)">
                  <input
                    style={inputStyle()}
                    value={form.profession}
                    onChange={(e) => set("profession", e.target.value)}
                    placeholder="Étudiant(e), salarié(e)..."
                  />
                </Field>
              </div>

              <div style={styles.divider} />

              <div style={styles.paySection}>
                <div style={styles.formCardHeader}>
                  <Smartphone size={20} style={{ color: "var(--red)" }} />
                  <h2 style={styles.formCardTitle}>Paiement Mobile Money</h2>
                </div>
                <p style={styles.payHelp}>
                  Envoyez <strong>{formatFCFA(TOTAL)}</strong> ({formatFCFA(PRICE_INSCRIPTION)}{" "}
                  d'inscription + {formatFCFA(PRICE_PARTICIPATION)} de participation) sur l'un des
                  numéros ci-dessous, puis déclarez votre paiement.
                </p>
                <div style={styles.payNumbers}>
                  {PAYMENT_NUMBERS.map((p) => (
                    <PaymentNumberRow key={p.number} operator={p.operator} number={p.number} />
                  ))}
                </div>

                <Field label="Opérateur utilisé" error={errors.operateur}>
                  <select
                    style={inputStyle(errors.operateur)}
                    value={form.operateur}
                    onChange={(e) => set("operateur", e.target.value)}
                  >
                    <option value="">Choisir</option>
                    <option value="Orange Money">Orange Money</option>
                    <option value="Moov Money">Moov Money</option>
                    <option value="Wave">Wave</option>
                  </select>
                </Field>

                <Field label="Référence de la transaction (optionnel)">
                  <input
                    style={inputStyle()}
                    value={form.transactionRef}
                    onChange={(e) => set("transactionRef", e.target.value)}
                    placeholder="ID ou référence SMS reçu de l'opérateur"
                  />
                </Field>

                <label style={styles.checkboxRow}>
                  <input
                    type="checkbox"
                    checked={form.declaration}
                    onChange={(e) => set("declaration", e.target.checked)}
                    style={{ marginTop: 3 }}
                  />
                  <span style={{ color: errors.declaration ? "var(--red)" : "var(--navy)" }}>
                    Je confirme avoir effectué le paiement de {formatFCFA(TOTAL)} sur un des numéros
                    indiqués. Mon inscription sera validée après vérification par l'organisateur.
                  </span>
                </label>
                {errors.declaration && <div style={styles.errorText}>{errors.declaration}</div>}
              </div>

              {serverError && <div style={styles.serverError}>{serverError}</div>}

              <button type="submit" disabled={submitting} style={styles.submitBtn}>
                {submitting ? "Enregistrement..." : "Valider mon inscription"}
                {!submitting && <ChevronRight size={18} />}
              </button>
              <div style={styles.lockNote}>
                <Lock size={12} /> Vos informations restent confidentielles et ne sont utilisées que
                pour cette formation.
              </div>
            </form>
          </div>
        </section>
      </main>
      <Footer />
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

function PaymentNumberRow({ operator, number }) {
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
        {copied ? "Copié" : "Copier"}
      </button>
    </div>
  );
}

function inputStyle(error) {
  return {
    ...styles.input,
    borderColor: error ? "var(--red)" : "var(--line)",
  };
}

const styles = {
  page: { minHeight: "100vh", display: "flex", flexDirection: "column" },
  main: { flex: 1, padding: "32px 20px 56px" },
  hero: { maxWidth: 1100, margin: "0 auto", display: "grid", gridTemplateColumns: "1.05fr 1fr", gap: 36 },
  heroLeft: { display: "flex", flexDirection: "column", gap: 16 },
  eyebrow: { fontSize: 12, fontWeight: 800, letterSpacing: 1.2, color: "var(--red)" },
  h1: { fontSize: 38, lineHeight: 1.1, margin: 0, fontWeight: 800, color: "var(--navy)" },
  heroText: { fontSize: 15, color: "#475569", lineHeight: 1.6, maxWidth: 480 },
  infoChips: { display: "flex", gap: 10, flexWrap: "wrap" },
  chip: {
    display: "flex",
    alignItems: "center",
    gap: 6,
    fontSize: 12.5,
    fontWeight: 600,
    color: "var(--navy)",
    background: "#fff",
    border: "1px solid var(--line)",
    borderRadius: 100,
    padding: "6px 12px",
  },
  moduleBox: { background: "#fff", border: "1px solid var(--line)", borderRadius: 14, padding: 18, marginTop: 4 },
  moduleBoxTitle: { fontWeight: 800, fontSize: 13, marginBottom: 10, color: "var(--navy)" },
  moduleList: { listStyle: "none", padding: 0, margin: 0, display: "grid", gap: 8 },
  moduleItem: { display: "flex", alignItems: "center", gap: 6, fontSize: 13.5, color: "#334155" },
  priceRow: { display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 10, marginTop: 4 },
  priceCard: { background: "#fff", border: "1px solid var(--line)", borderRadius: 12, padding: "12px 14px" },
  priceLabel: { fontSize: 11.5, color: "#64748b", fontWeight: 600, marginBottom: 4 },
  priceValue: { fontSize: 16, fontWeight: 800, color: "var(--navy)" },
  heroRight: {},
  formCard: {
    background: "#fff",
    border: "1px solid var(--line)",
    borderRadius: 18,
    padding: 26,
    display: "flex",
    flexDirection: "column",
    gap: 14,
    boxShadow: "0 12px 30px -18px rgba(15,27,61,0.25)",
  },
  formCardHeader: { display: "flex", alignItems: "center", gap: 8, marginBottom: 2 },
  formCardTitle: { fontSize: 16, fontWeight: 800, margin: 0, color: "var(--navy)" },
  formGrid2: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 },
  field: { display: "flex", flexDirection: "column", gap: 5 },
  label: { fontSize: 12.5, fontWeight: 700, color: "#334155" },
  input: {
    border: "1px solid var(--line)",
    borderRadius: 10,
    padding: "10px 12px",
    fontSize: 14,
    color: "var(--navy)",
    background: "#fbfbfd",
  },
  errorText: { fontSize: 12, color: "var(--red)", fontWeight: 600 },
  serverError: {
    fontSize: 13,
    color: "var(--red)",
    fontWeight: 600,
    background: "#fdecee",
    borderRadius: 10,
    padding: "10px 12px",
  },
  divider: { height: 1, background: "var(--line)", margin: "4px 0" },
  paySection: { display: "flex", flexDirection: "column", gap: 12 },
  payHelp: { fontSize: 13, color: "#475569", lineHeight: 1.5, margin: 0 },
  payNumbers: { display: "flex", flexDirection: "column", gap: 8 },
  payRow: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    background: "#fbfbfd",
    border: "1px solid var(--line)",
    borderRadius: 10,
    padding: "10px 12px",
  },
  payOperator: { fontSize: 12, color: "#64748b", fontWeight: 600 },
  payNumber: { fontSize: 14.5, fontWeight: 800, color: "var(--navy)" },
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
  checkboxRow: { display: "flex", gap: 8, fontSize: 12.5, lineHeight: 1.5, alignItems: "flex-start" },
  submitBtn: {
    background: "var(--red)",
    color: "#fff",
    border: "none",
    borderRadius: 12,
    padding: "14px 18px",
    fontWeight: 800,
    fontSize: 15,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    marginTop: 4,
  },
  lockNote: { display: "flex", alignItems: "center", gap: 6, fontSize: 11.5, color: "#94a3b8", justifyContent: "center" },
};
