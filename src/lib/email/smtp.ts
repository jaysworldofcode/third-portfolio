import "server-only";
import nodemailer from "nodemailer";
import { requireEnv } from "./env";
import type { EmailSender } from "./types";

const DEFAULT_SMTP_PORT = 587;
const IMPLICIT_TLS_PORT = 465;

export const sendWithSmtp: EmailSender = async (message) => {
  const user = requireEnv("SMTP_USER");
  const port = Number(process.env.SMTP_PORT ?? DEFAULT_SMTP_PORT);

  const transporter = nodemailer.createTransport({
    host: requireEnv("SMTP_HOST"),
    port,
    secure: port === IMPLICIT_TLS_PORT,
    auth: { user, pass: requireEnv("SMTP_PASSWORD") },
  });

  await transporter.sendMail({
    from: { name: message.senderName, address: process.env.SMTP_FROM || user },
    to: message.to,
    replyTo: message.replyTo,
    subject: message.subject,
    text: message.text,
    html: message.html,
  });
};
