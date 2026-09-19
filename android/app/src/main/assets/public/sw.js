/**
 * Copyright 2018 Google Inc. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *     http://www.apache.org/licenses/LICENSE-2.0
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

// If the loader is already loaded, just stop.
if (!self.define) {
  let registry = {};

  // Used for `eval` and `importScripts` where we can't get script URL by other means.
  // In both cases, it's safe to use a global var because those functions are synchronous.
  let nextDefineUri;

  const singleRequire = (uri, parentUri) => {
    uri = new URL(uri + ".js", parentUri).href;
    return registry[uri] || (
      
        new Promise(resolve => {
          if ("document" in self) {
            const script = document.createElement("script");
            script.src = uri;
            script.onload = resolve;
            document.head.appendChild(script);
          } else {
            nextDefineUri = uri;
            importScripts(uri);
            resolve();
          }
        })
      
      .then(() => {
        let promise = registry[uri];
        if (!promise) {
          throw new Error(`Module ${uri} didn’t register its module`);
        }
        return promise;
      })
    );
  };

  self.define = (depsNames, factory) => {
    const uri = nextDefineUri || ("document" in self ? document.currentScript.src : "") || location.href;
    if (registry[uri]) {
      // Module is already loading or loaded.
      return;
    }
    let exports = {};
    const require = depUri => singleRequire(depUri, uri);
    const specialDeps = {
      module: { uri },
      exports,
      require
    };
    registry[uri] = Promise.all(depsNames.map(
      depName => specialDeps[depName] || require(depName)
    )).then(deps => {
      factory(...deps);
      return exports;
    });
  };
}
define(['./workbox-7e5eb42b'], (function (workbox) { 'use strict';

  self.skipWaiting();
  workbox.clientsClaim();
  /**
   * The precacheAndRoute() method efficiently caches and responds to
   * requests for URLs in the manifest.
   * See https://goo.gl/S9QRab
   */
  workbox.precacheAndRoute([{
    "url": "screenshot-mobile.png",
    "revision": "c43e8b82b4b15b7f48efae59043b1d34"
  }, {
    "url": "screenshot-desktop.png",
    "revision": "46fe53976e591c3d8072f35d1a53ef95"
  }, {
    "url": "registerSW.js",
    "revision": "1872c500de691dce40960bb85481de07"
  }, {
    "url": "pwa-maskable-512x512.png",
    "revision": "c2da4fb2af55119f6bcca9a045e81b43"
  }, {
    "url": "pwa-512x512.png",
    "revision": "5b75b92a7ee50254ec5f5d6445877545"
  }, {
    "url": "pwa-192x192.png",
    "revision": "d07410d1df06fd4446f575c1359fdcf9"
  }, {
    "url": "index.html",
    "revision": "82de46a10535ddf6c129564d908e7eee"
  }, {
    "url": "icon.svg",
    "revision": "9b2821859e8de9f4aa0ee472624f7083"
  }, {
    "url": "favicon.ico",
    "revision": "70f2e6d80b1fbb39cdd58aad277d007b"
  }, {
    "url": "apple-touch-icon.png",
    "revision": "969b56145992b5a727907f208e07d469"
  }, {
    "url": "assets/index-ZEz949Yz.js",
    "revision": null
  }, {
    "url": "assets/index-4VvmnADa.css",
    "revision": null
  }, {
    "url": "apple-touch-icon.png",
    "revision": "969b56145992b5a727907f208e07d469"
  }, {
    "url": "favicon.ico",
    "revision": "70f2e6d80b1fbb39cdd58aad277d007b"
  }, {
    "url": "icon.svg",
    "revision": "9b2821859e8de9f4aa0ee472624f7083"
  }, {
    "url": "pwa-192x192.png",
    "revision": "d07410d1df06fd4446f575c1359fdcf9"
  }, {
    "url": "pwa-512x512.png",
    "revision": "5b75b92a7ee50254ec5f5d6445877545"
  }, {
    "url": "pwa-maskable-512x512.png",
    "revision": "c2da4fb2af55119f6bcca9a045e81b43"
  }, {
    "url": "manifest.webmanifest",
    "revision": "7fec791a63eb9e4bfe33d7835128f5cc"
  }], {});
  workbox.cleanupOutdatedCaches();
  workbox.registerRoute(new workbox.NavigationRoute(workbox.createHandlerBoundToURL("index.html")));

}));
