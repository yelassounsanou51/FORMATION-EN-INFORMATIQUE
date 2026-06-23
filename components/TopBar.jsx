"use client";

import Link from "next/link";
import Image from "next/image";

export default function TopBar() {
  return (
    <header style={styles.topbar}>
      <div style={styles.topbarInner}>
        <div style={styles.brand}>
          <div style={styles.logoWrap}>
            <Image src="/logo.png" alt="SAHY TECHNOLOGIE" width={40} height={40} style={{ objectFit: "contain" }} />
          </div>
          <div>
            <div style={styles.brandTitle}>Informatique Bureautique</div>
            <div style={styles.brandSub}>SAHY TECHNOLOGIE — Bobo-Dioulasso</div>
          </div>
        </div>
        <nav style={styles.nav}>
          <Link href="/" style={styles.navBtn}>
            S'inscrire
          </Link>
          <Link href="/suivi" style={styles.navBtn}>
            Suivre mon inscription
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
    flexWrap: "wrap",
    gap: 10,
  },
  brand: { display: "flex", alignItems: "center", gap: 10 },
  logoWrap: {
    width: 44,
    height: 44,
    borderRadius: 10,
    border: "1px solid var(--line)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    background: "#fff",
    overflow: "hidden",
  },
  brandTitle: { fontWeight: 700, fontSize: 14, lineHeight: 1.2, color: "var(--navy)" },
  brandSub: { fontSize: 11.5, color: "#64748b" },
  nav: { display: "flex", gap: 8, flexWrap: "wrap" },
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
