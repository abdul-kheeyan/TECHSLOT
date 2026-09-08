import nodemailer from 'nodemailer';

const getMailerConfig = () => {
  const { SMTP_USER, SMTP_PASS, MAIL_TO } = process.env;
  if (!SMTP_USER || !SMTP_PASS || !MAIL_TO) return null;

  return {
    from: `TechSlot Project Inquiry <${SMTP_USER}>`,
    to: MAIL_TO,
    auth: { user: SMTP_USER, pass: SMTP_PASS },
  };
};

const escapeHtml = (value = '') => String(value)
  .replace(/&/g, '&amp;')
  .replace(/</g, '&lt;')
  .replace(/>/g, '&gt;')
  .replace(/"/g, '&quot;')
  .replace(/'/g, '&#039;');

export const sendInquiryNotification = async (inquiry) => {
  const config = getMailerConfig();
  if (!config) {
    console.warn('[Mailer] SMTP is not configured; inquiry email was skipped.');
    return false;
  }

  const transporter = nodemailer.createTransport({ service: 'gmail', auth: config.auth });
  const fields = [
    ['Name', inquiry.name],
    ['Email', inquiry.email],
    ['Phone', inquiry.phone || 'Not provided'],
    ['Project type', inquiry.projectType],
    ['Budget', inquiry.budget],
    ['Timeline', inquiry.timeline],
  ];
  const text = `${fields.map(([label, value]) => `${label}: ${value}`).join('\n')}\n\nProject overview:\n${inquiry.message}`;
  const rows = fields.map(([label, value]) => `<tr><td style="padding:8px;font-weight:600">${escapeHtml(label)}</td><td style="padding:8px">${escapeHtml(value)}</td></tr>`).join('');

  await transporter.sendMail({
    from: config.from,
    to: config.to,
    replyTo: inquiry.email,
    subject: `New project inquiry from ${inquiry.name}`,
    text,
    html: `<h2>New TechSlot project inquiry</h2><table>${rows}</table><h3>Project overview</h3><p>${escapeHtml(inquiry.message).replace(/\n/g, '<br>')}</p>`,
  });
  return true;
};
