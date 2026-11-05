import "server-only";
import { headers } from "next/headers";

/** Helpers shared by the form server actions. They live here because "use server" files may only export actions. */

export const readField = (formData: FormData, name: string) => String(formData.get(name) ?? "").trim();

/** Stops line breaks in a field from spilling into email headers such as the subject. */
export const toSingleLine = (value: string) => value.replace(/[\r\n]+/g, " ");

export const escapeHtml = (value: string) =>
  value.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#39;");

const UNKNOWN_CLIENT = "unknown";

/** The visitor's IP as reported by the host's proxy, used as the rate-limit key. */
export async function getClientIp(): Promise<string> {
  const requestHeaders = await headers();
  return requestHeaders.get("x-forwarded-for")?.split(",")[0]?.trim() || UNKNOWN_CLIENT;
}
