import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.4/firebase-app.js";
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  onAuthStateChanged,
  signOut,

} from "https://www.gstatic.com/firebasejs/10.12.4/firebase-auth.js";

import {
  getFirestore,
  doc,
  collection,
  addDoc,
  serverTimestamp,
  onSnapshot,
  getDocs
} from "https://www.gstatic.com/firebasejs/10.12.4/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyCcMMtNnqyC9lHtN3PrAQLuSFIMmN9XrQc",
  authDomain: "ecommerce-website-3fa32.firebaseapp.com",
  projectId: "ecommerce-website-3fa32",
  storageBucket: "ecommerce-website-3fa32.appspot.com",
  messagingSenderId: "497975527711",
  appId: "1:497975527711:web:514a6b2444f2701466082a"
};

const app = initializeApp(firebaseConfig);

const auth = getAuth(app);
const db = getFirestore(app);


export {
  auth,
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  onAuthStateChanged,
  signOut,
  doc,
  collection,
  addDoc,
  serverTimestamp,
  onSnapshot,
  getDocs,
  db,
  getFirestore
}