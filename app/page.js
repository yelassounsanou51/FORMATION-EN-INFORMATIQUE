"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  CheckCircle2,
  Copy,
  ArrowRight,
  MapPin,
  Clock3,
  Lock,
  Laptop2,
} from "lucide-react";
import TopBar from "@/components/TopBar";
import Footer from "@/components/Footer";
import ArcMark from "@/components/ArcMark";
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
    if (!form.prenom.trim()) e.prenom = "Le prénom est requis.";
    if (!/^[\d+ ]{8,}$/.test(form.telephone.trim())) e.telephone = "Numéro de téléphone invalide.";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim())) {
      e.email = "Adresse email invalide — utilisée pour vous envoyer votre reçu.";
    }
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

      router.push(`/en-attente?id=${data.record.id}`);
    } catch (err) {
      setServerError("Impossible de contacter le serveur. Vérifiez votre connexion.");
      setSubmitting(false);
    }
  }

  return (
    <div style={styles.page}>
      <TopBar />

      {/* HERO */}
      <section style={styles.hero}>
        <div style={styles.heroArc} aria-hidden="true">
          <ArcMark size={420} animate />
        </div>
        <div style={styles.heroInner}>
          <span style={styles.eyebrow}>{FORMATION.organisateur} · {FORMATION.subtitle}</span>
          <h1 style={styles.h1}>
            Maîtrisez l'outil
            <br />
            <span style={{ color: "var(--sahy-orange)" }}>informatique</span>
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
          <a href="#inscription" style={styles.heroCta}>
            S'inscrire maintenant <ArrowRight size={17} />
          </a>
        </div>
      </section>

      {/* MODULES */}
      <section style={styles.section}>
        <div style={styles.sectionInner}>
          <h2 style={styles.sectionTitle}>Ce que vous allez apprendre</h2>
          <div style={styles.modulesGrid}>
            {FORMATION.modules.map((m, i) => (
              <div key={m.name} style={styles.moduleCard}>
                <div style={styles.moduleIcon}>
                  <Laptop2 size={18} color="var(--sahy-blue)" />
                </div>
                <div style={styles.moduleName}>{m.name}</div>
                <div style={styles.moduleDesc}>{m.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* PRIX + FORMULAIRE */}
      <section id="inscription" style={styles.regSection}>
        <div style={styles.regInner}>
          <div style={styles.regLeft}>
            <h2 style={styles.sectionTitle}>Tarifs et inscription</h2>
            <p style={styles.regText}>
              Remplissez le formulaire ci-contre, effectuez le paiement Mobile Money, et recevez
              votre reçu officiel dès la confirmation de l'organisateur.
            </p>
            <div style={styles.priceRow}>
              <div style={styles.priceCard}>
                <div style={styles.priceLabel}>Inscription</div>
                <div style={styles.priceValue}>{formatFCFA(PRICE_INSCRIPTION)}</div>
              </div>
              <div style={styles.priceCard}>
                <div style={styles.priceLabel}>Participation</div>
                <div style={styles.priceValue}>{formatFCFA(PRICE_PARTICIPATION)}</div>
              </div>
              <div style={styles.priceCardTotal}>
                <div style={styles.priceLabelTotal}>Total à payer</div>
                <div style={styles.priceValueTotal}>{formatFCFA(TOTAL)}</div>
              </div>
            </div>

            <div style={styles.stepsBox}>
              <div style={styles.stepsTitle}>Comment ça marche</div>
              <ol style={styles.stepsList}>
                <li>Remplissez vos informations et choisissez votre opérateur.</li>
                <li>Envoyez {formatFCFA(TOTAL)} sur le numéro Mobile Money indiqué.</li>
                <li>L'organisateur vérifie le paiement et confirme votre place.</li>
                <li>Vous recevez par email votre reçu et le lien du groupe WhatsApp.</li>
              </ol>
            </div>
          </div>

          <div style={styles.regRight}>
            <form onSubmit={handleSubmit} style={styles.formCard} noValidate>
              <h3 style={styles.formTitle}>Formulaire d'inscription</h3>

              <div style={styles.formGrid2}>
                <Field label="Nom" error={errors.nom}>
                  <input style={inputStyle(errors.nom)} value={form.nom} onChange={(e) => set("nom", e.target.value)} placeholder="SANOU" />
                </Field>
                <Field label="Prénom" error={errors.prenom}>
                  <input style={inputStyle(errors.prenom)} value={form.prenom} onChange={(e) => set("prenom", e.target.value)} placeholder="Aïcha" />
                </Field>
              </div>

              <Field label="Numéro de téléphone" error={errors.telephone}>
                <input style={inputStyle(errors.telephone)} value={form.telephone} onChange={(e) => set("telephone", e.target.value)} placeholder="+226 70 00 00 00" />
              </Field>

              <Field label="Adresse email" error={errors.email}>
                <input type="email" style={inputStyle(errors.email)} value={form.email} onChange={(e) => set("email", e.target.value)} placeholder="vous@exemple.com" />
              </Field>
              <div style={styles.hint}>Votre reçu et le lien WhatsApp seront envoyés ici dès confirmation.</div>

              <div style={styles.formGrid2}>
                <Field label="Sexe" error={errors.sexe}>
                  <select style={inputStyle(errors.sexe)} value={form.sexe} onChange={(e) => set("sexe", e.target.value)}>
                    <option value="">Choisir</option>
                    <option value="Femme">Femme</option>
                    <option value="Homme">Homme</option>
                  </select>
                </Field>
                <Field label="Profession (optionnel)">
                  <input style={inputStyle()} value={form.profession} onChange={(e) => set("profession", e.target.value)} placeholder="Étudiant(e)..." />
                </Field>
              </div>

              <div style={styles.divider} />
              <h3 style={styles.formTitle}>Paiement Mobile Money</h3>
              <p style={styles.payHelp}>Envoyez {formatFCFA(TOTAL)} sur l'un des numéros, puis déclarez votre paiement.</p>

              <div style={styles.payNumbers}>
                {PAYMENT_NUMBERS.map((p) => (
                  <PaymentRow key={p.number} operator={p.operator} number={p.number} />
                ))}
              </div>

              <Field label="Opérateur utilisé" error={errors.operateur}>
                <select style={inputStyle(errors.operateur)} value={form.operateur} onChange={(e) => set("operateur", e.target.value)}>
                  <option value="">Choisir</option>
                  <option value="Orange Money">Orange Money</option>
                  <option value="Moov Money">Moov Money</option>
                  <option value="Wave">Wave</option>
                </select>
              </Field>

              <Field label="Référence de la transaction (optionnel)">
                <input style={inputStyle()} value={form.transactionRef} onChange={(e) => set("transactionRef", e.target.value)} placeholder="ID ou référence SMS reçu de l'opérateur" />
              </Field>

              <label style={styles.checkboxRow}>
                <input type="checkbox" checked={form.declaration} onChange={(e) => set("declaration", e.target.checked)} style={{ marginTop: 3 }} />
                <span style={{ color: errors.declaration ? "#c0392b" : "var(--ink)" }}>
                  Je confirme avoir effectué le paiement de {formatFCFA(TOTAL)}. Mon inscription sera validée après vérification.
                </span>
              </label>
              {errors.declaration && <div style={styles.errorText}>{errors.declaration}</div>}

              {serverError && <div style={styles.serverError}>{serverError}</div>}

              <button type="submit" disabled={submitting} style={styles.submitBtn}>
                {submitting ? "Enregistrement..." : "Valider mon inscription"}
                {!submitting && <ArrowRight size={18} />}
              </button>
              <div style={styles.lockNote}>
                <Lock size={12} /> Vos informations restent confidentielles.
              </div>
            </form>
          </div>
        </div>
      </section>

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
        {copied ? "Copié" : "Copier"}
      </button>
    </div>
  );
}

function inputStyle(error) {
  return { ...styles.input, borderColor: error ? "#c0392b" : "var(--line)" };
}

const styles = {
  page: { minHeight: "100vh", display: "flex", flexDirection: "column" },

  hero: {
    background: "linear-gradient(135deg, var(--sahy-blue) 0%, var(--sahy-blue-dark) 100%)",
    color: "#fff",
    position: "relative",
    overflow: "hidden",
    padding: "64px 24px 80px",
  },
  heroArc: { position: "absolute", right: -80, top: -60, opacity: 0.18, filter: "brightness(2)" },
  heroInner: { maxWidth: 1140, margin: "0 auto", position: "relative", zIndex: 1, maxWidth: 640 },
  eyebrow: { fontSize: 12.5, fontWeight: 700, letterSpacing: 1.2, color: "var(--sahy-orange)", textTransform: "uppercase" },
  h1: { fontFamily: "var(--font-display)", fontSize: 46, lineHeight: 1.08, margin: "14px 0 16px", fontWeight: 800 },
  heroText: { fontSize: 16, color: "#dbe4f7", lineHeight: 1.65, maxWidth: 480, marginBottom: 22 },
  infoChips: { display: "flex", gap: 10, flexWrap: "wrap", marginBottom: 28 },
  chip: {
    display: "flex", alignItems: "center", gap: 6, fontSize: 13, fontWeight: 600,
    color: "#fff", background: "rgba(255,255,255,0.12)", border: "1px solid rgba(255,255,255,0.25)",
    borderRadius: 100, padding: "7px 14px",
  },
  heroCta: {
    display: "inline-flex", alignItems: "center", gap: 8, background: "var(--sahy-orange)",
    color: "#fff", textDecoration: "none", fontWeight: 700, fontSize: 15, padding: "14px 24px",
    borderRadius: 12, boxShadow: "0 12px 24px -8px rgba(255,122,26,0.5)",
  },

  section: { padding: "64px 24px" },
  sectionInner: { maxWidth: 1140, margin: "0 auto" },
  sectionTitle: { fontFamily: "var(--font-display)", fontSize: 28, fontWeight: 800, color: "var(--sahy-blue)", margin: "0 0 28px" },

  modulesGrid: { display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 18 },
  moduleCard: { background: "#fff", border: "1px solid var(--line)", borderRadius: 16, padding: 22 },
  moduleIcon: {
    width: 38, height: 38, borderRadius: 10, background: "#eaf0fb",
    display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 14,
  },
  moduleName: { fontWeight: 700, fontSize: 15, color: "var(--ink)", marginBottom: 4 },
  moduleDesc: { fontSize: 13, color: "var(--muted)", lineHeight: 1.5 },

  regSection: { background: "#fff", borderTop: "1px solid var(--line)", borderBottom: "1px solid var(--line)", padding: "64px 24px" },
  regInner: { maxWidth: 1140, margin: "0 auto", display: "grid", gridTemplateColumns: "1fr 1fr", gap: 48 },
  regLeft: { display: "flex", flexDirection: "column", gap: 18 },
  regText: { fontSize: 15, color: "var(--muted)", lineHeight: 1.65, margin: 0, maxWidth: 420 },

  priceRow: { display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 10 },
  priceCard: { background: "var(--paper)", border: "1px solid var(--line)", borderRadius: 14, padding: "14px 16px" },
  priceLabel: { fontSize: 11.5, color: "var(--muted)", fontWeight: 600, marginBottom: 4 },
  priceValue: { fontSize: 17, fontWeight: 800, color: "var(--ink)" },
  priceCardTotal: { background: "var(--sahy-blue)", borderRadius: 14, padding: "14px 16px" },
  priceLabelTotal: { fontSize: 11.5, color: "#cdd7ee", fontWeight: 600, marginBottom: 4 },
  priceValueTotal: { fontSize: 17, fontWeight: 800, color: "#fff" },

  stepsBox: { background: "#eaf0fb", borderRadius: 16, padding: 22 },
  stepsTitle: { fontWeight: 800, fontSize: 14, color: "var(--sahy-blue)", marginBottom: 10 },
  stepsList: { margin: 0, paddingLeft: 18, color: "var(--sahy-blue-dark)", fontSize: 13.5, lineHeight: 1.8 },

  regRight: {},
  formCard: {
    background: "var(--paper)", border: "1px solid var(--line)", borderRadius: 20, padding: 28,
    display: "flex", flexDirection: "column", gap: 14,
    boxShadow: "0 24px 48px -24px rgba(13,59,140,0.18)",
  },
  formTitle: { fontFamily: "var(--font-display)", fontSize: 17, fontWeight: 700, color: "var(--sahy-blue)", margin: "4px 0 2px" },
  formGrid2: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 },
  field: { display: "flex", flexDirection: "column", gap: 5 },
  label: { fontSize: 12.5, fontWeight: 600, color: "var(--ink)" },
  input: { border: "1px solid var(--line)", borderRadius: 10, padding: "11px 12px", fontSize: 14, color: "var(--ink)", background: "#fff" },
  hint: { fontSize: 11.5, color: "var(--muted)", marginTop: -8 },
  errorText: { fontSize: 12, color: "#c0392b", fontWeight: 600 },
  serverError: { fontSize: 13, color: "#c0392b", fontWeight: 600, background: "#fdecea", borderRadius: 10, padding: "10px 12px" },
  divider: { height: 1, background: "var(--line)", margin: "4px 0" },
  payHelp: { fontSize: 13, color: "var(--muted)", lineHeight: 1.5, margin: 0 },
  payNumbers: { display: "flex", flexDirection: "column", gap: 8 },
  payRow: { display: "flex", alignItems: "center", justifyContent: "space-between", background: "#fff", border: "1px solid var(--line)", borderRadius: 10, padding: "10px 12px" },
  payOperator: { fontSize: 12, color: "var(--muted)", fontWeight: 600 },
  payNumber: { fontSize: 14.5, fontWeight: 800, color: "var(--ink)" },
  copyBtn: { display: "flex", alignItems: "center", gap: 5, border: "1px solid var(--line)", background: "#fff", borderRadius: 8, padding: "6px 10px", fontSize: 12, fontWeight: 700, color: "var(--sahy-blue)" },
  checkboxRow: { display: "flex", gap: 8, fontSize: 12.5, lineHeight: 1.5, alignItems: "flex-start" },
  submitBtn: {
    background: "var(--sahy-orange)", color: "#fff", border: "none", borderRadius: 12, padding: "15px 18px",
    fontWeight: 800, fontSize: 15, display: "flex", alignItems: "center", justifyContent: "center", gap: 6, marginTop: 4,
  },
  lockNote: { display: "flex", alignItems: "center", gap: 6, fontSize: 11.5, color: "var(--muted)", justifyContent: "center" },
};
