/* Offline support.
   - App files and Leaflet are cached on install.
   - Satellite map tiles are cached as you look at them, and in bulk by "Save map for offline". */
var SHELL_CACHE = 'herdguard-shell-v7';
var TILE_CACHE = 'herdguard-tiles-v2';
var MAX_TILES = 3000;
var SHELL = ['./', 'index.html', 'manifest.webmanifest', 'icon.svg', 'icon-192.png', 'icon-512.png', 'get.html', 'apk-config.js'];
var LIBS = ['https://unpkg.com/leaflet@1.9.4/dist/leaflet.css', 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js'];

self.addEventListener('install', function (e) {
  e.waitUntil(
    caches.open(SHELL_CACHE).then(function (c) {
      return c.addAll(SHELL).then(function () {
        return Promise.all(LIBS.map(function (u) {
          return fetch(u, { mode: 'no-cors' }).then(function (r) { return c.put(u, r); }).catch(function () {});
        }));
      });
    }).then(function () { return self.skipWaiting(); })
  );
});

self.addEventListener('activate', function (e) {
  e.waitUntil(
    caches.keys().then(function (keys) {
      return Promise.all(keys.filter(function (k) { return k !== SHELL_CACHE && k !== TILE_CACHE; })
        .map(function (k) { return caches.delete(k); }));
    }).then(function () { return self.clients.claim(); })
  );
});

// Tiles: serve from the cache, but a request that needs readable data (CORS, used for the picture)
// is never answered with an unreadable cached copy.
function tileRequest(req) {
  return caches.open(TILE_CACHE).then(function (c) {
    return c.match(req).then(function (hit) {
      if (hit && !(req.mode === 'cors' && hit.type === 'opaque')) return hit;
      return fetch(req).then(function (res) {
        if (res.ok || res.type === 'opaque') {
          c.put(req, res.clone());
          c.keys().then(function (keys) {
            if (keys.length > MAX_TILES) keys.slice(0, keys.length - MAX_TILES).forEach(function (k) { c.delete(k); });
          });
        }
        return res;
      });
    });
  }).catch(function () { return caches.match(req); });
}

function cacheFirst(req, name) {
  return caches.open(name).then(function (c) {
    return c.match(req).then(function (hit) {
      if (hit) return hit;
      return fetch(req).then(function (res) { if (res.ok || res.type === 'opaque') c.put(req, res.clone()); return res; });
    });
  }).catch(function () { return caches.match(req); });
}

function networkFirst(req) {
  return fetch(req).then(function (res) {
    var copy = res.clone();
    caches.open(SHELL_CACHE).then(function (c) { c.put(req, copy); });
    return res;
  }).catch(function () { return caches.match(req); });
}

self.addEventListener('fetch', function (e) {
  var req = e.request;
  if (req.method !== 'GET') return;
  var url = new URL(req.url);
  if (url.hostname === 'server.arcgisonline.com' || url.hostname === 'api.mapbox.com') { e.respondWith(tileRequest(req)); return; }
  if (url.hostname === 'unpkg.com') { e.respondWith(cacheFirst(req, SHELL_CACHE)); return; }
  if (url.origin !== location.origin) return;
  e.respondWith(networkFirst(req));
});
