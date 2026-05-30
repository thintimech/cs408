import { NextRequest } from "next/server";

const windowMs = 60_000;
const maxRequests = 20;
const cleanupInterval = 5 * 60_000;

const hits = new Map<string, { count: number; resetAt: number }>();
let lastCleanup = Date.now();

function cleanup(now: number) {
  if (now - lastCleanup < cleanupInterval) return;
  lastCleanup = now;
  for (const [key, entry] of hits) {
    if (now > entry.resetAt) hits.delete(key);
  }
}

export function getClientIp(req: NextRequest): string {
  return (
    req.headers.get("x-real-ip") ||
    req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    "unknown"
  );
}

export function rateLimit(ip: string): boolean {
  const now = Date.now();
  cleanup(now);

  const entry = hits.get(ip);

  if (!entry || now > entry.resetAt) {
    hits.set(ip, { count: 1, resetAt: now + windowMs });
    return true;
  }

  if (entry.count >= maxRequests) {
    return false;
  }

  entry.count++;
  return true;
}
