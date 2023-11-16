import { util } from './util';

declare let self: ServiceWorkerGlobalScope;

const CACHE_NAME = 'my-cache-v2'; // Update the cache name for versioning

util();

let cacheData = "appV1";

self.addEventListener('install', (event) => {
    event?.waitUntil(
        caches.open(cacheData).then((cache) => {
            return cache.addAll([
                '/',
                '/finance-management/login',
                '/finance-management/register',
                '/finance-management/budget',
                '/finance-management/categories',
                '/finance-management/dashboard',
                '/finance-management/incomes',
                '/finance-management/outcomes',
                '/finance-management/recap',
                '/finance-management/report',
                '/finance-management/wallets',
                '/manifest.json', // Include the manifest file in the cache
            ]);
        })
    );
});

self.addEventListener('fetch', (event) => {
    if (event?.request.method !== 'GET') {
        return; // Do not cache non-GET requests
    }

    event.respondWith(
        caches.match(event.request).then((cachedResponse) => {
            // Return the cached response if it exists
            if (cachedResponse) {
                return cachedResponse;
            }

            // For other requests, continue fetching from the network
            return fetch(event.request).then((fetchResponse) => {
                // Check if we received a valid response
                if (!fetchResponse || fetchResponse.status !== 200 || fetchResponse.type !== 'basic') {
                    return fetchResponse;
                }

                // Clone the response to store it in the cache
                const responseToCache = fetchResponse.clone();

                caches.open(CACHE_NAME).then((cache) => {
                    cache.put(event.request, responseToCache);
                });

                return fetchResponse;
            });
        })
    );
});

self.addEventListener('activate', (event) => {
    event?.waitUntil(
        caches.keys().then((cacheNames) => {
            return Promise.all(
                cacheNames.map((name) => {
                    if (name !== CACHE_NAME && name.startsWith("app")) {
                        return caches.delete(name);
                    }
                })
            );
        })
    );
});
