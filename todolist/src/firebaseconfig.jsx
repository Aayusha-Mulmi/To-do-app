import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyBg4L7YbdSpim5abb9c01AO0BKK2eftG0w",
  authDomain: "todo-9d745.firebaseapp.com",
  projectId: "todo-9d745",
  storageBucket: "todo-9d745.appspot.com",
  messagingSenderId: "863636932655",
  appId: "1:863636932655:web:60e15a62ac49ea1a7a1eda",
  measurementId: "G-RGKKTMF72D"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export { db };