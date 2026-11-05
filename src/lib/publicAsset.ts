import "server-only";
import fs from "node:fs";
import path from "node:path";

const PUBLIC_DIRECTORY = path.join(process.cwd(), "public");

/**
 * True when a site.json path like "/images/clients/acme.svg" exists in public/. Lets a component
 * fall back to text at build time instead of shipping a broken image.
 */
export function publicFileExists(src: string): boolean {
  if (!src.startsWith("/")) return false;
  return fs.existsSync(path.join(PUBLIC_DIRECTORY, src));
}
