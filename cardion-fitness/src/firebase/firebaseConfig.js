import { initializeApp } from "firebase/app";
import {getFirestore} from 'firebase/firestore'
import { getAuth } from 'firebase/auth';

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

// pega o banco de dados
const db = getFirestore(app)

const auth = getAuth(app)
export {db,app,auth}