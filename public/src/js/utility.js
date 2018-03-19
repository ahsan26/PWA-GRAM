var dbPromise = idb.open("posts-store", 1, db => {
  if (!db.objectStoreNames.contains("posts")) {
    db.createObjectStore("posts", {
      keyPath: "id"
    });
  }
  if (!db.objectStoreNames.contains("sync-posts")) {
    db.createObjectStore("sync-posts", {
      keyPath: "id"
    });
  }
});

function writeData(data, st) {
  return dbPromise.then(db => {
    let tx = db.transaction(st, "readwrite");
    let store = tx.objectStore(st);
    store.put(data);
    return tx.complete;
  });
};

function readData(st) {
  return dbPromise.then(db => {
    let tx = db.transaction(st, "readonly");
    let store = tx.objectStore(st);
    return store.getAll();
  });
};

function removeAllDataFromLocalDB(st) {
  dbPromise.then(db => {
    let trans = db.transaction(st, "readwrite");
    let store = trans.objectStore(st);
    store.clear();
    return trans.complete;
  });
}