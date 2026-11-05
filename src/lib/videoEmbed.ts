/**
 * Turns a YouTube or Vimeo page link into an embeddable player URL, so content editors can paste the link
 * they copy from the browser. Returns null for anything else (e.g. a direct `.mp4`), which plays in <video>.
 */

// YouTube video IDs are always 11 characters of [A-Za-z0-9_-].
const YOUTUBE_ID_PATTERN = /^[\w-]{11}$/;
const VIMEO_ID_PATTERN = /^\d+$/;
const YOUTUBE_PATH_PREFIXES = ["/embed/", "/shorts/", "/live/", "/v/"];

function parseUrl(value: string): URL | null {
  try {
    return new URL(value);
  } catch {
    // Relative paths like "/images/reel.mp4" aren't absolute URLs, so they can't be embeds.
    return null;
  }
}

function getYouTubeId(url: URL): string | null {
  const host = url.hostname.replace(/^(www\.|m\.)/, "");
  let id: string | null = null;

  if (host === "youtu.be") {
    id = url.pathname.slice(1).split("/")[0];
  } else if (host === "youtube.com" || host === "youtube-nocookie.com") {
    if (url.pathname === "/watch") {
      id = url.searchParams.get("v");
    } else {
      const prefix = YOUTUBE_PATH_PREFIXES.find((candidate) => url.pathname.startsWith(candidate));
      if (prefix) id = url.pathname.slice(prefix.length).split("/")[0];
    }
  }

  return id && YOUTUBE_ID_PATTERN.test(id) ? id : null;
}

function getVimeoId(url: URL): string | null {
  const host = url.hostname.replace(/^www\./, "");
  if (host !== "vimeo.com" && host !== "player.vimeo.com") return null;

  // vimeo.com/123, vimeo.com/channels/staffpicks/123 and player.vimeo.com/video/123 all end in the numeric ID.
  const id = url.pathname.split("/").filter(Boolean).find((segment) => VIMEO_ID_PATTERN.test(segment));
  return id ?? null;
}

/** Converts a YouTube timestamp like "90", "90s" or "1m30s" to whole seconds. */
function parseStartSeconds(value: string | null): number | null {
  if (!value) return null;
  if (/^\d+$/.test(value)) return Number(value);

  const match = /^(?:(\d+)h)?(?:(\d+)m)?(?:(\d+)s)?$/.exec(value);
  if (!match || !match[0]) return null;
  const [, hours = "0", minutes = "0", seconds = "0"] = match;
  return Number(hours) * 3600 + Number(minutes) * 60 + Number(seconds);
}

export function getVideoEmbedUrl(value: string): string | null {
  const url = parseUrl(value.trim());
  if (!url) return null;

  const youTubeId = getYouTubeId(url);
  if (youTubeId) {
    // The no-cookie domain avoids setting tracking cookies until the visitor presses play.
    const params = new URLSearchParams({ autoplay: "1", rel: "0", playsinline: "1" });
    const start = parseStartSeconds(url.searchParams.get("t") ?? url.searchParams.get("start"));
    if (start) params.set("start", String(start));
    return `https://www.youtube-nocookie.com/embed/${youTubeId}?${params}`;
  }

  const vimeoId = getVimeoId(url);
  if (vimeoId) {
    const params = new URLSearchParams({ autoplay: "1" });
    // Unlisted Vimeo videos carry a privacy hash, either as ?h= or as the path segment after the ID.
    const pathSegments = url.pathname.split("/").filter(Boolean);
    const hashSegment = pathSegments[pathSegments.indexOf(vimeoId) + 1];
    const hash = url.searchParams.get("h") ?? hashSegment;
    if (hash) params.set("h", hash);
    return `https://player.vimeo.com/video/${vimeoId}?${params}`;
  }

  return null;
}
