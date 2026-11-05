import "server-only";
import { Resend } from "resend";
import { requireEnv } from "./env";
import type { EmailSender } from "./types";

/** Resend's shared test sender; it can only deliver to the Resend account's own email address. */
const RESEND_TEST_SENDER = "onboarding@resend.dev";

export const sendWithResend: EmailSender = async (message) => {
  const resend = new Resend(requireEnv("RESEND_API_KEY"));
  const fromAddress = process.env.RESEND_FROM || RESEND_TEST_SENDER;

  const { error } = await resend.emails.send({
    from: `${message.senderName} <${fromAddress}>`,
    to: message.to,
    replyTo: message.replyTo,
    subject: message.subject,
    text: message.text,
    html: message.html,
  });

  if (error) throw new Error(`Resend failed: ${error.message}`);
};
