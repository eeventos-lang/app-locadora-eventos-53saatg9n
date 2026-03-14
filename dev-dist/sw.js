const CACHE_NAME = 'e-eventos-cache-v1'
const urlsToCache = ['/', '/index.html', '/manifest.json']

self.addEventListener('install', (event) => {
  event.waitUntil(caches.open(CACHE_NAME).then((cache) => cache.addAll(urlsToCache)))
})

self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => {
      if (response) return response
      return fetch(event.request).catch(() => {
        // Offline fallback strategy can be implemented here
      })
    }),
  )
})

self.addEventListener('push', function (event) {
  const data = event.data ? event.data.json() : {}
  const title = data.title || 'e-eventos'
  const options = {
    body: data.body || 'Você tem uma nova notificação.',
    icon: '/pwa-icon.svg',
    badge: '/pwa-icon.svg',
    data: {
      url: data.url || '/',
    },
  }
  event.waitUntil(self.registration.showNotification(title, options))
})

self.addEventListener('notificationclick', function (event) {
  event.notification.close()
  const urlToOpen = event.notification.data.url || '/'
  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then(function (clientList) {
      if (clientList.length > 0) {
        let client = clientList[0]
        for (let i = 0; i < clientList.length; i++) {
          if (clientList[i].focused) {
            client = clientList[i]
          }
        }
        return client.focus().then(() => client.navigate(urlToOpen))
      }
      return clients.openWindow(urlToOpen)
    }),
  )
})
