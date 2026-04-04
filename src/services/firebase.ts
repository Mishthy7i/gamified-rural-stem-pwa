import { initializeApp } from "firebase/app";
import {
  initializeFirestore,
  persistentLocalCache,
  persistentMultipleTabManager,
  CACHE_SIZE_UNLIMITED,
} from "firebase/firestore";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyDx0Vb3PDhqv7KZcdNcn7Nh4h66VJYAFgE",
  authDomain: "stem-rural-pwa.firebaseapp.com",
  projectId: "stem-rural-pwa",
  storageBucket: "stem-rural-pwa.firebasestorage.app",
  messagingSenderId: "153595788199",
  appId: "1:153595788199:web:d03939d43f75b33bac1482",
};

const app = initializeApp(firebaseConfig);

/** IndexedDB-backed cache: offline reads (warm cache) + queued writes that sync when online. */
export const db = initializeFirestore(app, {
  localCache: persistentLocalCache({
    tabManager: persistentMultipleTabManager(),
    cacheSizeBytes: CACHE_SIZE_UNLIMITED,
  }),
});

export const auth = getAuth(app);
