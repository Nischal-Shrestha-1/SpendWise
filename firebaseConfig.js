import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getDatabase } from "firebase/database";

const firebaseConfig = {
  apiKey: "AIzaSyDJIx_xd7N4vG47JYOlSQyYgHUSPGh-_CE",
  authDomain: "info-6132-final-project.firebaseapp.com",
  databaseURL: "https://info-6132-final-project-default-rtdb.firebaseio.com",
  projectId: "info-6132-final-project",
  storageBucket: "info-6132-final-project.firebasestorage.app",
  messagingSenderId: "548394266320",
  appId: "1:548394266320:web:e8f43fb7ebd3355a00b8d5",
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getDatabase(app);
