import "server-only";

type Window = { count: number; resetAt: number };

/**
 * In-memory fixed-window limiter. Each server instance keeps its own counts,
 * so on serverless hosts this is a best-effort guard rather than a hard limit.
 */
export function createRateLimiter({ limit, windowMs }: { limit: number; windowMs: number }) {
  const windows = new Map<string, Window>();

  return function isAllowed(key: string): boolean {
    const now = Date.now();

    for (const [storedKey, window] of windows) {
      if (window.resetAt <= now) windows.delete(storedKey);
    }

    const window = windows.get(key);
    if (!window) {
      windows.set(key, { count: 1, resetAt: now + windowMs });
      return true;
    }
    if (window.count >= limit) return false;
    window.count += 1;
    return true;
  };
}
