// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBfFKWfwQW3UTMogj5abdDzOiN-Mqly-jI",
  authDomain: "grocery-app-1287d.firebaseapp.com",
  projectId: "grocery-app-1287d",
  storageBucket: "grocery-app-1287d.appspot.com",
  messagingSenderId: "410935277993",
  appId: "1:410935277993:web:324af89289181cba922cb8",
  measurementId: "G-2HY4RRKR3M"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const firestore = getFirestore(app);

export { firestore };