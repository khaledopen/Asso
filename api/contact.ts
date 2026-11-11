import nodemailer from "nodemailer";

interface ContactPayload {
  name?: unknown;
  email?: unknown;
  subject?: unknown;
  message?: unknown;
  consent?: unknown;
  website?: unknown;
}

const DEFAULT_RECIPIENT = "konesory321@gmail.com";
const DEFAULT_SITE_URL = "https://asso-pied.vercel.app";
const HELLOASSO_URL =
  "https://www.helloasso.com/associations/association-un-sourire-pour-tissem-et-tous-les-enfants";

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function cleanHeaderValue(value: string): string {
  return value.replace(/[\r\n]+/g, " ").trim();
}

function formatMessageHtml(value: string): string {
  return escapeHtml(value).replace(/\r?\n/g, "<br />");
}

function getSiteUrl(request: Request): string {
  const host =
    request.headers.get("x-forwarded-host") || request.headers.get("host");
  const proto = request.headers.get("x-forwarded-proto") || "https";
  if (host && !host.includes("localhost") && !host.includes("127.0.0.1")) {
    return `${proto}://${host}`;
  }
  return DEFAULT_SITE_URL;
}

function formatParisDate(date: Date): string {
  try {
    return new Intl.DateTimeFormat("fr-FR", {
      dateStyle: "long",
      timeStyle: "short",
      timeZone: "Europe/Paris",
    }).format(date);
  } catch {
    return date.toISOString();
  }
}

function buildEmailShell({
  logoUrl,
  badgeText,
  title,
  bodyHtml,
  footerNote,
}: {
  logoUrl: string;
  badgeText: string;
  title: string;
  bodyHtml: string;
  footerNote: string;
}): string {
  return `<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${escapeHtml(title)}</title>
</head>
<body style="margin:0;padding:0;background-color:#fbf9f6;font-family:'Helvetica Neue',Helvetica,Arial,sans-serif;color:#1c1719;-webkit-font-smoothing:antialiased;">
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="background-color:#fbf9f6;padding:32px 14px;">
    <tr>
      <td align="center">
        <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="max-width:600px;background-color:#ffffff;border:1px solid #eadfe4;border-radius:16px;overflow:hidden;box-shadow:0 10px 30px rgba(28,23,25,0.06);">
          <tr>
            <td style="background-color:#1c1719;padding:28px 32px;border-bottom:4px solid #e42976;">
              <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0">
                <tr>
                  <td width="76" valign="middle">
                    <img src="${logoUrl}" width="64" height="64" alt="Logo Un sourire pour Tissem" style="display:block;width:64px;height:64px;border-radius:50%;border:2px solid #ff7aa9;background-color:#ffffff;object-fit:cover;" />
                  </td>
                  <td valign="middle" style="padding-left:14px;">
                    <div style="font-family:Georgia,'Times New Roman',serif;font-size:21px;font-weight:700;color:#ffffff;line-height:1.2;">
                      Un sourire pour Tissem
                    </div>
                    <div style="margin-top:4px;font-size:11px;font-weight:700;letter-spacing:1.4px;text-transform:uppercase;color:#ff7aa9;">
                      et tous les enfants
                    </div>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
          <tr>
            <td style="padding:32px;">
              <div style="display:inline-block;padding:6px 12px;border-radius:999px;background-color:#fff0f6;border:1px solid #ffd2e4;color:#951b51;font-size:11px;font-weight:700;letter-spacing:0.8px;text-transform:uppercase;margin-bottom:18px;">
                ${escapeHtml(badgeText)}
              </div>
              <h1 style="margin:0 0 20px;font-family:Georgia,'Times New Roman',serif;font-size:24px;line-height:1.3;color:#1c1719;">
                ${escapeHtml(title)}
              </h1>
              ${bodyHtml}
            </td>
          </tr>
          <tr>
            <td style="background-color:#faf5f7;padding:20px 32px;border-top:1px solid #eadfe4;text-align:center;">
              <div style="font-size:12px;font-weight:700;color:#1c1719;">
                Association Un sourire pour Tissem et tous les enfants
              </div>
              <div style="margin-top:5px;font-size:11.5px;line-height:1.5;color:#695e65;">
                ${footerNote}
              </div>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}

export async function POST(request: Request): Promise<Response> {
  let payload: ContactPayload;
  try {
    payload = (await request.json()) as ContactPayload;
  } catch {
    return Response.json(
      { ok: false, error: "Requête invalide." },
      { status: 400 },
    );
  }

  const website = typeof payload.website === "string" ? payload.website.trim() : "";
  if (website.length > 0) {
    return Response.json({ ok: true });
  }

  const name = typeof payload.name === "string" ? payload.name.trim() : "";
  const email = typeof payload.email === "string" ? payload.email.trim() : "";
  const subject = typeof payload.subject === "string" ? payload.subject.trim() : "";
  const message = typeof payload.message === "string" ? payload.message.trim() : "";
  const consent = payload.consent === true;

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (
    name.length < 2 ||
    name.length > 120 ||
    !emailRegex.test(email) ||
    email.length > 180 ||
    subject.length < 3 ||
    subject.length > 160 ||
    message.length < 10 ||
    message.length > 5000 ||
    !consent
  ) {
    return Response.json(
      { ok: false, error: "Veuillez vérifier les champs du formulaire." },
      { status: 400 },
    );
  }

  const gmailUser = process.env.GMAIL_USER?.trim();
  const gmailPass = process.env.GMAIL_APP_PASSWORD?.replace(/\s+/g, "").trim();
  const recipient = (process.env.CONTACT_TO_EMAIL || gmailUser || DEFAULT_RECIPIENT).trim();

  if (!gmailUser || !gmailPass) {
    return Response.json(
      {
        ok: false,
        error:
          "Le service d’envoi Gmail n’est pas encore configuré sur Vercel (GMAIL_USER / GMAIL_APP_PASSWORD).",
      },
      { status: 503 },
    );
  }

  const siteUrl = getSiteUrl(request);
  const logoUrl = `${siteUrl}/official/logo-tissem.jpg`;
  const receivedAt = formatParisDate(new Date());

  const safeName = escapeHtml(name);
  const safeEmail = escapeHtml(email);
  const safeSubject = escapeHtml(subject);
  const safeMessageHtml = formatMessageHtml(message);

  const headerName = cleanHeaderValue(name).replace(/"/g, "");
  const headerSubject = cleanHeaderValue(subject);

  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: gmailUser,
      pass: gmailPass,
    },
  });

  const adminBodyHtml = `
    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="background-color:#faf5f7;border:1px solid #eadfe4;border-radius:10px;margin-bottom:22px;">
      <tr>
        <td style="padding:16px 20px;font-size:14px;line-height:1.7;color:#1c1719;">
          <div><strong style="color:#695e65;font-size:12px;text-transform:uppercase;letter-spacing:0.6px;">Nom :</strong> ${safeName}</div>
          <div><strong style="color:#695e65;font-size:12px;text-transform:uppercase;letter-spacing:0.6px;">Email :</strong> <a href="mailto:${safeEmail}" style="color:#951b51;font-weight:700;text-decoration:none;">${safeEmail}</a></div>
          <div><strong style="color:#695e65;font-size:12px;text-transform:uppercase;letter-spacing:0.6px;">Sujet :</strong> ${safeSubject}</div>
          <div><strong style="color:#695e65;font-size:12px;text-transform:uppercase;letter-spacing:0.6px;">Reçu le :</strong> ${escapeHtml(receivedAt)}</div>
        </td>
      </tr>
    </table>
    <div style="font-size:12px;font-weight:700;text-transform:uppercase;letter-spacing:0.8px;color:#695e65;margin-bottom:8px;">
      Message
    </div>
    <div style="border-left:4px solid #e42976;background-color:#fff8fb;padding:18px 20px;border-radius:0 10px 10px 0;font-size:15px;line-height:1.65;color:#1c1719;margin-bottom:26px;">
      ${safeMessageHtml}
    </div>
    <table role="presentation" cellspacing="0" cellpadding="0" border="0">
      <tr>
        <td style="border-radius:999px;background-color:#e42976;">
          <a href="mailto:${safeEmail}?subject=${encodeURIComponent(`Re: ${headerSubject}`)}" style="display:inline-block;padding:13px 24px;font-size:14px;font-weight:700;color:#ffffff;text-decoration:none;">
            Répondre à ${safeName}
          </a>
        </td>
      </tr>
    </table>
  `;

  const adminHtml = buildEmailShell({
    logoUrl,
    badgeText: "Formulaire de contact",
    title: `Nouveau message : ${subject}`,
    bodyHtml: adminBodyHtml,
    footerNote: `Message envoyé depuis <a href="${escapeHtml(siteUrl)}" style="color:#951b51;text-decoration:none;font-weight:700;">${escapeHtml(siteUrl)}</a> · Orléans &amp; Loiret`,
  });

  try {
    await transporter.sendMail({
      from: `"Un sourire pour Tissem — Site web" <${gmailUser}>`,
      to: recipient,
      replyTo: `"${headerName}" <${email}>`,
      subject: `[Site web] ${headerSubject} — ${headerName}`,
      text: `Nouveau message reçu depuis le site Un sourire pour Tissem\n\nNom : ${name}\nEmail : ${email}\nSujet : ${subject}\nReçu le : ${receivedAt}\n\nMessage :\n${message}`,
      html: adminHtml,
    });
  } catch (error) {
    console.error("Erreur d'envoi SMTP Gmail (notification):", error);
    return Response.json(
      { ok: false, error: "Impossible d’envoyer le message pour le moment." },
      { status: 502 },
    );
  }

  const visitorBodyHtml = `
    <p style="margin:0 0 14px;font-size:15px;line-height:1.65;color:#1c1719;">
      Bonjour <strong>${safeName}</strong>,
    </p>
    <p style="margin:0 0 20px;font-size:15px;line-height:1.65;color:#4a4146;">
      Nous avons bien reçu votre message concernant <strong>« ${safeSubject} »</strong>. Notre équipe bénévole en prend connaissance et vous répondra dans les plus brefs délais.
    </p>
    <div style="font-size:12px;font-weight:700;text-transform:uppercase;letter-spacing:0.8px;color:#695e65;margin-bottom:8px;">
      Récapitulatif de votre message
    </div>
    <div style="border-left:4px solid #e42976;background-color:#fff8fb;padding:16px 20px;border-radius:0 10px 10px 0;font-size:14px;line-height:1.6;color:#4a4146;margin-bottom:24px;">
      ${safeMessageHtml}
    </div>
    <table role="presentation" cellspacing="0" cellpadding="0" border="0">
      <tr>
        <td style="border-radius:999px;background-color:#1c1719;">
          <a href="${escapeHtml(siteUrl)}" style="display:inline-block;padding:12px 22px;font-size:13.5px;font-weight:700;color:#ffffff;text-decoration:none;">
            Revenir sur le site
          </a>
        </td>
        <td width="12"></td>
        <td style="border-radius:999px;border:1px solid #eadfe4;background-color:#ffffff;">
          <a href="${HELLOASSO_URL}" style="display:inline-block;padding:12px 22px;font-size:13.5px;font-weight:700;color:#951b51;text-decoration:none;">
            Page HelloAsso
          </a>
        </td>
      </tr>
    </table>
  `;

  const visitorHtml = buildEmailShell({
    logoUrl,
    badgeText: "Confirmation de réception",
    title: "Merci pour votre message",
    bodyHtml: visitorBodyHtml,
    footerNote: `Loi 1901 · RNA W452013082 · Orléans &amp; Loiret · <a href="tel:+33617037095" style="color:#951b51;text-decoration:none;font-weight:700;">06 17 03 70 95</a>`,
  });

  try {
    await transporter.sendMail({
      from: `"Un sourire pour Tissem" <${gmailUser}>`,
      to: email,
      replyTo: recipient,
      subject: "Merci pour votre message — Un sourire pour Tissem",
      text: `Bonjour ${name},\n\nNous avons bien reçu votre message concernant "${subject}". Notre équipe bénévole vous répondra dans les plus brefs délais.\n\nVotre message :\n${message}\n\nAssociation Un sourire pour Tissem et tous les enfants\nOrléans & Loiret · 06 17 03 70 95`,
      html: visitorHtml,
    });
  } catch (error) {
    console.warn("Accusé de réception visiteur non envoyé:", error);
  }

  return Response.json({ ok: true });
}
