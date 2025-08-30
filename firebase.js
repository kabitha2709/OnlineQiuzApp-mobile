import { initializeApp } from "firebase/app";
import {getFirestore} from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyCcAPsf6A91_OvqB7hemyklrbC9G-jHBPA",
  authDomain: "onlinequizapp-76cbe.firebaseapp.com",
  projectId: "onlinequizapp-76cbe",
  storageBucket: "onlinequizapp-76cbe.firebasestorage.app",
  messagingSenderId: "760612531709",
  appId: "1:760612531709:web:3c00c2b233bf8e06a23d94",
  measurementId: "G-EMNC8MDGVP"
};

const app = initializeApp(firebaseConfig);
const db =getFirestore(app);

export default app;
export{db};
