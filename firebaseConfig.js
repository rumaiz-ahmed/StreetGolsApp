import { initializeApp } from "firebase/app";
import { initializeAuth, getReactNativePersistence } from "firebase/auth";
import ReactNativeAsyncStorage from "@react-native-async-storage/async-storage";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyBsF7cDFKWbZwNWPVH3WErYkEBiBixDNE8",
  authDomain: "streetgols-b8f3a.firebaseapp.com",
  databaseURL: "https://streetgols-b8f3a-default-rtdb.firebaseio.com",
  projectId: "streetgols-b8f3a",
  storageBucket: "streetgols-b8f3a.appspot.com",
  messagingSenderId: "751472284703",
  appId: "1:751472284703:web:21dca71053a2314158b12a",
  measurementId: "G-S0WMD11LBX",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Get the authentication and firestore instances
const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(ReactNativeAsyncStorage),
});

const db = getFirestore(app);

const storage = getStorage(app);

export { auth, db, storage };
