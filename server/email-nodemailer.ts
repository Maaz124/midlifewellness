import nodemailer from "nodemailer";

type GmailSendParams = {
  to: string;
  from?: string;
  subject: string;
  text?: string;
  html?: string;
  authOverride?: { user: string; pass: string };
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
    auth: { user: gmailUser, pass: gmailPass },
  });
  return transporter;
}

export async function sendGmailEmail(params: GmailSendParams): Promise<boolean> {
  try {
    let tx: nodemailer.Transporter | null = null;
    if (params.authOverride?.user && params.authOverride?.pass) {
      tx = nodemailer.createTransport({
        service: "gmail",
        auth: { user: params.authOverride.user, pass: params.authOverride.pass },
      });
    } else {
      tx = getTransporter();
    }
    if (!tx) {
      console.warn("Gmail credentials not configured; skipping email send.");
      return false;
    }

    await tx.sendMail({
      to: params.to,
      from: params.from || params.authOverride?.user || gmailUser!,
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


