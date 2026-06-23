import { EMAIL_FROM, FORMATION, WHATSAPP_INVITE_LINK, formatFCFA } from "@/lib/config";

// Envoie l'email de confirmation avec le reçu en pièce jointe (PDF en base64)
// et le lien WhatsApp. Échoue silencieusement (renvoie {success:false}) plutôt
// que de bloquer la confirmation de l'inscription si l'email ne part pas —
// l'organisateur garde toujours la main via la page /suivi.
export async function sendConfirmationEmail(record, pdfBase64) {
  if (!process.env.RESEND_API_KEY) {
    console.error("RESEND_API_KEY manquant : email non envoyé.");
    return { success: false, error: "Configuration email manquante." };
  }
  if (!record.email) {
    return { success: false, error: "Aucune adresse email pour cette inscription." };
  }

  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 520px; margin: 0 auto; color: #0f1b3d;">
      <div style="background:#c8102e;color:#fff;border-radius:12px;padding:16px 20px;margin-bottom:20px;">
        <div style="font-size:18px;font-weight:bold;">Inscription confirmée ✅</div>
        <div style="font-size:13px;opacity:0.9;">${FORMATION.subtitle} — ${FORMATION.title}</div>
      </div>
      <p>Bonjour ${record.prenom},</p>
      <p>
        Votre paiement a été vérifié et votre inscription à la formation
        <strong>${FORMATION.title}</strong> est désormais <strong>confirmée</strong>.
      </p>
      <p>
        Numéro de reçu : <strong>${record.id}</strong><br/>
        Montant : <strong>${formatFCFA(record.montant)}</strong><br/>
        Début : ${FORMATION.debut} — ${FORMATION.lieu}
      </p>
      <p>Votre reçu officiel est joint à cet email au format PDF.</p>
      <p style="margin-top:24px;">
        <a href="${WHATSAPP_INVITE_LINK}" style="background:#25D366;color:#fff;text-decoration:none;padding:12px 20px;border-radius:10px;font-weight:bold;display:inline-block;">
          Rejoindre le groupe WhatsApp
        </a>
      </p>
      <p style="font-size:12px;color:#94a3b8;margin-top:24px;">
        ${FORMATION.organisateur} — ${FORMATION.contacts.join(" · ")}
      </p>
    </div>
  `;

  try {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: EMAIL_FROM,
        to: record.email,
        subject: `Inscription confirmée — ${FORMATION.title}`,
        html,
        attachments: pdfBase64
          ? [
              {
                filename: `recu_${record.id}.pdf`,
                content: pdfBase64,
              },
            ]
          : undefined,
      }),
    });

    if (!res.ok) {
      const errBody = await res.text();
      console.error("Erreur Resend:", errBody);
      return { success: false, error: "L'envoi de l'email a échoué." };
    }

    return { success: true };
  } catch (err) {
    console.error("Erreur réseau Resend:", err);
    return { success: false, error: "Impossible de contacter le service d'email." };
  }
}
