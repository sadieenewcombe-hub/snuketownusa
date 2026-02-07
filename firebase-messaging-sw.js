// Import Firebase scripts for service worker
importScripts('https://www.gstatic.com/firebasejs/10.7.1/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/10.7.1/firebase-messaging-compat.js');

// Initialize Firebase in the service worker
firebase.initializeApp({
  apiKey: "AIzaSyBcLB4LtI3f7Xuxa4tMCxzcSG6Bi3XSaOI",
  authDomain: "snuketownusa.firebaseapp.com",
  projectId: "snuketownusa",
  storageBucket: "snuketownusa.firebasestorage.app",
  messagingSenderId: "294126465212",
  appId: "1:294126465212:web:55e21ba84523144eafa0b9",
  measurementId: "G-JPKN8K2K9V"
});

// Retrieve an instance of Firebase Messaging
const messaging = firebase.messaging();

// Handle background messages
messaging.onBackgroundMessage((payload) => {
  console.log('[firebase-messaging-sw.js] Received background message ', payload);
  
  // Customize notification here
  const notificationTitle = payload.notification.title || 'New Family Update';
  const notificationOptions = {
    body: payload.notification.body || 'Someone posted in the family archives',
    icon: '/icon-192.png', // You can add a custom icon
    badge: '/badge-72.png', // Optional badge icon
    vibrate: [200, 100, 200], // Vibration pattern
    tag: 'family-archives-notification',
    requireInteraction: false,
    data: {
      url: payload.data?.url || '/'
    }
  };

  return self.registration.showNotification(notificationTitle, notificationOptions);
});

// Handle notification click
self.addEventListener('notificationclick', (event) => {
  console.log('[Service Worker] Notification click received.');
  
  event.notification.close();
  
  // Open or focus the app when notification is clicked
  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then((clientList) => {
      // If a window is already open, focus it
      for (const client of clientList) {
        if (client.url === '/' && 'focus' in client) {
          return client.focus();
        }
      }
      // Otherwise open a new window
      if (clients.openWindow) {
        return clients.openWindow('/');
      }
    })
  );
});
