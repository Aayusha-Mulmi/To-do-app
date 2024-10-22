import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyA0iziaaEmaA0IBZwnHZRril3IKdQADfCY",
  authDomain: "to-do-app-70d73.firebaseapp.com",
  projectId: "to-do-app-70d73",
  storageBucket: "to-do-app-70d73.appspot.com",
  messagingSenderId: "545400633241",
  appId: "1:545400633241:web:853f61051a664289fd0508",
  measurementId: "G-DC8GYXD7CC"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export { db };