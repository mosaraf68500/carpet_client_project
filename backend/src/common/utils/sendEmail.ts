import nodemailer, { type Transporter } from "nodemailer";

let transporter: Transporter | undefined;

function getTransporter(): Transporter {
  if (!transporter) {
    transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT) || 587,
      secure: false, // true for port 465
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });
  }
  return transporter;
}

interface QuoteNotificationParams {
  name: string;
  phone: string;
  email: string;
  message?: string;
  productTitle?: string;
}

export async function sendQuoteNotification({
  name,
  phone,
  email,
  message,
  productTitle,
}: QuoteNotificationParams): Promise<void> {
  const subject = productTitle
    ? `New quote request — ${productTitle}`
    : "New quote request";

  const html = `
    <h2>New quote request</h2>
    <p><strong>Name:</strong> ${name}</p>
    <p><strong>Phone:</strong> ${phone}</p>
    <p><strong>Email:</strong> ${email}</p>
    ${productTitle ? `<p><strong>Product:</strong> ${productTitle}</p>` : ""}
    <p><strong>Message:</strong><br/>${message || "—"}</p>
  `;

  try {
    await getTransporter().sendMail({
      from: process.env.SMTP_FROM,
      to: process.env.NOTIFY_EMAIL,
      replyTo: email,
      subject,
      html,
    });
  } catch (err) {
    // Don't let a broken SMTP config break the quote submission itself —
    // the message is already saved in the DB and visible in the dashboard.
    console.error("Failed to send quote notification email:", (err as Error).message);
  }
}
