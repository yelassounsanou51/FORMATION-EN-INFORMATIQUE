import nodemailer from "nodemailer";
import { FORMATION, WHATSAPP_INVITE_LINK, formatFCFA } from "@/lib/config";

// Envoi via le SMTP de Gmail, avec le compte sahytechnologie@gmail.com.
// Nécessite un "mot de passe d'application" Gmail (pas le mot de passe
// habituel du compte) — voir SECURITE.md pour la marche à suivre.
function getTransporter() {
  return nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.GMAIL_USER,
      pass: process.env.GMAIL_APP_PASSWORD,
    },
  });
}

export async function sendConfirmationEmail(record, pdfBase64) {
  if (!process.env.GMAIL_USER || !process.env.GMAIL_APP_PASSWORD) {
    console.error("GMAIL_USER ou GMAIL_APP_PASSWORD manquant : email non envoyé.");
    return { success: false, error: "Configuration email manquante." };
  }
  if (!record.email) {
    return { success: false, error: "Aucune adresse email pour cette inscription." };
  }

  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 520px; margin: 0 auto; color: #15192b;">
      <div style="background:#0d3b8c;color:#fff;border-radius:12px;padding:18px 20px;margin-bottom:20px;">
        <div style="font-size:18px;font-weight:bold;">Inscription confirmée ✅</div>
        <div style="font-size:13px;opacity:0.85;">${FORMATION.subtitle} — ${FORMATION.title}</div>
      </div>
      <p>Bonjour ${record.prenom},</p>
      <p>
        Votre paiement a été vérifié et votre inscription à la formation
        <strong>${FORMATION.title}</strong> est désormais <strong>confirmée</strong>.
      </p>
      <p>
        Numéro de reçu : <strong>${record.id}</strong><br/>
        Montant : <strong>${formatFCFA(record.montant)}</strong><br/>
        Dates : Du ${FORMATION.debut} au ${FORMATION.fin} — ${FORMATION.lieu}
      </p>
      <p>Votre reçu officiel est joint à cet email au format PDF.</p>
      <p style="margin-top:24px;">
        <a href="${WHATSAPP_INVITE_LINK}" style="background:#ff7a1a;color:#fff;text-decoration:none;padding:12px 20px;border-radius:10px;font-weight:bold;display:inline-block;">
          Rejoindre le groupe WhatsApp
        </a>
      </p>
      <p style="font-size:12px;color:#94a3b8;margin-top:24px;">
        ${FORMATION.organisateur} — ${FORMATION.contacts.join(" · ")}
      </p>
    </div>
  `;

  try {
    const transporter = getTransporter();
    await transporter.sendMail({
      from: `"SAHY TECHNOLOGIE" <${process.env.GMAIL_USER}>`,
      to: record.email,
      subject: `Inscription confirmée — ${FORMATION.title}`,
      html,
      attachments: pdfBase64
        ? [
            {
              filename: `recu_${record.id}.pdf`,
              content: pdfBase64,
              encoding: "base64",
            },
          ]
        : undefined,
    });

    return { success: true };
  } catch (err) {
    console.error("Erreur envoi Gmail:", err);
    return { success: false, error: "L'envoi de l'email a échoué." };
  }
}
