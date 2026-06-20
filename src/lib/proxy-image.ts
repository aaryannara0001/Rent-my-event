// VITE_PYTHON_URL is the public Railway backend URL (e.g. https://your-app.railway.app).
// In local dev this defaults to localhost:8000.
const PYTHON_URL =
  (typeof import.meta !== "undefined" && (import.meta as any).env?.VITE_PYTHON_URL) ||
  "http://127.0.0.1:8000";

/**
 * Rewrites external CDN thumbnail URLs through our backend proxy so the
 * browser never hits Instagram/Facebook CDN directly.
 *
 * Instagram and Facebook CDN images have:
 *   Cross-Origin-Resource-Policy: same-origin
 * This header blocks any cross-origin <img> load (ERR_BLOCKED_BY_RESPONSE.NotSameOrigin).
 * Our /api/proxy-image endpoint fetches the image server-side and re-serves
 * it with permissive headers.
 */
const BLOCKED_CDN_PATTERNS = [
  "fbcdn.net",
  "cdninstagram.com",
  "instagram.f",     // instagram.fdel10-1.fna.fbcdn.net etc.
];

export function proxyThumbnail(url: string | null | undefined): string {
  if (!url) return "";
  // Already a local/uploads URL — serve directly
  if (url.startsWith("/") || url.includes("127.0.0.1") || url.includes("localhost")) {
    return url;
  }
  // Already a cached upload on our own backend
  if (url.includes(PYTHON_URL)) {
    return url;
  }
  // Instagram / Facebook CDN — run through proxy
  if (BLOCKED_CDN_PATTERNS.some((p) => url.includes(p))) {
    return `${PYTHON_URL}/api/proxy-image?url=${encodeURIComponent(url)}`;
  }
  return url;
}
