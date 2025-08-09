// This directive tells TypeScript to include the WebWorker and ServiceWorker global types.
/// <reference lib="WebWorker" />

// The TypeScript compiler will infer the type of 'self' from the reference directive.
// We can use a JSDoc comment for documentation, but avoid a type annotation.
const sw = self;

// A unique name for the cache
const CACHE_NAME = "pwa-app-cache-v1";
// The list of files to cache during installation
const urlsToCache = [
	"/",
	"/index.html",
	"/manifest.json",
	"/static/css/main.css", // Example static asset path
	"/static/js/bundle.js", // Example static asset path
	// Add other critical assets here like images, fonts, etc.
];

// The 'install' event is fired when the service worker is installed.
/**
 * @param {ExtendableEvent} event
 */
sw.addEventListener("install", (event) => {
	console.log("Service Worker: Installing...");
	event.waitUntil(
		caches.open(CACHE_NAME).then((cache) => {
			console.log("Service Worker: Caching critical assets");
			return cache.addAll(urlsToCache);
		}),
	);
});

// The 'fetch' event is fired for every network request.
/**
 * @param {FetchEvent} event
 */
sw.addEventListener("fetch", (event) => {
	// We check if the request is for an asset we've cached.
	event.respondWith(
		caches.match(event.request).then((response) => {
			// If the asset is in the cache, return it.
			if (response) {
				console.log("Service Worker: Serving from cache", event.request.url);
				return response;
			}

			// If the asset is not in the cache, fetch it from the network.
			console.log("Service Worker: Fetching from network", event.request.url);
			return fetch(event.request);
		}),
	);
});

// The 'activate' event is fired when the service worker is activated.
/**
 * @param {ExtendableEvent} event
 */
sw.addEventListener("activate", (event) => {
	console.log("Service Worker: Activating...");
	// This step ensures the new service worker takes control immediately.
	// @ts-ignore
	event.waitUntil(sw.clients.claim());
});
