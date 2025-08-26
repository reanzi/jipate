// This directive tells TypeScript to include the WebWorker and ServiceWorker global types.
/// <reference lib="WebWorker" />

// We use a JSDoc comment to hint the type of 'self', which is a standard way
// to provide type information in plain JavaScript files for tooling without
// causing syntax errors in the browser.
/** @type {ServiceWorkerGlobalScope} */
// @ts-ignore
const sw = self;

// A unique name for the cache
const CACHE_NAME = "pwa-app-cache-v12"; // Increment to force a new cache version

// The list of critical files to pre-cache during installation.
// We've simplified this to just the main entry points.
const urlsToCache = ["/", "/index.html", "/manifest.json"];

// The 'install' event is fired when the service worker is installed.
/**
 * @param {ExtendableEvent} event
 */
sw.addEventListener("install", (event) => {
	console.log("Service Worker: Installing and caching assets...");
	event.waitUntil(
		caches
			.open(CACHE_NAME)
			.then((cache) => {
				return cache.addAll(urlsToCache);
			})
			.then(() => {
				// Forces the waiting service worker to become the active service worker
				return sw.skipWaiting();
			}),
	);
});

// The 'activate' event is fired when the service worker is activated.
/**
 * @param {ExtendableEvent} event
 */
sw.addEventListener("activate", (event) => {
	console.log("Service Worker: Activating and cleaning up old caches...");
	event.waitUntil(
		caches
			.keys()
			.then((cacheNames) => {
				return Promise.all(
					cacheNames.map((cacheName) => {
						// Delete any old caches that don't match the new CACHE_NAME
						if (cacheName !== CACHE_NAME) {
							console.log("Service Worker: Deleting old cache:", cacheName);
							return caches.delete(cacheName);
						}
					}),
				);
			})
			.then(() => {
				// Immediately claim control of all clients
				return sw.clients.claim();
			}),
	);
});

// The 'fetch' event is fired for every network request.
/**
 * @param {FetchEvent} event
 */
sw.addEventListener("fetch", (event) => {
	// The key to a good offline experience is handling every request.
	event.respondWith(
		caches.match(event.request).then((response) => {
			// 1. Cache-First: Try to get the response from the cache.
			if (response) {
				console.log("Service Worker: Serving from cache", event.request.url);
				return response;
			}

			// 2. Network Fallback: If not in cache, fetch it from the network.
			console.log("Service Worker: Serving from network", event.request.url);
			return fetch(event.request)
				.then((networkResponse) => {
					// Check for valid response before caching
					if (
						!networkResponse ||
						networkResponse.status !== 200 ||
						networkResponse.type !== "basic"
					) {
						return networkResponse;
					}
					// Clone the response so we can use it and put it in cache
					const responseToCache = networkResponse.clone();

					// Open the cache and add the new network response
					caches.open(CACHE_NAME).then((cache) => {
						cache.put(event.request, responseToCache);
					});

					return networkResponse;
				})
				.catch(() => {
					// 3. Offline Fallback: If both cache and network fail, we must return a valid Response object.
					if (event.request.mode === "navigate") {
						return caches.match("/index.html").then((offlineResponse) => {
							if (offlineResponse) {
								return offlineResponse;
							} else {
								return new Response(
									"<h1>Offline</h1><p>The application is not available offline.</p>",
									{
										status: 503,
										headers: { "Content-Type": "text/html" },
									},
								);
							}
						});
					}

					// For non-navigation requests, we return a simple HTML page with a service unavailable message.
					console.error(
						"Service Worker: Fetch failed, and no cache match found for:",
						event.request.url,
					);
					return new Response(
						"<h1>Service Unavailable</h1><p>Please check your internet connection and try again.</p>",
						{
							status: 503,
							headers: { "Content-Type": "text/html" },
						},
					);
				});
		}),
	);
});
