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
  modules: [
    "Initiation à l'informatique",
    "Microsoft PowerPoint",
    "Microsoft Word",
    "Microsoft Excel",
    "Initiation à Internet",
    "Initiation à l'IA",
  ],
  lieu: "Bobo-Dioulasso (lieu à préciser)",
  debut: "03 Août 2026",
  duree: "1 semaine",
  contacts: ["+226 54 32 06 37", "+226 71 79 30 40"],
};

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
