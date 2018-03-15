  var config = {
    apiKey: "AIzaSyAQ4EMDyfFrwIbbcphxGtbRb5JZsl2h7sA",
    authDomain: "pwa-gram-2dc88.firebaseapp.com",
    databaseURL: "https://pwa-gram-2dc88.firebaseio.com",
    projectId: "pwa-gram-2dc88",
    storageBucket: "pwa-gram-2dc88.appspot.com",
    messagingSenderId: "623992431298"
  };
  firebase.initializeApp(config);
  var db = firebase.database().ref();