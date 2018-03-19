importScripts("/src/js/idb.js");
importScripts("/src/js/utility.js");
importScripts("https://www.gstatic.com/firebasejs/4.11.0/firebase.js");
importScripts("/src/js/firebase.js");

const Cache_Static_Name = "static-v1";
const Cache_Dynamic_Name = "dynamic-v1";

self.addEventListener("install", event => {
  console.log("SW in installing!");
  event.waitUntil(
    caches.open(Cache_Static_Name)
    .then(cache => {
      const resources = ["/", "/index.html", "/offline.html", "/styles.css", "/src/js/app.js", "/manifest.json", "/src/js/idb.js"];
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
        return caches.match(event.request)
          .then(res => {
            if (!res) {
              return caches.open(Cache_Static_Name).then(cache => {
                return cache.match("/offline.html");
              });
            }
            return res;
          })
      }));
  } else {
    event.respondWith(
      fetch(event.request)
      .then(res => {
        let cloneRes = res.clone();
        cloneRes.json()
          .then(data => {
            if (data !== undefined && data !== null && Object.keys(data).length !== 0) {
              removeAllDataFromLocalDB("posts");
              Object.keys(data).forEach(key => {
                writeData(data[key], "posts");
              });
            }
          })
        return res;
      })
      .catch()
    );
  }
});

// self.addEventListener("sync", event => {
//       if (event.tag === "sync-new-post") {
//         event.waitUntil(
//           readData("sync-posts")
//           .then(data => {
//               data.forEach(eachPost => {
//                 let id = createUniqueId();
//                 let storageRef = firebase.storage().ref(imgFile.name);
//                 let task = storageRef.put(imgFile);
//                 task.then(res => {
//                   let img_url = res.metadata.downloadURLs[0];
//                   var dataOfPost = {
//                     id,
//                     title,
//                     location,
//                     image: img_url
//                   };
//                   let dbRef = firebase.database().ref();
//                   dbRef.child("posts").child(id).set(dataOfPost);
//                 });
//               })
//             )
//           }
//         });


self.addEventListener("sync", event=>{
  if(event.tag=="sync-new-post"){
    readData("sync-posts")
    .then(data=>{
      data.forEach(each_sync_post=>{
        // let storageRef = firebase.storage().ref(imgFile.name);
        // let task = storageRef.put(imgFile);
        // task.then(res => {
          const {id, title, location} = each_sync_post;
          // let img_url = res.metadata.downloadURLs[0];
          var dataOfPost = {
            id,
            title,
            location,
            image: "https://firebasestorage.googleapis.com/v0/b/pwa-gram-2dc88.appspot.com/o/offline-first-Logo.png?alt=media&token=99178fcf-eb59-483a-a106-cc37e70cf1b0"
          };
          db.child("posts").child(id).set(dataOfPost);
        // });
      });
    });
  }
});
