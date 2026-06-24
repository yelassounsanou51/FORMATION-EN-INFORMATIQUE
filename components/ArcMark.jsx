// Élément signature de la plateforme : un double arc bleu/orange qui reprend
// le motif du logo SAHY TECHNOLOGIE (deux orbites entrelacées qui s'ouvrent
// vers la droite). Utilisé en filigrane sur le hero et comme séparateur de
// section, jamais comme simple décoration répétée sans fonction.
export default function ArcMark({ size = 120, animate = false, style }) {
  const id = "arcmark";
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 120 120"
      fill="none"
      style={style}
      aria-hidden="true"
    >
      <circle
        cx="60"
        cy="60"
        r="46"
        stroke="var(--sahy-blue)"
        strokeWidth="9"
        strokeLinecap="round"
        strokeDasharray="216 70"
        transform="rotate(-15 60 60)"
        style={animate ? { strokeDasharray: 340, animation: "arcDraw 1.1s ease-out forwards" } : undefined}
      />
      <circle
        cx="60"
        cy="60"
        r="34"
        stroke="var(--sahy-orange)"
        strokeWidth="7"
        strokeLinecap="round"
        strokeDasharray="160 60"
        transform="rotate(20 60 60)"
        style={
          animate
            ? { strokeDasharray: 250, animation: "arcDraw 1.1s ease-out 0.15s forwards" }
            : undefined
        }
      />
    </svg>
  );
}
