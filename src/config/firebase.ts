// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDEabRNDA2W8uifftkLbfnKZAfgqoyZEJc",
  authDomain: "react-course-b4608.firebaseapp.com",
  projectId: "react-course-b4608",
  storageBucket: "react-course-b4608.appspot.com",
  messagingSenderId: "1076117095019",
  appId: "1:1076117095019:web:f1b54afae80dbcc900a72e",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const provider = new GoogleAuthProvider();
export const db = getFirestore(app);
