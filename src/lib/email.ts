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
    to:      professional.email,
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
