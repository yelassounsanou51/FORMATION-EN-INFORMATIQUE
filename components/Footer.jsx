import { FORMATION } from "@/lib/config";

export default function Footer() {
  return (
    <footer style={styles.footer}>
      <div style={styles.inner}>
        <div style={styles.left}>
          <strong>{FORMATION.organisateur}</strong>
          <span style={styles.dot}>·</span>
          {FORMATION.lieu}
        </div>
        <div style={styles.right}>Infos : {FORMATION.contacts.join(" · ")}</div>
      </div>
    </footer>
  );
}

const styles = {
  footer: { background: "var(--sahy-blue-dark)", color: "#cdd7ee", padding: "20px 24px", marginTop: 40 },
  inner: {
    maxWidth: 1140,
    margin: "0 auto",
    display: "flex",
    justifyContent: "space-between",
    fontSize: 12.5,
    flexWrap: "wrap",
    gap: 8,
  },
  left: { display: "flex", alignItems: "center", gap: 8 },
  dot: { opacity: 0.5 },
  right: { opacity: 0.85 },
};
