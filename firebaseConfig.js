import { initializeApp } from "firebase/app";
import { initializeAuth, getReactNativePersistence } from "firebase/auth";
import ReactNativeAsyncStorage from "@react-native-async-storage/async-storage";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyCvzAp1z481kpyJKVnCULxWEjrHZfsn0Mg",
  authDomain: "streetgols-9d971.firebaseapp.com",
  projectId: "streetgols-9d971",
  storageBucket: "streetgols-9d971.appspot.com",
  messagingSenderId: "323410323142",
  appId: "1:323410323142:web:b15fe6bc338a784449d9c7",
  measurementId: "G-PWFRZ4LQ6H"
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
