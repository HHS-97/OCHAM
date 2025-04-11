// public/service-worker.js

// ─────────────────────────────────────────────────────
// 1) Firebase SDK 로드 (compat 버전)
// ─────────────────────────────────────────────────────
importScripts("https://www.gstatic.com/firebasejs/11.5.0/firebase-app-compat.js");
importScripts("https://www.gstatic.com/firebasejs/11.5.0/firebase-messaging-compat.js");

// ─────────────────────────────────────────────────────
// 2) Firebase 초기화 (빌드 시 env 값으로 교체)
// ─────────────────────────────────────────────────────
firebase.initializeApp({
  apiKey: "%VITE_API_KEY%",
  authDomain: "%VITE_AUTH_DOMAIN%",
  projectId: "%VITE_PROJECT_ID%",
  storageBucket: "%VITE_STORAGE_BUCKET%",
  messagingSenderId: "%VITE_MESSAGING_SENDER_ID%",
  appId: "%VITE_APP_ID%",
  measurementId: "%VITE_MEASURE_MENT_ID%",
});
const messaging = firebase.messaging();

// ─────────────────────────────────────────────────────
// 3) 캐시 설정
// ─────────────────────────────────────────────────────
const CACHE_NAME = 'v1-cache';
const urlsToCache = [
  '/',
  '/index.html',
  '/manifest.webmanifest',
  // 아이콘들
  '/icons/apple-touch-icon-57x57.png',
  '/icons/apple-touch-icon-60x60.png',
  '/icons/apple-touch-icon-72x72.png',
  '/icons/apple-touch-icon-76x76.png',
  '/icons/apple-touch-icon-114x114.png',
  '/icons/apple-touch-icon-120x120.png',
  '/icons/apple-touch-icon-144x144.png',
  '/icons/apple-touch-icon-152x152.png',
  '/icons/apple-touch-icon-180x180.png',
  '/icons/favicon-16x16.png',
  '/icons/favicon-32x32.png',
  '/icons/favicon-96x96.png',
  '/icons/favicon-128.png',
  '/icons/favicon-196x196.png',
  '/icons/favicon.ico',
  '/icons/mstile-70x70.png',
  '/icons/mstile-144x144.png',
  '/icons/mstile-150x150.png',
  '/icons/mstile-310x150.png',
  '/icons/mstile-310x310.png',
];

// 캐시에 리소스 추가
async function addResourcesToCache(resources) {
  const cache = await caches.open(CACHE_NAME);
  await cache.addAll(resources);
}

// ─────────────────────────────────────────────────────
// 4) 설치(install) 이벤트: 캐싱
// ─────────────────────────────────────────────────────
self.addEventListener('install', event => {
  event.waitUntil(
    addResourcesToCache(urlsToCache)
      .then(() => self.skipWaiting())
  );
});

// ─────────────────────────────────────────────────────
// 5) 활성화(activate) 이벤트: 오래된 캐시 삭제
// ─────────────────────────────────────────────────────
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(
        keys.map(key => {
          if (key !== CACHE_NAME) {
            return caches.delete(key);
          }
        })
      )
    ).then(() => clients.claim())
  );
});

// ─────────────────────────────────────────────────────
// 6) fetch 이벤트: 캐시 우선 응답
// ─────────────────────────────────────────────────────
self.addEventListener('fetch', event => {
  // API 요청은 항상 네트워크로 요청
  if (event.request.url.includes('/api/')) {
    event.respondWith(fetch(event.request));
    return;
  }
  
  // 정적 자원은 캐시 우선으로 처리
  event.respondWith(
    caches.match(event.request)
      .then(cached => {
        if (cached) return cached;
        return fetch(event.request);
      })
  );
});

// ─────────────────────────────────────────────────────
// 7) 백그라운드 푸시 핸들러 (FCM)
// ─────────────────────────────────────────────────────
self.addEventListener('push', event => {
  const payload = event.data ? event.data.json() : {};
  const data = payload.data || payload.notification || {};
  const title = data.title || '알림';
  const options = {
    body: data.body || '',
    icon: data.icon || '/icons/notification-icon.png',
    badge: data.badge || '/icons/notification-badge.png',
    vibrate: data.vibrate || [100, 50, 100],
    requireInteraction: data.type === 'THRESHOLD_REACHED',
    data: { click_action: data.click_action || '/' },
  };
  event.waitUntil(
    self.registration.showNotification(title, options)
  );
});

// ─────────────────────────────────────────────────────
// 8) 알림 클릭 이벤트 핸들러
// ─────────────────────────────────────────────────────
self.addEventListener('notificationclick', event => {
  event.notification.close();
  const landingPath = event.notification.data?.click_action || '/';
  const urlToOpen = new URL(landingPath, "%VITE_FCM_FRONT_URL%");

  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true })
      .then(windowClients => {
        const client = windowClients.find(c =>
          c.url.includes("%VITE_FCM_FRONT_URL%") && 'focus' in c
        );
        return client ? client.focus() : clients.openWindow(urlToOpen.href);
      })
  );
});
