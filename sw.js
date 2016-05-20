importScripts('/cache-polyfill.js');

const PREFIX = 'WebClino';
const VER = 'v0.1.3-preAlpha-t22';
const OFFLINE_CACHE = `${PREFIX}-${VER}`;

var CACHE_URLS = [
'/',
'/index.html',
'/manifest.json',
'/cache-polyfill.js',
'/fonts/material-icons.css',
'/css/material.custom.css',
'/js/orient.js',
'/js/ui.js',
'/js/util.js',
'/js/init.js',
'/js/svgnet.js',
'/css/material.teal-blue.min.css',
'/fonts/MaterialIcons-Regular.woff2',
'/fonts/MaterialIcons-Regular.woff',
'/fonts/MaterialIcons-Regular.ttf',
'/fonts/MaterialIcons-Regular.eot',
'/js/material.min.js',
'/icon.png'
      ]

self.addEventListener('install', function (e) {
	e.waitUntil(
		caches.open(OFFLINE_CACHE).then(function (cache) {
			return cache.addAll(CACHE_URLS).then(function () {
				return self.skipWaiting();
			});
		})
	);
});

//self.addEventListener('activate', function (event) {
//	event.waitUntil(self.clients.claim());
//});

self.addEventListener('activate', function (event) {
	// Delete old asset caches.
	event.waitUntil(
		caches.keys().then(function (keys) {
			return Promise.all(
				keys.map(function (key) {
					console.log(key);
					if (key != OFFLINE_CACHE) {
						console.log("Updating Cache...");
						return caches.delete(key);
					} else {
						console.log("Cache Okay")
					}
				})
			);
		})
	);

});


self.addEventListener('fetch', function (event) {
	//console.log(event.request.url);

	event.respondWith(
		caches.match(event.request).then(function (response) {
			return response || fetch(event.request);
		})
	);
});
