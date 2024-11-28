import { initializeApp } from "firebase/app";
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
    apiKey: "AIzaSyDriqbXowTC8IuXlRwrDbLwgQDPR15hIlo",
    authDomain: "logistic-bd789.firebaseapp.com",
    projectId: "logistic-bd789",
    storageBucket: "logistic-bd789.appspot.com",
    messagingSenderId: "614642543831",
    appId: "1:614642543831:web:528057017e1affccc49492"
};

const app = initializeApp(firebaseConfig);
export const imageDb = getStorage(app)

