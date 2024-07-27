// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getStorage } from "firebase/storage";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAGNlfMqCEiGwp4Pg7d9D6tQ9Lzyb25uJE",
  authDomain: "upload-file-85375.firebaseapp.com",
  projectId: "upload-file-85375",
  storageBucket: "upload-file-85375.appspot.com",
  messagingSenderId: "384811253542",
  appId: "1:384811253542:web:323d2fae93085dca044be7",
  measurementId: "G-PB0NM67V26"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
export const storage = getStorage(app);