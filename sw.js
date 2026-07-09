const CACHE = "lifting-v3";
const SHELL = ["./", "./index.html", "./config.js", "./manifest.json", "./icon-192.png", "./icon-512.png",
  "https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/dist/umd/supabase.min.js"];

// Files that should always try the network first (so config/app updates land
// immediately), falling back to cache only when offline.
const NETWORK_FIRST = ["config.js", "index.html", "sw.js", "manifest.json"];

self.addEventListener("install", (e) => {
  // allSettled so one missing file (e.g. icons not uploaded yet) doesn't block install
  e.waitUntil(
    caches.open(CACHE)
      .then(c => Promise.allSettled(SHELL.map(u => c.add(u))))
      .then(() => self.skipWaiting())
  );
});
self.addEventListener("activate", (e) => {
  e.waitUntil(caches.keys().then(keys =>
    Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)))
  ).then(() => self.clients.claim()));
});

function isNetworkFirst(url) {
  if (url.origin !== location.origin) return false;
  const file = url.pathname.split("/").pop() || "index.html";
  return NETWORK_FIRST.indexOf(file) !== -1 || url.pathname.endsWith("/");
}

self.addEventListener("fetch", (e) => {
  const url = new URL(e.request.url);
  // Never touch Supabase API calls
  if (url.hostname.endsWith(".supabase.co")) return;

  if (isNetworkFirst(url)) {
    e.respondWith(
      fetch(e.request).then(resp => {
        if (resp.ok) {
          const clone = resp.clone();
          caches.open(CACHE).then(c => c.put(e.request, clone));
        }
        return resp;
      }).catch(() => caches.match(e.request))
    );
    return;
  }

  e.respondWith(
    caches.match(e.request).then(cached => cached || fetch(e.request).then(resp => {
      if (e.request.method === "GET" && resp.ok && (url.origin === location.origin)) {
        const clone = resp.clone();
        caches.open(CACHE).then(c => c.put(e.request, clone));
      }
      return resp;
    }).catch(() => cached))
  );
});
