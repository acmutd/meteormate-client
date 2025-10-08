// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// import { getAnalytics } from "firebase/analytics";
import {getAuth} from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDBEkfjCgq8RW0QpysMCHsvLEZG1j9u7UY",
  authDomain: "meteormate.firebaseapp.com",
  projectId: "meteormate",
  storageBucket: "meteormate.firebasestorage.app",
  messagingSenderId: "820347775552",
  appId: "1:820347775552:web:f7fd26c7556d74e8b80da5",
  measurementId: "G-KQ9CKSCQKT"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
// const analytics = getAnalytics(app);
const auth = getAuth(app)

export {app, auth};