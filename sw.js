/* Offline cache for the CW Codegroup Trainer.
 *
 * The trainer needs no network at all: one HTML file, one vendored library,
 * and Web Audio. This worker just makes sure both files survive a launch
 * without connectivity (and satisfy the install criteria).
 *
 * Navigations are network-first (fresh copy when online, cached copy when
 * not); the static assets are immutable, so they are cache-first.
 */
const CACHE = "cw-codegroup-trainer-v1";

const CORE = [
  "./index.html",
  "./manifest.webmanifest",
  "./jscwlib-0.3.0.js",
  "./icon-192.png",
  "./icon-512.png",
  "./apple-touch-icon.png",
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE)
      .then((cache) => cache.addAll(CORE))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil((async () => {
    const keys = await caches.keys();
    await Promise.all(keys.filter((key) => key !== CACHE).map((key) => caches.delete(key)));
    await self.clients.claim();
  })());
});

self.addEventListener("fetch", (event) => {
  const request = event.request;
  const url = new URL(request.url);

  // same-origin GETs only; there are no other requests to worry about
  if (request.method !== "GET" || url.origin !== self.location.origin) return;

  if (request.mode === "navigate") {
    event.respondWith((async () => {
      try {
        const fresh = await fetch(request);
        if (fresh.ok) {
          const cache = await caches.open(CACHE);
          await cache.put("./index.html", fresh.clone());
        }
        return fresh;
      } catch (err) {
        const cached = await caches.match("./index.html");
        if (cached) return cached;
        throw err;
      }
    })());
    return;
  }

  event.respondWith((async () => {
    const cached = await caches.match(request);
    if (cached) return cached;
    const response = await fetch(request);
    if (response.ok && response.type === "basic") {
      const cache = await caches.open(CACHE);
      await cache.put(request, response.clone());
    }
    return response;
  })());
});
