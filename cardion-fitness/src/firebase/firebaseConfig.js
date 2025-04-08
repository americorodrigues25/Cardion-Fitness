import { initializeApp } from "firebase/app";
import { getFirestore } from 'firebase/firestore';

import {
  initializeAuth,
  getReactNativePersistence
} from 'firebase/auth';

import ReactNativeAsyncStorage from '@react-native-async-storage/async-storage';

const firebaseConfig = {
  apiKey: "AIzaSyDnQFM88nUQVR2CibdVoGrvrL00oiK-Skk",
  authDomain: "cardion-95801.firebaseapp.com",
  projectId: "cardion-95801",
  storageBucket: "cardion-95801.firebasestorage.app",
  messagingSenderId: "1069299101382",
  appId: "1:1069299101382:web:3489cce6481322c74531c7"
};

// Inicializa Firebase
const app = initializeApp(firebaseConfig);

// Inicializa o Auth com persistência usando AsyncStorage
const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(ReactNativeAsyncStorage),
});

// Inicializa o Firestore
const db = getFirestore(app);

export { db, app, auth };
