"use client";

import Link from "next/link";

export default function TopBar() {
  return (
    <header style={styles.topbar}>
      <div style={styles.topbarInner}>
        <div style={styles.brand}>
          <div style={styles.brandMark}>IB</div>
          <div>
            <div style={styles.brandTitle}>Informatique Bureautique</div>
            <div style={styles.brandSub}>Inscriptions — Bobo-Dioulasso</div>
          </div>
        </div>
        <nav style={styles.nav}>
          <Link href="/" style={styles.navBtn}>
            S'inscrire
          </Link>
          <Link href="/admin" style={styles.navBtn}>
            Espace organisateur
          </Link>
        </nav>
      </div>
    </header>
  );
}

const styles = {
  topbar: {
    background: "#fff",
    borderBottom: "1px solid var(--line)",
    position: "sticky",
    top: 0,
    zIndex: 10,
  },
  topbarInner: {
    maxWidth: 1100,
    margin: "0 auto",
    padding: "14px 20px",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
  },
  brand: { display: "flex", alignItems: "center", gap: 10 },
  brandMark: {
    width: 38,
    height: 38,
    borderRadius: 10,
    background: "var(--red)",
    color: "#fff",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontWeight: 800,
    fontSize: 15,
  },
  brandTitle: { fontWeight: 700, fontSize: 14, lineHeight: 1.2, color: "var(--navy)" },
  brandSub: { fontSize: 11.5, color: "#64748b" },
  nav: { display: "flex", gap: 8 },
  navBtn: {
    border: "1px solid var(--line)",
    background: "#fff",
    color: "var(--navy)",
    padding: "8px 14px",
    borderRadius: 8,
    fontSize: 13,
    fontWeight: 600,
    textDecoration: "none",
  },
};
