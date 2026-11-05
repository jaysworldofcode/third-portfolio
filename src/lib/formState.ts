/** Shared by every form that posts to a server action (contact, newsletter). */
export type FormStatus = "idle" | "success" | "invalid" | "rate-limited" | "failed";
export type FormState = { status: FormStatus };

export const INITIAL_FORM_STATE: FormState = { status: "idle" };

/** Hidden form field that only bots fill in. */
export const HONEYPOT_FIELD = "website";

export const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/** Longest address allowed by the SMTP spec (RFC 5321). */
export const EMAIL_MAX_LENGTH = 254;

export const isValidEmail = (email: string) => email.length <= EMAIL_MAX_LENGTH && EMAIL_PATTERN.test(email);
