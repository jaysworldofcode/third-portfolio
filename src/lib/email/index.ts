import "server-only";
import type { EmailProvider } from "@/data/site";
import { sendWithResend } from "./resend";
import { sendWithSmtp } from "./smtp";
import type { EmailMessage, EmailSender } from "./types";

const SENDERS: Record<EmailProvider, EmailSender> = {
  smtp: sendWithSmtp,
  resend: sendWithResend,
};

const isEmailProvider = (value: string): value is EmailProvider => value in SENDERS;

export async function sendEmail(provider: string, message: EmailMessage): Promise<void> {
  if (!isEmailProvider(provider)) {
    throw new Error(`Unknown email provider "${provider}". Use one of: ${Object.keys(SENDERS).join(", ")}.`);
  }
  await SENDERS[provider](message);
}

export type { EmailMessage } from "./types";
