importScripts("/src/js/idb.js");
importScripts("/src/js/utility.js");
const Cache_Static_Name = "static-v1";
const Cache_Dynamic_Name = "dynamic-v1";

self.addEventListener("install", event => {
  console.log("SW in installing!");
  event.waitUntil(
    caches.open(Cache_Static_Name)
    .then(cache => {
      const resources = ["/", "/index.html", "/styles.css", "/src/js/app.js", "/manifest.json", "/src/js/idb.js"];
      cache.addAll(resources);
    })
  )
});

self.addEventListener("activate", event => {
  console.log("Service Worker is activated!");
  event.waitUntil(
    caches.keys()
    .then(keys => {
      return Promise.all(keys.map(key => {
        if (key != Cache_Static_Name && key != Cache_Dynamic_Name) {
          return caches.delete(key);
        }
      }));
    })
  );
});

self.addEventListener("fetch", event => {
  let url = "https://pwa-gram-2dc88.firebaseio.com/posts";
  if (event.request.url.indexOf(url) == -1) {
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
  } else {
    event.respondWith(
      fetch(event.request)
      .then(res => {
        let cloneRes = res.clone();
        cloneRes.json()
          .then(data => {
            Object.keys(data).forEach(key => {
              writeData(data[key], "posts");
            });
          })
        return res;
      })
      .catch()
    );
  }
});