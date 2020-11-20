// CACHE DATA WHEN NOT ONLINE 
const CACHE_NAME = "my-site-cache-v1";
const DATA_CACHE_NAME = "data-cache-v1";

// PROVIDE ARRAYS FOR URLS THAT PWA SHOULD CACHE We need to provide an array 
// In other words, we're telling the PWA to be prepared to use the service worker anytime the browser tries to hit any of these routes. In a large web app there could be lots of entries here.
const urlsToCache = [
  "/",
  "/db.js",
  "/index.js",
  "/manifest.json",
  "/styles.css",
  "/icons/icon-192x192.png",
  "/icons/icon-512x512.png"
];

// WHEN USER INSTALLS APP, THIS CODE FIRES
self.addEventListener("install", function(event) {
  // Perform install steps
  event.waitUntil(
    caches.open(CACHE_NAME).then(function(cache) {
      console.log("Opened cache");
      return cache.addAll(urlsToCache);
    })
  );
});

// LISTEN FOR EVENTS WHERE API CALL (FETCH) IS MADE
// This is when, normally, the browser would send a request to the server. 
self.addEventListener("fetch", function(event) {
  // By making sure all our fetch routes have the "/api/" prefix, it's easy to identify the ones we want to intercept
  if (event.request.url.includes("/api/")) {
    event.respondWith(
      caches.open(DATA_CACHE_NAME).then(cache => {

        // IF ONLINE, EVERYTHING SHOULD RUN NORMALLY
        return fetch(event.request)
          .then(response => {
            // IF RESPONSE SUCCESSFUL, STORE NAME OF ACCESSED ROUTE IN CACHE
            // That way, if the same route is accessed later without an Internet connection, we can substitute the saved data.
            if (response.status === 200) {
              cache.put(event.request.url, response.clone());
            }

            return response;
          })

          // IF RESPONSE FAILS, PULL CORRECT SAVED DATA FROM CACHE AND SEND BACK INSTEAD
          .catch(err => {
            // Network request failed, try to get it from the cache.
            return cache.match(event.request);
          });
      }).catch(err => console.log(err))
    )
    }
})