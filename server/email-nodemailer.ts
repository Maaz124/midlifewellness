import nodemailer from "nodemailer";

type GmailSendParams = {
  to: string;
  from?: string;
  subject: string;
  text?: string;
  html?: string;
};

const gmailUser = process.env.GMAIL_USER;
const gmailPass = process.env.GMAIL_APP_PASSWORD || process.env.GMAIL_PASS;

let transporter: nodemailer.Transporter | null = null;

function getTransporter(): nodemailer.Transporter | null {
  if (!gmailUser || !gmailPass) {
    return null;
  }
  if (transporter) return transporter;

  transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: gmailUser,
      pass: gmailPass,
    },
  });

  return transporter;
}

export async function sendGmailEmail(params: GmailSendParams): Promise<boolean> {
  const tx = getTransporter();
  if (!tx) {
    console.warn("Gmail credentials not configured; skipping email send.");
    return false;
  }

  try {
    await tx.sendMail({
      to: params.to,
      from: params.from || gmailUser!,
      subject: params.subject,
      text: params.text,
      html: params.html,
    });
    return true;
  } catch (err) {
    console.error("Nodemailer Gmail send error:", err);
    return false;
  }
}


