import { PDFDocument, rgb, StandardFonts } from "pdf-lib";
import { FORMATION, formatFCFA } from "@/lib/config";

// Génère le PDF du reçu côté serveur, encodé en base64 (utilisé pour la pièce
// jointe email). Reprend la mise en page du reçu affiché sur la page /merci.
export async function generateReceiptPdfBase64(record) {
  const doc = await PDFDocument.create();
  const page = doc.addPage([595, 770]);
  const font = await doc.embedFont(StandardFonts.Helvetica);
  const fontBold = await doc.embedFont(StandardFonts.HelveticaBold);

  const navy = rgb(0.06, 0.11, 0.24);
  const red = rgb(0.78, 0.06, 0.18);
  const gray = rgb(0.39, 0.45, 0.55);
  const lightLine = rgb(0.95, 0.95, 0.96);

  let y = 710;

  page.drawRectangle({ x: 40, y: y - 10, width: 60, height: 60, color: red, borderRadius: 12 });
  page.drawText("IB", { x: 60, y: y + 12, size: 20, font: fontBold, color: rgb(1, 1, 1) });

  page.drawText("Reçu d'inscription", { x: 115, y: y + 18, size: 16, font: fontBold, color: navy });
  page.drawText(`${FORMATION.subtitle} — ${FORMATION.title}`, {
    x: 115,
    y: y + 2,
    size: 10,
    font,
    color: gray,
  });

  y -= 90;
  page.drawRectangle({ x: 40, y, width: 515, height: 32, color: rgb(0.99, 0.93, 0.93), borderRadius: 8 });
  page.drawText(`N° de reçu : ${record.id}`, { x: 52, y: y + 11, size: 12, font: fontBold, color: red });

  y -= 55;
  const lines = [
    ["Nom et prénom", `${record.nom} ${record.prenom}`],
    ["Téléphone", record.telephone],
    ["Email", record.email || "—"],
    ["Sexe", record.sexe],
    ["Profession", record.profession || "—"],
    ["Opérateur", record.operateur],
    ["Référence transaction", record.transaction_ref || "Non fournie"],
    [
      "Date d'inscription",
      new Date(record.date_inscription).toLocaleString("fr-FR", { dateStyle: "long", timeStyle: "short" }),
    ],
    ["Statut", "Confirmé par l'organisateur"],
  ];

  for (const [label, value] of lines) {
    page.drawText(label, { x: 40, y, size: 11, font, color: gray });
    const valueWidth = font.widthOfTextAtSize(String(value), 11);
    page.drawText(String(value), { x: 555 - valueWidth, y, size: 11, font: fontBold, color: navy });
    page.drawLine({
      start: { x: 40, y: y - 8 },
      end: { x: 555, y: y - 8 },
      thickness: 1,
      color: lightLine,
    });
    y -= 26;
  }

  y -= 10;
  page.drawRectangle({ x: 40, y: y - 8, width: 515, height: 38, color: navy, borderRadius: 8 });
  page.drawText("Montant payé", { x: 52, y: y + 8, size: 12, font: fontBold, color: rgb(1, 1, 1) });
  const montantText = formatFCFA(record.montant);
  const montantWidth = fontBold.widthOfTextAtSize(montantText, 12);
  page.drawText(montantText, { x: 555 - montantWidth, y: y + 8, size: 12, font: fontBold, color: rgb(1, 1, 1) });

  y -= 60;
  const footnote = `Ce reçu confirme l'inscription validée à la formation ${FORMATION.title} (${FORMATION.debut}, ${FORMATION.lieu}). Émis par ${FORMATION.organisateur}.`;
  page.drawText(footnote, { x: 40, y, size: 9, font, color: gray, maxWidth: 515, lineHeight: 12 });

  const pdfBytes = await doc.save();
  return Buffer.from(pdfBytes).toString("base64");
}
