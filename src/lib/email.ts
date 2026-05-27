import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  host:   process.env.SMTP_HOST   || 'smtp.gmail.com',
  port:   Number(process.env.SMTP_PORT) || 587,
  secure: process.env.SMTP_SECURE === 'true',
  auth: {
    user: process.env.SMTP_USER || '',
    pass: process.env.SMTP_PASS || '',
  },
});

const FROM = process.env.SMTP_FROM || 'Nuance du Monde <noreply@nuancedumonde.com>';
const SITE  = process.env.NEXT_PUBLIC_BASE_URL || 'https://nuancedumonde.com';

export async function sendProValidationEmail(professional: {
  email: string;
  first_name?: string | null;
  last_name?: string | null;
  agency_name: string;
}) {
  const prenom = professional.first_name || '';
  const nom    = professional.last_name  || '';
  const name   = `${prenom} ${nom}`.trim() || professional.agency_name;

  await transporter.sendMail({
    from:    FROM,
    to:      'jfidelica@gmail.com', // TEST - remplacer par: professional.email
    // to:      professional.email,
    subject: 'Votre accès Espace Agents de voyage - Nuance du Monde',
    html: `
<!DOCTYPE html>
<html lang="fr">
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:#f4f4f4;font-family:Arial,sans-serif">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f4f4f4;padding:32px 0">
    <tr><td align="center">
      <table width="600" cellpadding="0" cellspacing="0" style="background:#fff;border-radius:12px;overflow:hidden;box-shadow:0 2px 8px rgba(0,0,0,.08)">
        <!-- Header -->
        <tr>
          <td style="background:#000;padding:32px 40px;text-align:center">
            <img src="${SITE}/images/logo.noire_blanc.png" alt="Nuance du Monde" height="48" style="filter:invert(1)">
          </td>
        </tr>
        <!-- Gold bar -->
        <tr><td style="background:#FFFF00;height:4px"></td></tr>
        <!-- Body -->
        <tr>
          <td style="padding:40px">
            <h1 style="margin:0 0 16px;font-size:24px;color:#000">Bienvenue dans l'Espace Agents, ${name} !</h1>
            <p style="margin:0 0 16px;color:#444;line-height:1.6">
              Votre demande d'accès à l'<strong>Espace Agents de voyage</strong> de Nuance du Monde a été <strong style="color:#000">validée</strong>.
            </p>
            <p style="margin:0 0 24px;color:#444;line-height:1.6">
              Vous pouvez maintenant vous connecter avec votre prénom, nom et numéro de permis pour accéder à nos offres exclusives.
            </p>
            <div style="text-align:center;margin:32px 0">
              <a href="${SITE}/espace-pro"
                 style="display:inline-block;background:#000;color:#FFFF00;font-weight:bold;padding:14px 32px;border-radius:8px;text-decoration:none;font-size:16px">
                Accéder à mon espace
              </a>
            </div>
            <p style="margin:24px 0 0;color:#888;font-size:13px;line-height:1.5">
              Si vous n'êtes pas à l'origine de cette demande, ignorez simplement cet email.
            </p>
          </td>
        </tr>
        <!-- Footer -->
        <tr>
          <td style="background:#f4f4f4;padding:24px 40px;text-align:center;border-top:1px solid #eee">
            <p style="margin:0;font-size:12px;color:#999">
              © ${new Date().getFullYear()} Nuance du Monde —
              <a href="${SITE}" style="color:#999">nuancedumonde.com</a>
            </p>
          </td>
        </tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`,
  });
}

export async function sendPasswordSetupEmail(professional: {
  email: string;
  first_name?: string | null;
  last_name?: string | null;
  agency_name: string;
}, token: string) {
  const prenom = professional.first_name || '';
  const nom    = professional.last_name  || '';
  const name   = `${prenom} ${nom}`.trim() || professional.agency_name;
  const setupUrl = `${SITE}/configurer-mot-de-passe?token=${token}`;

  await transporter.sendMail({
    from:    FROM,
    to:      professional.email,
    subject: 'Configurez votre mot de passe - Nuance du Monde',
    html: `
<!DOCTYPE html>
<html lang="fr">
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:#f4f4f4;font-family:Arial,sans-serif">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f4f4f4;padding:32px 0">
    <tr><td align="center">
      <table width="600" cellpadding="0" cellspacing="0" style="background:#fff;border-radius:12px;overflow:hidden;box-shadow:0 2px 8px rgba(0,0,0,.08)">
        <tr><td style="background:#000;padding:32px 40px;text-align:center">
          <img src="${SITE}/images/logo.noire_blanc.png" alt="Nuance du Monde" height="48" style="filter:invert(1)">
        </td></tr>
        <tr><td style="background:#FFFF00;height:4px"></td></tr>
        <tr><td style="padding:40px">
          <h1 style="margin:0 0 16px;font-size:24px;color:#000">Bienvenue, ${name}!</h1>
          <p style="margin:0 0 16px;color:#444;line-height:1.6">
            Votre compte a été <strong>validé avec succès</strong>. Il ne reste plus qu'à configurer votre mot de passe.
          </p>
          <p style="margin:0 0 24px;color:#444;line-height:1.6">
            Cliquez sur le lien ci-dessous pour finaliser votre accès à l'Espace Agents:
          </p>
          <div style="text-align:center;margin:32px 0">
            <a href="${setupUrl}"
               style="display:inline-block;background:#000;color:#FFFF00;font-weight:bold;padding:14px 32px;border-radius:8px;text-decoration:none;font-size:16px">
              Configurer mon mot de passe
            </a>
          </div>
          <p style="margin:24px 0 0;color:#888;font-size:13px;line-height:1.5">
            Ce lien expire dans 24 heures.
          </p>
        </td></tr>
        <tr><td style="background:#f4f4f4;padding:24px 40px;text-align:center;border-top:1px solid #eee">
          <p style="margin:0;font-size:12px;color:#999">
            © ${new Date().getFullYear()} Nuance du Monde —
            <a href="${SITE}" style="color:#999">nuancedumonde.com</a>
          </p>
        </td></tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`,
  });
}

export async function sendPasswordResetEmail(professional: {
  email: string;
  first_name?: string | null;
  last_name?: string | null;
  agency_name: string;
}, token: string) {
  const prenom = professional.first_name || '';
  const nom    = professional.last_name  || '';
  const name   = `${prenom} ${nom}`.trim() || professional.agency_name;
  const resetUrl = `${SITE}/configurer-mot-de-passe?token=${token}&reset=true`;

  await transporter.sendMail({
    from:    FROM,
    to:      professional.email,
    subject: 'Réinitialisation de votre mot de passe - Nuance du Monde',
    html: `
<!DOCTYPE html>
<html lang="fr">
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:#f4f4f4;font-family:Arial,sans-serif">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f4f4f4;padding:32px 0">
    <tr><td align="center">
      <table width="600" cellpadding="0" cellspacing="0" style="background:#fff;border-radius:12px;overflow:hidden;box-shadow:0 2px 8px rgba(0,0,0,.08)">
        <tr><td style="background:#000;padding:32px 40px;text-align:center">
          <img src="${SITE}/images/logo.noire_blanc.png" alt="Nuance du Monde" height="48" style="filter:invert(1)">
        </td></tr>
        <tr><td style="background:#FFFF00;height:4px"></td></tr>
        <tr><td style="padding:40px">
          <h1 style="margin:0 0 16px;font-size:24px;color:#000">Réinitialisation de mot de passe</h1>
          <p style="margin:0 0 24px;color:#444;line-height:1.6">
            Cliquez sur le lien ci-dessous pour créer un nouveau mot de passe:
          </p>
          <div style="text-align:center;margin:32px 0">
            <a href="${resetUrl}"
               style="display:inline-block;background:#000;color:#FFFF00;font-weight:bold;padding:14px 32px;border-radius:8px;text-decoration:none;font-size:16px">
              Réinitialiser mon mot de passe
            </a>
          </div>
          <p style="margin:24px 0 0;color:#888;font-size:13px;line-height:1.5">
            Ce lien expire dans 24 heures. Si vous n'avez pas demandé cette réinitialisation, ignorez cet email.
          </p>
        </td></tr>
        <tr><td style="background:#f4f4f4;padding:24px 40px;text-align:center;border-top:1px solid #eee">
          <p style="margin:0;font-size:12px;color:#999">
            © ${new Date().getFullYear()} Nuance du Monde —
            <a href="${SITE}" style="color:#999">nuancedumonde.com</a>
          </p>
        </td></tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`,
  });
}

export async function sendPendingConfirmationEmail(professional: {
  email: string;
  first_name?: string | null;
  last_name?: string | null;
  agency_name: string;
}) {
  const prenom = professional.first_name || '';
  const nom    = professional.last_name  || '';
  const name   = `${prenom} ${nom}`.trim() || professional.agency_name;

  await transporter.sendMail({
    from:    FROM,
    to:      professional.email,
    subject: 'Votre inscription a été reçue - Nuance du Monde',
    html: `
<!DOCTYPE html>
<html lang="fr">
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:#f4f4f4;font-family:Arial,sans-serif">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f4f4f4;padding:32px 0">
    <tr><td align="center">
      <table width="600" cellpadding="0" cellspacing="0" style="background:#fff;border-radius:12px;overflow:hidden;box-shadow:0 2px 8px rgba(0,0,0,.08)">
        <tr><td style="background:#000;padding:32px 40px;text-align:center">
          <img src="${SITE}/images/logo.noire_blanc.png" alt="Nuance du Monde" height="48" style="filter:invert(1)">
        </td></tr>
        <tr><td style="background:#FFFF00;height:4px"></td></tr>
        <tr><td style="padding:40px">
          <h1 style="margin:0 0 16px;font-size:24px;color:#000">Merci, ${name}!</h1>
          <p style="margin:0 0 16px;color:#444;line-height:1.6">
            Votre inscription à l'Espace Agents de voyage a été reçue avec succès.
          </p>
          <p style="margin:0 0 24px;color:#444;line-height:1.6">
            Votre demande est actuellement en cours de vérification. Vous recevrez un email de confirmation dès que votre accès sera validé.
          </p>
          <p style="margin:24px 0 0;color:#888;font-size:13px;line-height:1.5">
            Cela prend généralement quelques heures. Merci de votre patience!
          </p>
        </td></tr>
        <tr><td style="background:#f4f4f4;padding:24px 40px;text-align:center;border-top:1px solid #eee">
          <p style="margin:0;font-size:12px;color:#999">
            © ${new Date().getFullYear()} Nuance du Monde —
            <a href="${SITE}" style="color:#999">nuancedumonde.com</a>
          </p>
        </td></tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`,
  });
}

export async function sendBrochureRequestNotification(data: {
  full_name: string;
  agency_name: string;
  email: string;
  phone?: string;
  certificate_number: string;
  quantity: string;
  message?: string;
}) {
  const notificationEmails = process.env.BROCHURE_REQUEST_NOTIFICATION_EMAILS || '';

  if (!notificationEmails.trim()) {
    console.warn('BROCHURE_REQUEST_NOTIFICATION_EMAILS not configured');
    return;
  }

  const emailList = notificationEmails.split(',').map(email => email.trim()).filter(email => email);

  if (emailList.length === 0) {
    console.warn('No valid notification emails configured');
    return;
  }

  const emailContent = `
<!DOCTYPE html>
<html lang="fr">
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:#f4f4f4;font-family:Arial,sans-serif">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f4f4f4;padding:32px 0">
    <tr><td align="center">
      <table width="600" cellpadding="0" cellspacing="0" style="background:#fff;border-radius:12px;overflow:hidden;box-shadow:0 2px 8px rgba(0,0,0,.08)">
        <tr><td style="background:#000;padding:32px 40px;text-align:center">
          <h2 style="margin:0;color:#FFFF00">📋 Nouvelle Demande de Brochure</h2>
        </td></tr>
        <tr><td style="background:#FFFF00;height:4px"></td></tr>
        <tr><td style="padding:40px">
          <h1 style="margin:0 0 24px;font-size:20px;color:#000">Détails de la demande</h1>

          <table style="width:100%;border-collapse:collapse;margin-bottom:24px">
            <tr style="background:#f9f9f9">
              <td style="padding:12px;border:1px solid #eee;font-weight:bold;width:35%">Nom complet</td>
              <td style="padding:12px;border:1px solid #eee">${data.full_name}</td>
            </tr>
            <tr>
              <td style="padding:12px;border:1px solid #eee;font-weight:bold">Agence</td>
              <td style="padding:12px;border:1px solid #eee">${data.agency_name}</td>
            </tr>
            <tr style="background:#f9f9f9">
              <td style="padding:12px;border:1px solid #eee;font-weight:bold">Email</td>
              <td style="padding:12px;border:1px solid #eee"><a href="mailto:${data.email}">${data.email}</a></td>
            </tr>
            <tr>
              <td style="padding:12px;border:1px solid #eee;font-weight:bold">Téléphone</td>
              <td style="padding:12px;border:1px solid #eee">${data.phone || 'Non fourni'}</td>
            </tr>
            <tr style="background:#f9f9f9">
              <td style="padding:12px;border:1px solid #eee;font-weight:bold">Numéro de permis</td>
              <td style="padding:12px;border:1px solid #eee">${data.certificate_number}</td>
            </tr>
            <tr>
              <td style="padding:12px;border:1px solid #eee;font-weight:bold">Nombre d'exemplaires</td>
              <td style="padding:12px;border:1px solid #eee">${data.quantity}</td>
            </tr>
          </table>

          ${data.message ? `
          <h2 style="margin:24px 0 12px;font-size:16px;color:#000">Message</h2>
          <p style="margin:0;padding:12px;background:#f9f9f9;border-left:4px solid #FFFF00;color:#444">
            ${data.message.replace(/\n/g, '<br>')}
          </p>
          ` : ''}

          <p style="margin:32px 0 0;color:#888;font-size:13px;line-height:1.5">
            ⏰ Reçu le: ${new Date().toLocaleString('fr-CA')}
          </p>
        </td></tr>
        <tr><td style="background:#f4f4f4;padding:24px 40px;text-align:center;border-top:1px solid #eee">
          <p style="margin:0;font-size:12px;color:#999">
            © ${new Date().getFullYear()} Nuance du Monde
          </p>
        </td></tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`;

  // Envoyer à tous les emails configurés
  for (const recipientEmail of emailList) {
    try {
      await transporter.sendMail({
        from: FROM,
        to: recipientEmail,
        subject: `📋 Nouvelle demande de brochure - ${data.full_name}`,
        html: emailContent,
      });
    } catch (error) {
      console.error(`Failed to send notification to ${recipientEmail}:`, error);
    }
  }
}

export async function sendProRejectionEmail(professional: {
  email: string;
  first_name?: string | null;
  last_name?: string | null;
  agency_name: string;
}) {
  const prenom = professional.first_name || '';
  const nom    = professional.last_name  || '';
  const name   = `${prenom} ${nom}`.trim() || professional.agency_name;

  await transporter.sendMail({
    from:    FROM,
    to:      professional.email,
    subject: 'Votre demande d\'accès - Nuance du Monde',
    html: `
<!DOCTYPE html>
<html lang="fr">
<head><meta charset="utf-8"></head>
<body style="margin:0;padding:0;background:#f4f4f4;font-family:Arial,sans-serif">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f4f4f4;padding:32px 0">
    <tr><td align="center">
      <table width="600" cellpadding="0" cellspacing="0" style="background:#fff;border-radius:12px;overflow:hidden">
        <tr><td style="background:#000;padding:32px 40px;text-align:center">
          <img src="${SITE}/images/logo.noire_blanc.png" alt="Nuance du Monde" height="48" style="filter:invert(1)">
        </td></tr>
        <tr><td style="padding:40px">
          <h1 style="margin:0 0 16px;font-size:24px;color:#000">Bonjour ${name},</h1>
          <p style="margin:0 0 16px;color:#444;line-height:1.6">
            Suite à l'examen de votre dossier, nous ne sommes pas en mesure de valider votre accès à l'Espace Agents pour le moment.
          </p>
          <p style="margin:0 0 24px;color:#444;line-height:1.6">
            Pour plus d'informations, n'hésitez pas à nous contacter directement.
          </p>
          <div style="text-align:center">
            <a href="${SITE}/contact"
               style="display:inline-block;background:#000;color:#fff;font-weight:bold;padding:14px 32px;border-radius:8px;text-decoration:none">
              Nous contacter
            </a>
          </div>
        </td></tr>
        <tr><td style="background:#f4f4f4;padding:24px;text-align:center;border-top:1px solid #eee">
          <p style="margin:0;font-size:12px;color:#999">© ${new Date().getFullYear()} Nuance du Monde</p>
        </td></tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`,
  });
}
