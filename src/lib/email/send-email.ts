import nodemailer from 'nodemailer';

export async function sendEmail({
  to,
  subject,
  html,
  smtpSettings
}: {
  to: string;
  subject: string;
  html: string;
  smtpSettings: any;
}) {
  if (!smtpSettings.host || !smtpSettings.user || !smtpSettings.pass) {
    throw new Error('SMTP settings are incomplete');
  }

  const transporter = nodemailer.createTransport({
    host: smtpSettings.host,
    port: smtpSettings.port || 587,
    secure: smtpSettings.port === 465, // true for 465, false for other ports
    auth: {
      user: smtpSettings.user,
      pass: smtpSettings.pass,
    },
  });

  const from = smtpSettings.fromName 
    ? `"${smtpSettings.fromName}" <${smtpSettings.fromEmail || smtpSettings.user}>`
    : smtpSettings.fromEmail || smtpSettings.user;

  const info = await transporter.sendMail({
    from,
    to,
    subject,
    html,
  });

  return info;
}
