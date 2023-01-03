// This is the "Offline copy of pages" service worker

importScripts('https://storage.googleapis.com/workbox-cdn/releases/5.1.2/workbox-sw.js');


workbox.routing.registerRoute(
    ({request}) => request.destination === "windows11",
    new workbox.strategies.NetworkFirst()
)
