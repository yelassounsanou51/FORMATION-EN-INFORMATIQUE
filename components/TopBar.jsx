"use client";

import Link from "next/link";
import Image from "next/image";

export default function TopBar() {
  return (
    <header style={styles.topbar}>
      <div style={styles.inner}>
        <Link href="/" style={styles.brand}>
          <div style={styles.logoWrap}>
            <Image src="/logo.png" alt="SAHY TECHNOLOGIE" width={36} height={36} style={{ objectFit: "contain" }} />
          </div>
          <div>
            <div style={styles.brandTitle}>SAHY TECHNOLOGIE</div>
            <div style={styles.brandSub}>Informatique Bureautique</div>
          </div>
        </Link>
        <nav style={styles.nav}>
          <Link href="/" style={styles.navLink}>
            S'inscrire
          </Link>
          <Link href="/suivi" style={styles.navLink}>
            Suivre mon inscription
          </Link>
          <Link href="/admin" style={styles.navLinkGhost}>
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
    zIndex: 20,
  },
  inner: {
    maxWidth: 1140,
    margin: "0 auto",
    padding: "14px 24px",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    flexWrap: "wrap",
    gap: 12,
  },
  brand: { display: "flex", alignItems: "center", gap: 10, textDecoration: "none" },
  logoWrap: {
    width: 42,
    height: 42,
    borderRadius: 10,
    border: "1px solid var(--line)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    background: "#fff",
  },
  brandTitle: {
    fontFamily: "var(--font-display)",
    fontWeight: 700,
    fontSize: 14,
    color: "var(--sahy-blue)",
    letterSpacing: 0.2,
  },
  brandSub: { fontSize: 11.5, color: "var(--muted)" },
  nav: { display: "flex", gap: 8, flexWrap: "wrap" },
  navLink: {
    color: "var(--ink)",
    textDecoration: "none",
    fontSize: 13,
    fontWeight: 600,
    padding: "9px 14px",
    borderRadius: 8,
  },
  navLinkGhost: {
    color: "var(--sahy-blue)",
    textDecoration: "none",
    fontSize: 13,
    fontWeight: 700,
    padding: "9px 14px",
    borderRadius: 8,
    border: "1px solid var(--sahy-blue)",
  },
};
