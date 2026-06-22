import "./globals.css";

export const metadata = {
  title: "Inscription — Formation Informatique Bureautique | Bobo-Dioulasso",
  description:
    "Inscrivez-vous à la formation professionnelle Informatique Bureautique à Bobo-Dioulasso : Word, Excel, PowerPoint, Internet et IA.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="fr">
      <body>{children}</body>
    </html>
  );
}
