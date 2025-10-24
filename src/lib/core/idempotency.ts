const idempotencyStore = new Map<string, { digest: string; expiresAt: number }>();

const TTL_MS = 5 * 60 * 1000;

export function registerIdempotencyKey(key: string, digest: string) {
  const existing = idempotencyStore.get(key);
  const now = Date.now();
  if (existing && existing.digest === digest && existing.expiresAt > now) {
    return false;
  }
  idempotencyStore.set(key, { digest, expiresAt: now + TTL_MS });
  return true;
}

export function purgeExpiredIdempotencyKeys() {
  const now = Date.now();
  for (const [key, value] of idempotencyStore.entries()) {
    if (value.expiresAt <= now) {
      idempotencyStore.delete(key);
    }
  }
}

