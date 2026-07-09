const CACHE_NAME = "laqfresa-pos-v3";

const FILES_TO_CACHE = [
    "./",
    "./index.html",
    "./styles.css",
    "./app.js",
    "./datos.js",
    "./manifest.json",
    "./icon-192.png",
    "./icon-512.png"
];

// INSTALAR
self.addEventListener("install", event => {

    self.skipWaiting();

    event.waitUntil(

        caches.open(CACHE_NAME)
            .then(cache => cache.addAll(FILES_TO_CACHE))

    );

});

// ACTIVAR
self.addEventListener("activate", event => {

    event.waitUntil(

        caches.keys().then(keys =>

            Promise.all(

                keys.map(key => {

                    if(key !== CACHE_NAME){
                        return caches.delete(key);
                    }

                })

            )

        )

    );

    self.clients.claim();

});

// FETCH
self.addEventListener("fetch", event => {

    event.respondWith(

        caches.match(event.request).then(response => {

            return response || fetch(event.request);

        })

    );

});