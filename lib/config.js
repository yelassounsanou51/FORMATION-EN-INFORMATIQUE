export const WHATSAPP_INVITE_LINK = "https://chat.whatsapp.com/JXlgyNyJq1Q6LGzOVnZwHe";

export const PAYMENT_NUMBERS = [
  { operator: "Orange Money", number: "+226 54 61 26 08" },
  { operator: "Moov Money", number: "+226 71 79 30 40" },
];

export const PRICE_INSCRIPTION = 2500;
export const PRICE_PARTICIPATION = 10000;
export const TOTAL = PRICE_INSCRIPTION + PRICE_PARTICIPATION;

export const FORMATION = {
  title: "Informatique Bureautique",
  subtitle: "Formation professionnelle",
  organisateur: "SAHY TECHNOLOGIE",
  modules: [
    { name: "Initiation à l'informatique", desc: "Les bases du matériel et du système" },
    { name: "Microsoft Word", desc: "Rédaction et mise en forme de documents" },
    { name: "Microsoft Excel", desc: "Tableaux, calculs et graphiques" },
    { name: "Microsoft PowerPoint", desc: "Présentations professionnelles" },
    { name: "Initiation à Internet", desc: "Navigation, recherche, messagerie" },
    { name: "Initiation à l'IA", desc: "Utiliser les outils d'intelligence artificielle" },
  ],
  lieu: "Bobo-Dioulasso (lieu à préciser)",
  debut: "03 Août 2026",
  duree: "1 semaine",
  contacts: ["+226 54 32 06 37", "+226 71 79 30 40"],
};

// Adresse d'envoi des emails automatiques. Utilise temporairement le domaine
// de test de Resend (fonctionne immédiatement, sans configuration DNS).
// Dès que sahytechnologie.com est vérifié dans Resend (section Domains),
// remplace cette ligne par : "SAHY TECHNOLOGIE <inscription@sahytechnologie.com>"
export const EMAIL_FROM = "SAHY TECHNOLOGIE <onboarding@resend.dev>";

export function genReceiptNumber() {
  const d = new Date();
  const stamp = `${d.getFullYear()}${String(d.getMonth() + 1).padStart(2, "0")}${String(
    d.getDate()
  ).padStart(2, "0")}`;
  const rand = Math.floor(1000 + Math.random() * 9000);
  return `IB-${stamp}-${rand}`;
}

export function formatFCFA(n) {
  return n.toLocaleString("fr-FR").replace(/,/g, " ") + " FCFA";
}
