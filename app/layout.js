import "./globals.css";

export const metadata = {
  title: "Informatique Bureautique — SAHY TECHNOLOGIE",
  description:
    "Inscrivez-vous à la formation professionnelle Informatique Bureautique organisée par SAHY TECHNOLOGIE à Bobo-Dioulasso : Word, Excel, PowerPoint, Internet et IA.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="fr">
      <body>{children}</body>
    </html>
  );
}
