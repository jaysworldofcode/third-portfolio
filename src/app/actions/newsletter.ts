"use server";

import { contact, footer } from "@/data/site";
import { sendEmail } from "@/lib/email";
import { escapeHtml, getClientIp, readField } from "@/lib/formServer";
import { HONEYPOT_FIELD, isValidEmail, type FormState } from "@/lib/formState";
import { createRateLimiter } from "@/lib/rateLimit";

const SIGNUPS_PER_WINDOW = 5;
const RATE_LIMIT_WINDOW_MS = 10 * 60 * 1000;
// Separate from the contact form's limiter, so signing up never uses up a visitor's contact messages.
const isAllowed = createRateLimiter({ limit: SIGNUPS_PER_WINDOW, windowMs: RATE_LIMIT_WINDOW_MS });

/**
 * Emails a signup notice to the studio inbox. Nothing is stored: the studio adds the address to
 * its mailing tool by hand, which keeps this template free of databases and third-party lists.
 */
export async function subscribeToNewsletter(_previous: FormState, formData: FormData): Promise<FormState> {
  // Server actions are public endpoints, so a hidden form must not be usable by posting to it directly.
  if (!footer.newsletter.enabled) return { status: "failed" };
  if (readField(formData, HONEYPOT_FIELD)) return { status: "success" };

  const email = readField(formData, "email");
  if (!isValidEmail(email)) return { status: "invalid" };

  if (!isAllowed(await getClientIp())) return { status: "rate-limited" };

  const { notifications } = contact;

  try {
    await sendEmail(notifications.provider, {
      senderName: notifications.senderName,
      to: notifications.sendTo,
      replyTo: email,
      subject: `${footer.newsletter.subjectPrefix} New signup: ${email}`.trim(),
      text: `New newsletter signup\n\nEmail: ${email}`,
      html: `<p>New newsletter signup</p><p><strong>Email:</strong> ${escapeHtml(email)}</p>`,
    });
    return { status: "success" };
  } catch (error) {
    console.error("[newsletter] Failed to send signup notice:", error);
    return { status: "failed" };
  }
}
