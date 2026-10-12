const CACHE_NAME = 'union-app-v1';
const assetsToCache = [
  '/',
  '/index.html',
  '/logo.png'
];

// التثبيت والتخزين المؤقت للملفات الأساسية
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(assetsToCache);
    })
  );
});

// استجابة الطلبات من الكاش أو الشبكة لجميع الأجهزة
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => {
      return response || fetch(event.request);
    })
  );
});