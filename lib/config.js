export const WHATSAPP_INVITE_LINK = "https://chat.whatsapp.com/JXlgyNyJq1Q6LGzOVnZwHe";

export const PAYMENT_NUMBERS = [
  { operator: "Orange Money", number: "+226 54 61 26 08" },
  { operator: "Moov Money", number: "+226 71 79 30 40" },
];

export const OPTIONS_INSCRIPTION = [
  {
    id: "reservation",
    label: "Réservation de place",
    prix: 2500,
    description: "Réservez votre place pour la formation. Le solde restant sera à régler à l'entrée.",
    avantages: [
      "Place garantie dans la formation",
      "Paiement du solde à l'entrée",
      "Reçu de réservation officiel",
    ],
    badge: null,
  },
  {
    id: "complet",
    label: "Inscription complète",
    prix: 12500,
    description: "Payez la totalité et participez à la formation sans aucun souci.",
    avantages: [
      "Accès complet à tous les modules",
      "Aucun paiement supplémentaire",
      "Attestation de formation incluse",
    ],
    badge: "Recommandé",
  },
];

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
  debut: "14 Septembre 2026",
  fin: "19 Septembre 2026",
  duree: "6 jours",
  contacts: ["+226 54 32 06 37", "+226 71 79 30 40"],
};


export function genReceiptNumber() {
  // Note : crypto est un module Node.js natif, disponible côté serveur
  // (cette fonction n'est jamais appelée depuis le navigateur).
  const crypto = require("crypto");
  const d = new Date();
  const stamp = `${d.getFullYear()}${String(d.getMonth() + 1).padStart(2, "0")}${String(
    d.getDate()
  ).padStart(2, "0")}`;
  // 6 chiffres tirés par un générateur cryptographique plutôt que Math.random :
  // 900 000 combinaisons possibles par jour au lieu de 9 000, et non prévisible.
  const rand = crypto.randomInt(100000, 999999);
  return `IB-${stamp}-${rand}`;
}

export function formatFCFA(n) {
  return n.toLocaleString("fr-FR").replace(/[\s\u00A0\u202F]/g, " ") + " FCFA";
}
