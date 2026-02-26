// firebase-messaging-sw.js
// FCM background message handler for CMLB Recipes
// Served at /cmlbRecipes/firebase-messaging-sw.js (repo root = /cmlbRecipes/ path on GitHub Pages)

// The compat SDK is required in service workers — they don't support ES module imports via importScripts
importScripts('https://www.gstatic.com/firebasejs/10.12.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/10.12.0/firebase-messaging-compat.js');

firebase.initializeApp({
  apiKey: "AIzaSyDtszGE-y56VKC0vtXUdRY12Iujuh_lJN8",
  authDomain: "cmlb-recipes.firebaseapp.com",
  projectId: "cmlb-recipes",
  storageBucket: "cmlb-recipes.firebasestorage.app",
  messagingSenderId: "646061210319",
  appId: "1:646061210319:web:5208edb8a47a8c959d15ba"
});

const messaging = firebase.messaging();

// Handle background messages (app tab closed or not focused)
messaging.onBackgroundMessage(function(payload) {
  const title = payload.notification?.title || 'CMLB Recipes';
  const options = {
    body: payload.notification?.body || "Tonight's dinner suggestion is ready.",
    icon: '/cmlbRecipes/favicon.svg',
    badge: '/cmlbRecipes/favicon.svg',
    data: { url: 'https://cjroberts28.github.io/cmlbRecipes/' }
  };
  self.registration.showNotification(title, options);
});

// On notification click: open or focus the app tab
self.addEventListener('notificationclick', function(event) {
  event.notification.close();
  const targetUrl = event.notification.data?.url || 'https://cjroberts28.github.io/cmlbRecipes/';
  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then(function(clientList) {
      for (const client of clientList) {
        if (client.url.includes('cmlbRecipes') && 'focus' in client) {
          return client.focus();
        }
      }
      if (clients.openWindow) return clients.openWindow(targetUrl);
    })
  );
});
