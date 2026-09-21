const CACHE="hightaxi-chess-cache-v0.9.11";
const STATIC=["./","./index.html","./styles.css","./app.js","./chess.js","./pgn.js","./db.js","./version.js","./stockfish-worker.js","./manifest.webmanifest","./logo.jpg","./apple-touch-icon.png","./icon-192.png","./icon-512.png","./maskable-192.png","./maskable-512.png","./pieces/wP.png","./pieces/wN.png","./pieces/wB.png","./pieces/wR.png","./pieces/wQ.png","./pieces/wK.png","./pieces/bP.png","./pieces/bN.png","./pieces/bB.png","./pieces/bR.png","./pieces/bQ.png","./pieces/bK.png","./stockfish/stockfish-18-lite-single.js","./stockfish/stockfish-18-lite-single.wasm"];
self.addEventListener("install",e=>e.waitUntil(caches.open(CACHE).then(async c=>{for(const url of STATIC){try{await c.add(url)}catch(err){}}}).then(()=>self.skipWaiting())));
self.addEventListener("activate",e=>e.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(k=>k!==CACHE&&k.startsWith("hightaxi-chess-")).map(k=>caches.delete(k)))).then(()=>self.clients.claim())));
self.addEventListener("fetch",e=>{
  if(e.request.method!=="GET")return;
  const url=new URL(e.request.url);
  if(url.origin!==location.origin)return;
  if(url.pathname.startsWith("/api/"))return;
  e.respondWith((async()=>{
    const cache=await caches.open(CACHE);
    const cached=await cache.match(e.request);
    const refresh=fetch(e.request).then(r=>{if(r.ok)cache.put(e.request,r.clone());return r}).catch(()=>null);
    if(cached){e.waitUntil(refresh);return cached;}
    const fresh=await refresh;
    if(fresh)return fresh;
    return caches.match(e.request)||new Response("Offline",{status:503});
  })());
});
