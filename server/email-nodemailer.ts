import nodemailer from "nodemailer";
import { getEmailConfig } from "./get-email-config";

type GmailSendParams = {
  to: string;
  from?: string;
  subject: string;
  text?: string;
  html?: string;
  authOverride?: { user: string; pass: string };
};

let transporter: nodemailer.Transporter | null = null;
let transporterConfig: { user: string; pass: string } | null = null;

async function getTransporter(): Promise<nodemailer.Transporter | null> {
  const emailConfig = await getEmailConfig();
  
  if (!emailConfig.gmailUser || !emailConfig.gmailAppPassword) {
    return null;
  }
  
  // Recreate transporter if config changed
  const currentConfig = { user: emailConfig.gmailUser, pass: emailConfig.gmailAppPassword };
  if (transporter && transporterConfig && 
      transporterConfig.user === currentConfig.user && 
      transporterConfig.pass === currentConfig.pass) {
    return transporter;
  }
  
  transporter = nodemailer.createTransport({
    service: "gmail",
    auth: currentConfig,
    connectionTimeout: 10000, // 10 second connection timeout
    greetingTimeout: 10000,
    socketTimeout: 10000,
    pool: true, // Enable connection pooling
    maxConnections: 1,
    maxMessages: 3,
  });
  transporterConfig = currentConfig;
  return transporter;
}

export async function sendGmailEmail(params: GmailSendParams): Promise<boolean> {
  const timeout = 15000; // 15 second timeout
  const sendPromise = (async () => {
    try {
      let tx: nodemailer.Transporter | null = null;
      if (params.authOverride?.user && params.authOverride?.pass) {
        tx = nodemailer.createTransport({
          service: "gmail",
          auth: { user: params.authOverride.user, pass: params.authOverride.pass },
          connectionTimeout: 10000, // 10 second connection timeout
          greetingTimeout: 10000,
          socketTimeout: 10000,
        });
      } else {
        tx = await getTransporter();
      }
      if (!tx) {
        console.warn("Gmail credentials not configured; skipping email send.");
        return false;
      }

      const emailConfig = await getEmailConfig();
      await tx.sendMail({
        to: params.to,
        from: params.from || params.authOverride?.user || emailConfig.gmailUser,
        subject: params.subject,
        text: params.text,
        html: params.html,
      });
      return true;
    } catch (err) {
      console.error("Nodemailer Gmail send error:", err);
      return false;
    }
  })();

  // Add timeout
  const timeoutPromise = new Promise<boolean>((resolve) => {
    setTimeout(() => {
      console.warn("Email send timeout after", timeout, "ms");
      resolve(false);
    }, timeout);
  });

  return Promise.race([sendPromise, timeoutPromise]);
}


