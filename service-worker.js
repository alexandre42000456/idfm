// Service Worker pour les notifications IDFM
const CACHE_NAME = 'idfm-notifications-v1';
const CACHE_URLS = [
    '/',
    '/index.html',
    '/app.js'
];

// Installation du Service Worker
self.addEventListener('install', (event) => {
    console.log('🔧 Service Worker: Installation');

    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(cache => {
                console.log('📦 Service Worker: Mise en cache des ressources');
                return cache.addAll(CACHE_URLS);
            })
            .then(() => {
                console.log('✅ Service Worker: Installation terminée');
                return self.skipWaiting();
            })
    );
});

// Activation du Service Worker
self.addEventListener('activate', (event) => {
    console.log('🚀 Service Worker: Activation');

    event.waitUntil(
        caches.keys()
            .then(cacheNames => {
                return Promise.all(
                    cacheNames
                        .filter(name => name !== CACHE_NAME)
                        .map(name => {
                            console.log('🗑️ Service Worker: Suppression du cache obsolète', name);
                            return caches.delete(name);
                        })
                );
            })
            .then(() => {
                console.log('✅ Service Worker: Activation terminée');
                return self.clients.claim();
            })
    );
});

// Gestion des requêtes (stratégie Network First)
self.addEventListener('fetch', (event) => {
    event.respondWith(
        fetch(event.request)
            .then(response => {
                // Mettre en cache les réponses réussies
                if (response.ok) {
                    const responseClone = response.clone();
                    caches.open(CACHE_NAME)
                        .then(cache => cache.put(event.request, responseClone));
                }
                return response;
            })
            .catch(() => {
                // En cas d'erreur réseau, utiliser le cache
                return caches.match(event.request);
            })
    );
});

// Écouter les messages de la page principale
self.addEventListener('message', (event) => {
    console.log('📨 Service Worker: Message reçu', event.data);

    if (event.data.type === 'NEW_DISRUPTION') {
        handleNewDisruption(event.data.disruptions);
    }
});

// Gérer l'affichage des notifications pour les nouvelles perturbations
function handleNewDisruption(disruptions) {
    if (!disruptions || disruptions.length === 0) {
        return;
    }

    const count = disruptions.length;
    let title, body;

    if (count === 1) {
        title = '🚨 Nouvelle perturbation IDFM';
        const messages = disruptions[0].messages
            .map(msg => msg.text)
            .filter(text => text);

        body = messages.length > 0
            ? messages[0]
            : 'Perturbation détectée sur la ligne C01382';
    } else {
        title = `🚨 ${count} nouvelles perturbations IDFM`;
        body = `${count} perturbations détectées sur la ligne C01382`;
    }

    // Afficher la notification
    self.registration.showNotification(title, {
        body: body,
        icon: 'https://via.placeholder.com/192',
        badge: 'https://via.placeholder.com/96',
        tag: 'idfm-disruption',
        requireInteraction: true,
        vibrate: [200, 100, 200],
        data: {
            url: self.registration.scope,
            timestamp: Date.now()
        },
        actions: [
            {
                action: 'view',
                title: 'Voir les détails'
            },
            {
                action: 'dismiss',
                title: 'Fermer'
            }
        ]
    });

    console.log('✅ Service Worker: Notification affichée');
}

// Gérer les clics sur les notifications
self.addEventListener('notificationclick', (event) => {
    console.log('👆 Service Worker: Clic sur notification', event.action);

    event.notification.close();

    if (event.action === 'view' || !event.action) {
        // Ouvrir ou focaliser l'application
        event.waitUntil(
            clients.matchAll({ type: 'window', includeUncontrolled: true })
                .then(clientList => {
                    // Chercher une fenêtre déjà ouverte
                    for (const client of clientList) {
                        if (client.url.includes(self.registration.scope) && 'focus' in client) {
                            return client.focus();
                        }
                    }

                    // Ouvrir une nouvelle fenêtre si aucune n'est ouverte
                    if (clients.openWindow) {
                        return clients.openWindow(event.notification.data.url || '/');
                    }
                })
        );
    }
});

// Gérer la fermeture des notifications
self.addEventListener('notificationclose', (event) => {
    console.log('❌ Service Worker: Notification fermée');
});

console.log('🎯 Service Worker chargé');
