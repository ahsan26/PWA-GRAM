const Cache_Static_Name = "static-v1";
const Cache_Dynamic_Name = "dynamic-v1";

self.addEventListener("install", event => {
  console.log("SW in installing!");
  event.waitUntil(
    caches.open(Cache_Static_Name)
    .then(cache => {
      const resources = ["/", "/index.html", "/styles.css", "/app.js", "/manifest.json"];
      cache.addAll(resources);
    })
  )
});

self.addEventListener("activate", event => {
  console.log("Service Worker is activated!");
  // event.waitUntil(
  //   caches.keys()
  //     .then(keys=>{
  //
  //     });
  // );
});

self.addEventListener("fetch", event => {
  event.respondWith(
    fetch(event.request)
    .then(res => {
      return caches.open(Cache_Dynamic_Name)
          .then(cache => {
              cache.put(event.request.url, res.clone());
              return res;
          });
  })
    .catch(err => {
      return caches.match(event.request);
    }));
});