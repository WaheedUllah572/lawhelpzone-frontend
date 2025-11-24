import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getAnalytics } from "firebase/analytics";

const firebaseConfig = {
  apiKey: "AIzaSyDRjkAD-fGKNZXinr5aFeSGpe3BBdw2mCc",
  authDomain: "lawhelpzone-fc2f3.firebaseapp.com",
  projectId: "lawhelpzone-fc2f3",
  storageBucket: "lawhelpzone-fc2f3.appspot.com",
  messagingSenderId: "846504473251",
  appId: "1:846504473251:web:9b080ce92c202cb4e80516",
  measurementId: "G-R2DYW54TVS",
};

const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const auth = getAuth(app);
const googleProvider = new GoogleAuthProvider();

export { app, auth, analytics, googleProvider };
