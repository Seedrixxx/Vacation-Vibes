const store = new Map<string, { count: number; resetAt: number }>();
const WINDOW_MS = 60 * 1000; // 1 minute
const MAX_REQUESTS = 10;

export async function rateLimit(key: string): Promise<{ success: boolean }> {
  const now = Date.now();
  const entry = store.get(key);
  if (!entry) {
    store.set(key, { count: 1, resetAt: now + WINDOW_MS });
    return { success: true };
  }
  if (now > entry.resetAt) {
    store.set(key, { count: 1, resetAt: now + WINDOW_MS });
    return { success: true };
  }
  entry.count++;
  if (entry.count > MAX_REQUESTS) return { success: false };
  return { success: true };
}

// Optional: periodic cleanup
if (typeof setInterval !== "undefined") {
  setInterval(() => {
    const now = Date.now();
  Array.from(store.entries()).forEach(([k, v]) => {
    if (now > v.resetAt) store.delete(k);
  });
  }, 60000);
}
