"use client";

import Link from "next/link";
import { MapPin, Clock3, ArrowRight, CheckCircle2, Star, Laptop2 } from "lucide-react";
import TopBar from "@/components/TopBar";
import Footer from "@/components/Footer";
import ArcMark from "@/components/ArcMark";
import { FORMATION, OPTIONS_INSCRIPTION, formatFCFA } from "@/lib/config";

export default function HomePage() {
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
            Maitrisez l'outil
            <br />
            <span style={{ color: "var(--sahy-orange)" }}>informatique</span>
          </h1>
          <p style={styles.heroText}>
            Word, Excel, PowerPoint, Internet et Intelligence Artificielle — une semaine pour
            prendre en main la suite bureautique, a Bobo-Dioulasso.
          </p>
          <div style={styles.infoChips}>
            <span style={styles.chip}><MapPin size={15} /> {FORMATION.lieu}</span>
            <span style={styles.chip}><Clock3 size={15} /> Debut le {FORMATION.debut} · {FORMATION.duree}</span>
          </div>
        </div>
      </section>

      {/* MODULES */}
      <section style={styles.section}>
        <div style={styles.sectionInner}>
          <h2 style={styles.sectionTitle}>Ce que vous allez apprendre</h2>
          <div style={styles.modulesGrid}>
            {FORMATION.modules.map((m) => (
              <div key={m.name} style={styles.moduleCard}>
                <div style={styles.moduleIcon}><Laptop2 size={18} color="var(--sahy-blue)" /></div>
                <div style={styles.moduleName}>{m.name}</div>
                <div style={styles.moduleDesc}>{m.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* OPTIONS D'INSCRIPTION */}
      <section style={styles.optionsSection}>
        <div style={styles.sectionInner}>
          <h2 style={styles.sectionTitle}>Choisissez votre formule</h2>
          <p style={styles.optionsSubtitle}>
            Deux options adaptees a votre situation. Dans les deux cas, votre place est reservee
            et vous recevez un recu officiel.
          </p>
          <div style={styles.optionsGrid}>
            {OPTIONS_INSCRIPTION.map((opt) => (
              <div key={opt.id} style={{ ...styles.optionCard, ...(opt.badge ? styles.optionCardFeatured : {}) }}>
                {opt.badge && (
                  <div style={styles.badgeWrap}>
                    <span style={styles.badge}><Star size={12} /> {opt.badge}</span>
                  </div>
                )}
                <div style={styles.optionPrix}>{formatFCFA(opt.prix)}</div>
                <div style={styles.optionLabel}>{opt.label}</div>
                <p style={styles.optionDesc}>{opt.description}</p>
                <ul style={styles.avantagesList}>
                  {opt.avantages.map((a) => (
                    <li key={a} style={styles.avantagesItem}>
                      <CheckCircle2 size={15} style={{ color: opt.badge ? "var(--sahy-orange)" : "var(--success)", flexShrink: 0 }} />
                      {a}
                    </li>
                  ))}
                </ul>
                <Link
                  href={`/inscription?option=${opt.id}`}
                  style={{ ...styles.optionBtn, ...(opt.badge ? styles.optionBtnFeatured : {}) }}
                >
                  S'inscrire <ArrowRight size={16} />
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}

const styles = {
  page: { minHeight: "100vh", display: "flex", flexDirection: "column" },
  hero: {
    background: "linear-gradient(135deg, var(--sahy-blue) 0%, var(--sahy-blue-dark) 100%)",
    color: "#fff", position: "relative", overflow: "hidden", padding: "64px 24px 80px",
  },
  heroArc: { position: "absolute", right: -80, top: -60, opacity: 0.18, filter: "brightness(2)" },
  heroInner: { maxWidth: 640, margin: "0 auto", position: "relative", zIndex: 1 },
  eyebrow: { fontSize: 12.5, fontWeight: 700, letterSpacing: 1.2, color: "var(--sahy-orange)", textTransform: "uppercase" },
  h1: { fontFamily: "var(--font-display)", fontSize: 46, lineHeight: 1.08, margin: "14px 0 16px", fontWeight: 800 },
  heroText: { fontSize: 16, color: "#dbe4f7", lineHeight: 1.65, maxWidth: 480, marginBottom: 22 },
  infoChips: { display: "flex", gap: 10, flexWrap: "wrap" },
  chip: {
    display: "flex", alignItems: "center", gap: 6, fontSize: 13, fontWeight: 600,
    color: "#fff", background: "rgba(255,255,255,0.12)", border: "1px solid rgba(255,255,255,0.25)",
    borderRadius: 100, padding: "7px 14px",
  },
  section: { padding: "64px 24px" },
  sectionInner: { maxWidth: 1140, margin: "0 auto" },
  sectionTitle: { fontFamily: "var(--font-display)", fontSize: 28, fontWeight: 800, color: "var(--sahy-blue)", margin: "0 0 24px" },
  modulesGrid: { display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 18 },
  moduleCard: { background: "#fff", border: "1px solid var(--line)", borderRadius: 16, padding: 22 },
  moduleIcon: { width: 38, height: 38, borderRadius: 10, background: "#eaf0fb", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 14 },
  moduleName: { fontWeight: 700, fontSize: 15, color: "var(--ink)", marginBottom: 4 },
  moduleDesc: { fontSize: 13, color: "var(--muted)", lineHeight: 1.5 },
  optionsSection: { background: "#fff", borderTop: "1px solid var(--line)", padding: "64px 24px 80px" },
  optionsSubtitle: { fontSize: 15, color: "var(--muted)", lineHeight: 1.65, margin: "-12px 0 36px", maxWidth: 560 },
  optionsGrid: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24, maxWidth: 800, margin: "0 auto" },
  optionCard: {
    background: "var(--paper)", border: "2px solid var(--line)", borderRadius: 22, padding: 32,
    display: "flex", flexDirection: "column", gap: 12, position: "relative",
  },
  optionCardFeatured: {
    background: "var(--sahy-blue)", border: "2px solid var(--sahy-blue)", color: "#fff",
  },
  badgeWrap: { position: "absolute", top: -14, left: "50%", transform: "translateX(-50%)" },
  badge: {
    display: "inline-flex", alignItems: "center", gap: 5, background: "var(--sahy-orange)",
    color: "#fff", fontSize: 11.5, fontWeight: 800, borderRadius: 100, padding: "5px 14px",
    letterSpacing: 0.3,
  },
  optionPrix: { fontFamily: "var(--font-display)", fontSize: 38, fontWeight: 800, color: "var(--sahy-orange)", lineHeight: 1 },
  optionLabel: { fontFamily: "var(--font-display)", fontSize: 18, fontWeight: 700, marginBottom: 4 },
  optionDesc: { fontSize: 13.5, lineHeight: 1.6, opacity: 0.85, margin: 0 },
  avantagesList: { listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: 8 },
  avantagesItem: { display: "flex", alignItems: "flex-start", gap: 8, fontSize: 13.5, lineHeight: 1.4 },
  optionBtn: {
    display: "flex", alignItems: "center", justifyContent: "center", gap: 8, marginTop: 8,
    background: "var(--sahy-blue)", color: "#fff", textDecoration: "none", fontWeight: 800,
    fontSize: 14.5, padding: "14px 20px", borderRadius: 14,
  },
  optionBtnFeatured: { background: "var(--sahy-orange)" },
};
