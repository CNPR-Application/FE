importScripts("https://www.gstatic.com/firebasejs/8.10.0/firebase-app.js");
importScripts(
  "https://www.gstatic.com/firebasejs/8.10.0/firebase-messaging.js"
);
firebase.initializeApp({
  apiKey: "AIzaSyDpAOynBW6XsCygjz_AIQkz2oAmp9a_-Tc",
  authDomain: "app-test-c1bfb.firebaseapp.com",
  projectId: "app-test-c1bfb",
  storageBucket: "app-test-c1bfb.appspot.com",
  messagingSenderId: "399453444594",
  appId: "1:399453444594:web:0e2145dc7d04548d5c336b",
  measurementId: "G-DNB0913N47",
});
const messaging = firebase.messaging();
