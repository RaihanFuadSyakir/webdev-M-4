import { util } from './util';

declare let self: ServiceWorkerGlobalScope

// To disable all workbox logging during development, you can set self.__WB_DISABLE_DEV_LOGS to true
// https://developers.google.com/web/tools/workbox/guides/configure-workbox#disable_logging
//
// self.__WB_DISABLE_DEV_LOGS = true

util();

self.addEventListener('install', (event) => {
    event?.waitUntil(
      caches.open('my-cache').then((cache) => {
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
        ]);
      })
    );
  });
  
  self.addEventListener('fetch', (event) => {
    event?.respondWith(
      caches.match(event.request).then((response) => {
        return response || fetch(event.request);
      })
    );
  });