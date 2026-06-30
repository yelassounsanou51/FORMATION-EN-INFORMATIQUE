export const WHATSAPP_INVITE_LINK = "https://chat.whatsapp.com/JXlgyNyJq1Q6LGzOVnZwHe";

export const PAYMENT_NUMBERS = [
  { operator: "Orange Money", number: "+226 54 61 26 08" },
  { operator: "Moov Money", number: "+226 71 79 30 40" },
];

export const OPTIONS_INSCRIPTION = [
  {
    id: "reservation",
    label: "Reservation de place",
    prix: 2500,
    description: "Reservez votre place pour la formation. Le solde restant sera a regler a l'entree.",
    avantages: [
      "Place garantie dans la formation",
      "Paiement du solde a l'entree",
      "Recu de reservation officiel",
    ],
    badge: null,
  },
  {
    id: "complet",
    label: "Inscription complete",
    prix: 12500,
    description: "Payez la totalite et participez a la formation sans aucun souci.",
    avantages: [
      "Acces complet a tous les modules",
      "Aucun paiement supplementaire",
      "Attestation de formation incluse",
    ],
    badge: "Recommande",
  },
];

export const FORMATION = {
  title: "Informatique Bureautique",
  subtitle: "Formation professionnelle",
  organisateur: "SAHY TECHNOLOGIE",
  modules: [
    { name: "Initiation a l'informatique", desc: "Les bases du materiel et du systeme" },
    { name: "Microsoft Word", desc: "Redaction et mise en forme de documents" },
    { name: "Microsoft Excel", desc: "Tableaux, calculs et graphiques" },
    { name: "Microsoft PowerPoint", desc: "Presentations professionnelles" },
    { name: "Initiation a Internet", desc: "Navigation, recherche, messagerie" },
    { name: "Initiation a l'IA", desc: "Utiliser les outils d'intelligence artificielle" },
  ],
  lieu: "Bobo-Dioulasso (lieu a preciser)",
  debut: "03 Aout 2026",
  duree: "1 semaine",
  contacts: ["+226 54 32 06 37", "+226 71 79 30 40"],
};

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
<<<<<<< HEAD
  return n.toLocaleString("fr-FR").replace(/[\s\u00A0\u202F]/g, " ") + " FCFA";
=======
     // toLocaleString("fr-FR") insère un espace insécable Unicode (U+202F) comme
     // séparateur de milliers. pdf-lib (police standard WinAnsi) ne sait pas
     // encoder ce caractère et plante. On le remplace systématiquement par un
     // espace normal, sûr partout (web, PDF serveur, PDF navigateur).
     return n.toLocaleString("fr-FR").replace(/[\s\u00A0\u202F]/g, " ") + " FCFA";
   }
>>>>>>> 0b9bceea3ec9913cd9ff0d70ca2c05a9376d1e21
}
