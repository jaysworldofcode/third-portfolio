"use server";

import { contact } from "@/data/site";
import { CONTACT_FIELD_LIMITS } from "@/lib/contactForm";
import { sendEmail } from "@/lib/email";
import { escapeHtml, getClientIp, readField, toSingleLine } from "@/lib/formServer";
import { HONEYPOT_FIELD, isValidEmail, type FormState } from "@/lib/formState";
import { createRateLimiter } from "@/lib/rateLimit";

const MESSAGES_PER_WINDOW = 5;
const RATE_LIMIT_WINDOW_MS = 10 * 60 * 1000;
const isAllowed = createRateLimiter({ limit: MESSAGES_PER_WINDOW, windowMs: RATE_LIMIT_WINDOW_MS });

export async function sendContactMessage(_previous: FormState, formData: FormData): Promise<FormState> {
  if (readField(formData, HONEYPOT_FIELD)) return { status: "success" };

  const name = toSingleLine(readField(formData, "name"));
  const email = readField(formData, "email");
  const subject = toSingleLine(readField(formData, "subject"));
  const message = readField(formData, "message");

  const isValid =
    name.length > 0 &&
    name.length <= CONTACT_FIELD_LIMITS.name &&
    isValidEmail(email) &&
    subject.length <= CONTACT_FIELD_LIMITS.subject &&
    message.length > 0 &&
    message.length <= CONTACT_FIELD_LIMITS.message;
  if (!isValid) return { status: "invalid" };

  if (!isAllowed(await getClientIp())) return { status: "rate-limited" };

  const { notifications } = contact;
  const topic = subject || `New message from ${name}`;

  try {
    await sendEmail(notifications.provider, {
      senderName: notifications.senderName,
      to: notifications.sendTo,
      replyTo: email,
      subject: `${notifications.subjectPrefix} ${topic}`.trim(),
      text: `Name: ${name}\nEmail: ${email}\nSubject: ${subject || "-"}\n\n${message}`,
      html: `
        <p><strong>Name:</strong> ${escapeHtml(name)}</p>
        <p><strong>Email:</strong> ${escapeHtml(email)}</p>
        <p><strong>Subject:</strong> ${escapeHtml(subject || "-")}</p>
        <hr />
        <p style="white-space: pre-wrap">${escapeHtml(message)}</p>
      `,
    });
    return { status: "success" };
  } catch (error) {
    console.error("[contact] Failed to send message:", error);
    return { status: "failed" };
  }
}
