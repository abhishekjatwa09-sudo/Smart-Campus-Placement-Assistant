import { initializeApp } from "https://www.gstatic.com/firebasejs/12.7.0/firebase-app.js";

import { getAuth } from "https://www.gstatic.com/firebasejs/12.7.0/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/12.7.0/firebase-firestore.js";

const firebaseConfig = {
    apiKey: "AIzaSyBPH1joBRovMM-l-6zGzEmiOMt5vRlkVEc",
    authDomain: "smartprep-2a098.firebaseapp.com",
    projectId: "smartprep-2a098",
    storageBucket: "smartprep-2a098.firebasestorage.app",
    messagingSenderId: "548393083533",
    appId: "1:548393083533:web:48a4c21db936e70705b8c4",
    measurementId: "G-4NNMQTR55L"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);