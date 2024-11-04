import { initializeApp } from "firebase/app";
import { initializeAuth, getReactNativePersistence } from "firebase/auth";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { getAuth } from "firebase/auth";
import firebase from "firebase/compat/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
    apiKey: "AIzaSyBL3lr1wCvjAtPs9H-jVZa6MZa5YIuertM",
    authDomain: "crimemonitoring-96849.firebaseapp.com",
    projectId: "crimemonitoring-96849",
    storageBucket: "crimemonitoring-96849.firebasestorage.app",
    messagingSenderId: "811645391654",
    appId: "1:811645391654:web:b3250bec151e20611667e7"
};

// Initialize Firebase
export const Firebase_app = initializeApp(firebaseConfig);
export const Firebase_auth = initializeAuth(Firebase_app, {
    persistence: getReactNativePersistence(AsyncStorage),
});
export const Firebase_DB = getFirestore(Firebase_app);