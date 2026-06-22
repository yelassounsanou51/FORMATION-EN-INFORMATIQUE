import { FORMATION } from "@/lib/config";

export default function Footer() {
  return (
    <footer style={styles.footer}>
      <div style={styles.footerInner}>
        <div>
          <strong>{FORMATION.title}</strong> — {FORMATION.lieu}
        </div>
        <div>Infos : {FORMATION.contacts.join(" · ")}</div>
      </div>
    </footer>
  );
}

const styles = {
  footer: { background: "var(--navy)", color: "#cbd5e1", padding: "16px 20px" },
  footerInner: {
    maxWidth: 1100,
    margin: "0 auto",
    display: "flex",
    justifyContent: "space-between",
    fontSize: 12.5,
    flexWrap: "wrap",
    gap: 6,
  },
};
